const puppeteer = require('puppeteer-core');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function testGenerationLimits() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- TEST: Login as Demo Creator (Creator Plan: 30 Limit) ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

  // Sign in as Demo Creator
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Demo Creator'));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // 1. Test when at 29/30 used (1 generation left)
  console.log('--- TEST: Simulate 29 / 30 used ---');
  await page.evaluate(() => {
    const key = 'swapp_sub_demo-user-id';
    const sub = {
      userId: 'demo-user-id',
      planId: 'creator',
      status: 'active',
      monthlyGenerations: 30,
      generationsUsed: 29,
      periodStart: new Date().toISOString(),
      periodEnd: new Date(2026, 9, 1).toISOString(),
      billingInterval: 'monthly',
      lastPaymentId: 'paid_demo'
    };
    localStorage.setItem(key, JSON.stringify(sub));
  });

  await page.reload({ waitUntil: 'networkidle0' });
  const textBefore = await page.evaluate(() => document.body.innerText);
  console.log('Shows 29 / 30 used:', textBefore.includes('29 / 30 used'));
  console.log('Shows 1 generations remaining:', textBefore.includes('1 generations remaining'));
  await page.screenshot({ path: `${EVIDENCE_DIR}/31_approaching_limit.png` });

  // Click Create Carousel (should navigate to /create because 29 < 30)
  console.log('--- TEST: Create Carousel with 1 remaining generation allowed ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Create Carousel'));
    if (btn) btn.click();
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Reached URL:', page.url());
  if (page.url() !== 'http://localhost:5173/create') {
    throw new Error('Expected /create when 1 generation remained, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/32_create_page.png` });

  // 2. Now simulate reaching 30/30 limit
  console.log('--- TEST: Simulate Reached 30 / 30 limit ---');
  await page.evaluate(() => {
    const key = 'swapp_sub_demo-user-id';
    const sub = JSON.parse(localStorage.getItem(key));
    sub.generationsUsed = 30;
    localStorage.setItem(key, JSON.stringify(sub));
  });

  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  const textAtLimit = await page.evaluate(() => document.body.innerText);
  console.log('Shows 30 / 30 used:', textAtLimit.includes('30 / 30 used'));
  console.log('Shows 0 generations remaining:', textAtLimit.includes('0 generations remaining'));
  await page.screenshot({ path: `${EVIDENCE_DIR}/33_at_limit_dashboard.png` });

  // Click Create Carousel -> MUST OPEN LIMIT REACHED MODAL
  console.log('--- TEST: Click Create Carousel at limit -> Should show Modal ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Create Carousel'));
    if (btn) btn.click();
  });

  await page.waitForFunction(() => document.body.innerText.includes('Monthly Limit Reached'), { timeout: 5000 });
  const hasLimitModal = await page.evaluate(() => document.body.innerText.includes('Monthly Limit Reached'));
  console.log('Limit Reached Modal opened properly:', hasLimitModal);
  await page.screenshot({ path: `${EVIDENCE_DIR}/34_limit_modal_open.png` });

  // Click Upgrade Plan in modal -> Should navigate to /pricing
  console.log('--- TEST: Click Upgrade Plan in modal -> Should go to /pricing ---');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.evaluate(() => {
      const upgradeBtn = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Upgrade Plan'));
      if (upgradeBtn) upgradeBtn.click();
    })
  ]);

  console.log('Navigated to Pricing URL:', page.url());
  if (page.url() !== 'http://localhost:5173/pricing') {
    throw new Error('Expected /pricing from upgrade modal, got: ' + page.url());
  }

  await browser.close();
  console.log('=== GENERATION LIMIT ENFORCEMENT TEST PASSED 100%! ===');
}

testGenerationLimits().catch(err => {
  console.error('[LIMIT TEST FAILURE]', err);
  process.exit(1);
});
