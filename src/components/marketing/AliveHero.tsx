import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * AliveHero — cursor-driven "living collage" hero.
 * Inspired by motionin.design/gallery/alive: a big serif manifesto that the
 * cursor buries in carousel slides. Each slide surges up from below to wherever
 * you point, overlaps the previous ones, then sinks away. With no cursor
 * (touch / idle) an autopilot wanders the stage so it never looks dead.
 */

const HERO_IMAGES = [
  '/carousels/c1/slide1.png',
  '/hero/cover1.jpg',
  '/carousels/c1/slide2.png',
  '/hero/cover2.jpg',
  '/carousels/c1/slide3.png',
  '/hero/cover3.jpg',
  '/carousels/c1/slide4.png',
  '/hero/cover4.jpg',
  '/carousels/c1/slide5.png',
  '/hero/cover5.jpg',
];

const MAX_LIVE = 16;
const LIFETIME_MS = 2600;
const IDLE_BEFORE_AUTOPILOT_MS = 1800;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function AliveHero() {
  const stageRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload so cards never pop in blank
    HERO_IMAGES.forEach(src => { const i = new Image(); i.src = src; });

    let imgIdx = 0;
    let zTop = 1;
    let live: HTMLDivElement[] = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let lastSpawn = { x: -9999, y: -9999, t: 0 };
    let lastPointerAt = 0;
    let visible = true;
    let raf = 0;

    const cardWidth = () => {
      const w = stage.clientWidth;
      return clamp(w * (w < 640 ? 0.3 : 0.125), 104, 220);
    };

    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    };

    const exit = (el: HTMLDivElement) => {
      if (el.dataset.exiting) return;
      el.dataset.exiting = '1';
      live = live.filter(e => e !== el);
      const rot = Number(el.dataset.rot || 0);
      const anim = el.animate(
        [
          { transform: `translate3d(0,0,0) rotate(${rot}deg) scale(1)`, opacity: 1, filter: 'blur(0px)' },
          { transform: `translate3d(0,60px,0) rotate(${rot * 1.4}deg) scale(0.86)`, opacity: 0, filter: 'blur(6px)' },
        ],
        { duration: 720, easing: 'cubic-bezier(0.55, 0, 0.75, 0.2)', fill: 'forwards' }
      );
      anim.onfinish = () => el.remove();
    };

    const spawn = (x: number, y: number, vx = 0, animate = true, persistent = false) => {
      const w = cardWidth();
      const h = w * 1.25; // 4:5 carousel ratio
      const el = document.createElement('div');
      el.className = 'alive-card';
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.left = `${x - w / 2}px`;
      el.style.top = `${y - h / 2}px`;
      el.style.zIndex = String(++zTop);

      const img = document.createElement('img');
      img.src = HERO_IMAGES[imgIdx++ % HERO_IMAGES.length];
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      el.appendChild(img);

      // Tilt leans into the direction of travel, plus a little randomness
      const rot = clamp((Math.random() - 0.5) * 14 + vx * 0.25, -16, 16);
      el.dataset.rot = String(rot);
      layer.appendChild(el);

      if (animate) {
        // Surge up from below the stage's bottom edge
        const rise = clamp(stage.clientHeight - y + h * 0.6, 220, 620);
        const drift = (Math.random() - 0.5) * 60;
        el.animate(
          [
            { transform: `translate3d(${drift}px, ${rise}px, 0) rotate(${rot * 2.2}deg) scale(0.72)`, opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, offset: 0.22 },
            { transform: `translate3d(0,0,0) rotate(${rot}deg) scale(1)`, opacity: 1, filter: 'blur(0px)' },
          ],
          { duration: 980, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
        );
      } else {
        el.style.transform = `rotate(${rot}deg)`;
      }

      if (persistent) return;
      live.push(el);
      later(() => exit(el), LIFETIME_MS + Math.random() * 600);
      while (live.length > MAX_LIVE) exit(live[0]);
    };

    // ── Reduced motion: a still collage framing the headline ──────────────
    if (reduceMotion) {
      const W = stage.clientWidth, H = stage.clientHeight;
      const spots = [
        [0.1, 0.25], [0.88, 0.22], [0.08, 0.72], [0.92, 0.7], [0.25, 0.9], [0.75, 0.92],
      ];
      spots.forEach(([fx, fy]) => spawn(fx * W, fy * H, 0, false, true));
      return () => { layer.innerHTML = ''; };
    }

    // ── Pointer-driven spawning ───────────────────────────────────────────
    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lastPointerAt = performance.now();
      const dx = x - lastSpawn.x;
      const dy = y - lastSpawn.y;
      const dist = Math.hypot(dx, dy);
      if (dist > cardWidth() * 0.5) {
        spawn(x, y, dx * 0.15);
        lastSpawn = { x, y, t: lastPointerAt };
      }
    };
    stage.addEventListener('pointermove', onPointerMove, { passive: true });

    // ── Autopilot: wander a Lissajous path when idle / on touch ───────────
    let t = Math.random() * 10;
    let prev = performance.now();
    let autoLast = { x: -9999, y: -9999 };
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      if (visible && !document.hidden && now - lastPointerAt > IDLE_BEFORE_AUTOPILOT_MS) {
        t += dt * 0.00055;
        const W = stage.clientWidth, H = stage.clientHeight;
        const x = W / 2 + Math.sin(t * 1.3) * W * 0.4;
        const y = H / 2 + Math.sin(t * 2.1 + 1.2) * H * 0.34;
        const dx = x - autoLast.x;
        if (Math.hypot(dx, y - autoLast.y) > cardWidth() * 0.7) {
          spawn(x, y, dx * 0.1);
          autoLast = { x, y };
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause when hero leaves the viewport
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    io.observe(stage);

    return () => {
      stage.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(raf);
      io.disconnect();
      timers.forEach(clearTimeout);
      layer.innerHTML = '';
    };
  }, []);

  return (
    <section ref={stageRef} className="alive-hero" aria-label="SwappAI hero">
      {/* Headline sits UNDER the photo layer — the cursor buries it */}
      <div className="alive-hero__headline">
        <span className="text-eyebrow animate-on-scroll">The carousel workspace</span>
        <h1 className="alive-hero__title animate-on-scroll animate-on-scroll-delay-1">
          <span className="alive-hero__serif">Make carousels</span>
          <span className="alive-hero__serif">worth</span>
          <span className="alive-hero__bold">SWIPING<span className="alive-hero__dot">.</span></span>
        </h1>
      </div>

      <div ref={layerRef} className="alive-hero__layer" aria-hidden="true" />

      {/* Copy + CTAs float above the collage so they stay usable */}
      <div className="alive-hero__cta animate-on-scroll animate-on-scroll-delay-2">
        <p className="alive-hero__sub">
          Start with a proven structure. Swap the content. Make it yours.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center">
          <Link
            to="/pricing"
            id="hero-cta-primary"
            className="btn-accent flex items-center justify-center gap-2 !px-6 sm:!px-7 !py-3.5 sm:!py-4 text-[15px] sm:text-[16px]"
          >
            Create your first carousel
            <ArrowRight size={17} />
          </Link>
          <Link
            to="/templates"
            id="hero-cta-templates"
            className="btn-ghost alive-hero__ghost flex items-center justify-center gap-2 !px-6 sm:!px-7 !py-3.5 sm:!py-4 text-[15px] sm:text-[16px]"
          >
            Explore templates
          </Link>
        </div>
      </div>

      <div className="alive-hero__hint" aria-hidden="true">
        <span className="alive-hero__hint-dot" /> Move your cursor — every card is a real carousel
      </div>
    </section>
  );
}
