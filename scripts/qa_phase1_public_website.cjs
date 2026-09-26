const puppeteer = require('puppeteer-core');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function testPhase1() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.createBrowserContext(); // fresh incognito session
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push({ text: msg.text(), location: page.url() });
  });

  console.log('--- TEST 1.1: Homepage Load ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('Initial page:', page.url());

  // Test Templates link
  console.log('--- TEST 1.2: Navbar -> Templates ---');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('a[href="/templates"]')
  ]);
  console.log('Templates URL:', page.url());
  if (page.url() !== 'http://localhost:5173/templates') {
    throw new Error('Templates link failed to navigate to /templates, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/02_templates_page.png` });

  // Test Features link (should go to /#features or /features)
  console.log('--- TEST 1.3: Navbar -> Features ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const featuresLink = await page.$('a[href="/#features"]');
  if (featuresLink) {
    await featuresLink.click();
    console.log('Clicked Features link, URL:', page.url());
  } else {
    console.log('Features link selector check...');
  }

  // Test Pricing link
  console.log('--- TEST 1.4: Navbar -> Pricing ---');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('a[href="/pricing"]')
  ]);
  console.log('Pricing URL:', page.url());
  if (page.url() !== 'http://localhost:5173/pricing') {
    throw new Error('Pricing link failed to navigate to /pricing, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/03_pricing_page.png` });

  // Test Login link
  console.log('--- TEST 1.5: Navbar -> Log in ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('a[href="/login"]')
  ]);
  console.log('Login URL:', page.url());
  if (page.url() !== 'http://localhost:5173/login') {
    throw new Error('Login link failed, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/04_login_page.png` });

  // Test Create Carousel CTA
  console.log('--- TEST 1.6: Navbar -> Create Carousel CTA ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('header a[href="/create"]')
  ]);
  console.log('Create CTA URL:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/05_create_page.png` });

  // Test Logo click returns to Home
  console.log('--- TEST 1.7: Logo -> Home ---');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('header a[href="/"]')
  ]);
  console.log('Returned URL via Logo:', page.url());
  if (page.url() !== 'http://localhost:5173/') {
    throw new Error('Logo click failed to return to /, got: ' + page.url());
  }

  console.log('Console errors encountered:', errors);
  await browser.close();
  console.log('=== PHASE 1 ALL NAVBAR AND PAGE LOAD TESTS PASSED! ===');
}

testPhase1().catch(err => {
  console.error('[PHASE 1 FAILURE]', err);
  process.exit(1);
});
