import React from 'react';

import App from './App';
import { AppRegistry } from 'react-360';

AppRegistry.registerComponent('VirtualTour', () => App);
AppRegistry.registerSurface('main', {
  width: 100,
  height: 100,
});