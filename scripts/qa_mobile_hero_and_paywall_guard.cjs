const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = '/Users/apple/.gemini/antigravity-ide/brain/a67ce3b6-1a80-446a-a96d-c29b9c4a2c37/qa_evidence';
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runMobileHeroAndPaywallAudit() {
  console.log('========================================================');
  console.log('SWAPP.AI MOBILE HERO CAROUSEL & PAYWALL VERIFICATION AUDIT');
  console.log('========================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    paywall: {},
    heroCarousel: {}
  };

  try {
    // =========================================================================
    // PART 1: UNAUTHORIZED USER PAYWALL PROTECTION
    // =========================================================================
    console.log('--- PART 1: UNAUTHORIZED PAYWALL & AUTH GUARD AUDIT ---');

    const protectedUrls = [
      { name: 'Dashboard', url: 'http://localhost:5173/dashboard' },
      { name: 'Create', url: 'http://localhost:5173/create' },
      { name: 'Editor New Template', url: 'http://localhost:5173/editor/new?template=c1' },
      { name: 'Editor Direct Project', url: 'http://localhost:5173/editor/proj_unauthorized_123' },
    ];

    for (const item of protectedUrls) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`[Testing] Access to ${item.name} (${item.url})...`);
      await page.goto(item.url, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));

      const currentUrl = page.url();
      console.log(`  -> Redirected to: ${currentUrl}`);

      const isBlockedAndRedirected = currentUrl.includes('/pricing') || currentUrl.includes('/login');
      if (!isBlockedAndRedirected) {
        throw new Error(`CRITICAL SECURITY FAILURE: Unauthenticated user accessed ${item.url}! Current URL: ${currentUrl}`);
      }
      console.log(`  -> SUCCESS: Unauthorized access blocked. Redirected to /pricing.`);
      results.paywall[item.name] = { passed: true, redirectedTo: currentUrl };
      await context.close();
    }

    // Test Open in Canvas button on TemplatePreviewPage
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      console.log('[Testing] Open in Canvas button on /templates/c1...');
      await page.goto('http://localhost:5173/templates/c1', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 500));

      const openButton = await page.$('button.btn-accent');
      if (openButton) {
        await openButton.click();
        await new Promise(r => setTimeout(r, 600));
        const finalUrl = page.url();
        console.log(`  -> After clicking Open in Canvas: ${finalUrl}`);
        if (!finalUrl.includes('/pricing')) {
          throw new Error(`CRITICAL FAILURE: Open in Canvas allowed unauthenticated access to editor! URL: ${finalUrl}`);
        }
        console.log('  -> SUCCESS: Open in Canvas safely routed unauthenticated user to /pricing.');
        results.paywall['TemplatePreviewOpenInCanvas'] = { passed: true, redirectedTo: finalUrl };
      }
      await context.close();
    }

    console.log('\n>>> ALL PAYWALL & AUTH GUARD TESTS PASSED! <<<\n');

    // =========================================================================
    // PART 2: HERO CAROUSEL ANIMATION ACROSS BREAKPOINTS
    // =========================================================================
    console.log('--- PART 2: HERO CAROUSEL ANIMATION ACROSS BREAKPOINTS ---');
    const breakpoints = [
      { name: 'iPhone SE (375px)', width: 375, height: 667 },
      { name: 'iPhone 12/13/14 (390px)', width: 390, height: 844 },
      { name: 'Android Galaxy/Pixel (412px)', width: 412, height: 915 },
      { name: 'iPad / Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop (1440px)', width: 1440, height: 900 }
    ];

    for (const bp of breakpoints) {
      console.log(`\n[Testing Breakpoint] ${bp.name} (${bp.width}x${bp.height})`);
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: bp.width, height: bp.height });

      // Pre-accept cookie preferences so banner doesn't cover elements in automated test
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('swapp_cookie_consent', 'accepted');
      });

      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600)); // Allow animations to settle

      // 1. Check Hero Carousel Visibility & Computed Styles
      const carouselState = await page.evaluate(() => {
        // Find the deck container
        const cards = Array.from(document.querySelectorAll('img[alt^="Slide"]'));
        const authorBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('@marketingharry'));

        const counterElement = Array.from(document.querySelectorAll('span')).find(s => s.textContent === '01');

        // Check horizontal overflow
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docWidth > winWidth + 1; // 1px subpixel tolerance

        // Check if cards are visible
        const cardStates = cards.map((c, i) => {
          const parent = c.parentElement;
          const style = window.getComputedStyle(parent);
          return {
            index: i,
            display: style.display,
            visibility: style.visibility,
            opacity: parseFloat(style.opacity),
            transform: style.transform,
            zIndex: parseInt(style.zIndex, 10),
            src: c.getAttribute('src')
          };
        });

        // Check active card
        const activeCard = cardStates.find(c => c.zIndex === 10);

        return {
          totalCards: cards.length,
          hasHorizontalOverflow,
          docWidth,
          winWidth,
          cardStates,
          activeCardIndex: activeCard ? activeCard.index : -1,
          hasAuthorBadge: !!authorBadge,
          hasCounter: !!counterElement
        };
      });

      console.log(`  - Total cards rendered: ${carouselState.totalCards}`);
      console.log(`  - Horizontal scroll check: docWidth=${carouselState.docWidth}px, winWidth=${carouselState.winWidth}px (Overflow: ${carouselState.hasHorizontalOverflow})`);
      console.log(`  - Active card index: ${carouselState.activeCardIndex}`);

      if (carouselState.totalCards === 0) {
        throw new Error(`FAILURE at ${bp.name}: Hero Carousel cards are missing!`);
      }
      if (carouselState.hasHorizontalOverflow) {
        throw new Error(`FAILURE at ${bp.name}: Horizontal overflow detected! docWidth (${carouselState.docWidth}) > winWidth (${carouselState.winWidth})`);
      }
      if (carouselState.activeCardIndex === -1) {
        throw new Error(`FAILURE at ${bp.name}: Active card is missing or not visible!`);
      }

      // Capture initial screenshot
      const screenPathInitial = `${EVIDENCE_DIR}/hero_${bp.width}px_initial.png`;
      await page.screenshot({ path: screenPathInitial, fullPage: false });
      console.log(`  - Saved initial screenshot: ${screenPathInitial}`);

      // 2. Test Slide Transition Interaction (Click Next)
      console.log(`  - Testing slide transition on ${bp.name}...`);
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Next slide"]');
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 600)); // wait for 420ms CSS transition

      const updatedState = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('img[alt^="Slide"]'));
        const cardStates = cards.map((c, i) => {
          const parent = c.parentElement;
          const style = window.getComputedStyle(parent);
          return {
            index: i,
            opacity: parseFloat(style.opacity),
            transform: style.transform,
            zIndex: parseInt(style.zIndex, 10)
          };
        });
        const activeCard = cardStates.find(c => c.zIndex === 10);
        return {
          newActiveIndex: activeCard ? activeCard.index : -1
        };
      });

      console.log(`  - Slide transitioned cleanly to index: ${updatedState.newActiveIndex} (Expected: 1)`);
      if (updatedState.newActiveIndex !== 1) {
        throw new Error(`FAILURE at ${bp.name}: Slide transition failed. Expected index 1, got ${updatedState.newActiveIndex}`);
      }

      // Capture transitioned screenshot
      const screenPathTransition = `${EVIDENCE_DIR}/hero_${bp.width}px_transitioned.png`;
      await page.screenshot({ path: screenPathTransition, fullPage: false });
      console.log(`  - Saved transitioned screenshot: ${screenPathTransition}`);

      // 3. Test Touch Gesture (Swipe Left to advance to slide 3 / index 2 on mobile)
      if (bp.width < 640) {
        console.log(`  - Testing touch swipe gesture on ${bp.name}...`);
        await page.evaluate(() => {
          const stack = document.querySelector('.cursor-grab');
          if (stack) {
            const touchStart = new Touch({
              identifier: Date.now(),
              target: stack,
              clientX: 250,
              clientY: 300,
              radiusX: 2.5,
              radiusY: 2.5,
              rotationAngle: 10,
              force: 0.5,
            });
            const touchEnd = new Touch({
              identifier: Date.now(),
              target: stack,
              clientX: 120, // 130px swipe left
              clientY: 300,
              radiusX: 2.5,
              radiusY: 2.5,
              rotationAngle: 10,
              force: 0.5,
            });

            stack.dispatchEvent(new TouchEvent('touchstart', {
              cancelable: true,
              bubbles: true,
              touches: [touchStart],
              targetTouches: [touchStart],
              changedTouches: [touchStart]
            }));

            stack.dispatchEvent(new TouchEvent('touchend', {
              cancelable: true,
              bubbles: true,
              touches: [],
              targetTouches: [],
              changedTouches: [touchEnd]
            }));
          }
        });
        await new Promise(r => setTimeout(r, 600));

        const swipeState = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll('img[alt^="Slide"]'));
          const cardStates = cards.map((c, i) => {
            const parent = c.parentElement;
            const style = window.getComputedStyle(parent);
            return {
              index: i,
              zIndex: parseInt(style.zIndex, 10)
            };
          });
          const activeCard = cardStates.find(c => c.zIndex === 10);
          return { swipeActiveIndex: activeCard ? activeCard.index : -1 };
        });

        console.log(`  - Touch swipe moved slide to index: ${swipeState.swipeActiveIndex} (Expected: 2)`);
        if (swipeState.swipeActiveIndex !== 2) {
          throw new Error(`FAILURE at ${bp.name}: Touch swipe failed. Expected index 2, got ${swipeState.swipeActiveIndex}`);
        }
      }

      results.heroCarousel[bp.name] = {
        passed: true,
        cardsRendered: carouselState.totalCards,
        overflowFree: !carouselState.hasHorizontalOverflow,
        transitionWorking: updatedState.newActiveIndex === 1,
        screenshots: [screenPathInitial, screenPathTransition]
      };

      await context.close();
    }

    console.log('\n========================================================');
    console.log('SUMMARY AUDIT RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    console.log('========================================================');
    console.log('ALL VERIFICATIONS SUCCESSFUL!');

  } catch (err) {
    console.error('AUDIT FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMobileHeroAndPaywallAudit();
