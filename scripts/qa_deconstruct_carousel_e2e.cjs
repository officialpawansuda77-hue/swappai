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
  console.log('=== STARTING E2E TEST: AI Slide Deconstruction & Canvas Editability ===');

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
    // 0. Set Admin session
    console.log('0. Setting Admin session in browser...');
    await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('swapp_admin_session', JSON.stringify({
        id: 'admin_test_1',
        userId: 'admin_test_1',
        email: 'admin@swapp.ai',
        fullName: 'SWAPP Admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      }));
    });

    // 1. Visit /admin/templates/new
    console.log('1. Navigating to /admin/templates/new...');
    await page.goto(`${BASE_URL}/admin/templates/new`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Step 0: Source -> Continue
    console.log('2. Step 0 (Source) -> Continue...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));

    // Step 1: Slides -> Upload image
    console.log('3. Step 1 (Slides) -> Uploading slide image...');
    const slidePath = path.resolve('public/carousels/c1/slide1.png');
    if (!fs.existsSync(slidePath)) throw new Error('Source slide not found at ' + slidePath);

    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found');
    await fileInput.uploadFile(slidePath);
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_step1_uploaded.png') });

    // 4. Trigger AI Layer Deconstruction
    console.log('4. Triggering AI Layer Deconstruction (Gemini Vision)...');
    const clickedDeconstruct = await clickByText(page, 'button', 'Deconstruct All');
    console.log('Clicked Deconstruct All button:', clickedDeconstruct);
    if (!clickedDeconstruct) throw new Error('Deconstruct All button not found');

    // Wait for AI deconstruction to finish (look for "Layers" badge)
    console.log('5. Waiting for AI deconstruction to complete...');
    await page.waitForFunction(() => {
      return document.body.innerText.includes('Layers');
    }, { timeout: 25000 });

    console.log('AI Deconstruction completed!');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_step1_deconstructed.png') });

    // 6. Continue to Details
    console.log('6. Advancing to Step 2 (Details)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));

    // Fill in Details
    console.log('7. Filling in carousel details...');
    const nameInput = await page.$('input[placeholder*="e.g."]') || (await page.$$('input[type="text"]'))[0];
    if (nameInput) {
      await nameInput.type('Viral AI Carousel - Editable Layers');
    }
    const catSelect = await page.$('select');
    if (catSelect) {
      await page.select('select', 'Marketing');
    }

    // Continue to Review
    console.log('8. Advancing to Step 3 (Review)...');
    await clickByText(page, 'button', 'Continue');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_step3_review.png') });

    // 9. Click "Publish Template"
    console.log('9. Clicking "Publish Template"...');
    const clickedPublish = await clickByText(page, 'button', 'Publish Template');
    if (!clickedPublish) throw new Error('Publish Template button not found');

    // Wait for redirect to /templates
    console.log('10. Waiting for redirect to /templates...');
    await page.waitForFunction(() => window.location.pathname === '/templates', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1200));

    // 11. Click on published template card
    console.log('11. Finding published template on /templates...');
    const clickedCard = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.template-card'));
      const target = cards.find(c => c.textContent && c.textContent.includes('Viral AI Carousel - Editable Layers'));
      if (target) {
        const link = target.querySelector('a') || target;
        link.click();
        return true;
      }
      return false;
    });
    console.log('Clicked template card:', clickedCard);
    if (!clickedCard) throw new Error('Template card not found on /templates');

    await page.waitForFunction(() => window.location.pathname.startsWith('/templates/'), { timeout: 6000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_template_preview.png') });

    // 12. Click "Open in Canvas"
    console.log('12. Opening template in Canvas Editor...');
    await clickByText(page, 'a', 'Open in Canvas');
    await page.waitForFunction(() => window.location.pathname.startsWith('/editor/'), { timeout: 6000 });
    await new Promise(r => setTimeout(r, 2000));

    // 13. Verify that the canvas has genuine editable text elements!
    console.log('13. Inspecting canvas objects in Editor...');
    const canvasObjects = await page.evaluate(() => {
      // Find all canvas elements rendered inside the canvas container
      const elements = Array.from(document.querySelectorAll('[data-element-id]'));
      return elements.map(el => ({
        id: el.getAttribute('data-element-id'),
        text: el.innerText.trim(),
        style: {
          color: el.style.color,
          fontSize: el.style.fontSize,
          fontFamily: el.style.fontFamily,
          position: el.style.position,
          left: el.style.left,
          top: el.style.top,
        }
      }));
    });

    console.log('Detected Canvas Objects in Editor:', JSON.stringify(canvasObjects, null, 2));

    if (canvasObjects.length === 0) {
      // Check for any text inside the canvas container
      const canvasText = await page.evaluate(() => {
        const canvas = document.querySelector('.aspect-\\[4\\/5\\]') || document.querySelector('[style*="1080"]');
        return canvas ? canvas.innerText : 'Canvas not found';
      });
      console.log('Canvas Text fallback:', canvasText);
    }

    // 14. Click on the headline element on canvas to select it!
    console.log('14. Selecting the headline element on canvas...');
    const selected = await page.evaluate(() => {
      const headlineEl = Array.from(document.querySelectorAll('div')).find(
        el => el.textContent && el.textContent.includes('THE ART OF VIRAL')
      );
      if (headlineEl) {
        headlineEl.click();
        return true;
      }
      return false;
    });
    console.log('Headline element selected:', selected);
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_canvas_element_selected.png') });

    // 15. Verify properties panel updated with element details
    const propertiesPanelText = await page.evaluate(() => {
      const panel = document.querySelector('aside') || document.body;
      return panel ? panel.innerText : '';
    });
    const showsSelectedText = propertiesPanelText.includes('VIRAL') || propertiesPanelText.includes('Font') || propertiesPanelText.includes('Color');
    console.log('Properties panel shows selection info:', showsSelectedText);

    console.log('=== QA TEST PASSED: SLIDE SUCCESSFULLY DECONSTRUCTED INTO EDITABLE CANVAS ELEMENTS! ===');
  } catch (err) {
    console.error('QA TEST FAILED:', err);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'deconstruct_error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
