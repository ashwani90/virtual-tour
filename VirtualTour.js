import React, { useState } from 'react';
import {
  View,
  Text,
  VrButton,
  Environment,
  StyleSheet,
} from 'react-360';

// Define scenes and their corresponding 360 images
const SCENES = {
  livingRoom: 'static_assets/living_room.jpg',
  kitchen: 'static_assets/kitchen.jpg',
  bedroom: 'static_assets/bedroom.jpg',
};

const VirtualTour = () => {
  const [currentScene, setCurrentScene] = useState('livingRoom');

  // Change scene when a hotspot is clicked
  const changeScene = (scene) => {
    setCurrentScene(scene);
    Environment.setBackgroundImage(SCENES[scene]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Virtual Tour</Text>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        {Object.keys(SCENES).map((scene) => (
          <VrButton key={scene} style={styles.button} onClick={() => changeScene(scene)}>
            <Text style={styles.buttonText}>{scene.replace(/([A-Z])/g, ' $1')}</Text>
          </VrButton>
        ))}
      </View>
    </View>
  );
};

// Styles for the UI elements
const styles = StyleSheet.create({
  container: {
    width: 500,
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  navContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#ff6600',
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default VirtualTour;