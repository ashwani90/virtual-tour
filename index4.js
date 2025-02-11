import { ReactInstance } from 'react-360-web';

function init(bundle, parent, options = {}) {
    const r360 = new ReactInstance(bundle, parent, {
        fullScreen: true,
        ...options,
    });

    if (navigator.xr) {
        navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['hand-tracking'] }).then((session) => {
            console.log("Hand tracking enabled!");
            session.addEventListener('input', handleGesture);
        });
    }

    r360.renderToSurface(r360.createRoot('TourApp'), r360.getDefaultSurface());
}

function handleGesture(event) {
    event.inputs.forEach((input) => {
        if (input.hand) {
            if (input.pinchStrength > 0.8) {
                console.log("Pinch detected! Grabbing object...");
                grabObject();
            }
            if (input.squeezeStrength > 0.8) {
                console.log("Squeeze detected! Dropping object...");
                dropObject();
            }
            if (input.handPose === 'open') {
                console.log("Open hand detected! Show interaction menu...");
                showMenu();
            }
        }
    });
}

window.React360 = init;
