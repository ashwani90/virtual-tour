const storeEmotionalTrend = async (userId, emotion) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { emotionHistory: [] };

    userData.emotionHistory.push({
        emotion: emotion,
        timestamp: Date.now(),
    });

    if (userData.emotionHistory.length > 100) {
        userData.emotionHistory.shift(); // Keep history manageable
    }

    await updateDoc(userRef, {
        emotionHistory: userData.emotionHistory,
    });
};


const getPastEmotionalTrends = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "neutral";

    const emotionHistory = userDoc.data().emotionHistory || [];
    const emotionCounts = emotionHistory.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
    }, {});

    const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) =>
        emotionCounts[a] > emotionCounts[b] ? a : b
    );

    return mostCommonEmotion;
};


const syncEmotionalMemory = async (userId, emotion) => {
    await storeEmotionalTrend(userId, emotion);
    return `Your emotional trends are now synced across devices.`;
};

const generatePersonalizedAIResponse = async (userId, currentEmotion) => {
    const pastEmotion = await getPastEmotionalTrends(userId);

    if (currentEmotion === pastEmotion) {
        return `I've noticed you often feel ${currentEmotion}. Would you like to try something to change that?`;
    } else {
        return `You seem ${currentEmotion} now, but in the past, you felt more ${pastEmotion}. Let me know if you’d like to talk about it.`;
    }
};

