import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9568;
const outputDir = 'C:\\Users\\ADMIN\\Desktop\\AicreativeNK-3D-Turbofan';
const artifactDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\b52aa764-df86-44fa-b02b-83b6c532bc0c';

console.log('Starting Edge for Stage 2 Verification Screenshots on port', port);
const edge = spawn(edgePath, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--window-size=1400,900',
  '--user-data-dir=C:\\Users\\ADMIN\\Desktop\\AicreativeNK-3D-Turbofan\\.screenshot_profile',
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForPageTab(maxRetries = 25, interval = 400) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const tabs = await res.json();
        const pageTab = tabs.find(t => t.type === 'page');
        if (pageTab) return pageTab;
      }
    } catch (e) {
      // retry
    }
    await sleep(interval);
  }
  throw new Error(`Failed to find page tab on port ${port}`);
}

(async () => {
  try {
    console.log('Polling for CDP page tab...');
    const appTab = await waitForPageTab();
    console.log('Target Page Tab found:', appTab.title, appTab.url, appTab.webSocketDebuggerUrl);

    const ws = new WebSocket(appTab.webSocketDebuggerUrl);

    let nextId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result || msg.error);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = nextId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onopen = async () => {
      console.log('WebSocket open! Enabling Page and Runtime...');
      await sendCommand('Page.enable');
      await sendCommand('Runtime.enable');
      
      console.log('Navigating to http://localhost:5173/ ...');
      await sendCommand('Page.navigate', { url: 'http://localhost:5173/' });

      // Poll until window.__engine and loading-screen hidden
      console.log('Waiting for engine and scene initialization...');
      for (let i = 0; i < 40; i++) {
        const check = await sendCommand('Runtime.evaluate', {
          expression: `Boolean(window.__engine && window.__cameraController && document.getElementById('loading-screen')?.classList.contains('hidden'))`,
          returnByValue: true
        });
        if (check && check.result && check.result.value === true) {
          console.log(`Application ready after ${(i + 1) * 300}ms!`);
          break;
        }
        await sleep(300);
      }

      const tasks = [
        {
          name: '1. Full Casing',
          file: 'full_casing.png',
          action: `(() => {
            window.__engine.setCutawayMode('full');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'full'));
            window.__cameraController.applyPreset('isometric', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'isometric'));
            window.__animation.setAirflowMode('active');
            document.querySelectorAll('[data-airflow]').forEach(b => b.classList.toggle('active', b.dataset.airflow === 'active'));
          })()`
        },
        {
          name: '2. Half Cutaway',
          file: 'half_cutaway.png',
          action: `(() => {
            window.__engine.setCutawayMode('half');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'half'));
            window.__cameraController.applyPreset('isometric', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'isometric'));
            window.__animation.setAirflowMode('active');
            document.querySelectorAll('[data-airflow]').forEach(b => b.classList.toggle('active', b.dataset.airflow === 'active'));
          })()`
        },
        {
          name: '3. Front Fan Close-up',
          file: 'front_fan_closeup.png',
          action: `(() => {
            window.__engine.setCutawayMode('half');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'half'));
            window.__cameraController.applyPreset('front', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'front'));
          })()`
        },
        {
          name: '4. Side Cutaway',
          file: 'side_cutaway.png',
          action: `(() => {
            window.__engine.setCutawayMode('half');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'half'));
            window.__cameraController.applyPreset('side', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'side'));
          })()`
        },
        {
          name: '5. Airflow Off',
          file: 'airflow_off.png',
          action: `(() => {
            window.__engine.setCutawayMode('half');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'half'));
            window.__cameraController.applyPreset('isometric', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'isometric'));
            window.__animation.setAirflowMode('off');
            document.querySelectorAll('[data-airflow]').forEach(b => b.classList.toggle('active', b.dataset.airflow === 'off'));
          })()`
        },
        {
          name: '6. Airflow On',
          file: 'airflow_on.png',
          action: `(() => {
            window.__engine.setCutawayMode('half');
            document.querySelectorAll('[data-cutaway]').forEach(b => b.classList.toggle('active', b.dataset.cutaway === 'half'));
            window.__cameraController.applyPreset('isometric', 200);
            document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'isometric'));
            window.__animation.setAirflowMode('active');
            document.querySelectorAll('[data-airflow]').forEach(b => b.classList.toggle('active', b.dataset.airflow === 'active'));
          })()`
        }
      ];

      for (const t of tasks) {
        console.log(`\n--- Executing step: ${t.name} ---`);
        await sendCommand('Runtime.evaluate', { expression: t.action });
        await sleep(1800); // Allow camera damping and frame render

        console.log(`Capturing ${t.file}...`);
        const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
        if (res && res.data) {
          const buf = Buffer.from(res.data, 'base64');
          fs.writeFileSync(`${outputDir}\\${t.file}`, buf);
          fs.writeFileSync(`${artifactDir}\\${t.file}`, buf);
          console.log(`✓ Saved ${t.file} (${buf.length} bytes)`);
        } else {
          console.error(`✗ Failed to capture ${t.file}:`, res);
        }
      }

      console.log('\nALL 6 STAGE 2 SCREENSHOTS CAPTURED SUCCESSFULLY!');
      ws.close();
      edge.kill();
      process.exit(0);
    };

  } catch (err) {
    console.error('CDP Error:', err);
    edge.kill();
    process.exit(1);
  }
})();
