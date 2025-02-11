import { ReactInstance } from 'react-360-web';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    fullScreen: true,
    ...options,
  });

  // Set camera position
  r360.controls.clearCameraOrbit();
  r360.controls.moveCamera(0, 1.6, 0); // Adjust height

  // Render room component
  r360.renderToSurface(
    r360.createRoot('Room'),
    r360.getDefaultSurface()
  );

  // Set environment (background image)
  r360.compositor.setBackground(r360.getAssetURL('360_room.jpg'));
}

window.React360 = { init };