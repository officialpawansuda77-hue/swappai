const puppeteer = require('puppeteer-core');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lubdghswecahviwkhrak.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'http://localhost:5173';
const TEST_USER_ID = '6c937703-1fae-4331-b978-7d0985da2100';
const TEST_EMAIL = 'egbayelorapheal12@gmail.com';
const DODO_CREATOR_ID = 'pdt_0NoV6f6sKvSHpmZrs8uPj';
const DODO_STUDIO_ID = 'pdt_0NoV8Hg2oW2DEM5YbUHGz';

function generateSignature(webhookId, timestamp, rawBody, secret) {
  let cleanSecret = secret.trim();
  if (cleanSecret.startsWith('whsec_')) cleanSecret = cleanSecret.slice(6);
  const secretBytes = Buffer.from(cleanSecret, 'base64');
  const signed = `${webhookId}.${timestamp}.${rawBody}`;
  const hmac = crypto.createHmac('sha256', secretBytes).update(signed).digest('base64');
  return `v1,${hmac}`;
}

async function sendWebhook(eventType, data, webhookId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = JSON.stringify({
    type: eventType,
    timestamp: new Date().toISOString(),
    data,
  });

  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET || 'whsec_dGVzdF9zZWNyZXRfa2V5XzEyMzQ1Njc4OTAxMjM0NTY3ODkw';
  const sig = generateSignature(webhookId, timestamp, payload, secret);

  const res = await fetch(`${BASE_URL}/api/dodo/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'webhook-id': webhookId,
      'webhook-timestamp': timestamp,
      'webhook-signature': sig,
    },
    body: payload,
  });

  return { status: res.status, json: await res.json() };
}

async function runFullDodoSuite() {
  console.log('================================================================');
  console.log('        SWAPP.AI — DODO PAYMENTS FULL INTEGRATION TEST SUITE      ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ── TEST 1: Unauthenticated visitors blocked from product routes ───────────
  console.log('\n--- 1. Security Check: Unauthenticated visitor bypass block ---');
  {
    const res = await fetch(`${BASE_URL}/api/subscription/consume-generation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(res.status === 401, 'POST /api/subscription/consume-generation rejects unauthenticated request with 401');

    const usageRes = await fetch(`${BASE_URL}/api/subscription/usage`);
    assert(usageRes.status === 401, 'GET /api/subscription/usage rejects missing user with 401');
  }

  // ── TEST 2: Webhook Idempotency (Prevent Duplicate Processing) ──────────────
  console.log('\n--- 2. Webhook Idempotency: Prevent duplicate webhook processing ---');
  {
    const fixedId = `msg_idempotent_test_${Date.now()}`;
    const initialRes = await sendWebhook('subscription.active', {
      subscription_id: 'sub_test_creator_123',
      product_id: DODO_CREATOR_ID,
      metadata: { user_id: TEST_USER_ID, plan_id: 'creator' },
      customer: { email: TEST_EMAIL, customer_id: 'cus_creator_1' },
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    }, fixedId);

    assert(initialRes.status === 200 && initialRes.json.received, 'First webhook delivery accepted (200)');

    const duplicateRes = await sendWebhook('subscription.active', {
      subscription_id: 'sub_test_creator_123',
      product_id: DODO_CREATOR_ID,
      metadata: { user_id: TEST_USER_ID, plan_id: 'creator' },
    }, fixedId);

    assert(duplicateRes.status === 200 && duplicateRes.json.duplicate === true, 'Duplicate webhook ID recognized and skipped');
  }

  // ── TEST 3: Creator Plan Activation via Webhook (30 Generations) ───────────
  console.log('\n--- 3. Creator Plan Activation via Webhook ---');
  {
    // Activate creator
    await sendWebhook('subscription.active', {
      subscription_id: 'sub_creator_30_live',
      product_id: DODO_CREATOR_ID,
      metadata: { user_id: TEST_USER_ID, plan_id: 'creator' },
      customer: { email: TEST_EMAIL, customer_id: 'cus_123' },
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', TEST_USER_ID).single();
    assert(profile.plan === 'creator', `Profile plan set to "creator" (actual: ${profile.plan})`);
    assert(profile.subscription_status === 'active', `Subscription status set to "active" (actual: ${profile.subscription_status})`);
    assert(profile.monthly_generation_limit === 30, `Monthly generation limit set to 30 (actual: ${profile.monthly_generation_limit})`);
    assert(profile.generations_used === 0, `Generations used initialized to 0 (actual: ${profile.generations_used})`);

    const usageRes = await fetch(`${BASE_URL}/api/subscription/usage?userId=${TEST_USER_ID}`);
    const usage = await usageRes.json();
    assert(usage.remaining === 30, `API reports 30 remaining generations (actual: ${usage.remaining})`);
    assert(usage.used === 0, `API reports 0 used generations (actual: ${usage.used})`);
  }

  // ── TEST 4: Generate Carousel → Deduct 1 → 29 Remaining ────────────────────
  console.log('\n--- 4. Carousel Generation Usage Deduction ---');
  {
    const consumeRes = await fetch(`${BASE_URL}/api/subscription/consume-generation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    });
    const consumeData = await consumeRes.json();
    assert(consumeData.success === true, 'consume-generation succeeded');
    assert(consumeData.used === 1, `used incremented to 1 (actual: ${consumeData.used})`);
    assert(consumeData.remaining === 29, `remaining decremented to 29 (actual: ${consumeData.remaining})`);
  }

  // ── TEST 5: Continue Until 0 Remaining & Server-side Blocking ─────────────
  console.log('\n--- 5. Exhaust Monthly Allowance & Server-side Block ---');
  {
    // Fast-forward usage to limit (30)
    await supabaseAdmin.from('profiles').update({ generations_used: 30 }).eq('user_id', TEST_USER_ID);

    const usageRes = await fetch(`${BASE_URL}/api/subscription/usage?userId=${TEST_USER_ID}`);
    const usage = await usageRes.json();
    assert(usage.used === 30, `Usage reports 30 used (actual: ${usage.used})`);
    assert(usage.remaining === 0, `Usage reports 0 remaining (actual: ${usage.remaining})`);

    // Attempt generation when remaining = 0
    const blockedRes = await fetch(`${BASE_URL}/api/subscription/consume-generation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    });
    assert(blockedRes.status === 403, 'Generation blocked at limit with HTTP 403');
    const blockedData = await blockedRes.json();
    assert(blockedData.success === false, 'Blocked response success = false');
    assert(blockedData.error.includes('Monthly carousel limit reached'), `Error message specifies limit reached: "${blockedData.error}"`);
  }

  // ── TEST 6: Subscription Renewal Resets Allowance (used = 0) ──────────────
  console.log('\n--- 6. Subscription Renewal: Resets monthly allowance (used = 0) ---');
  {
    await sendWebhook('subscription.renewed', {
      subscription_id: 'sub_creator_30_live',
      metadata: { user_id: TEST_USER_ID },
      customer: { email: TEST_EMAIL },
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', TEST_USER_ID).single();
    assert(profile.generations_used === 0, `Generations used reset to 0 upon renewal (actual: ${profile.generations_used})`);
    assert(profile.subscription_status === 'active', 'Subscription status remains active');

    const usageRes = await fetch(`${BASE_URL}/api/subscription/usage?userId=${TEST_USER_ID}`);
    const usage = await usageRes.json();
    assert(usage.remaining === 30, `Usage reports 30 remaining after renewal reset (actual: ${usage.remaining})`);
  }

  // ── TEST 7: Subscription Cancellation & Expiration ────────────────────────
  console.log('\n--- 7. Cancellation & Expiration Lifecycle ---');
  {
    // Cancellation
    await sendWebhook('subscription.cancelled', {
      subscription_id: 'sub_creator_30_live',
      metadata: { user_id: TEST_USER_ID },
      customer: { email: TEST_EMAIL },
    });

    let { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', TEST_USER_ID).single();
    assert(profile.subscription_status === 'canceled', `Status marked canceled (actual: ${profile.subscription_status})`);

    // Expiration
    await sendWebhook('subscription.expired', {
      subscription_id: 'sub_creator_30_live',
      metadata: { user_id: TEST_USER_ID },
      customer: { email: TEST_EMAIL },
    });

    const { data: expiredProfile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', TEST_USER_ID).single();
    assert(expiredProfile.plan === 'starter', `Plan reverted to starter on expiration (actual: ${expiredProfile.plan})`);
    assert(expiredProfile.subscription_status === 'expired', `Status marked expired (actual: ${expiredProfile.subscription_status})`);
    assert(expiredProfile.monthly_generation_limit === 5, `Limit reverted to 5 for starter (actual: ${expiredProfile.monthly_generation_limit})`);
  }

  // ── TEST 8: Studio Plan Limits (100 Generations) ───────────────────────────
  console.log('\n--- 8. Studio Plan Limits (100 Generations) ---');
  {
    await sendWebhook('subscription.active', {
      subscription_id: 'sub_studio_100_live',
      product_id: DODO_STUDIO_ID,
      metadata: { user_id: TEST_USER_ID, plan_id: 'studio' },
      customer: { email: TEST_EMAIL },
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    const { data: studioProfile } = await supabaseAdmin.from('profiles').select('*').eq('user_id', TEST_USER_ID).single();
    assert(studioProfile.plan === 'studio', `Profile plan set to "studio" (actual: ${studioProfile.plan})`);
    assert(studioProfile.monthly_generation_limit === 100, `Monthly generation limit set to 100 (actual: ${studioProfile.monthly_generation_limit})`);
    assert(studioProfile.generations_used === 0, `Generations used initialized to 0 (actual: ${studioProfile.generations_used})`);

    const usageRes = await fetch(`${BASE_URL}/api/subscription/usage?userId=${TEST_USER_ID}`);
    const usage = await usageRes.json();
    assert(usage.remaining === 100, `Studio reports 100 remaining generations (actual: ${usage.remaining})`);
  }

  // ── TEST 9: Frontend Browser UI Validation via Puppeteer ───────────────────
  console.log('\n--- 9. Browser UI Validation: Dashboard Usage Meter & Limit Gate ---');
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Login user via localStorage
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle0' });
    await page.evaluate((userId, email) => {
      const userObj = {
        id: userId,
        userId: userId,
        email: email,
        fullName: 'Rapheal Egbayelo',
        role: 'user',
      };
      localStorage.setItem('swapp_admin_session', JSON.stringify(userObj));
      // Set Creator subscription with 12 / 30 used (18 remaining)
      const sub = {
        userId,
        planId: 'creator',
        status: 'active',
        monthlyGenerations: 30,
        generationsUsed: 12,
        extraGenerations: 0,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 20 * 86400000).toISOString(),
        billingInterval: 'monthly',
      };
      localStorage.setItem(`swapp_sub_${userId}`, JSON.stringify(sub));
    }, TEST_USER_ID, TEST_EMAIL);

    // Also update database to match 12/30 for Creator
    await supabaseAdmin.from('profiles').update({
      plan: 'creator',
      subscription_status: 'active',
      monthly_generation_limit: 30,
      generations_used: 12,
    }).eq('user_id', TEST_USER_ID);

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    let pageText = await page.evaluate(() => document.body.innerText);

    assert(pageText.includes('12 / 30 used'), `Dashboard displays "12 / 30 used"`);
    assert(pageText.includes('18 remaining'), `Dashboard displays "18 remaining"`);
    assert(pageText.includes('Carousels'), `Dashboard contains "Carousels" section title`);

    console.log('\n--- 10. Browser UI Validation: Limit Reached (30 / 30 used) & Disabled Button ---');
    // Set to 30 / 30 used
    await supabaseAdmin.from('profiles').update({
      generations_used: 30,
    }).eq('user_id', TEST_USER_ID);

    await page.evaluate((userId) => {
      const sub = {
        userId,
        planId: 'creator',
        status: 'active',
        monthlyGenerations: 30,
        generationsUsed: 30,
        extraGenerations: 0,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 20 * 86400000).toISOString(),
        billingInterval: 'monthly',
      };
      localStorage.setItem(`swapp_sub_${userId}`, JSON.stringify(sub));
    }, TEST_USER_ID);

    await page.reload({ waitUntil: 'networkidle0' });
    pageText = await page.evaluate(() => document.body.innerText);

    assert(pageText.includes('30 / 30 used'), `Dashboard displays "30 / 30 used"`);
    assert(pageText.includes('0 remaining'), `Dashboard displays "0 remaining"`);
    assert(pageText.includes('Monthly carousel limit reached.'), `Dashboard shows "Monthly carousel limit reached."`);
    assert(pageText.includes('Get More Generations'), `Dashboard shows "Get More Generations" button`);

    const isCreateDisabled = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Create Carousel'));
      return btn ? btn.disabled : false;
    });
    assert(isCreateDisabled === true, 'Create Carousel button is disabled in UI');

    console.log('\n--- 11. Browser UI Validation: "Get More Generations" Modal ---');
    // Click "Get More Generations"
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Get More Generations'));
      if (btn) btn.click();
    });

    await page.waitForFunction(() => document.body.innerText.includes('ADDITIONAL USAGE'), { timeout: 3000 });
    const modalText = await page.evaluate(() => document.body.innerText);
    assert(modalText.includes('Get More Generations'), 'Modal titled "Get More Generations" opens');
    assert(modalText.includes('15 Extra Carousel Generations'), 'Offers 15 Extra Carousel Generations pack');

    console.log('\n--- 12. Browser UI Validation: Direct Editor/Create Bypass Guarded ---');
    await page.goto(`${BASE_URL}/create`, { waitUntil: 'networkidle0' });
    const createPageText = await page.evaluate(() => document.body.innerText);
    assert(createPageText.includes('Monthly carousel limit reached.'), 'Create page shows limit reached banner');
    const isGenerateDisabled = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Limit Reached') || b.disabled);
      return Boolean(btn);
    });
    assert(isGenerateDisabled === true, 'Generate carousel is disabled on Create page');

  } catch (browserErr) {
    console.error('Puppeteer validation exception:', browserErr);
    failed++;
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n================================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFullDodoSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
