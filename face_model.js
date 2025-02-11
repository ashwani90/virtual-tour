import * as THREE from "three";
import { Entity } from "react-360";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class AICharacter extends React.Component {
    constructor() {
        super();
        this.state = { emotion: "neutral" };
    }

    componentDidMount() {
        this.loadModel();
    }

    loadModel = () => {
        const loader = new GLTFLoader();
        loader.load("path-to-your-character.glb", (gltf) => {
            this.setState({ model: gltf.scene });
        });
    };

    setEmotion = (emotion) => {
        this.setState({ emotion });
        if (this.state.model) {
            this.animateFace(emotion);
        }
    };

    animateFace = (emotion) => {
        const { model } = this.state;
        const blendShapes = {
            happy: "Smile",
            sad: "Frown",
            angry: "Angry",
            neutral: "Neutral"
        };

        model.traverse((child) => {
            if (child.isMesh && child.morphTargetDictionary) {
                const shapeIndex = child.morphTargetDictionary[blendShapes[emotion]];
                if (shapeIndex !== undefined) {
                    child.morphTargetInfluences[shapeIndex] = 1.0;
                }
            }
        });
    };

    render() {
        return (
            <Entity source={{ gltf2: "path-to-your-character.glb" }} />
        );
    }
}


const playEmotionAnimation = (emotion) => {
    const animations = {
        happy: "HappyGesture",
        sad: "SlouchedIdle",
        angry: "AggressiveHandMotion",
        neutral: "Idle"
    };

    const animationClip = animations[emotion];
    if (model) {
        const action = mixer.clipAction(animationClip);
        action.reset().play();
    }
};


