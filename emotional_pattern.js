const trackLongTermEmotions = async (userId, detectedEmotion) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { emotionHistory: [] };

    userData.emotionHistory.push({ emotion: detectedEmotion, timestamp: Date.now() });

    // Keep only recent 50 entries for efficient tracking
    if (userData.emotionHistory.length > 50) userData.emotionHistory.shift();

    await updateDoc(userRef, {
        emotionHistory: userData.emotionHistory,
    });
};


const analyzeEmotionalPatterns = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "I’m here to help! How are you feeling today?";

    const emotionHistory = userDoc.data().emotionHistory || [];
    const lastEmotions = emotionHistory.slice(-10).map(entry => entry.emotion);

    // Check if sadness or stress appears frequently
    const sadnessCount = lastEmotions.filter(e => e === "sad").length;

    if (sadnessCount >= 5) {
        return "I've noticed you’ve been feeling down recently. Would you like to talk about it?";
    } else {
        return "Tell me what’s on your mind!";
    }
};


const trackSuccessfulActivities = async (userId, activity) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { moodBoosters: [] };

    userData.moodBoosters.push({ activity, timestamp: Date.now() });

    await updateDoc(userRef, {
        moodBoosters: userData.moodBoosters,
    });
};


const suggestMoodBoostingActivity = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "I'm here for you. Want to talk about something positive?";

    const userData = userDoc.data();
    const moodBoosters = userData.moodBoosters || [];

    if (moodBoosters.length > 0) {
        return `Last time, doing "${moodBoosters.slice(-1)[0].activity}" helped you feel better. Want to try it again?`;
    }

    return "I’m here to help. Would you like to explore something uplifting?";
};


const generatePersonalizedSuggestion = async (userId, videoElement) => {
    const facialEmotion = await detectFacialEmotion(videoElement);
    const voiceEmotion = await analyzeVoiceTone("..."); // Capture real-time voice tone
    const emotionTrend = await analyzeEmotionalPatterns(userId);

    if (facialEmotion === "sad" || voiceEmotion === "sad") {
        return await suggestMoodBoostingActivity(userId);
    } else if (emotionTrend.includes("frequent sadness")) {
        return "I’ve noticed you’ve been feeling down lately. Maybe trying an activity you previously enjoyed could help!";
    } else {
        return "What’s on your mind? I’d love to hear more!";
    }
};


