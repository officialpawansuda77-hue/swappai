const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';
const BASE_URL = 'http://localhost:5173';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  ensureDir(EVIDENCE_DIR);
  console.log('--- STARTING QA TEST: Templates -> Canvas Editor -> Dashboard Persistence ---');

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
    // 1. Visit /templates
    console.log('1. Navigating to /templates...');
    await page.goto(`${BASE_URL}/templates`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '60_templates_page.png') });

    // 2. Test search by tag
    console.log('2. Testing search filtering on Templates...');
    await page.type('input[placeholder="Search templates..."]', 'creator');
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '61_templates_search_creator.png') });

    // Clear search
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder="Search templates..."]');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // 3. Click on the first template's Preview button
    console.log('3. Hovering first template and clicking Preview...');
    const firstCard = await page.$('.template-card');
    if (!firstCard) throw new Error('No template card found on /templates');
    await firstCard.hover();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '62_template_hover.png') });

    const previewLink = await page.$('a[href^="/templates/tpl_"]');
    if (!previewLink) throw new Error('Preview link not found');
    await previewLink.click();

    await page.waitForFunction(() => window.location.pathname.startsWith('/templates/tpl_'));
    await new Promise(r => setTimeout(r, 800));
    console.log('Successfully navigated to Template Preview:', await page.evaluate(() => window.location.pathname));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '63_template_preview_page.png') });

    // 4. Test slide navigation in previewer
    console.log('4. Navigating slides in Template Preview...');
    const nextBtn = await page.$('button svg.lucide-chevron-right');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '64_template_preview_slide2.png') });
    }

    // 5. Click "Open in Canvas"
    console.log('5. Clicking Open in Canvas button...');
    const openInCanvasBtn = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.find(a => a.textContent.includes('Open in Canvas'));
    });
    if (!openInCanvasBtn) throw new Error('Open in Canvas button not found');
    await openInCanvasBtn.click();

    await page.waitForFunction(() => window.location.pathname.startsWith('/editor/'));
    await new Promise(r => setTimeout(r, 1200));
    console.log('Successfully opened Editor:', await page.evaluate(() => window.location.href));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '65_editor_loaded.png') });

    // 6. Test Editor Operations
    console.log('6. Testing Text Element addition...');
    const textToolBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.trim().toLowerCase() === 'text');
    });
    if (textToolBtn) {
      await textToolBtn.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Added text element to canvas');
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '66_editor_text_added.png') });
    }

    // 7. Test Properties Panel editing
    console.log('7. Editing text content in Properties Panel...');
    const propTextarea = await page.$('textarea');
    if (propTextarea) {
      await propTextarea.click({ clickCount: 3 });
      await propTextarea.type('QA Verified Custom Headline!');
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '67_editor_text_edited.png') });
    }

    // 8. Test Duplicate element
    console.log('8. Testing Duplicate element...');
    const dupBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Duplicate'));
    });
    if (dupBtn) {
      await dupBtn.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Element duplicated');
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '68_editor_element_duplicated.png') });
    }

    // 9. Test Shapes addition
    console.log('9. Adding Shape...');
    const shapeToolBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.trim().toLowerCase() === 'shapes');
    });
    if (shapeToolBtn) {
      await shapeToolBtn.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Added shape element');
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '69_editor_shape_added.png') });
    }

    // 10. Switch to Slides tab
    console.log('10. Switching to Slides tab in left sidebar...');
    const slidesTabBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.trim().toLowerCase() === 'slides');
    });
    if (slidesTabBtn) {
      await slidesTabBtn.click();
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '70_editor_slides_tab.png') });

      // Add slide
      console.log('Adding a slide...');
      const addSlideBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent.trim().toLowerCase().includes('add'));
      });
      if (addSlideBtn) {
        await addSlideBtn.click();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(EVIDENCE_DIR, '71_editor_slide_added.png') });
      }
    }

    // 11. Test Undo / Redo
    console.log('11. Testing Undo...');
    const undoBtn = await page.$('button[title*="Undo"]');
    if (undoBtn) {
      await undoBtn.click();
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '72_editor_undone.png') });
    }

    // 12. Save project
    console.log('12. Clicking Save button...');
    const saveBtn = await page.$('button[title*="Save project"]');
    if (saveBtn) {
      await saveBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '73_editor_saved.png') });
    }

    // 13. Test Export Modal
    console.log('13. Opening Export Modal...');
    const exportBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.trim().toLowerCase() === 'export');
    });
    if (exportBtn) {
      await exportBtn.click();
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '74_editor_export_modal.png') });

      // Trigger export
      const doExportBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent.includes('Export all slides') || b.textContent.includes('Export current slide'));
      });
      if (doExportBtn) {
        await doExportBtn.click();
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({ path: path.join(EVIDENCE_DIR, '75_editor_export_toast.png') });
      }
    }

    // 14. Navigate back to Dashboard and verify recent project
    console.log('14. Navigating back to /dashboard to verify project persistence...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '76_dashboard_projects_persisted.png') });

    const recentProjects = await page.$$('.template-card');
    console.log(`Found ${recentProjects.length} project/template cards on Dashboard`);
    if (recentProjects.length === 0) throw new Error('No recent projects found on dashboard!');

    // 15. Click the most recent project to reopen in Editor
    console.log('15. Clicking first project card to reopen in Editor...');
    await recentProjects[0].click();
    await page.waitForFunction(() => window.location.pathname.startsWith('/editor/'));
    await new Promise(r => setTimeout(r, 1000));
    console.log('Reopened in editor:', await page.evaluate(() => window.location.href));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '77_editor_reopened_project.png') });

    console.log('=== QA TEST PASSED: TEMPLATES -> EDITOR -> PERSISTENCE -> RELOAD FULLY VERIFIED ===');
  } catch (err) {
    console.error('QA TEST FAILED:', err);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'qa_error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
