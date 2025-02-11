import { useEffect } from 'react';

const handleVoiceCommand = (command) => {
    switch (command.toLowerCase()) {
        case 'go to kitchen':
            teleportUser('kitchen');
            break;
        case 'go to bedroom':
            teleportUser('bedroom');
            break;
        case 'inspect chair':
            inspectObject('chair');
            break;
        default:
            console.log('Command not recognized:', command);
    }
};

const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        handleVoiceCommand(transcript);
    };
    recognition.start();
};

useEffect(() => {
    startVoiceRecognition();
}, []);
