/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Raycasting, Selection Highlighting & Non-Overlapping 3D Screen Labels
 */

import * as THREE from 'three';
import { ENGINE_COMPONENTS } from '../components/componentData.js';

export class EngineInteractionHandler {
  constructor(scene, camera, engineModel, container, labelsContainer, tooltipElement) {
    this.scene = scene;
    this.camera = camera;
    this.engine = engineModel;
    this.container = container;
    this.labelsContainer = labelsContainer;
    this.tooltip = tooltipElement;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.hoveredComponentId = null;
    this.selectedComponentId = null;
    this.onSelectCallback = null;

    this.isGhostMode = false;
    this.showLabels = true;

    // Cache of original mesh materials for clean highlight restores
    this.originalMaterials = new Map();
    // Cache for emissive restore
    this.originalEmissives = new Map();

    // Staggered 3D Anchor positions for non-overlapping labels, positioned cleanly outside geometry
    this.labelAnchors = [
      { id: 'air-intake', name: 'Air Intake Cowl', pos: new THREE.Vector3(-1.1, 2.40, 2.85) },
      { id: 'fan-hub', name: 'Spinner Cone', pos: new THREE.Vector3(0.0, 1.10, 2.85) },
      { id: 'fan-blades', name: 'Front Fan (N1)', pos: new THREE.Vector3(1.2, 2.35, 2.15) },
      { id: 'lpc', name: 'LPC Booster', pos: new THREE.Vector3(-1.05, 1.70, 1.45) },
      { id: 'hpc', name: 'HPC Core (N2)', pos: new THREE.Vector3(1.05, 1.65, 0.45) },
      { id: 'combustor', name: 'Combustor', pos: new THREE.Vector3(-1.00, 1.65, -0.55) },
      { id: 'hpt', name: 'HP Turbine', pos: new THREE.Vector3(1.00, 1.60, -1.25) },
      { id: 'lpt', name: 'LP Turbine', pos: new THREE.Vector3(-1.05, 1.60, -2.05) },
      { id: 'exhaust-nozzle', name: 'Exhaust Nozzle', pos: new THREE.Vector3(0.0, 1.65, -3.40) },
      { id: 'structures', name: 'Accessory Gearbox', pos: new THREE.Vector3(0.0, -1.85, 0.70) }
    ];

    this.labelElements = new Map();

    this.initEventListeners();
    this.initLabels();
  }

