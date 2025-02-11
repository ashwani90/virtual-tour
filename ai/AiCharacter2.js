import React, { useState, useEffect } from "react";
import { View, Text, VrButton } from "react-360";
import Entity from "react-360-web";

const AICharacter = () => {
    const [response, setResponse] = useState("Hello! How can I assist you?");
    const [phonemes, setPhonemes] = useState([]);

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
        fetchPhonemeData(data.choices[0].text.trim());
    };

    const fetchPhonemeData = async (text) => {
        const res = await fetch("https://api.example.com/lip-sync", { // Replace with your phoneme API
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text }),
        });

        const phonemeData = await res.json();
        setPhonemes(phonemeData.phonemes);
        playSpeech(text);
    };

    const playSpeech = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    };

    return (
        <View>
            <Entity
                source={{ gltf2: asset("ai_character.glb") }}
                style={{
                    transform: [{ scale: 0.5 }],
                    animation: phonemes.length ? `LipSyncAnimation ${phonemes.length / 10}s` : "Idle",
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


