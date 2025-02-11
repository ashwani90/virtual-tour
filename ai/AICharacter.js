import React, { useState } from "react";
import { View, Text, VrButton } from "react-360";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! How can I help you?");

    const askAI = async (question) => {
        const res = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a virtual tour guide. Respond to: "${question}"`,
                max_tokens: 100
            })
        });

        const data = await res.json();
        setResponse(data.choices[0].text.trim());
    };

    return (
        <View>
            <VrButton onClick={() => askAI("Tell me about this room")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
            <Text>{response}</Text>
        </View>
    );
};

export default AICharacter;


import React, { useState, useEffect } from "react";
import { View, Text, VrButton } from "react-360";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! Ask me anything about this place.");

    const askAI = async (question) => {
        const res = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a virtual tour guide. Respond to: "${question}"`,
                max_tokens: 100
            })
        });

        const data = await res.json();
        setResponse(data.choices[0].text.trim());
        speakResponse(data.choices[0].text.trim());
    };

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            askAI(transcript);
        };
        recognition.start();
    };

    const speakResponse = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    };

    useEffect(() => {
        startListening();
    }, []);

    return (
        <View>
            <Text>{response}</Text>
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

export default AICharacter;


import React, { useState, useEffect } from "react";
import { View, Text, VrButton } from "react-360";
import Entity from "react-360";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! How can I assist you?");
    const [emotion, setEmotion] = useState("neutral"); // Can be "happy", "surprised", etc.

    const askAI = async (question) => {
        const res = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a virtual tour guide. Respond to: "${question}"`,
                max_tokens: 100
            })
        });

        const data = await res.json();
        setResponse(data.choices[0].text.trim());
        setEmotion(determineEmotion(data.choices[0].text.trim()));
        speakResponse(data.choices[0].text.trim());
    };

    const determineEmotion = (text) => {
        if (text.includes("great") || text.includes("happy")) return "happy";
        if (text.includes("interesting") || text.includes("surprising")) return "surprised";
        return "neutral";
    };

    const speakResponse = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    };

    return (
        <View>
            <Entity
                source={{ obj: asset("ai_character.obj"), mtl: asset("ai_character.mtl") }}
                style={{
                    transform: [{ rotateY: emotion === "happy" ? 10 : emotion === "surprised" ? -10 : 0 }]
                }}
            />
            <Text>{response}</Text>
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

export default AICharacter;


import React, { useState, useEffect } from "react";
import { View, Text, VrButton } from "react-360";
import Entity from "react-360-web";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! How can I assist you?");
    const [animation, setAnimation] = useState("Idle"); // Default animation

    const askAI = async (question) => {
        const res = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a virtual tour guide. Respond to: "${question}"`,
                max_tokens: 100
            })
        });

        const data = await res.json();
        setResponse(data.choices[0].text.trim());
        setAnimation(determineAnimation(data.choices[0].text.trim())); // AI-driven animation
        speakResponse(data.choices[0].text.trim());
    };

    const determineAnimation = (text) => {
        if (text.includes("welcome") || text.includes("hello")) return "Wave";
        if (text.includes("follow me") || text.includes("next")) return "Walk";
        if (text.includes("interesting") || text.includes("amazing")) return "Excited";
        return "Idle";
    };

    return (
        <View>
            <Entity
                source={{ gltf2: asset("ai_character.glb") }}
                style={{
                    transform: [{ scale: 0.5 }, { rotateY: 180 }],
                    animation: animation,
                }}
            />
            <Text>{response}</Text>
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

export default AICharacter;


import React, { useState, useEffect } from "react";
import { View, Text, VrButton } from "react-360";
import Entity from "react-360-web";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! How can I assist you?");
    const [animation, setAnimation] = useState("Idle"); // Default animation

    const askAI = async (question) => {
        const res = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `You are a virtual tour guide. Respond to: "${question}"`,
                max_tokens: 100
            })
        });

        const data = await res.json();
        setResponse(data.choices[0].text.trim());
        setAnimation(determineAnimation(data.choices[0].text.trim())); // AI-driven animation
        speakResponse(data.choices[0].text.trim());
    };

    const determineAnimation = (text) => {
        if (text.includes("welcome") || text.includes("hello")) return "Wave";
        if (text.includes("follow me") || text.includes("next")) return "Walk";
        if (text.includes("interesting") || text.includes("amazing")) return "Excited";
        return "Idle";
    };

    return (
        <View>
            <Entity
                source={{ gltf2: asset("ai_character.glb") }}
                style={{
                    transform: [{ scale: 0.5 }, { rotateY: 180 }],
                    animation: animation,
                }}
            />
            <Text>{response}</Text>
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

export default AICharacter;


const speakResponse = async (text, emotion = "neutral") => {
    const voiceMap = {
        neutral: "en-US-John",
        happy: "en-US-James",
        sad: "en-US-Emily",
        excited: "en-US-Liam",
    };

    const selectedVoice = voiceMap[emotion] || "en-US-John";

    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": "YOUR_ELEVENLABS_API_KEY",
        },
        body: JSON.stringify({
            text: text,
            voice_id: selectedVoice,
            settings: {
                stability: 0.5,
                similarity_boost: 0.8,
            },
        }),
    });

    const audioData = await response.blob();
    const audioURL = URL.createObjectURL(audioData);
    const audio = new Audio(audioURL);
    audio.play();
};


