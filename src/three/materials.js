/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Authentic Aerospace Metallic Materials & Procedural Textures
 * High-fidelity PBR shaders calibrated to real-world turbofan reference photography.
 */

import * as THREE from 'three';

/**
 * Creates procedural textures in-memory to ensure zero external network delays
 * and optimal performance on Intel Core i3 integrated graphics.
 */
function createProceduralTextures() {
  // 1. Helical Spinner Spiral Texture (Sharp white spiral on dark carbon-composite cone)
  // Mapped via LatheGeometry where U is angle in [0, 1] and V is height (base to apex) in [0, 1].
  const spinnerCanvas = document.createElement('canvas');
  spinnerCanvas.width = 1024;
  spinnerCanvas.height = 1024;
  const ctx = spinnerCanvas.getContext('2d');

  // Dark aerospace carbon-composite base
  ctx.fillStyle = '#121620';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle circular machining grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let y = 0; y < 1024; y += 4) {
    if (y % 8 === 0) {
      ctx.fillRect(0, y, 1024, 2);
    }
  }

  // Base Mounting Band & Bolt Circle (Y in [880, 1024], i.e. base of spinner near fan hub)
  ctx.fillStyle = '#1e2634';
  ctx.fillRect(0, 885, 1024, 139);
  ctx.strokeStyle = '#38465a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 885);
  ctx.lineTo(1024, 885);
  ctx.stroke();

  // 24 Machined titanium bolts around the base circumference
  const numBolts = 24;
  for (let b = 0; b < numBolts; b++) {
    const bx = (b / numBolts) * 1024 + 1024 / (numBolts * 2);
    const by = 945;
    // Bolt shadow
    ctx.fillStyle = '#080a10';
    ctx.beginPath();
    ctx.arc(bx, by + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    // Bolt head
    ctx.fillStyle = '#a8b8cc';
    ctx.beginPath();
    ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
    ctx.fill();
    // Bolt center pin
    ctx.fillStyle = '#4c5a6e';
    ctx.beginPath();
    ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Specular glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx - 2, by - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // The Iconic White Spiral Swirl (Photo 4: GE90 / CFM LEAP style)
  // Swirls from near apex (y = 65, V = 0.94) down to base flange (y = 880, V = 0.14)
  ctx.fillStyle = '#ffffff';
  const startY = 65;
  const endY = 880;
  const turns = 1.25;

  for (let y = startY; y <= endY; y++) {
    const t = (y - startY) / (endY - startY); // 0 (near tip) to 1 (near base)
    const angleFraction = (0.20 + turns * Math.pow(t, 0.94)) % 1.0;
    const centerX = angleFraction * 1024;

    // Radius at this height: baseR=0.52, power=0.65
    // V = 1 - (y / 1024). Cone radius r = 0.52 * (1 - V)^0.65 = 0.52 * (y / 1024)^0.65
    const coneRadius = 0.52 * Math.pow(y / 1024, 0.65);
    // Desired physical stripe width is ~0.042m, expanding near apex comma
    const targetPhysicalWidth = 0.040 + (1 - t) * 0.024;
    const angularWidth = targetPhysicalWidth / (coneRadius + 0.022);
    const halfWidthPx = (angularWidth / (Math.PI * 2)) * 1024 * 0.5;

    // Draw stripe across centerX, wrapping around 0 and 1024
    for (let wrap = -1; wrap <= 1; wrap++) {
      const cx = centerX + wrap * 1024;
      ctx.fillRect(cx - halfWidthPx, y, halfWidthPx * 2, 1.5);
    }
  }

  // Comma teardrop head near the apex (Photo 4)
  const headAngle = 0.20;
  const headCenterX = headAngle * 1024;
  for (let wrap = -1; wrap <= 1; wrap++) {
    const cx = headCenterX + wrap * 1024;
    ctx.beginPath();
    ctx.arc(cx, startY + 6, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  const spinnerTexture = new THREE.CanvasTexture(spinnerCanvas);
  spinnerTexture.wrapS = THREE.RepeatWrapping;
  spinnerTexture.wrapT = THREE.ClampToEdgeWrapping;

  // 2. Perforated Combustor Effusion Cooling Holes Texture
  const combustorCanvas = document.createElement('canvas');
  combustorCanvas.width = 512;
  combustorCanvas.height = 512;
  const cCtx = combustorCanvas.getContext('2d');

  // Heat discoloration rings (Hastelloy-X golden burnt superalloy)
  const grad = cCtx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#5a3d1c');
  grad.addColorStop(0.25, '#8a6229');
  grad.addColorStop(0.5, '#4a5068'); // Heat blue oxidation band
  grad.addColorStop(0.75, '#9a7030');
  grad.addColorStop(1, '#6a4520');
  cCtx.fillStyle = grad;
  cCtx.fillRect(0, 0, 512, 512);

  // Micro effusion cooling holes
  cCtx.fillStyle = '#140c06';
  for (let y = 8; y < 512; y += 16) {
    for (let x = 8; x < 512; x += 16) {
      const offsetX = (y % 32 === 0) ? 8 : 0;
      cCtx.beginPath();
      cCtx.arc(x + offsetX, y, 2.5, 0, Math.PI * 2);
      cCtx.fill();
    }
  }

  const combustorTexture = new THREE.CanvasTexture(combustorCanvas);
  combustorTexture.wrapS = THREE.RepeatWrapping;
  combustorTexture.wrapT = THREE.RepeatWrapping;
  combustorTexture.repeat.set(4, 2);

  // 3. Carbon Fiber & Kevlar Containment Weave Texture
  const carbonCanvas = document.createElement('canvas');
  carbonCanvas.width = 64;
  carbonCanvas.height = 64;
  const cfCtx = carbonCanvas.getContext('2d');
  cfCtx.fillStyle = '#141a24';
  cfCtx.fillRect(0, 0, 64, 64);
  cfCtx.fillStyle = '#222b3b';
  for (let i = 0; i < 64; i += 8) {
    for (let j = 0; j < 64; j += 8) {
      if ((i + j) % 16 === 0) {
        cfCtx.fillRect(i, j, 8, 8);
      }
    }
  }
  const carbonTexture = new THREE.CanvasTexture(carbonCanvas);
  carbonTexture.wrapS = THREE.RepeatWrapping;
  carbonTexture.wrapT = THREE.RepeatWrapping;
  carbonTexture.repeat.set(8, 8);

  return { spinnerTexture, combustorTexture, carbonTexture };
}

export function createEngineMaterials() {
  const { spinnerTexture, combustorTexture, carbonTexture } = createProceduralTextures();

  const materials = {
    // 1. Titanium Fan Blades (Ti-6Al-4V / Carbon Composite Body)
    // Deep carbon-composite with gloss lacquer sheen, exactly matching Photo 4
    titaniumFan: new THREE.MeshStandardMaterial({
      color: 0x222a36,
      metalness: 0.88,
      roughness: 0.22,
      side: THREE.DoubleSide,
      name: 'TitaniumFan'
    }),

    // Polished Titanium Leading Edge Sheath / Anti-Ice Intake Lip Rim
    // Razor-sharp gleaming polished metallic titanium cladding
    titaniumPolished: new THREE.MeshStandardMaterial({
      color: 0xeef4fa,
      metalness: 0.98,
      roughness: 0.10,
      side: THREE.DoubleSide,
      name: 'TitaniumPolished'
    }),

    // 2. Low-Pressure Compressor (LPC Booster) - Machined Titanium Blisks
    titaniumCompressor: new THREE.MeshStandardMaterial({
      color: 0x7c8c9e,
      metalness: 0.86,
      roughness: 0.28,
      name: 'TitaniumCompressor'
    }),

    // 3. High-Pressure Compressor (HPC) - Precision Machined Stainless Steel & Nickel Alloy Blisks
    // Gleaming metallic blisk blades with specular reflection matching Photo 3
    hpcAlloy: new THREE.MeshStandardMaterial({
      color: 0x8e9db0,
      metalness: 0.92,
      roughness: 0.22,
      name: 'HpcAlloy'
    }),

    // 4. Spinner Nose Cone with Spiral
    // White base color ensures canvas texture colors and white spiral are 100% pure and unattenuated
    spinnerCone: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: spinnerTexture,
      metalness: 0.35,
      roughness: 0.30,
      name: 'SpinnerCone'
    }),

    // Soft rubber de-icing tip at the nose apex
    rubberTip: new THREE.MeshStandardMaterial({
      color: 0x111418,
      roughness: 0.85,
      metalness: 0.10,
      name: 'RubberTip'
    }),

    // 5. Combustor Liner (Golden-Bronze Heat-Resistant Superalloy with Thermal Barrier Coating)
    // Rich golden bronze hue matching Photo 3
    combustorLiner: new THREE.MeshStandardMaterial({
      color: 0xba883a,
      map: combustorTexture,
      metalness: 0.88,
      roughness: 0.30,
      name: 'CombustorLiner'
    }),

    // Combustor Gold Fuel Nozzles & Swirlers
    combustorGold: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      name: 'CombustorGold'
    }),

    // 6. Dynamic Combustion Fire Core
    combustionFlame: new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      name: 'CombustionFlame'
    }),

    // 7. High-Pressure Turbine (HPT) - Single-Crystal Nickel Superalloy (CMSX-4)
    // Heat-tempered golden bronze superalloy blisks matching Photo 3
    superalloyTurbine: new THREE.MeshStandardMaterial({
      color: 0xa07e44,
      metalness: 0.92,
      roughness: 0.22,
      name: 'SuperalloyTurbine'
    }),

    // 8. Low-Pressure Turbine (LPT) - Intermetallic Titanium-Aluminide (TiAl) Blisks
    lptAlloy: new THREE.MeshStandardMaterial({
      color: 0x7c8c9e,
      metalness: 0.88,
      roughness: 0.26,
      name: 'LptAlloy'
    }),

    // 9. Outer Nacelle Casing Exterior - Modern Aerospace Machined Titanium / Aluminium Alloy
    // NOT black plastic! Machined silver-grey metallic casing matching Photo 1
    casingExterior: new THREE.MeshStandardMaterial({
      color: 0x8a98a8,
      metalness: 0.80,
      roughness: 0.35,
      side: THREE.DoubleSide,
      name: 'CasingExterior'
    }),

    // 10. Cutaway Section Rim Highlight - Crisp Aerospace Safety Orange Slice Cross-Section
    cutawayRim: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x5a1e00,
      emissiveIntensity: 0.40,
      metalness: 0.50,
      roughness: 0.32,
      side: THREE.DoubleSide,
      name: 'CutawayRim'
    }),

    // 11. Casing Interior - Acoustic Liner & Carbon Containment Wrap
    casingInterior: new THREE.MeshStandardMaterial({
      color: 0x222a36,
      map: carbonTexture,
      metalness: 0.40,
      roughness: 0.60,
      side: THREE.DoubleSide,
      name: 'CasingInterior'
    }),

    // 12. Polished Chrome/Steel Inner N1 Shaft
    shaftInner: new THREE.MeshStandardMaterial({
      color: 0x98a8ba,
      metalness: 0.96,
      roughness: 0.14,
      name: 'ShaftInner'
    }),

    // 13. Outer N2 Hollow Shaft
    shaftOuter: new THREE.MeshStandardMaterial({
      color: 0x6e7e90,
      metalness: 0.92,
      roughness: 0.22,
      name: 'ShaftOuter'
    }),

    // 14. Exhaust Nozzle & Centerbody Tailcone Plug - High-Temp Inconel 625
    exhaustMetal: new THREE.MeshStandardMaterial({
      color: 0x5a626e,
      metalness: 0.84,
      roughness: 0.35,
      side: THREE.DoubleSide,
      name: 'ExhaustMetal'
    }),

    // 15. Structural Castings (Fan Frame & OGVs & Accessory Gearbox)
    structuralCast: new THREE.MeshStandardMaterial({
      color: 0x5a6878,
      metalness: 0.80,
      roughness: 0.38,
      name: 'StructuralCast'
    }),

    // 16. Cyan Accent Details
    accentCyan: new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x004455,
      name: 'AccentCyan'
    }),

    // 17. Active Component Selection Overlay
    selectionHighlight: new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x007799,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
      name: 'SelectionHighlight'
    }),

    // 18. Technical Ghost / Wireframe Material
    ghostWireframe: new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      name: 'GhostWireframe'
    })
  };

  return materials;
}
