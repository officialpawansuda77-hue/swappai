const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACTS_DIR = '/Users/apple/.gemini/antigravity-ide/brain/4b18738c-bfb5-40e3-8f4f-16f24237c514';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Home page navbar
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_home_navbar.png'), clip: { x: 0, y: 0, width: 1280, height: 160 } });
  console.log('Saved screenshot_home_navbar.png');

  // 2. Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_footer.png') });
  console.log('Saved screenshot_footer.png');

  // 3. Admin page
  await page.goto('http://localhost:5174/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_admin.png') });
  console.log('Saved screenshot_admin.png');

  await browser.close();
  console.log('Screenshots complete.');
})();
