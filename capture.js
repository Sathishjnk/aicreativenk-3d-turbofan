import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9444;

console.log('Starting Edge for screenshot capture...');
const edge = spawn(edgePath, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--window-size=1280,800',
  '--user-data-dir=C:\\Users\\ADMIN\\Desktop\\AicreativeNK-3D-Turbofan\\.screenshot_profile',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    const appTab = tabs[0];
    if (!appTab) {
      console.error('No tab found');
      edge.kill();
      process.exit(1);
    }

    const ws = new WebSocket(appTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 10) {
        const base64Data = msg.result.data;
        fs.writeFileSync('C:\\Users\\ADMIN\\Desktop\\AicreativeNK-3D-Turbofan\\current_render.png', Buffer.from(base64Data, 'base64'));
        console.log('SUCCESS: current_render.png captured, size:', base64Data.length);
        ws.close();
        edge.kill();
        process.exit(0);
      }
    };

    // Give 3.5 seconds to load and render
    setTimeout(() => {
      console.log('Requesting screenshot...');
      ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    }, 3500);

  } catch (err) {
    console.error('Error:', err);
    edge.kill();
    process.exit(1);
  }
}, 1500);
