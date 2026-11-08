# AicreativeNK – 3D Turbofan Explorer

**A professional, interactive, realistic 3D turbofan jet engine engineering visualization web application created for AicreativeNK.**

---

## 🚀 Overview

**AicreativeNK – 3D Turbofan Explorer** is an interactive 3D engineering learning platform built with **Three.js**, **WebGL**, and **Vite**. It models an authentic twin-spool, high-bypass turbofan jet engine (modeled on CFM LEAP / GE90 / Trent architecture), complete with cutaway views, real-time dual-spool rotational mechanics, dynamic aerodynamic particle streams, exploded component separation, and in-depth aerospace technical specifications.

---

## 🛠️ Technology Stack & Performance

- **3D Engine:** Three.js (v0.187+)
- **Build Tool:** Vite
- **Architecture:** Lightweight Vanilla ES Modules (Zero heavyweight UI frameworks)
- **Controls:** OrbitControls (360° rotation, smooth damping, zoom limits, panning)
- **Model Support:** Full procedural 3D engineering cutaway + built-in `GLTFLoader` support for external CAD/GLB asset import
- **Hardware Optimization:** Specifically tuned for Intel Core i3-5005U with Intel HD Graphics 5500:
  - Capped device pixel ratio (1.5x)
  - Instanced / merged buffer geometries
  - Efficient single-buffer particle system for airflow
  - In-memory procedural PBR textures (zero external network latency)
  - Automatic memory cleanup and resource disposal

---

## ✈️ Engine Components Modeled

1. **Air Intake & Nacelle Cowl:** Subsonic diffuser with polished titanium anti-ice leading edge lip and acoustic honeycomb absorption barrel.
2. **Front Fan Blades (N1 Spool):** 18 aerodynamically twisted wide-chord scimitar blades with dovetail root retention slots, generating 85% of total thrust.
3. **Fan Hub & Spinner Cone:** Aerodynamic nose cone with signature painted helical rotation spiral marker and soft elastomer centrifugal de-icing tip.
4. **Low Pressure Compressor (LPC / Booster):** 3-stage axial compression booster drum directly driven by the low-pressure shaft.
5. **High Pressure Compressor (HPC):** 9-stage welded blisk rotor spool with variable stator vanes (VSVs) and titanium/nickel superalloys achieving a 42.5:1 overall pressure ratio.
6. **Annular Combustion Chamber:** Ceramic-lined annular burner with 18 radial duplex fuel injector nozzles, dilution air effusion micro-holes, spark igniters, and pulsing dynamic flame glow.
7. **High Pressure Turbine (HPT):** 2-stage single-crystal nickel superalloy (CMSX-4) turbine blisks with serpentine convective cooling channels extracting 45,000+ HP to drive the HPC.
8. **Low Pressure Turbine (LPT):** 4-stage reaction turbine expanding exhaust gases to drive the massive front fan and LPC at lower RPM.
9. **Exhaust Nozzle & Centerbody:** Convergent nozzle duct with aerodynamic centerbody tailcone plug and mixer flutes to maximize net propulsive jet thrust.
10. **Engine Casing & Nacelle:** Split cutaway casing supporting **180° Half Cutaway**, **90° Quarter Cutaway**, and **Full Casing** modes with Kevlar ballistic containment bands.
11. **Dual Coaxial Drive Shafts:** Inner LP shaft (connecting LPT to Fan/LPC) and concentric outer HP hollow shaft (connecting HPT to HPC) with squeeze-film damper bearings.
12. **Mechanical Structures & Accessory Gearbox (AGB):** 6 aerodynamic outlet guide vanes/struts, core flow splitter, and lower gearbox driving fuel, oil, and starter/generator units via a radial tower shaft.

---

## 🎮 Interactive Features

- **360° Engineering Viewport:** Mouse drag to rotate, right drag to pan, scroll wheel to zoom.
- **Cinematic Preset Views:** Front (Fan face), Side (Flow path profile), Top (Plan view), Isometric (3/4 beauty view), and Aft (Exhaust nozzle).
- **Exploded View System:** Smooth slider (0% to 100%) dynamically separating engine modules along the thrust axis and radial casings.
- **Cutaway Modes:** Instantly toggle between Half Cutaway, Quarter Cutaway, and Full Nacelle.
- **Raycasting Component Inspection:** Hover over any part to see highlights and tooltips; click to reveal technical specifications in the right panel.
- **Dual-Spool Independent Rotation:** Authentic speed differential between the low-pressure N1 spool (~2,750 RPM) and high-pressure N2 spool (~11,400 RPM).
- **Dynamic Aerodynamic Particle Airflow:**
  - **Cold Bypass Stream:** Cyan particles flowing through the outer duct.
  - **Core Primary Compression Stream:** Color shifting from light cyan to golden amber as temperature and pressure rise.
  - **Combustion & Exhaust Stream:** Fiery orange/yellow flame expansion blasting out as high-velocity thrust streaks.
- **Interactive Guided Learning Tour:** 6-stage guided aerospace masterclass with cinematic camera glides and educational technical insights.
- **Synthesized Turbine Sound:** 100% procedural Web Audio engine simulating realistic low-frequency spool rumble and high-frequency jet whine synchronized with the throttle slider.
- **3D Floating Pin Labels:** Toggleable screen-space annotations pinned directly to engine components.
- **Live Telemetry HUD:** Real-time digital readouts for N1 RPM %, N2 RPM %, EGT (Exhaust Gas Temp), and Net Thrust.

---

## 💻 How to Run the Project

### 1. Development Server
```bash
# Navigate to the project directory
cd AicreativeNK-3D-Turbofan

# Start Vite local development server
npm run dev
```
Open the local URL displayed in your terminal (typically `http://localhost:5173`) in any modern WebGL-compatible browser.

### 2. Production Build
```bash
# Build production-ready optimized assets
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```
AicreativeNK-3D-Turbofan/
├── index.html                       # Main HTML5 entry point & layout
├── package.json                     # Vite & Three.js dependencies & scripts
├── README.md                        # Documentation & technical guide
├── src/
│   ├── main.js                      # Application orchestrator & animation loop
│   ├── style.css                    # Aerospace glassmorphism dark theme UI
│   ├── three/
│   │   ├── scene.js                 # Three.js Scene, studio lighting & WebGLRenderer
│   │   ├── camera.js                # Camera setup, presets & smooth transitions
│   │   ├── controls.js              # OrbitControls configuration & damping
│   │   ├── materials.js             # Procedural PBR aerospace metallic materials
│   │   ├── engine.js                # 12-component procedural turbofan 3D geometry
│   │   ├── animation.js             # Dual-spool rotation & dynamic airflow particles
│   │   └── interactions.js          # Raycasting, hover/select highlights & 3D labels
│   ├── components/
│   │   ├── componentData.js         # Comprehensive aerospace technical database
│   │   ├── informationPanel.js      # Component explorer list, details & guided tour
│   │   └── controlPanel.js          # Telemetry, sliders, presets & sound synthesizer
│   └── assets/
│       ├── models/                  # Ready for external CAD / GLB models
│       └── textures/                # Custom texture storage
```

---

## ⚖️ Educational Notice
This application is designed as an educational aerospace engineering visualizer. Animations and particle systems illustrate functional aerodynamic and thermodynamic principles (Brayton cycle) and are not physically calibrated CFD/FEA engineering simulations.
