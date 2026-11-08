/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Animation & Dynamic Aerodynamic Streamline Flow System
 * Stage 2 Visual Refinement: Smooth continuous CFD streamline curves,
 * directional comet fluid pulses, cyan bypass airflow, and fiery orange core flow.
 */

import * as THREE from 'three';

export class EngineAnimationController {
  constructor(engineModel, materials) {
    this.engine = engineModel;
    this.materials = materials;

    this.isPlaying = true;
    this.throttle = 85; // 20% to 115%
    this.timeScale = 1.0;
    this.airflowMode = 'active'; // 'active', 'slow', 'off'

    // Spool rotation angles
    this.n1Angle = 0;
    this.n2Angle = 0;

    // Airflow Streamline System
    this.airflowGroup = new THREE.Group();
    this.airflowGroup.name = 'AirflowSystem';
    this.engine.engineRoot.add(this.airflowGroup);

    this.streamlines = [];
    this.pulses = [];
    this.pulsePoints = null;

    this.initStreamlines();
  }

  /**
   * Builds smooth continuous 3D aerodynamic streamline curves and directional fluid flow pulses.
   */
  initStreamlines() {
    this.streamlines = [];
    this.pulses = [];

    // ==========================================
    // 1. Bypass Streamlines (12 continuous aerodynamic splines)
    // Cold Cyan / Sky Blue throughout the bypass duct
    // ==========================================
    const bypassCount = 12;
    for (let i = 0; i < bypassCount; i++) {
      const baseAngle = (i * Math.PI * 2) / bypassCount;
      const swirl = 0.35; // Aerodynamic swirl across fan blades

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(baseAngle) * 1.95, Math.sin(baseAngle) * 1.95, 3.8),
        new THREE.Vector3(Math.cos(baseAngle) * 1.92, Math.sin(baseAngle) * 1.92, 2.9),
        new THREE.Vector3(Math.cos(baseAngle + swirl * 0.5) * 1.84, Math.sin(baseAngle + swirl * 0.5) * 1.84, 2.15),
        new THREE.Vector3(Math.cos(baseAngle + swirl) * 1.76, Math.sin(baseAngle + swirl) * 1.76, 1.3),
        new THREE.Vector3(Math.cos(baseAngle + swirl * 1.1) * 1.68, Math.sin(baseAngle + swirl * 1.1) * 1.68, 0.6)
      ]);

      const points = curve.getPoints(45);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending
      });

      const lineMesh = new THREE.Line(geom, lineMat);
      this.airflowGroup.add(lineMesh);

      this.streamlines.push({
        curve,
        isBypass: true
      });

      // 3 directional comet flow pulses along each streamline
      for (let p = 0; p < 3; p++) {
        this.pulses.push({
          curve,
          isBypass: true,
          progress: (p / 3) + (i / bypassCount) * 0.25,
          speed: 0.22
        });
      }
    }

    // ==========================================
    // 2. Core Primary Flow Streamlines (8 continuous thermal splines)
    // Temperature gradient: Cyan (intake) -> Gold (HPC) -> Fiery Orange (Combustor) -> Exhaust
    // ==========================================
    const coreCount = 8;
    for (let i = 0; i < coreCount; i++) {
      const baseAngle = (i * Math.PI * 2) / coreCount;
      const coreSwirl = 0.85; // Intense core swirl through multi-stage compressor and turbines

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(baseAngle) * 0.62, Math.sin(baseAngle) * 0.62, 3.2),
        new THREE.Vector3(Math.cos(baseAngle) * 0.56, Math.sin(baseAngle) * 0.56, 2.15),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl * 0.2) * 0.50, Math.sin(baseAngle + coreSwirl * 0.2) * 0.50, 1.45),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl * 0.4) * 0.42, Math.sin(baseAngle + coreSwirl * 0.4) * 0.42, 0.45),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl * 0.6) * 0.44, Math.sin(baseAngle + coreSwirl * 0.6) * 0.44, -0.55),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl * 0.8) * 0.46, Math.sin(baseAngle + coreSwirl * 0.8) * 0.46, -1.25),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl) * 0.50, Math.sin(baseAngle + coreSwirl) * 0.50, -2.05),
        new THREE.Vector3(Math.cos(baseAngle + coreSwirl * 1.1) * 0.60, Math.sin(baseAngle + coreSwirl * 1.1) * 0.60, -3.8)
      ]);

      const points = curve.getPoints(60);
      const colors = new Float32Array(points.length * 3);

      for (let j = 0; j < points.length; j++) {
        const t = j / (points.length - 1);
        let r = 0, g = 0, b = 0;

        if (t < 0.25) {
          // Intake & Booster (Cyan)
          r = 0.05; g = 0.90; b = 1.0;
        } else if (t < 0.45) {
          // HPC Compression (Cyan -> Golden Amber)
          const f = (t - 0.25) / 0.20;
          r = THREE.MathUtils.lerp(0.05, 1.0, f);
          g = THREE.MathUtils.lerp(0.90, 0.72, f);
          b = THREE.MathUtils.lerp(1.0, 0.08, f);
        } else if (t < 0.70) {
          // Annular Combustor & HPT (Fiery Orange / Flame Glow)
          const f = (t - 0.45) / 0.25;
          r = 1.0;
          g = THREE.MathUtils.lerp(0.48, 0.38, f);
          b = 0.02;
        } else {
          // LPT & Exhaust Jet (Deep Amber / Fire)
          const f = (t - 0.70) / 0.30;
          r = THREE.MathUtils.lerp(1.0, 0.96, f);
          g = THREE.MathUtils.lerp(0.38, 0.22, f);
          b = 0.02;
        }

        colors[j * 3 + 0] = r;
        colors[j * 3 + 1] = g;
        colors[j * 3 + 2] = b;
      }

      const geom = new THREE.BufferGeometry().setFromPoints(points);
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });

      const lineMesh = new THREE.Line(geom, lineMat);
      this.airflowGroup.add(lineMesh);

      this.streamlines.push({
        curve,
        isBypass: false
      });

      // 4 directional comet flow pulses along each core streamline
      for (let p = 0; p < 4; p++) {
        this.pulses.push({
          curve,
          isBypass: false,
          progress: (p / 4) + (i / coreCount) * 0.25,
          speed: 0.24
        });
      }
    }

    // ==========================================
    // 3. Flow Pulses Buffer (Smooth directional comet beads)
    // ==========================================
    const pulseCount = this.pulses.length;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);

    const pulseGeom = new THREE.BufferGeometry();
    pulseGeom.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeom.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 4.5,
      sizeAttenuation: false, // Screen-space pixel sizing: crisp, subtle, never white-out
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pulsePoints = new THREE.Points(pulseGeom, pulseMat);
    this.pulsePoints.name = 'StreamlineFlowPulses';
    this.airflowGroup.add(this.pulsePoints);
  }

  /**
   * Main per-frame animation update.
   */
  update(delta) {
    if (!this.isPlaying) return;

    const clampedDelta = Math.min(delta, 0.1);
    const throttleFactor = this.throttle / 100;

    // 1. Spool Rotations
    // N1 Low Pressure Spool: ~2,750 RPM equivalent
    const n1Speed = 3.2 * throttleFactor * this.timeScale;
    // N2 High Pressure Spool: ~11,400 RPM equivalent (3.6x faster than N1)
    const n2Speed = n1Speed * 3.6;

    const n1Delta = n1Speed * clampedDelta;
    const n2Delta = n2Speed * clampedDelta;

    this.n1Angle += n1Delta;
    this.n2Angle += n2Delta;

    this.engine.updateRotation(n1Delta, n2Delta);

    // 2. Dynamic Combustion Flame Pulse
    if (this.materials.combustionFlame) {
      const pulse = 0.75 + Math.sin(this.n2Angle * 4.0) * 0.15 + (Math.random() - 0.5) * 0.08;
      this.materials.combustionFlame.opacity = THREE.MathUtils.clamp(pulse * throttleFactor, 0.3, 1.0);
    }

    // 3. Airflow Streamlines & Pulses Update
    if (this.airflowMode === 'off') {
      this.airflowGroup.visible = false;
    } else {
      this.airflowGroup.visible = true;
      const speedMult = (this.airflowMode === 'slow' ? 0.25 : 1.0) * throttleFactor * this.timeScale;

      if (this.pulsePoints) {
        const posAttr = this.pulsePoints.geometry.attributes.position;
        const colAttr = this.pulsePoints.geometry.attributes.color;

        for (let i = 0; i < this.pulses.length; i++) {
          const p = this.pulses[i];
          p.progress = (p.progress + p.speed * clampedDelta * speedMult) % 1.0;

          const pt = p.curve.getPointAt(p.progress);
          posAttr.setXYZ(i, pt.x, pt.y, pt.z);

          if (p.isBypass) {
            // Crisp Cyan for bypass air
            colAttr.setXYZ(i, 0.0, 0.95, 1.0);
          } else {
            // Warm fiery orange gradient for core airflow
            const prog = p.progress;
            if (prog < 0.25) {
              colAttr.setXYZ(i, 0.1, 0.9, 1.0); // Cyan at intake
            } else if (prog < 0.45) {
              const f = (prog - 0.25) / 0.20;
              colAttr.setXYZ(i, THREE.MathUtils.lerp(0.1, 1.0, f), THREE.MathUtils.lerp(0.9, 0.75, f), THREE.MathUtils.lerp(1.0, 0.1, f)); // Amber
            } else if (prog < 0.70) {
              colAttr.setXYZ(i, 1.0, 0.42, 0.02); // Fiery Orange
            } else {
              colAttr.setXYZ(i, 0.98, 0.26, 0.02); // Exhaust
            }
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }
    }
  }

  /**
   * Returns live telemetry readings based on current throttle.
   */
  getTelemetry() {
    const factor = this.throttle / 100;
    
    // N1: 22% at Idle, 102% at Max
    const n1Pct = (22 + factor * 80).toFixed(1);
    const n1Rpm = Math.round(700 + factor * 2200);

    // N2: 58% at Idle, 106% at Max
    const n2Pct = (58 + factor * 48).toFixed(1);
    const n2Rpm = Math.round(6200 + factor * 5300);

    // Exhaust Gas Temp (EGT): 420°C at Idle, 1140°C at Max
    const egtC = Math.round(420 + Math.pow(factor, 1.4) * 720);
    const egtF = Math.round(egtC * 1.8 + 32);

    // Net Thrust: 4,500 lbf at Idle, 74,000 lbf at 100%
    const thrustLbf = Math.round(4500 + Math.pow(factor, 2.2) * 69500);
    const thrustKN = (thrustLbf * 0.00444822).toFixed(1);

    return {
      n1Pct,
      n1Rpm,
      n2Pct,
      n2Rpm,
      egtC,
      egtF,
      thrustLbf,
      thrustKN
    };
  }

  setThrottle(value) {
    this.throttle = THREE.MathUtils.clamp(value, 20, 115);
  }

  setAirflowMode(mode) {
    this.airflowMode = mode;
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }

  reset() {
    this.n1Angle = 0;
    this.n2Angle = 0;
    this.engine.assemblies.lpSpool.rotation.z = 0;
    this.engine.assemblies.hpSpool.rotation.z = 0;
    this.pulses.forEach((p, idx) => {
      p.progress = (idx / this.pulses.length);
    });
  }
}
