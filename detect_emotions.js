const detectUserEmotion = async (message) => {
    const res = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            prompt: `Analyze this text and classify the user's emotion as one of the following: happy, sad, excited, angry, neutral. Text: "${message}"`,
            max_tokens: 10
        })
    });

    const data = await res.json();
    return data.choices[0].text.trim();
};


const getAIResponse = async (question) => {
    conversationHistory.push({ role: "user", content: question });

    const userEmotion = await detectUserEmotion(question);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are a virtual tour guide. The user is feeling ${userEmotion}. Adjust your response tone accordingly.` },
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


const generateSpeech = async (text, emotion) => {
    let voiceStyle = "neutral";
    if (emotion === "happy") voiceStyle = "cheerful";
    if (emotion === "sad") voiceStyle = "calm";
    if (emotion === "angry") voiceStyle = "serious";

    const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": "YOUR_ELEVENLABS_API_KEY"
        },
        body: JSON.stringify({
            text: text,
            voice: "your-selected-voice",
            style: voiceStyle
        })
    });

    const audioBlob = await res.blob();
    return URL.createObjectURL(audioBlob);
};


const askAI = async (question) => {
    const response = await getAIResponse(question);
    const userEmotion = await detectUserEmotion(question);
    const voiceURL = await generateSpeech(response, userEmotion);

    setConversation([...conversation, { user: question, ai: response, audio: voiceURL }]);
};

<VrButton onClick={() => askAI("Tell me about this place")}>
    <Text>Ask AI Guide</Text>
</VrButton>

{conversation.map((chat, index) => (
    <View key={index}>
        <Text>User: {chat.user}</Text>
        <Text>AI: {chat.ai}</Text>
        {chat.audio && <audio controls src={chat.audio}></audio>}
    </View>
))}


