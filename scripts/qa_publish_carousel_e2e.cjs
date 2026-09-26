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
  console.log('--- STARTING QA TEST: Admin Upload & Publish Carousel -> Verify in App ---');

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
    // 1. Visit /admin/templates/new
    console.log('1. Navigating to /admin/templates/new...');
    await page.goto(`${BASE_URL}/admin/templates/new`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Step 0: Source -> Continue
    console.log('2. Step 0 (Source) -> Continue...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));

    // Step 1: Slides -> Upload image
    console.log('3. Step 1 (Slides) -> Uploading slide image...');
    const scratchDir = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/scratch';
    const slide1Path = path.join(scratchDir, 'published_carousel_slide1.png');
    // Valid 1x1 orange PNG
    const orangePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(slide1Path, orangePng);

    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found');
    await fileInput.uploadFile(slide1Path);
    await new Promise(r => setTimeout(r, 1000));

    // Continue to Details
    console.log('4. Advancing to Step 2 (Details)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Fill in Details
    console.log('5. Filling in carousel details...');
    const nameInput = await page.$('input[placeholder*="e.g."]') || (await page.$$('input[type="text"]'))[0];
    if (nameInput) {
      await nameInput.type('10x Productivity Framework by QA');
    }
    const descArea = await page.$('textarea');
    if (descArea) {
      await descArea.type('A proven framework for high performance and deep focus.');
    }
    // Select category
    const catSelect = await page.$('select');
    if (catSelect) {
      await page.select('select', 'Productivity');
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '98_admin_wizard_details_filled.png') });

    // Continue to Review
    console.log('6. Advancing to Step 3 (Review)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '99_admin_wizard_review_step.png') });

    // Step 3: Click "Publish Template"
    console.log('7. Clicking "Publish Template" button...');
    const clickedPublish = await clickByText(page, 'button', 'Publish Template');
    if (!clickedPublish) throw new Error('Publish Template button not found');

    // Wait for redirect to /templates
    console.log('8. Waiting for redirect to /templates...');
    await page.waitForFunction(() => window.location.pathname === '/templates', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1200));

    console.log('Current URL after publish:', await page.evaluate(() => window.location.href));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '100_published_in_templates_grid.png') });

    // Verify template card exists on /templates
    const templateFound = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.template-card'));
      return cards.some(c => c.textContent && c.textContent.includes('10x Productivity Framework by QA'));
    });
    console.log('Template found in public templates grid:', templateFound);
    if (!templateFound) throw new Error('Published template NOT found on /templates page!');

    // 9. Click on the published template card
    console.log('9. Clicking published template card to open Preview...');
    const clickedCard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.template-card'));
      const target = cards.find(c => c.textContent && c.textContent.includes('10x Productivity Framework by QA'));
      if (target) {
        // Find link or preview link inside or click card
        const link = target.querySelector('a') || target;
        link.click();
        return true;
      }
      return false;
    });

    await page.waitForFunction(() => window.location.pathname.startsWith('/templates/'), { timeout: 5000 });
    await new Promise(r => setTimeout(r, 1000));
    console.log('Template Preview URL:', await page.evaluate(() => window.location.href));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '101_published_template_preview.png') });

    // Verify title on preview page
    const pageTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log('Preview Page Title:', pageTitle);

    // 10. Click "Open in Canvas"
    console.log('10. Clicking "Open in Canvas"...');
    await clickByText(page, 'a', 'Open in Canvas');
    await page.waitForFunction(() => window.location.pathname.startsWith('/editor/'), { timeout: 5000 });
    await new Promise(r => setTimeout(r, 1200));
    console.log('Editor URL:', await page.evaluate(() => window.location.href));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '102_published_template_in_editor.png') });

    console.log('=== QA TEST PASSED: CAROUSEL PUBLISH -> APPEARS IN APP -> PREVIEW -> EDITOR FULLY WORKING ===');
  } catch (err) {
    console.error('QA TEST FAILED:', err);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'publish_qa_error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
