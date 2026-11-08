/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Balanced Studio Lighting, Procedural Environment Map & WebGL Renderer
 */

import * as THREE from 'three';

/**
 * Creates an in-memory procedural equirectangular studio environment texture.
 * Generates soft, realistic metallic reflections for titanium, chrome, and superalloys
 * with 0ms overhead and zero external network requests.
 */
function createStudioEnvironment() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 1. Dark aerospace gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#101622');   // Ceiling: dark slate navy
  bgGrad.addColorStop(0.5, '#070b14'); // Horizon: deep aerospace dark navy
  bgGrad.addColorStop(1, '#020408');   // Floor: near black
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Top Daylight Softbox (crisp rim highlights on titanium blades and nacelle)
  const topGrad = ctx.createRadialGradient(512, 110, 10, 512, 110, 300);
  topGrad.addColorStop(0, 'rgba(230, 240, 255, 0.85)');
  topGrad.addColorStop(0.4, 'rgba(180, 205, 230, 0.35)');
  topGrad.addColorStop(1, 'rgba(16, 22, 34, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1024, 280);

  // 3. Left Cyan Rim Softbox (aerospace brand reflection)
  const cyanGrad = ctx.createRadialGradient(180, 230, 10, 180, 230, 200);
  cyanGrad.addColorStop(0, 'rgba(0, 210, 255, 0.45)');
  cyanGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.15)');
  cyanGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');
  ctx.fillStyle = cyanGrad;
  ctx.fillRect(0, 90, 420, 320);

  // 4. Right Warm Core Fill (subtle amber warmth on turbine and combustor)
  const warmGrad = ctx.createRadialGradient(840, 240, 10, 840, 240, 200);
  warmGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  warmGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.1)');
  warmGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(600, 90, 424, 320);

  const envTexture = new THREE.CanvasTexture(canvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  return envTexture;
}

export function createScene(container) {
  // 1. Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b14); // Deep aerospace dark navy
  scene.fog = new THREE.FogExp2(0x070b14, 0.028);

  // 2. WebGL Renderer (Optimized for Intel Core i3 / Intel HD 5500)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
    depth: true,
    preserveDrawingBuffer: true
  });

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(width, height);

  // Calibrated ACES Filmic Tone Mapping prevents blown-out white surfaces while keeping metals lustrous
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  container.appendChild(renderer.domElement);

  // 3. Environment Map (Realistic Metallic Reflections)
  try {
    const envTexture = createStudioEnvironment();
    if (envTexture) {
      scene.environment = envTexture;
    }
  } catch (err) {
    console.warn('[AicreativeNK] Studio environment generation fallback:', err);
  }

  // 4. Balanced Studio Lighting (Calibrated to Aerospace Studio Photography: warm amber rim + cool cyan fill)
  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'StudioLights';

  // Ambient Fill (cool aerospace slate fill)
  const ambientLight = new THREE.AmbientLight(0x28384e, 0.62);
  lightsGroup.add(ambientLight);

  // Key Light (Main daylight from front-top-right)
  const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.30);
  keyLight.position.set(5.5, 6.5, 6.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 6;
  keyLight.shadow.camera.bottom = -6;
  keyLight.shadow.bias = -0.0004;
  lightsGroup.add(keyLight);

  // Front Key Light (Direct illumination of front fan face, spinner cone spiral & wide-chord blades)
  const frontKeyLight = new THREE.DirectionalLight(0xf2f7ff, 1.35);
  frontKeyLight.position.set(0.0, 3.5, 8.5);
  lightsGroup.add(frontKeyLight);

  // Cool Cyan Rim Light (Aerospace edge glints from rear-top-left, matching Photo 3)
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
  rimLight.position.set(-6.5, 4.5, -4.5);
  lightsGroup.add(rimLight);

  // Warm Amber Rim/Fill Light (Golden heat highlights on turbines & combustor, matching Photo 3)
  const warmFill = new THREE.DirectionalLight(0xffaa55, 1.25);
  warmFill.position.set(6.5, 2.5, -2.5);
  lightsGroup.add(warmFill);

  // Subtle Up-Bounce Light (Prevents black shadows on engine belly)
  const underGlow = new THREE.DirectionalLight(0x1a2638, 0.38);
  underGlow.position.set(0, -6.0, 0);
  lightsGroup.add(underGlow);

  // Internal Combustor Point Light (Fiery glow through cutaway)
  const combustorLight = new THREE.PointLight(0xff6600, 2.8, 4.5);
  combustorLight.position.set(0, 0, -0.55);
  lightsGroup.add(combustorLight);

  scene.add(lightsGroup);

  // 5. Aerospace Ground Grid
  const gridHelper = new THREE.GridHelper(26, 26, 0x00f0ff, 0x1e293b);
  gridHelper.position.y = -2.6;
  gridHelper.material.opacity = 0.22;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Circular Staging Ring
  const ringGeom = new THREE.RingGeometry(2.4, 2.45, 64);
  ringGeom.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide
  });
  const ringMesh = new THREE.Mesh(ringGeom, ringMat);
  ringMesh.position.y = -2.59;
  scene.add(ringMesh);

  return {
    scene,
    renderer,
    combustorLight
  };
}
