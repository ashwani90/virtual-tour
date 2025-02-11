import { ReactInstance } from 'react-360-web';

function init(bundle, parent, options = {}) {
    const r360 = new ReactInstance(bundle, parent, {
        fullScreen: true,
        ...options,
    });

    // Initialize WebXR Hand Tracking
    if (navigator.xr) {
        navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['hand-tracking'] }).then((session) => {
            console.log("Hand tracking enabled!");
            session.addEventListener('input', handleHandTracking);
        });
    }

    r360.renderToSurface(r360.createRoot('TourApp'), r360.getDefaultSurface());
}

function handleHandTracking(event) {
    event.inputs.forEach((input) => {
        if (input.hand && input.selectPressed) {
            console.log("Hand interaction detected!");
            // Handle grabbing or clicking objects
        }
    });
}

window.React360 = init;