  initEventListeners() {
    this.container.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.container.addEventListener('pointerdown', (e) => {
      this.pointerDownX = e.clientX;
      this.pointerDownY = e.clientY;
    });
    this.container.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - this.pointerDownX, e.clientY - this.pointerDownY);
      if (dist < 6) {
        this.onClick(e);
      }
    });
  }

  onPointerMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.engine.engineRoot.children, true);

    let foundComponentId = null;

    if (intersects.length > 0) {
      for (const hit of intersects) {
        let obj = hit.object;
        while (obj && obj !== this.engine.engineRoot) {
          if (obj.userData && obj.userData.componentId) {
            foundComponentId = obj.userData.componentId;
            break;
          }
          obj = obj.parent;
        }
        if (foundComponentId) break;
      }
    }

    if (foundComponentId !== this.hoveredComponentId) {
      this.setHoveredComponent(foundComponentId, event.clientX, event.clientY);
    } else if (foundComponentId && this.tooltip) {
      this.tooltip.style.left = `${event.clientX + 14}px`;
      this.tooltip.style.top = `${event.clientY + 14}px`;
    }
  }

  setHoveredComponent(id, clientX = 0, clientY = 0) {
    if (this.hoveredComponentId && this.hoveredComponentId !== this.selectedComponentId) {
      this.clearComponentHighlight(this.hoveredComponentId);
    }

    this.hoveredComponentId = id;

    if (id) {
      this.container.style.cursor = 'pointer';
      
      if (id !== this.selectedComponentId) {
        this.applyEmissiveHighlight(id, 0x005577, 0.4);
      }

      if (this.tooltip) {
        const comp = ENGINE_COMPONENTS.find(c => c.id === id);
        if (comp) {
          const badgeEl = this.tooltip.querySelector('.tooltip-badge');
          const titleEl = this.tooltip.querySelector('.tooltip-title');
          if (badgeEl) badgeEl.textContent = comp.spool;
          if (titleEl) titleEl.textContent = comp.name;
          this.tooltip.style.left = `${clientX + 14}px`;
          this.tooltip.style.top = `${clientY + 14}px`;
          this.tooltip.classList.remove('hidden');
        }
      }
    } else {
      this.container.style.cursor = 'default';
      if (this.tooltip) {
        this.tooltip.classList.add('hidden');
      }
    }
  }

  onClick(event) {
    if (this.hoveredComponentId) {
      this.selectComponent(this.hoveredComponentId);
    }
  }

  selectComponent(id) {
    if (this.selectedComponentId) {
      this.clearComponentHighlight(this.selectedComponentId);
      const prevLabel = this.labelElements.get(this.selectedComponentId);
      if (prevLabel) prevLabel.classList.remove('selected');
    }

    this.selectedComponentId = id;

    if (id) {
      this.applyEmissiveHighlight(id, 0x00f0ff, 0.85);

      const activeLabel = this.labelElements.get(id);
      if (activeLabel) activeLabel.classList.add('selected');

      if (this.onSelectCallback) {
        this.onSelectCallback(id);
      }
    } else {
      if (this.onSelectCallback) {
        this.onSelectCallback(null);
      }
    }
  }

  applyEmissiveHighlight(componentId, emissiveHex, intensity) {
    const node = this.engine.assemblies.componentsMap.get(componentId);
    if (!node) return;

    node.traverse((child) => {
      if (child.isMesh && child.material) {
        if (!this.originalEmissives.has(child.id)) {
          this.originalEmissives.set(child.id, {
            emissive: child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000),
            emissiveIntensity: child.material.emissiveIntensity !== undefined ? child.material.emissiveIntensity : 0
          });
        }
        if (child.material.emissive) {
          child.material.emissive.setHex(emissiveHex);
          child.material.emissiveIntensity = intensity;
        }
      }
    });
  }

  clearComponentHighlight(componentId) {
    const node = this.engine.assemblies.componentsMap.get(componentId);
    if (!node) return;

    node.traverse((child) => {
      if (child.isMesh && child.material && this.originalEmissives.has(child.id)) {
        const orig = this.originalEmissives.get(child.id);
        if (child.material.emissive) {
          child.material.emissive.copy(orig.emissive);
          child.material.emissiveIntensity = orig.emissiveIntensity;
        }
      }
    });
  }

  toggleGhostMode() {
    this.isGhostMode = !this.isGhostMode;
    this.engine.engineRoot.traverse((child) => {
      if (child.isMesh && child.material) {
        if (this.isGhostMode) {
          if (!this.originalMaterials.has(child.id)) {
            this.originalMaterials.set(child.id, child.material);
          }
          child.material = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.35
          });
        } else {
          if (this.originalMaterials.has(child.id)) {
            child.material = this.originalMaterials.get(child.id);
          }
        }
      }
    });
    return this.isGhostMode;
  }

  initLabels() {
    if (!this.labelsContainer) return;
    this.labelsContainer.innerHTML = '';

    this.labelAnchors.forEach(item => {
      const pin = document.createElement('div');
      pin.className = 'label-pin';
      pin.innerHTML = `
        <div class="pin-dot"></div>
        <div class="pin-tag">${item.name}</div>
      `;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectComponent(item.id);
      });
      this.labelsContainer.appendChild(pin);
      this.labelElements.set(item.id, pin);
    });
  }

  /**
   * Updates 3D screen labels and performs dynamic 2D collision avoidance
   * so no two component labels overlap on screen.
   */
  updateLabels() {
    if (!this.showLabels || !this.labelsContainer) {
      if (this.labelsContainer) this.labelsContainer.style.display = 'none';
      return;
    }
    this.labelsContainer.style.display = 'block';

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const tempVec = new THREE.Vector3();

    const activeProjected = [];

    // Check if camera is looking directly into the front fan (Front View)
    const isFrontView = this.camera.position.z > 3.8 && Math.abs(this.camera.position.x) < 2.0;

    this.labelAnchors.forEach(item => {
      const pinEl = this.labelElements.get(item.id);
      if (!pinEl) return;

      // In Front view, hide internal labels behind the front fan disc so the fan face is clean
      if (isFrontView && item.pos.z < 2.0) {
        pinEl.style.display = 'none';
        return;
      }

      const compNode = this.engine.assemblies.componentsMap.get(item.id);
      if (compNode && compNode.visible) {
        tempVec.copy(item.pos);
        tempVec.add(compNode.position);

        tempVec.project(this.camera);

        // Behind camera or out of frustum
        if (tempVec.z > 1.0 || tempVec.z < -1.0) {
          pinEl.style.display = 'none';
          return;
        }

        const screenX = (tempVec.x * 0.5 + 0.5) * width;
        const screenY = (-(tempVec.y * 0.5) + 0.5) * height;

        activeProjected.push({
          id: item.id,
          el: pinEl,
          x: screenX,
          y: screenY,
          origY: screenY
        });
      } else {
        pinEl.style.display = 'none';
      }
    });

    // 2D Collision Avoidance Algorithm
    // Prevents tags from clustering/overlapping when viewing along the engine axis
    const minSpacingY = 26;
    const minSpacingX = 110;

    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < activeProjected.length; i++) {
        for (let j = i + 1; j < activeProjected.length; j++) {
          const a = activeProjected[i];
          const b = activeProjected[j];
          const dx = Math.abs(a.x - b.x);
          const dy = Math.abs(a.y - b.y);

          if (dx < minSpacingX && dy < minSpacingY) {
            const overlapY = (minSpacingY - dy) * 0.5;
            if (a.y < b.y) {
              a.y -= overlapY;
              b.y += overlapY;
            } else {
              a.y += overlapY;
              b.y -= overlapY;
            }
          }
        }
      }
    }

    // Apply resolved positions
    activeProjected.forEach(item => {
      item.el.style.display = 'flex';
      item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;
    });
  }

  toggleLabels() {
    this.showLabels = !this.showLabels;
    return this.showLabels;
  }

  setOnSelectCallback(cb) {
    this.onSelectCallback = cb;
  }
}
