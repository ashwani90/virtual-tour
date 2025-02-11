const storeUserInterest = async (userId, interest) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { interests: {} };

    userData.interests[interest] = (userData.interests[interest] || 0) + 1;

    await updateDoc(userRef, {
        interests: userData.interests,
    });
};


const getUserInterests = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return [];

    return Object.entries(userDoc.data().interests || {}).sort(
        (a, b) => b[1] - a[1]
    ).map(entry => entry[0]);
};

const generateInterestBasedResponse = async (userId, currentTopic) => {
    const interests = await getUserInterests(userId);
    
    if (interests.includes(currentTopic)) {
        return `I see you're interested in ${currentTopic}! Would you like to explore more about it?`;
    } else {
        return `You're currently exploring ${currentTopic}. You've also enjoyed topics like ${interests[0]}. Would you like to revisit them?`;
    }
};

const storeUserPreference = async (userId, preference) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { preferences: {} };

    userData.preferences[preference] = (userData.preferences[preference] || 0) + 1;

    await updateDoc(userRef, {
        preferences: userData.preferences,
    });
};


const getUserPreferences = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return [];

    return Object.entries(userDoc.data().preferences || {}).sort(
        (a, b) => b[1] - a[1]
    ).map(entry => entry[0]);
};

const generatePreferenceBasedSuggestion = async (userId) => {
    const preferences = await getUserPreferences(userId);

    if (preferences.length > 0) {
        return `Based on your past interests, you might enjoy exploring more about ${preferences[0]}. Want to check it out?`;
    } else {
        return `I’m still learning about your interests. Let’s explore some topics together!`;
    }
};

