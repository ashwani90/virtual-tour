const storeUserEmotion = async (userId, emotion) => {
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


const getUserEmotionalHistory = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "neutral";

    return userDoc.data().emotionHistory || [];
};

const syncUserEmotionAcrossDevices = async (userId, emotion) => {
    await storeUserEmotion(userId, emotion);
    return `Your emotional trends are now synced across devices.`;
};

const generateMultiDeviceAIResponse = async (userId, currentEmotion) => {
    const emotionHistory = await getUserEmotionalHistory(userId);
    
    const emotionCounts = emotionHistory.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
    }, {});

    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
        emotionCounts[a] > emotionCounts[b] ? a : b
    );

    return `You seem ${currentEmotion} now, but your most common emotion has been ${dominantEmotion}. Would you like to talk about it?`;
};


