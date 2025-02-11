const getPhonemes = async (text) => {
    const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": "YOUR_ELEVENLABS_API_KEY"
        },
        body: JSON.stringify({
            text: text,
            voice: "your-selected-voice",
            output_format: "json"  // Ensures phoneme data is included
        })
    });

    const data = await res.json();
    return data.phonemes;  // Returns phoneme timing data
};


const animateLipSync = (phonemes, model) => {
    const phonemeToBlendShape = {
        "AA": "OpenMouth",
        "EE": "Smile",
        "OH": "RoundMouth",
        "MM": "ClosedMouth"
    };

    phonemes.forEach((phoneme) => {
        const blendShape = phonemeToBlendShape[phoneme.symbol];
        if (blendShape && model) {
            model.traverse((child) => {
                if (child.isMesh && child.morphTargetDictionary) {
                    const shapeIndex = child.morphTargetDictionary[blendShape];
                    if (shapeIndex !== undefined) {
                        child.morphTargetInfluences[shapeIndex] = phoneme.intensity;
                    }
                }
            });
        }
    });
};


const [selectedVoice, setSelectedVoice] = useState("default-voice");

const voices = [
    { name: "Narrator", id: "default-voice" },
    { name: "Friendly Guide", id: "friendly-voice" },
    { name: "Professional", id: "formal-voice" }
];

return (
    <View>
        <Text>Select AI Voice:</Text>
        {voices.map((voice) => (
            <VrButton key={voice.id} onClick={() => setSelectedVoice(voice.id)}>
                <Text>{voice.name}</Text>
            </VrButton>
        ))}
    </View>
);


const generateSpeech = async (text, voiceId) => {
    const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": "YOUR_ELEVENLABS_API_KEY"
        },
        body: JSON.stringify({
            text: text,
            voice: voiceId
        })
    });

    const audioBlob = await res.blob();
    return URL.createObjectURL(audioBlob);
};


const [appearance, setAppearance] = useState({
    outfit: "casual",
    hairColor: "black",
    skinTone: "light"
});

const updateAppearance = (property, value) => {
    setAppearance((prev) => ({ ...prev, [property]: value }));
};

return (
    <View>
        <Text>Customize AI Guide:</Text>
        <VrButton onClick={() => updateAppearance("outfit", "formal")}>
            <Text>Formal Outfit</Text>
        </VrButton>
        <VrButton onClick={() => updateAppearance("hairColor", "blonde")}>
            <Text>Blonde Hair</Text>
        </VrButton>
    </View>
);


const applyCustomAppearance = (model, appearance) => {
    model.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("Hair")) {
                child.material.color.set(appearance.hairColor);
            }
            if (child.name.includes("Outfit")) {
                child.material.color.set(appearance.outfit === "formal" ? "black" : "blue");
            }
        }
    });
};

