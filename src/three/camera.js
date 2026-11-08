/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Camera Setup & Smooth Cinematic View Transition System
 * Stage 2 Visual Refinement: Balanced isometric perspective framing both front fan and core cutaway.
 */

import * as THREE from 'three';

export function createCamera(container) {
  const fov = 44;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 80;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(6.8, 3.0, 5.6);

  // Calibrated preset camera views
  const PRESET_VIEWS = {
    isometric: {
      pos: new THREE.Vector3(6.8, 3.0, 5.6),
      target: new THREE.Vector3(0, -0.15, 0.25)
    },
    front: {
      pos: new THREE.Vector3(0, 0.25, 6.8),
      target: new THREE.Vector3(0, 0, 2.15)
    },
    side: {
      pos: new THREE.Vector3(7.6, 1.8, 0.0),
      target: new THREE.Vector3(0, 0, 0.0)
    },
    top: {
      pos: new THREE.Vector3(0.01, 9.6, 0.01),
      target: new THREE.Vector3(0, 0, 0.0)
    },
    exhaust: {
      pos: new THREE.Vector3(0, 0.8, -8.2),
      target: new THREE.Vector3(0, 0, -2.2)
    }
  };

  // Smooth camera animation state
  const animState = {
    isAnimating: false,
    startTime: 0,
    duration: 1000,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    controlsRef: null,
    onComplete: null
  };

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function setControls(controls) {
    animState.controlsRef = controls;
    if (controls) {
      controls.target.set(0, -0.15, 0.25);
      controls.update();
    }
  }

  function animateTo(targetPos, targetLookAt, duration = 1000, onComplete = null) {
    if (duration <= 0) {
      camera.position.copy(targetPos);
      if (animState.controlsRef) {
        animState.controlsRef.target.copy(targetLookAt);
        animState.controlsRef.update();
      } else {
        camera.lookAt(targetLookAt);
      }
      animState.isAnimating = false;
      if (onComplete) onComplete();
      return;
    }

    animState.isAnimating = true;
    animState.startTime = performance.now();
    animState.duration = Math.max(duration, 50);
    animState.startPos.copy(camera.position);
    animState.endPos.copy(targetPos);
    animState.startTarget.copy(animState.controlsRef ? animState.controlsRef.target : new THREE.Vector3(0, 0, 0));
    animState.endTarget.copy(targetLookAt);
    animState.onComplete = onComplete;
  }

  function applyPreset(viewKey, duration = 1000, onComplete = null) {
    const preset = PRESET_VIEWS[viewKey];
    if (preset) {
      animateTo(preset.pos, preset.target, duration, onComplete);
    }
  }

  function update() {
    if (!animState.isAnimating) return;

    const elapsed = performance.now() - animState.startTime;
    const progress = Math.min(elapsed / animState.duration, 1.0);
    const eased = easeInOutCubic(progress);

    camera.position.lerpVectors(animState.startPos, animState.endPos, eased);

    if (animState.controlsRef) {
      animState.controlsRef.target.lerpVectors(animState.startTarget, animState.endTarget, eased);
      animState.controlsRef.update();
    } else {
      camera.lookAt(animState.endTarget);
    }

    if (progress >= 1.0) {
      animState.isAnimating = false;
      if (animState.onComplete) {
        animState.onComplete();
      }
    }
  }

  function handleResize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  return {
    camera,
    PRESET_VIEWS,
    setControls,
    animateTo,
    applyPreset,
    update,
    handleResize
  };
}
