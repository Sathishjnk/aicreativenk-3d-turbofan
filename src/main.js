/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Application Entry Point & Orchestrator
 */

console.log('>>> [AicreativeNK] main.js top-level executing! <<<');

import * as THREE from 'three';
window.THREE = THREE;
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { createScene } from './three/scene.js';
import { createCamera } from './three/camera.js';
import { createControls } from './three/controls.js';
import { createEngineMaterials } from './three/materials.js';
import { createTurbofanEngine } from './three/engine.js';
import { EngineAnimationController } from './three/animation.js';
import { EngineInteractionHandler } from './three/interactions.js';

import { InformationPanelController } from './components/informationPanel.js';
import { ControlPanelController } from './components/controlPanel.js';

// Global error boundary & WebGL verification
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

async function initApp() {
  console.log('>>> [AicreativeNK] initApp() entry point called! <<<');
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('loader-progress-bar');
  const statusText = document.getElementById('loader-status');
  const errorScreen = document.getElementById('webgl-error-screen');

  try {
    const webglSupported = checkWebGLSupport();
    console.log('>>> [AicreativeNK] checkWebGLSupport() =', webglSupported, '<<<');
    if (!webglSupported) {
      console.warn('>>> [AicreativeNK] WebGL not supported, showing error screen <<<');
      if (loadingScreen) loadingScreen.classList.add('hidden');
      if (errorScreen) errorScreen.classList.remove('hidden');
      return;
    }
    console.log('>>> [AicreativeNK] WebGL is supported! Proceeding to scene creation... <<<');

  function updateProgress(pct, status) {
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (statusText) statusText.textContent = status;
  }

  updateProgress(20, 'Configuring WebGL Pipeline & Shaders...');

  const container = document.getElementById('canvas-container');
  const labelsContainer = document.getElementById('labels-container');
  const tooltipElement = document.getElementById('hover-tooltip');

  console.log('>>> [AicreativeNK] Step 1: createScene...');
  // 1. Scene & Renderer Setup
  const { scene, renderer, combustorLight } = createScene(container);
  console.log('>>> [AicreativeNK] Step 1 DONE: createScene succeeded!');

  console.log('>>> [AicreativeNK] Step 2: createCamera...');
  // 2. Camera Setup
  const cameraController = createCamera(container);
  const camera = cameraController.camera;
  console.log('>>> [AicreativeNK] Step 2 DONE: createCamera succeeded!');

  console.log('>>> [AicreativeNK] Step 3: createControls...');
  // 3. Orbit Controls Setup
  const controls = createControls(camera, renderer.domElement);
  cameraController.setControls(controls);
  console.log('>>> [AicreativeNK] Step 3 DONE: createControls succeeded!');

  updateProgress(45, 'Generating Procedural Aerospace Materials & Textures...');

  console.log('>>> [AicreativeNK] Step 4: createEngineMaterials...');
  // 4. Aerospace PBR Materials
  const materials = createEngineMaterials();
  console.log('>>> [AicreativeNK] Step 4 DONE: createEngineMaterials succeeded!');

  updateProgress(70, 'Building High-Bypass Turbofan Geometry Assemblies...');

  console.log('>>> [AicreativeNK] Step 5: createTurbofanEngine...');
  // 5. Complete Procedural Turbofan Engine Assembly
  const engineModel = createTurbofanEngine(materials);
  scene.add(engineModel.engineRoot);
  console.log('>>> [AicreativeNK] Step 5 DONE: createTurbofanEngine succeeded!');

  console.log('>>> [AicreativeNK] Step 6: EngineAnimationController...');
  // 6. Animation & Dynamic Airflow Particles
  let animationController;
  try {
    animationController = new EngineAnimationController(engineModel, materials);
    console.log('>>> [AicreativeNK] Step 6 DONE: animationController succeeded!');
  } catch (err) {
    console.error('>>> [AicreativeNK] Step 6 FAILED WITH ERROR:', err.message, err.stack);
  }

  console.log('>>> [AicreativeNK] Step 7: EngineInteractionHandler...');
  // 7. Raycasting & Interaction Handler
  let interactionHandler;
  try {
    interactionHandler = new EngineInteractionHandler(
      scene,
      camera,
      engineModel,
      container,
      labelsContainer,
      tooltipElement
    );
    console.log('>>> [AicreativeNK] Step 7 DONE: interactionHandler succeeded!');
  } catch (err) {
    console.error('>>> [AicreativeNK] Step 7 FAILED WITH ERROR:', err.message, err.stack);
  }

  updateProgress(90, 'Mounting Telemetry HUD & Engineering Knowledge Base...');

  // 8. UI Controllers
  let infoPanelController;
  try {
    console.log('>>> [AicreativeNK] Step 8A: InformationPanelController...');
    infoPanelController = new InformationPanelController(
      engineModel,
      cameraController,
      interactionHandler
    );
    console.log('>>> [AicreativeNK] Step 8A DONE!');
  } catch (err) {
    console.error('>>> [AicreativeNK] Step 8A FAILED:', err.message, err.stack);
  }

  let controlPanelController;
  try {
    console.log('>>> [AicreativeNK] Step 8B: ControlPanelController...');
    controlPanelController = new ControlPanelController(
      engineModel,
      animationController,
      cameraController,
      interactionHandler
    );
    console.log('>>> [AicreativeNK] Step 8B DONE!');
  } catch (err) {
    console.error('>>> [AicreativeNK] Step 8B FAILED:', err.message, err.stack);
  }

  // Diagnostic mode & Global References for visual validation
  window.__engine = engineModel;
  window.__scene = scene;
  window.__renderer = renderer;
  window.__camera = camera;
  window.__cameraController = cameraController;
  window.__materials = materials;
  window.__interaction = interactionHandler;
  window.__animation = animationController;
  window.__controls = controls;
  window.__controlPanel = controlPanelController;
  window.__infoPanel = infoPanelController;

  // Diagnostic Component Isolation API
  window.isolateComponent = function(targetId) {
    if (!targetId || targetId === 'all') {
      engineModel.assemblies.componentsMap.forEach((group) => {
        group.visible = true;
      });
      engineModel.setCutawayMode('half');
      console.log('Restored all components (default half cutaway)');
      return;
    }

    engineModel.assemblies.componentsMap.forEach((group, id) => {
      group.visible = (id === targetId);
    });

    if (targetId === 'air-intake' || targetId === 'engine-casing') {
      engineModel.setCutawayMode('full');
    }
    console.log(`Isolated component: ${targetId}`);
  };

  updateProgress(100, 'AicreativeNK 3D Turbofan Explorer Ready!');

  // Dismiss Loading Screen smoothly
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }

  // 10. Animation Loop
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    // Update smooth camera transitions
    cameraController.update();

    // Update orbit controls damping
    controls.update();

    // Update engine spools, combustion light, & particle streamlines
    animationController.update(delta);

    // Sync point light intensity with combustor flame
    if (combustorLight && materials.combustionFlame) {
      combustorLight.intensity = materials.combustionFlame.opacity * 1.6;
    }

    // Update 3D floating labels in screen space
    interactionHandler.updateLabels();

    // Update live telemetry HUD readouts
    controlPanelController.updateTelemetryHUD();

    // Render WebGL frame
    renderer.render(scene, camera);
  }

  animate();

  // 11. Responsive Viewport Resize Handling
  function onWindowResize() {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    cameraController.handleResize(width, height);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }

  window.addEventListener('resize', onWindowResize);
  // Also observe container in case side panels toggle
  const resizeObserver = new ResizeObserver(() => onWindowResize());
  resizeObserver.observe(container);
  } catch (err) {
    console.error('Error during initApp:', err);
    if (statusText) statusText.textContent = 'Error: ' + err.message;
  }
}

// Launch application on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
