/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Realistic Aerospace 3D Turbofan Engine Geometry, Materials & Longitudinal Cutaway
 * Stage 2 Visual Refinement: Calibrated against real-world turbofan reference photography:
 * 1. Wide-chord scimitar fan blades with polished titanium leading-edge sheaths (Photo 4)
 * 2. Parabolic bullet spinner cone with iconic white spiral swirl and 24-bolt retention ring (Photo 4)
 * 3. 36 Aerodynamic Outlet Guide Vanes (OGVs) bridging the bypass duct (Photo 4 & 2)
 * 4. Machined aerospace titanium alloy outer casing with T-flanges, waffle stringers & piping (Photo 1)
 * 5. Alternating rotor blisks & stator vane stages in the HPC compressor (Photo 2 & 3)
 * 6. Golden-bronze heat-resistant superalloy combustor with gold fuel nozzles & manifold (Photo 3)
 * 7. Single-crystal superalloy HPT and intermetallic LPT blisks (Photo 3)
 * 8. Dual-cowl cutaway exposing internal stages with safety orange cross-section rims (Photo 2)
 */

import * as THREE from 'three';

/**
 * Generates an aerodynamically twisted wide-chord titanium fan blade geometry.
 * Accurately models transonic scimitar curvature, progressive camber, chord expansion, and twist.
 * Blade span is along +Y axis (0 to 1.48), chord is along X (-0.12 to 0.44), thickness along Z.
 */
function createFanBladeGeometry() {
  const shape = new THREE.Shape();
  // Aerodynamic airfoil camber profile (leading edge at x=0.44, trailing edge at x=-0.12)
  shape.moveTo(0.44, 0);
  shape.quadraticCurveTo(0.38, 0.045, 0.16, 0.038);
  shape.quadraticCurveTo(-0.04, 0.022, -0.12, 0.0);
  shape.quadraticCurveTo(-0.02, -0.016, 0.18, -0.024);
  shape.quadraticCurveTo(0.38, -0.028, 0.44, 0);

  const extrudeSettings = {
    depth: 1.48, // blade span from hub (r=0.53) to casing tip (r=2.01)
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 16,
    bevelSize: 0.006,
    bevelThickness: 0.006
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.rotateX(-Math.PI / 2); // Depth becomes span along +Y

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // span from 0 to 1.48
    const spanFraction = THREE.MathUtils.clamp(y / 1.48, 0, 1);
    
    // Modern wide-chord expansion: wider at mid-span and tip (GE90 / LEAP)
    const chordFactor = 0.82 + 0.52 * Math.pow(spanFraction, 1.25);
    
    // Twist angle: 45 deg at hub root, flattening smoothly to 18 deg at supersonic tip
    const twistAngle = THREE.MathUtils.degToRad(45 * (1.0 - spanFraction * 0.60));
    
    // Aerodynamic scimitar sweep backward along Z
    const sweep = Math.pow(spanFraction, 2.2) * 0.28;
    
    let x = pos.getX(i) * chordFactor;
    let z = pos.getZ(i) * chordFactor;
    
    const cosT = Math.cos(twistAngle);
    const sinT = Math.sin(twistAngle);
    const rotX = x * cosT + z * sinT;
    const rotZ = -x * sinT + z * cosT;
    
    pos.setX(i, rotX);
    pos.setY(i, y);
    pos.setZ(i, rotZ - sweep);
  }

  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  return geom;
}

/**
 * Creates polished titanium leading-edge highlight strip for the fan blade.
 */
function createFanBladeLeadingEdgeGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0.44, 0);
  shape.quadraticCurveTo(0.38, 0.045, 0.32, 0.035);
  shape.quadraticCurveTo(0.36, -0.025, 0.44, 0);

  const extrudeSettings = {
    depth: 1.48,
    bevelEnabled: false,
    steps: 16
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.rotateX(-Math.PI / 2);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const spanFraction = THREE.MathUtils.clamp(y / 1.48, 0, 1);
    const chordFactor = 0.82 + 0.52 * Math.pow(spanFraction, 1.25);
    const twistAngle = THREE.MathUtils.degToRad(45 * (1.0 - spanFraction * 0.60));
    const sweep = Math.pow(spanFraction, 2.2) * 0.28;
    
    let x = pos.getX(i) * chordFactor;
    let z = pos.getZ(i) * chordFactor;
    
    const cosT = Math.cos(twistAngle);
    const sinT = Math.sin(twistAngle);
    const rotX = x * cosT + z * sinT;
    const rotZ = -x * sinT + z * cosT;
    
    pos.setX(i, rotX);
    pos.setY(i, y);
    pos.setZ(i, rotZ - sweep);
  }

  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  return geom;
}

/**
 * Creates a realistic aerodynamic parabolic bullet spinner cone geometry using LatheGeometry.
 * Points go from base (y=0, r=0.52) to tip (y=0.68, r=0) so normals point outward.
 */
function createBulletSpinnerGeometry() {
  const points = [];
  const segments = 32;
  const baseR = 0.52;
  const length = 0.68;
  
  // From base to tip
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 (base) to 1 (tip)
    const y = t * length;
    const r = baseR * Math.pow(1 - t, 0.65);
    points.push(new THREE.Vector2(r, y));
  }
  
  const geom = new THREE.LatheGeometry(points, 64);
  geom.rotateX(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates an aerodynamic cambered aerofoil Outlet Guide Vane (OGV) geometry.
 * Spanning from inner core radius (~0.80) to outer fan containment casing (~2.05).
 */
function createOGVGeometry() {
  const shape = new THREE.Shape();
  // Cambered aerofoil cross-section (chord = 0.22, thickness = 0.028)
  shape.moveTo(0.11, 0);
  shape.quadraticCurveTo(0.04, 0.022, -0.05, 0.016);
  shape.quadraticCurveTo(-0.10, 0.005, -0.11, 0.0);
  shape.quadraticCurveTo(-0.05, -0.008, 0.04, -0.012);
  shape.quadraticCurveTo(0.08, -0.006, 0.11, 0);

  const span = 1.25; // From core outer R ~ 0.80 to fan casing inner R ~ 2.05
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: span,
    bevelEnabled: false,
    steps: 1
  });
  geom.rotateX(-Math.PI / 2); // Depth becomes span along +Y
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates a bladed rotor disk or stator ring with distinct aerodynamic blades and rim.
 */
