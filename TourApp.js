import React, { useState } from 'react';
import { Environment, View, asset, VrButton, Text, StyleSheet } from 'react-360';

const scenes = {
    livingRoom: 'living-room.jpg',
    kitchen: 'kitchen.jpg',
    bedroom: 'bedroom.jpg'
};

import { NativeModules } from 'react-360';

const { AudioModule } = NativeModules;

const zoomIn = () => {
    AudioModule.playEnvironmental({ source: asset('zoom-in.mp3'), volume: 1 });
    // Implement zoom logic
};

const zoomOut = () => {
    AudioModule.playEnvironmental({ source: asset('zoom-out.mp3'), volume: 1 });
    // Implement zoom logic
};

import MiniMap from './MiniMap';

const TourApp = () => {
    const [currentScene, setCurrentScene] = useState(scenes.livingRoom);

    useEffect(() => {
        Environment.setBackgroundImage(asset(currentScene.image));
        AudioModule.playEnvironmental({ source: asset(currentScene.audio), volume: 1 });
    }, [currentScene]);

    return (
        <View>
            <MiniMap onSceneChange={(scene) => setCurrentScene(scenes[scene])} />
        </View>
    );
};

const TourApp = () => {
    const [currentScene, setCurrentScene] = useState(scenes.livingRoom);

    const changeScene = (scene) => {
        Environment.setBackgroundImage(asset(scene));
    };

    return (
        <View>
            <VrButton style={styles.button} onClick={() => changeScene(scenes.kitchen)}>
                <Text style={styles.buttonText}>Go to Kitchen</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => changeScene(scenes.bedroom)}>
                <Text style={styles.buttonText}>Go to Bedroom</Text>
            </VrButton>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
    }
});

export default TourApp;