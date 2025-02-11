import React from 'react';
import { View, Text, StyleSheet } from 'react-360';

const Tooltip = ({ text, position }) => {
    return (
        <View style={[styles.tooltip, { left: position[0], top: position[1] }]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default Tooltip;
