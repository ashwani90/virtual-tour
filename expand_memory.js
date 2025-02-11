const updateUserInterests = async (userId, newInterest) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { interests: {} };

    // Increment interest count or add a new one
    userData.interests[newInterest] = (userData.interests[newInterest] || 0) + 1;

    await updateDoc(userRef, {
        interests: userData.interests,
    });
};


const decayOldInterests = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    let userData = userDoc.data();
    let interests = userData.interests || {};

    // Reduce priority of older interests
    Object.keys(interests).forEach((interest) => {
        interests[interest] *= 0.9; // Reduce weight over time
        if (interests[interest] < 0.1) delete interests[interest]; // Remove very low-weight interests
    });

    await updateDoc(userRef, {
        interests: interests,
    });
};


const generateInterestBasedResponse = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "Tell me more about what excites you!";

    const interests = userDoc.data().interests || {};
    const sortedInterests = Object.keys(interests).sort((a, b) => interests[b] - interests[a]);

    if (sortedInterests.length > 0) {
        return `I see you’ve been interested in ${sortedInterests[0]} recently! Want to explore more about it?`;
    }

    return "I’d love to know more about what you enjoy!";
};


const detectInterestShift = async (userId, newTopic) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const interests = userDoc.data().interests || {};
    const topInterests = Object.keys(interests).sort((a, b) => interests[b] - interests[a]);

    return !topInterests.includes(newTopic);
};

const generateAdaptiveSuggestions = async (userId, newTopic) => {
    const interestShift = await detectInterestShift(userId, newTopic);

    if (interestShift) {
        return `I see you’re exploring ${newTopic}! Want some recommendations related to this?`;
    }

    return `Let’s continue with what you enjoy most!`;
};

