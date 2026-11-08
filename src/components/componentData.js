/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Comprehensive Aerospace Engineering Component Data
 */

export const ENGINE_COMPONENTS = [
  {
    id: 'air-intake',
    name: 'Air Intake & Nacelle Cowl',
    meshName: 'AirIntake',
    category: 'structure',
    subsystem: 'Nacelle & Aerodynamics',
    spool: 'Static Airframe',
    station: 'Station 1.0 - 2.0 (Inlet)',
    temperature: '-55°C to +40°C (-67°F to +104°F)',
    pressure: '1.0 atm (Ambient inlet)',
    materials: 'Aluminum 2024-T3, Carbon Fiber Reinforced Polymer (CFRP), Acoustic Honeycomb Liner',
    summary: 'Aerodynamic duct that decelerates freestream air and provides laminar, uniform flow to the front fan without boundary layer separation.',
    purpose: 'Directs undisturbed atmospheric air smoothly into the engine face across all flight phases (takeoff, cruise, crosswinds, high angles of attack). Houses thermal anti-icing ducting at the leading edge lip and sound-suppressing acoustic liners to attenuate fan noise.',
    workingPrinciple: 'Acts as a subsonic diffuser: slightly expanding cross-sectional area converts air kinetic energy (velocity) into static pressure prior to entering the fan face, preventing stall or supersonic shocks across the blade root.',
    keyFeatures: [
      'Polished titanium/aluminum anti-ice leading edge lip',
      'Dual-layer perforate acoustic sound absorption barrel',
      'Minimizes drag and boundary layer ingestion distortion'
    ],
    relatedComponents: ['fan-blades', 'fan-hub', 'engine-casing'],
    stats: {
      'Inlet Diameter': '2.84 m (112 in)',
      'Diffusion Ratio': '0.78 M at inlet to 0.52 M at fan face',
      'Acoustic Attenuation': '-14 dB EPNL noise reduction',
      'Anti-Ice Bleed': '5th-stage bleed air / electrothermal'
    }
  },
  {
    id: 'fan-blades',
    name: 'Front Fan Blades (N1 Spool)',
    meshName: 'FanBlades',
    category: 'spool-lp',
    subsystem: 'Low-Pressure System (N1)',
    spool: 'N1 Spool (Low Pressure)',
    station: 'Station 2.0 - 2.1 (Fan Face)',
    temperature: '-40°C to +35°C (-40°F to +95°F)',
    pressure: '1.0 to 1.6 atm (Fan Pressure Ratio: 1.55:1)',
    materials: 'Ti-6Al-4V Forged Titanium Alloy / Carbon-Epoxy Composite with Titanium Leading Edge Sheath',
    summary: 'The primary thrust generator of the modern high-bypass turbofan, producing approximately 80% to 85% of total engine thrust.',
    purpose: 'Accelerates massive quantities of ambient air. Approximately 90% of the air bypasses the core entirely through the outer duct for quiet, fuel-efficient propulsive thrust, while the remaining 10% enters the core for combustion and energy production.',
    workingPrinciple: 'Advanced 3D aerodynamic twisted airfoils (scimitar design). The root has a steep camber designed for high pressure rise into the core booster, while the tip operates in the transonic regime with sweep angles designed to minimize shock-wave drag.',
    keyFeatures: [
      '18 hollow wide-chord titanium blades with diffusion bonding',
      'Transonic swept aerodynamic profile eliminating snubber dampers',
      'Dovetail retention slots into the forged fan disk'
    ],
    relatedComponents: ['fan-hub', 'lpc', 'shafts', 'lpt'],
    stats: {
      'Blade Count': '18 Wide-Chord Scimitar Blades',
      'Tip Speed': '410 m/s (Mach 1.25 at sea level takeoff)',
      'Bypass Ratio': '9.8 : 1 (Cold bypass vs Core mass flow)',
      'Rotational Speed': '2,750 RPM (N1 Rated Takeoff)'
    }
  },
  {
    id: 'fan-hub',
    name: 'Fan Hub & Spinner Cone',
    meshName: 'FanHub',
    category: 'spool-lp',
    subsystem: 'Low-Pressure System (N1)',
    spool: 'N1 Spool (Low Pressure)',
    station: 'Station 2.0 (Hub Centerline)',
    temperature: '-50°C to +30°C',
    pressure: '1.0 atm',
    materials: 'Forged Titanium Ti-6-4 Disk, Glass Fiber Composite Spinner Cone with Polyurethane Elastomer Tip',
    summary: 'Aerodynamic nose cone and structural rotor disk that secures the fan blades to the low-pressure shaft.',
    purpose: 'Smoothly splits and guides incoming airflow outward toward the working spans of the fan blades. The iconic painted helical spiral marker visually indicates rotor rotation to airport ground crews for ramp safety.',
    workingPrinciple: 'Conical streamline fairing prevents stagnation flow and flow detachment at the center of the engine face. The soft rubber tip sheds ice accumulation through centrifugal deflection without requiring thermal anti-icing.',
    keyFeatures: [
      'Precision broached dovetail blade slots',
      'Centrifugal de-icing flexible nose cone tip',
      'High-contrast painted visual rotation spiral'
    ],
    relatedComponents: ['fan-blades', 'shafts', 'lpc'],
    stats: {
      'Hub-to-Tip Ratio': '0.31 (High-flow aerodynamic design)',
      'Centrifugal Force': '70 metric tons per blade root at redline',
      'Balance Tolerance': 'Dynamic trim balance within 0.05 oz-in'
    }
  },
  {
    id: 'lpc',
    name: 'Low Pressure Compressor (LPC / Booster)',
    meshName: 'LPC',
    category: 'spool-lp',
    subsystem: 'Low-Pressure System (N1)',
    spool: 'N1 Spool (Low Pressure)',
    station: 'Station 2.1 - 2.5 (Booster)',
    temperature: '35°C to 180°C (95°F to 356°F)',
    pressure: '1.5 to 3.2 atm',
    materials: 'Forged Titanium Ti-6-4 and Ti-6242 Disks and Stators',
    summary: 'Multi-stage axial compressor stages driven directly by the LP turbine via the central shaft, boosting core inlet pressure.',
    purpose: 'Pre-compresses the primary core airflow before it enters the high-pressure compressor (HPC). Features variable bleed valves (VBV) that vent excess air into the bypass duct at low power to prevent compressor surge and stall.',
    workingPrinciple: 'Alternating rows of rotating rotor blades and stationary stator vanes. Rotor blades impart kinetic energy (velocity); stationary stator vanes diffuse the flow, converting kinetic velocity into static pressure.',
    keyFeatures: [
      '3-stage axial compression booster drum',
      'Variable Bleed Valves (VBV) for low-speed stall margin',
      'Rigid mechanical connection to the fan hub'
    ],
    relatedComponents: ['fan-blades', 'hpc', 'shafts', 'structures'],
    stats: {
      'Number of Stages': '3 Booster Stages (Blisks)',
      'Pressure Ratio': '2.2 : 1 across booster',
      'Drive Shaft': 'Directly driven by N1 Low-Pressure Turbine',
      'Rotational Speed': 'Coupled to Fan (2,750 RPM)'
    }
  },
  {
    id: 'hpc',
    name: 'High Pressure Compressor (HPC)',
    meshName: 'HPC',
    category: 'spool-hp',
    subsystem: 'High-Pressure Core (N2)',
    spool: 'N2 Spool (High Pressure)',
    station: 'Station 2.5 - 3.0 (Combustor Inlet)',
    temperature: '180°C to 560°C (356°F to 1,040°F)',
    pressure: '3.2 to 42.5 atm (Overall Pressure Ratio)',
    materials: 'Stages 1-4: Titanium Ti-6242; Stages 5-9: Nickel-based Superalloy Inconel 718 & René 88DT',
    summary: 'High-speed 9-stage axial compressor blisk assembly that delivers intensely compressed air into the combustor.',
    purpose: 'Compresses core air to extreme pressure and temperature, maximizing thermodynamic efficiency according to the Brayton cycle before fuel injection. Also provides customer bleed air for aircraft cabin pressurization and thermal anti-ice.',
    workingPrinciple: 'Progressively decreasing flow annulus forces air through tightly profiled aerofoils at Mach 0.4. Variable Stator Vanes (VSVs) on the first three stages rotate automatically via FADEC fuel hydraulics to maintain optimal angle of attack and prevent aerodynamic stalls.',
    keyFeatures: [
      '9-stage welded blisk (bladed disk) rotor spool',
      'FADEC-actuated Variable Stator Vanes (VSV)',
      'Dual bleed air extraction ports (Stage 5 & Stage 9)'
    ],
    relatedComponents: ['lpc', 'combustor', 'hpt', 'shafts'],
    stats: {
      'Stage Count': '9 Stages (4 Titanium + 5 Nickel Superalloy)',
      'Pressure Ratio': '19.5 : 1 (HPC alone) / 42.5 : 1 (Overall)',
      'Rotational Speed': '11,400 RPM (N2 Spool at 100% MTO)',
      'Discharge Temp (T3)': '545°C (1,013°F) at cruise'
    }
  },
  {
    id: 'combustor',
    name: 'Annular Combustion Chamber',
    meshName: 'Combustor',
    category: 'combustor',
    subsystem: 'Combustion & Energy Release',
    spool: 'Static Core Unit',
    station: 'Station 3.0 - 4.0 (Burner Section)',
    temperature: 'Up to 1,750°C (3,182°F) peak flame temperature',
    pressure: '40.0 to 42.0 atm (Minimal ~3% pressure drop)',
    materials: 'Nickel-base Hastelloy X / Haynes 282, Yttria-Stabilized Zirconia (YSZ) Thermal Barrier Coating (TBC)',
    summary: 'High-intensity annular burner where aviation jet fuel is atomized, mixed with compressed air, and ignited to release thermal energy.',
    purpose: 'Adds intense heat energy to the compressed working fluid, expanding the gas to high velocities to drive the downstream turbines and generate propulsive exhaust thrust with low emissions (NOx, CO, unburned hydrocarbons).',
    workingPrinciple: 'Fuel injectors spray fine atomized kerosene into the primary zone swirler (~20% of airflow). The secondary and dilution air (~80%) flows through effusion cooling micro-holes to create a protective insulating air film over the combustor walls and lower the gas temperature to turbine entry limits.',
    keyFeatures: [
      '18 Lean-burn pre-filming duplex fuel injector nozzles',
      'Full annular single-piece ceramic-lined liner architecture',
      'Dual high-energy igniter plugs for in-flight relight envelope'
    ],
    relatedComponents: ['hpc', 'hpt', 'structures'],
    stats: {
      'Fuel Injector Count': '18 Dual-Orifice Nozzles',
      'Combustion Efficiency': '99.8% at cruise power',
      'Exit Temperature (T4)': '1,560°C (2,840°F) at Turbine Inlet',
      'Burner Residence Time': 'Approx 4 to 6 milliseconds'
    }
  },
  {
    id: 'hpt',
    name: 'High Pressure Turbine (HPT)',
    meshName: 'HPT',
    category: 'spool-hp',
    subsystem: 'High-Pressure Core (N2)',
    spool: 'N2 Spool (High Pressure)',
    station: 'Station 4.0 - 4.5 (HP Turbine)',
    temperature: '1,560°C inlet (exceeds metal melting point of ~1,350°C)',
    pressure: '40 atm expanding down to 12 atm',
    materials: 'Single-Crystal Nickel Superalloys (CMSX-4 / René N5) with Platinum Aluminide and Ceramic TBC',
    summary: 'The most thermodynamically stressed component in the entire engine, extracting energy from white-hot gas to drive the HPC.',
    purpose: 'Converts thermal and kinetic energy from combustion gases into shaft horsepower to spin the High-Pressure Compressor (HPC) and engine accessory gearbox at over 11,000 RPM.',
    workingPrinciple: 'Gas expands through stationary Nozzle Guide Vanes (NGVs), accelerating and striking rotating turbine aerofoils. Internal serpentine cooling passages circulate compressor bleed air through thousands of micro-holes, creating a protective boundary cooling film that prevents the blades from melting.',
    keyFeatures: [
      '2-stage single-crystal casting with zero grain boundaries',
      'Internal serpentine convective and laser-drilled film cooling',
      'Active Clearance Control (ACC) casing cooling for tip clearance'
    ],
    relatedComponents: ['combustor', 'lpt', 'hpc', 'shafts'],
    stats: {
      'Power Output': 'Over 45,000 HP extracted to drive HPC',
      'Blade Temperature': '1,120°C metal skin (cooled by internal bleed air)',
      'Centrifugal Load': 'Equivalent to hanging a double-decker bus from each blade',
      'Rotational Speed': '11,400 RPM (Co-rotates with HPC)'
    }
  },
  {
    id: 'lpt',
    name: 'Low Pressure Turbine (LPT)',
    meshName: 'LPT',
    category: 'spool-lp',
    subsystem: 'Low-Pressure System (N1)',
    spool: 'N1 Spool (Low Pressure)',
    station: 'Station 4.5 - 5.0 (LP Turbine)',
    temperature: '950°C down to 600°C (1,742°F to 1,112°F)',
    pressure: '12 atm expanding down to 1.8 atm',
    materials: 'Disks: Inconel 718; Blades: Cast Inconel 738LC & Titanium-Aluminide (TiAl) in rear stages',
    summary: 'Multi-stage reaction turbine that extracts the remaining gas energy to drive the massive front fan and booster.',
    purpose: 'Extracts maximum remaining energy from the expanding combustion exhaust to turn the central N1 shaft, which drives the front fan and LPC. Because it turns at lower RPM than the core, it requires multiple stages of increasing radius.',
    workingPrinciple: 'Axial-flow reaction turbine stages. The increasing diameter from Stage 1 to Stage 4 accommodates the expanding volume of gas as pressure drops, preserving high aerodynamic stage efficiency.',
    keyFeatures: [
      '4 high-efficiency reaction turbine stages',
      'Lightweight intermetallic Titanium-Aluminide (TiAl) rear blades',
      'Shrouded blade tips with interlocking labyrinth seals'
    ],
    relatedComponents: ['hpt', 'exhaust-nozzle', 'shafts', 'fan-blades'],
    stats: {
      'Number of Stages': '4 Axial Turbine Stages',
      'Power Delivered': 'Approx 60,000 Shaft HP transferred to Front Fan',
      'Efficiency': '93.5% Isentropic Expansion Efficiency',
      'Weight Saving': 'TiAl blades yield 45% weight reduction over nickel'
    }
  },
  {
    id: 'exhaust-nozzle',
    name: 'Exhaust Nozzle & Centerbody Plug',
    meshName: 'ExhaustNozzle',
    category: 'structure',
    subsystem: 'Exhaust & Vectoring',
    spool: 'Static Airframe',
    station: 'Station 8.0 - 9.0 (Core & Bypass Exit)',
    temperature: '500°C to 650°C (Core Exhaust)',
    pressure: '1.2 to 1.8 atm expanding to ambient',
    materials: 'Inconel 625, Titanium Ti-6-4, Honeycomb acoustic heat shield blankets',
    summary: 'Convergent nozzle assembly and aerodynamic tailcone that accelerates gas flow to generate final propulsive jet velocity.',
    purpose: 'Expels hot core gas and cold bypass air into the atmosphere at optimal velocity. The aerodynamic centerbody cone minimizes base drag and turbulence wakes behind the turbine disks.',
    workingPrinciple: 'Convergent duct accelerates subsonic exhaust gas up to critical pressure ratio, converting remaining static pressure into pure propulsive kinetic energy (thrust) according to Newton\'s third law of motion ($F = \\dot{m}(V_{exit} - V_0)$).',
    keyFeatures: [
      'Aerodynamic conical centerbody tailcone plug',
      'Coaxial separate-flow or lobed mixer duct geometry',
      'Chevron serrated trailing edges on modern variants for jet mixing noise abatement'
    ],
    relatedComponents: ['lpt', 'engine-casing', 'structures'],
    stats: {
      'Core Exhaust Velocity': '380 m/s at maximum takeoff thrust',
      'Bypass Exhaust Velocity': '290 m/s',
      'Gross Jet Thrust': 'Approx 15% to 20% of net engine thrust',
      'Thermal Shielding': 'Gold-plated interior heat shields'
    }
  },
  {
    id: 'engine-casing',
    name: 'Engine Casing & Nacelle Cowling',
    meshName: 'EngineCasing',
    category: 'structure',
    subsystem: 'Nacelle & Airframe Structure',
    spool: 'Static Structure',
    station: 'Station 1.0 - 8.0 (External Envelope)',
    temperature: '-55°C (Exterior) to 250°C (Core compartment)',
    pressure: '1.0 atm ambient',
    materials: 'Carbon Fiber / Epoxy Matrix, Kevlar-29 containment fabric band, Stainless steel firewalls',
    summary: 'The outer aerodynamic shell, fan containment case, and structural cowlings that enclose and protect the engine.',
    purpose: 'Provides external aerodynamic streamlining to minimize aircraft cruise drag, provides containment in the event of an uncontained blade-out event (FBO), supports thrust reverser cascades, and encloses accessories in fireproof zones.',
    workingPrinciple: 'The fan case features a thick Kevlar aramid containment wrap capable of stopping a severed titanium blade traveling at 1,500 km/h. Split hinged cowl doors swing open for ramp maintenance access.',
    keyFeatures: [
      'Kevlar-reinforced uncontained blade ballistic containment ring',
      'Bypass duct outer and inner aerodynamic flow guide walls',
      'Titanium/Stainless steel zone fire seal bulkheads'
    ],
    relatedComponents: ['air-intake', 'structures', 'fan-blades'],
    stats: {
      'Containment Capability': 'Stops 100% full-weight fan blade release at redline',
      'Cowl Door Architecture': 'Translating sleeve thrust reverser ready',
      'Weight Proportion': 'Approximately 24% of total installed dry engine weight'
    }
  },
  {
    id: 'shafts',
    name: 'Dual Coaxial Drive Shafts (N1 & N2)',
    meshName: 'InternalShafts',
    category: 'structure',
    subsystem: 'Transmission & Dynamics',
    spool: 'Dual Concentric Spools',
    station: 'Engine Centerline Axis (Front to Rear)',
    temperature: '80°C (Front) to 320°C (Turbine aft bearing)',
    pressure: 'Enclosed pressurized oil sump cavity',
    materials: 'High-strength Vac-melt Chrome-Nickel-Molybdenum alloy steel (300M / Maraging 250)',
    summary: 'Two concentric counter- or co-rotating shafts running down the engine centerline connecting turbines to compressors.',
    purpose: 'Transmits tens of thousands of shaft horsepower from the turbines forward to the compressors and front fan without mechanical binding or vibration.',
    workingPrinciple: 'The outer hollow N2 shaft connects the High-Pressure Turbine to the HPC and rotates at ~11,400 RPM. The inner N1 shaft passes completely through the center of the N2 shaft, connecting the Low-Pressure Turbine to the Front Fan and LPC at ~2,750 RPM, supported by carbon-face oil seals and squeeze-film damper bearings.',
    keyFeatures: [
      'Coaxial dual concentric nested shaft design',
      'Squeeze-film damper roller and ball bearing supports',
      'Splined torque couplings with micro-finish surface honing'
    ],
    relatedComponents: ['fan-blades', 'lpc', 'hpc', 'hpt', 'lpt'],
    stats: {
      'Inner Shaft (N1)': 'Rotates at 2,750 RPM; 3.8 m length, high torsional flexibility',
      'Outer Shaft (N2)': 'Hollow sleeve rotating at 11,400 RPM; high bending stiffness',
      'Bearing Sumps': '5 main bearings (3 ball thrust + 2 roller radial)',
      'Lubrication': 'Mil-PRF-23699 synthetic ester oil circulating at 60 psi'
    }
  },
  {
    id: 'structures',
    name: 'Structural Struts & Accessory Gearbox (AGB)',
    meshName: 'MechanicalStructures',
    category: 'structure',
    subsystem: 'Structure & Auxiliary Systems',
    spool: 'Auxiliary & Static Framing',
    station: 'Station 2.5 (Fan Frame) & Lower Fan Case',
    temperature: 'Ambient to 120°C (Oil circuit)',
    pressure: 'Hydraulic 3,000 psi / Fuel 1,200 psi',
    materials: 'Cast Titanium Fan Frame, Magnesium / Aluminum Gearbox Housing, Forged Nitralloy Gears',
    summary: 'Radial load-carrying structural struts, core outlet guide vanes, and the auxiliary drive gearbox powering engine accessories.',
    purpose: 'Transfers engine thrust loads into the aircraft wing pylon mounts. The accessory gearbox extracts radial mechanical power via a tower shaft bevel gear to drive the fuel metering unit, engine lubrication pump, hydraulic pump, and integrated starter/generator (IDG).',
    workingPrinciple: 'Bevel gear off the high-pressure spool drives a 90° radial tower shaft down through one of the hollow aerodynamic struts into the lower gearbox. Spur gears step up and step down drive speeds for each auxiliary unit.',
    keyFeatures: [
      'Structural fan frame with integrated pylon attachment lugs',
      'Aerodynamic outlet guide vanes (OGVs) deswirling fan bypass air',
      'Multi-pad accessory gearbox with quick-attach-detach (QAD) flanges'
    ],
    relatedComponents: ['engine-casing', 'hpc', 'shafts'],
    stats: {
      'Accessories Driven': 'Fuel Pump, Oil Pump, 120kVA IDG Generator, Hyd Pump',
      'Thrust Reaction': 'Reacts up to 85,000 lbf of forward thrust load into pylon',
      'Gearbox Ratio': '0.72x to 1.85x N2 spool speed depending on auxiliary pad'
    }
  }
];