function createBladedDisk(stageRadius, bladeLength, bladeCount, bladeWidth, bladeAngleDeg, material, isTurbine = false) {
  const group = new THREE.Group();

  // Rotor disk hub with chamfered rim
  const diskThick = bladeWidth * 1.35;
  const diskGeom = new THREE.CylinderGeometry(stageRadius, stageRadius * 0.95, diskThick, 36);
  diskGeom.rotateX(Math.PI / 2);
  const diskMesh = new THREE.Mesh(diskGeom, material);
  group.add(diskMesh);

  // Aerodynamic blade shape
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, -bladeWidth * 0.4);
  bladeShape.quadraticCurveTo(bladeWidth * 0.28, bladeWidth * 0.45, bladeWidth * 0.72, 0);
  bladeShape.quadraticCurveTo(bladeWidth * 0.32, -bladeWidth * 0.22, 0, -bladeWidth * 0.4);

  const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, {
    depth: bladeLength,
    bevelEnabled: false
  });
  bladeGeom.center();

  for (let i = 0; i < bladeCount; i++) {
    const angle = (i * Math.PI * 2) / bladeCount;
    const blade = new THREE.Mesh(bladeGeom, material);
    
    const r = stageRadius + bladeLength * 0.5;
    blade.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    blade.rotation.z = angle + Math.PI / 2;
    blade.rotation.y = THREE.MathUtils.degToRad(isTurbine ? -bladeAngleDeg : bladeAngleDeg);
    
    group.add(blade);
  }

  return group;
}

/**
 * Creates a stationary stator vane half-ring (Y <= 0) to place between rotor stages in cutaway.
 */
function createStatorHalfRing(innerRadius, outerRadius, vaneCount, width, material) {
  const group = new THREE.Group();
  const bladeLen = outerRadius - innerRadius;

  const vaneShape = new THREE.Shape();
  vaneShape.moveTo(0, -width * 0.35);
  vaneShape.quadraticCurveTo(width * 0.25, width * 0.4, width * 0.65, 0);
  vaneShape.quadraticCurveTo(width * 0.25, -width * 0.2, 0, -width * 0.35);

  const vaneGeom = new THREE.ExtrudeGeometry(vaneShape, { depth: bladeLen, bevelEnabled: false });
  vaneGeom.center();

  // Vanes distributed in lower half (angle between PI and 2*PI)
  for (let i = 0; i < vaneCount; i++) {
    const angle = Math.PI + (i / (vaneCount - 1)) * Math.PI;
    const vane = new THREE.Mesh(vaneGeom, material);
    const r = innerRadius + bladeLen * 0.5;
    vane.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    vane.rotation.z = angle + Math.PI / 2;
    vane.rotation.y = THREE.MathUtils.degToRad(-35); // Opposite stagger angle of rotor
    group.add(vane);
  }

  // Outer stator shroud half-ring
  const shroudGeom = new THREE.CylinderGeometry(outerRadius + 0.01, outerRadius + 0.01, width * 1.2, 32, 1, true, 1.5 * Math.PI, Math.PI);
  shroudGeom.rotateX(Math.PI / 2);
  const shroud = new THREE.Mesh(shroudGeom, material);
  group.add(shroud);

  return group;
}

/**
 * Helper to build half/quarter longitudinal cutaway cylindrical shells
 * aligned along the Z axis (engine centerline).
 */
function createCasingShell(rTop, rBottom, height, thetaStart, thetaLength, material) {
  const geom = new THREE.CylinderGeometry(rTop, rBottom, height, 48, 1, true, thetaStart, thetaLength);
  geom.rotateX(Math.PI / 2);
  return new THREE.Mesh(geom, material);
}

/**
 * Builds the complete procedural 3D Turbofan Model with authentic metallic materials
 * and professional aerospace dual-cowl longitudinal cutaway.
 */
