const puppeteer = require('puppeteer-core');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';

async function testPhase2() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.createBrowserContext(); // fresh incognito
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- TEST 2.1: Open Login Page ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `${EVIDENCE_DIR}/06_login_fresh.png` });

  // Verify Supabase Live Connected badge
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('Supabase Live Connected badge present?', pageText.includes('Supabase Live Connected'));

  // Test 2.2: Switch to Sign Up mode
  console.log('--- TEST 2.2: Toggle to Sign Up ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes("Don't have an account?"));
    if (btn) btn.click();
  });
  await page.waitForSelector('input[placeholder="Alex Morgan"]');
  await page.screenshot({ path: `${EVIDENCE_DIR}/07_signup_form.png` });

  // Test 2.3: Sign Up with a unique test user
  const testEmail = `testuser_${Date.now()}@swapptest.ai`;
  const testPassword = 'Password123!';
  console.log('--- TEST 2.3: Registering test user:', testEmail, '---');
  await page.type('input[placeholder="Alex Morgan"]', 'Test QA User');
  await page.type('input[type="email"]', testEmail);
  await page.type('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  // Wait for result (success message or error)
  await page.waitForFunction(() => {
    return document.body.innerText.includes('Account created successfully') || 
           document.querySelector('.bg-red-500\\/10') !== null;
  }, { timeout: 10000 });

  const hasSuccess = await page.evaluate(() => document.body.innerText.includes('Account created successfully'));
  const hasError = await page.evaluate(() => {
    const err = document.querySelector('.bg-red-500\\/10');
    return err ? err.textContent : null;
  });

  console.log('Sign up result -> Success:', hasSuccess, '| Error:', hasError);
  await page.screenshot({ path: `${EVIDENCE_DIR}/08_signup_result.png` });

  // Test 2.4: Incorrect password test
  console.log('--- TEST 2.4: Test Incorrect Password ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes("Already have an account?"));
    if (btn) btn.click();
  });

  // Clear fields
  await page.evaluate(() => {
    document.querySelectorAll('input').forEach(i => i.value = '');
  });
  await page.type('input[type="email"]', testEmail);
  await page.type('input[type="password"]', 'WrongPassword999!');
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => {
    return document.querySelector('.bg-red-500\\/10') !== null;
  }, { timeout: 10000 });

  const incorrectPwdError = await page.evaluate(() => document.querySelector('.bg-red-500\\/10').textContent);
  console.log('Incorrect password error caught properly:', incorrectPwdError);
  await page.screenshot({ path: `${EVIDENCE_DIR}/09_incorrect_pwd_error.png` });

  // Test 2.5: Correct Login
  console.log('--- TEST 2.5: Test Correct Login ---');
  await page.evaluate(() => {
    const p = document.querySelector('input[type="password"]');
    if (p) p.value = '';
  });
  await page.type('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard or destination
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Post-login URL:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/10_post_login_dashboard.png` });

  // Test 2.6: Reload after login (Session persistence)
  console.log('--- TEST 2.6: Reload after login ---');
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('Post-reload URL:', page.url());
  await page.screenshot({ path: `${EVIDENCE_DIR}/11_post_reload_dashboard.png` });

  // Test 2.7: Test Demo Admin Login button
  console.log('--- TEST 2.7: Demo Admin Login & Access ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes("Continue as Demo Admin"));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Demo Admin destination URL:', page.url());
  if (page.url() !== 'http://localhost:5173/admin') {
    throw new Error('Demo Admin failed to navigate to /admin, got: ' + page.url());
  }
  await page.screenshot({ path: `${EVIDENCE_DIR}/12_demo_admin_dashboard.png` });

  await browser.close();
  console.log('=== PHASE 2 AUTH TESTS COMPLETED SUCCESSFULLY! ===');
}

testPhase2().catch(err => {
  console.error('[PHASE 2 FAILURE]', err);
  process.exit(1);
});