export const TOUR_STEPS = [
  {
    step: 1,
    title: 'Dual-Spool High-Bypass Architecture',
    componentId: 'fan-blades',
    metricKey: 'STATION 1-2 • THE FRONT FACE',
    metricVal: '85% Total Thrust via Cold Bypass Duct',
    camera: { x: 5.2, y: 1.8, z: 6.8, targetX: 0, targetY: 0, targetZ: 1.5 },
    description: `Modern commercial aviation relies on high-bypass turbofans. The massive front fan ingests atmospheric air, dividing it into two streams: the <strong>cold bypass stream</strong> (~90% mass flow) that flows around the core generating quiet, fuel-efficient thrust, and the <strong>core stream</strong> (~10%) that powers the engine thermodynamic cycle.`
  },
  {
    step: 2,
    title: 'Low Pressure Compression (LPC & Booster)',
    componentId: 'lpc',
    metricKey: 'STATION 2.1 - 2.5 • BOOSTER SECTION',
    metricVal: 'Pressure Ratio: 2.2:1 • Direct N1 Drive',
    camera: { x: 3.2, y: 1.2, z: 3.5, targetX: 0, targetY: 0, targetZ: 1.2 },
    description: `As core air enters through the core splitter fairing, the Low Pressure Compressor (LPC booster) stages pre-compress the air. Driven directly by the low-pressure shaft from the rear turbine, the booster ensures smooth, non-turbulent feeding into the high-pressure core.`
  },
  {
    step: 3,
    title: 'High Pressure Compressor (HPC Core)',
    componentId: 'hpc',
    metricKey: 'STATION 2.5 - 3.0 • EXTREME COMPRESSION',
    metricVal: '42.5:1 Overall Pressure Ratio • 11,400 RPM (N2)',
    camera: { x: 2.8, y: 0.9, z: 0.8, targetX: 0, targetY: 0, targetZ: 0.2 },
    description: `The 9-stage HPC spool turns at over 11,000 RPM. Compressing air to over 40 atmospheres elevates air temperature to over 540°C (1,000°F). Notice the tapering drum: as the air compresses, its volume decreases, requiring increasingly tight titanium and nickel blisks.`
  },
  {
    step: 4,
    title: 'Annular Combustor & Energy Injection',
    componentId: 'combustor',
    metricKey: 'STATION 3.0 - 4.0 • FLAME ZONE',
    metricVal: 'Peak Flame Temp: 1,750°C (3,180°F)',
    camera: { x: 2.2, y: 0.8, z: -0.6, targetX: 0, targetY: 0, targetZ: -0.8 },
    description: `Aviation kerosene is injected at high pressure through 18 fuel nozzles and atomized with compressed air. The continuous flame releases massive thermal energy. Micro-holes in the ceramic-coated liner provide effusion cooling films to protect the metal from melting.`
  },
  {
    step: 5,
    title: 'Turbine Power Extraction (HPT & LPT)',
    componentId: 'hpt',
    metricKey: 'STATION 4.0 - 5.0 • EXPANSION STAGES',
    metricVal: 'Extracts >100,000 Combined Shaft Horsepower',
    camera: { x: 3.0, y: 1.1, z: -2.4, targetX: 0, targetY: 0, targetZ: -2.0 },
    description: `White-hot expanding gas first strikes the High Pressure Turbine (HPT), spinning the outer shaft to drive the HPC. Next, the gas expands through 4 Low Pressure Turbine (LPT) stages, spinning the inner shaft to power the front fan. Advanced single-crystal superalloys withstand forces greater than a locomotive pulling each blade.`
  },
  {
    step: 6,
    title: 'Exhaust Acceleration & Net Thrust',
    componentId: 'exhaust-nozzle',
    metricKey: 'STATION 8-9 • CONVERGENT EXIT',
    metricVal: '380 m/s Core Jet Velocity • Centerbody Plug',
    camera: { x: 3.8, y: 1.4, z: -5.4, targetX: 0, targetY: 0, targetZ: -3.8 },
    description: `Finally, the exhaust nozzle accelerates remaining core gases outward over the aerodynamic centerbody tailcone. Mixed with the outer high-bypass cold air, the combined momentum flux pushes the engine forward with up to 74,000 lbf of net takeoff thrust.`
  }
];