export function createTurbofanEngine(materials) {
  const engineRoot = new THREE.Group();
  engineRoot.name = 'TurbofanEngine';

  // Component assembly references
  const assemblies = {
    lpSpool: new THREE.Group(),        // Rotates at N1 speed
    hpSpool: new THREE.Group(),        // Rotates at N2 speed
    stationaryCore: new THREE.Group(), // Static core parts
    casingLower: new THREE.Group(),    // Lower static casing half (always visible)
    casingUpper: new THREE.Group(),    // Upper-Right quadrant casing (hidden in half and quarter cutaway)
    casingQuarter: new THREE.Group(),  // Upper-Left quadrant casing (shown in quarter cutaway)
    structures: new THREE.Group(),     // Gearbox and structural struts
    combustionFlame: null,             // Dynamic light/flame material
    componentsMap: new Map(),          // Quick lookup by component ID
    explodedNodes: []                  // Nodes with exploded displacement vectors
  };

  engineRoot.add(assemblies.lpSpool);
  engineRoot.add(assemblies.hpSpool);
  engineRoot.add(assemblies.stationaryCore);
  engineRoot.add(assemblies.structures);

  // Helper to register an assembly node for raycasting, selection, and explosion
  function registerComponentNode(id, groupOrMesh, basePos, explodeOffset) {
    groupOrMesh.userData.componentId = id;
    groupOrMesh.traverse((child) => {
      if (child.isMesh) {
        child.userData.componentId = id;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    assemblies.componentsMap.set(id, groupOrMesh);
    assemblies.explodedNodes.push({
      node: groupOrMesh,
      basePos: basePos.clone(),
      explodeOffset: explodeOffset.clone()
    });

    groupOrMesh.position.copy(basePos);
  }

  // ==========================================
  // 1. FAN BLADES & HUB (LP SPOOL - N1)
  // Base Position: Z = 2.15
  // ==========================================
  const fanGroup = new THREE.Group();
  fanGroup.name = 'FanAssembly';

  // 1A. Fan Hub Rotor Disk
  const fanDiskGeom = new THREE.CylinderGeometry(0.54, 0.52, 0.36, 48);
  fanDiskGeom.rotateX(Math.PI / 2);
  const fanDisk = new THREE.Mesh(fanDiskGeom, materials.titaniumCompressor);
  fanGroup.add(fanDisk);

  // Dovetail blade retention slots & retaining ring
  const dovetailRingGeom = new THREE.TorusGeometry(0.535, 0.02, 8, 48);
  const dovetailRing = new THREE.Mesh(dovetailRingGeom, materials.shaftInner);
  fanGroup.add(dovetailRing);

  // 1B. 18 Aerodynamically Curved Wide-Chord Titanium Fan Blades with Polished Leading Edges (Photo 4)
  const fanBladeGeom = createFanBladeGeometry();
  const fanBladeLeGeom = createFanBladeLeadingEdgeGeometry();
  const bladeCount = 18;
  const fanBladesMeshGroup = new THREE.Group();
  fanBladesMeshGroup.name = 'FanBladesMeshGroup';

  const rootGeom = new THREE.BoxGeometry(0.08, 0.07, 0.16);

  for (let i = 0; i < bladeCount; i++) {
    const angle = (i * Math.PI * 2) / bladeCount;
    
    // Blade root dovetail anchor
    const rootMesh = new THREE.Mesh(rootGeom, materials.shaftInner);
    rootMesh.position.set(Math.cos(angle) * 0.51, Math.sin(angle) * 0.51, -0.04);
    rootMesh.rotation.z = angle + Math.PI / 2;
    fanBladesMeshGroup.add(rootMesh);

    // Main titanium/carbon composite blade body
    const blade = new THREE.Mesh(fanBladeGeom, materials.titaniumFan);
    blade.position.set(Math.cos(angle) * 0.53, Math.sin(angle) * 0.53, -0.04);
    blade.rotation.z = angle - Math.PI / 2; // Span points radially outward
    fanBladesMeshGroup.add(blade);

    // Polished titanium leading-edge cladding strip
    const bladeLe = new THREE.Mesh(fanBladeLeGeom, materials.titaniumPolished);
    bladeLe.position.copy(blade.position);
    bladeLe.rotation.copy(blade.rotation);
    bladeLe.scale.set(1.002, 1.0, 1.002);
    fanBladesMeshGroup.add(bladeLe);
  }
  fanGroup.add(fanBladesMeshGroup);

  // Outer Fan Abradable Rub Strip / Shroud Ring
  const fanRimGeom = new THREE.TorusGeometry(2.03, 0.025, 12, 48);
  const fanRim = new THREE.Mesh(fanRimGeom, materials.titaniumPolished);
  fanRim.position.z = -0.04;
  fanGroup.add(fanRim);

  registerComponentNode(
    'fan-blades',
    fanGroup,
    new THREE.Vector3(0, 0, 2.15),
    new THREE.Vector3(0, 0, 2.4)
  );
  assemblies.lpSpool.add(fanGroup);

  // 1C. Fan Spinner Cone (Aerodynamic Parabolic Bullet with Helical Swirl & Bolt Circle - Photo 4)
  const spinnerGroup = new THREE.Group();
  spinnerGroup.name = 'SpinnerAssembly';
  
  const bulletGeom = createBulletSpinnerGeometry();
  const spinnerMesh = new THREE.Mesh(bulletGeom, materials.spinnerCone);
  spinnerGroup.add(spinnerMesh);

  // Soft rubber de-icing tip at the nose apex
  const tipGeom = new THREE.SphereGeometry(0.042, 16, 16);
  tipGeom.translate(0, 0, 0.68);
  const tipMesh = new THREE.Mesh(tipGeom, materials.rubberTip);
  spinnerGroup.add(tipMesh);

  // Base attachment flange ring with polished titanium clamping lip
  const flangeGeom = new THREE.TorusGeometry(0.525, 0.015, 8, 48);
  const flangeMesh = new THREE.Mesh(flangeGeom, materials.titaniumPolished);
  spinnerGroup.add(flangeMesh);

  registerComponentNode(
    'fan-hub',
    spinnerGroup,
    new THREE.Vector3(0, 0, 2.33),
    new THREE.Vector3(0, 0, 3.6)
  );
  assemblies.lpSpool.add(spinnerGroup);

  // ==========================================
  // 2. LOW PRESSURE COMPRESSOR (LPC / BOOSTER)
  // Base Position: Z = 1.45 (LP SPOOL - N1)
  // ==========================================
  const lpcGroup = new THREE.Group();
  lpcGroup.name = 'LPC_BoosterAssembly';

  // LPC Booster Rotor Stages (3 stages of decreasing radius)
  const lpcStages = [
    { z: 0.22, r: 0.54, bladeLen: 0.22, blades: 28, width: 0.08, angle: 32 },
    { z: 0.00, r: 0.52, bladeLen: 0.20, blades: 32, width: 0.07, angle: 34 },
    { z: -0.22, r: 0.50, bladeLen: 0.18, blades: 36, width: 0.06, angle: 36 }
  ];

  lpcStages.forEach(st => {
    const stageMesh = createBladedDisk(st.r, st.bladeLen, st.blades, st.width, st.angle, materials.titaniumCompressor);
    stageMesh.position.z = st.z;
    lpcGroup.add(stageMesh);
  });

  // Booster conical spool drum
  const lpcDrumGeom = new THREE.CylinderGeometry(0.50, 0.54, 0.55, 36, 1, true);
  lpcDrumGeom.rotateX(Math.PI / 2);
  const lpcDrum = new THREE.Mesh(lpcDrumGeom, materials.titaniumCompressor);
  lpcGroup.add(lpcDrum);

  registerComponentNode(
    'lpc',
    lpcGroup,
    new THREE.Vector3(0, 0, 1.45),
    new THREE.Vector3(0, 0, 1.2)
  );
  assemblies.lpSpool.add(lpcGroup);

  // ==========================================
  // 3. HIGH PRESSURE COMPRESSOR (HPC)
  // Base Position: Z = 0.45 (HP SPOOL - N2)
  // ==========================================
  const hpcGroup = new THREE.Group();
  hpcGroup.name = 'HPC_Assembly';

  // 7 multi-stage axial compressor blisks in precision machined steel alloy (Photo 3)
  const hpcStages = [
    { z: 0.45, r: 0.48, bladeLen: 0.18, blades: 42, width: 0.055, angle: 38 },
    { z: 0.30, r: 0.46, bladeLen: 0.16, blades: 46, width: 0.052, angle: 40 },
    { z: 0.15, r: 0.44, bladeLen: 0.14, blades: 50, width: 0.048, angle: 42 },
    { z: 0.00, r: 0.42, bladeLen: 0.13, blades: 54, width: 0.045, angle: 44 },
    { z: -0.15, r: 0.40, bladeLen: 0.11, blades: 58, width: 0.042, angle: 45 },
    { z: -0.30, r: 0.38, bladeLen: 0.10, blades: 62, width: 0.040, angle: 46 },
    { z: -0.45, r: 0.36, bladeLen: 0.09, blades: 66, width: 0.038, angle: 48 }
  ];

  hpcStages.forEach(st => {
    const stageMesh = createBladedDisk(st.r, st.bladeLen, st.blades, st.width, st.angle, materials.hpcAlloy);
    stageMesh.position.z = st.z;
    hpcGroup.add(stageMesh);
  });

  // Tapered conical spool drum
  const hpcDrumGeom = new THREE.CylinderGeometry(0.36, 0.48, 0.98, 36, 1, true);
  hpcDrumGeom.rotateX(Math.PI / 2);
  const hpcDrum = new THREE.Mesh(hpcDrumGeom, materials.hpcAlloy);
  hpcGroup.add(hpcDrum);

  registerComponentNode(
    'hpc',
    hpcGroup,
    new THREE.Vector3(0, 0, 0.45),
    new THREE.Vector3(0, 0, 0.0)
  );
  assemblies.hpSpool.add(hpcGroup);

  // Interstage Stator Vane Rows in Lower Casing (Alternating Rotor/Stator architecture - Photo 2 & 3)
  [0.375, 0.225, 0.075, -0.075, -0.225, -0.375].forEach((statorZ, idx) => {
    const innerR = 0.48 - idx * 0.02;
    const outerR = 0.65;
    const statorHalf = createStatorHalfRing(innerR, outerR, 20 + idx * 2, 0.03, materials.titaniumCompressor);
    statorHalf.position.z = 0.45 + statorZ;
    assemblies.casingLower.add(statorHalf);
  });

  // ==========================================
  // 4. COMBUSTION CHAMBER (ANNULAR BURNER & GOLD NOZZLES - Photo 3)
  // Base Position: Z = -0.55 (STATIC CORE)
  // ==========================================
  const combustorGroup = new THREE.Group();
  combustorGroup.name = 'CombustorAssembly';

  // Lower 180° annular liner (always visible in cutaway)
  const outerLinerLower = createCasingShell(0.56, 0.54, 0.85, 1.5 * Math.PI, Math.PI, materials.combustorLiner);
  combustorGroup.add(outerLinerLower);

  const innerLinerLower = createCasingShell(0.32, 0.30, 0.85, 1.5 * Math.PI, Math.PI, materials.combustorLiner);
  combustorGroup.add(innerLinerLower);

  // Fuel Manifold Circular Distribution Ring (Photo 3)
  const fuelManifoldGeom = new THREE.TorusGeometry(0.68, 0.016, 8, 36, Math.PI);
  fuelManifoldGeom.rotateZ(Math.PI);
  const fuelManifold = new THREE.Mesh(fuelManifoldGeom, materials.shaftInner);
  fuelManifold.position.z = 0.32;
  combustorGroup.add(fuelManifold);

  // 18 Radial Gold Fuel Injector Nozzles & Swirlers (Photo 3)
  const injectorCount = 18;
  for (let i = 0; i < injectorCount; i++) {
    const angle = (i * Math.PI * 2) / injectorCount;
    const nozzleGroup = new THREE.Group();
    
    // Stainless steel feed stem
    const stemGeom = new THREE.CylinderGeometry(0.016, 0.016, 0.16, 8);
    const stem = new THREE.Mesh(stemGeom, materials.shaftInner);
    nozzleGroup.add(stem);

    // Polished gold swirler cup
    const tipGeom = new THREE.CylinderGeometry(0.038, 0.024, 0.07, 14);
    tipGeom.translate(0, -0.09, 0);
    const tip = new THREE.Mesh(tipGeom, materials.combustorGold);
    nozzleGroup.add(tip);

    const r = 0.58;
    nozzleGroup.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.32);
    nozzleGroup.rotation.z = angle + Math.PI / 2;
    nozzleGroup.rotation.x = Math.PI / 2;
    combustorGroup.add(nozzleGroup);
  }

  // Dynamic Glowing Flame Core inside combustor (half-ring in cutaway)
  const flameGeom = new THREE.TorusGeometry(0.44, 0.09, 16, 36, Math.PI);
  flameGeom.rotateZ(Math.PI);
  const flameMesh = new THREE.Mesh(flameGeom, materials.combustionFlame);
  flameMesh.position.z = 0.05;
  combustorGroup.add(flameMesh);
  assemblies.combustionFlame = materials.combustionFlame;

  // Spark Igniters on lower combustor casing
  const igniterGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.22, 12);
  const igniter1 = new THREE.Mesh(igniterGeom, materials.accentCyan);
  igniter1.position.set(0.38, -0.52, 0.1);
  igniter1.rotation.z = THREE.MathUtils.degToRad(-40);
  combustorGroup.add(igniter1);

  registerComponentNode(
    'combustor',
    combustorGroup,
    new THREE.Vector3(0, 0, -0.55),
    new THREE.Vector3(0, 0, -1.4)
  );
  assemblies.stationaryCore.add(combustorGroup);

  // ==========================================
  // 5. HIGH PRESSURE TURBINE (HPT)
  // Base Position: Z = -1.25 (HP SPOOL - N2)
  // ==========================================
  const hptGroup = new THREE.Group();
  hptGroup.name = 'HPT_Assembly';

  // 2 stages of Golden Bronze Single-Crystal Superalloy Turbine Blisks (Photo 3)
  const hptStage1 = createBladedDisk(0.38, 0.17, 52, 0.06, 42, materials.superalloyTurbine, true);
  hptStage1.position.z = 0.08;
  hptGroup.add(hptStage1);

  const hptStage2 = createBladedDisk(0.40, 0.18, 56, 0.06, 40, materials.superalloyTurbine, true);
  hptStage2.position.z = -0.10;
  hptGroup.add(hptStage2);

  registerComponentNode(
    'hpt',
    hptGroup,
    new THREE.Vector3(0, 0, -1.25),
    new THREE.Vector3(0, 0, -2.6)
  );
  assemblies.hpSpool.add(hptGroup);

  // ==========================================
  // 6. LOW PRESSURE TURBINE (LPT)
  // Base Position: Z = -2.05 (LP SPOOL - N1)
  // ==========================================
  const lptGroup = new THREE.Group();
  lptGroup.name = 'LPT_Assembly';

  // 4 stages of increasing diameter reaction turbine blisks (TiAl intermetallic alloy - Photo 3)
  const lptStages = [
    { z: 0.25, r: 0.42, bladeLen: 0.20, blades: 60, width: 0.065, angle: 38 },
    { z: 0.08, r: 0.45, bladeLen: 0.22, blades: 64, width: 0.065, angle: 36 },
    { z: -0.09, r: 0.48, bladeLen: 0.25, blades: 68, width: 0.068, angle: 34 },
    { z: -0.26, r: 0.52, bladeLen: 0.28, blades: 72, width: 0.070, angle: 32 }
  ];

  lptStages.forEach(st => {
    const stageMesh = createBladedDisk(st.r, st.bladeLen, st.blades, st.width, st.angle, materials.lptAlloy, true);
    stageMesh.position.z = st.z;
    lptGroup.add(stageMesh);
  });

  registerComponentNode(
    'lpt',
    lptGroup,
    new THREE.Vector3(0, 0, -2.05),
    new THREE.Vector3(0, 0, -4.0)
  );
  assemblies.lpSpool.add(lptGroup);

  // ==========================================
  // 7. DUAL COAXIAL DRIVE SHAFTS (N1 & N2)
  // Base Position: Centerline Axis
  // ==========================================
  const shaftsGroup = new THREE.Group();
  shaftsGroup.name = 'ShaftsAssembly';

  // 7A. Inner Low-Pressure Shaft (Connects LPT to Fan & LPC)
  const innerShaftGeom = new THREE.CylinderGeometry(0.10, 0.10, 4.6, 24);
  innerShaftGeom.rotateX(Math.PI / 2);
  const innerShaftMesh = new THREE.Mesh(innerShaftGeom, materials.shaftInner);
  innerShaftMesh.position.z = -0.1;
  assemblies.lpSpool.add(innerShaftMesh);
  shaftsGroup.add(innerShaftMesh.clone());

  // 7B. Outer High-Pressure Shaft (Hollow sleeve connects HPT to HPC)
  const outerShaftGeom = new THREE.CylinderGeometry(0.18, 0.18, 1.7, 24, 1, true);
  outerShaftGeom.rotateX(Math.PI / 2);
  const outerShaftMesh = new THREE.Mesh(outerShaftGeom, materials.shaftOuter);
  outerShaftMesh.position.z = -0.4;
  assemblies.hpSpool.add(outerShaftMesh);
  shaftsGroup.add(outerShaftMesh.clone());

  // Precision Bearing housings & seal rings
  const bearingGeom = new THREE.TorusGeometry(0.20, 0.035, 12, 28);
  const bearing1 = new THREE.Mesh(bearingGeom, materials.shaftInner);
  bearing1.position.z = 0.55;
  shaftsGroup.add(bearing1);
  const bearing2 = new THREE.Mesh(bearingGeom, materials.shaftInner);
  bearing2.position.z = -1.15;
  shaftsGroup.add(bearing2);

  registerComponentNode(
    'shafts',
    shaftsGroup,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1.4, 0)
  );

  // ==========================================
  // 8. EXHAUST NOZZLE & CENTERBODY CONE
  // Base Position: Z = -3.15 (STATIC CORE)
  // ==========================================
  const exhaustGroup = new THREE.Group();
  exhaustGroup.name = 'ExhaustAssembly';

  // Lower 180° convergent nozzle duct (always visible in cutaway)
  const nozzleLower = createCasingShell(0.58, 0.78, 1.4, 1.5 * Math.PI, Math.PI, materials.exhaustMetal);
  nozzleLower.position.z = -0.4;
  exhaustGroup.add(nozzleLower);

  // Upper nozzle halves attached to cutaway groups
  const nozzleUpperRight = createCasingShell(0.58, 0.78, 1.4, 0.5 * Math.PI, 0.5 * Math.PI, materials.exhaustMetal);
  nozzleUpperRight.position.z = -0.4;
  nozzleUpperRight.position.add(new THREE.Vector3(0, 0, -3.15));
  assemblies.casingUpper.add(nozzleUpperRight);

  const nozzleUpperLeft = createCasingShell(0.58, 0.78, 1.4, Math.PI, 0.5 * Math.PI, materials.exhaustMetal);
  nozzleUpperLeft.position.z = -0.4;
  nozzleUpperLeft.position.add(new THREE.Vector3(0, 0, -3.15));
  assemblies.casingQuarter.add(nozzleUpperLeft);

  // Aerodynamic centerbody tailcone plug (fully exposed in cutaway!)
  const tailconeGeom = new THREE.ConeGeometry(0.42, 1.7, 32);
  tailconeGeom.rotateX(-Math.PI / 2);
  tailconeGeom.translate(0, 0, -0.85);
  const tailcone = new THREE.Mesh(tailconeGeom, materials.exhaustMetal);
  exhaustGroup.add(tailcone);

  // Mixer flutes ring
  const mixerGeom = new THREE.TorusGeometry(0.58, 0.03, 8, 36);
  const mixer = new THREE.Mesh(mixerGeom, materials.titaniumPolished);
  mixer.position.z = -1.1;
  exhaustGroup.add(mixer);

  registerComponentNode(
    'exhaust-nozzle',
    exhaustGroup,
    new THREE.Vector3(0, 0, -3.15),
    new THREE.Vector3(0, 0, -5.6)
  );
  assemblies.stationaryCore.add(exhaustGroup);

  // ==========================================
  // 9. AIR INTAKE COWL (INLET LIP & BARREL - Photo 1)
  // Base Position: Z = 2.85
  // ==========================================
  const intakeGroup = new THREE.Group();
  intakeGroup.name = 'AirIntakeAssembly';

  // Lower 180° polished titanium leading edge lip
  const lipLowerGeom = new THREE.TorusGeometry(2.05, 0.12, 20, 36, Math.PI);
  lipLowerGeom.rotateZ(Math.PI);
  const lipLower = new THREE.Mesh(lipLowerGeom, materials.titaniumPolished);
  lipLower.position.z = 0.55;
  intakeGroup.add(lipLower);

  // Lower 180° subsonic diffuser inlet barrel
  const barrelLower = createCasingShell(2.05, 2.12, 1.1, 1.5 * Math.PI, Math.PI, materials.casingExterior);
  barrelLower.position.z = 0.0;
  intakeGroup.add(barrelLower);

  // Upper Intake Cowl Halves (integrated into Cutaway groups)
  const lipUpperRightGeom = new THREE.TorusGeometry(2.05, 0.12, 20, 24, 0.5 * Math.PI);
  lipUpperRightGeom.rotateZ(0.5 * Math.PI);
  const lipUpperRight = new THREE.Mesh(lipUpperRightGeom, materials.titaniumPolished);
  lipUpperRight.position.set(0, 0, 3.4);
  assemblies.casingUpper.add(lipUpperRight);

  const barrelUpperRight = createCasingShell(2.05, 2.12, 1.1, 0.5 * Math.PI, 0.5 * Math.PI, materials.casingExterior);
  barrelUpperRight.position.set(0, 0, 2.85);
  assemblies.casingUpper.add(barrelUpperRight);

  const lipUpperLeftGeom = new THREE.TorusGeometry(2.05, 0.12, 20, 24, 0.5 * Math.PI);
  lipUpperLeftGeom.rotateZ(0);
  const lipUpperLeft = new THREE.Mesh(lipUpperLeftGeom, materials.titaniumPolished);
  lipUpperLeft.position.set(0, 0, 3.4);
  assemblies.casingQuarter.add(lipUpperLeft);

  const barrelUpperLeft = createCasingShell(2.05, 2.12, 1.1, Math.PI, 0.5 * Math.PI, materials.casingExterior);
  barrelUpperLeft.position.set(0, 0, 2.85);
  assemblies.casingQuarter.add(barrelUpperLeft);

  registerComponentNode(
    'air-intake',
    intakeGroup,
    new THREE.Vector3(0, 0, 2.85),
    new THREE.Vector3(0, 0, 4.5)
  );
  assemblies.stationaryCore.add(intakeGroup);

  // ==========================================
  // 10. ENGINE CASING & NACELLE (PROFESSIONAL DUAL-COWL CUTAWAY - Photo 1 & 2)
  // Outer Fan Nacelle spans Z = 3.2 to 0.75 in machined aerospace alloy
  // Core Casing closely wraps LPC, HPC, Combustor & Turbine
  // ==========================================
  const casingGroup = new THREE.Group();
  casingGroup.name = 'CasingAssembly';

  // 10A. Outer Fan Nacelle (Z = 3.2 to Z = 0.75, Length = 2.45, Center Z = 1.975)
  // Lower 180° Half Nacelle Casing (Y <= 0)
  const nacelleLower = createCasingShell(2.12, 1.98, 2.45, 1.5 * Math.PI, Math.PI, materials.casingExterior);
  nacelleLower.position.z = 1.975;
  assemblies.casingLower.add(nacelleLower);

  // Kevlar fan containment ring lower half (around fan blades at Z = 2.15)
  const kevlarLower = createCasingShell(2.08, 2.08, 0.85, 1.5 * Math.PI, Math.PI, materials.casingInterior);
  kevlarLower.position.z = 2.15;
  assemblies.casingLower.add(kevlarLower);

  // Nacelle Upper Halves (for Full and Quarter Cutaways)
  // Top-Left 90° Quadrant (X <= 0, Y >= 0)
  const nacelleTopLeft = createCasingShell(2.12, 1.98, 2.45, Math.PI, 0.5 * Math.PI, materials.casingExterior);
  nacelleTopLeft.position.z = 1.975;
  assemblies.casingQuarter.add(nacelleTopLeft);

  // Top-Right 90° Quadrant (X >= 0, Y >= 0)
  const nacelleTopRight = createCasingShell(2.12, 1.98, 2.45, 0.5 * Math.PI, 0.5 * Math.PI, materials.casingExterior);
  nacelleTopRight.position.z = 1.975;
  assemblies.casingUpper.add(nacelleTopRight);

  // Outer Nacelle Stiffener Ribs & Flanges (Reference Photo 1)
  [2.75, 2.35, 1.95, 1.55, 1.15].forEach((ribZ) => {
    const ribGeom = new THREE.TorusGeometry(2.12, 0.028, 8, 48, Math.PI);
    ribGeom.rotateZ(Math.PI);
    const ribMesh = new THREE.Mesh(ribGeom, materials.titaniumPolished);
    ribMesh.position.z = ribZ;
    assemblies.casingLower.add(ribMesh);

    // Upper rib segments
    const ribUpperRight = new THREE.TorusGeometry(2.12, 0.028, 8, 24, 0.5 * Math.PI);
    ribUpperRight.rotateZ(0.5 * Math.PI);
    const ribURMesh = new THREE.Mesh(ribUpperRight, materials.titaniumPolished);
    ribURMesh.position.z = ribZ;
    assemblies.casingUpper.add(ribURMesh);

    const ribUpperLeft = new THREE.TorusGeometry(2.12, 0.028, 8, 24, 0.5 * Math.PI);
    ribUpperLeft.rotateZ(0);
    const ribULMesh = new THREE.Mesh(ribUpperLeft, materials.titaniumPolished);
    ribULMesh.position.z = ribZ;
    assemblies.casingQuarter.add(ribULMesh);
  });

  // Outer Nacelle Longitudinal Stiffener Stringers (Reference Photo 1)
  const stringerCount = 12;
  const stringerGeom = new THREE.BoxGeometry(0.025, 0.035, 2.35);
  for (let s = 0; s < stringerCount; s++) {
    const angle = (s * Math.PI * 2) / stringerCount;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const stringer = new THREE.Mesh(stringerGeom, materials.titaniumPolished);
    stringer.position.set(cosA * 2.12, sinA * 2.12, 1.975);
    stringer.rotation.z = angle;

    if (sinA <= 0.01) {
      assemblies.casingLower.add(stringer);
    } else if (cosA >= 0) {
      assemblies.casingUpper.add(stringer);
    } else {
      assemblies.casingQuarter.add(stringer);
    }
  }

  // Safety Orange Cutaway Slice Rims along horizontal split (Y = 0)
  const cutawayRims = new THREE.Group();
  cutawayRims.name = 'CutawayRimsGroup';

  const nacelleRimGeom = new THREE.BoxGeometry(0.06, 0.07, 2.45);
  const nacRimLeft = new THREE.Mesh(nacelleRimGeom, materials.cutawayRim);
  nacRimLeft.position.set(-2.05, 0, 1.975);
  cutawayRims.add(nacRimLeft);

  const nacRimRight = new THREE.Mesh(nacelleRimGeom, materials.cutawayRim);
  nacRimRight.position.set(2.05, 0, 1.975);
  cutawayRims.add(nacRimRight);

  // 10B. Core Casing / Lower Shroud (Z = 0.75 down to Z = -2.35, Length = 3.1, Center Z = -0.80)
  // Closely cradles LPC (R=0.74), HPC (R=0.62), Combustor (R=0.66), and Turbine (R=0.68)
  const coreCasingLower = createCasingShell(0.68, 0.74, 3.1, 1.5 * Math.PI, Math.PI, materials.casingExterior);
  coreCasingLower.position.z = -0.80;
  assemblies.casingLower.add(coreCasingLower);

  // Core Casing Upper Halves (closed only in Full/Quarter mode)
  const coreTopLeft = createCasingShell(0.68, 0.74, 3.1, Math.PI, 0.5 * Math.PI, materials.casingExterior);
  coreTopLeft.position.z = -0.80;
  assemblies.casingQuarter.add(coreTopLeft);

  const coreTopRight = createCasingShell(0.68, 0.74, 3.1, 0.5 * Math.PI, 0.5 * Math.PI, materials.casingExterior);
  coreTopRight.position.z = -0.80;
  assemblies.casingUpper.add(coreTopRight);

  // Core Cutaway Safety Orange Slice Rims along horizontal split (Y = 0)
  const coreRimGeom = new THREE.BoxGeometry(0.05, 0.06, 3.1);
  const coreRimLeft = new THREE.Mesh(coreRimGeom, materials.cutawayRim);
  coreRimLeft.position.set(-0.71, 0, -0.80);
  cutawayRims.add(coreRimLeft);

  const coreRimRight = new THREE.Mesh(coreRimGeom, materials.cutawayRim);
  coreRimRight.position.set(0.71, 0, -0.80);
  cutawayRims.add(coreRimRight);

  casingGroup.add(cutawayRims);
  assemblies.cutawayRims = cutawayRims;

  // Core External Stiffeners and Mechanical Flanges
  [-0.1, -0.9, -1.6].forEach(zPos => {
    const flange = new THREE.TorusGeometry(0.71, 0.02, 8, 36, Math.PI);
    flange.rotateZ(Math.PI);
    const flangeMesh = new THREE.Mesh(flange, materials.titaniumPolished);
    flangeMesh.position.z = zPos;
    assemblies.casingLower.add(flangeMesh);
  });

  // External Stainless Steel Hydraulic & Fuel Lines with B-Nuts (Reference Photo 1)
  const pipePath1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.73, -0.2, 0.6),
    new THREE.Vector3(-0.74, -0.4, 0.0),
    new THREE.Vector3(-0.72, -0.35, -0.8),
    new THREE.Vector3(-0.70, -0.2, -1.8)
  ]);
  const pipeGeom1 = new THREE.TubeGeometry(pipePath1, 32, 0.016, 8, false);
  const pipeMesh1 = new THREE.Mesh(pipeGeom1, materials.shaftInner);
  assemblies.casingLower.add(pipeMesh1);

  const pipePath2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.73, -0.15, 0.5),
    new THREE.Vector3(0.74, -0.3, -0.2),
    new THREE.Vector3(0.72, -0.25, -1.2),
    new THREE.Vector3(0.69, -0.15, -2.1)
  ]);
  const pipeGeom2 = new THREE.TubeGeometry(pipePath2, 32, 0.014, 8, false);
  const pipeMesh2 = new THREE.Mesh(pipeGeom2, materials.shaftInner);
  assemblies.casingLower.add(pipeMesh2);

  // Upper nacelle exterior hydraulic lines (Reference Photo 1)
  const nacPipePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.85, 0.95, 2.7),
    new THREE.Vector3(-1.92, 0.85, 2.0),
    new THREE.Vector3(-1.88, 0.75, 1.3),
    new THREE.Vector3(-1.80, 0.80, 0.9)
  ]);
  const nacPipeGeom = new THREE.TubeGeometry(nacPipePath, 32, 0.018, 8, false);
  const nacPipe = new THREE.Mesh(nacPipeGeom, materials.shaftInner);
  assemblies.casingQuarter.add(nacPipe);

  // In default HALF cutaway, upper casings start invisible so the entire internal core is exposed
  assemblies.casingUpper.visible = false;
  assemblies.casingQuarter.visible = false;

  casingGroup.add(assemblies.casingLower);
  casingGroup.add(assemblies.casingUpper);
  casingGroup.add(assemblies.casingQuarter);

  registerComponentNode(
    'engine-casing',
    casingGroup,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(3.2, 0, 0)
  );

  engineRoot.add(casingGroup);
  assemblies.casingGroup = casingGroup;

  // ==========================================
  // 11. MECHANICAL STRUCTURES & BYPASS STATOR OGVs (Photo 4 & 2)
  // Base Position: Z = 0
  // ==========================================
  const structGroup = new THREE.Group();
  structGroup.name = 'StructuresAssembly';

  // 11A. 36 Aerodynamic Outlet Guide Vanes (OGVs) behind the front fan (Photo 4 & 2)
  // Bridging inner core (R=0.80) to outer fan containment casing (R=2.05) at Z = 1.82
  const ogvCount = 36;
  const ogvGeom = createOGVGeometry();
  
  for (let i = 0; i < ogvCount; i++) {
    const angle = (i * Math.PI * 2) / ogvCount;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    const ogvMesh = new THREE.Mesh(ogvGeom, materials.structuralCast);
    ogvMesh.position.set(cosA * 0.80, sinA * 0.80, 1.82);
    ogvMesh.rotation.z = angle - Math.PI / 2; // Radially outward along span
    ogvMesh.rotation.y = 0.18; // Aerodynamic de-swirl angle

    // Attach to cutaway groups so lower half stays in cutaway while upper half opens
    if (sinA <= 0.01) {
      assemblies.casingLower.add(ogvMesh);
    } else if (cosA >= 0) {
      assemblies.casingUpper.add(ogvMesh);
    } else {
      assemblies.casingQuarter.add(ogvMesh);
    }
  }

  // Core Flow Splitter Ring (separates core inlet from bypass duct)
  const splitterGeom = new THREE.TorusGeometry(0.85, 0.045, 12, 48);
  const splitter = new THREE.Mesh(splitterGeom, materials.titaniumPolished);
  splitter.position.z = 1.72;
  structGroup.add(splitter);

  // Accessory Drive Gearbox (mounted on lower core casing)
  const agbBoxGeom = new THREE.BoxGeometry(0.85, 0.40, 0.95);
  const agbBox = new THREE.Mesh(agbBoxGeom, materials.structuralCast);
  agbBox.position.set(0, -1.05, 0.7);
  structGroup.add(agbBox);

  // Gearbox Auxiliary Drive Cylinders (Fuel Pump, Oil Pump, Starter IDG)
  const pump1Geom = new THREE.CylinderGeometry(0.12, 0.12, 0.32, 16);
  pump1Geom.rotateX(Math.PI / 2);
  const pump1 = new THREE.Mesh(pump1Geom, materials.accentCyan);
  pump1.position.set(-0.25, -1.12, 1.18);
  structGroup.add(pump1);

  const idgGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.42, 16);
  idgGeom.rotateX(Math.PI / 2);
  const idg = new THREE.Mesh(idgGeom, materials.shaftOuter);
  idg.position.set(0.22, -1.10, 1.22);
  structGroup.add(idg);

  // Radial Tower Shaft Housing (transfers N2 core power to gearbox)
  const towerGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12);
  const tower = new THREE.Mesh(towerGeom, materials.shaftInner);
  tower.position.set(0, -0.65, 0.7);
  structGroup.add(tower);

  // Top Wing Pylon Attachment Lugs
  const pylonLugGeom = new THREE.BoxGeometry(0.35, 0.28, 0.6);
  const pylonLug = new THREE.Mesh(pylonLugGeom, materials.structuralCast);
  pylonLug.position.set(0, 2.12, 0.2);
  structGroup.add(pylonLug);

  registerComponentNode(
    'structures',
    structGroup,
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -2.4, 0)
  );
  assemblies.structures.add(structGroup);

  // ==========================================
  // Public Control Methods
  // ==========================================

  /**
   * Updates spool rotation angles based on live N1 and N2 delta times.
   */
  function updateRotation(n1Delta, n2Delta) {
    assemblies.lpSpool.rotation.z += n1Delta;
    assemblies.hpSpool.rotation.z += n2Delta;
  }

  /**
   * Smoothly interpolates exploded view displacement from 0.0 (compact) to 1.0 (fully exploded).
   * Ensures clean separation along the engine axis with zero overlapping.
   */
  function setExplodeProgress(progress) {
    const p = THREE.MathUtils.clamp(progress, 0.0, 1.0);
    assemblies.explodedNodes.forEach(({ node, basePos, explodeOffset }) => {
      node.position.lerpVectors(basePos, basePos.clone().add(explodeOffset), p);
    });
  }

  /**
   * Switches cutaway mode between 'half' (180 deg), 'quarter' (90 deg), and 'full' (enclosed).
   */
  function setCutawayMode(mode) {
    if (mode === 'full') {
      assemblies.casingUpper.visible = true;
      assemblies.casingQuarter.visible = true;
      if (assemblies.cutawayRims) assemblies.cutawayRims.visible = false;
    } else if (mode === 'quarter') {
      assemblies.casingUpper.visible = false;
      assemblies.casingQuarter.visible = true;
      if (assemblies.cutawayRims) assemblies.cutawayRims.visible = true;
    } else {
      assemblies.casingUpper.visible = false;
      assemblies.casingQuarter.visible = false;
      if (assemblies.cutawayRims) assemblies.cutawayRims.visible = true;
    }
  }

  /**
   * Sets visibility of an individual component assembly by ID.
   */
  function setComponentVisibility(id, isVisible) {
    const node = assemblies.componentsMap.get(id);
    if (node) {
      node.visible = isVisible;
    }
  }

  return {
    engineRoot,
    assemblies,
    updateRotation,
    setExplodeProgress,
    setCutawayMode,
    setComponentVisibility
  };
}
