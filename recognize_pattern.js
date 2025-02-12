const generateMoodBasedSuggestions = async (userId, videoElement) => {
    const facialEmotion = await detectFacialEmotion(videoElement);
    const voiceEmotion = await analyzeVoiceTone("...");
    const dominantEmotion = facialEmotion || voiceEmotion;

    return await getMoodImprovementSuggestions(userId, dominantEmotion);
};


const logUserEmotion = async (userId, emotion) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { emotionHistory: [] };

    userData.emotionHistory.push({
        emotion: emotion,
        timestamp: Date.now(),
    });

    if (userData.emotionHistory.length > 50) {
        userData.emotionHistory.shift(); // Keep history manageable
    }

    await updateDoc(userRef, {
        emotionHistory: userData.emotionHistory,
    });
};


const detectEmotionalTrends = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return null;

    const emotionHistory = userDoc.data().emotionHistory || [];
    const recentEmotions = emotionHistory.slice(-10).map(entry => entry.emotion);

    const emotionCounts = recentEmotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
    }, {});

    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
        emotionCounts[a] > emotionCounts[b] ? a : b
    );

    return dominantEmotion;
};


const analyzeUserEmotion = async (videoElement, audioInput) => {
    const facialEmotion = await detectFacialEmotion(videoElement);
    const voiceEmotion = await analyzeVoiceTone(audioInput);

    if (facialEmotion === voiceEmotion) {
        return facialEmotion; // Confirmed emotional state
    }

    return facialEmotion || voiceEmotion || "neutral"; // Use the most reliable input
};


const generateAdaptiveAIResponse = async (userId, videoElement, audioInput) => {
    const detectedEmotion = await analyzeUserEmotion(videoElement, audioInput);
    const emotionalTrend = await detectEmotionalTrends(userId);

    if (detectedEmotion === emotionalTrend) {
        return `I’ve noticed you’ve been feeling ${detectedEmotion} often. Want to talk about it?`;
    } else {
        return `You seem ${detectedEmotion} now, but recently you’ve felt more ${emotionalTrend}. Anything on your mind?`;
    }
};

