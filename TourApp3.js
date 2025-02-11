import React, { useState, useEffect } from 'react';
import { Environment, View, asset, Animated, VrButton, Text, StyleSheet, NativeModules } from 'react-360';

const { AudioModule } = NativeModules;

const scenes = {
    livingRoom: { image: 'living-room.jpg', audio: 'living-room.mp3' },
    kitchen: { image: 'kitchen.jpg', audio: 'kitchen.mp3' },
    bedroom: { image: 'bedroom.jpg', audio: 'bedroom.mp3' }
};

const TourApp = () => {
    const [currentScene, setCurrentScene] = useState(scenes.livingRoom);
    const [fadeAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            Environment.setBackgroundImage(asset(currentScene.image));
            AudioModule.playEnvironmental({ source: asset(currentScene.audio), volume: 1 });
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    }, [currentScene]);

    return (
        <View>
            <Animated.View style={[styles.fadeOverlay, { opacity: fadeAnim }]} />
            <VrButton style={styles.button} onClick={() => setCurrentScene(scenes.kitchen)}>
                <Text style={styles.buttonText}>Go to Kitchen</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => setCurrentScene(scenes.bedroom)}>
                <Text style={styles.buttonText}>Go to Bedroom</Text>
            </VrButton>
        </View>
    );
};

const styles = StyleSheet.create({
    fadeOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
    },
});

export default TourApp;
