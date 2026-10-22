/**
 * 12 Projects You Can Build In One Weekend — Recreated from @ai.veerse Instagram Carousel
 * Source: https://www.instagram.com/p/DeHYd1ZgSWF/
 *
 * 14 fully editable slides featuring the signature olive/sage-striped background,
 * burgundy/plum wallet card, phone app mockups, prompt badges, and complete text breakdown.
 * 100% editable canvas elements — Zero AI Slop.
 */
import { Template } from '../types';
import {
  El, T, R, C, I, SlideDef, build
} from './referenceTemplates';

const FRAUNCES = 'Fraunces';
const INTER = 'Inter';

// Helper for Project Slides (Slide 2 - 13)
interface ProjectSlideConfig {
  num: string;
  title1: string;
  title2: string;
  box1W: number;
  box2W: number;
  desc1: string;
  desc2: string;
  bullets: [string, string, string, string];
  phoneImg: string;
  previewUrl: string;
}

const makeProjectSlide = (cfg: ProjectSlideConfig): SlideDef => ({
  bg: '/carousels/ai_build_projects/bg_project_split.png',
  previewUrl: cfg.previewUrl,
  els: [
    // Project tag
    T(cfg.num, 55, 130, 360, 30, 22, { font: INTER, weight: 700, color: '#E4A2B2', ls: 3, upper: true }),

    // Title Line 1 with Selection Box & Handles
    R(45, 215, cfg.box1W, 75, '#A34F69', { r: 6, stroke: '#A3BF9E', sw: 1.5 }),
    C(35, 205, 20, 20, '#A3BF9E'),
    T(cfg.title1, 55, 220, cfg.box1W - 20, 65, 58, { font: INTER, weight: 800, color: '#FFFFFF' }),

    // Title Line 2 with Selection Box & Handles
    R(45, 295, cfg.box2W, 75, '#A34F69', { r: 6, stroke: '#A3BF9E', sw: 1.5 }),
    C(45 + cfg.box2W - 10, 360, 20, 20, '#A3BF9E'),
    T(cfg.title2, 55, 300, cfg.box2W - 20, 65, 52, { font: INTER, weight: 800, color: '#FFFFFF' }),

    // Description 1
    T(cfg.desc1, 55, 410, 360, 90, 26, { font: INTER, weight: 400, color: '#FFFFFF', lh: 1.35 }),

    // Sparkle Icon
    T('✨', 210, 515, 50, 50, 32, { align: 'center' }),

    // Description 2
    T(cfg.desc2, 55, 580, 360, 120, 24, { font: INTER, weight: 400, color: '#F3D2DC', lh: 1.45 }),

    // What it does header
    T('🌀 WHAT IT DOES', 55, 735, 360, 35, 20, { font: INTER, weight: 800, color: '#E4A2B2', ls: 2.5, upper: true }),

    // 4 Checkmark Bullets
    T(`✓  ${cfg.bullets[0]}`, 55, 795, 360, 45, 23, { font: INTER, weight: 500, color: '#FFFFFF' }),
    T(`✓  ${cfg.bullets[1]}`, 55, 855, 360, 45, 23, { font: INTER, weight: 500, color: '#FFFFFF' }),
    T(`✓  ${cfg.bullets[2]}`, 55, 915, 360, 45, 23, { font: INTER, weight: 500, color: '#FFFFFF' }),
    T(`✓  ${cfg.bullets[3]}`, 55, 975, 360, 45, 23, { font: INTER, weight: 500, color: '#FFFFFF' }),

    // Phone Mockup (Right Canvas Panel)
    I(cfg.phoneImg, 535, 275, 490, 816),
  ],
});

