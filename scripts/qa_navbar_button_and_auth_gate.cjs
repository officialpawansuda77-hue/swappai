const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';
const BASE_URL = 'http://localhost:5173';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  ensureDir(EVIDENCE_DIR);
  console.log('--- STARTING QA TEST: Top "Create carousel" button, Auth Gate & Payment Flow ---');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Create isolated fresh browser context (incognito / no cookies / no localStorage)
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER_ERR:', err.message));

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Fresh Guest visits Homepage
    // -------------------------------------------------------------------------
    console.log('1. Visiting Homepage as fresh guest...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    // Verify Nav items for Guest
    const navText = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.innerText : '';
    });
    console.log('Navbar text:', navText.replace(/\n+/g, ' | '));

    if (navText.includes('Admin Panel')) {
      throw new Error('FAIL: Guest should NOT see Admin Panel!');
    }
    if (!navText.includes('Log in')) {
      throw new Error('FAIL: Guest SHOULD see "Log in" in navbar!');
    }

    const topButtonHref = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('header a')).find(a =>
        a.textContent.includes('Create carousel')
      );
      return btn ? btn.getAttribute('href') : null;
    });
    console.log('Top "Create carousel" button href:', topButtonHref);

    if (topButtonHref !== '/pricing') {
      throw new Error(`FAIL: Top "Create carousel" href should be "/pricing", but got: ${topButtonHref}`);
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '130_guest_homepage_navbar.png') });
    console.log('✓ PASS: Guest navbar shows Log in and top button links to /pricing.');

    // -------------------------------------------------------------------------
    // STEP 2: Click Top "Create carousel" button -> Must go to /pricing
    // -------------------------------------------------------------------------
    console.log('2. Clicking Top "Create carousel" button...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('header a')).find(a =>
          a.textContent.includes('Create carousel')
        );
        if (btn) btn.click();
      })
    ]);

    const urlAfterTopClick = page.url();
    console.log('URL after top button click:', urlAfterTopClick);
    if (!urlAfterTopClick.includes('/pricing')) {
      throw new Error(`FAIL: Expected /pricing, but navigated to: ${urlAfterTopClick}`);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '131_top_button_opens_pricing.png') });
    console.log('✓ PASS: Top button safely navigated to /pricing without bypassing payment/sign-in.');

    // -------------------------------------------------------------------------
    // STEP 3: Return to Homepage & Click Bottom "Create your first carousel"
    // -------------------------------------------------------------------------
    console.log('3. Returning to Homepage and testing bottom CTA button...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to bottom final CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 500));

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('a')).filter(a =>
          a.textContent.includes('Create your first carousel')
        );
        const bottomBtn = btns[btns.length - 1];
        if (bottomBtn) bottomBtn.click();
      })
    ]);

    const urlAfterBottomClick = page.url();
    console.log('URL after bottom button click:', urlAfterBottomClick);
    if (!urlAfterBottomClick.includes('/pricing')) {
      throw new Error(`FAIL: Bottom button expected /pricing, but got: ${urlAfterBottomClick}`);
    }
    console.log('✓ PASS: Bottom button also cleanly navigated to /pricing.');

    // -------------------------------------------------------------------------
    // STEP 4: Direct URL access protection (/dashboard without login)
    // -------------------------------------------------------------------------
    console.log('4. Testing direct /dashboard access for unauthenticated guest...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const directDashboardUrl = page.url();
    console.log('URL after attempting direct /dashboard:', directDashboardUrl);
    if (!directDashboardUrl.includes('/pricing')) {
      throw new Error(`FAIL: Direct /dashboard access should redirect to /pricing, got: ${directDashboardUrl}`);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '132_dashboard_direct_access_redirect.png') });
    console.log('✓ PASS: Direct unauthenticated /dashboard access was redirected to /pricing.');

    // -------------------------------------------------------------------------
    // STEP 5: Complete Plan Selection & Authentication Flow
    // -------------------------------------------------------------------------
    console.log('5. Choosing Creator plan on /pricing, completing payment & signing in...');
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    // Click "Choose plan" on Creator ($4.99)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Choose plan'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // In modal, click Continue to payment
    await page.evaluate(() => {
      const modalBtns = Array.from(document.querySelectorAll('button'));
      const continueBtn = modalBtns.find(b => b.textContent.includes('Continue'));
      if (continueBtn) continueBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/checkout'), { timeout: 10000 });

    console.log('Navigated to checkout URL:', page.url());
    if (!page.url().includes('/checkout')) {
      throw new Error(`FAIL: Expected /checkout, got: ${page.url()}`);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '133_checkout_page.png') });

    // Click "Pay $4.99 & Continue"
    await page.evaluate(() => {
      const payBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('Pay')
      );
      if (payBtn) payBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/sign-in') || window.location.pathname.includes('/login'), { timeout: 15000 });

    console.log('Navigated after payment to:', page.url());
    if (!page.url().includes('/sign-in') && !page.url().includes('/login')) {
      throw new Error(`FAIL: Expected sign-in page after payment, got: ${page.url()}`);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '134_post_payment_auth_page.png') });

    // Use Demo Creator to complete signup
    await page.evaluate(() => {
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('Demo Creator')
      );
      if (demoBtn) demoBtn.click();
    });
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 15000 });

    console.log('Navigated after auth to:', page.url());
    if (!page.url().includes('/dashboard')) {
      throw new Error(`FAIL: Expected dashboard after authentication, got: ${page.url()}`);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '135_authenticated_dashboard.png') });
    console.log('✓ PASS: Full payment -> auth -> dashboard flow succeeded.');

    // -------------------------------------------------------------------------
    // STEP 6: Verify Authenticated Navbar & Log Out
    // -------------------------------------------------------------------------
    console.log('6. Verifying authenticated Navbar & logging out...');
    const authedNavText = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.innerText : '';
    });
    console.log('Authenticated Navbar text:', authedNavText.replace(/\n+/g, ' | '));

    if (!authedNavText.includes('Dashboard')) {
      throw new Error('FAIL: Authenticated user should see Dashboard in navbar!');
    }
    if (!authedNavText.includes('Log out')) {
      throw new Error('FAIL: Authenticated user should see Log out in navbar!');
    }

    // Click Log out
    await page.evaluate(() => {
      const logoutBtn = Array.from(document.querySelectorAll('header button')).find(b =>
        b.textContent.includes('Log out')
      );
      if (logoutBtn) logoutBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify user is now logged out
    const postLogoutNavText = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.innerText : '';
    });
    console.log('Post-logout Navbar text:', postLogoutNavText.replace(/\n+/g, ' | '));

    if (!postLogoutNavText.includes('Log in')) {
      throw new Error('FAIL: After logout, navbar should show "Log in"!');
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '136_logged_out_state.png') });
    console.log('✓ PASS: Log out button successfully cleared session.');

    console.log('\n======================================================');
    console.log('>>> ALL CHECKS PASSED: Top button, Auth Gate & Payment Flow fully verified! <<<');
    console.log('======================================================\n');
  } catch (err) {
    console.error('[FATAL QA ERROR]', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
