const processVoiceCommand = async (command) => {
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            prompt: `Interpret this command for a VR tour: "${command}"`,
            max_tokens: 50
        })
    });

    const data = await response.json();
    const aiCommand = data.choices[0].text.trim();

    if (aiCommand.includes("move to")) {
        const location = aiCommand.replace("move to", "").trim();
        teleportUser(location);
    } else if (aiCommand.includes("describe")) {
        const object = aiCommand.replace("describe", "").trim();
        describeObject(object);
    } else {
        console.log("Command not recognized:", aiCommand);
    }
};

const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        processVoiceCommand(transcript);
    };
    recognition.start();
};

useEffect(() => {
    startVoiceRecognition();
}, []);


import AICharacter from "./AICharacter";

const TourApp = () => {
    return (
        <View>
            <AICharacter />
        </View>
    );
};


import React, { useState } from "react";
import AICharacter from "./AICharacter";
import Settings from "./Settings";

const TourApp = () => {
    const [voice, setVoice] = useState("en-US-John");
    const [avatar, setAvatar] = useState("ai_character1.glb");

    return (
        <View>
            <Settings onUpdate={(newVoice, newAvatar) => {
                setVoice(newVoice);
                setAvatar(newAvatar);
            }} />
            <AICharacter voice={voice} avatar={avatar} />
        </View>
    );
};

export default TourApp;

