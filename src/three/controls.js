/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Three.js OrbitControls Configuration
 */

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);

  // Smooth interaction damping
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Zoom distance constraints
  controls.minDistance = 2.0;
  controls.maxDistance = 20.0;

  // Prevent moving completely beneath ground plane
  controls.maxPolarAngle = Math.PI * 0.92;

  // Panning settings
  controls.enablePan = true;
  controls.panSpeed = 0.8;
  controls.screenSpacePanning = true;

  return controls;
}
