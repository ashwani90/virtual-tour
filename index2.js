import { ReactInstance } from 'react-360-web';

function init(bundle, parent, options = {}) {
    const r360 = new ReactInstance(bundle, parent, {
        fullScreen: true,
        ...options,
    });

    // Handle VR controller movement
    r360.controls.addListener('move', (event) => {
        handleMovement(event);
    });

    r360.renderToSurface(
        r360.createRoot('TourApp'),
        r360.getDefaultSurface()
    );
}

window.handleMovement = (event) => {
    let step = 1; // Movement step size
    let cameraTransform = window.React360.getCameraTransform();

    switch (event) {
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

    window.React360.setCameraTransform(cameraTransform);
};

window.React360 = init;
