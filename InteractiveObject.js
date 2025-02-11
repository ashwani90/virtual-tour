import React, { useState } from 'react';
import { View, VrButton, Animated, asset } from 'react-360';
import Entity from 'react-360';

const InteractiveObject = ({ objFile, mtlFile, position }) => {
    const [zoomed, setZoomed] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(1));

    const toggleZoom = () => {
        Animated.timing(scaleAnim, {
            toValue: zoomed ? 1 : 2, // Zoom in to 2x size
            duration: 500,
            useNativeDriver: true,
        }).start();
        setZoomed(!zoomed);
    };

    return (
        <View>
            <VrButton onClick={toggleZoom}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Entity source={{ obj: asset(objFile), mtl: asset(mtlFile) }} style={{ position: 'absolute', left: position[0], top: position[1] }} />
                </Animated.View>
            </VrButton>
        </View>
    );
};

export default InteractiveObject;
