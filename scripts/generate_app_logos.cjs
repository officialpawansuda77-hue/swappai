const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const SOURCE_PATH = '/Users/apple/.gemini/antigravity-ide/brain/4b18738c-bfb5-40e3-8f4f-16f24237c514/.user_uploaded/media_1792168775130.png';
const PUBLIC_DIR = '/Users/apple/Desktop/craousel/public';

(async () => {
  console.log('Launching headless Chrome to process logo assets...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const sourceData = fs.readFileSync(SOURCE_PATH);
  const base64Source = 'data:image/png;base64,' + sourceData.toString('base64');

  const assets = await page.evaluate(async (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const origW = img.width;
        const origH = img.height;

        // Step 1: Draw original to canvas
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = origW;
        srcCanvas.height = origH;
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
        srcCtx.drawImage(img, 0, 0);

        const imgData = srcCtx.getImageData(0, 0, origW, origH);
        const data = imgData.data;

        // Flood fill from all 4 corners to remove exterior white background
        const visited = new Uint8Array(origW * origH);
        const queue = [
          0, 0,
          origW - 1, 0,
          0, origH - 1,
          origW - 1, origH - 1,
          10, 10,
          origW - 11, 10,
          10, origH - 11,
          origW - 11, origH - 11
        ];

        let head = 0;
        while (head < queue.length) {
          const x = queue[head++];
          const y = queue[head++];
          const idx = y * origW + x;
          if (visited[idx]) continue;
          visited[idx] = 1;

          const pIdx = idx * 4;
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];

          // Is it white / near-white exterior?
          const isWhite = (r > 235 && g > 235 && b > 235);
          if (isWhite) {
            // Check neighbor pixels
            const neighbors = [
              [x + 1, y],
              [x - 1, y],
              [x, y + 1],
              [x, y - 1]
            ];
            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < origW && ny >= 0 && ny < origH) {
                const nIdx = ny * origW + nx;
                if (!visited[nIdx]) {
                  const npIdx = nIdx * 4;
                  const nr = data[npIdx];
                  const ng = data[npIdx + 1];
                  const nb = data[npIdx + 2];
                  if (nr > 235 && ng > 235 && nb > 235) {
                    queue.push(nx, ny);
                  }
                }
              }
            }
          }
        }

        // Apply transparency & smooth anti-aliased boundary
        for (let y = 0; y < origH; y++) {
          for (let x = 0; x < origW; x++) {
            const idx = y * origW + x;
            const pIdx = idx * 4;
            if (visited[idx]) {
              data[pIdx + 3] = 0; // Fully transparent
            }
          }
        }

        srcCtx.putImageData(imgData, 0, 0);

        // Center of icon is (512, 267), bbox is minX=304, maxX=720, minY=54, maxY=480
        // Icon is 417x427. Let's crop a square region with slight padding: 436x436
        const cropSize = 436;
        const cropX = Math.round(512 - cropSize / 2);
        const cropY = Math.round(267 - cropSize / 2);

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropSize;
        cropCanvas.height = cropSize;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = 'high';
        cropCtx.drawImage(
          srcCanvas,
          cropX, cropY, cropSize, cropSize,
          0, 0, cropSize, cropSize
        );

        // Helper to produce resized canvas
        const resize = (size) => {
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(cropCanvas, 0, 0, size, size);
          return c.toDataURL('image/png');
        };

        // Create og-image (1200x630)
        const ogCanvas = document.createElement('canvas');
        ogCanvas.width = 1200;
        ogCanvas.height = 630;
        const ogCtx = ogCanvas.getContext('2d');

        // Dark background
        const grad = ogCtx.createLinearGradient(0, 0, 1200, 630);
        grad.addColorStop(0, '#0E0D0B');
        grad.addColorStop(1, '#171512');
        ogCtx.fillStyle = grad;
        ogCtx.fillRect(0, 0, 1200, 630);

        // Subtle glow behind icon
        const radGrad = ogCtx.createRadialGradient(330, 315, 20, 330, 315, 340);
        radGrad.addColorStop(0, 'rgba(255, 90, 0, 0.28)');
        radGrad.addColorStop(0.5, 'rgba(255, 90, 0, 0.08)');
        radGrad.addColorStop(1, 'rgba(255, 90, 0, 0)');
        ogCtx.fillStyle = radGrad;
        ogCtx.fillRect(0, 0, 1200, 630);

        // Subtle grid / dots
        ogCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let gx = 40; gx < 1200; gx += 40) {
          for (let gy = 40; gy < 630; gy += 40) {
            ogCtx.fillRect(gx, gy, 2, 2);
          }
        }

        // Draw mascot logo on left
        const ogIconSize = 360;
        ogCtx.drawImage(cropCanvas, 140, 135, ogIconSize, ogIconSize);

        // Right side: Brand & Headline
        // Badge
        ogCtx.fillStyle = 'rgba(255, 90, 0, 0.14)';
        ogCtx.beginPath();
        ogCtx.roundRect(580, 170, 180, 34, 17);
        ogCtx.fill();
        ogCtx.strokeStyle = 'rgba(255, 90, 0, 0.35)';
        ogCtx.lineWidth = 1;
        ogCtx.stroke();

        ogCtx.fillStyle = '#FF5A00';
        ogCtx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ogCtx.fillText('AI CAROUSEL STUDIO', 600, 192);

        // Logo text: swapp.ai
        ogCtx.fillStyle = '#FFFFFF';
        ogCtx.font = '900 64px system-ui, -apple-system, sans-serif';
        ogCtx.fillText('swapp', 580, 280);
        const swappW = ogCtx.measureText('swapp').width;
        ogCtx.fillStyle = '#FF5A00';
        ogCtx.fillText('.ai', 580 + swappW, 280);

        // Tagline
        ogCtx.fillStyle = '#E5E5E5';
        ogCtx.font = '600 32px system-ui, -apple-system, sans-serif';
        ogCtx.fillText('Make carousels worth swiping.', 580, 340);

        // Subtitle
        ogCtx.fillStyle = '#8E8E93';
        ogCtx.font = '400 20px system-ui, -apple-system, sans-serif';
        ogCtx.fillText('Turn raw ideas & audio into high-converting', 580, 390);
        ogCtx.fillText('LinkedIn & Instagram carousels in minutes.', 580, 420);

        // Features pill bar
        ogCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ogCtx.beginPath();
        ogCtx.roundRect(580, 465, 480, 44, 22);
        ogCtx.fill();
        ogCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ogCtx.stroke();

        ogCtx.fillStyle = '#D1D1D6';
        ogCtx.font = '500 15px system-ui, -apple-system, sans-serif';
        ogCtx.fillText('✦ 50+ Viral Templates   ✦ 1080p HD Export   ✦ Pro Canvas', 600, 492);

        const ogDataUrl = ogCanvas.toDataURL('image/png');

        resolve({
          logo512: resize(512),
          logo256: resize(256),
          logo128: resize(128),
          favicon64: resize(64),
          favicon32: resize(32),
          appleTouchIcon: resize(180),
          ogImage: ogDataUrl
        });
      };
      img.src = src;
    });
  }, base64Source);

  const saveBase64 = (dataUrl, filePath) => {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    console.log(`Saved: ${filePath} (${fs.statSync(filePath).size} bytes)`);
  };

  saveBase64(assets.logo512, path.join(PUBLIC_DIR, 'logo.png'));
  saveBase64(assets.logo512, path.join(PUBLIC_DIR, 'logo-512.png'));
  saveBase64(assets.logo256, path.join(PUBLIC_DIR, 'logo-256.png'));
  saveBase64(assets.favicon64, path.join(PUBLIC_DIR, 'favicon.png'));
  saveBase64(assets.favicon32, path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  saveBase64(assets.appleTouchIcon, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  saveBase64(assets.ogImage, path.join(PUBLIC_DIR, 'og-image.png'));

  // Also create favicon.svg embedding the high-resolution transparent png
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <image href="${assets.logo128}" width="128" height="128" />
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent);
  console.log(`Saved: ${path.join(PUBLIC_DIR, 'favicon.svg')}`);

  await browser.close();
  console.log('All logo assets successfully generated!');
})();
