const detectEmotion = async (text) => {
    const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            prompt: `Analyze the sentiment of this text and return one word: happy, sad, surprised, neutral, angry: "${text}"`,
            max_tokens: 5
        })
    });

    const data = await res.json();
    return data.choices[0].text.trim();
};


const AICharacter = () => {
    const [expression, setExpression] = useState("neutral");

    const askAI = async (question) => {
        const response = await getAIResponse(question);
        const emotion = await detectEmotion(response);
        setExpression(emotion); // Change expression dynamically
        speakResponse(response);
    };

    return (
        <View>
            <Entity
                source={{ gltf2: asset("ai_character.glb") }}
                style={{
                    transform: [{ scale: 0.5 }],
                    animation: `FacialExpression_${expression}`
                }}
            />
            <Text>{response}</Text>
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

