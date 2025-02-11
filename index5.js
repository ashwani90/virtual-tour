import { Hands } from "@mediapipe/hands";

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults((results) => {
    results.multiHandLandmarks.forEach((landmarks) => {
        if (isPinchGesture(landmarks)) {
            console.log("Pinch detected! Picking up object...");
            grabObject();
        } else if (isSwipeGesture(landmarks)) {
            console.log("Swipe detected! Moving user...");
            teleportUser("nextLocation");
        }
    });
});

function isPinchGesture(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    return Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y) < 0.05;
}

function isSwipeGesture(landmarks) {
    return landmarks[0].x < 0.2; // Example condition for a leftward swipe
}
