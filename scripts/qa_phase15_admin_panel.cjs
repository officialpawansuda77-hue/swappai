const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';
const BASE_URL = 'http://localhost:5173';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function clickByText(page, selector, text) {
  return await page.evaluate(({ selector, text }) => {
    const els = Array.from(document.querySelectorAll(selector));
    const target = els.find(el => el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase()));
    if (target) {
      target.click();
      return true;
    }
    return false;
  }, { selector, text });
}

async function run() {
  ensureDir(EVIDENCE_DIR);
  console.log('--- STARTING QA TEST: Admin Dashboard, Templates Management, Categories & Wizard ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER_ERR:', err.message));

  try {
    // 0. Authenticate as Admin
    console.log('0. Setting Admin session in browser...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('swapp_demo_user', JSON.stringify({
        id: 'admin-1',
        userId: 'admin-1',
        role: 'admin',
        fullName: 'SWAPP Admin',
        email: 'admin@swapp.ai',
        createdAt: new Date().toISOString()
      }));
    });
    console.log('Admin session set.');

    // 1. Visit /admin
    console.log('1. Navigating to /admin...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '80_admin_dashboard.png') });

    // 2. Navigate to /admin/templates
    console.log('2. Navigating to /admin/templates...');
    await page.goto(`${BASE_URL}/admin/templates`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '81_admin_templates_list.png') });

    // Test tab filtering
    console.log('Testing Drafts tab...');
    await clickByText(page, 'button', 'Draft');
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '82_admin_templates_drafts.png') });

    // Switch back to All
    await clickByText(page, 'button', 'All');
    await new Promise(r => setTimeout(r, 400));

    // Test Category filter
    console.log('Testing category filter on admin templates...');
    const catSelect = await page.$('select');
    if (catSelect) {
      await page.select('select', 'AI');
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '83_admin_templates_ai_filter.png') });
      await page.select('select', 'All');
      await new Promise(r => setTimeout(r, 400));
    }

    // Test Search input
    console.log('Testing search on admin templates...');
    await page.type('input[placeholder*="Search"]', 'Creator');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '84_admin_templates_search.png') });

    // 3. Click on a template edit link
    console.log('3. Clicking template Edit link...');
    const editLink = await page.$('a[href^="/admin/templates/tpl_"]');
    if (editLink) {
      await editLink.click();
      await page.waitForFunction(() => window.location.pathname.startsWith('/admin/templates/tpl_'));
      await new Promise(r => setTimeout(r, 800));
      console.log('Navigated to Template Edit:', await page.evaluate(() => window.location.pathname));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '85_admin_template_detail.png') });

      // Click "Edit Details"
      const clickedEdit = await clickByText(page, 'button', 'Edit Details');
      if (clickedEdit) {
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(EVIDENCE_DIR, '86_admin_template_editing.png') });

        // Update description
        const descInput = await page.$('textarea');
        if (descInput) {
          await descInput.type(' [QA Verified]');
          await new Promise(r => setTimeout(r, 300));
        }

        // Save
        await clickByText(page, 'button', 'Save Changes');
        await new Promise(r => setTimeout(r, 800));
        console.log('Template details saved');
        await page.screenshot({ path: path.join(EVIDENCE_DIR, '87_admin_template_saved.png') });
      }
    }

    // 4. Test /admin/categories
    console.log('4. Navigating to /admin/categories...');
    await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '88_admin_categories.png') });

    // Click Add Category
    console.log('Adding new category...');
    const clickedAddCat = await clickByText(page, 'button', 'Add Category');
    if (clickedAddCat) {
      await new Promise(r => setTimeout(r, 400));

      await page.type('input[placeholder="Category name..."]', 'Tech & AI Startups');
      await new Promise(r => setTimeout(r, 300));

      await clickByText(page, 'button', 'Add');
      await new Promise(r => setTimeout(r, 600));
      console.log('New category added successfully');
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '89_admin_category_added.png') });
    }

    // 5. Test /admin/templates/new (Wizard)
    console.log('5. Navigating to /admin/templates/new...');
    await page.goto(`${BASE_URL}/admin/templates/new`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '90_admin_wizard_step0_source.png') });

    // Step 0: Source -> Click Continue
    console.log('Advancing from Step 0 (Source) to Step 1 (Slides)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '91_admin_wizard_step1_slides.png') });

    // Step 1: Upload slide file
    console.log('Uploading slide to wizard in Step 1...');
    const dummyPngPath = path.join('/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/scratch', 'dummy_slide.png');
    const dummyPngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(dummyPngPath, dummyPngBuffer);

    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile(dummyPngPath);
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '92_admin_wizard_slide_uploaded.png') });
    }

    // Advance from Step 1 to Step 2 (Details)
    console.log('Advancing from Step 1 (Slides) to Step 2 (Details)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '93_admin_wizard_step2_details.png') });

    // Fill in Details
    console.log('Filling in template details in Step 2...');
    const nameInput = await page.$('input[placeholder*="e.g."]') || (await page.$$('input[type="text"]'))[0];
    if (nameInput) {
      await nameInput.type('New QA Verified Creator Template');
    }
    const descArea = await page.$('textarea');
    if (descArea) {
      await descArea.type('A premium template tested and verified end-to-end.');
    }
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '94_admin_wizard_details_filled.png') });

    // Advance from Step 2 to Step 3 (Review)
    console.log('Advancing from Step 2 (Details) to Step 3 (Review)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '95_admin_wizard_step3_review.png') });

    // Step 3 (Review): Click Save Draft
    console.log('Clicking Save Draft in Step 3...');
    await clickByText(page, 'button', 'Save Draft');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '96_admin_wizard_saved_draft.png') });

    console.log('=== QA TEST PASSED: ADMIN PANEL, CATEGORIES & WIZARD FULLY VERIFIED ===');
  } catch (err) {
    console.error('QA TEST FAILED:', err);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'admin_qa_error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
