const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';

async function test() {
  console.log('🚀 Starting Verification: Templates Page & AI Tools...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Visit /templates
  console.log(`Navigating to ${BASE_URL}/templates...`);
  await page.goto(`${BASE_URL}/templates`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Check that AI Tools is present and fake mockups are gone
  const results = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3')).map(el => el.textContent?.trim());
    return {
      titles,
      hasAI: titles.some(t => t === 'AI Tools'),
      hasViral: titles.some(t => t === 'The Art of Viral Carousels'),
      hasFake01: titles.some(t => t && t.includes('7 AI Tools Every Creator Needs')),
      hasFake02: titles.some(t => t && t.includes('7-Figure Solo Business')),
      hasFake03: titles.some(t => t && t.includes('Carousel Growth Framework')),
    };
  });

  console.log('Template Titles Found:', results.titles);
  console.log('AI Tools Present:', results.hasAI);
  console.log('The Art of Viral Carousels Present:', results.hasViral);
  console.log('Fake Demo 01 Present:', results.hasFake01);
  console.log('Fake Demo 02 Present:', results.hasFake02);
  console.log('Fake Demo 03 Present:', results.hasFake03);

  if (!results.hasAI) {
    throw new Error('FAIL: "AI Tools" template is missing from /templates!');
  }
  if (!results.hasViral) {
    throw new Error('FAIL: "The Art of Viral Carousels" template is missing from /templates!');
  }
  if (results.hasFake01 || results.hasFake02 || results.hasFake03) {
    throw new Error('FAIL: Fake demo mockups are still present in /templates!');
  }

  // 2. Click category 'AI'
  console.log('Filtering by category "AI"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button.category-pill'));
    const aiBtn = btns.find(b => b.textContent?.trim() === 'AI');
    if (aiBtn) aiBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const aiCategoryTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(el => el.textContent?.trim());
  });
  console.log('Titles under "AI" Category:', aiCategoryTitles);
  if (!aiCategoryTitles.includes('AI Tools')) {
    throw new Error('FAIL: "AI Tools" not shown under AI category!');
  }

  // 3. Visit Template Preview for AI Tools
  console.log('Navigating to template preview /templates/a5bcbff9-667d-42df-90eb-98219d6ba24b...');
  await page.goto(`${BASE_URL}/templates/a5bcbff9-667d-42df-90eb-98219d6ba24b`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const previewTitle = await page.evaluate(() => {
    return document.querySelector('h1, h2')?.textContent?.trim();
  });
  console.log('Preview Heading:', previewTitle);
  if (!previewTitle?.includes('AI Tools')) {
    throw new Error(`FAIL: Preview page title expected "AI Tools", got "${previewTitle}"`);
  }

  // Check slide counter
  const slideCounter = await page.evaluate(() => {
    return document.body.innerText.includes('1 / 5');
  });
  console.log('Slide Counter shows 1 / 5:', slideCounter);
  if (!slideCounter) {
    throw new Error('FAIL: Slide counter 1 / 5 not found on preview page!');
  }

  // 4. Test opening in Editor: /editor/new?template=a5bcbff9-667d-42df-90eb-98219d6ba24b
  console.log('Testing Editor open with template AI Tools...');
  await page.evaluate(() => {
    localStorage.setItem('swapp_admin_session', JSON.stringify({ role: 'admin', email: 'admin@swapp.ai' }));
  });
  await page.goto(`${BASE_URL}/editor/new?template=a5bcbff9-667d-42df-90eb-98219d6ba24b`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const editorState = await page.evaluate(() => {
    return {
      url: window.location.href,
      hasCanvas: !!document.querySelector('canvas'),
      textFound: document.body.innerText.includes('AI TOOLS') || document.body.innerText.includes('AI Tools') || document.body.innerText.includes('ChatGPT'),
      bodySnippet: document.body.innerText.slice(0, 300)
    };
  });
  console.log('Editor State:', editorState);

  await page.screenshot({ path: 'scripts/verify_templates_result.png' });
  console.log('📸 Screenshot saved to scripts/verify_templates_result.png');

  console.log('🎉 ALL TESTS PASSED! AI Tools is visible and all demo unreal templates are removed.');
  await browser.close();
}

test().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
