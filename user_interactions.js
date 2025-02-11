let conversationHistory = [];

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
    return response;
};


const AICharacter = () => {
    const [conversation, setConversation] = useState([]);

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
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};


