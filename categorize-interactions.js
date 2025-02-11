const generateAdaptiveResponse = async (userId, baseResponse) => {
    const topTopics = await categorizeInteractions(userId);
    
    if (topTopics.length > 0) {
        return `${baseResponse} I noticed you often ask about ${topTopics[0][0]}. Would you like a deeper explanation?`;
    }

    return baseResponse;
};


const adjustAIPersonality = async (userId) => {
    const themes = await trackUserThemes(userId);

    if (themes.length > 0) {
        return `Based on your interests in ${themes[0][0]}, I've started focusing more on this topic in our conversations.`;
    }

    return "I’m still learning about your interests. Keep interacting to personalize my responses!";
};


import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

const generateGPTResponse = async (userId, userMessage) => {
    const themes = await trackUserThemes(userId); // Get user interests

    const prompt = `User is interested in ${themes[0][0]}. Reply in a way that adapts to their interests: ${userMessage}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: "You are a helpful AI guide." }, { role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
};


import nlp from "compromise";

const analyzeSentiment = (message) => {
    const doc = nlp(message);
    if (doc.has("#Negative")) return "negative";
    if (doc.has("#Positive")) return "positive";
    return "neutral";
};


const generateEmotionBasedResponse = async (userMessage) => {
    const sentiment = analyzeSentiment(userMessage);
    let response;

    if (sentiment === "positive") {
        response = "I'm glad to hear that! 😊 What else would you like to explore?";
    } else if (sentiment === "negative") {
        response = "I'm here to help! Let me know if there's anything I can do to make things better.";
    } else {
        response = "Got it! Let me know what you're interested in next.";
    }

    return response;
};


const saveUserInteraction = async (userId, message) => {
    const sentiment = analyzeSentiment(message);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { interactions: [] };

    const newInteraction = {
        text: message,
        emotion: sentiment,
        timestamp: new Date().toISOString(),
    };

    await updateDoc(userRef, {
        interactions: arrayUnion(newInteraction),
    });
};


const generatePersonalizedResponse = async (userId, userMessage) => {
    const history = await getUserMemory(userId);
    
    if (history.length > 0) {
        const lastEmotion = history.slice(-1)[0].emotion;
        const baseResponse = `Last time, you seemed ${lastEmotion}. Is everything going well today?`;

        return generateEmotionBasedResponse(userMessage) + " " + baseResponse;
    }

    return generateEmotionBasedResponse(userMessage);
};


import { doc, setDoc, getDoc } from "firebase/firestore";

const getOrCreateUserId = async (username) => {
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, { interactions: [] });
    }

    return username;
};


const getLastInteraction = async (userId) => {
    const history = await getUserMemory(userId);
    return history.length > 0 ? history.slice(-1)[0] : null;
};

const generateFollowUpResponse = async (userId, userMessage) => {
    const lastInteraction = await getLastInteraction(userId);

    if (lastInteraction) {
        return `Last time, we discussed "${lastInteraction.text}". Would you like to continue that topic, or explore something new?`;
    }

    return generatePersonalizedResponse(userId, userMessage);
};

