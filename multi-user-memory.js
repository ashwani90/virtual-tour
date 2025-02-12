const getUserID = () => {
    let userID = localStorage.getItem("userID");
    if (!userID) {
        userID = "user_" + Math.random().toString(36).substring(7);
        localStorage.setItem("userID", userID);
    }
    return userID;
};

const saveConversationHistory = (history) => {
    const userID = getUserID();
    localStorage.setItem(`conversationHistory_${userID}`, JSON.stringify(history));
};

const loadConversationHistory = () => {
    const userID = getUserID();
    const history = localStorage.getItem(`conversationHistory_${userID}`);
    return history ? JSON.parse(history) : [];
};


const extractUserInterests = (history) => {
    const topics = history
        .filter((msg) => msg.role === "user")
        .map((msg) => msg.content)
        .join(" ");

    return fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            prompt: `Extract main topics of interest from this text: "${topics}"`,
            max_tokens: 20
        })
    })
        .then((res) => res.json())
        .then((data) => data.choices[0].text.trim());
};


const getAIResponse = async (question) => {
    conversationHistory.push({ role: "user", content: question });

    const userInterests = await extractUserInterests(conversationHistory);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are a virtual tour guide. The user is interested in ${userInterests}. Make your responses relevant to these topics.` },
                ...conversationHistory
            ],
            max_tokens: 100
        })
    });

    const data = await res.json();
    const response = data.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: response });
    saveConversationHistory(conversationHistory);
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
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};

