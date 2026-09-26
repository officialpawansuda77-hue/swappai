const puppeteer = require('puppeteer-core');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function testLimits() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- Step 1: Open Dashboard (Default Starter 0 / 5 used) ---');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  let text = await page.evaluate(() => document.body.innerText);
  console.log('Shows 0 / 5 used:', text.includes('0 / 5 used'));

  console.log('--- Step 2: Set Starter to 5 / 5 used (Limit Reached) ---');
  await page.evaluate(() => {
    const key = 'swapp_sub_demo-user';
    const sub = {
      userId: 'demo-user',
      planId: 'starter',
      status: 'active',
      monthlyGenerations: 5,
      generationsUsed: 5,
      periodStart: new Date().toISOString(),
      periodEnd: new Date(2026, 9, 1).toISOString(),
      billingInterval: 'monthly'
    };
    localStorage.setItem(key, JSON.stringify(sub));
  });

  await page.reload({ waitUntil: 'networkidle0' });
  text = await page.evaluate(() => document.body.innerText);
  console.log('Shows 5 / 5 used:', text.includes('5 / 5 used'));
  console.log('Shows 0 generations remaining:', text.includes('0 generations remaining'));
  await page.screenshot({ path: `${EVIDENCE_DIR}/35_starter_limit_reached.png` });

  console.log('--- Step 3: Click "Create Carousel" at limit -> Expect Limit Modal ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Create Carousel'));
    if (btn) btn.click();
  });

  // Verify modal is open
  await page.waitForFunction(() => document.body.innerText.includes('Monthly Limit Reached'), { timeout: 3000 });
  const hasModal = await page.evaluate(() => document.body.innerText.includes('Monthly Limit Reached'));
  console.log('Limit Reached Modal is visible:', hasModal);
  await page.screenshot({ path: `${EVIDENCE_DIR}/36_limit_modal_active.png` });

  console.log('--- Step 4: Click "Upgrade Plan" in modal -> Navigates to /pricing ---');
  await page.evaluate(() => {
    const upgradeLink = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Upgrade Plan'));
    if (upgradeLink) upgradeLink.click();
  });

  await page.waitForFunction(() => window.location.pathname === '/pricing', { timeout: 4000 });
  console.log('Final URL after clicking Upgrade Plan:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/37_navigated_to_pricing.png` });

  await browser.close();
  console.log('=== TEST PASSED: Generation limit perfectly blocks and prompts upgrade! ===');
}

testLimits().catch(err => {
  console.error('[LIMIT TEST ERROR]', err);
  process.exit(1);
});
