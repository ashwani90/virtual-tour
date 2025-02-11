import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const saveUserInteractionToCloud = async (userId, message) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { interactions: [] };

    const newInteraction = {
        text: message,
        timestamp: new Date().toISOString(),
    };

    await updateDoc(userRef, {
        interactions: arrayUnion(newInteraction),
    });
};

const getUserMemoryFromCloud = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().interactions : [];
};

const trackUserPreferences = async (userId, message) => {
    const topic = identifyTopic(message); // A function to analyze text and find main topics
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { preferences: {} };

    if (!userData.preferences[topic]) {
        userData.preferences[topic] = 1;
    } else {
        userData.preferences[topic] += 1;
    }

    await updateDoc(userRef, {
        preferences: userData.preferences,
    });
};

const generateInterestBasedResponse = async (userId, userMessage) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return "Let's start exploring! What interests you today?";

    const userData = userDoc.data();
    const topInterest = Object.entries(userData.preferences || {}).sort((a, b) => b[1] - a[1]);

    if (topInterest.length > 0) {
        return `Since you're interested in ${topInterest[0][0]}, I found something new related to that! Want to check it out?`;
    }

    return "Tell me more about what interests you!";
};

const updateUserInterests = async (userId, message) => {
    const topic = identifyTopic(message); // Extracts the main topic from the message
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { preferences: {} };

    // Apply decay to older interests
    for (let key in userData.preferences) {
        userData.preferences[key] *= 0.9; // Reduce old interest weight
    }

    // Increase weight for the new topic
    userData.preferences[topic] = (userData.preferences[topic] || 0) + 1.0;

    await updateDoc(userRef, {
        preferences: userData.preferences,
    });
};


const generateDynamicInterestResponse = async (userId, userMessage) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "What would you like to explore today?";

    const userData = userDoc.data();
    const sortedInterests = Object.entries(userData.preferences || {}).sort((a, b) => b[1] - a[1]);

    if (sortedInterests.length > 0) {
        return `Lately, you've been interested in ${sortedInterests[0][0]}. Want to explore more related to it?`;
    }

    return "Tell me more about what interests you today!";
};


const saveUserMood = async (userId, message) => {
    const mood = analyzeSentiment(message); // Uses sentiment analysis
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { moods: [] };

    // Store last 10 mood entries
    userData.moods.push(mood);
    if (userData.moods.length > 10) userData.moods.shift(); // Keep recent moods

    await updateDoc(userRef, {
        moods: userData.moods,
    });
};


const generateMoodAdaptiveResponse = async (userId, userMessage) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "How are you feeling today?";

    const userData = userDoc.data();
    const moodHistory = userData.moods || [];
    
    if (moodHistory.length === 0) return "Tell me how you're feeling today!";

    // Calculate mood trends
    const moodCounts = { positive: 0, neutral: 0, negative: 0 };
    moodHistory.forEach(mood => moodCounts[mood]++);
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);

    if (dominantMood === "positive") {
        return "You seem to be in a great mood lately! Want to discover something exciting?";
    } else if (dominantMood === "negative") {
        return "It looks like you've been feeling down. Is there anything I can do to help?";
    } else {
        return "You've been neutral lately. Let's explore something new together!";
    }
};