export const TEMPLATE_WEEKEND_AI_PROJECTS: Template = build({
  key: 'weekend-ai-projects',
  name: '12 Projects You Can Build In One Weekend',
  description: 'The viral 12 AI mini-projects carousel by @ai.veerse — featuring the iconic sage-striped aesthetic, wallet card, phone mockups, and prompt breakdown. 100% editable.',
  category: 'AI',
  tags: ['AI', 'projects', 'build', 'weekend', 'creator', 'coding', 'prompts', 'saas', 'tools'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeHYd1ZgSWF/',
  trending: true,
  createdAt: '2026-10-22T04:00:00.000Z',
  thumbnailUrl: '/carousels/ai_build_projects/slide1.jpg',
  slides: [
    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 1: HOOK / COVER
    // ═════════════════════════════════════════════════════════════════════════
    {
      bg: '/carousels/ai_build_projects/bg_stripes.png',
      previewUrl: '/carousels/ai_build_projects/slide1.jpg',
      els: [
        // Top right eyebrow
        T('Prompts included', 650, 45, 380, 40, 30, { font: INTER, weight: 500, color: '#81224A', align: 'right' }),

        // 4 Phone cards popping out of wallet card
        I('/carousels/ai_build_projects/cover_phones_perfect.png', 120, 180, 740, 240),

        // Main Burgundy Wallet Card
        R(140, 355, 800, 580, '#81224A', { r: 48 }),

        // "12 Projects" selection badge & handles
        R(260, 475, 550, 90, 'rgba(255,255,255,0.18)', { r: 8, stroke: '#A3BF9E', sw: 2 }),
        C(250, 465, 22, 22, '#A3BF9E'),
        C(800, 555, 22, 22, '#A3BF9E'),
        T('12 Projects', 270, 485, 530, 75, 78, { font: INTER, weight: 800, color: '#FFFFFF', align: 'center' }),

        // "you can build" headline in warm serif
        T('you can build', 160, 580, 760, 100, 88, { font: FRAUNCES, weight: 700, color: '#FFF4B8', align: 'center' }),

        // "in one weekend" selection badge & handles
        R(570, 690, 330, 56, 'rgba(255,255,255,0.18)', { r: 6, stroke: '#A3BF9E', sw: 2 }),
        C(562, 682, 18, 18, '#A3BF9E'),
        C(892, 738, 18, 18, '#A3BF9E'),
        T('in one weekend', 580, 695, 310, 46, 36, { font: INTER, weight: 600, color: '#FFFFFF', align: 'center' }),

        // 3D Yellow Button Sticker
        I('/carousels/ai_build_projects/sticker_yellow_btn.png', 855, 365, 140, 140),

        // 3D Pink Star Button Sticker
        I('/carousels/ai_build_projects/sticker_pink_star.png', 70, 665, 150, 150),

        // Bottom Tagline with rays
        T('\\\\  Ideas  Skills  Real Progress  /', 190, 1040, 700, 50, 38, { font: INTER, weight: 600, color: '#81224A', align: 'center' }),
      ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 2: PROJECT 01 — AI Receptionist
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 01',
      title1: 'AI',
      title2: 'Receptionist',
      box1W: 120,
      box2W: 385,
      desc1: 'An AI receptionist that picks up calls and DMs for you.',
      desc2: 'It handles FAQs, takes messages and flags anything urgent straight to you.',
      bullets: [
        'Answers phone calls and DMs',
        'Handles FAQs automatically',
        'Takes messages',
        'Flags urgent matters',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p01.png',
      previewUrl: '/carousels/ai_build_projects/slide3.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 3: PROJECT 02 — Money Dashboard
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 02',
      title1: 'Money',
      title2: 'Dashboard',
      box1W: 240,
      box2W: 385,
      desc1: 'A dashboard that pulls every income stream into one view.',
      desc2: 'Brand deals, product sales, client work. Total revenue by month, at a glance.',
      bullets: [
        'Connects every income source',
        'Total revenue by month',
        'Tracks your growth',
        'One clean dashboard',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p02.png',
      previewUrl: '/carousels/ai_build_projects/slide6.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 4: PROJECT 03 — WhatsApp Assistant
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 03',
      title1: 'WhatsApp',
      title2: 'Assistant',
      box1W: 360,
      box2W: 340,
      desc1: 'A WhatsApp assistant for your small business.',
      desc2: 'It answers FAQs, takes orders and handles bookings, 24/7.',
      bullets: [
        'Answers FAQs',
        'Takes orders',
        'Handles bookings',
        'Works 24/7',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p03.png',
      previewUrl: '/carousels/ai_build_projects/slide8.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 5: PROJECT 04 — Voice Note Idea Catcher
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 04',
      title1: 'Voice Note',
      title2: 'Idea Catcher',
      box1W: 360,
      box2W: 385,
      desc1: 'Record a voice note while you walk.',
      desc2: 'It transcribes it, pulls out your best ideas and sorts them into a neat list.',
      bullets: [
        'Records on the go',
        'Transcribes instantly',
        'Pulls out key ideas',
        'Organizes them into a list',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p04.png',
      previewUrl: '/carousels/ai_build_projects/slide4.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 6: PROJECT 05 — AI Chief of Staff
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 05',
      title1: 'AI Chief',
      title2: 'of Staff',
      box1W: 280,
      box2W: 260,
      desc1: 'An assistant that reads your calendar and inbox every morning.',
      desc2: "Then sends a short brief of what's coming up and what needs a reply.",
      bullets: [
        'Reads your calendar',
        'Scans your inbox',
        'Sends a morning brief',
        'Flags what needs a reply',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p05.png',
      previewUrl: '/carousels/ai_build_projects/slide5.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 7: PROJECT 06 — Comment Scraper
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 06',
      title1: 'Comment',
      title2: 'Scraper',
      box1W: 340,
      box2W: 290,
      desc1: 'A tool that scans the comments on your posts.',
      desc2: 'It pulls out the questions people keep asking and turns them into content ideas.',
      bullets: [
        'Scans comments',
        'Finds questions',
        'Groups them by theme',
        'Turns them into ideas',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p06.png',
      previewUrl: '/carousels/ai_build_projects/slide7.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 8: PROJECT 07 — Creator Collab Matchmaker
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 07',
      title1: 'Creator Collab',
      title2: 'Matchmaker',
      box1W: 395,
      box2W: 375,
      desc1: 'A matchmaker that pairs creators together.',
      desc2: 'It matches on niche, audience size and content style, so collabs happen faster.',
      bullets: [
        'Matches creators',
        'Filters by niche',
        'Audience size insights',
        'Content style match',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p07.png',
      previewUrl: '/carousels/ai_build_projects/slide2.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 9: PROJECT 08 — Link-in-Bio Page
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 08',
      title1: 'Link-in-Bio',
      title2: 'Page',
      box1W: 360,
      box2W: 200,
      desc1: 'A link-in-bio page you actually own.',
      desc2: 'Custom buttons, click analytics, and one less subscription to pay for.',
      bullets: [
        'Customizable buttons',
        'Click analytics',
        'Fully your own',
        'Cancel your subscription',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p08.png',
      previewUrl: '/carousels/ai_build_projects/slide9.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 10: PROJECT 09 — Public Ship Log
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 09',
      title1: 'Public',
      title2: 'Ship Log',
      box1W: 230,
      box2W: 320,
      desc1: 'A public tracker that logs every day you work on your project.',
      desc2: "It posts your streak automatically, so you can't quit.",
      bullets: [
        'Logs your work every day',
        'Posts automatically',
        'Tracks your streak',
        'Keeps you consistent',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p09.png',
      previewUrl: '/carousels/ai_build_projects/slide10.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 11: PROJECT 10 — Trip Planner
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 10',
      title1: 'Trip',
      title2: 'Planner',
      box1W: 160,
      box2W: 290,
      desc1: 'A trip planner that reads your screenshots and saved reels.',
      desc2: 'Then turns them into a day-by-day itinerary, all in one place.',
      bullets: [
        'Turns photos into plans',
        'Auto-saves reels',
        'Day-by-day itinerary',
        'All in one place',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p10.png',
      previewUrl: '/carousels/ai_build_projects/slide11.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 12: PROJECT 11 — Subscription Auditor
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 11',
      title1: 'Subscription',
      title2: 'Auditor',
      box1W: 410,
      box2W: 270,
      desc1: 'A tool that finds every subscription you pay for.',
      desc2: 'It flags the ones you forgot about, so you can cancel them.',
      bullets: [
        'Scans statements and emails',
        'Lists every subscription',
        'Flags the ones you don\'t use',
        'Shows what you can save',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p11.png',
      previewUrl: '/carousels/ai_build_projects/slide12.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 13: PROJECT 12 — 5-Minute Security Checker
    // ═════════════════════════════════════════════════════════════════════════
    makeProjectSlide({
      num: 'PROJECT 12',
      title1: '5-Minute',
      title2: 'Security Checker',
      box1W: 260,
      box2W: 415,
      desc1: "A 5-minute security checker for your app's code.",
      desc2: 'It finds exposed API keys and secrets before they go live.',
      bullets: [
        'Detects exposed API keys',
        'Scans your code in minutes',
        'Highlights risks clearly',
        'Helps you ship safer',
      ],
      phoneImg: '/carousels/ai_build_projects/phone_p12.png',
      previewUrl: '/carousels/ai_build_projects/slide13.jpg',
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // SLIDE 14: CALL TO ACTION (CTA)
    // ═════════════════════════════════════════════════════════════════════════
    {
      bg: '/carousels/ai_build_projects/bg_stripes.png',
      previewUrl: '/carousels/ai_build_projects/slide14.jpg',
      els: [
        // Main Ivory Card
        R(60, 215, 960, 960, '#F8F6EF', { r: 56, stroke: '#E5DFC8', sw: 1.5 }),

        // Squircle Asterisk Badge (floating at top)
        I('/carousels/ai_build_projects/sticker_asterisk.png', 458, 75, 164, 126),

        // Author Top Header
        T('Nandini', 200, 260, 680, 45, 42, { font: INTER, weight: 700, color: '#1F1F1F', align: 'center' }),
        R(440, 315, 200, 4, '#C05E38', { r: 2 }),

        // Headline
        T('Comment', 150, 350, 780, 80, 72, { font: FRAUNCES, italic: true, weight: 700, color: '#1F1F1F', align: 'center' }),
        T('“Build”', 150, 435, 780, 110, 108, { font: FRAUNCES, italic: true, weight: 700, color: '#C05E38', align: 'center' }),
        T('for the full list', 150, 545, 780, 80, 68, { font: FRAUNCES, italic: true, weight: 700, color: '#1F1F1F', align: 'center' }),

        // Separator Line
        R(440, 635, 200, 4, '#C05E38', { r: 2 }),

        // Subtitle explanation
        T("I'll DM you every prompt from this post,\nready to copy, paste and build.", 160, 660, 760, 80, 28, {
          font: INTER, weight: 400, color: '#333333', align: 'center', lh: 1.4
        }),

        // Author Avatar & Handle
        C(370, 760, 110, 110, '#C05E38'),
        T('ai.veerse', 370, 802, 110, 30, 16, { font: INTER, weight: 700, color: '#FFFFFF', align: 'center' }),
        T('Nandini', 500, 765, 300, 40, 32, { font: INTER, weight: 700, color: '#1F1F1F' }),
        T('@ai.veerse', 500, 810, 300, 35, 26, { font: INTER, weight: 600, color: '#C05E38' }),

        // Bookmark Prompt
        T('🔖  Save this & build one this weekend.', 200, 890, 680, 40, 26, {
          font: INTER, weight: 500, color: '#555555', align: 'center'
        }),

        // 3D Yellow Button Sticker
        I('/carousels/ai_build_projects/sticker_yellow_btn.png', 855, 470, 150, 150),

        // 3D Pink Star Button Sticker
        I('/carousels/ai_build_projects/sticker_pink_star.png', 0, 750, 170, 170),
      ],
    },
  ],
});
