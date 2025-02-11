const startVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition(); // For Chrome, use SpeechRecognition for other browsers
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        const emotion = await analyzeVoiceEmotion(event.results[0][0]); // Analyze tone
        askAI(transcript, emotion);
    };

    recognition.start();
};


const analyzeVoiceEmotion = async (audioData) => {
    const res = await fetch("https://api.example.com/analyze-voice-emotion", { // Replace with an actual API
        method: "POST",
        body: JSON.stringify({ audioData }),
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    return data.emotion; // Example emotions: happy, sad, angry, neutral
};


const AICharacter = () => {
    const [expression, setExpression] = useState("neutral");

    const askAI = async (question, emotion) => {
        const response = await getAIResponse(question);
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
            <VrButton onClick={startVoiceRecognition}>
                <Text>Speak to AI Guide</Text>
            </VrButton>
        </View>
    );
};


const saveConversationHistory = (history) => {
    localStorage.setItem("conversationHistory", JSON.stringify(history));
};

const loadConversationHistory = () => {
    const history = localStorage.getItem("conversationHistory");
    return history ? JSON.parse(history) : [];
};

let conversationHistory = loadConversationHistory();

const getAIResponse = async (question) => {
    conversationHistory.push({ role: "user", content: question });

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: conversationHistory,
            max_tokens: 100
        })
    });

    const data = await res.json();
    const response = data.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: response });
    saveConversationHistory(conversationHistory); // Store updated history
    return response;
};

const AICharacter = () => {
    const [conversation, setConversation] = useState(loadConversationHistory());

    const askAI = async (question) => {
        const response = await getAIResponse(question);
        setConversation([...conversation, { user: question, ai: response }]);
    };

    return (
        <View>
            <Text>Past Conversations:</Text>
            {conversation.map((chat, index) => (
                <Text key={index}>User: {chat.user} | AI: {chat.ai}</Text>
            ))}
            <VrButton onClick={startVoiceRecognition}>
                <Text>Speak to AI Guide</Text>
            </VrButton>
        </View>
    );
};

