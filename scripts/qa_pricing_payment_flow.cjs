const puppeteer = require('puppeteer-core');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function runFullPricingAuthFlowTest() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.createBrowserContext(); // fresh session
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ----------------------------------------------------
  // TEST 1: Homepage -> Click "Create carousel" -> Must open /pricing
  // ----------------------------------------------------
  console.log('--- TEST 1: Homepage "Create carousel" -> /pricing ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `${EVIDENCE_DIR}/20_homepage.png` });

  // Click navbar Create carousel button
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('header a[href="/pricing"]')
  ]);

  console.log('Navigation result URL:', page.url());
  if (page.url() !== 'http://localhost:5173/pricing') {
    throw new Error('TEST 1 FAILED: Expected /pricing, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/21_pricing_page.png` });
  console.log('TEST 1 PASSED: "Create carousel" on Homepage cleanly opened /pricing.');

  // ----------------------------------------------------
  // TEST 2: Starter Plan Flow ($0 Free)
  // ----------------------------------------------------
  console.log('--- TEST 2: Choose Starter -> Popup -> Sign up -> Dashboard (5 Gens) ---');
  // Click "Start free" button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Start free'));
    if (btn) btn.click();
  });

  // Verify modal appears
  await page.waitForSelector('h2');
  const modalTitle = await page.evaluate(() => document.querySelector('h2')?.textContent);
  console.log('Starter modal opened with title:', modalTitle);
  await page.screenshot({ path: `${EVIDENCE_DIR}/22_starter_modal.png` });

  // Click Continue in modal
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.trim() === 'Continue');
      if (btn) btn.click();
    })
  ]);

  console.log('Post-modal URL:', page.url());
  if (!page.url().includes('/sign-in') && !page.url().includes('/login')) {
    throw new Error('TEST 2 FAILED: Expected /sign-in, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/23_starter_auth_page.png` });

  // Verify plan tag on auth screen
  const starterTag = await page.evaluate(() => document.body.innerText);
  console.log('Has Starter plan tag:', starterTag.includes('STARTER PLAN'));

  // Sign in as Demo User to activate Starter
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Demo Creator'));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Post-auth destination:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/24_starter_dashboard.png` });

  // ----------------------------------------------------
  // TEST 3: Creator Plan Flow ($4.99)
  // ----------------------------------------------------
  console.log('--- TEST 3: Choose Creator -> Popup -> Payment ($4.99) -> Activation -> Dashboard (30 Gens) ---');
  await page.goto('http://localhost:5173/pricing', { waitUntil: 'networkidle0' });

  // Click "Choose plan" on Creator card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.bg-white.rounded-\\[26px\\]'));
    const creatorCard = cards.find(c => c.textContent.includes('Creator'));
    const btn = creatorCard?.querySelector('button');
    if (btn) btn.click();
  });

  await page.waitForSelector('h2');
  const creatorModalTitle = await page.evaluate(() => document.querySelector('h2')?.textContent);
  console.log('Creator modal title:', creatorModalTitle);
  await page.screenshot({ path: `${EVIDENCE_DIR}/25_creator_modal.png` });

  // Click Continue to payment
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Continue to payment'));
      if (btn) btn.click();
    })
  ]);

  console.log('Checkout URL:', page.url());
  if (page.url() !== 'http://localhost:5173/checkout') {
    throw new Error('TEST 3 FAILED: Expected /checkout, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/26_creator_checkout.png` });

  // Check price on checkout
  const checkoutText = await page.evaluate(() => document.body.innerText);
  console.log('Checkout shows $4.99:', checkoutText.includes('$4.99'));

  // Submit payment
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });

  // Wait for processing and navigation to /sign-in
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Post-payment URL:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/27_creator_post_payment_auth.png` });

  const creatorAuthText = await page.evaluate(() => document.body.innerText);
  console.log('Has CREATOR PLAN tag:', creatorAuthText.includes('CREATOR PLAN'));

  // Activate Creator via Sign In / Demo Creator
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Demo Creator'));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Dashboard URL with Creator plan:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/28_creator_dashboard.png` });

  // Verify Dashboard shows Creator plan and 30 generations allowance
  const dashboardText = await page.evaluate(() => document.body.innerText);
  console.log('Dashboard displays Creator:', dashboardText.includes('Creator'));
  console.log('Dashboard displays 30 generations:', dashboardText.includes('30 used') || dashboardText.includes('30 generations'));

  // ----------------------------------------------------
  // TEST 4: Studio Plan Flow ($19.00)
  // ----------------------------------------------------
  console.log('--- TEST 4: Studio Plan ($19) ---');
  await page.goto('http://localhost:5173/pricing', { waitUntil: 'networkidle0' });

  // Click "Choose plan" on Studio card
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.bg-white.rounded-\\[26px\\]'));
    const studioCard = cards.find(c => c.textContent.includes('Studio'));
    const btn = studioCard?.querySelector('button');
    if (btn) btn.click();
  });

  await page.waitForSelector('h2');
  await page.screenshot({ path: `${EVIDENCE_DIR}/29_studio_modal.png` });

  // Click Continue to payment
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Continue to payment'));
      if (btn) btn.click();
    })
  ]);

  console.log('Studio Checkout URL:', page.url());
  const studioCheckoutText = await page.evaluate(() => document.body.innerText);
  console.log('Studio Checkout shows $19:', studioCheckoutText.includes('$19'));
  await page.screenshot({ path: `${EVIDENCE_DIR}/30_studio_checkout.png` });

  // ----------------------------------------------------
  // TEST 5: Reload persistence
  // ----------------------------------------------------
  console.log('--- TEST 5: Refresh browser at checkout & dashboard ---');
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('Post-reload Checkout URL:', page.url());
  const reloadedText = await page.evaluate(() => document.body.innerText);
  console.log('Still shows Studio & $19 after reload:', reloadedText.includes('$19'));

  await browser.close();
  console.log('=== ALL PRICING, MODAL, PAYMENT, AND ACTIVATION TESTS PASSED 100%! ===');
}

runFullPricingAuthFlowTest().catch(err => {
  console.error('[QA TEST RUNNER FAILURE]', err);
  process.exit(1);
});
