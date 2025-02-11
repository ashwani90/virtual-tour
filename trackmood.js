const trackMoodImprovement = async (userId, message) => {
    const mood = analyzeSentiment(message);
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let userData = userDoc.exists() ? userDoc.data() : { moods: [], moodBoosters: [] };

    if (userData.moods.length > 1 && userData.moods.slice(-2)[0] === "negative" && mood === "positive") {
        userData.moodBoosters.push(message); // Save what made the user happy
    }

    userData.moods.push(mood);
    if (userData.moods.length > 10) userData.moods.shift();

    await updateDoc(userRef, {
        moods: userData.moods,
        moodBoosters: userData.moodBoosters,
    });
};


const suggestMoodImprovement = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return "I'm here for you. Want to talk about something positive?";

    const userData = userDoc.data();
    const moodHistory = userData.moods || [];
    const moodBoosters = userData.moodBoosters || [];

    if (moodHistory.slice(-1)[0] === "negative" && moodBoosters.length > 0) {
        return `Last time, doing "${moodBoosters.slice(-1)[0]}" helped you feel better. Want to try it again?`;
    }

    return "I’m here to help. Do you want to talk about something uplifting?";
};


import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs";

const loadFaceModel = async () => {
    return await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
};

const detectFacialEmotion = async (videoElement) => {
    const model = await loadFaceModel();
    const predictions = await model.estimateFaces({ input: videoElement });

    if (predictions.length > 0) {
        const emotions = analyzeFacialData(predictions[0]);
        return emotions; // Example: "happy", "sad", "neutral"
    }

    return "neutral";
};


const generateFacialEmotionResponse = async (userId, videoElement) => {
    const facialEmotion = await detectFacialEmotion(videoElement);

    if (facialEmotion === "happy") {
        return "You seem excited! Let's explore something fun!";
    } else if (facialEmotion === "sad") {
        return await suggestMoodImprovement(userId);
    } else {
        return "Tell me what’s on your mind!";
    }
};


