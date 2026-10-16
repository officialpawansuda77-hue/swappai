/**
 * REFERENCE-STYLE TEMPLATE PACK 2
 * 27 high-converting, viral carousel templates recreated from top Instagram & Pinterest creators.
 * Every single text, shape, image, badge, and color is 100% editable on the canvas.
 */
import { Template } from '../types';
import {
  El, T, R, C, I, SlideDef, build
} from './referenceTemplates';

const ISERIF = 'Instrument Serif';
const FRAUNCES = 'Fraunces';
const BODONI = 'Bodoni Moda';
const OSWALD = 'Oswald';
const BRICOLAGE = 'Bricolage Grotesque';
const ARCHIVO = 'Archivo Black';
const SYNE = 'Syne';
const MONO = 'Space Mono';

// ═════════════════════════════════════════════════════════════════════════════
// 1. AGENCY OF ONE (Joel V Jose)
// ═════════════════════════════════════════════════════════════════════════════
const clientTeam = build({
  key: 'client-team',
  name: 'Agency of One',
  description: 'Editorial dark luxury with warm gold accents — the viral "When I say WE in client emails" founder truth.',
  category: 'Business',
  tags: ['agency', 'founder', 'freelancer', 'luxury', 'solopreneur', 'humor'],
  style: 'Luxury',
  audience: 'Founders',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeeB5mNS920/',
  trending: true,
  createdAt: '2026-10-16T10:00:01.000Z',
  slides: [
    {
      bg: '#0F0E0D',
      els: [
        I('/carousels/ref2/elevator.jpg', 0, 0, 1080, 1350),
        R(0, 0, 1080, 1350, 'linear-gradient(180deg, rgba(15,14,13,0.85) 0%, rgba(15,14,13,0.65) 50%, rgba(15,14,13,0.92) 100%)'),
        R(80, 140, 240, 48, '#C5A880', { r: 24 }),
        T('FOUNDER REALITY', 80, 152, 240, 30, 20, { font: OSWALD, weight: 700, color: '#0F0E0D', align: 'center', ls: 2 }),
        T('When I say "WE"', 80, 240, 920, 110, 88, { font: BODONI, weight: 700, color: '#F7F5F0', ls: -2, lh: 1.05 }),
        T('in client emails', 80, 350, 920, 110, 88, { font: ISERIF, italic: true, color: '#C5A880', lh: 1.05 }),
        T('The unfiltered reality of running a one-person studio that delivers like a 10-person agency.', 80, 490, 860, 90, 32, { color: '#BDB9B0', lh: 1.4 }),
        R(80, 620, 920, 460, 'rgba(255,255,255,0.06)', { r: 20, stroke: 'rgba(197,168,128,0.3)', sw: 1.5 }),
        T('THE ACTUAL HEADCOUNT:', 120, 660, 840, 40, 22, { font: OSWALD, weight: 600, color: '#C5A880', ls: 3 }),
        T('• Me (Founder & Lead Designer)\n• Me at 2 AM (Full-Stack Engineer)\n• Me after 3 coffees (Customer Support)\n• Me hyperventilating (Finance & Invoicing)', 120, 720, 840, 280, 32, { color: '#EBE7DE', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#8F8B82' }),
        T('swipe to see why it works →', 500, 1240, 500, 50, 26, { color: '#C5A880', align: 'right' }),
      ],
    },
    {
      bg: '#0F0E0D',
      els: [
        T('02 / 04', 80, 100, 300, 40, 22, { font: OSWALD, color: '#8F8B82', ls: 2 }),
        T('Why clients prefer "One Person"', 80, 180, 920, 140, 68, { font: BODONI, weight: 700, color: '#F7F5F0', lh: 1.1 }),
        R(80, 360, 920, 240, '#191816', { r: 16, stroke: '#2A2825', sw: 1 }),
        T('ZERO COMMUNICATION LAG', 120, 400, 840, 36, 22, { font: OSWALD, color: '#C5A880', ls: 2 }),
        T('The person talking on Zoom is the exact same person pushing the code. No middle management game of telephone.', 120, 450, 840, 110, 30, { color: '#C7C3B8', lh: 1.4 }),
        R(80, 640, 920, 240, '#191816', { r: 16, stroke: '#2A2825', sw: 1 }),
        T('EXTREME OWNERSHIP', 120, 680, 840, 36, 22, { font: OSWALD, color: '#C5A880', ls: 2 }),
        T('When things break, there is nobody else to blame. That urgency produces better craftsmanship than 10 junior staffers.', 120, 730, 840, 110, 30, { color: '#C7C3B8', lh: 1.4 }),
        T('Clients don\'t buy headcount. They buy results.', 80, 940, 920, 80, 38, { font: ISERIF, italic: true, color: '#F7F5F0', align: 'center' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#8F8B82' }),
      ],
    },
    {
      bg: '#0F0E0D',
      els: [
        T('03 / 04', 80, 100, 300, 40, 22, { font: OSWALD, color: '#8F8B82', ls: 2 }),
        T('The Solo Agency Tech Stack', 80, 180, 920, 80, 62, { font: BODONI, weight: 700, color: '#F7F5F0' }),
        T('How one person ships like an entire creative department:', 80, 280, 920, 50, 30, { color: '#A39F95' }),
        R(80, 360, 440, 220, '#191816', { r: 16 }),
        T('Figma', 110, 400, 380, 40, 32, { weight: 700, color: '#F7F5F0' }),
        T('Design system & client interactive prototypes.', 110, 450, 380, 100, 24, { color: '#9E9A90', lh: 1.35 }),
        R(560, 360, 440, 220, '#191816', { r: 16 }),
        T('Claude 3.7', 590, 400, 380, 40, 32, { weight: 700, color: '#C5A880' }),
        T('Full-stack coding, copy polish & research.', 590, 450, 380, 100, 24, { color: '#9E9A90', lh: 1.35 }),
        R(80, 610, 440, 220, '#191816', { r: 16 }),
        T('SwapAI', 110, 650, 380, 40, 32, { weight: 700, color: '#F7F5F0' }),
        T('High-converting carousels & social content.', 110, 700, 380, 100, 24, { color: '#9E9A90', lh: 1.35 }),
        R(560, 610, 440, 220, '#191816', { r: 16 }),
        T('Stripe', 590, 650, 380, 40, 32, { weight: 700, color: '#F7F5F0' }),
        T('Instant global invoicing & automatic payouts.', 590, 700, 380, 100, 24, { color: '#9E9A90', lh: 1.35 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#8F8B82' }),
      ],
    },
    {
      bg: '#0F0E0D',
      els: [
        R(80, 260, 920, 640, 'rgba(197,168,128,0.08)', { r: 24, stroke: '#C5A880', sw: 2 }),
        T('THE QUESTION', 120, 330, 840, 40, 24, { font: OSWALD, color: '#C5A880', align: 'center', ls: 4 }),
        T('Are you a "WE" or an "I"\nin your proposals?', 120, 400, 840, 180, 68, { font: BODONI, weight: 700, color: '#F7F5F0', align: 'center', lh: 1.15 }),
        T('Be honest in the comments. There is zero shame in being a one-person powerhouse in 2026.', 160, 620, 760, 110, 32, { color: '#C7C3B8', align: 'center', lh: 1.45 }),
        R(280, 760, 520, 84, '#C5A880', { r: 42 }),
        T('Drop your stack below 👇', 280, 784, 520, 40, 28, { font: OSWALD, weight: 700, color: '#0F0E0D', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#8F8B82', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. 30-MINUTE AI APP (Avani Hiranandani)
// ═════════════════════════════════════════════════════════════════════════════
const buildAiApp = build({
  key: 'build-ai-app',
  name: '30-Minute AI App',
  description: 'Bright high-energy coding educator format with 3D character, neon blue code cards and step roadmap.',
  category: 'Education',
  tags: ['ai app', 'coding', 'tutorial', 'developer', 'react', '3d'],
  style: 'Educational',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/Deg_5DXjZ6u/',
  trending: true,
  createdAt: '2026-10-16T10:00:02.000Z',
  slides: [
    {
      bg: '#F8FAFC',
      els: [
        I('/carousels/ref2/cartoon-boy.jpg', 0, 560, 1080, 790, { fit: 'cover' }),
        R(80, 120, 260, 48, '#2563EB', { r: 24 }),
        T('CODE TUTORIAL', 80, 132, 260, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('BUILD AN AI APP', 80, 200, 920, 90, 80, { font: ARCHIVO, color: '#0F172A', ls: -2 }),
        T('IN 30 MINUTES', 80, 290, 920, 90, 80, { font: ARCHIVO, color: '#2563EB', ls: -2 }),
        T('Zero backend setup. 100% free hosting. Ready for your portfolio.', 80, 400, 860, 80, 32, { weight: 500, color: '#475569', lh: 1.35 }),
        R(80, 490, 320, 54, '#0F172A', { r: 27 }),
        T('swipe to copy the code →', 80, 505, 320, 30, 20, { weight: 600, color: '#FFFFFF', align: 'center' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#0F172A', weight: 600 }),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        R(80, 100, 160, 40, '#2563EB', { r: 8 }),
        T('STEP 01', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('Initialize Next.js + Tailwind', 80, 170, 920, 80, 56, { weight: 800, color: '#FFFFFF' }),
        T('Run this single command in your terminal:', 80, 260, 920, 40, 28, { color: '#94A3B8' }),
        R(80, 330, 920, 220, '#020617', { r: 16, stroke: '#1E293B', sw: 2 }),
        T('terminal', 120, 355, 300, 30, 18, { font: MONO, color: '#64748B' }),
        T('npx create-next-app@latest my-ai-app\ncd my-ai-app\nnpm i @google/genai lucide-react', 120, 410, 840, 120, 28, { font: MONO, color: '#38BDF8', lh: 1.5 }),
        R(80, 600, 920, 280, '#1E293B', { r: 16 }),
        T('⚡ WHY THIS STACK?', 120, 640, 840, 40, 24, { font: OSWALD, color: '#FACC15', ls: 2 }),
        T('Next.js App Router gives you serverless API routes out of the box — meaning your API keys are never exposed to the client browser.', 120, 700, 840, 140, 30, { color: '#E2E8F0', lh: 1.45 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#64748B' }),
        T('02 / 05', 850, 1240, 150, 50, 26, { color: '#64748B', align: 'right' }),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        R(80, 100, 160, 40, '#2563EB', { r: 8 }),
        T('STEP 02', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('Connect the Gemini SDK', 80, 170, 920, 80, 56, { weight: 800, color: '#FFFFFF' }),
        T('Create app/api/chat/route.ts in 12 lines:', 80, 260, 920, 40, 28, { color: '#94A3B8' }),
        R(80, 330, 920, 480, '#020617', { r: 16, stroke: '#1E293B', sw: 2 }),
        T('app/api/chat/route.ts', 120, 355, 400, 30, 18, { font: MONO, color: '#64748B' }),
        T('import { GoogleGenAI } from "@google/genai";\n\nexport async function POST(req: Request) {\n  const { prompt } = await req.json();\n  const ai = new GoogleGenAI();\n  const res = await ai.models.generateContent({\n    model: "gemini-2.5-flash",\n    contents: prompt\n  });\n  return Response.json({ text: res.text });\n}', 120, 410, 840, 360, 26, { font: MONO, color: '#A7F3D0', lh: 1.45 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#64748B' }),
        T('03 / 05', 850, 1240, 150, 50, 26, { color: '#64748B', align: 'right' }),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        R(80, 100, 160, 40, '#2563EB', { r: 8 }),
        T('STEP 03', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('Deploy Live to Vercel', 80, 170, 920, 80, 56, { weight: 800, color: '#FFFFFF' }),
        T('From localhost to production in 60 seconds:', 80, 260, 920, 40, 28, { color: '#94A3B8' }),
        R(80, 340, 920, 180, '#1E293B', { r: 16 }),
        T('1. Push code to GitHub repository', 120, 380, 840, 40, 30, { weight: 600, color: '#FFFFFF' }),
        T('2. Import project into Vercel dashboard', 120, 440, 840, 40, 30, { weight: 600, color: '#FFFFFF' }),
        R(80, 560, 920, 240, '#020617', { r: 16, stroke: '#3B82F6', sw: 2 }),
        T('🔒 ENV VARIABLE REQUIRED', 120, 600, 840, 40, 22, { font: OSWALD, color: '#38BDF8', ls: 2 }),
        T('GEMINI_API_KEY = your_free_api_key', 120, 660, 840, 50, 32, { font: MONO, color: '#FACC15' }),
        T('Get it free from Google AI Studio in 30 seconds.', 120, 720, 840, 40, 26, { color: '#94A3B8' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#64748B' }),
        T('04 / 05', 850, 1240, 150, 50, 26, { color: '#64748B', align: 'right' }),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        R(80, 240, 920, 680, '#0F172A', { r: 24 }),
        T('GET THE STARTER CODE', 120, 320, 840, 40, 24, { font: OSWALD, color: '#38BDF8', align: 'center', ls: 3 }),
        T('Want the full GitHub\nstarter template?', 120, 390, 840, 160, 64, { weight: 800, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "BUILD" below and I will send you the repository link + complete live demo setup.', 160, 580, 760, 110, 32, { color: '#94A3B8', align: 'center', lh: 1.4 }),
        R(260, 740, 560, 84, '#2563EB', { r: 42 }),
        T('Comment "BUILD" 👇', 260, 764, 560, 40, 32, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#64748B', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. FIVE WORKFLOWS (Jack Roberts)
// ═════════════════════════════════════════════════════════════════════════════
const fiveWorkflows = build({
  key: 'five-workflows',
  name: 'Five Workflow System',
  description: 'Ultra-clean Swiss monochrome minimal with numbered badge cards and high-retention structured frameworks.',
  category: 'Productivity',
  tags: ['workflows', 'systems', 'productivity', 'minimal', 'framework', 'automation'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DejtNUyFkCX/',
  trending: true,
  createdAt: '2026-10-16T10:00:03.000Z',
  slides: [
    {
      bg: '#0A0A0A',
      els: [
        R(80, 120, 220, 44, '#262626', { r: 22 }),
        T('SYSTEMS V1.4', 80, 131, 220, 26, 18, { font: OSWALD, weight: 700, color: '#A3A3A3', align: 'center', ls: 2 }),
        T('5 WORKFLOWS', 80, 210, 920, 110, 92, { font: ARCHIVO, color: '#FFFFFF', ls: -3 }),
        T('THAT SAVE 20 HRS', 80, 315, 920, 90, 76, { font: ARCHIVO, color: '#525252', ls: -2 }),
        T('EVERY SINGLE WEEK', 80, 405, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('Stop reinventing your week on Monday morning. Use these 5 operational systems instead.', 80, 530, 880, 100, 34, { color: '#A3A3A3', lh: 1.4 }),
        R(80, 680, 920, 360, '#171717', { r: 20, stroke: '#262626', sw: 1.5 }),
        T('THE HIGHEST-ROI SYSTEMS:', 120, 720, 840, 40, 22, { font: OSWALD, color: '#737373', ls: 3 }),
        T('01 / Automated competitor outlier detection\n02 / 1-Prompt carousel drafting pipeline\n03 / Async client Loom feedback loop\n04 / Automated invoice reconciliation', 120, 780, 840, 220, 30, { color: '#E5E5E5', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#525252' }),
        T('breakdown inside →', 500, 1240, 500, 50, 26, { color: '#FFFFFF', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 100, 120, 40, '#FFFFFF', { r: 8 }),
        T('01', 80, 106, 120, 30, 24, { font: ARCHIVO, color: '#0A0A0A', align: 'center' }),
        T('The Outlier Radar', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Never start brainstorming from a blank sheet:', 80, 260, 920, 40, 28, { color: '#737373' }),
        R(80, 340, 920, 240, '#171717', { r: 16 }),
        T('HOW IT WORKS', 120, 380, 840, 36, 20, { font: OSWALD, color: '#A3A3A3', ls: 2 }),
        T('Scrape the top 10 creators in your niche once a week. Filter only posts with 5x their average engagement. Study the HOOK, not the topic.', 120, 430, 840, 120, 30, { color: '#E5E5E5', lh: 1.45 }),
        R(80, 620, 920, 180, '#171717', { r: 16 }),
        T('HOURS SAVED', 120, 655, 840, 36, 20, { font: OSWALD, color: '#22C55E', ls: 2 }),
        T('6 hours / week of doom-scrolling eliminated.', 120, 700, 840, 50, 32, { weight: 700, color: '#FFFFFF' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#525252' }),
        T('02 / 05', 850, 1240, 150, 50, 26, { color: '#525252', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 100, 120, 40, '#FFFFFF', { r: 8 }),
        T('02', 80, 106, 120, 30, 24, { font: ARCHIVO, color: '#0A0A0A', align: 'center' }),
        T('The Batch Sprint', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Context-switching is the silent productivity killer:', 80, 260, 920, 40, 28, { color: '#737373' }),
        R(80, 340, 920, 240, '#171717', { r: 16 }),
        T('THE SCHEDULE', 120, 380, 840, 36, 20, { font: OSWALD, color: '#A3A3A3', ls: 2 }),
        T('Never create content on the day you post. Dedicate Tuesday morning 9 AM - 12 PM exclusively to writing all 5 carousels for the week.', 120, 430, 840, 120, 30, { color: '#E5E5E5', lh: 1.45 }),
        R(80, 620, 920, 180, '#171717', { r: 16 }),
        T('HOURS SAVED', 120, 655, 840, 36, 20, { font: OSWALD, color: '#22C55E', ls: 2 }),
        T('5 hours of daily mental friction removed.', 120, 700, 840, 50, 32, { weight: 700, color: '#FFFFFF' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#525252' }),
        T('03 / 05', 850, 1240, 150, 50, 26, { color: '#525252', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 100, 120, 40, '#FFFFFF', { r: 8 }),
        T('03', 80, 106, 120, 30, 24, { font: ARCHIVO, color: '#0A0A0A', align: 'center' }),
        T('Async Feedback Loop', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Replace 45-minute status calls with 2-minute Looms:', 80, 260, 920, 40, 28, { color: '#737373' }),
        R(80, 340, 920, 240, '#171717', { r: 16 }),
        T('THE RULE', 120, 380, 840, 36, 20, { font: OSWALD, color: '#A3A3A3', ls: 2 }),
        T('If an update does not require a debate or a live contract signing, it belongs in a Loom video with a shared Figma canvas link.', 120, 430, 840, 120, 30, { color: '#E5E5E5', lh: 1.45 }),
        R(80, 620, 920, 180, '#171717', { r: 16 }),
        T('HOURS SAVED', 120, 655, 840, 36, 20, { font: OSWALD, color: '#22C55E', ls: 2 }),
        T('9 hours of useless client meetings avoided.', 120, 700, 840, 50, 32, { weight: 700, color: '#FFFFFF' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#525252' }),
        T('04 / 05', 850, 1240, 150, 50, 26, { color: '#525252', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 240, 920, 640, '#171717', { r: 24, stroke: '#262626', sw: 2 }),
        T('COMPLETE SYSTEM PDF', 120, 320, 840, 40, 22, { font: OSWALD, color: '#A3A3A3', align: 'center', ls: 3 }),
        T('Want the full 5-workflow\noperating manual?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Includes the exact Notion templates, Loom scripts and Claude prompt recipes.', 160, 580, 760, 90, 30, { color: '#A3A3A3', align: 'center', lh: 1.4 }),
        R(240, 730, 600, 84, '#FFFFFF', { r: 42 }),
        T('Comment "WORKFLOWS" 👇', 240, 754, 600, 40, 28, { font: OSWALD, weight: 700, color: '#0A0A0A', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#525252', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. FOUR MONEY WEBSITES (@powerfulwebs)
// ═════════════════════════════════════════════════════════════════════════════
const fourMoneySites = build({
  key: 'four-money-sites',
  name: 'Online Income Sites',
  description: 'Dark cyber theme with neon emerald accents, earning potential tags, and curated tool cards.',
  category: 'Finance',
  tags: ['income', 'money', 'websites', 'side hustle', 'tools', 'online business'],
  style: 'Modern',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DdwjS9KkkbH/',
  trending: true,
  createdAt: '2026-10-16T10:00:04.000Z',
  slides: [
    {
      bg: '#050811',
      els: [
        R(80, 120, 280, 48, 'rgba(16,185,129,0.15)', { r: 24, stroke: '#10B981', sw: 1.5 }),
        T('SIDE HUSTLES 2026', 80, 132, 280, 30, 20, { font: OSWALD, weight: 700, color: '#10B981', align: 'center', ls: 2 }),
        T('4 WEBSITES THAT CAN', 80, 210, 920, 90, 72, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('MAKE YOU $100/DAY', 80, 300, 920, 90, 72, { font: ARCHIVO, color: '#10B981', ls: -2 }),
        T('(NOBODY TALKS ABOUT)', 80, 390, 920, 90, 64, { font: ARCHIVO, color: '#64748B', ls: -2 }),
        T('Bookmark this before it gets saturated. Real platforms with immediate payout potential.', 80, 510, 880, 80, 32, { color: '#94A3B8', lh: 1.4 }),
        R(80, 620, 920, 420, '#0F172A', { r: 20, stroke: '#1E293B', sw: 1.5 }),
        T('THE LINEUP:', 120, 660, 840, 36, 20, { font: OSWALD, color: '#10B981', ls: 3 }),
        T('01 / Whop.com (Digital memberships & courses)\n02 / SwapAI.com (Sell viral carousel templates)\n03 / Contra.com (Commission-free freelancing)\n04 / Printify (Zero-inventory merch print)', 120, 715, 840, 280, 30, { color: '#F1F5F9', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#475569' }),
        T('swipe to explore each →', 500, 1240, 500, 50, 26, { color: '#10B981', align: 'right' }),
      ],
    },
    {
      bg: '#050811',
      els: [
        R(80, 100, 200, 40, '#10B981', { r: 8 }),
        T('SITE #01', 80, 108, 200, 30, 20, { font: OSWALD, weight: 700, color: '#050811', align: 'center', ls: 2 }),
        T('Whop.com', 80, 170, 920, 80, 68, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Monetize digital access & downloads with 3% fees:', 80, 260, 920, 40, 28, { color: '#64748B' }),
        R(80, 330, 920, 280, '#0F172A', { r: 16 }),
        T('EARNING POTENTIAL', 120, 370, 840, 36, 20, { font: OSWALD, color: '#10B981', ls: 2 }),
        T('$500 – $5,000 / month', 120, 410, 840, 50, 36, { weight: 800, color: '#FFFFFF' }),
        T('Sell notion templates, software tools, Discord communities, or private newsletters without setting up custom payment gateways.', 120, 480, 840, 100, 28, { color: '#94A3B8', lh: 1.4 }),
        R(80, 650, 920, 180, '#0F172A', { r: 16 }),
        T('BEST FOR', 120, 685, 840, 36, 20, { font: OSWALD, color: '#38BDF8', ls: 2 }),
        T('Creators with an existing audience or niche knowledge.', 120, 730, 840, 50, 30, { color: '#F1F5F9' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#475569' }),
      ],
    },
    {
      bg: '#050811',
      els: [
        R(80, 100, 200, 40, '#10B981', { r: 8 }),
        T('SITE #02', 80, 108, 200, 30, 20, { font: OSWALD, weight: 700, color: '#050811', align: 'center', ls: 2 }),
        T('Contra.com', 80, 170, 920, 80, 68, { font: ARCHIVO, color: '#FFFFFF' }),
        T('The modern freelance marketplace that takes 0% cut:', 80, 260, 920, 40, 28, { color: '#64748B' }),
        R(80, 330, 920, 280, '#0F172A', { r: 16 }),
        T('EARNING POTENTIAL', 120, 370, 840, 36, 20, { font: OSWALD, color: '#10B981', ls: 2 }),
        T('$75 – $150 / hour', 120, 410, 840, 50, 36, { weight: 800, color: '#FFFFFF' }),
        T('Unlike Upwork or Fiverr which steal 20% of your earnings, Contra allows you to bill clients directly with zero commission.', 120, 480, 840, 100, 28, { color: '#94A3B8', lh: 1.4 }),
        R(80, 650, 920, 180, '#0F172A', { r: 16 }),
        T('BEST FOR', 120, 685, 840, 36, 20, { font: OSWALD, color: '#38BDF8', ls: 2 }),
        T('Designers, copywriters, and full-stack developers.', 120, 730, 840, 50, 30, { color: '#F1F5F9' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#475569' }),
      ],
    },
    {
      bg: '#050811',
      els: [
        R(80, 260, 920, 600, '#0F172A', { r: 24, stroke: '#10B981', sw: 2 }),
        T('SAVE FOR LATER', 120, 340, 840, 40, 22, { font: OSWALD, color: '#10B981', align: 'center', ls: 3 }),
        T('Which site will you try\nthis weekend?', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Hit the save button so you don\'t lose this list when you\'re ready to launch.', 160, 600, 760, 90, 30, { color: '#94A3B8', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#10B981', { r: 42 }),
        T('Save This Post 🔖', 280, 754, 520, 40, 30, { font: OSWALD, weight: 700, color: '#050811', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#475569', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. CURATED APPS (Pascio)
// ═════════════════════════════════════════════════════════════════════════════
const curatedApps = build({
  key: 'curated-apps',
  name: 'Curated App Deck',
  description: 'Clean cream aesthetic with dark minimal cards, 5-star rating pills, and macOS-style app roundups.',
  category: 'Productivity',
  tags: ['apps', 'tools', 'curated', 'ratings', 'mac', 'minimal'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeU0wGfloys/',
  trending: true,
  createdAt: '2026-10-16T10:00:05.000Z',
  slides: [
    {
      bg: '#F5F4EE',
      els: [
        R(80, 120, 220, 44, '#E5E3D8', { r: 22 }),
        T('CURATED STACK', 80, 131, 220, 26, 18, { font: OSWALD, weight: 700, color: '#42413C', align: 'center', ls: 2 }),
        T('Apps so good they', 80, 210, 920, 90, 76, { font: FRAUNCES, weight: 700, color: '#1C1B18', lh: 1.05 }),
        T('feel illegal to use', 80, 300, 920, 90, 76, { font: ISERIF, italic: true, color: '#827865', lh: 1.05 }),
        T('for 100% free.', 80, 390, 920, 90, 76, { font: FRAUNCES, weight: 700, color: '#1C1B18', lh: 1.05 }),
        T('Tested 70+ new software tools this month. Only 4 made the daily workflow cut.', 80, 510, 860, 90, 32, { color: '#5C584E', lh: 1.4 }),
        R(80, 640, 920, 400, '#FFFFFF', { r: 24, stroke: '#E5E3D8', sw: 1.5 }),
        T('THE 4 SELECTIONS:', 120, 680, 840, 36, 20, { font: OSWALD, color: '#827865', ls: 3 }),
        T('★ Raycast — Spotlight on steroids\n★ Obsidian — Second brain for deep work\n★ Cursor — AI-powered code IDE\n★ Cron — Calendar reimagined for founders', 120, 740, 840, 260, 32, { color: '#1C1B18', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#827865' }),
        T('swipe to view details →', 500, 1240, 500, 50, 26, { color: '#1C1B18', align: 'right' }),
      ],
    },
    {
      bg: '#F5F4EE',
      els: [
        R(80, 100, 140, 40, '#1C1B18', { r: 20 }),
        T('APP 01', 80, 108, 140, 30, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Raycast', 80, 170, 920, 80, 68, { font: FRAUNCES, weight: 700, color: '#1C1B18' }),
        T('Replaces Alfred and default macOS Spotlight permanently.', 80, 260, 920, 40, 28, { color: '#5C584E' }),
        R(80, 330, 920, 420, '#FFFFFF', { r: 24, stroke: '#E5E3D8', sw: 1.5 }),
        T('WHY IT IS SPECIAL', 120, 370, 840, 36, 20, { font: OSWALD, color: '#827865', ls: 2 }),
        T('Clipboard history, window management, snippet expansion, AI chat, and 1,000+ community extensions in one single keystroke (⌥ + Space).', 120, 420, 840, 150, 30, { color: '#2B2925', lh: 1.5 }),
        R(120, 600, 280, 44, '#F5F4EE', { r: 22 }),
        T('★★★★★  5.0 / 5.0', 120, 608, 280, 30, 20, { color: '#1C1B18', align: 'center', weight: 700 }),
        R(420, 600, 180, 44, '#F5F4EE', { r: 22 }),
        T('100% Free', 420, 608, 180, 30, 20, { color: '#1C1B18', align: 'center', weight: 600 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#827865' }),
        T('02 / 05', 850, 1240, 150, 50, 26, { color: '#827865', align: 'right' }),
      ],
    },
    {
      bg: '#F5F4EE',
      els: [
        R(80, 100, 140, 40, '#1C1B18', { r: 20 }),
        T('APP 02', 80, 108, 140, 30, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Obsidian', 80, 170, 920, 80, 68, { font: FRAUNCES, weight: 700, color: '#1C1B18' }),
        T('A second brain for knowledge workers that you own forever.', 80, 260, 920, 40, 28, { color: '#5C584E' }),
        R(80, 330, 920, 420, '#FFFFFF', { r: 24, stroke: '#E5E3D8', sw: 1.5 }),
        T('WHY IT IS SPECIAL', 120, 370, 840, 36, 20, { font: OSWALD, color: '#827865', ls: 2 }),
        T('Unlike Notion, your notes are stored as plain markdown files directly on your computer. Zero cloud lock-in, infinite graph view links, and blazing speed.', 120, 420, 840, 150, 30, { color: '#2B2925', lh: 1.5 }),
        R(120, 600, 280, 44, '#F5F4EE', { r: 22 }),
        T('★★★★★  4.9 / 5.0', 120, 608, 280, 30, 20, { color: '#1C1B18', align: 'center', weight: 700 }),
        R(420, 600, 180, 44, '#F5F4EE', { r: 22 }),
        T('100% Free', 420, 608, 180, 30, 20, { color: '#1C1B18', align: 'center', weight: 600 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#827865' }),
        T('03 / 05', 850, 1240, 150, 50, 26, { color: '#827865', align: 'right' }),
      ],
    },
    {
      bg: '#F5F4EE',
      els: [
        R(80, 240, 920, 640, '#FFFFFF', { r: 24, stroke: '#E5E3D8', sw: 2 }),
        T('WHICH ONE IS YOURS?', 120, 320, 840, 40, 22, { font: OSWALD, color: '#827865', align: 'center', ls: 3 }),
        T('What is your #1\nmust-have Mac app?', 120, 390, 840, 160, 64, { font: FRAUNCES, weight: 700, color: '#1C1B18', align: 'center', lh: 1.15 }),
        T('Drop your favourite hidden gem in the comments below. I\'ll test the best ones for Part 2.', 160, 580, 760, 90, 30, { color: '#5C584E', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#1C1B18', { r: 42 }),
        T('Share Your App 👇', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#827865', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. CONTENT LADDER (Jack Roberts)
// ═════════════════════════════════════════════════════════════════════════════
const skillLadder = build({
  key: 'skill-ladder',
  name: 'Content Creation Ladder',
  description: 'Architectural vertical progression staircase, dark graphite background with Lv 1 to Lv 7 tiers.',
  category: 'Personal Brand',
  tags: ['ladder', 'growth', 'levels', 'progression', 'content creator', 'stages'],
  style: 'Typography',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeW07Xnlqfs/',
  trending: true,
  createdAt: '2026-10-16T10:00:06.000Z',
  slides: [
    {
      bg: '#111113',
      els: [
        R(80, 120, 240, 44, '#242429', { r: 22 }),
        T('THE PROGRESSION', 80, 131, 240, 26, 18, { font: OSWALD, weight: 700, color: '#9E9EA8', align: 'center', ls: 2 }),
        T('THE 7 LEVELS OF', 80, 210, 920, 90, 80, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('CONTENT CREATION', 80, 300, 920, 90, 80, { font: ARCHIVO, color: '#E05A47', ls: -2 }),
        T('95% of creators stay trapped at Level 3 forever. Where are you standing right now?', 80, 420, 860, 90, 32, { color: '#9E9EA8', lh: 1.4 }),
        R(80, 550, 920, 520, '#1A1A1E', { r: 20 }),
        T('LEVEL 07 / Category King (Media Monopoly)', 120, 600, 840, 40, 28, { font: OSWALD, color: '#E05A47', ls: 1 }),
        T('LEVEL 06 / Media Engine (Delegated Team)', 120, 665, 840, 40, 28, { font: OSWALD, color: '#F39C12', ls: 1 }),
        T('LEVEL 05 / Niche Authority (High Conversion)', 120, 730, 840, 40, 28, { font: OSWALD, color: '#27AE60', ls: 1 }),
        T('LEVEL 04 / Consistent Publisher (Daily Routine)', 120, 795, 840, 40, 28, { font: OSWALD, color: '#3498DB', ls: 1 }),
        T('LEVEL 03 / The Trap: Random Inconsistent Posts', 120, 860, 840, 40, 28, { font: OSWALD, color: '#E74C3C', ls: 1 }),
        T('LEVEL 02 / The Lurker: Bookmarking Everything', 120, 925, 840, 40, 28, { font: OSWALD, color: '#7F8C8D', ls: 1 }),
        T('LEVEL 01 / Zero Audience: Fear of Judgement', 120, 990, 840, 40, 28, { font: OSWALD, color: '#555555', ls: 1 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#555555' }),
        T('how to level up inside →', 500, 1240, 500, 50, 26, { color: '#E05A47', align: 'right' }),
      ],
    },
    {
      bg: '#111113',
      els: [
        R(80, 100, 180, 40, '#E05A47', { r: 8 }),
        T('THE BREAKOUT', 80, 108, 180, 30, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('Escaping Level 3', 80, 170, 920, 80, 68, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Why most people never make money from their audience:', 80, 260, 920, 40, 28, { color: '#7F8C8D' }),
        R(80, 330, 920, 320, '#1A1A1E', { r: 16 }),
        T('THE FATAL MISTAKE', 120, 370, 840, 36, 20, { font: OSWALD, color: '#E74C3C', ls: 2 }),
        T('Posting when "inspired". Inspiration is unreliable. Professional creators build a schedule and post through the dip regardless of emotion.', 120, 420, 840, 150, 30, { color: '#DCDCE6', lh: 1.5 }),
        R(80, 690, 920, 240, '#1A1A1E', { r: 16 }),
        T('THE FIX', 120, 725, 840, 36, 20, { font: OSWALD, color: '#27AE60', ls: 2 }),
        T('Commit to 3 carousels per week for 90 days. Measure consistency, not vanity follower count.', 120, 770, 840, 120, 30, { color: '#DCDCE6', lh: 1.45 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#555555' }),
      ],
    },
    {
      bg: '#111113',
      els: [
        R(80, 240, 920, 640, '#1A1A1E', { r: 24, stroke: '#E05A47', sw: 2 }),
        T('WHERE ARE YOU?', 120, 320, 840, 40, 22, { font: OSWALD, color: '#E05A47', align: 'center', ls: 3 }),
        T('What level are you at\nright now?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "LADDER" and I will DM you the complete roadmap to jump from your current tier to Level 5.', 160, 580, 760, 100, 30, { color: '#9E9EA8', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#E05A47', { r: 42 }),
        T('Comment "LADDER" 👇', 260, 754, 560, 40, 30, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#555555', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. ANTI-AI SLOP SKILLS (Rakesh Mahanti)
// ═════════════════════════════════════════════════════════════════════════════
const antiSlopSkills = build({
  key: 'anti-slop-skills',
  name: 'Anti-AI Slop Skills',
  description: 'High-voltage dark brutalist deck with electric yellow accents, warning badges, and high-impact human craftsmanship.',
  category: 'AI',
  tags: ['anti-ai', 'slop', 'skills', 'brutalist', 'yellow', 'future of work'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeHgoP8kxyV/',
  trending: true,
  createdAt: '2026-10-16T10:00:07.000Z',
  slides: [
    {
      bg: '#0A0A0C',
      els: [
        R(80, 120, 260, 48, '#FACC15', { r: 8 }),
        T('HUMAN CRAFT', 80, 132, 260, 30, 22, { font: ARCHIVO, color: '#0A0A0C', align: 'center' }),
        T('6 ANTI-AI SLOP', 80, 210, 920, 100, 88, { font: ARCHIVO, color: '#FACC15', ls: -3 }),
        T('SKILLS YOU MUST', 80, 310, 920, 100, 88, { font: ARCHIVO, color: '#FFFFFF', ls: -3 }),
        T('MASTER IN 2026', 80, 410, 920, 100, 88, { font: ARCHIVO, color: '#4B5563', ls: -3 }),
        T('AI can generate mediocre content in 5 seconds. Here is how you become irreplaceable.', 80, 540, 860, 80, 32, { color: '#D1D5DB', lh: 1.4 }),
        R(80, 660, 920, 400, '#111827', { r: 16, stroke: '#FACC15', sw: 2 }),
        T('THE MOAT:', 120, 700, 840, 36, 20, { font: OSWALD, color: '#FACC15', ls: 3 }),
        T('01 / Real un-hallucinated case studies\n02 / High visual taste & typography standards\n03 / Stance-taking with contrarian opinions\n04 / Direct personal relationships with clients', 120, 755, 840, 260, 30, { color: '#F9FAFB', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#6B7280' }),
        T('swipe to explore each →', 500, 1240, 500, 50, 26, { color: '#FACC15', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0C',
      els: [
        R(80, 100, 140, 40, '#FACC15', { r: 6 }),
        T('01', 80, 106, 140, 30, 24, { font: ARCHIVO, color: '#0A0A0C', align: 'center' }),
        T('Taste Over Speed', 80, 170, 920, 80, 68, { font: ARCHIVO, color: '#FFFFFF' }),
        T('Speed without taste produces digital garbage at scale:', 80, 260, 920, 40, 28, { color: '#9CA3AF' }),
        R(80, 330, 920, 360, '#111827', { r: 16 }),
        T('THE REALITY', 120, 370, 840, 36, 20, { font: OSWALD, color: '#FACC15', ls: 2 }),
        T('Anyone can prompt an LLM to write 10 bullet points. Almost nobody knows how to edit those 10 points down to 3 profound sentences that change the reader\'s perspective.', 120, 420, 840, 180, 30, { color: '#E5E7EB', lh: 1.5 }),
        R(80, 730, 920, 200, '#111827', { r: 16 }),
        T('TACTICAL RULE', 120, 765, 840, 36, 20, { font: OSWALD, color: '#FACC15', ls: 2 }),
        T('Spend 10% of time prompting, 90% of time ruthlessly cutting.', 120, 810, 840, 80, 32, { font: ARCHIVO, color: '#FFFFFF' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#6B7280' }),
      ],
    },
    {
      bg: '#0A0A0C',
      els: [
        R(80, 260, 920, 600, '#111827', { r: 24, stroke: '#FACC15', sw: 3 }),
        T('BECOME IRREPLACEABLE', 120, 340, 840, 40, 24, { font: OSWALD, color: '#FACC15', align: 'center', ls: 3 }),
        T('Taste is the only\nmoat left in 2026.', 120, 410, 840, 160, 68, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Save this carousel as a reminder whenever you are tempted to publish lazy AI output.', 160, 600, 760, 90, 30, { color: '#9CA3AF', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#FACC15', { r: 42 }),
        T('Save This Guide 🔖', 280, 754, 520, 40, 30, { font: ARCHIVO, color: '#0A0A0C', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#6B7280', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. DEVELOPER RESOURCES (Junaid)
// ═════════════════════════════════════════════════════════════════════════════
const devResources = build({
  key: 'dev-resources',
  name: 'Developer Cheat Sheet',
  description: 'Deep slate dark terminal theme with neon blue code tags, status badges, and curated dev tools.',
  category: 'SaaS',
  tags: ['developer', 'code', 'resources', 'tools', 'terminal', 'programming'],
  style: 'Modern',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeWDCnqCOtP/',
  trending: true,
  createdAt: '2026-10-16T10:00:08.000Z',
  slides: [
    {
      bg: '#0D1117',
      els: [
        R(80, 120, 220, 44, 'rgba(56,189,248,0.15)', { r: 22, stroke: '#38BDF8', sw: 1 }),
        T('● LIVE DEV REPO', 80, 131, 220, 26, 18, { font: MONO, color: '#38BDF8', align: 'center' }),
        T('4 SITES EVERY', 80, 210, 920, 90, 78, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('DEVELOPER MUST', 80, 300, 920, 90, 78, { font: ARCHIVO, color: '#58A6FF', ls: -2 }),
        T('KEEP BOOKMARKED', 80, 390, 920, 90, 78, { font: ARCHIVO, color: '#8B949E', ls: -2 }),
        T('Stop wasting 20 minutes on Google every time you forget syntax.', 80, 510, 860, 80, 32, { color: '#C9D1D9', lh: 1.4 }),
        R(80, 620, 920, 420, '#161B22', { r: 20, stroke: '#30363D', sw: 1.5 }),
        T('INDEX:', 120, 660, 840, 36, 20, { font: MONO, color: '#58A6FF' }),
        T('1. devdocs.io — Fast offline API documentation for 100+ stacks\n2. ray.so — Create gorgeous code screenshots\n3. bundlephobia.com — Find the cost of npm packages\n4. transform.tools — Instant JSON to TypeScript converter', 120, 715, 840, 280, 28, { font: MONO, color: '#F0F6FC', lh: 1.6 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#8B949E' }),
        T('explore breakdown →', 500, 1240, 500, 50, 26, { font: MONO, color: '#58A6FF', align: 'right' }),
      ],
    },
    {
      bg: '#0D1117',
      els: [
        R(80, 100, 180, 40, '#238636', { r: 8 }),
        T('TOOL 01', 80, 108, 180, 30, 18, { font: MONO, weight: 700, color: '#FFFFFF', align: 'center' }),
        T('DevDocs.io', 80, 170, 920, 80, 68, { font: ARCHIVO, color: '#FFFFFF' }),
        T('All API documentation combined in one single clean interface:', 80, 260, 920, 40, 28, { color: '#8B949E' }),
        R(80, 330, 920, 320, '#161B22', { r: 16 }),
        T('WHY DEVELOPERS LOVE IT', 120, 370, 840, 36, 20, { font: MONO, color: '#58A6FF' }),
        T('Instant fuzzy-search across React, Python, Docker, Go, CSS, Tailwind and 150+ frameworks. Works completely offline with zero tracking or clutter.', 120, 420, 840, 180, 30, { color: '#C9D1D9', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#8B949E' }),
      ],
    },
    {
      bg: '#0D1117',
      els: [
        R(80, 260, 920, 600, '#161B22', { r: 24, stroke: '#58A6FF', sw: 2 }),
        T('TERMINAL COMMAND', 120, 340, 840, 40, 22, { font: MONO, color: '#58A6FF', align: 'center' }),
        T('npm run bookmark\n--save-for-later', 120, 410, 840, 160, 64, { font: MONO, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('Save this carousel so you never have to re-search these tools when building your next app.', 160, 600, 760, 90, 30, { color: '#8B949E', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#238636', { r: 42 }),
        T('git commit -m "saved" 🔖', 280, 754, 520, 40, 28, { font: MONO, weight: 700, color: '#FFFFFF', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { font: MONO, color: '#8B949E', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. CLAUDE CONTENT ENGINE (Usama Akram)
// ═════════════════════════════════════════════════════════════════════════════
const claudeContentEngine = build({
  key: 'claude-content-engine',
  name: 'Claude Content Engine',
  description: 'Surreal vintage TV head editorial scene with warm parchment background, terracotta accents and prompt blueprints.',
  category: 'AI',
  tags: ['claude', 'content engine', 'automation', 'prompts', 'retro', 'tv head'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/Dee1nGoCCUX/',
  trending: true,
  createdAt: '2026-10-16T10:00:09.000Z',
  slides: [
    {
      bg: '#F4EFEA',
      els: [
        I('/carousels/ref2/tv-head.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 260, 48, '#C2593F', { r: 24 }),
        T('PROMPT BLUEPRINT', 80, 132, 260, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('HOW TO AUTOMATE', 80, 200, 920, 90, 76, { font: ARCHIVO, color: '#1E1E24', ls: -2 }),
        T('CONTENT CREATION', 80, 290, 920, 90, 76, { font: ARCHIVO, color: '#C2593F', ls: -2 }),
        T('WITH CLAUDE 3.7', 80, 380, 920, 80, 68, { font: ARCHIVO, color: '#1E1E24', ls: -2 }),
        T('From 1 core insight into 10 high-retention carousels in under 15 minutes.', 80, 480, 860, 70, 30, { color: '#5A564C', lh: 1.35 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#1E1E24', weight: 600 }),
      ],
    },
    {
      bg: '#F4EFEA',
      els: [
        R(80, 100, 160, 40, '#C2593F', { r: 8 }),
        T('STEP 01', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('The Voice Calibration', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#1E1E24' }),
        T('Paste this persona prompt before asking for ideas:', 80, 260, 920, 40, 28, { color: '#5A564C' }),
        R(80, 330, 920, 420, '#FFFFFF', { r: 16, stroke: '#E2DBD2', sw: 2 }),
        T('PROMPT', 120, 360, 300, 30, 18, { font: MONO, color: '#C2593F' }),
        T('"You are an elite editorial art director and copywriter for Instagram carousels. Write in punchy, un-hyped sentences. Eliminate corporate jargon. Use active voice and tension in every hook."', 120, 410, 840, 280, 30, { font: FRAUNCES, color: '#1E1E24', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#888275' }),
      ],
    },
    {
      bg: '#F4EFEA',
      els: [
        R(80, 240, 920, 640, '#FFFFFF', { r: 24, stroke: '#C2593F', sw: 2 }),
        T('COMPLETE PROMPT PACK', 120, 320, 840, 40, 24, { font: OSWALD, color: '#C2593F', align: 'center', ls: 3 }),
        T('Want the full Claude\ncarousel prompt stack?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#1E1E24', align: 'center', lh: 1.15 }),
        T('Comment "CLAUDE" below and I will send you the 5 exact prompt templates I use daily.', 160, 580, 760, 100, 30, { color: '#5A564C', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#C2593F', { r: 42 }),
        T('Comment "CLAUDE" 👇', 260, 754, 560, 40, 32, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#888275', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. MACBOOK SHORTCUTS (The Digital Core)
// ═════════════════════════════════════════════════════════════════════════════
const macbookShortcuts = build({
  key: 'macbook-shortcuts',
  name: 'MacBook Superpowers',
  description: 'Minimal Apple aesthetic featuring product photo, keyboard shortcut badges, and clean productivity hacks.',
  category: 'Productivity',
  tags: ['macbook', 'apple', 'shortcuts', 'macos', 'productivity', 'minimal'],
  style: 'Minimal',
  audience: 'General',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeYfK_oAMHF/',
  trending: true,
  createdAt: '2026-10-16T10:00:10.000Z',
  slides: [
    {
      bg: '#EAE8E3',
      els: [
        I('/carousels/ref2/macbook.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 220, 44, '#1D1D1F', { r: 22 }),
        T(' macOS HACKS', 80, 131, 220, 26, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Make more of your', 80, 210, 920, 90, 76, { font: BODONI, weight: 700, color: '#1D1D1F' }),
        T('MacBook in 2026.', 80, 300, 920, 90, 76, { font: ISERIF, italic: true, color: '#1D1D1F' }),
        T('5 keyboard shortcuts that feel like literal superpowers once you learn them.', 80, 420, 860, 90, 32, { color: '#515154', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#1D1D1F', weight: 600 }),
      ],
    },
    {
      bg: '#EAE8E3',
      els: [
        R(80, 100, 140, 40, '#1D1D1F', { r: 20 }),
        T('SHORTCUT 01', 80, 108, 140, 30, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Screenshot Direct to Clipboard', 80, 170, 920, 80, 56, { weight: 800, color: '#1D1D1F' }),
        R(80, 290, 920, 140, '#FFFFFF', { r: 20 }),
        T('⌘  +  ⌃  +  ⇧  +  4', 80, 335, 920, 60, 44, { font: MONO, color: '#1D1D1F', align: 'center' }),
        R(80, 480, 920, 260, '#FFFFFF', { r: 20 }),
        T('WHY YOU NEED THIS', 120, 520, 840, 36, 20, { font: OSWALD, color: '#86868B', ls: 2 }),
        T('Never clutter your desktop with 100 screenshot files again. Copies the crop directly to your clipboard so you can paste into Figma, Slack or Claude instantly.', 120, 570, 840, 140, 30, { color: '#1D1D1F', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#86868B' }),
      ],
    },
    {
      bg: '#EAE8E3',
      els: [
        R(80, 260, 920, 600, '#FFFFFF', { r: 24 }),
        T('SHARE WITH A MAC USER', 120, 340, 840, 40, 22, { font: OSWALD, color: '#86868B', align: 'center', ls: 3 }),
        T('Which shortcut was\nnew to you?', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#1D1D1F', align: 'center', lh: 1.15 }),
        T('Save this post to your bookmarks so you remember the key combinations.', 160, 600, 760, 90, 30, { color: '#515154', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#1D1D1F', { r: 42 }),
        T('Save Shortcuts 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#86868B', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 11. BRANDING DUEL (Nemi)
// ═════════════════════════════════════════════════════════════════════════════
const brandDuel = build({
  key: 'brand-duel',
  name: 'Brand Identity Duel',
  description: 'Playful pastel battle deck with comparison cards, VS badges, and interactive voting prompts.',
  category: 'Marketing',
  tags: ['branding', 'design', 'game', 'vs', 'playful', 'identity'],
  style: 'Playful',
  audience: 'Agencies',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeHtFBWDorZ/',
  trending: true,
  createdAt: '2026-10-16T10:00:11.000Z',
  slides: [
    {
      bg: '#FFF5F0',
      els: [
        R(80, 120, 260, 48, '#FF5A36', { r: 24 }),
        T('DESIGN GAME', 80, 132, 260, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('LET\'S PLAY: ROCK,', 80, 210, 920, 90, 72, { font: ARCHIVO, color: '#2B1B17', ls: -2 }),
        T('PAPER, SCISSORS', 80, 300, 920, 90, 72, { font: ARCHIVO, color: '#FF5A36', ls: -2 }),
        T('BRANDING EDITION', 80, 390, 920, 90, 68, { font: ARCHIVO, color: '#2B1B17', ls: -2 }),
        T('Swipe through 3 iconic brand battles. Vote your winner in the comments on each slide.', 80, 520, 860, 90, 32, { color: '#6E5650', lh: 1.4 }),
        R(80, 660, 920, 380, '#FFFFFF', { r: 24, stroke: '#FFD9CF', sw: 2 }),
        T('ROUND 1: Minimalist Wordmark vs Mascot Character\nROUND 2: Quiet Luxury Serif vs Loud Neo-Brutalist\nROUND 3: Monochrome Clean vs Wild Color Gradient', 120, 720, 840, 260, 30, { color: '#2B1B17', lh: 1.8 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#A08078' }),
        T('let the games begin →', 500, 1240, 500, 50, 26, { color: '#FF5A36', align: 'right', weight: 700 }),
      ],
    },
    {
      bg: '#FFF5F0',
      els: [
        R(80, 100, 160, 40, '#FF5A36', { r: 8 }),
        T('ROUND 01', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('Minimal Wordmark VS Mascot', 80, 170, 920, 80, 56, { font: ARCHIVO, color: '#2B1B17' }),
        R(80, 280, 440, 480, '#FFFFFF', { r: 20, stroke: '#FFD9CF', sw: 2 }),
        T('OPTION A', 110, 320, 380, 36, 20, { font: OSWALD, color: '#FF5A36', ls: 2 }),
        T('Minimal Wordmark', 110, 365, 380, 80, 36, { font: ARCHIVO, color: '#2B1B17', lh: 1.1 }),
        T('• High credibility\n• Easy to scale\n• Timeless across apps\n• Risk of being boring', 110, 470, 380, 240, 26, { color: '#6E5650', lh: 1.6 }),
        R(560, 280, 440, 480, '#FFFFFF', { r: 20, stroke: '#FFD9CF', sw: 2 }),
        T('OPTION B', 590, 320, 380, 36, 20, { font: OSWALD, color: '#3B82F6', ls: 2 }),
        T('Character Mascot', 590, 365, 380, 80, 36, { font: ARCHIVO, color: '#2B1B17', lh: 1.1 }),
        T('• Instant emotional hook\n• Unforgettable avatar\n• Viral meme potential\n• Harder to pivot later', 590, 470, 380, 240, 26, { color: '#6E5650', lh: 1.6 }),
        T('Which side wins? A or B? 👇', 80, 840, 920, 60, 36, { font: ARCHIVO, color: '#2B1B17', align: 'center' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#A08078' }),
      ],
    },
    {
      bg: '#FFF5F0',
      els: [
        R(80, 240, 920, 640, '#FFFFFF', { r: 24, stroke: '#FF5A36', sw: 2 }),
        T('THE FINAL VERDICT', 120, 320, 840, 40, 22, { font: OSWALD, color: '#FF5A36', align: 'center', ls: 3 }),
        T('Which branding style\nfits your product?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#2B1B17', align: 'center', lh: 1.15 }),
        T('Drop your brand in the comments and I will tell you which identity style you should adopt.', 160, 580, 760, 90, 30, { color: '#6E5650', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#FF5A36', { r: 42 }),
        T('Drop Your Brand 👇', 280, 754, 520, 40, 30, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#A08078', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 12. CLAUDE SETUP (Subash Chandra)
// ═════════════════════════════════════════════════════════════════════════════
const claudeSetup = build({
  key: 'claude-setup',
  name: 'Complete Claude Setup',
  description: 'Deep obsidian canvas with glowing Claude orange borders, project memory instructions, and AI developer workflows.',
  category: 'AI',
  tags: ['claude', 'setup', 'developer', 'ai system', 'prompts', 'coding'],
  style: 'Educational',
  audience: 'Founders',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeO1I4kGZ9w/',
  trending: true,
  createdAt: '2026-10-16T10:00:12.000Z',
  slides: [
    {
      bg: '#0F172A',
      els: [
        R(80, 120, 240, 44, 'rgba(249,115,22,0.15)', { r: 22, stroke: '#F97316', sw: 1 }),
        T('CLAUDE 3.7 SYSTEM', 80, 131, 240, 26, 18, { font: MONO, color: '#F97316', align: 'center' }),
        T('MY COMPLETE', 80, 210, 920, 90, 84, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('CLAUDE SETUP', 80, 300, 920, 90, 84, { font: ARCHIVO, color: '#F97316', ls: -2 }),
        T('TO SHIP SOFTWARE', 80, 390, 920, 90, 84, { font: ARCHIVO, color: '#64748B', ls: -2 }),
        T('How I configure Claude Projects to write bug-free code without hallucinating dependencies.', 80, 520, 860, 90, 32, { color: '#94A3B8', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#64748B' }),
        T('configuration details →', 500, 1240, 500, 50, 26, { font: MONO, color: '#F97316', align: 'right' }),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        R(80, 100, 160, 40, '#F97316', { r: 8 }),
        T('RULE 01', 80, 108, 160, 30, 20, { font: MONO, weight: 700, color: '#0F172A', align: 'center' }),
        T('Custom Instructions', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 360, '#020617', { r: 16, stroke: '#1E293B', sw: 2 }),
        T('SYSTEM INSTRUCTION TO PASTE', 120, 320, 840, 30, 18, { font: MONO, color: '#F97316' }),
        T('"You are an experienced senior engineer. Never use deprecated packages. When editing files, output precise replacement chunks. Always preserve existing comments. Do not explain obvious syntax."', 120, 370, 840, 240, 28, { font: MONO, color: '#F8FAFC', lh: 1.6 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#64748B' }),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        R(80, 240, 920, 640, '#020617', { r: 24, stroke: '#F97316', sw: 2 }),
        T('DOWNLOAD THE CONFIG', 120, 320, 840, 40, 22, { font: MONO, color: '#F97316', align: 'center' }),
        T('Want the exact system\nprompts and memory files?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "SETUP" and I will DM you my entire Claude Project starter kit with documentation templates.', 160, 580, 760, 90, 30, { color: '#94A3B8', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#F97316', { r: 42 }),
        T('Comment "SETUP" 👇', 260, 754, 560, 40, 30, { font: MONO, weight: 700, color: '#0F172A', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { font: MONO, color: '#64748B', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 13. IDENTITY SHIFT (Satywan Salunkhe)
// ═════════════════════════════════════════════════════════════════════════════
const identityShift = build({
  key: 'identity-shift',
  name: 'Identity Shift',
  description: 'High-fashion black and white editorial portrait with elegant serif typography and profound habit philosophy.',
  category: 'Motivation',
  tags: ['identity', 'habits', 'editorial', 'portrait', 'minimal', 'mindset'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeS6EcVgJvZ/',
  trending: true,
  createdAt: '2026-10-16T10:00:13.000Z',
  slides: [
    {
      bg: '#FFFFFF',
      els: [
        I('/carousels/ref2/identity-woman.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        T('Changing your identity', 80, 140, 920, 80, 68, { font: BODONI, weight: 700, color: '#111111' }),
        T('starts with what you do', 80, 220, 920, 80, 68, { font: ISERIF, italic: true, color: '#111111' }),
        T('before 8:00 AM.', 80, 300, 920, 80, 68, { font: BODONI, weight: 700, color: '#111111' }),
        T('You do not rise to the level of your goals. You fall to the level of your systems.', 80, 410, 860, 80, 32, { color: '#666666', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#111111', weight: 600 }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        T('01 / 03', 80, 100, 300, 40, 22, { font: OSWALD, color: '#999999', ls: 2 }),
        T('Cast Votes Every Day', 80, 170, 920, 80, 64, { font: BODONI, weight: 700, color: '#111111' }),
        T('Every action you take is a vote for the type of person you wish to become. No single vote will transform you overnight, but as votes build up, evidence of your new identity becomes undeniable.', 80, 290, 920, 320, 36, { font: ISERIF, italic: true, color: '#222222', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#999999' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        R(80, 260, 920, 600, '#F5F5F3', { r: 24 }),
        T('SELF-REFLECTION', 120, 340, 840, 40, 22, { font: OSWALD, color: '#888888', align: 'center', ls: 3 }),
        T('Who are you casting\na vote for today?', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#111111', align: 'center', lh: 1.15 }),
        T('Save this reminder to keep your standards high tomorrow morning.', 160, 600, 760, 90, 30, { color: '#666666', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#111111', { r: 42 }),
        T('Save Reminder 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#999999', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 14. FOUNDER MANUAL (Zeel Nikhil Jain)
// ═════════════════════════════════════════════════════════════════════════════
const founderManual = build({
  key: 'founder-manual',
  name: 'Founder Brutal Truths',
  description: 'Warm candid photo of founder at desk, raw honest startup truths, sticky note typography and red annotations.',
  category: 'Business',
  tags: ['founder', 'startup', 'honest', 'business', 'candid', 'lessons'],
  style: 'Personal Brand',
  audience: 'Founders',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeQ6reyk_h7/',
  trending: true,
  createdAt: '2026-10-16T10:00:14.000Z',
  slides: [
    {
      bg: '#F9F8F5',
      els: [
        I('/carousels/ref2/founder-woman.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 260, 48, '#E11D48', { r: 24 }),
        T('FOUNDER TRUTH', 80, 132, 260, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Nobody hands you', 80, 210, 920, 80, 68, { font: ARCHIVO, color: '#18181B' }),
        T('a manual when you', 80, 290, 920, 80, 68, { font: ISERIF, italic: true, color: '#E11D48' }),
        T('become a founder.', 80, 370, 920, 80, 68, { font: ARCHIVO, color: '#18181B' }),
        T('5 brutal lessons you have to learn with your own money and tears.', 80, 480, 860, 70, 30, { color: '#52525B', lh: 1.35 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#18181B', weight: 600 }),
      ],
    },
    {
      bg: '#F9F8F5',
      els: [
        R(80, 100, 140, 40, '#18181B', { r: 8 }),
        T('TRUTH 01', 80, 108, 140, 30, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Sales Cures Everything', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#18181B' }),
        R(80, 280, 920, 380, '#FFFFFF', { r: 20, stroke: '#E4E4E7', sw: 1.5 }),
        T('WHAT THEY DON\'T TEACH YOU', 120, 320, 840, 36, 20, { font: OSWALD, color: '#E11D48', ls: 2 }),
        T('You can have the cleanest Figma mockups and the most beautiful branding, but if nobody swipes their credit card, you have a very expensive hobby, not a business.', 120, 370, 840, 200, 32, { color: '#27272A', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#71717A' }),
      ],
    },
    {
      bg: '#F9F8F5',
      els: [
        R(80, 240, 920, 640, '#FFFFFF', { r: 24, stroke: '#E4E4E7', sw: 2 }),
        T('BUILDING IN PUBLIC', 120, 320, 840, 40, 22, { font: OSWALD, color: '#E11D48', align: 'center', ls: 3 }),
        T('What was your hardest\nlesson this year?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#18181B', align: 'center', lh: 1.15 }),
        T('Drop your biggest founder takeaway below. Let\'s learn from each other.', 160, 580, 760, 90, 30, { color: '#71717A', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#18181B', { r: 42 }),
        T('Share Your Lesson 👇', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#71717A', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 15. FIRST AI AUTOMATION (Usama Akram)
// ═════════════════════════════════════════════════════════════════════════════
const firstAiAutomation = build({
  key: 'first-ai-automation',
  name: 'First AI Automation',
  description: 'Technical visual blueprint with trigger and action nodes, showing how to automate workflows without writing code.',
  category: 'AI',
  tags: ['automation', 'n8n', 'make', 'blueprint', 'nocode', 'workflow'],
  style: 'Data',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeCYIMziBxY/',
  trending: true,
  createdAt: '2026-10-16T10:00:15.000Z',
  slides: [
    {
      bg: '#0B0F19',
      els: [
        R(80, 120, 240, 44, 'rgba(6,182,212,0.15)', { r: 22, stroke: '#06B6D4', sw: 1 }),
        T('NO-CODE BLUEPRINT', 80, 131, 240, 26, 18, { font: MONO, color: '#06B6D4', align: 'center' }),
        T('HOW TO CREATE', 80, 210, 920, 90, 84, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('YOUR 1ST AI', 80, 300, 920, 90, 84, { font: ARCHIVO, color: '#06B6D4', ls: -2 }),
        T('AUTOMATION', 80, 390, 920, 90, 84, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('Step-by-step setup using Make or n8n to eliminate 15 hours of manual data entry.', 80, 520, 860, 90, 32, { color: '#94A3B8', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#64748B' }),
        T('see the architecture →', 500, 1240, 500, 50, 26, { font: MONO, color: '#06B6D4', align: 'right' }),
      ],
    },
    {
      bg: '#0B0F19',
      els: [
        T('THE ARCHITECTURE', 80, 100, 920, 40, 22, { font: MONO, color: '#06B6D4' }),
        T('3-Node Workflow', 80, 150, 920, 80, 60, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 270, 920, 180, '#111827', { r: 16, stroke: '#06B6D4', sw: 2 }),
        T('NODE 01: THE TRIGGER', 120, 305, 840, 30, 18, { font: MONO, color: '#06B6D4' }),
        T('New form submission or Instagram comment received', 120, 350, 840, 60, 28, { color: '#FFFFFF', weight: 600 }),
        R(80, 490, 920, 180, '#111827', { r: 16, stroke: '#3B82F6', sw: 2 }),
        T('NODE 02: THE AI PARSER', 120, 525, 840, 30, 18, { font: MONO, color: '#3B82F6' }),
        T('Claude classifies intent and generates personalized reply', 120, 570, 840, 60, 28, { color: '#FFFFFF', weight: 600 }),
        R(80, 710, 920, 180, '#111827', { r: 16, stroke: '#10B981', sw: 2 }),
        T('NODE 03: THE ACTION', 120, 745, 840, 30, 18, { font: MONO, color: '#10B981' }),
        T('Send automated DM + update Notion lead database', 120, 790, 840, 60, 28, { color: '#FFFFFF', weight: 600 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#64748B' }),
      ],
    },
    {
      bg: '#0B0F19',
      els: [
        R(80, 240, 920, 640, '#111827', { r: 24, stroke: '#06B6D4', sw: 2 }),
        T('GET THE TEMPLATE JSON', 120, 320, 840, 40, 22, { font: MONO, color: '#06B6D4', align: 'center' }),
        T('Want the exact Make.com\nblueprint file?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "AUTOMATE" and I will send you the 1-click import template.', 160, 580, 760, 90, 30, { color: '#94A3B8', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#06B6D4', { r: 42 }),
        T('Comment "AUTOMATE" 👇', 260, 754, 560, 40, 30, { font: MONO, weight: 700, color: '#0B0F19', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { font: MONO, color: '#64748B', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 16. SHARPER MESSAGE (Johana)
// ═════════════════════════════════════════════════════════════════════════════
const betterMessage = build({
  key: 'better-message',
  name: 'Sharper Message Deck',
  description: 'Soft blush aesthetic with warm terracotta accents, strike-through corrections and creator copywriting psychology.',
  category: 'Marketing',
  tags: ['messaging', 'copywriting', 'creator', 'hooks', 'terracotta', 'aesthetic'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeHmlwtFb8C/',
  trending: true,
  createdAt: '2026-10-16T10:00:16.000Z',
  slides: [
    {
      bg: '#F9F5F1',
      els: [
        R(80, 120, 240, 44, '#C2593F', { r: 22 }),
        T('CREATOR REALITY', 80, 131, 240, 26, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('Your carousel doesn\'t', 80, 210, 920, 90, 76, { font: BODONI, weight: 700, color: '#2B2523' }),
        T('need better design.', 80, 300, 920, 90, 76, { font: ISERIF, italic: true, color: '#C2593F' }),
        T('It needs a sharper message.', 80, 390, 920, 90, 76, { font: BODONI, weight: 700, color: '#2B2523' }),
        T('Stop spending 3 hours adjusting drop shadows when the hook is unclear and nobody cares.', 80, 520, 860, 90, 32, { color: '#736862', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#A39891' }),
        T('the 3-second test inside →', 500, 1240, 500, 50, 26, { color: '#C2593F', align: 'right', weight: 600 }),
      ],
    },
    {
      bg: '#F9F5F1',
      els: [
        T('THE 3-SECOND TEST', 80, 100, 920, 40, 22, { font: OSWALD, color: '#C2593F', ls: 2 }),
        T('Can they understand Slide 1 in 3 seconds?', 80, 160, 920, 120, 56, { font: BODONI, weight: 700, color: '#2B2523', lh: 1.15 }),
        R(80, 320, 920, 220, '#FFFFFF', { r: 16, stroke: '#E8DED6', sw: 1.5 }),
        T('❌ WEAK HOOK:', 120, 360, 840, 36, 22, { font: OSWALD, color: '#EF4444', ls: 1 }),
        T('"Some thoughts on productivity and personal development for designers."', 120, 410, 840, 90, 28, { color: '#736862' }),
        R(80, 580, 920, 220, '#FFFFFF', { r: 16, stroke: '#C2593F', sw: 2 }),
        T('✅ SHARP HOOK:', 120, 620, 840, 36, 22, { font: OSWALD, color: '#C2593F', ls: 1 }),
        T('"5 habit mistakes quietly killing your focus before 10 AM."', 120, 670, 840, 90, 32, { weight: 700, color: '#2B2523' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#A39891' }),
      ],
    },
    {
      bg: '#F9F5F1',
      els: [
        R(80, 260, 920, 600, '#FFFFFF', { r: 24, stroke: '#C2593F', sw: 2 }),
        T('FOCUS ON CLARITY', 120, 340, 840, 40, 22, { font: OSWALD, color: '#C2593F', align: 'center', ls: 3 }),
        T('Clarity beats cleverness\\nevery single time.', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#2B2523', align: 'center', lh: 1.15 }),
        T('Save this reminder before your next writing session.', 160, 600, 760, 90, 30, { color: '#736862', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#C2593F', { r: 42 }),
        T('Save Reminder 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#A39891', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 17. CLIENT ACQUISITION PROCESS (Shivang Sharma)
// ═════════════════════════════════════════════════════════════════════════════
const systemProcess = build({
  key: 'system-process',
  name: 'Client Acquisition Process',
  description: 'Dark charcoal theme with glowing emerald progress numbers, agency milestone cards and client acquisition system.',
  category: 'Business',
  tags: ['agency', 'client acquisition', 'process', 'high ticket', 'sales', 'system'],
  style: 'Modern',
  audience: 'Marketers',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeTIdzQDIHY/',
  trending: true,
  createdAt: '2026-10-16T10:00:17.000Z',
  slides: [
    {
      bg: '#06130E',
      els: [
        R(80, 120, 240, 44, 'rgba(16,185,129,0.15)', { r: 22, stroke: '#10B981', sw: 1 }),
        T('AGENCY PLAYBOOK', 80, 131, 240, 26, 18, { font: OSWALD, color: '#10B981', align: 'center', ls: 2 }),
        T('THE 4-STEP CLIENT', 80, 210, 920, 90, 78, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('ACQUISITION PROCESS', 80, 300, 920, 90, 78, { font: ARCHIVO, color: '#10B981', ls: -2 }),
        T('(FROM $0 TO $20K/MO)', 80, 390, 920, 90, 72, { font: ARCHIVO, color: '#4B7365', ls: -2 }),
        T('How we close $5k+ retainers on cold outreach without sleazy pushy sales tactics.', 80, 520, 860, 90, 32, { color: '#A7D4C3', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#4B7365' }),
        T('swipe for the 4 steps →', 500, 1240, 500, 50, 26, { color: '#10B981', align: 'right' }),
      ],
    },
    {
      bg: '#06130E',
      els: [
        R(80, 100, 140, 40, '#10B981', { r: 8 }),
        T('STEP 01', 80, 108, 140, 30, 20, { font: OSWALD, weight: 700, color: '#06130E', align: 'center', ls: 1 }),
        T('The Free Audit Loom', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 360, '#0E281F', { r: 16 }),
        T('THE STRATEGY', 120, 320, 840, 36, 20, { font: OSWALD, color: '#10B981', ls: 2 }),
        T('Record a 2-minute Loom screen recording analyzing 3 specific conversion leaks on their website. Never pitch your services in Video 1. Give massive proof of competence upfront.', 120, 370, 840, 200, 30, { color: '#D1EAE0', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#4B7365' }),
      ],
    },
    {
      bg: '#06130E',
      els: [
        R(80, 240, 920, 640, '#0E281F', { r: 24, stroke: '#10B981', sw: 2 }),
        T('GET THE SCRIPT', 120, 320, 840, 40, 22, { font: OSWALD, color: '#10B981', align: 'center', ls: 3 }),
        T('Want our exact cold\nLoom pitch script?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "PROCESS" and I will send you the word-for-word outreach template.', 160, 580, 760, 90, 30, { color: '#A7D4C3', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#10B981', { r: 42 }),
        T('Comment "PROCESS" 👇', 260, 754, 560, 40, 30, { font: OSWALD, weight: 700, color: '#06130E', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#4B7365', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 18. SOCIAL MEDIA MATRIX (Pinterest #19)
// ═════════════════════════════════════════════════════════════════════════════
const socialMagazine = build({
  key: 'social-magazine',
  name: 'Social Media Matrix',
  description: 'High-fashion editorial Swiss grid, black and white ink style with multi-column distribution analysis.',
  category: 'Marketing',
  tags: ['social media', 'editorial', 'swiss grid', 'strategy', 'magazine', 'minimal'],
  style: 'Editorial',
  audience: 'Agencies',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/60zGGhRWa',
  trending: true,
  createdAt: '2026-10-16T10:00:18.000Z',
  slides: [
    {
      bg: '#FFFFFF',
      els: [
        T('VOL. 26 // ISSUE 04', 80, 100, 500, 40, 22, { font: OSWALD, color: '#888888', ls: 2 }),
        T('SOCIAL MEDIA', 80, 170, 920, 100, 92, { font: ARCHIVO, color: '#000000', ls: -3 }),
        T('MATRIX 2026', 80, 275, 920, 100, 92, { font: BODONI, italic: true, color: '#000000' }),
        R(80, 400, 920, 3, '#000000'),
        T('A structural analysis of reach vs retention across modern distribution channels.', 80, 430, 860, 80, 30, { color: '#555555', lh: 1.4 }),
        R(80, 560, 440, 480, '#F5F5F5', { r: 16 }),
        T('REELS / TIKTOK', 110, 600, 380, 36, 20, { font: OSWALD, color: '#000000', ls: 2 }),
        T('High Discovery / Low Trust', 110, 650, 380, 60, 30, { weight: 700, color: '#000000' }),
        T('Gets your face in front of 50k strangers, but only 2% remember your name 24 hours later.', 110, 730, 380, 180, 26, { color: '#666666', lh: 1.45 }),
        R(560, 560, 440, 480, '#000000', { r: 16 }),
        T('CAROUSELS', 590, 600, 380, 36, 20, { font: OSWALD, color: '#FFFFFF', ls: 2 }),
        T('Deep Trust / High Saves', 590, 650, 380, 60, 30, { weight: 700, color: '#FFFFFF' }),
        T('People bookmark knowledge. The bookmark creates repeat exposure and authority that converts.', 590, 730, 380, 180, 26, { color: '#CCCCCC', lh: 1.45 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#888888' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        R(80, 260, 920, 600, '#000000', { r: 24 }),
        T('EDITORIAL CONCLUSION', 120, 340, 840, 40, 22, { font: OSWALD, color: '#FFFFFF', align: 'center', ls: 3 }),
        T('Use video for reach.\nUse carousels for revenue.', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Save this volume to guide your Q4 distribution strategy.', 160, 600, 760, 90, 30, { color: '#AAAAAA', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#FFFFFF', { r: 42 }),
        T('Save Volume 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#000000', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#888888', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 19. BEYOND THE LOGO (Pinterest #20)
// ═════════════════════════════════════════════════════════════════════════════
const brandStarts = build({
  key: 'brand-starts',
  name: 'Beyond The Logo',
  description: 'Stark minimalist black and white typography manifesto challenging traditional brand design assumptions.',
  category: 'Marketing',
  tags: ['brand', 'logo', 'manifesto', 'design thinking', 'minimal', 'monochrome'],
  style: 'Bold',
  audience: 'Marketers',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/2LiMlLed8',
  trending: true,
  createdAt: '2026-10-16T10:00:19.000Z',
  slides: [
    {
      bg: '#0A0A0A',
      els: [
        T('Most people think', 80, 160, 920, 80, 64, { font: BODONI, weight: 700, color: '#FFFFFF' }),
        T('brand design starts', 80, 240, 920, 80, 64, { font: ISERIF, italic: true, color: '#E11D48' }),
        T('with a logo.', 80, 320, 920, 80, 64, { font: BODONI, weight: 700, color: '#FFFFFF' }),
        T('THEY ARE WRONG.', 80, 440, 920, 120, 96, { font: ARCHIVO, color: '#E11D48', ls: -3 }),
        T('A logo is an empty container. It only has value after you pour customer experiences into it.', 80, 580, 860, 90, 32, { color: '#A1A1AA', lh: 1.45 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#52525B' }),
        T('what actually matters →', 500, 1240, 500, 50, 26, { color: '#E11D48', align: 'right' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        T('THE 3 REAL PILLARS', 80, 120, 920, 40, 22, { font: OSWALD, color: '#E11D48', ls: 2 }),
        T('What actually creates brand loyalty:', 80, 180, 920, 80, 56, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 300, 920, 200, '#18181B', { r: 16 }),
        T('01 / THE POSITIONING', 120, 335, 840, 30, 20, { font: OSWALD, color: '#E11D48', ls: 2 }),
        T('Who are you strictly NOT for? Narrowing your audience increases attraction.', 120, 380, 840, 80, 28, { color: '#E4E4E7' }),
        R(80, 540, 920, 200, '#18181B', { r: 16 }),
        T('02 / THE PROMISE', 120, 575, 840, 30, 20, { font: OSWALD, color: '#E11D48', ls: 2 }),
        T('What speed or quality guarantee do you deliver that competitors fear to match?', 120, 620, 840, 80, 28, { color: '#E4E4E7' }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#52525B' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 260, 920, 600, '#18181B', { r: 24, stroke: '#E11D48', sw: 2 }),
        T('MANIFESTO', 120, 340, 840, 40, 22, { font: OSWALD, color: '#E11D48', align: 'center', ls: 3 }),
        T('Build the reputation.\nThe logo will follow.', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Agree or disagree? Share your thoughts in the comments.', 160, 600, 760, 90, 30, { color: '#A1A1AA', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#E11D48', { r: 42 }),
        T('Share Your View 👇', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#52525B', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 20. WEALTH PSYCHOLOGY (Pinterest #21)
// ═════════════════════════════════════════════════════════════════════════════
const moneyPsychology = build({
  key: 'money-psychology',
  name: 'Wealth Psychology',
  description: 'Moody aesthetic photo of finance book on leather car seat with deep navy background and timeless money principles.',
  category: 'Finance',
  tags: ['money', 'wealth', 'psychology', 'habits', 'finance', 'luxury'],
  style: 'Luxury',
  audience: 'General',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/4sKJrvG3d',
  trending: true,
  createdAt: '2026-10-16T10:00:20.000Z',
  slides: [
    {
      bg: '#080E1E',
      els: [
        I('/carousels/ref2/car-book.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 240, 44, 'rgba(217,179,129,0.15)', { r: 22, stroke: '#D9B381', sw: 1 }),
        T('MONEY MINDSET', 80, 131, 240, 26, 18, { font: OSWALD, color: '#D9B381', align: 'center', ls: 2 }),
        T('Most people don\'t need', 80, 210, 920, 80, 68, { font: BODONI, weight: 700, color: '#F7F5F0' }),
        T('more financial advice.', 80, 290, 920, 80, 68, { font: ISERIF, italic: true, color: '#D9B381' }),
        T('They need better emotional control.', 80, 400, 860, 90, 32, { color: '#A5B4C7', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#687A94' }),
      ],
    },
    {
      bg: '#080E1E',
      els: [
        T('PRINCIPLE 01', 80, 100, 920, 40, 22, { font: OSWALD, color: '#D9B381', ls: 2 }),
        T('Wealth is What You Don\'t See', 80, 160, 920, 80, 56, { font: BODONI, weight: 700, color: '#F7F5F0' }),
        R(80, 280, 920, 360, '#0F1A33', { r: 16 }),
        T('THE ILLUSION', 120, 320, 840, 36, 20, { font: OSWALD, color: '#D9B381', ls: 2 }),
        T('Spending money to show people how much money you have is the fastest way to have less money. True wealth is flexibility, calm mornings, and unforced decisions.', 120, 370, 840, 200, 30, { color: '#C8D5E5', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#687A94' }),
      ],
    },
    {
      bg: '#080E1E',
      els: [
        R(80, 260, 920, 600, '#0F1A33', { r: 24, stroke: '#D9B381', sw: 2 }),
        T('FINANCIAL PEACE', 120, 340, 840, 40, 22, { font: OSWALD, color: '#D9B381', align: 'center', ls: 3 }),
        T('Control your calendar,\ncontrol your life.', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#F7F5F0', align: 'center', lh: 1.15 }),
        T('Save this reminder to re-read on payday.', 160, 600, 760, 90, 30, { color: '#A5B4C7', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#D9B381', { r: 42 }),
        T('Save Principle 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#080E1E', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#687A94', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 21. CLIENT FILTER (Pinterest #22)
// ═════════════════════════════════════════════════════════════════════════════
const clientVetting = build({
  key: 'client-vetting',
  name: 'Client Filter Deck',
  description: 'Clean cream split cards contrasting 4 red flags against 4 green flags for agencies and solopreneurs.',
  category: 'Business',
  tags: ['clients', 'freelance', 'red flags', 'green flags', 'vetting', 'agency'],
  style: 'Editorial',
  audience: 'Founders',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/1qy5XPnuO',
  trending: true,
  createdAt: '2026-10-16T10:00:21.000Z',
  slides: [
    {
      bg: '#F8F7F4',
      els: [
        R(80, 120, 220, 44, '#EBE8E1', { r: 22 }),
        T('AGENCY VETTING', 80, 131, 220, 26, 18, { font: OSWALD, color: '#4A4740', align: 'center', ls: 2 }),
        T('NOT EVERY CLIENT', 80, 210, 920, 90, 78, { font: ARCHIVO, color: '#1F1E1B', ls: -2 }),
        T('IS A GOOD CLIENT', 80, 300, 920, 90, 78, { font: ARCHIVO, color: '#DC2626', ls: -2 }),
        T('4 Green Flags vs 4 Red Flags to spot before signing any contract.', 80, 420, 860, 90, 32, { color: '#636056', lh: 1.4 }),
        R(80, 560, 920, 480, '#FFFFFF', { r: 20, stroke: '#EBE8E1', sw: 1.5 }),
        T('🚩 RED FLAGS:', 120, 600, 840, 36, 22, { font: OSWALD, color: '#DC2626', ls: 2 }),
        T('• "This should only take 10 minutes"\n• Demands discounts before discussing scope\n• Complains endlessly about past 4 agencies\n• Unwilling to pay 50% upfront deposit', 120, 655, 840, 200, 28, { color: '#2B2A27', lh: 1.6 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#8C887E' }),
        T('see green flags inside →', 500, 1240, 500, 50, 26, { color: '#059669', align: 'right', weight: 600 }),
      ],
    },
    {
      bg: '#F8F7F4',
      els: [
        T('🟢 GREEN FLAGS', 80, 100, 920, 40, 22, { font: OSWALD, color: '#059669', ls: 2 }),
        T('Signs of a Dream Client', 80, 160, 920, 80, 60, { font: ARCHIVO, color: '#1F1E1B' }),
        R(80, 280, 920, 420, '#FFFFFF', { r: 20, stroke: '#059669', sw: 2 }),
        T('• Clear definition of project success\n• Pays deposits without awkward follow-ups\n• Designates ONE clear decision maker\n• Values your expertise instead of micromanaging', 120, 340, 840, 300, 32, { color: '#1F1E1B', lh: 1.8 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#8C887E' }),
      ],
    },
    {
      bg: '#F8F7F4',
      els: [
        R(80, 260, 920, 600, '#FFFFFF', { r: 24, stroke: '#EBE8E1', sw: 2 }),
        T('PROTECT YOUR TIME', 120, 340, 840, 40, 22, { font: OSWALD, color: '#DC2626', align: 'center', ls: 3 }),
        T('Bad clients cost 10x\\nmore than they pay.', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#1F1E1B', align: 'center', lh: 1.15 }),
        T('Save this checklist to vet leads before your next discovery call.', 160, 600, 760, 90, 30, { color: '#636056', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#1F1E1B', { r: 42 }),
        T('Save Checklist 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#8C887E', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 22. FIGMA TYPOGRAPHY SECRETS (Pinterest #23)
// ═════════════════════════════════════════════════════════════════════════════
const figmaCanvas = build({
  key: 'figma-canvas',
  name: 'Figma Typography Secrets',
  description: 'Authentic Figma dark canvas interface with blue selection bounding boxes, property panels and pro design tricks.',
  category: 'Productivity',
  tags: ['figma', 'typography', 'design', 'ui', 'canvas', 'pro tips'],
  style: 'Modern',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/7qI5IbTay',
  trending: true,
  createdAt: '2026-10-16T10:00:22.000Z',
  slides: [
    {
      bg: '#2C2C2C',
      els: [
        R(80, 120, 220, 44, '#383838', { r: 8 }),
        T('FIGMA PRO TRICKS', 80, 131, 220, 26, 18, { font: MONO, color: '#0D99FF', align: 'center' }),
        T('FIGMA TEXT SECRETS', 80, 210, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('THAT MAKE HEADLINES', 80, 300, 920, 90, 76, { font: ARCHIVO, color: '#0D99FF', ls: -2 }),
        T('LOOK EXPENSIVE', 80, 390, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('4 typography property toggles that 90% of junior designers never touch.', 80, 520, 860, 90, 32, { color: '#C2C2C2', lh: 1.4 }),
        R(80, 650, 920, 400, '#1E1E1E', { r: 16, stroke: '#0D99FF', sw: 2 }),
        T('SECRET 01: Negative letter spacing (-3% on large titles)\nSECRET 02: Optical alignment for hanging punctuation\nSECRET 03: Tight line height (1.05 instead of default 1.4)\nSECRET 04: Uppercase letter tracking (+5% on small tags)', 120, 720, 840, 260, 28, { font: MONO, color: '#FFFFFF', lh: 1.7 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#888888' }),
      ],
    },
    {
      bg: '#2C2C2C',
      els: [
        R(80, 100, 160, 40, '#0D99FF', { r: 6 }),
        T('RULE 01', 80, 108, 160, 30, 18, { font: MONO, weight: 700, color: '#FFFFFF', align: 'center' }),
        T('Negative Letter Spacing', 80, 170, 920, 80, 60, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 380, '#1E1E1E', { r: 16 }),
        T('THE SECRET', 120, 320, 840, 36, 20, { font: MONO, color: '#0D99FF' }),
        T('Fonts are spaced by default for body text (16px). When you scale a font up to 80px, the gaps between letters look huge and disconnected. Always add -2% to -4% letter spacing on titles.', 120, 370, 840, 220, 30, { color: '#D9D9D9', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { font: MONO, color: '#888888' }),
      ],
    },
    {
      bg: '#2C2C2C',
      els: [
        R(80, 260, 920, 600, '#1E1E1E', { r: 24, stroke: '#0D99FF', sw: 2 }),
        T('DESIGNER BOOKMARK', 120, 340, 840, 40, 22, { font: MONO, color: '#0D99FF', align: 'center' }),
        T('Open Figma and test\\nthese on your file.', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Save this shortcut card so you have it ready on your next client project.', 160, 600, 760, 90, 30, { color: '#AAAAAA', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#0D99FF', { r: 42 }),
        T('Save Figma Tips 🔖', 280, 754, 520, 40, 28, { font: MONO, weight: 700, color: '#FFFFFF', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { font: MONO, color: '#888888', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 23. DAILY CREATIVE HABIT (Pinterest #24)
// ═════════════════════════════════════════════════════════════════════════════
const creativeHabit = build({
  key: 'creative-habit',
  name: 'Daily Creative Habit',
  description: 'Whimsical alpine meadow desk photo with soft warm sky tones and inspiring creator discipline philosophy.',
  category: 'Motivation',
  tags: ['creativity', 'habits', 'inspiration', 'discipline', 'nature', 'writing'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/43KaLE5zU',
  trending: true,
  createdAt: '2026-10-16T10:00:23.000Z',
  slides: [
    {
      bg: '#EBEBE6',
      els: [
        I('/carousels/ref2/meadow-desk.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        T('Creativity isn\'t magic.', 80, 140, 920, 80, 68, { font: BODONI, weight: 700, color: '#1B2418' }),
        T('It is simply a habit', 80, 220, 920, 80, 68, { font: ISERIF, italic: true, color: '#3A5A30' }),
        T('of showing up.', 80, 300, 920, 80, 68, { font: BODONI, weight: 700, color: '#1B2418' }),
        T('Inspiration never strikes while scrolling Twitter. It only strikes while your hands are on the keyboard.', 80, 410, 860, 90, 32, { color: '#4E5A4A', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#1B2418', weight: 600 }),
      ],
    },
    {
      bg: '#EBEBE6',
      els: [
        T('LESSON 01', 80, 100, 920, 40, 22, { font: OSWALD, color: '#3A5A30', ls: 2 }),
        T('Quantity Leads to Quality', 80, 160, 920, 80, 60, { font: BODONI, weight: 700, color: '#1B2418' }),
        R(80, 280, 920, 360, '#FFFFFF', { r: 20 }),
        T('THE TRUTH ABOUT GREAT WORK', 120, 320, 840, 36, 20, { font: OSWALD, color: '#3A5A30', ls: 2 }),
        T('You cannot sit down and decide to write a masterpiece. You have to write 50 ordinary drafts to stumble upon 1 viral insight. Fall in love with the volume.', 120, 370, 840, 200, 32, { font: ISERIF, italic: true, color: '#2C3829', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#5A6856' }),
      ],
    },
    {
      bg: '#EBEBE6',
      els: [
        R(80, 260, 920, 600, '#FFFFFF', { r: 24 }),
        T('DAILY REFLECTION', 120, 340, 840, 40, 22, { font: OSWALD, color: '#3A5A30', align: 'center', ls: 3 }),
        T('What will you create\nbefore going to sleep?', 120, 410, 840, 160, 64, { font: BODONI, weight: 700, color: '#1B2418', align: 'center', lh: 1.15 }),
        T('Save this post to stay committed to your daily creative practice.', 160, 600, 760, 90, 30, { color: '#4E5A4A', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#2A3C23', { r: 42 }),
        T('Stay Inspired 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#5A6856', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 24. IMAGE CHEAT CODES (Vaibhav Sisinty)
// ═════════════════════════════════════════════════════════════════════════════
const chatgptCheatcodes = build({
  key: 'chatgpt-cheatcodes',
  name: 'AI Image Cheat Codes',
  description: 'Smug snow leopard on rich crimson background with electric yellow prompt tags and viral AI cheat sheets.',
  category: 'AI',
  tags: ['chatgpt', 'midjourney', 'prompts', 'images', 'cheat codes', 'crimson'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeYdrH1FNht/',
  trending: true,
  createdAt: '2026-10-16T10:00:24.000Z',
  slides: [
    {
      bg: '#7A0F1E',
      els: [
        I('/carousels/ref2/leopard.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 260, 48, '#FACC15', { r: 8 }),
        T('VIRAL AI HACKS', 80, 132, 260, 30, 22, { font: ARCHIVO, color: '#7A0F1E', align: 'center' }),
        T('CHATGPT HAS', 80, 200, 920, 90, 84, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('CHEAT CODES', 80, 290, 920, 90, 84, { font: ARCHIVO, color: '#FACC15', ls: -2 }),
        T('FOR IMAGES', 80, 380, 920, 90, 84, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('Stop writing 3-paragraph prompts. Adding these 3 keywords produces studio quality.', 80, 500, 860, 80, 32, { color: '#FBCFE8', lh: 1.35 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#FACC15', weight: 600 }),
      ],
    },
    {
      bg: '#7A0F1E',
      els: [
        R(80, 100, 180, 40, '#FACC15', { r: 6 }),
        T('KEYWORD 01', 80, 108, 180, 30, 20, { font: ARCHIVO, color: '#7A0F1E', align: 'center' }),
        T('"Volumetric Rim-Lighting"', 80, 170, 920, 80, 56, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 360, '#580A15', { r: 16 }),
        T('WHY IT WORKS', 120, 320, 840, 36, 20, { font: OSWALD, color: '#FACC15', ls: 2 }),
        T('Instead of a flat digital cutout, rim-lighting forces Midjourney/ChatGPT to wrap a glowing outline of light around your subject, creating massive cinematic 3D depth.', 120, 370, 840, 200, 32, { color: '#FCE7F3', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#FBCFE8' }),
      ],
    },
    {
      bg: '#7A0F1E',
      els: [
        R(80, 260, 920, 600, '#580A15', { r: 24, stroke: '#FACC15', sw: 3 }),
        T('COPY-PASTE CHEAT SHEET', 120, 340, 840, 40, 24, { font: ARCHIVO, color: '#FACC15', align: 'center' }),
        T('Save these 4 prompt\\nmodifiers right now.', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Bookmark this carousel so you have it open during your next creative session.', 160, 600, 760, 90, 30, { color: '#FCE7F3', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#FACC15', { r: 42 }),
        T('Save Cheat Codes 🔖', 280, 754, 520, 40, 30, { font: ARCHIVO, color: '#7A0F1E', align: 'center' }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#FACC15', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 25. VIRAL MACHINE (Kallaway)
// ═════════════════════════════════════════════════════════════════════════════
const viralMachine = build({
  key: 'viral-machine',
  name: 'Viral Outlier Machine',
  description: 'Cinematic dark TV room with orange glowing cathode screen, outlier detection algorithms and viral playbooks.',
  category: 'Creator',
  tags: ['viral machine', 'claude', 'outliers', 'retro tv', 'content strategy', 'notion'],
  style: 'Dark',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeF80wGjkoD/',
  trending: true,
  createdAt: '2026-10-16T10:00:25.000Z',
  slides: [
    {
      bg: '#0A0A0A',
      els: [
        I('/carousels/ref2/retro-tv.jpg', 0, 540, 1080, 810, { fit: 'cover' }),
        R(80, 120, 240, 44, 'rgba(255,90,0,0.2)', { r: 22, stroke: '#FF5A00', sw: 1.5 }),
        T('VIRAL ENGINE', 80, 131, 240, 26, 18, { font: OSWALD, weight: 700, color: '#FF5A00', align: 'center', ls: 2 }),
        T('HOW TO TURN CLAUDE', 80, 210, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('INTO A VIRAL', 80, 300, 920, 90, 76, { font: ARCHIVO, color: '#FF5A00', ls: -2 }),
        T('CONTENT MACHINE', 80, 390, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('Automatically detect breakout competitor outliers and transform proven formats into original hits.', 80, 520, 860, 90, 32, { color: '#A3A3A3', lh: 1.4 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#FF5A00', weight: 600 }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 100, 160, 40, '#FF5A00', { r: 8 }),
        T('THE SYSTEM', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#0A0A0A', align: 'center', ls: 1 }),
        T('Live Outlier Leaderboard', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 360, '#171717', { r: 16, stroke: '#262626', sw: 1.5 }),
        T('THE MECHANIC', 120, 320, 840, 36, 20, { font: OSWALD, color: '#FF5A00', ls: 2 }),
        T('Claude monitors 30 accounts in your niche. The instant a post cracks 10x median engagement, it triggers an alert and breaks down the exact psychological hook used in slide 1.', 120, 370, 840, 200, 30, { color: '#E5E5E5', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#737373' }),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(80, 240, 920, 640, '#171717', { r: 24, stroke: '#FF5A00', sw: 2 }),
        T('GET THE NOTION TEMPLATE', 120, 320, 840, 40, 22, { font: OSWALD, color: '#FF5A00', align: 'center', ls: 3 }),
        T('Want the live outlier\ntracking dashboard?', 120, 390, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "MACHINE" and I will send you the complete Notion database + Claude prompt instructions.', 160, 580, 760, 90, 30, { color: '#A3A3A3', align: 'center', lh: 1.4 }),
        R(260, 730, 560, 84, '#FF5A00', { r: 42 }),
        T('Comment "MACHINE" 👇', 260, 754, 560, 40, 30, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#737373', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 26. 50 MARKETING CONCEPTS (Prathamesh Bhosle)
// ═════════════════════════════════════════════════════════════════════════════
const fiftyConcepts = build({
  key: 'fifty-concepts',
  name: 'Marketing Concepts 101',
  description: 'Clean dark slate cards with bite-sized definitions of Seth Godin frameworks, AIDA, and Red vs Blue Oceans.',
  category: 'Marketing',
  tags: ['marketing', 'concepts', 'purple cow', 'aida', 'strategy', 'education'],
  style: 'Educational',
  audience: 'Marketers',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/Dd8LhzzjhG-/',
  trending: true,
  createdAt: '2026-10-16T10:00:26.000Z',
  slides: [
    {
      bg: '#121214',
      els: [
        R(80, 120, 260, 44, '#A855F7', { r: 22 }),
        T('MARKETING GLOSSARY', 80, 131, 260, 26, 18, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        T('MARKETING CONCEPTS', 80, 210, 920, 90, 76, { font: ARCHIVO, color: '#FFFFFF', ls: -2 }),
        T('EVERYONE SHOULD KNOW', 80, 300, 920, 90, 76, { font: ARCHIVO, color: '#A855F7', ls: -2 }),
        T('You hear these in boardrooms and Twitter threads. Here is what they actually mean in plain English.', 80, 420, 860, 90, 32, { color: '#A1A1AA', lh: 1.4 }),
        R(80, 560, 920, 480, '#18181B', { r: 20 }),
        T('• Purple Cow — Remarkable or completely invisible\n• AIDA — Attention, Interest, Desire, Action funnel\n• Lindy Effect — The older an idea is, the longer it survives\n• Red vs Blue Ocean — Fight for an existing market or invent a new one', 120, 620, 840, 360, 30, { color: '#F4F4F5', lh: 1.8 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#71717A' }),
        T('breakdown inside →', 500, 1240, 500, 50, 26, { color: '#A855F7', align: 'right' }),
      ],
    },
    {
      bg: '#121214',
      els: [
        R(80, 100, 160, 40, '#A855F7', { r: 8 }),
        T('CONCEPT 01', 80, 108, 160, 30, 20, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('The Purple Cow', 80, 170, 920, 80, 64, { font: ARCHIVO, color: '#FFFFFF' }),
        R(80, 280, 920, 360, '#18181B', { r: 16 }),
        T('SETH GODIN\'S LAW', 120, 320, 840, 36, 20, { font: OSWALD, color: '#A855F7', ls: 2 }),
        T('If you drive past a field of brown cows, you ignore them after 30 seconds. But if you see a Purple Cow, you pull over, take a photo, and tell all your friends. Being very good is boring. Being remarkable is profitable.', 120, 370, 840, 220, 30, { color: '#E4E4E7', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#71717A' }),
      ],
    },
    {
      bg: '#121214',
      els: [
        R(80, 260, 920, 600, '#18181B', { r: 24, stroke: '#A855F7', sw: 2 }),
        T('WANT ALL 50?', 120, 340, 840, 40, 22, { font: OSWALD, color: '#A855F7', align: 'center', ls: 3 }),
        T('Want the free 50-concept\nmarketing handbook?', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Comment "CONCEPTS" below and I will DM you the complete PDF.', 160, 600, 760, 90, 30, { color: '#A1A1AA', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#A855F7', { r: 42 }),
        T('Comment "CONCEPTS" 👇', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#FFFFFF', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#71717A', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 27. UI VS UX (Repute Forge)
// ═════════════════════════════════════════════════════════════════════════════
const uiVsUx = build({
  key: 'ui-vs-ux',
  name: 'UI vs UX Metaphor',
  description: 'High-contrast graphic metaphor comparison — UI is the saddle, UX is the feeling of riding the horse.',
  category: 'Education',
  tags: ['ui', 'ux', 'product design', 'metaphor', 'contrast', 'graphic design'],
  style: 'Bold',
  audience: 'Founders',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeWjCK6m4Mx/',
  trending: true,
  createdAt: '2026-10-16T10:00:27.000Z',
  slides: [
    {
      bg: '#000000',
      els: [
        R(0, 0, 540, 1350, '#000000'),
        R(540, 0, 540, 1350, '#FFFFFF'),
        T('UI', 80, 240, 380, 160, 140, { font: ARCHIVO, color: '#FFFFFF' }),
        T('IS THE SADDLE.', 80, 420, 380, 80, 36, { font: OSWALD, color: '#888888', ls: 2 }),
        T('UX', 620, 240, 380, 160, 140, { font: ARCHIVO, color: '#000000' }),
        T('IS THE RIDE.', 620, 420, 380, 80, 36, { font: OSWALD, color: '#000000', ls: 2 }),
        R(80, 680, 920, 280, '#111111', { r: 24, stroke: '#333333', sw: 1.5 }),
        T('THE DIFFERENCE EXPLAINED:', 120, 720, 840, 36, 20, { font: OSWALD, color: '#FF5A00', ls: 3 }),
        T('UI is the stirrups, the polished leather and the reins.\nUX is the feeling of galloping across an open field at sunrise.', 120, 780, 840, 140, 32, { color: '#F5F5F0', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#666666' }),
        T('why this matters →', 500, 1240, 500, 50, 26, { color: '#000000', align: 'right', weight: 700 }),
      ],
    },
    {
      bg: '#000000',
      els: [
        T('THE GOLD SADDLE TRAP', 80, 120, 920, 40, 22, { font: OSWALD, color: '#FF5A00', ls: 2 }),
        T('A gold saddle on a wild horse is still useless.', 80, 180, 920, 140, 64, { font: ARCHIVO, color: '#FFFFFF', lh: 1.1 }),
        R(80, 360, 920, 360, '#111111', { r: 16 }),
        T('THE PRODUCT LESSON', 120, 400, 840, 36, 20, { font: OSWALD, color: '#888888', ls: 2 }),
        T('You can have glassmorphism, micro-animations, and 60fps transitions. But if your checkout page takes 8 clicks or fails on mobile, your users will leave. Good UI makes bad UX look worse.', 120, 450, 840, 220, 30, { color: '#CCCCCC', lh: 1.5 }),
        T('@yourhandle', 80, 1240, 500, 50, 26, { color: '#666666' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        R(80, 260, 920, 600, '#000000', { r: 24 }),
        T('THE DESIGN LAW', 120, 340, 840, 40, 22, { font: OSWALD, color: '#888888', align: 'center', ls: 3 }),
        T('Design for the feeling,\nnot just the pixels.', 120, 410, 840, 160, 64, { font: ARCHIVO, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Share this with your product and design team.', 160, 600, 760, 90, 30, { color: '#AAAAAA', align: 'center', lh: 1.4 }),
        R(280, 730, 520, 84, '#FFFFFF', { r: 42 }),
        T('Share With Team 🔖', 280, 754, 520, 40, 28, { font: OSWALD, weight: 700, color: '#000000', align: 'center', ls: 1 }),
        T('@yourhandle', 80, 1240, 920, 50, 28, { color: '#666666', align: 'center' }),
      ],
    },
  ],
});

export const REFERENCE_TEMPLATES_2: Template[] = [
  clientTeam,
  buildAiApp,
  fiveWorkflows,
  fourMoneySites,
  curatedApps,
  skillLadder,
  antiSlopSkills,
  devResources,
  claudeContentEngine,
  macbookShortcuts,
  brandDuel,
  claudeSetup,
  identityShift,
  founderManual,
  firstAiAutomation,
  betterMessage,
  systemProcess,
  socialMagazine,
  brandStarts,
  moneyPsychology,
  clientVetting,
  figmaCanvas,
  creativeHabit,
  chatgptCheatcodes,
  viralMachine,
  fiftyConcepts,
  uiVsUx,
];
