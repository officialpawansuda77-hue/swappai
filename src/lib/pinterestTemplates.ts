/**
 * PINTEREST INSPIRATION TEMPLATE PACK — 17 High-Converting Creator Carousels
 * Recreated with 100% editable native canvas elements, authentic typography,
 * custom background plates, and zero AI slop.
 *
 * References:
 *   1. Retro Brand Showcase            — @laulitronc (Pin 7EHiRraPe)
 *   2. LinkedIn Authority & Growth     — Nicole Marguerite (Pin 6fLlGf9LD)
 *   3. Meet The Designer (Ann)         — YAS Studio Co (Pin 77TJN5plN)
 *   4. BTS Web Design Strategy         — YAS Studio Co (Pin 52atnEHPy)
 *   5. Designer Gift Guide & Wishlist  — @brandingwith.halder (Pin 4g6KimhND)
 *   6. Daily Survival Kit 2026         — Atin (Pin 6YN5zrZvC)
 *   7. 6 Entrepreneur Documentaries    — Amit Sharma / Think Like a Founder (Pin 2PkRXQd10)
 *   8. Are You Bad with Money?         — ilovecreatives (Pin 3vO5hbJJA)
 *   9. How To Rebrand (Design School)  — Naeema @naelovesart (Pin eWDoNcEW4)
 *  10. Agency Culture / Takiya Kalam   — The Buzz Marketers (Pin 6Z5OtA4Ab)
 *  11. 5-Step Business Blueprint       — Printify (Pin WzBV2eXWz)
 *  12. Bollywood Pop-Culture Strategy  — Squirrel Wiz (Pin cy9ejOl9G)
 *  13. Brand Designer On-Call          — SUDZ.IN (Pin 3P9PC7eqi)
 *  14. Creator Passive Income Corkboard— @sumincreates / SUDZ.IN (Pin 5xPvh50wE)
 *  15. High-Fashion Meme Hook          — Mystic Aura (Pin 5sGXTdOpU)
 *  16. Notion is Not Confusing         — Juanjo Labs (Pin LsYxgBsyt)
 *  17. When Your SMM is Gen Z          — SUDZ.IN (Pin 6lNzkzJoq)
 */

import { Template } from '../types';
import { El, T, R, C, I, SlideDef, build } from './referenceTemplates';

const INTER = 'Inter';
const PLAYFAIR = 'Playfair Display';

