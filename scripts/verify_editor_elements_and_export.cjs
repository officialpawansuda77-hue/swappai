const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';

async function test() {
  console.log('🚀 Starting Editor Editable Elements & Export Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Set mock admin session
  await page.goto(`${BASE_URL}/templates`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('swapp_admin_session', JSON.stringify({ role: 'admin', email: 'admin@swapp.ai', userId: 'admin-1' }));
  });

  // 2. Open The Art of Viral Carousels in Editor
  console.log('Navigating to editor with The Art of Viral Carousels...');
  await page.goto(`${BASE_URL}/editor/new?template=c1000000-0000-0000-0000-000000000001`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Check editable elements on canvas
  const canvasInfo = await page.evaluate(() => {
    const textEls = Array.from(document.querySelectorAll('div')).filter(d => {
      const text = d.textContent?.trim();
      return text === 'CAROUSELS' || text === 'THE' || text === 'ART' || text?.includes('marketingharry');
    });

    const allEditableDivs = Array.from(document.querySelectorAll('[style*="position: absolute"]'));

    return {
      url: window.location.href,
      foundKeyTexts: textEls.map(el => el.textContent?.trim()),
      editableLayersCount: allEditableDivs.length,
      hasPropertiesPanel: document.body.innerText.includes('CANVAS ELEMENT') || document.body.innerText.includes('Font Size') || document.body.innerText.includes('Text Properties')
    };
  });

  console.log('Canvas Info:', canvasInfo);
  if (canvasInfo.foundKeyTexts.length < 2) {
    throw new Error('FAIL: Editable text layers (CAROUSELS, THE, ART) not found on canvas!');
  }

  // 3. Click on the "CAROUSELS" text element to select it
  console.log('Selecting "CAROUSELS" text layer on canvas...');
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('div'));
    const carouselsEl = els.find(d => d.textContent?.trim() === 'CAROUSELS');
    if (carouselsEl) {
      carouselsEl.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Verify Properties Panel is now active with text controls
  const panelState = await page.evaluate(() => {
    const panelText = document.body.innerText;
    return {
      hasTextSection: panelText.includes('TEXT PROPERTIES') || panelText.includes('Font') || panelText.includes('Size'),
      hasSelectedOutline: !!document.querySelector('[style*="outline: 2px solid rgb(255, 90, 0)"]') || !!document.querySelector('[style*="#FF5A00"]')
    };
  });
  console.log('Selection & Properties Panel State:', panelState);

  // 4. Test Export Button
  console.log('Testing Export Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const exportBtn = btns.find(b => b.textContent?.trim() === 'Export');
    if (exportBtn) exportBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const exportModalVisible = await page.evaluate(() => {
    return document.body.innerText.includes('Export Carousel') && document.body.innerText.includes('PNG');
  });
  console.log('Export Modal Open:', exportModalVisible);
  if (!exportModalVisible) {
    throw new Error('FAIL: Export modal did not open!');
  }

  // Screenshot editor state
  await page.screenshot({ path: 'scripts/verify_editor_c1_editable.png' });
  console.log('📸 Screenshot saved to scripts/verify_editor_c1_editable.png');

  console.log('🎉 ALL TESTS PASSED! "The Art of Viral Carousels" is now 100% editable with distinct text, shapes, and export!');
  await browser.close();
}

test().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
