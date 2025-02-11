import { Camera } from 'react-360';

const moveUser = (direction) => {
    const step = 1; // Adjust step size
    let cameraTransform = Camera.getCameraTransform();
    
    switch (direction) {
        case 'forward':
            cameraTransform.translateZ -= step;
            break;
        case 'backward':
            cameraTransform.translateZ += step;
            break;
        case 'left':
            cameraTransform.translateX -= step;
            break;
        case 'right':
            cameraTransform.translateX += step;
            break;
    }

    Camera.setCameraTransform(cameraTransform);
};

const TourApp = () => {
    return (
        <View>
            <VrButton style={styles.button} onClick={() => moveUser('forward')}>
                <Text style={styles.buttonText}>Move Forward</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => moveUser('backward')}>
                <Text style={styles.buttonText}>Move Backward</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => moveUser('left')}>
                <Text style={styles.buttonText}>Move Left</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => moveUser('right')}>
                <Text style={styles.buttonText}>Move Right</Text>
            </VrButton>
        </View>
    );
};
