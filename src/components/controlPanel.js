/**
 * AicreativeNK - 3D Turbofan Jet Engine Explorer
 * Interactive Control Panel & Audio Engine Controller
 */

export class ControlPanelController {
  constructor(engineModel, animationController, cameraController, interactionHandler) {
    this.engine = engineModel;
    this.animation = animationController;
    this.camera = cameraController;
    this.interactions = interactionHandler;

    // Web Audio Synthesizer for realistic turbine engine sound
    this.audioCtx = null;
    this.isAudioMuted = true;
    this.audioNodes = null;

    this.bindDOM();
    this.bindEvents();
  }

  bindDOM() {
    // Playback
    this.playBtn = document.getElementById('btn-playback-toggle');
    this.playIcon = document.getElementById('playback-icon-play');
    this.pauseIcon = document.getElementById('playback-icon-pause');
    this.playText = document.getElementById('playback-text');
    this.resetBtn = document.getElementById('btn-playback-reset');

    // Throttle
    this.throttleSlider = document.getElementById('throttle-slider');
    this.throttleDisplay = document.getElementById('throttle-display');

    // Exploded View
    this.explodedSlider = document.getElementById('exploded-slider');
    this.explodedDisplay = document.getElementById('exploded-display');

    // Airflow
    this.airflowButtons = document.querySelectorAll('[data-airflow]');
    this.airflowDisplay = document.getElementById('airflow-mode-display');

    // Camera Presets
    this.viewButtons = document.querySelectorAll('[data-view]');

    // Cutaway Modes
    this.cutawayButtons = document.querySelectorAll('[data-cutaway]');

    // Quick Actions
    this.resetAllBtn = document.getElementById('btn-reset-all');
    this.resetViewBtn = document.getElementById('btn-reset-view');
    this.ghostBtn = document.getElementById('btn-toggle-wireframe');
    this.labelsBtn = document.getElementById('btn-toggle-labels');
    this.soundBtn = document.getElementById('btn-toggle-sound');
    this.soundIconOn = document.getElementById('sound-icon-on');
    this.soundIconOff = document.getElementById('sound-icon-off');
    this.fullscreenBtn = document.getElementById('btn-fullscreen');

    // Panel Toggles
    this.toggleLeftBtn = document.getElementById('btn-toggle-left-panel');
    this.toggleRightBtn = document.getElementById('btn-toggle-right-panel');
    this.leftPanel = document.getElementById('left-panel');
    this.rightPanel = document.getElementById('right-panel');

    // Mobile Navigation & Backdrop
    this.mobileMenuBtn = document.getElementById('btn-mobile-menu');
    this.closeMobileNavBtn = document.getElementById('btn-close-mobile-nav');
    this.mobileNavModal = document.getElementById('mobile-nav-modal');
    this.mobileBackdrop = document.getElementById('mobile-backdrop');
    this.expandMobileControlsBtn = document.getElementById('btn-expand-mobile-controls');
    this.bottomControlsBar = document.getElementById('bottom-controls-bar');

    // Mobile Tools Triggers
    this.mobileTourBtn = document.getElementById('mobile-btn-tour');
    this.mobileLabelsBtn = document.getElementById('mobile-btn-labels');
    this.mobileSoundBtn = document.getElementById('mobile-btn-sound');
    this.mobileResetViewBtn = document.getElementById('mobile-btn-reset-view');

    // Telemetry HUD
    this.hudN1Val = document.getElementById('hud-n1-val');
    this.hudN2Val = document.getElementById('hud-n2-val');
    this.hudEgtVal = document.getElementById('hud-egt-val');

    // Auto-collapse side panels on tablet/mobile viewports on load
    if (window.innerWidth <= 1024) {
      if (this.leftPanel) this.leftPanel.classList.add('collapsed');
      if (this.rightPanel) this.rightPanel.classList.add('collapsed');
    }
  }

