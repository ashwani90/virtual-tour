const saveFacialEmotion = async (userId, videoElement) => {
    const facialEmotion = await detectFacialEmotion(videoElement);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { facialEmotions: [] };

    userData.facialEmotions.push(facialEmotion);
    if (userData.facialEmotions.length > 10) userData.facialEmotions.shift(); // Keep recent emotions

    await updateDoc(userRef, {
        facialEmotions: userData.facialEmotions,
    });
};

const generateEmotionAwareResponse = async (userId, userMessage, videoElement) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "I’m here to listen. How are you feeling today?";

    const userData = userDoc.data();
    const facialEmotion = await detectFacialEmotion(videoElement);
    const moodHistory = userData.moods || [];
    const facialEmotions = userData.facialEmotions || [];

    const dominantMood = moodHistory.slice(-1)[0] || "neutral";
    const dominantFacialEmotion = facialEmotions.slice(-1)[0] || "neutral";

    if (dominantFacialEmotion === "sad" || dominantMood === "negative") {
        return await suggestMoodImprovement(userId);
    } else if (dominantFacialEmotion === "happy" || dominantMood === "positive") {
        return "You seem in a great mood! Let’s explore something exciting!";
    } else {
        return "Tell me more, I’d love to hear what’s on your mind!";
    }
};


const startVoiceRecording = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
        const voiceText = event.results[0][0].transcript;
        const voiceEmotion = await analyzeVoiceTone(voiceText);
        console.log("Detected Voice Emotion:", voiceEmotion);
    };

    recognition.start();
};


const generateVoiceAwareResponse = async (userId, userMessage, videoElement) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "I’m listening. How are you feeling today?";

    const userData = userDoc.data();
    const facialEmotion = await detectFacialEmotion(videoElement);
    const voiceEmotion = await analyzeVoiceTone(userMessage);
    const dominantEmotion = voiceEmotion || facialEmotion || "neutral";

    if (dominantEmotion === "sad") {
        return await suggestMoodImprovement(userId);
    } else if (dominantEmotion === "happy") {
        return "You sound excited! Let’s explore something fun!";
    } else {
        return "Tell me more, I’m here to listen!";
    }
};


