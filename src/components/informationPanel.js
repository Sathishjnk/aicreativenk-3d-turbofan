/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * UI Controller for Component Explorer, Technical Panel & Guided Tour
 */

import { ENGINE_COMPONENTS, TOUR_STEPS } from './componentData.js';

export class InformationPanelController {
  constructor(engineModel, cameraController, interactionHandler) {
    this.engine = engineModel;
    this.camera = cameraController;
    this.interactions = interactionHandler;

    this.selectedComponentId = null;
    this.currentCategory = 'all';
    this.searchQuery = '';

    this.tourStepIndex = 0;
    this.isTourActive = false;

    // DOM Elements
    this.treeList = document.getElementById('component-tree-list');
    this.detailsContainer = document.getElementById('component-details-container');
    this.searchInput = document.getElementById('component-search-input');
    this.searchClearBtn = document.getElementById('search-clear-btn');
    this.filterChips = document.querySelectorAll('.filter-chip');
    this.countBadge = document.getElementById('component-count-badge');
    this.focusBtn = document.getElementById('btn-focus-selected');

    // Tour Elements
    this.tourOverlay = document.getElementById('tour-overlay');
    this.tourTitle = document.getElementById('tour-step-title');
    this.tourContent = document.getElementById('tour-step-content');
    this.tourMetricBadge = document.getElementById('tour-metric-badge');
    this.tourStepCurrent = document.getElementById('tour-step-current');
    this.tourStepTotal = document.getElementById('tour-step-total');
    this.tourDots = document.getElementById('tour-dots-indicator');
    this.tourBtnPrev = document.getElementById('tour-btn-prev');
    this.tourBtnNext = document.getElementById('tour-btn-next');
    this.tourBtnClose = document.getElementById('tour-btn-close');
    this.btnStartTour = document.getElementById('btn-start-tour');

    this.initList();
    this.initFilterEvents();
    this.initTourEvents();

    // Hook into interaction selection
    this.interactions.setOnSelectCallback((id) => this.onComponentSelected(id));
  }

  initList() {
    this.renderComponentList();
  }

  initFilterEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (this.searchClearBtn) {
          if (this.searchQuery) this.searchClearBtn.classList.remove('hidden');
          else this.searchClearBtn.classList.add('hidden');
        }
        this.renderComponentList();
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.searchClearBtn.classList.add('hidden');
        this.renderComponentList();
      });
    }

    this.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentCategory = chip.dataset.category;
        this.renderComponentList();
      });
    });

    if (this.focusBtn) {
      this.focusBtn.addEventListener('click', () => {
        if (this.selectedComponentId) {
          this.focusOnComponent(this.selectedComponentId);
        }
      });
    }

    const closeRightBtn = document.getElementById('btn-close-right-panel');
    if (closeRightBtn) {
      closeRightBtn.addEventListener('click', () => {
        const rightPanel = document.getElementById('right-panel');
        if (rightPanel) rightPanel.classList.add('collapsed');
      });
    }
  }

  renderComponentList() {
    if (!this.treeList) return;
    this.treeList.innerHTML = '';

    const filtered = ENGINE_COMPONENTS.filter(comp => {
      const matchCat = this.currentCategory === 'all' || comp.category === this.currentCategory;
      const matchSearch = !this.searchQuery || 
        comp.name.toLowerCase().includes(this.searchQuery) ||
        comp.purpose.toLowerCase().includes(this.searchQuery) ||
        comp.materials.toLowerCase().includes(this.searchQuery) ||
        comp.subsystem.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    if (this.countBadge) {
      this.countBadge.textContent = `${filtered.length} Parts`;
    }

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'list-empty';
      emptyLi.textContent = 'No matching components found.';
      this.treeList.appendChild(emptyLi);
      return;
    }

    filtered.forEach(comp => {
      const li = document.createElement('li');
      li.className = `component-item ${this.selectedComponentId === comp.id ? 'active' : ''}`;
      li.dataset.id = comp.id;

      // Status indicator color based on spool
      let badgeClass = 'badge-gray';
      if (comp.category === 'spool-lp') badgeClass = 'badge-cyan';
      if (comp.category === 'spool-hp') badgeClass = 'badge-orange';
      if (comp.category === 'combustor') badgeClass = 'badge-red';

      li.innerHTML = `
        <div class="item-main">
          <div class="item-header">
            <span class="item-name">${comp.name}</span>
            <span class="mini-badge ${badgeClass}">${comp.spool.split(' ')[0]}</span>
          </div>
          <div class="item-sub">${comp.station}</div>
        </div>
        <div class="item-actions">
          <button class="visibility-btn" title="Toggle 3D Visibility" data-id="${comp.id}" aria-label="Toggle Visibility">
            <svg class="vis-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg class="vis-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      `;

      li.querySelector('.item-main').addEventListener('click', () => {
        this.interactions.selectComponent(comp.id);
      });

      const visBtn = li.querySelector('.visibility-btn');
      visBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleVisibility(comp.id, visBtn);
      });

      this.treeList.appendChild(li);
    });
  }

  toggleVisibility(id, buttonEl) {
    const node = this.engine.assemblies.componentsMap.get(id);
    if (!node) return;

    const newVis = !node.visible;
    this.engine.setComponentVisibility(id, newVis);

    const onIcon = buttonEl.querySelector('.vis-on');
    const offIcon = buttonEl.querySelector('.vis-off');
    if (newVis) {
      onIcon.classList.remove('hidden');
      offIcon.classList.add('hidden');
      buttonEl.classList.remove('muted');
    } else {
      onIcon.classList.add('hidden');
      offIcon.classList.remove('hidden');
      buttonEl.classList.add('muted');
    }
  }

  onComponentSelected(id) {
    this.selectedComponentId = id;

    // Update left tree list active state
    const items = this.treeList.querySelectorAll('.component-item');
    items.forEach(el => {
      if (el.dataset.id === id) el.classList.add('active');
      else el.classList.remove('active');
    });

    // Update focus button
    if (this.focusBtn) {
      this.focusBtn.disabled = !id;
    }

    // Auto open right panel if collapsed
    const rightPanel = document.getElementById('right-panel');
    if (rightPanel && rightPanel.classList.contains('collapsed')) {
      rightPanel.classList.remove('collapsed');
    }

    if (!id) {
      this.renderPlaceholder();
      return;
    }

    const comp = ENGINE_COMPONENTS.find(c => c.id === id);
    if (comp) {
      this.renderComponentDetails(comp);
    }
  }

  renderPlaceholder() {
    if (!this.detailsContainer) return;
    this.detailsContainer.innerHTML = `
      <div class="empty-selection-placeholder">
        <div class="placeholder-graphic">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="rgba(56, 189, 248, 0.3)" stroke-width="2" stroke-dasharray="6 6"/>
            <polygon points="50,25 65,65 50,55 35,65" fill="#38bdf8" opacity="0.6"/>
          </svg>
        </div>
        <h4>Interactive Engineering Explorer</h4>
        <p>Click any engine component in the 3D viewport, choose from the left component tree, or launch the <strong>Guided Tour</strong> above to inspect in-depth aerospace engineering mechanics.</p>
        <div class="quick-hints">
          <div class="hint-item"><span class="key-badge">Left Click</span> Select Component</div>
          <div class="hint-item"><span class="key-badge">Left Drag</span> 360° Rotate Camera</div>
          <div class="hint-item"><span class="key-badge">Right Drag</span> Pan Camera</div>
          <div class="hint-item"><span class="key-badge">Scroll</span> Zoom In / Out</div>
        </div>
      </div>
    `;
  }

  renderComponentDetails(comp) {
    if (!this.detailsContainer) return;

    let statsHtml = '';
    if (comp.stats) {
      statsHtml = Object.entries(comp.stats).map(([k, v]) => `
        <div class="spec-row">
          <span class="spec-label">${k}</span>
          <span class="spec-val">${v}</span>
        </div>
      `).join('');
    }

    let featuresHtml = '';
    if (comp.keyFeatures) {
      featuresHtml = comp.keyFeatures.map(f => `
        <li class="feature-item">
          <span class="bullet">▹</span>
          <span>${f}</span>
        </li>
      `).join('');
    }

    let relatedHtml = '';
    if (comp.relatedComponents && comp.relatedComponents.length > 0) {
      relatedHtml = comp.relatedComponents.map(relId => {
        const relComp = ENGINE_COMPONENTS.find(c => c.id === relId);
        if (!relComp) return '';
        return `
          <button class="related-tag-btn" data-id="${relId}">
            <span>${relComp.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        `;
      }).join('');
    }

    this.detailsContainer.innerHTML = `
      <div class="detail-card">
        <div class="detail-header-block">
          <div class="detail-subsystem-tag">${comp.subsystem}</div>
          <h2 class="detail-component-title">${comp.name}</h2>
          <div class="detail-station-line">
            <span class="station-icon">📍</span>
            <span>${comp.station}</span>
          </div>
        </div>

        <div class="detail-action-bar">
          <button id="btn-card-focus" class="action-btn-sm highlight-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            <span>Focus Camera</span>
          </button>
          <button id="btn-card-clear" class="action-btn-sm outline-btn">Deselect</button>
        </div>

        <!-- Summary -->
        <div class="detail-section">
          <h4 class="section-title">CORE FUNCTION & PURPOSE</h4>
          <p class="section-text">${comp.purpose}</p>
        </div>

        <!-- Working Principle -->
        <div class="detail-section">
          <h4 class="section-title">AERODYNAMIC & THERMODYNAMIC PRINCIPLE</h4>
          <p class="section-text">${comp.workingPrinciple}</p>
        </div>

        <!-- Specs Grid -->
        <div class="detail-section">
          <h4 class="section-title">ENGINEERING SPECIFICATIONS</h4>
          <div class="specs-table">
            <div class="spec-row">
              <span class="spec-label">Operating Temperature</span>
              <span class="spec-val highlight-amber">${comp.temperature}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Operating Pressure</span>
              <span class="spec-val highlight-cyan">${comp.pressure}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Spool Coupling</span>
              <span class="spec-val">${comp.spool}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Aerospace Materials</span>
              <span class="spec-val">${comp.materials}</span>
            </div>
            ${statsHtml}
          </div>
        </div>

        <!-- Key Engineering Features -->
        ${featuresHtml ? `
        <div class="detail-section">
          <h4 class="section-title">DESIGN HIGHLIGHTS</h4>
          <ul class="features-list">
            ${featuresHtml}
          </ul>
        </div>
        ` : ''}

        <!-- Related Components -->
        ${relatedHtml ? `
        <div class="detail-section">
          <h4 class="section-title">INTERCONNECTED COMPONENTS</h4>
          <div class="related-tags-wrap">
            ${relatedHtml}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    // Bind card buttons
    const cardFocusBtn = this.detailsContainer.querySelector('#btn-card-focus');
    if (cardFocusBtn) {
      cardFocusBtn.addEventListener('click', () => {
        this.focusOnComponent(comp.id);
      });
    }

    const cardClearBtn = this.detailsContainer.querySelector('#btn-card-clear');
    if (cardClearBtn) {
      cardClearBtn.addEventListener('click', () => {
        this.interactions.selectComponent(null);
      });
    }

    const relBtns = this.detailsContainer.querySelectorAll('.related-tag-btn');
    relBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.interactions.selectComponent(btn.dataset.id);
      });
    });
  }

  focusOnComponent(id) {
    const compNode = this.engine.assemblies.componentsMap.get(id);
    if (!compNode) return;

    // Determine optimal camera distance based on component
    let targetLookAt = compNode.position.clone();
    let camOffset = { x: 3.8, y: 1.4, z: 4.2 };

    if (id === 'fan-blades' || id === 'fan-hub') {
      camOffset = { x: 3.2, y: 1.2, z: 4.8 };
    } else if (id === 'combustor' || id === 'hpc') {
      camOffset = { x: 2.6, y: 0.8, z: 1.8 };
    } else if (id === 'hpt' || id === 'lpt') {
      camOffset = { x: 2.8, y: 0.9, z: -1.6 };
    } else if (id === 'exhaust-nozzle') {
      camOffset = { x: 3.2, y: 1.0, z: -4.8 };
    } else if (id === 'structures') {
      camOffset = { x: 2.4, y: -1.8, z: 2.2 };
    }

    const targetPos = targetLookAt.clone().add(camOffset);
    this.camera.animateTo(targetPos, targetLookAt, 1000);
  }

  // ==========================================
  // Guided Tour Implementation
  // ==========================================
  initTourEvents() {
    if (this.btnStartTour) {
      this.btnStartTour.addEventListener('click', () => this.startTour());
    }
    if (this.tourBtnClose) {
      this.tourBtnClose.addEventListener('click', () => this.closeTour());
    }
    if (this.tourBtnPrev) {
      this.tourBtnPrev.addEventListener('click', () => this.prevTourStep());
    }
    if (this.tourBtnNext) {
      this.tourBtnNext.addEventListener('click', () => this.nextTourStep());
    }

    // Initialize dots
    if (this.tourDots) {
      this.tourDots.innerHTML = '';
      TOUR_STEPS.forEach((step, idx) => {
        const dot = document.createElement('div');
        dot.className = `tour-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => this.goToTourStep(idx));
        this.tourDots.appendChild(dot);
      });
    }

    if (this.tourStepTotal) {
      this.tourStepTotal.textContent = TOUR_STEPS.length;
    }
  }

  startTour() {
    this.isTourActive = true;
    this.tourStepIndex = 0;
    if (this.tourOverlay) this.tourOverlay.classList.remove('hidden');
    this.applyTourStep(0);
  }

  closeTour() {
    this.isTourActive = false;
    if (this.tourOverlay) this.tourOverlay.classList.add('hidden');
  }

  goToTourStep(index) {
    if (index >= 0 && index < TOUR_STEPS.length) {
      this.tourStepIndex = index;
      this.applyTourStep(index);
    }
  }

  nextTourStep() {
    if (this.tourStepIndex < TOUR_STEPS.length - 1) {
      this.tourStepIndex++;
      this.applyTourStep(this.tourStepIndex);
    } else {
      this.closeTour();
    }
  }

  prevTourStep() {
    if (this.tourStepIndex > 0) {
      this.tourStepIndex--;
      this.applyTourStep(this.tourStepIndex);
    }
  }

  applyTourStep(index) {
    const step = TOUR_STEPS[index];
    if (!step) return;

    if (this.tourStepCurrent) this.tourStepCurrent.textContent = index + 1;
    if (this.tourTitle) this.tourTitle.textContent = step.title;
    if (this.tourContent) this.tourContent.innerHTML = step.description;

    if (this.tourMetricBadge) {
      this.tourMetricBadge.innerHTML = `
        <span class="metric-key">${step.metricKey}</span>
        <span class="metric-val">${step.metricVal}</span>
      `;
    }

    // Update buttons state
    if (this.tourBtnPrev) this.tourBtnPrev.disabled = index === 0;
    if (this.tourBtnNext) {
      const isLast = index === TOUR_STEPS.length - 1;
      this.tourBtnNext.querySelector('span').textContent = isLast ? 'Finish Tour' : 'Next Stage';
    }

    // Update dots
    if (this.tourDots) {
      const dots = this.tourDots.querySelectorAll('.tour-dot');
      dots.forEach((dot, dIdx) => {
        if (dIdx === index) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    // Select component and fly camera
    this.interactions.selectComponent(step.componentId);

    const targetPos = { x: step.camera.x, y: step.camera.y, z: step.camera.z };
    const targetLookAt = { x: step.camera.targetX, y: step.camera.targetY, z: step.camera.targetZ };
    this.camera.animateTo(targetPos, targetLookAt, 1200);
  }
}
