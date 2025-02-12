import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const saveUserInteraction = async (userId, interaction) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    let userData = userDoc.exists() ? userDoc.data() : { interactions: [] };

    const newInteraction = {
        text: interaction,
        timestamp: new Date().toISOString(),
    };

    await updateDoc(userRef, {
        interactions: arrayUnion(newInteraction),
    });
};


const getUserMemory = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    return userDoc.exists() ? userDoc.data().interactions : [];
};

const categorizeInteractions = async (userId) => {
    const history = await getUserMemory(userId);
    
    let topics = {};
    history.forEach((interaction) => {
        const words = interaction.text.split(" ");
        words.forEach((word) => {
            if (!topics[word]) {
                topics[word] = 0;
            }
            topics[word] += 1;
        });
    });

    return Object.entries(topics).sort((a, b) => b[1] - a[1]); // Sort by most frequent words
};


const generateAdaptiveResponse = async (userId, baseResponse) => {
    const topTopics = await categorizeInteractions(userId);
    
    if (topTopics.length > 0) {
        return `${baseResponse} I noticed you often ask about ${topTopics[0][0]}. Would you like a deeper explanation?`;
    }

    return baseResponse;
};


