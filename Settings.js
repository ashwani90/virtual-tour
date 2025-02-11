import React, { useState } from "react";
import { View, Text, VrButton } from "react-360";

const voices = ["en-US-John", "en-US-Emily", "en-US-Liam"];
const avatars = ["ai_character1.glb", "ai_character2.glb", "ai_character3.glb"];

const Settings = ({ onUpdate }) => {
    const [selectedVoice, setSelectedVoice] = useState(voices[0]);
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

    return (
        <View>
            <Text>Choose AI Voice:</Text>
            {voices.map((voice) => (
                <VrButton key={voice} onClick={() => setSelectedVoice(voice)}>
                    <Text>{voice}</Text>
                </VrButton>
            ))}

            <Text>Choose Avatar:</Text>
            {avatars.map((avatar) => (
                <VrButton key={avatar} onClick={() => setSelectedAvatar(avatar)}>
                    <Text>{avatar}</Text>
                </VrButton>
            ))}

            <VrButton onClick={() => onUpdate(selectedVoice, selectedAvatar)}>
                <Text>Apply Settings</Text>
            </VrButton>
        </View>
    );
};

export default Settings;


import { useEffect, useState } from "react";

const AICharacter = ({ voice, avatar }) => {
    const [response, setResponse] = useState("Hello! How can I help?");
    
    const speakResponse = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = voice;
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    };

    return (
        <View>
            <Entity source={{ gltf2: asset(avatar) }} style={{ transform: [{ scale: 0.5 }] }} />
            <Text>{response}</Text>
        </View>
    );
};