  bindEvents() {
    // 1. Play / Pause
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        const isPlaying = this.animation.togglePlayPause();
        if (isPlaying) {
          this.playIcon.classList.add('hidden');
          this.pauseIcon.classList.remove('hidden');
          this.playText.textContent = 'PAUSE';
          this.playBtn.classList.remove('paused');
          if (this.audioNodes && !this.isAudioMuted) this.audioNodes.gainNode.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.1);
        } else {
          this.playIcon.classList.remove('hidden');
          this.pauseIcon.classList.add('hidden');
          this.playText.textContent = 'PLAY';
          this.playBtn.classList.add('paused');
          if (this.audioNodes) this.audioNodes.gainNode.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 0.1);
        }
      });
    }

    // 2. Playback Reset
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.animation.reset();
      });
    }

    // 3. Throttle Slider
    if (this.throttleSlider) {
      this.throttleSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.animation.setThrottle(val);
        this.updateThrottleDisplay(val);
        this.updateAudioPitch(val);
      });
    }

    // 4. Exploded View Slider
    if (this.explodedSlider) {
      this.explodedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.engine.setExplodeProgress(val / 100);
        if (this.explodedDisplay) {
          this.explodedDisplay.textContent = val === 0 ? '0% (Assembled)' : `${val}% (Separated)`;
        }
      });
    }

    // 5. Airflow Mode Pills
    this.airflowButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.airflowButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.airflow;
        this.animation.setAirflowMode(mode);
        if (this.airflowDisplay) {
          const names = { active: 'Dynamic Flow', slow: 'Slow Motion', off: 'Disabled' };
          this.airflowDisplay.textContent = names[mode] || mode;
        }
      });
    });

    // 6. Camera View Presets
    const closeMobileNav = () => {
      if (this.mobileNavModal) this.mobileNavModal.classList.add('hidden');
      if (this.mobileBackdrop) this.mobileBackdrop.classList.add('hidden');
    };

    this.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewKey = btn.dataset.view;
        this.viewButtons.forEach(b => {
          if (b.dataset.view === viewKey) b.classList.add('active');
          else b.classList.remove('active');
        });
        this.camera.applyPreset(viewKey, 1000);
        closeMobileNav();
      });
    });

    // 7. Cutaway Mode Buttons
    this.cutawayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.cutaway;
        this.cutawayButtons.forEach(b => {
          if (b.dataset.cutaway === mode) b.classList.add('active');
          else b.classList.remove('active');
        });
        this.engine.setCutawayMode(mode);
        closeMobileNav();
      });
    });

    // 8. Ghost / Wireframe Mode
    if (this.ghostBtn) {
      this.ghostBtn.addEventListener('click', () => {
        const isGhost = this.interactions.toggleGhostMode();
        if (isGhost) this.ghostBtn.classList.add('active');
        else this.ghostBtn.classList.remove('active');
      });
    }

    // 9. 3D Labels Toggle
    if (this.labelsBtn) {
      this.labelsBtn.addEventListener('click', () => {
        const isLabels = this.interactions.toggleLabels();
        if (isLabels) this.labelsBtn.classList.add('active');
        else this.labelsBtn.classList.remove('active');
      });
    }

    // 10. Audio Engine Sound Toggle
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        this.toggleAudio();
      });
    }

    // 11. Reset View
    if (this.resetViewBtn) {
      this.resetViewBtn.addEventListener('click', () => {
        this.camera.applyPreset('isometric', 800);
        this.viewButtons.forEach(b => {
          if (b.dataset.view === 'isometric') b.classList.add('active');
          else b.classList.remove('active');
        });
      });
    }

    // 12. Reset All Settings
    if (this.resetAllBtn) {
      this.resetAllBtn.addEventListener('click', () => {
        this.resetAll();
      });
    }

    // 13. Fullscreen Toggle
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // 14. Responsive Collapsible Panels
    const checkResponsivePanels = () => {
      if (window.innerWidth <= 1024) {
        if (this.leftPanel && !this.leftPanel.dataset.userOpened) {
          this.leftPanel.classList.add('collapsed');
        }
        if (this.rightPanel && !this.rightPanel.dataset.userOpened) {
          this.rightPanel.classList.add('collapsed');
        }
      }
    };
    window.addEventListener('resize', checkResponsivePanels);
    checkResponsivePanels();

    if (this.toggleLeftBtn && this.leftPanel) {
      this.toggleLeftBtn.addEventListener('click', () => {
        const isCollapsed = this.leftPanel.classList.toggle('collapsed');
        this.leftPanel.dataset.userOpened = !isCollapsed ? 'true' : '';
        if (window.innerWidth <= 1024) {
          if (!isCollapsed) {
            if (this.mobileBackdrop) this.mobileBackdrop.classList.remove('hidden');
            if (this.rightPanel) this.rightPanel.classList.add('collapsed');
            if (this.mobileNavModal) this.mobileNavModal.classList.add('hidden');
          } else {
            if (this.mobileBackdrop && (!this.rightPanel || this.rightPanel.classList.contains('collapsed'))) {
              this.mobileBackdrop.classList.add('hidden');
            }
          }
        }
      });
    }

    if (this.toggleRightBtn && this.rightPanel) {
      this.toggleRightBtn.addEventListener('click', () => {
        const isCollapsed = this.rightPanel.classList.toggle('collapsed');
        this.rightPanel.dataset.userOpened = !isCollapsed ? 'true' : '';
        if (window.innerWidth <= 1024) {
          if (!isCollapsed) {
            if (this.mobileBackdrop) this.mobileBackdrop.classList.remove('hidden');
            if (this.leftPanel) this.leftPanel.classList.add('collapsed');
            if (this.mobileNavModal) this.mobileNavModal.classList.add('hidden');
          } else {
            if (this.mobileBackdrop && (!this.leftPanel || this.leftPanel.classList.contains('collapsed'))) {
              this.mobileBackdrop.classList.add('hidden');
            }
          }
        }
      });
    }

    // 15. Mobile Navigation & Overflow Drawer
    const openMobileNav = () => {
      if (this.mobileNavModal) this.mobileNavModal.classList.remove('hidden');
      if (this.mobileBackdrop) this.mobileBackdrop.classList.remove('hidden');
      if (window.innerWidth <= 1024) {
        if (this.leftPanel) this.leftPanel.classList.add('collapsed');
        if (this.rightPanel) this.rightPanel.classList.add('collapsed');
      }
    };

    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => {
        const isHidden = this.mobileNavModal?.classList.contains('hidden');
        if (isHidden) openMobileNav();
        else closeMobileNav();
      });
    }

    if (this.closeMobileNavBtn) {
      this.closeMobileNavBtn.addEventListener('click', closeMobileNav);
    }

    // 16. Mobile Backdrop Outside Tap
    if (this.mobileBackdrop) {
      this.mobileBackdrop.addEventListener('click', () => {
        closeMobileNav();
        if (this.leftPanel) this.leftPanel.classList.add('collapsed');
        if (this.rightPanel) this.rightPanel.classList.add('collapsed');
        if (this.bottomControlsBar) this.bottomControlsBar.classList.remove('mobile-expanded');
      });
    }

    // 17. Mobile Bottom Controls Deck Expander
    if (this.expandMobileControlsBtn && this.bottomControlsBar) {
      this.expandMobileControlsBtn.addEventListener('click', () => {
        this.bottomControlsBar.classList.toggle('mobile-expanded');
      });
    }

    // 18. Forward Mobile Tools Actions
    if (this.mobileTourBtn) {
      this.mobileTourBtn.addEventListener('click', () => {
        closeMobileNav();
        document.getElementById('btn-start-tour')?.click();
      });
    }

    if (this.mobileLabelsBtn) {
      this.mobileLabelsBtn.addEventListener('click', () => {
        closeMobileNav();
        this.labelsBtn?.click();
      });
    }

    if (this.mobileSoundBtn) {
      this.mobileSoundBtn.addEventListener('click', () => {
        closeMobileNav();
        this.soundBtn?.click();
      });
    }

    if (this.mobileResetViewBtn) {
      this.mobileResetViewBtn.addEventListener('click', () => {
        closeMobileNav();
        this.resetViewBtn?.click();
      });
    }
  }

  updateThrottleDisplay(val) {
    if (!this.throttleDisplay) return;
    let label = 'Cruise';
    if (val < 40) label = 'Idle';
    else if (val < 70) label = 'Climb';
    else if (val < 95) label = 'Cruise';
    else if (val <= 100) label = 'Takeoff';
    else label = 'Max Emergency';

    this.throttleDisplay.textContent = `${val}% (${label})`;
  }

  updateTelemetryHUD() {
    const data = this.animation.getTelemetry();
    if (this.hudN1Val) this.hudN1Val.textContent = `${data.n1Pct}%`;
    if (this.hudN2Val) this.hudN2Val.textContent = `${data.n2Pct}%`;
    if (this.hudEgtVal) this.hudEgtVal.textContent = `${data.egtC}°C`;
  }

  resetAll() {
    // Reset throttle
    if (this.throttleSlider) {
      this.throttleSlider.value = 85;
      this.animation.setThrottle(85);
      this.updateThrottleDisplay(85);
    }
    // Reset exploded
    if (this.explodedSlider) {
      this.explodedSlider.value = 0;
      this.engine.setExplodeProgress(0);
      if (this.explodedDisplay) this.explodedDisplay.textContent = '0% (Assembled)';
    }
    // Reset cutaway to half
    this.cutawayButtons.forEach(b => {
      if (b.dataset.cutaway === 'half') b.classList.add('active');
      else b.classList.remove('active');
    });
    this.engine.setCutawayMode('half');

    // Reset airflow to active
    this.airflowButtons.forEach(b => {
      if (b.dataset.airflow === 'active') b.classList.add('active');
      else b.classList.remove('active');
    });
    this.animation.setAirflowMode('active');
    if (this.airflowDisplay) this.airflowDisplay.textContent = 'Dynamic Flow';

    // Reset camera
    this.camera.applyPreset('isometric', 800);
    this.viewButtons.forEach(b => {
      if (b.dataset.view === 'isometric') b.classList.add('active');
      else b.classList.remove('active');
    });

    // Deselect component
    this.interactions.selectComponent(null);
  }

  // ==========================================
  // Web Audio Procedural Turbine Sound Synthesis
  // ==========================================
  initAudio() {
    if (this.audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master Gain
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      masterGain.connect(this.audioCtx.destination);

      // Low rumble osc (N1 spool)
      const rumbleOsc = this.audioCtx.createOscillator();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(65, this.audioCtx.currentTime);

      const rumbleGain = this.audioCtx.createGain();
      rumbleGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      rumbleOsc.start();

      // High turbine whine osc (N2 core spool)
      const whineOsc = this.audioCtx.createOscillator();
      whineOsc.type = 'sine';
      whineOsc.frequency.setValueAtTime(320, this.audioCtx.currentTime);

      const whineGain = this.audioCtx.createGain();
      whineGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      whineOsc.connect(whineGain);
      whineGain.connect(masterGain);
      whineOsc.start();

      this.audioNodes = {
        gainNode: masterGain,
        rumbleOsc,
        whineOsc
      };
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  toggleAudio() {
    this.initAudio();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isAudioMuted = !this.isAudioMuted;

    if (this.isAudioMuted) {
      if (this.soundIconOn) this.soundIconOn.classList.add('hidden');
      if (this.soundIconOff) this.soundIconOff.classList.remove('hidden');
      if (this.soundBtn) this.soundBtn.classList.remove('active');
      if (this.audioNodes) this.audioNodes.gainNode.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 0.1);
    } else {
      if (this.soundIconOn) this.soundIconOn.classList.remove('hidden');
      if (this.soundIconOff) this.soundIconOff.classList.add('hidden');
      if (this.soundBtn) this.soundBtn.classList.add('active');
      if (this.audioNodes) this.audioNodes.gainNode.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.1);
    }
  }

  updateAudioPitch(throttleVal) {
    if (!this.audioNodes || !this.audioCtx || this.isAudioMuted) return;

    const factor = throttleVal / 100;
    // Rumble pitch moves with N1
    const rumbleFreq = 50 + factor * 50;
    // Whine pitch moves with N2
    const whineFreq = 220 + factor * 280;

    this.audioNodes.rumbleOsc.frequency.setTargetAtTime(rumbleFreq, this.audioCtx.currentTime, 0.1);
    this.audioNodes.whineOsc.frequency.setTargetAtTime(whineFreq, this.audioCtx.currentTime, 0.1);
  }
}
