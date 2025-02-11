import { db, doc, setDoc, getDoc } from "./firebaseConfig";

const getUserID = () => {
    let userID = localStorage.getItem("userID");
    if (!userID) {
        userID = "user_" + Math.random().toString(36).substring(7);
        localStorage.setItem("userID", userID);
    }
    return userID;
};

const saveConversationHistory = async (history) => {
    const userID = getUserID();
    await setDoc(doc(db, "conversations", userID), { history });
};

const loadConversationHistory = async () => {
    const userID = getUserID();
    const docSnap = await getDoc(doc(db, "conversations", userID));

    return docSnap.exists() ? docSnap.data().history : [];
};


const extractUserPersonality = async (history) => {
    const fullChat = history.map((msg) => msg.content).join(" ");

    const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            prompt: `Analyze this conversation and summarize the user's personality traits and interests: "${fullChat}"`,
            max_tokens: 50
        })
    });

    const data = await res.json();
    return data.choices[0].text.trim();
};


const getAIResponse = async (question) => {
    conversationHistory.push({ role: "user", content: question });

    const userPersonality = await extractUserPersonality(conversationHistory);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are a virtual tour guide. The user has the following personality traits: ${userPersonality}. Adjust your tone and responses accordingly.` },
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
    const [conversation, setConversation] = useState([]);
    const [personality, setPersonality] = useState("");

    useEffect(() => {
        loadConversationHistory().then((history) => {
            setConversation(history);
            extractUserPersonality(history).then(setPersonality);
        });
    }, []);

    const askAI = async (question) => {
        const response = await getAIResponse(question);
        setConversation([...conversation, { user: question, ai: response }]);
    };

    return (
        <View>
            <Text>User Personality: {personality}</Text>
            {conversation.map((chat, index) => (
                <Text key={index}>User: {chat.user} | AI: {chat.ai}</Text>
            ))}
            <VrButton onClick={() => askAI("Tell me about this place")}>
                <Text>Ask AI Guide</Text>
            </VrButton>
        </View>
    );
};