// ═════════════════════════════════════════════════════════════════════════════
// 1. RETRO BRAND SHOWCASE (@laulitronc)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_RETRO_BRAND_SHOWCASE: Template = build({
  key: 'pin-retro-brands-2025',
  name: 'Retro Brand Showcase',
  description: 'Natural meadow & rock backdrop with retro serif typography, floating stickers, and showcase case studies.',
  category: 'Creator',
  tags: ['branding', 'portfolio', 'retro', 'editorial', 'showcase', 'designer', 'minimal'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/7EHiRraPe',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_1.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_meadow_rock.png',
      previewUrl: '/carousels/pinterest_refs/pin_1.jpg',
      els: [
        T('Some', 180, 240, 400, 140, 120, { font: PLAYFAIR, weight: 800, color: '#3A0814' }),
        C(160, 365, 85, 85, '#FFD166'),
        T('✏️', 178, 382, 50, 50, 38, { align: 'center' }),
        T('brands', 285, 345, 450, 140, 130, { font: PLAYFAIR, italic: true, weight: 700, color: '#3A0814' }),
        R(505, 300, 220, 68, '#BEDBFE', { r: 34 }),
        T('@lauliblue', 525, 316, 180, 36, 26, { font: INTER, weight: 700, color: '#1E3A8A', align: 'center' }),
        T("I've designed", 180, 460, 720, 130, 115, { font: PLAYFAIR, weight: 800, color: '#3A0814' }),
        R(260, 540, 220, 72, '#FFAAC6', { r: 8, rot: -4 }),
        T('in 2025', 275, 550, 190, 50, 42, { font: INTER, weight: 900, color: '#3A0814', rot: -4, align: 'center' }),
        R(510, 590, 340, 6, '#FFFFFF', { r: 3 }),
        T('👆', 690, 580, 60, 60, 44, { rot: 45 }),
      ]
    },
    {
      bg: '#FAF8F4',
      els: [
        T('01 / IDENTITY', 80, 100, 400, 30, 20, { font: INTER, weight: 800, color: '#3A0814', ls: 3, upper: true }),
        T('Solera Organic Wines', 80, 150, 920, 80, 64, { font: PLAYFAIR, weight: 800, color: '#3A0814' }),
        T('Earthy typography & heritage illustration for a biodynamic vineyard nestled in the Spanish valleys.', 80, 240, 920, 100, 28, { font: INTER, weight: 400, color: '#5C382A', lh: 1.4 }),
        R(80, 370, 920, 600, '#EAE1D2', { r: 24 }),
        T('SOLERA', 120, 580, 840, 120, 96, { font: PLAYFAIR, italic: true, weight: 800, color: '#3A0814', align: 'center' }),
        T('EST. 1984 • VALENCIA', 120, 710, 840, 40, 22, { font: INTER, weight: 700, color: '#7A5445', align: 'center', ls: 4 }),
        R(80, 1010, 280, 160, '#3A0814', { r: 16 }),
        R(400, 1010, 280, 160, '#C9A66B', { r: 16 }),
        R(720, 1010, 280, 160, '#E2D3B8', { r: 16 }),
        T('#3A0814\nPrimary', 100, 1060, 240, 70, 20, { font: INTER, weight: 600, color: '#FFFFFF' }),
        T('#C9A66B\nGold Leaf', 420, 1060, 240, 70, 20, { font: INTER, weight: 600, color: '#3A0814' }),
        T('#E2D3B8\nParchment', 740, 1060, 240, 70, 20, { font: INTER, weight: 600, color: '#3A0814' }),
      ]
    },
    {
      bg: '#F5EBE6',
      els: [
        T('02 / ATELIER', 80, 100, 400, 30, 20, { font: INTER, weight: 800, color: '#3A0814', ls: 3, upper: true }),
        T('Alma Ceramic Studio', 80, 150, 920, 80, 64, { font: PLAYFAIR, weight: 800, color: '#3A0814' }),
        T('Hand-thrown minimalist tableware with tactile blind-debossed letterpress identity.', 80, 240, 920, 100, 28, { font: INTER, weight: 400, color: '#684538', lh: 1.4 }),
        R(80, 370, 920, 640, '#DBC3B7', { r: 24 }),
        T('A L M A', 120, 600, 840, 100, 88, { font: PLAYFAIR, weight: 700, color: '#3A0814', align: 'center', ls: 12 }),
        T('CERAMICS & FORMS', 120, 710, 840, 40, 24, { font: INTER, weight: 600, color: '#543024', align: 'center', ls: 5 }),
        T('Crafted for mindful living and warm morning rituals.', 80, 1060, 920, 80, 30, { font: INTER, weight: 500, color: '#3A0814', italic: true }),
      ]
    },
    {
      bg: '#FAF8F4',
      els: [
        T('03 / BAKERY', 80, 100, 400, 30, 20, { font: INTER, weight: 800, color: '#3A0814', ls: 3, upper: true }),
        T('Bloom Pastry & Cafe', 80, 150, 920, 80, 64, { font: PLAYFAIR, weight: 800, color: '#3A0814' }),
        T('Pastel joy, custom stickers, and buttery Viennoiserie packaging that went viral on TikTok.', 80, 240, 920, 100, 28, { font: INTER, weight: 400, color: '#5C382A', lh: 1.4 }),
        R(80, 370, 920, 640, '#FCE7EE', { r: 24 }),
        T('bloom 🥐', 120, 590, 840, 100, 90, { font: PLAYFAIR, italic: true, weight: 800, color: '#B33951', align: 'center' }),
        T('FRESH DAILY BAKED GOODS', 120, 700, 840, 40, 22, { font: INTER, weight: 700, color: '#B33951', align: 'center', ls: 3 }),
        T('Over 45,000 pastry boxes printed in year one.', 80, 1060, 920, 80, 30, { font: INTER, weight: 500, color: '#3A0814' }),
      ]
    },
    {
      bg: '#3A0814',
      els: [
        T('Which one is your favorite?', 80, 320, 920, 90, 54, { font: PLAYFAIR, italic: true, weight: 700, color: '#FCE7EE', align: 'center' }),
        T('Got a brand project in mind?\nLet’s make it unforgettable. 💌', 80, 440, 920, 220, 72, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        R(280, 740, 520, 80, '#FFAAC6', { r: 40 }),
        T('BOOK A DISCOVERY CALL →', 300, 762, 480, 40, 24, { font: INTER, weight: 900, color: '#3A0814', align: 'center', ls: 2 }),
        T('Link in bio to reserve your 2026 brand slot • Limited client intake', 80, 870, 920, 60, 24, { font: INTER, weight: 400, color: 'rgba(255,255,255,0.7)', align: 'center' }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. LINKEDIN AUTHORITY & PERSONAL GROWTH (Nicole Marguerite)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_LINKEDIN_AUTHORITY: Template = build({
  key: 'pin-linkedin-authority',
  name: 'LinkedIn Authority & Personal Growth',
  description: 'Graph paper backdrop with notification pills, 3D magnet and star stickers, and creator portraits.',
  category: 'Personal Brand',
  tags: ['linkedin', 'growth', 'personal brand', 'authority', 'content', 'creators'],
  style: 'Modern',
  audience: 'Founders',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/6fLlGf9LD',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_2.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_grid_white.png',
      previewUrl: '/carousels/pinterest_refs/pin_2.jpg',
      els: [
        R(700, 35, 330, 110, '#FFFFFF', { r: 16, stroke: '#D0D7DE', sw: 1 }),
        T('LinkedIn', 725, 45, 120, 30, 20, { font: INTER, weight: 800, color: '#0A66C2' }),
        T('You appeared in 1,897\nsearches this week', 725, 75, 290, 55, 18, { font: INTER, weight: 600, color: '#1F2328' }),
        T('🧲', 820, 150, 60, 60, 40),
        T('🌟', 340, 160, 50, 50, 32),
        T('Linkedin', 250, 220, 500, 110, 96, { font: INTER, weight: 900, color: '#111111' }),
        R(715, 200, 130, 110, '#0A66C2', { r: 24 }),
        T('in', 735, 205, 90, 90, 86, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('can make you', 235, 320, 610, 80, 64, { font: INTER, weight: 800, color: '#111111', align: 'center' }),
        T('the luckiest girl', 140, 380, 800, 100, 80, { font: INTER, weight: 900, color: '#111111', align: 'center' }),
        T('on the internet', 280, 460, 520, 60, 44, { font: INTER, weight: 700, color: '#111111', align: 'center' }),
        I('/carousels/pinterest_templates/img_linkedin_creators.png', 0, 580, 1080, 770),
      ]
    },
    {
      bg: '#F8FAFC',
      els: [
        T('THE 2026 SHIFT', 80, 100, 400, 30, 20, { font: INTER, weight: 800, color: '#0A66C2', ls: 3, upper: true }),
        T('Why LinkedIn is the #1 inbound engine for founders & creators.', 80, 150, 920, 140, 52, { font: INTER, weight: 900, color: '#0F172A', lh: 1.2 }),
        R(80, 330, 920, 240, '#FFFFFF', { r: 20, stroke: '#E2E8F0', sw: 1.5 }),
        T('1. High Purchase Intent', 120, 360, 840, 40, 28, { font: INTER, weight: 800, color: '#0F172A' }),
        T('Unlike Instagram or TikTok where users scroll to kill time, LinkedIn users are actively looking to hire, partner, and invest in solutions.', 120, 410, 840, 120, 24, { font: INTER, weight: 400, color: '#475569', lh: 1.5 }),
        R(80, 610, 920, 240, '#FFFFFF', { r: 20, stroke: '#E2E8F0', sw: 1.5 }),
        T('2. The Founder Moat', 120, 640, 840, 40, 28, { font: INTER, weight: 800, color: '#0F172A' }),
        T('Company pages get 5x lower reach than real human beings. People don’t follow corporate logos — they follow transparent journeys.', 120, 690, 840, 120, 24, { font: INTER, weight: 400, color: '#475569', lh: 1.5 }),
        R(80, 890, 920, 240, '#FFFFFF', { r: 20, stroke: '#E2E8F0', sw: 1.5 }),
        T('3. Compounding Authority', 120, 920, 840, 40, 28, { font: INTER, weight: 800, color: '#0F172A' }),
        T('One viral insight connects you directly with decision-makers, podcast hosts, and premium clients without spending a dime on ads.', 120, 970, 840, 120, 24, { font: INTER, weight: 400, color: '#475569', lh: 1.5 }),
      ]
    },
    {
      bg: '#0F172A',
      els: [
        T('THE WEEKLY PROTOCOL', 80, 120, 400, 30, 20, { font: INTER, weight: 800, color: '#38BDF8', ls: 3, upper: true }),
        T('How to generate 5 inbound leads a week in 45 minutes a day:', 80, 170, 920, 130, 48, { font: INTER, weight: 800, color: '#FFFFFF', lh: 1.2 }),
        T('Mon: The Contrarian Teardown', 80, 340, 920, 50, 32, { font: INTER, weight: 800, color: '#38BDF8' }),
        T('Challenge a mainstream industry myth with real numbers from your work.', 80, 395, 920, 70, 24, { font: INTER, weight: 400, color: '#94A3B8' }),
        T('Wed: The Transparent Case Study', 80, 500, 920, 50, 32, { font: INTER, weight: 800, color: '#38BDF8' }),
        T('Step-by-step breakdown of how a client achieved a specific quantifiable outcome.', 80, 555, 920, 70, 24, { font: INTER, weight: 400, color: '#94A3B8' }),
        T('Fri: Personal Reflection & BTS', 80, 660, 920, 50, 32, { font: INTER, weight: 800, color: '#38BDF8' }),
        T('What went wrong this week and the exact lesson you learned.', 80, 715, 920, 70, 24, { font: INTER, weight: 400, color: '#94A3B8' }),
        R(80, 840, 920, 280, '#1E293B', { r: 24 }),
        T('Daily Engagement Rule:', 120, 880, 840, 40, 26, { font: INTER, weight: 700, color: '#FFFFFF' }),
        T('Leave 10 thoughtful, multi-paragraph comments on creators in your niche BEFORE you hit publish on your own post.', 120, 930, 840, 120, 24, { font: INTER, weight: 400, color: '#CBD5E1', lh: 1.5 }),
      ]
    },
    {
      bg: '#0A66C2',
      els: [
        T('Lock in gurl, lock in.', 80, 420, 920, 80, 64, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('Your dream clients are already on LinkedIn.\nThey just don’t know who you are yet.', 80, 520, 920, 120, 32, { font: INTER, weight: 500, color: '#E0F2FE', align: 'center', lh: 1.4 }),
        R(300, 720, 480, 80, '#FFFFFF', { r: 40 }),
        T('FOLLOW FOR DAILY PLAYBOOK →', 320, 745, 440, 40, 22, { font: INTER, weight: 900, color: '#0A66C2', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. MEET THE DESIGNER (ANN) (YAS Studio Co)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_MEET_THE_DESIGNER_ANN: Template = build({
  key: 'pin-meet-the-designer-ann',
  name: 'Meet The Designer (Ann)',
  description: 'Arched retro 3D headline with floating macOS folders, glitter crown, and signature name tag.',
  category: 'Personal Brand',
  tags: ['meet the team', 'designer', 'about me', 'creative', 'agency', 'introduction'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/77TJN5plN',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_3.jpg',
  slides: [
    {
      bg: '#EBE6DC',
      previewUrl: '/carousels/pinterest_refs/pin_3.jpg',
      els: [
        T('MEET THE', 340, 25, 400, 50, 42, { font: INTER, weight: 900, color: '#F8F6F0', align: 'center' }),
        T('Designer', 80, 60, 920, 160, 135, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', stroke: '#CFC5B4', sw: 6 }),
        I('/carousels/pinterest_templates/img_designer_ann.png', 0, 360, 1080, 990),
        T('👑', 470, 100, 70, 70, 50, { rot: 15 }),
        R(40, 340, 230, 130, '#8A9DF0', { r: 16 }),
        T('Detail-\nobsessed\nby nature', 55, 355, 200, 100, 24, { font: INTER, weight: 600, color: '#FFFFFF', lh: 1.2 }),
        R(790, 310, 210, 110, '#C94E78', { r: 16 }),
        T('Photoshop\nkid', 805, 330, 180, 70, 24, { font: INTER, weight: 600, color: '#FFFFFF', lh: 1.2 }),
        R(740, 720, 200, 110, '#E88B63', { r: 16 }),
        T('Spacing\nobsessive', 755, 740, 170, 70, 24, { font: INTER, weight: 600, color: '#FFFFFF', lh: 1.2 }),
        R(170, 790, 320, 160, '#E5E85C', { r: 16 }),
        T('HELLO\nmy name is', 190, 805, 280, 50, 20, { font: INTER, weight: 800, color: '#5C5F12', upper: true }),
        T('ANN', 190, 860, 280, 70, 64, { font: INTER, weight: 900, color: '#111111' }),
      ]
    },
    {
      bg: '#FAF9F5',
      els: [
        T('THE STORY SO FAR', 80, 120, 400, 30, 20, { font: INTER, weight: 800, color: '#C94E78', ls: 3, upper: true }),
        T('From Accountancy Student to Full-Time Creative 🎨', 80, 170, 920, 130, 54, { font: PLAYFAIR, weight: 800, color: '#1F2937', lh: 1.2 }),
        T('I spent 3 years preparing for spreadsheets and balance sheets before realizing my brain is wired for visual storytelling and brand systems.', 80, 340, 920, 120, 28, { font: INTER, weight: 400, color: '#4B5563', lh: 1.5 }),
        T('Turns out? That analytical foundation became my biggest competitive advantage. I don’t just design things to look pretty — I build brand identities engineered to convert and scale.', 80, 490, 920, 140, 28, { font: INTER, weight: 400, color: '#4B5563', lh: 1.5 }),
        R(80, 700, 920, 360, '#EBE6DC', { r: 24 }),
        T('3 THINGS I SWEAR BY:', 120, 740, 840, 40, 24, { font: INTER, weight: 800, color: '#1F2937', ls: 2 }),
        T('1. Hierarchy is everything. If everything is shouting, nothing is heard.', 120, 800, 840, 60, 24, { font: INTER, weight: 500, color: '#374151' }),
        T('2. 80% strategy, 20% aesthetic execution.', 120, 870, 840, 60, 24, { font: INTER, weight: 500, color: '#374151' }),
        T('3. Real feedback over endless committee meetings.', 120, 940, 840, 60, 24, { font: INTER, weight: 500, color: '#374151' }),
      ]
    },
    {
      bg: '#1F2937',
      els: [
        T('Let’s create something timeless.', 80, 420, 920, 100, 64, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', align: 'center' }),
        T('Currently booking brand strategy & visual identity projects for Q1/Q2.', 80, 540, 920, 80, 28, { font: INTER, weight: 400, color: '#D1D5DB', align: 'center', lh: 1.4 }),
        R(300, 680, 480, 80, '#E5E85C', { r: 40 }),
        T('DM "START" TO CONNECT →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#111111', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. BTS WEB DESIGN STRATEGY (YAS Studio Co)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_BTS_WEB_DESIGN: Template = build({
  key: 'pin-bts-web-design',
  name: 'BTS Web Design Strategy',
  description: 'Powder blue pinstripes with laptop POV hands, highlighted typography, and strategic process breakdown.',
  category: 'Marketing',
  tags: ['web design', 'bts', 'process', 'ux', 'conversion', 'agency', 'strategy'],
  style: 'Editorial',
  audience: 'Agencies',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/52atnEHPy',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_4.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_blue_pinstripe.png',
      previewUrl: '/carousels/pinterest_refs/pin_4.jpg',
      els: [
        T('All the', 90, 80, 230, 80, 72, { font: PLAYFAIR, weight: 800, color: '#2B160C' }),
        R(320, 85, 340, 75, '#FCE8DC', { r: 8 }),
        T('unsexy', 345, 80, 290, 80, 76, { font: INTER, weight: 900, color: '#2B160C' }),
        T('things', 670, 80, 310, 80, 72, { font: PLAYFAIR, weight: 800, color: '#2B160C' }),
        T('I do before we start a', 90, 160, 900, 80, 72, { font: PLAYFAIR, weight: 800, color: '#2B160C' }),
        T('web', 130, 240, 160, 80, 72, { font: PLAYFAIR, weight: 800, color: '#2B160C' }),
        R(295, 245, 330, 75, '#FCE8DC', { r: 8 }),
        T('design', 320, 240, 280, 80, 76, { font: INTER, weight: 900, color: '#2B160C' }),
        T('project', 635, 240, 320, 80, 72, { font: PLAYFAIR, weight: 800, color: '#2B160C' }),
        R(200, 350, 680, 60, '#A8D5E5', { r: 30 }),
        T('A PEEK BTS BEFORE THE STRATEGY CALL', 220, 365, 640, 35, 22, { font: INTER, weight: 900, color: '#153A47', align: 'center', ls: 2 }),
        I('/carousels/pinterest_templates/img_laptop_hands_pov.png', 0, 480, 1080, 870),
      ]
    },
    {
      bg: '#F4F9FC',
      els: [
        T('STEP 01', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#153A47', ls: 3 }),
        T('The Competitor Audit (Where are they weak?)', 80, 170, 920, 120, 48, { font: PLAYFAIR, weight: 800, color: '#1B2C36', lh: 1.2 }),
        T('Before opening Figma, I dissect 5 of your top competitors. I check their mobile site speed, call-to-action placement, customer objections, and trust signals.', 80, 320, 920, 130, 28, { font: INTER, weight: 400, color: '#476270', lh: 1.5 }),
        R(80, 490, 920, 380, '#FFFFFF', { r: 24, stroke: '#D8E8F2', sw: 1.5 }),
        T('WHAT WE LOOK FOR:', 120, 530, 840, 40, 22, { font: INTER, weight: 800, color: '#1B2C36', ls: 2 }),
        T('• Are their headlines vague marketing speak or direct value propositions?', 120, 590, 840, 50, 24, { font: INTER, weight: 500, color: '#334E5C' }),
        T('• Where do prospective buyers get confused or bounce?', 120, 650, 840, 50, 24, { font: INTER, weight: 500, color: '#334E5C' }),
        T('• What social proof are they missing that you already have?', 120, 710, 840, 50, 24, { font: INTER, weight: 500, color: '#334E5C' }),
        T('• Is the booking process smooth in 2 clicks or 7 steps?', 120, 770, 840, 50, 24, { font: INTER, weight: 500, color: '#334E5C' }),
      ]
    },
    {
      bg: '#153A47',
      els: [
        T('Ready for a website that actually sells?', 80, 420, 920, 100, 56, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', align: 'center' }),
        T('No templates, no fluff. Just intentional architecture built for conversion.', 80, 540, 920, 80, 28, { font: INTER, weight: 400, color: '#A8D5E5', align: 'center', lh: 1.4 }),
        R(300, 680, 480, 80, '#FCE8DC', { r: 40 }),
        T('INQUIRE FOR NEXT MONTH →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#2B160C', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. DESIGNER GIFT GUIDE & WISHLIST (@brandingwith.halder)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_DESIGNER_GIFT_GUIDE: Template = build({
  key: 'pin-designer-gift-guide',
  name: 'Designer Gift Guide & Wishlist',
  description: 'Deep burgundy maroon grid with binder-clipped paper stack, vector selection boxes, and holiday wishlists.',
  category: 'Product',
  tags: ['designer', 'gift guide', 'wishlist', 'typography', 'creative', 'curation'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/4g6KimhND',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_5.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_burgundy_grid.png',
      previewUrl: '/carousels/pinterest_refs/pin_5.jpg',
      els: [
        T('@brandingwith.halder', 80, 65, 920, 40, 28, { font: PLAYFAIR, italic: true, weight: 700, color: '#FF7A45', align: 'center' }),
        R(160, 150, 760, 980, '#FDFBF7', { r: 24 }),
        R(320, 290, 240, 90, '#DDD6FE', { r: 8 }),
        T('gifts', 350, 275, 180, 100, 88, { font: PLAYFAIR, weight: 800, color: '#2B1820' }),
        T('every', 390, 385, 300, 90, 80, { font: INTER, weight: 900, color: '#2B1820' }),
        T('designer', 240, 475, 600, 110, 98, { font: PLAYFAIR, weight: 800, color: '#2B1820' }),
        R(365, 575, 275, 95, '#CCFBF1', { r: 8 }),
        T('loves', 385, 565, 235, 100, 92, { font: PLAYFAIR, italic: true, weight: 800, color: '#2B1820' }),
        T('I wouldn’t mind one.', 160, 690, 760, 50, 36, { font: PLAYFAIR, italic: true, weight: 700, color: '#FF7A45', align: 'center' }),
        R(340, 770, 400, 65, '#E5E0D5', { r: 12 }),
        T('Take a look →', 360, 785, 360, 35, 24, { font: INTER, weight: 700, color: '#4B453A', align: 'center' }),
        T('My wishlist', 80, 1180, 920, 50, 32, { font: PLAYFAIR, weight: 700, color: '#FF7A45', align: 'center' }),
      ]
    },
    {
      bg: '#2B1820',
      els: [
        T('01 / HARDWARE', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#FF7A45', ls: 3 }),
        T('Herman Miller Aeron Lumbar Chair', 80, 170, 920, 120, 52, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', lh: 1.2 }),
        T('Because bad posture is the #1 silent career ender for full-time designers. Give us lumbar support, not another novelty ceramic mug.', 80, 320, 920, 120, 28, { font: INTER, weight: 400, color: '#E2D5D9', lh: 1.5 }),
        R(80, 480, 920, 340, '#3A202C', { r: 24 }),
        T('PRICE RANGE: $800 - $1,400', 120, 520, 840, 40, 22, { font: INTER, weight: 700, color: '#FF7A45', ls: 2 }),
        T('Why designers love it:', 120, 580, 840, 40, 24, { font: INTER, weight: 700, color: '#FFFFFF' }),
        T('Breathable pellicle mesh prevents heat buildup during 12-hour marathon deadline days. Fully adjustable armrests for mouse & tablet drawing.', 120, 630, 840, 120, 24, { font: INTER, weight: 400, color: '#D4C4C9', lh: 1.5 }),
      ]
    },
    {
      bg: '#FDFBF7',
      els: [
        T('Send this to someone who needs a hint 🎁', 80, 450, 920, 100, 52, { font: PLAYFAIR, italic: true, weight: 800, color: '#2B1820', align: 'center' }),
        T('Save this post to your holiday moodboard.', 80, 570, 920, 60, 28, { font: INTER, weight: 500, color: '#685A5F', align: 'center' }),
        R(300, 690, 480, 80, '#2B1820', { r: 40 }),
        T('SAVE TO WISHLIST →', 320, 715, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. DAILY SURVIVAL KIT 2026 (Atin)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_DESIGNER_SURVIVAL_KIT: Template = build({
  key: 'pin-designer-survival-kit',
  name: 'Daily Survival Kit (2026 Edition)',
  description: 'Clean graph grid with pastel pill badges, angled cards, retro cursor, and daily productivity toolkit.',
  category: 'Productivity',
  tags: ['toolkit', 'designer', 'productivity', 'software', 'survival kit', 'tools', 'minimal'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/6YN5zrZvC',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_6.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_grid_white.png',
      previewUrl: '/carousels/pinterest_refs/pin_6.jpg',
      els: [
        T('Atin✦', 80, 65, 920, 50, 36, { font: INTER, weight: 900, color: '#0A2540', align: 'center' }),
        R(160, 250, 240, 140, '#FFFFFF', { r: 8, stroke: '#111111', sw: 3, rot: -6 }),
        T('My', 180, 275, 200, 90, 72, { font: INTER, weight: 900, color: '#111111', rot: -6, align: 'center' }),
        R(130, 340, 820, 160, '#A2C0F9', { r: 80 }),
        T('Graphic Design', 170, 380, 740, 90, 78, { font: INTER, weight: 900, color: '#0D1117', align: 'center' }),
        R(640, 420, 260, 140, '#FFFFFF', { r: 8, stroke: '#111111', sw: 3, rot: 6 }),
        T('Daily', 660, 445, 220, 90, 68, { font: INTER, weight: 900, color: '#111111', rot: 6, align: 'center' }),
        R(130, 480, 820, 160, '#FCD364', { r: 80 }),
        T('Survival Kit', 170, 520, 740, 90, 84, { font: INTER, weight: 900, color: '#0D1117', align: 'center' }),
        R(290, 580, 460, 130, '#FFFFFF', { r: 8, stroke: '#111111', sw: 3 }),
        T('2026 Edition', 310, 615, 420, 70, 56, { font: INTER, weight: 900, color: '#111111', align: 'center' }),
        T('👆', 490, 675, 60, 60, 44),
        T('✦', 170, 450, 50, 50, 36, { color: '#0A2540' }),
        T('✏️', 740, 550, 80, 80, 58, { rot: 25 }),
        R(50, 1150, 980, 4, '#0D1117'),
      ]
    },
    {
      bg: '#FFFFFF',
      els: [
        T('01 / CORE WORKHORSE', 80, 120, 400, 30, 20, { font: INTER, weight: 800, color: '#A2C0F9', ls: 3, upper: true }),
        T('Figma (UI & Design Systems)', 80, 170, 920, 80, 56, { font: INTER, weight: 900, color: '#0D1117' }),
        T('Still unmatched for component architecture, auto-layout mastery, and collaborating with developers in real time.', 80, 270, 920, 100, 28, { font: INTER, weight: 400, color: '#4A5568', lh: 1.5 }),
        R(80, 400, 920, 260, '#F0F5FF', { r: 24, stroke: '#D0E0FF', sw: 2 }),
        T('FAVORITE SHORTCUTS:', 120, 440, 840, 35, 20, { font: INTER, weight: 800, color: '#1E40AF', ls: 2 }),
        T('• Shift + A: Auto-layout everything', 120, 490, 840, 40, 24, { font: INTER, weight: 600, color: '#1E293B' }),
        T('• Cmd + Option + K: Instant reusable component', 120, 540, 840, 40, 24, { font: INTER, weight: 600, color: '#1E293B' }),
        T('• Option + L: Collapse all layers clean', 120, 590, 840, 40, 24, { font: INTER, weight: 600, color: '#1E293B' }),
      ]
    },
    {
      bg: '#0D1117',
      els: [
        T('Taste beats tools every time.', 80, 440, 920, 90, 58, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('Master 3 tools deeply instead of switching apps every month.', 80, 550, 920, 80, 28, { font: INTER, weight: 400, color: '#94A3B8', align: 'center' }),
        R(300, 680, 480, 80, '#FCD364', { r: 40 }),
        T('SAVE SURVIVAL KIT →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#0D1117', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. 6 ENTREPRENEUR DOCUMENTARIES (Amit Sharma)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_ENTREPRENEUR_DOCUMENTARIES: Template = build({
  key: 'pin-entrepreneur-documentaries',
  name: '6 Documentaries Every Founder Must Watch',
  description: 'Studio slate blue with giant condensed typography, Jiro Ono sushi master still, and founder lessons.',
  category: 'Motivation',
  tags: ['documentaries', 'founder', 'entrepreneur', 'watchlist', 'mindset', 'business'],
  style: 'Dark',
  audience: 'Founders',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/2PkRXQd10',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_7.jpg',
  slides: [
    {
      bg: '#5185A4',
      previewUrl: '/carousels/pinterest_refs/pin_7.jpg',
      els: [
        T('6', 70, 40, 220, 200, 190, { font: INTER, weight: 900, color: '#0D1117' }),
        T('Documentaries\nEvery Entrepreneur\nShould Watch', 70, 230, 940, 260, 74, { font: INTER, weight: 900, color: '#0D1117', lh: 1.05 }),
        T('— Editor’s Watchlist', 70, 500, 600, 45, 30, { font: INTER, weight: 700, color: '#0D1117' }),
        I('/carousels/pinterest_templates/jiro_sushi_photo.jpg', 0, 560, 1080, 790),
        T('THE FOUNDER REVIEW | amitsharma.builds', 70, 1300, 940, 40, 22, { font: INTER, weight: 700, color: '#D4E6F1' }),
      ]
    },
    {
      bg: '#0F172A',
      els: [
        T('01 / MASTERY', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#38BDF8', ls: 3 }),
        T('Jiro Dreams of Sushi (2011)', 80, 170, 920, 80, 52, { font: INTER, weight: 900, color: '#FFFFFF' }),
        T('An 85-year-old sushi master in a Tokyo subway station proves that extreme repetition, self-discipline, and obsession are the only true moat in business.', 80, 270, 920, 140, 28, { font: INTER, weight: 400, color: '#94A3B8', lh: 1.5 }),
        R(80, 450, 920, 340, '#1E293B', { r: 24 }),
        T('THE FOUNDER TAKEAWAY:', 120, 490, 840, 35, 20, { font: INTER, weight: 800, color: '#38BDF8', ls: 2 }),
        T('Never stop improving your craft. Even when the world considers you the greatest, you must wake up tomorrow believing you have not yet reached perfection.', 120, 545, 840, 140, 26, { font: INTER, weight: 500, color: '#F1F5F9', lh: 1.5 }),
      ]
    },
    {
      bg: '#0F172A',
      els: [
        T('02 / THE GREATEST FAILURE', 80, 120, 400, 30, 20, { font: INTER, weight: 800, color: '#F43F5E', ls: 3 }),
        T('General Magic (2018)', 80, 170, 920, 80, 52, { font: INTER, weight: 900, color: '#FFFFFF' }),
        T('The story of the Apple spinout that invented the smartphone, USB, touchscreen, and emojis in 1993 — and completely collapsed because technology wasn’t ready.', 80, 270, 920, 140, 28, { font: INTER, weight: 400, color: '#94A3B8', lh: 1.5 }),
        R(80, 450, 920, 340, '#1E293B', { r: 24 }),
        T('THE FOUNDER TAKEAWAY:', 120, 490, 840, 35, 20, { font: INTER, weight: 800, color: '#F43F5E', ls: 2 }),
        T('Timing is greater than genius. Being 15 years too early feels identical to being completely wrong. Know when the market infrastructure exists.', 120, 545, 840, 140, 26, { font: INTER, weight: 500, color: '#F1F5F9', lh: 1.5 }),
      ]
    },
    {
      bg: '#5185A4',
      els: [
        T('Save this watchlist for the weekend.', 80, 440, 920, 90, 56, { font: INTER, weight: 900, color: '#0D1117', align: 'center' }),
        T('Which documentary impacted your journey most?', 80, 550, 920, 70, 28, { font: INTER, weight: 600, color: '#1B384B', align: 'center' }),
        R(300, 680, 480, 80, '#0D1117', { r: 40 }),
        T('SHARE WITH A FOUNDER →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. ARE YOU BAD WITH MONEY? (ilovecreatives)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_BAD_WITH_MONEY: Template = build({
  key: 'pin-bad-with-money',
  name: 'Are You Bad with Money? (Psychology)',
  description: 'Butter yellow canvas with baby blue header bar, pixel character strip, and financial emotional literacy.',
  category: 'Finance',
  tags: ['money', 'finance', 'psychology', 'mindset', 'budgeting', 'literacy'],
  style: 'Playful',
  audience: 'General',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/3vO5hbJJA',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_8.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_butter_canvas.png',
      previewUrl: '/carousels/pinterest_refs/pin_8.jpg',
      els: [
        T('ilovecreatives', 40, 22, 300, 40, 28, { font: PLAYFAIR, weight: 800, color: '#1E3A8A' }),
        T('Finance Friends Forever ✹ Course™', 540, 24, 500, 40, 24, { font: INTER, weight: 600, color: '#1E3A8A', align: 'right' }),
        T('🕯️  🍊  🪙  📱  🗓️  🧮  🕯️  🍊', 80, 100, 920, 50, 36, { align: 'center' }),
        T('Are You\nBad with\nMoney?', 100, 230, 880, 400, 125, { font: PLAYFAIR, weight: 900, color: '#1F2421', lh: 1.05 }),
        T('Before you start budgeting or investing, you have to know what money means to you.', 100, 700, 880, 90, 28, { font: INTER, weight: 500, color: '#2B3830', lh: 1.4 }),
        R(100, 810, 880, 85, '#FFFFFF', { r: 45 }),
        T('Let’s check your emotional (and historical) relationship with it. →', 120, 835, 840, 45, 23, { font: INTER, weight: 800, color: '#1F2421', align: 'center' }),
        T('🕯️  🍊  🪙  📱  🗓️  🧮  🕯️  🍊', 80, 1180, 920, 50, 36, { align: 'center' }),
      ]
    },
    {
      bg: '#F3E488',
      els: [
        T('QUESTION 01', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#1E3A8A', ls: 3 }),
        T('What was the money talk at your childhood dinner table?', 80, 170, 920, 120, 48, { font: PLAYFAIR, weight: 800, color: '#1F2421', lh: 1.2 }),
        T('Was money treated as a secret? A source of screaming fights? A tool for status? Or something that never existed in enough quantity?', 80, 320, 920, 130, 28, { font: INTER, weight: 500, color: '#3A423C', lh: 1.5 }),
        R(80, 490, 920, 360, '#FFFFFF', { r: 24 }),
        T('THE PSYCHOLOGY:', 120, 530, 840, 35, 20, { font: INTER, weight: 800, color: '#1E3A8A', ls: 2 }),
        T('Most adults don’t have a math problem with money. They have an unresolved emotional script handed down from their parents before age 10.', 120, 580, 840, 140, 26, { font: INTER, weight: 500, color: '#1F2421', lh: 1.5 }),
      ]
    },
    {
      bg: '#1F2421',
      els: [
        T('Financial literacy begins with self-compassion.', 80, 440, 920, 100, 54, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', align: 'center' }),
        T('Stop shaming yourself for past financial choices. You made the best decision your nervous system could afford at the time.', 80, 560, 920, 120, 26, { font: INTER, weight: 400, color: '#CBD5E1', align: 'center', lh: 1.5 }),
        R(300, 720, 480, 80, '#F3E488', { r: 40 }),
        T('EXPLORE THE COURSE →', 320, 745, 440, 40, 22, { font: INTER, weight: 900, color: '#1F2421', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. HOW TO REBRAND (Naeema @naelovesart)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_REBRAND_CUTTING_MAT: Template = build({
  key: 'pin-rebrand-cutting-mat',
  name: 'How to Rebrand (Design School 2.0)',
  description: 'Emerald cutting mat with torn paper banner, yellow sticky note TO DO list, swatches, and rebranding rules.',
  category: 'Education',
  tags: ['rebrand', 'design school', 'branding', 'cutting mat', 'craft', 'identity'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/eWDoNcEW4',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_9.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_cutting_mat.png',
      previewUrl: '/carousels/pinterest_refs/pin_9.jpg',
      els: [
        R(120, 60, 280, 240, '#FFF9A6', { r: 8, rot: -5 }),
        T('TO DO:\n• Assignments\n• Update portfolio', 145, 95, 230, 160, 24, { font: INTER, weight: 600, color: '#3A3311', rot: -5, lh: 1.4 }),
        R(820, 110, 180, 190, '#E63946', { r: 8, rot: 8 }),
        T('📎', 710, 270, 70, 70, 50, { rot: 45 }),
        T('⭐', 90, 280, 60, 60, 44),
        R(40, 350, 1000, 450, '#FAF8F2', { r: 20 }),
        T('HOW TO\nREBRAND', 80, 410, 920, 200, 95, { font: INTER, weight: 900, color: '#0A0A0A', align: 'center', lh: 1.05 }),
        T('AND NOT MESS IT UP', 80, 620, 920, 45, 30, { font: INTER, weight: 700, color: '#0A0A0A', align: 'center', ls: 2 }),
        T('THE DESIGN SCHOOL SERIES', 80, 665, 920, 40, 24, { font: INTER, weight: 800, color: '#0A0A0A', align: 'center', ls: 3 }),
        T('2.0', 780, 600, 120, 70, 52, { font: INTER, italic: true, weight: 900, color: '#0A0A0A' }),
        T('👆', 720, 720, 60, 60, 44),
        T('@naelovesart', 80, 1240, 920, 40, 24, { font: INTER, italic: true, color: '#FFFFFF', align: 'center' }),
      ]
    },
    {
      bg: '#0B6E4F',
      els: [
        T('RULE 01', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#6CFD4C', ls: 3 }),
        T('Never Throw Away Built-In Recognition.', 80, 170, 920, 120, 52, { font: INTER, weight: 900, color: '#FFFFFF', lh: 1.2 }),
        T('Rebranding isn’t throwing everything in the trash just because the new design team was bored. It’s about distilling the original magic into a modern system.', 80, 320, 920, 120, 28, { font: INTER, weight: 400, color: '#D1FAE5', lh: 1.5 }),
        R(80, 480, 920, 340, '#064E3B', { r: 24 }),
        T('AUDIT FIRST:', 120, 520, 840, 35, 20, { font: INTER, weight: 800, color: '#6CFD4C', ls: 2 }),
        T('Ask 50 paying customers: "What is the single visual thing you think of when you hear our name?" Whatever 40+ people say, you NEVER delete.', 120, 570, 840, 140, 26, { font: INTER, weight: 500, color: '#FFFFFF', lh: 1.5 }),
      ]
    },
    {
      bg: '#FAF8F2',
      els: [
        T('Save this before your next client kickoff.', 80, 440, 920, 90, 52, { font: INTER, weight: 900, color: '#0A0A0A', align: 'center' }),
        T('Rebrand with strategy, not just pretty colors.', 80, 550, 920, 70, 28, { font: INTER, weight: 500, color: '#555555', align: 'center' }),
        R(300, 680, 480, 80, '#0B6E4F', { r: 40 }),
        T('SAVE THIS GUIDE →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. AGENCY CULTURE / TAKIYA KALAM (The Buzz Marketers)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_AGENCY_TAKIYA_KALAM: Template = build({
  key: 'pin-agency-takiya-kalam',
  name: 'Agency Culture & Team Dialogues',
  description: 'Team photo cutout with hand-drawn marker doodles, clouds, stars, and relatable agency takiya kalams.',
  category: 'Marketing',
  tags: ['agency', 'culture', 'hindi', 'team', 'humor', 'memes', 'social media'],
  style: 'Playful',
  audience: 'Agencies',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/6Z5OtA4Ab',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_10.jpg',
  slides: [
    {
      bg: '#FAF9F6',
      previewUrl: '/carousels/pinterest_refs/pin_10.jpg',
      els: [
        T('Our Team', 80, 120, 920, 80, 74, { font: PLAYFAIR, italic: true, weight: 700, color: '#111111', align: 'center' }),
        T('And their', 80, 205, 920, 60, 48, { font: INTER, weight: 900, color: '#0284C7', align: 'center' }),
        T('तकिया कलाम', 80, 260, 920, 90, 78, { font: INTER, weight: 900, color: '#0F172A', align: 'center' }),
        T('☀️', 840, 100, 80, 80, 60),
        T('☁️', 80, 160, 80, 80, 60),
        T('✨', 180, 280, 60, 60, 40),
        I('/carousels/pinterest_templates/img_agency_team.png', 0, 520, 1080, 830),
      ]
    },
    {
      bg: '#0F172A',
      els: [
        T('THE DESIGNER', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#38BDF8', ls: 3 }),
        T('"Ek baar brief dobara bhejna please..."', 80, 170, 920, 120, 48, { font: PLAYFAIR, italic: true, weight: 800, color: '#FFFFFF', lh: 1.2 }),
        T('Translation: I haven’t opened the Google Doc you sent 3 weeks ago, and now I have 2 hours to ship the entire campaign.', 80, 320, 920, 120, 28, { font: INTER, weight: 400, color: '#94A3B8', lh: 1.5 }),
      ]
    },
    {
      bg: '#0284C7',
      els: [
        T('Tag your work bestie!', 80, 440, 920, 90, 58, { font: PLAYFAIR, italic: true, weight: 800, color: '#FFFFFF', align: 'center' }),
        T('Drop your agency team’s takiya kalam in the comments 👇', 80, 550, 920, 80, 28, { font: INTER, weight: 500, color: '#E0F2FE', align: 'center' }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 11. 5-STEP BUSINESS BLUEPRINT (Printify)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_PRINTIFY_5STEP_BUSINESS: Template = build({
  key: 'pin-printify-5step-business',
  name: '5-Step Guide: Zero Ideas to Business',
  description: 'Dot-grid paper stack with neon green highlight box, heavy condensed typography, and validation steps.',
  category: 'Business',
  tags: ['business', 'start a business', 'guide', 'blueprint', 'ideas', 'entrepreneur'],
  style: 'Bold',
  audience: 'Founders',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/WzBV2eXWz',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_11.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_paper_stack.png',
      previewUrl: '/carousels/pinterest_refs/pin_11.jpg',
      els: [
        R(380, 220, 320, 65, '#FFFFFF', { r: 32, stroke: '#111111', sw: 2 }),
        T('TIPS & GUIDES', 400, 240, 280, 30, 22, { font: INTER, weight: 800, color: '#111111', align: 'center', ls: 2 }),
        R(240, 300, 600, 90, '#6CFD4C', { r: 12 }),
        T('5-STEP GUIDE', 260, 318, 560, 60, 56, { font: INTER, weight: 900, color: '#111111', align: 'center' }),
        T('FROM ZERO\nIDEAS TO\nYOUR OWN\nBUSINESS', 220, 420, 640, 380, 80, { font: INTER, weight: 900, color: '#1C2018', align: 'center', lh: 1.1 }),
        R(130, 180, 160, 85, '#99F6E4', { r: 40, rot: -15 }),
        T('$$$', 155, 200, 110, 45, 34, { font: INTER, weight: 900, color: '#111111', rot: -15, align: 'center' }),
        C(730, 480, 120, 120, '#6CFD4C'),
        T('$', 765, 505, 50, 70, 52, { font: INTER, weight: 900, color: '#111111' }),
      ]
    },
    {
      bg: '#F4F2EC',
      els: [
        T('STEP 01', 80, 120, 300, 30, 20, { font: INTER, weight: 900, color: '#111111', ls: 3 }),
        T('Audit Your Daily Frustrations', 80, 170, 920, 80, 54, { font: INTER, weight: 900, color: '#1C2018' }),
        T('Every single complaint you make during the day is an unsolved business waiting for a solution. Stop looking for galaxy-brain ideas.', 80, 270, 920, 120, 28, { font: INTER, weight: 400, color: '#4A5568', lh: 1.5 }),
        R(80, 430, 920, 300, '#FFFFFF', { r: 20, stroke: '#E2DDD2', sw: 1.5 }),
        T('THE 7-DAY ANNOYANCE LOG:', 120, 470, 840, 35, 20, { font: INTER, weight: 800, color: '#111111', ls: 2 }),
        T('Carry a notebook. Every time you say "Why does this take so long?", "Why is this software so clunky?", or "I hate doing this" — write it down.', 120, 520, 840, 120, 24, { font: INTER, weight: 500, color: '#334155', lh: 1.5 }),
      ]
    },
    {
      bg: '#1C2018',
      els: [
        T('Comment "START"', 80, 420, 920, 90, 72, { font: INTER, weight: 900, color: '#6CFD4C', align: 'center' }),
        T('We’ll DM you the Notion Idea Validation Checklist for free.', 80, 530, 920, 80, 28, { font: INTER, weight: 400, color: '#F4F2EC', align: 'center' }),
        R(300, 660, 480, 80, '#6CFD4C', { r: 40 }),
        T('GET THE BLUEPRINT →', 320, 685, 440, 40, 22, { font: INTER, weight: 900, color: '#111111', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 12. BOLLYWOOD POP-CULTURE STRATEGY (Squirrel Wiz)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_3IDIOTS_GROWTH_STRATEGY: Template = build({
  key: 'pin-3idiots-growth-strategy',
  name: 'Bollywood Pop-Culture Strategy',
  description: 'Dashed technical grid with 3 Idiots scooter cutout, kinetic orange typography, and growth funnel.',
  category: 'Marketing',
  tags: ['marketing', 'bollywood', 'memes', 'strategy', 'growth', 'humor'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/cy9ejOl9G',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_12.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_dashed_grid.png',
      previewUrl: '/carousels/pinterest_refs/pin_12.jpg',
      els: [
        C(400, 40, 60, 60, '#FF5A00'),
        T('sw', 405, 50, 50, 40, 24, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('squirrel wiz\nTECHNOLOGY', 475, 45, 300, 50, 20, { font: INTER, weight: 800, color: '#1E293B', lh: 1.1 }),
        T('Success k piche mat', 80, 160, 920, 80, 64, { font: INTER, weight: 900, color: '#1E293B', align: 'center' }),
        T('BHAGO', 80, 235, 920, 110, 105, { font: INTER, weight: 900, color: '#FF5A00', align: 'center', ls: 4 }),
        I('/carousels/pinterest_templates/img_3idiots_scooter.png', 0, 410, 1080, 940),
      ]
    },
    {
      bg: '#0F172A',
      els: [
        T('THE MISTAKE', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#FF5A00', ls: 3 }),
        T('Random Posting Se Kuch Nahi Hoga.', 80, 170, 920, 120, 52, { font: INTER, weight: 900, color: '#FFFFFF', lh: 1.2 }),
        T('Posting 5 reels a day without positioning is like accelerating with no steering wheel. You burn out while competitors with 1 strategic post capture the market.', 80, 320, 920, 120, 28, { font: INTER, weight: 400, color: '#94A3B8', lh: 1.5 }),
      ]
    },
    {
      bg: '#FF5A00',
      els: [
        T('Excellence ka peecha karo.', 80, 440, 920, 90, 64, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('Success jhak maarke peeche aayegi.\nBuild your brand strategy with Squirrel Wiz.', 80, 550, 920, 100, 30, { font: INTER, weight: 600, color: '#FFF2EB', align: 'center', lh: 1.4 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 13. BRAND DESIGNER ON-CALL (SUDZ.IN)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_BRAND_DESIGNER_ONCALL: Template = build({
  key: 'pin-brand-designer-oncall',
  name: 'Meet Your Brand Designer On-Call',
  description: 'Creative studio desk with notebook & laptop, flame sticker, ON-CALL pill badge, and subscription design service.',
  category: 'Personal Brand',
  tags: ['brand designer', 'on-call', 'agency', 'subscription', 'designer', 'freelance'],
  style: 'Playful',
  audience: 'Founders',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/3P9PC7eqi',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_13.jpg',
  slides: [
    {
      bg: '#F8F6F0',
      previewUrl: '/carousels/pinterest_refs/pin_13.jpg',
      els: [
        T('Meet your', 80, 90, 920, 60, 52, { font: PLAYFAIR, italic: true, weight: 700, color: '#422116', align: 'center' }),
        T('brand\ndesigner', 80, 150, 920, 220, 105, { font: INTER, weight: 900, color: '#422116', align: 'center', lh: 1.05 }),
        R(640, 320, 240, 75, '#D9381E', { r: 38, rot: -6 }),
        T('ON-CALL', 660, 338, 200, 40, 32, { font: INTER, weight: 900, color: '#FFFFFF', rot: -6, align: 'center' }),
        T('🔥', 120, 160, 80, 80, 60),
        I('/carousels/pinterest_templates/img_designer_sudz.png', 0, 430, 1080, 920),
      ]
    },
    {
      bg: '#422116',
      els: [
        T('WHY ON-CALL?', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#D9381E', ls: 3 }),
        T('No endless agency bureaucracy.', 80, 170, 920, 80, 54, { font: PLAYFAIR, weight: 800, color: '#FFFFFF' }),
        T('Direct Slack access to a senior designer who understands your visual identity inside and out. 48-hour turnarounds.', 80, 270, 920, 120, 28, { font: INTER, weight: 400, color: '#EAD7CE', lh: 1.5 }),
      ]
    },
    {
      bg: '#FAF8F4',
      els: [
        T('Ready for a design upgrade?', 80, 440, 920, 90, 54, { font: PLAYFAIR, weight: 800, color: '#422116', align: 'center' }),
        T('DM "DESIGN" to secure 1 of 3 monthly slots.', 80, 550, 920, 70, 28, { font: INTER, weight: 500, color: '#684538', align: 'center' }),
        R(300, 680, 480, 80, '#D9381E', { r: 40 }),
        T('START YOUR SPRINT →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 14. CREATOR PASSIVE INCOME CORKBOARD (@sumincreates)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_CORKBOARD_PASSIVE_INCOME: Template = build({
  key: 'pin-corkboard-passive-income',
  name: 'Passive Income for Creators (Corkboard)',
  description: 'Corkboard desk flatlay with die-cut cloud badges, ruler, dollar bills, binder clip, and passive revenue streams.',
  category: 'Finance',
  tags: ['passive income', 'creator', 'corkboard', 'digital products', 'monetization'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/5xPvh50wE',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_14.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_corkboard_desk.png',
      previewUrl: '/carousels/pinterest_refs/pin_14.jpg',
      els: [
        R(170, 320, 240, 60, '#1E88E5', { r: 30 }),
        T('@sumincreates', 190, 335, 200, 30, 22, { font: INTER, weight: 800, color: '#FFFFFF', align: 'center' }),
        R(200, 400, 680, 160, '#FDFBF7', { r: 40 }),
        T('Passive', 220, 430, 640, 110, 105, { font: INTER, weight: 900, color: '#3D2619', align: 'center' }),
        R(260, 560, 560, 150, '#FDFBF7', { r: 40 }),
        T('Income', 280, 580, 520, 110, 105, { font: INTER, weight: 900, color: '#3D2619', align: 'center' }),
        R(310, 715, 460, 65, '#FDFBF7', { r: 32 }),
        T('ideas for creators', 330, 730, 420, 35, 34, { font: INTER, weight: 800, color: '#3D2619', align: 'center' }),
        T('📎', 130, 530, 70, 70, 50, { rot: -30 }),
        T('📎', 850, 500, 70, 70, 50, { rot: 45 }),
      ]
    },
    {
      bg: '#3D2619',
      els: [
        T('01 / TEMPLATES', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#FDFBF7', ls: 3 }),
        T('Digital Templates (Figma, Notion, Canva)', 80, 170, 920, 80, 52, { font: INTER, weight: 900, color: '#FFFFFF' }),
        T('Spend 10 hours creating a high-converting carousel kit or business OS. Sell it for $29. When you wake up to 5 Gumroad notifications, you’ll never look at freelance hourly work the same way.', 80, 270, 920, 140, 28, { font: INTER, weight: 400, color: '#EAD7CE', lh: 1.5 }),
      ]
    },
    {
      bg: '#FDFBF7',
      els: [
        T('Save this for your weekend builder session 💸', 80, 440, 920, 100, 54, { font: INTER, weight: 900, color: '#3D2619', align: 'center' }),
        T('The best time to start passive income was 2 years ago. The second best time is today.', 80, 560, 920, 80, 28, { font: INTER, weight: 500, color: '#684538', align: 'center' }),
        R(300, 680, 480, 80, '#3D2619', { r: 40 }),
        T('BOOKMARK CAROUSEL →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 15. HIGH-FASHION MEME HOOK (Mystic Aura)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_MYSTIC_AURA_EDITORIAL: Template = build({
  key: 'pin-mystic-aura-editorial',
  name: 'High-Fashion Meme Hook (Aurat Ko Kya Chahiye)',
  description: 'White plaster stucco texture with Nawazuddin meme cutout, pink bow stickers, and high-fashion editorial serif typography.',
  category: 'Quotes',
  tags: ['fashion', 'meme hook', 'nawazuddin', 'editorial', 'ethnic', 'humor'],
  style: 'Editorial',
  audience: 'Influencers',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/5sGXTdOpU',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_15.jpg',
  slides: [
    {
      bg: '#FAF9F5',
      previewUrl: '/carousels/pinterest_refs/pin_15.jpg',
      els: [
        T('M  MYSTIC AURA', 640, 45, 360, 40, 24, { font: INTER, weight: 700, color: '#111111', align: 'right', ls: 3 }),
        I('/carousels/pinterest_templates/img_nawaz_bow.png', 700, 160, 340, 310),
        T('🎀', 70, 240, 60, 60, 44),
        T('Aakhir', 140, 220, 600, 120, 115, { font: PLAYFAIR, weight: 800, color: '#111111' }),
        T('chahiye kya', 140, 340, 750, 110, 100, { font: PLAYFAIR, weight: 800, color: '#111111' }),
        R(160, 470, 720, 170, '#E87077', { r: 12, rot: -2 }),
        T('aurat', 180, 480, 680, 150, 135, { font: PLAYFAIR, italic: true, weight: 800, color: '#FFFFFF', rot: -2, align: 'center' }),
        T('ko???', 140, 660, 500, 120, 115, { font: PLAYFAIR, weight: 800, color: '#111111' }),
        T('→', 860, 880, 80, 80, 64, { color: '#111111' }),
      ]
    },
    {
      bg: '#E87077',
      els: [
        T('THE HONEST ANSWER:', 80, 140, 920, 40, 24, { font: INTER, weight: 800, color: '#FAF9F5', ls: 3 }),
        T('Pockets in festive lehengas & clothes that actually let you breathe.', 80, 200, 920, 160, 54, { font: PLAYFAIR, weight: 800, color: '#FFFFFF', lh: 1.2 }),
        T('From graceful ethnic silhouettes to modern comfortable cuts — Mystic Aura understands every version of you.', 80, 400, 920, 120, 28, { font: INTER, weight: 400, color: '#FDF2F4', lh: 1.5 }),
      ]
    },
    {
      bg: '#FAF9F5',
      els: [
        T('Discover the Festive Collection ✨', 80, 450, 920, 80, 52, { font: PLAYFAIR, weight: 800, color: '#111111', align: 'center' }),
        T('Tap the link in bio to shop Mystic Aura.', 80, 560, 920, 60, 28, { font: INTER, weight: 500, color: '#E87077', align: 'center' }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 16. NOTION IS NOT CONFUSING (Juanjo Labs)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_NOTION_MENTAL_MODEL: Template = build({
  key: 'pin-notion-mental-model',
  name: 'Notion is Not Confusing (Mental Model)',
  description: 'Minimalist monochrome architecture layout with Lego builder character, grey container bar, and mental models.',
  category: 'Productivity',
  tags: ['notion', 'mental model', 'minimalist', 'productivity', 'systems', 'simplicity'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/LsYxgBsyt',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_16.jpg',
  slides: [
    {
      bg: '#FFFFFF',
      previewUrl: '/carousels/pinterest_refs/pin_16.jpg',
      els: [
        T('Juanjolabs', 100, 70, 300, 40, 36, { font: INTER, weight: 900, color: '#111111' }),
        T('Less, But Better', 100, 115, 300, 30, 20, { font: INTER, weight: 500, color: '#6B7280' }),
        T('Notion is not', 120, 280, 600, 90, 84, { font: INTER, weight: 900, color: '#111111' }),
        C(870, 330, 45, 45, '#1D4ED8'),
        R(80, 380, 920, 160, '#E5E7EB', { r: 8 }),
        T('Confusing', 110, 400, 860, 120, 120, { font: INTER, weight: 900, color: '#1F2937' }),
        C(80, 520, 45, 45, '#1D4ED8'),
        I('/carousels/pinterest_templates/img_lego_desk.png', 0, 620, 1080, 730),
      ]
    },
    {
      bg: '#FFFFFF',
      els: [
        T('MENTAL MODEL 01', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#1D4ED8', ls: 3 }),
        T('Pages Are Just Blank Sheets of Paper.', 80, 170, 920, 80, 52, { font: INTER, weight: 900, color: '#111111' }),
        T('You don’t need 40 databases and 200 formulas. Start with a plain page, type your thoughts, and nest another page when things get crowded. Keep it simple.', 80, 280, 920, 120, 28, { font: INTER, weight: 400, color: '#4B5563', lh: 1.5 }),
      ]
    },
    {
      bg: '#111111',
      els: [
        T('Simplicity scales. Complexity breaks.', 80, 440, 920, 90, 56, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center' }),
        T('Get the Minimalist Notion Workspace Template in bio.', 80, 550, 920, 70, 28, { font: INTER, weight: 400, color: '#9CA3AF', align: 'center' }),
        R(300, 680, 480, 80, '#1D4ED8', { r: 40 }),
        T('DOWNLOAD TEMPLATE →', 320, 705, 440, 40, 22, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// 17. WHEN YOUR SMM IS GEN Z (SUDZ.IN)
// ═════════════════════════════════════════════════════════════════════════════
export const TEMPLATE_GENZ_SOCIAL_MANAGER: Template = build({
  key: 'pin-genz-social-manager',
  name: 'When Your SMM Is Gen Z (Viral POV)',
  description: 'Crumpled paper texture with vintage CRT TV head character, electric purple typography, red stamp text, and viral POV rules.',
  category: 'Marketing',
  tags: ['gen z', 'social media', 'agency', 'viral', 'humor', 'pov', 'marketing'],
  style: 'Playful',
  audience: 'Marketers',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/6lNzkzJoq',
  trending: true,
  createdAt: '2026-10-22T05:00:00.000Z',
  thumbnailUrl: '/carousels/pinterest_refs/pin_17.jpg',
  slides: [
    {
      bg: '/carousels/pinterest_templates/bg_crumpled_paper.png',
      previewUrl: '/carousels/pinterest_refs/pin_17.jpg',
      els: [
        T('When your', 80, 60, 920, 70, 58, { font: PLAYFAIR, italic: true, weight: 700, color: '#E63946', align: 'center' }),
        T('Social', 80, 130, 920, 110, 105, { font: INTER, weight: 900, color: '#4D28DF', align: 'center' }),
        T('Media\nManager', 80, 225, 920, 220, 110, { font: INTER, weight: 900, color: '#1A1A1A', align: 'center', lh: 1.0 }),
        I('/carousels/pinterest_templates/img_genz_tv_character.png', 180, 420, 720, 840),
        T('🔖', 50, 1260, 50, 50, 32),
        T('Swipe >>', 820, 1265, 200, 40, 26, { font: INTER, weight: 700, color: '#1A1A1A', align: 'right' }),
      ]
    },
    {
      bg: '#1A1A1A',
      els: [
        T('POV #1', 80, 120, 300, 30, 20, { font: INTER, weight: 800, color: '#4D28DF', ls: 3 }),
        T('They deleted your 3-week corporate campaign for an unhinged meme.', 80, 170, 920, 130, 50, { font: INTER, weight: 900, color: '#FFFFFF', lh: 1.2 }),
        T('...and it got 2.4 million views, 14,000 saves, and brought 400 paying customers.', 80, 330, 920, 120, 28, { font: INTER, weight: 500, color: '#CBD5E1', lh: 1.5 }),
      ]
    },
    {
      bg: '#4D28DF',
      els: [
        T('Save this before your boss asks for another stock photo 💅', 80, 440, 920, 120, 56, { font: INTER, weight: 900, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('Marketing doesn’t have to be boring to be wildly profitable.', 80, 580, 920, 80, 30, { font: INTER, weight: 500, color: '#EDE9FE', align: 'center' }),
        R(300, 710, 480, 80, '#FFFFFF', { r: 40 }),
        T('SAVE THIS CAROUSEL →', 320, 735, 440, 40, 22, { font: INTER, weight: 900, color: '#4D28DF', align: 'center', ls: 2 }),
      ]
    }
  ]
});

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT ALL 17 PINTEREST TEMPLATES
// ═════════════════════════════════════════════════════════════════════════════
export const PINTEREST_TEMPLATES: Template[] = [
  TEMPLATE_RETRO_BRAND_SHOWCASE,
  TEMPLATE_LINKEDIN_AUTHORITY,
  TEMPLATE_MEET_THE_DESIGNER_ANN,
  TEMPLATE_BTS_WEB_DESIGN,
  TEMPLATE_DESIGNER_GIFT_GUIDE,
  TEMPLATE_DESIGNER_SURVIVAL_KIT,
  TEMPLATE_ENTREPRENEUR_DOCUMENTARIES,
  TEMPLATE_BAD_WITH_MONEY,
  TEMPLATE_REBRAND_CUTTING_MAT,
  TEMPLATE_AGENCY_TAKIYA_KALAM,
  TEMPLATE_PRINTIFY_5STEP_BUSINESS,
  TEMPLATE_3IDIOTS_GROWTH_STRATEGY,
  TEMPLATE_BRAND_DESIGNER_ONCALL,
  TEMPLATE_CORKBOARD_PASSIVE_INCOME,
  TEMPLATE_MYSTIC_AURA_EDITORIAL,
  TEMPLATE_NOTION_MENTAL_MODEL,
  TEMPLATE_GENZ_SOCIAL_MANAGER,
];
