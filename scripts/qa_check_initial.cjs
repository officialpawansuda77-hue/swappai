const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function runInitialCheck() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('requestfailed', req => {
    networkErrors.push({ url: req.url(), error: req.failure().errorText });
  });

  console.log('[TEST] Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  const currentUrl = page.url();
  const pageTitle = await page.title();

  console.log('[RESULT] Current URL:', currentUrl);
  console.log('[RESULT] Page Title:', pageTitle);

  // Take screenshot
  const screenshotPath = `${EVIDENCE_DIR}/01_initial_homepage.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('[RESULT] Screenshot saved to:', screenshotPath);

  // Check console errors
  const errors = consoleLogs.filter(l => l.type === 'error');
  console.log('[RESULT] Console Errors Count:', errors.length);
  if (errors.length > 0) {
    console.log('[RESULT] Console Errors:', errors);
  }

  console.log('[RESULT] Network Failures Count:', networkErrors.length);
  if (networkErrors.length > 0) {
    console.log('[RESULT] Network Failures:', networkErrors);
  }

  await browser.close();
}

runInitialCheck().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
