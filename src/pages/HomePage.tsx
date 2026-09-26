import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import FAQSection from '../components/marketing/FAQSection';
import TemplateCard from '../components/templates/TemplateCard';
import SlidePreview from '../components/templates/SlidePreview';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getPublishedTemplates, getTemplatesByCategory } from '../lib/templates';
import { PLANS } from '../lib/subscription';
import { Template } from '../types';

// ---- STATS STRIP ------------------------------------------------------------
function StatsStrip() {
  const stats = [
    { value: '100%', label: 'Editable Canvas Elements' },
    { value: '1080×1350', label: 'Optimized 4:5 Aspect Ratio' },
    { value: 'HD Export', label: 'PNG, JPG & PDF Formats' },
    { value: 'Cloud Sync', label: 'Instant Cloud Autosave' },
  ];
  return (
    <div className="border-y border-[rgba(17,17,17,0.08)] py-10">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center animate-on-scroll" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- REAL CAROUSEL DATA -----------------------------------------------------
interface RealCarousel {
  id: string;
  title: string;
  author: string;
  slides: string[];
}

const REAL_CAROUSELS: RealCarousel[] = [
  {
    id: 'c1',
    title: 'The Art of Viral Carousels',
    author: '@marketingharry',
    slides: [
      '/carousels/c1/slide1.png',
      '/carousels/c1/slide2.png',
      '/carousels/c1/slide3.png',
      '/carousels/c1/slide4.png',
      '/carousels/c1/slide5.png',
    ],
  },
];

// ---- HERO CAROUSEL DECK - real images, interactive stacked cards ------------
function HeroCarouselDeck() {
  const carousel = REAL_CAROUSELS[0];
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setActiveSlide(idx);
    setTimeout(() => setAnimating(false), 420);
  };

  const next = () => goTo((activeSlide + 1) % carousel.slides.length);
  const prev = () => goTo((activeSlide - 1 + carousel.slides.length) % carousel.slides.length);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carousel.slides.length);
    }, 3400);
  };

  useEffect(() => {
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  // Compute card transform based on distance from active
  const getCardStyle = (idx: number): React.CSSProperties => {
    const total = carousel.slides.length;
    let offset = ((idx - activeSlide) % total + total) % total;
    if (offset > total / 2) offset -= total; // -2,-1,0,1,2
    const absOff = Math.abs(offset);
    if (absOff > 2) return { display: 'none' };

    const sign = offset >= 0 ? 1 : -1;

    const map: Record<number, React.CSSProperties> = {
      0: {
        transform: 'translateX(0px) rotate(0deg) scale(1)',
        zIndex: 10,
        opacity: 1,
        boxShadow: '0 40px 90px rgba(0,0,0,0.22), 0 10px 28px rgba(0,0,0,0.14)',
        filter: 'none',
      },
      1: {
        transform: `translateX(${sign * 88}px) rotate(${sign * 6}deg) scale(0.87)`,
        zIndex: 6,
        opacity: 0.80,
        boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
        filter: 'brightness(0.96)',
      },
      2: {
        transform: `translateX(${sign * 152}px) rotate(${sign * 11}deg) scale(0.74)`,
        zIndex: 3,
        opacity: 0.50,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        filter: 'brightness(0.92)',
      },
    };
    return map[absOff] || {};
  };

  const CARD_W = 248;
  const CARD_H = 310;

  return (
    <div
      className="relative flex flex-col items-center justify-start"
      style={{ height: 540 }}
    >
      {/* Decorative ring behind active card */}
      <div
        className="absolute"
        style={{
          width: CARD_W + 32,
          height: CARD_H + 32,
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(255,90,0,0.10) 0%, rgba(255,90,0,0.03) 100%)',
          border: '1.5px solid rgba(255,90,0,0.12)',
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />

      {/* Card stack */}
      <div className="relative" style={{ width: CARD_W, height: CARD_H, marginTop: 16 }}>
        {carousel.slides.map((src, idx) => (
          <div
            key={idx}
            onClick={() => { if (idx !== activeSlide) { goTo(idx); resetAuto(); } }}
            style={{
              position: 'absolute',
              width: CARD_W,
              height: CARD_H,
              borderRadius: 18,
              overflow: 'hidden',
              transition: 'transform 0.42s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease, box-shadow 0.4s ease',
              cursor: idx === activeSlide ? 'default' : 'pointer',
              willChange: 'transform',
              ...getCardStyle(idx),
            }}
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-5 mt-12 relative z-20">
        <button
          onClick={() => { prev(); resetAuto(); }}
          className="w-9 h-9 rounded-full bg-white border border-[rgba(17,17,17,0.12)] shadow-sm flex items-center justify-center hover:border-[rgba(17,17,17,0.25)] hover:shadow-md transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} className="text-[#111111]" />
        </button>

        {/* Pill dots */}
        <div className="flex gap-1.5 items-center">
          {carousel.slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { goTo(idx); resetAuto(); }}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === activeSlide ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: idx === activeSlide ? '#FF5A00' : 'rgba(17,17,17,0.16)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => { next(); resetAuto(); }}
          className="w-9 h-9 rounded-full bg-white border border-[rgba(17,17,17,0.12)] shadow-sm flex items-center justify-center hover:border-[rgba(17,17,17,0.25)] hover:shadow-md transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={16} className="text-[#111111]" />
        </button>
      </div>

      {/* Counter + title */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-[12px] font-semibold text-[#FF5A00]">
          {String(activeSlide + 1).padStart(2, '0')}
        </span>
        <div className="w-20 h-px bg-[rgba(17,17,17,0.12)] relative overflow-hidden rounded">
          <div
            className="absolute top-0 left-0 h-full bg-[#FF5A00] rounded transition-all duration-300"
            style={{ width: `${((activeSlide + 1) / carousel.slides.length) * 100}%` }}
          />
        </div>
        <span className="text-[12px] font-semibold text-[rgba(17,17,17,0.3)]">
          {String(carousel.slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Author badge */}
      <div
        className="absolute top-0 right-[-12px] flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(17,17,17,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
        <span className="text-[11px] font-semibold text-[#111111]">{carousel.author}</span>
      </div>
    </div>
  );
}

// ---- TEMPLATE SHOWCASE (horizontal scroll) ----------------------------------
function TemplateShowcase() {
  const templates = getPublishedTemplates();
  const categories = ['All', 'Trending', 'New', 'AI', 'Business', 'Marketing', 'Education', 'Creator', 'Finance', 'Productivity'];
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = getTemplatesByCategory(activeCategory);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section className="section-spacing bg-white">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3">
          <span className="text-eyebrow">Built for real content</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h2 className="text-section animate-on-scroll animate-on-scroll-delay-1">
            Start with a structure<br />worth remixing.
          </h2>
          <Link to="/templates" className="btn-ghost btn-sm shrink-0 self-start md:self-auto animate-on-scroll animate-on-scroll-delay-2">
            Browse all templates &rarr;
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap mb-8 animate-on-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <div ref={scrollRef} className="horizontal-scroll flex gap-5 pb-4">
            {filtered.map(t => (
              <div key={t.id} style={{ width: 220, flexShrink: 0 }}>
                <TemplateCard template={t} />
              </div>
            ))}
          </div>
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-md border border-[rgba(17,17,17,0.08)] flex items-center justify-center hover:shadow-lg transition-all z-10 hidden md:flex">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-md border border-[rgba(17,17,17,0.08)] flex items-center justify-center hover:shadow-lg transition-all z-10 hidden md:flex">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ---- FEATURED TEMPLATE -------------------------------------------------------
function FeaturedTemplate() {
  const template = getPublishedTemplates()[0];
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!template) return null;
  const slide = template.slides[currentSlide];
  const scale = 0.35;

  return (
    <section className="section-spacing bg-[#F7F5F0]">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3">
          <span className="text-eyebrow">Template showcase</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-section mb-4">{template.name}</h2>
            <p className="text-body-lg mb-2">{template.slideCount} slides &middot; {template.category}</p>
            <p className="text-[17px] text-[#6B6B67] mb-8 leading-relaxed">{template.description}</p>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {template.slides.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => setCurrentSlide(i)}
                  className={`slide-thumb ${i === currentSlide ? 'active' : ''}`}
                  style={{ width: 54, height: 68, flexShrink: 0 }}
                >
                  <SlidePreview slide={s} scale={54 / 1080} />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                className="w-10 h-10 rounded-full border border-[rgba(17,17,17,0.15)] flex items-center justify-center hover:border-[#111111] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[13px] text-[#6B6B67]">{currentSlide + 1} / {template.slides.length}</span>
              <button
                onClick={() => setCurrentSlide(Math.min(template.slides.length - 1, currentSlide + 1))}
                className="w-10 h-10 rounded-full border border-[rgba(17,17,17,0.15)] flex items-center justify-center hover:border-[#111111] transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link to={`/editor/new?template=${template.id}`} className="btn-primary flex items-center gap-2 w-fit">
              Open in Canvas
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex justify-center animate-on-scroll animate-on-scroll-delay-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: 1080 * scale, height: 1350 * scale }}>
              {slide && <SlidePreview slide={slide} scale={scale} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- HOW IT WORKS -----------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Find a structure',
      body: 'Browse professionally designed carousel structures for different content styles and audiences.',
    },
    {
      number: '02',
      title: 'Swap the content',
      body: 'Open the canvas. Replace topic, copy, images and branding. Keep the design. Make it yours.',
    },
    {
      number: '03',
      title: 'Publish',
      body: 'Export as PNG, JPG or PDF. One slide or all. Ready to post in minutes.',
    },
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-white">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3 text-center">
          <span className="text-eyebrow">The process</span>
        </div>
        <h2 className="text-section text-center mb-20 animate-on-scroll">
          Three steps.<br />Your carousel.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className={`animate-on-scroll animate-on-scroll-delay-${i + 1}`}>
              <div className="step-number mb-2">{step.number}</div>
              <div className="h-px bg-[rgba(17,17,17,0.1)] mb-8" />
              <h3 className="text-[28px] font-bold tracking-[-0.02em] mb-4">{step.title}</h3>
              <p className="text-[17px] text-[#6B6B67] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- SWAP CONCEPT -----------------------------------------------------------
function SwapConcept() {
  const templates = getPublishedTemplates();
  const original = templates[0];
  const remixed = templates[1];

  if (!original || !remixed) return null;

  const scale = 0.28;

  return (
    <section className="section-spacing bg-[#F7F5F0]">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3">
          <span className="text-eyebrow">Swap the boring part</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-section mb-6">
              Keep the design.<br />Change everything else.
            </h2>
            <p className="text-body-lg mb-8">
              Same proven layout. Different topic, different copy, different images, different brand.
              That is the SWAP. That is the whole point.
            </p>
            <div className="flex flex-col gap-4">
              {['Topic', 'Copy', 'Images', 'Hooks', 'Brand', 'Tone'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5A00] flex items-center justify-center flex-shrink-0">
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </div>
                  <span className="text-[16px] font-medium">{item} &mdash; swappable</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 justify-center items-start animate-on-scroll animate-on-scroll-delay-2">
            <div className="flex-1 flex flex-col items-center gap-3">
              <span className="text-eyebrow">Template</span>
              <div className="rounded-xl overflow-hidden shadow-lg" style={{ width: 1080 * scale, height: 1350 * scale }}>
                <SlidePreview slide={original.slides[0]} scale={scale} />
              </div>
            </div>
            <div className="flex items-center self-center">
              <div className="text-2xl font-black text-[#FF5A00]">&rarr;</div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3">
              <span className="text-eyebrow">Your version</span>
              <div className="rounded-xl overflow-hidden shadow-lg" style={{ width: 1080 * scale, height: 1350 * scale }}>
                <SlidePreview slide={remixed.slides[0]} scale={scale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- CANVAS SECTION ---------------------------------------------------------
function CanvasSection() {
  return (
    <section id="features" className="section-spacing bg-white">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3">
          <span className="text-eyebrow">Your canvas</span>
        </div>
        <h2 className="text-section mb-6 animate-on-scroll">Every slide is yours.</h2>
        <p className="text-body-lg mb-16 max-w-xl animate-on-scroll animate-on-scroll-delay-1">
          A full canvas editor - not a form, not a template filler. Move, resize, rewrite, replace.
          Every element on every slide is independently editable.
        </p>

        <div
          className="rounded-2xl overflow-hidden border border-[rgba(17,17,17,0.08)] shadow-2xl animate-on-scroll"
          style={{ background: '#1a1917' }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)]" style={{ background: '#111110' }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.12)]" />
                <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.12)]" />
                <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.12)]" />
              </div>
              <span className="text-[13px] text-[rgba(247,245,240,0.5)] font-medium ml-3">7 AI Tools Every Creator Needs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[rgba(247,245,240,0.3)] uppercase tracking-widest">Saved</span>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.08)]" />
              <button className="btn-accent btn-sm !py-1.5 !px-4 !text-[12px]">Export</button>
            </div>
          </div>

          <div className="grid grid-cols-[180px_1fr_200px] min-h-[480px]">
            <div className="border-r border-[rgba(255,255,255,0.06)] p-3 flex flex-col gap-2">
              {['Templates', 'Text', 'Uploads', 'Elements', 'Background', 'Brand Kit'].map((tool, i) => (
                <button
                  key={tool}
                  className={`text-left px-3 py-2.5 rounded-lg text-[12px] font-medium transition-colors ${
                    i === 1
                      ? 'bg-[rgba(255,90,0,0.15)] text-[#FF5A00]'
                      : 'text-[rgba(247,245,240,0.45)] hover:text-[rgba(247,245,240,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  {tool}
                </button>
              ))}
              <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-4">
                <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.25)] mb-2 px-1">Slides</p>
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <div
                    key={n}
                    className={`h-[46px] rounded-lg mb-1.5 flex items-center justify-center text-[11px] font-medium ${
                      n === 1
                        ? 'bg-[#FF5A00] text-white'
                        : 'bg-[rgba(255,255,255,0.04)] text-[rgba(247,245,240,0.3)]'
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center p-8" style={{
              background: '#2a2825',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}>
              <div className="rounded-xl overflow-hidden shadow-2xl" style={{ width: 220, height: 275, background: '#111111', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: 0, width: 2, height: 40, background: '#FF5A00' }} />
                <div style={{ position: 'absolute', left: 24, top: 12, width: '70%', height: 56, background: 'rgba(247,245,240,0.9)', borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: 24, top: 76, width: '85%', height: 56, background: 'rgba(247,245,240,0.8)', borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: 24, top: 148, width: '60%', height: 14, background: 'rgba(247,245,240,0.2)', borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 24, top: 168, width: '75%', height: 14, background: 'rgba(247,245,240,0.2)', borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 24, top: 188, width: '55%', height: 14, background: 'rgba(247,245,240,0.2)', borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 20, top: 8, width: '74%', height: 64, border: '2px solid #FF5A00', borderRadius: 4, pointerEvents: 'none' }} />
              </div>
            </div>

            <div className="border-l border-[rgba(255,255,255,0.06)] p-4" style={{ background: '#1a1917' }}>
              <p className="text-[10px] uppercase tracking-widest text-[rgba(247,245,240,0.3)] mb-4">Text Properties</p>
              {[
                { label: 'Font', value: 'Inter' },
                { label: 'Size', value: '96px' },
                { label: 'Weight', value: '800' },
                { label: 'Color', value: '#F7F5F0' },
                { label: 'Align', value: 'Left' },
              ].map(prop => (
                <div key={prop.label} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-[11px] text-[rgba(247,245,240,0.35)]">{prop.label}</span>
                  <span className="text-[12px] font-medium text-[rgba(247,245,240,0.7)]">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- AI REMIX ---------------------------------------------------------------
function AIRemixSection() {
  return (
    <section className="section-spacing bg-[#F7F5F0]">
      <div className="container-wide">
        <div className="animate-on-scroll mb-3">
          <span className="text-eyebrow">AI Remix</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-section mb-6">Your idea in.<br />A carousel out.</h2>
            <p className="text-body-lg mb-8">
              Tell the AI what you want to post about. Choose your tone and audience.
              Get a complete, editable carousel, not a flattened image, a full document.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[rgba(17,17,17,0.08)] p-8 shadow-lg animate-on-scroll animate-on-scroll-delay-2">
            <p className="text-[12px] uppercase tracking-widest text-[#6B6B67] mb-3">Topic</p>
            <div className="border border-[rgba(17,17,17,0.12)] rounded-xl p-4 mb-6 bg-[#F7F5F0]">
              <p className="text-[16px] font-medium text-[#111111]">7 AI tools for small businesses</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Tone', value: 'Educational' },
                { label: 'Audience', value: 'Business' },
                { label: 'Slides', value: '7' },
                { label: 'CTA', value: 'Save this' },
              ].map(opt => (
                <div key={opt.label}>
                  <p className="text-[11px] uppercase tracking-wider text-[#6B6B67] mb-1.5">{opt.label}</p>
                  <div className="border border-[rgba(17,17,17,0.12)] rounded-lg px-3 py-2 text-[14px] font-medium">{opt.value}</div>
                </div>
              ))}
            </div>
            <Link to="/pricing" className="btn-accent w-full flex items-center justify-center gap-2">
              Generate carousel
              <ArrowRight size={15} />
            </Link>
            <p className="text-center text-[12px] text-[#6B6B67] mt-3">Generates editable slides, not images</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- PRICING ----------------------------------------------------------------
function PricingSection() {
  const plans = [
    {
      ...PLANS.starter,
      featured: false,
    },
    {
      ...PLANS.creator,
      featured: true,
    },
    {
      ...PLANS.studio,
      featured: false,
    },
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="container-wide">
        <div className="text-center mb-3 animate-on-scroll">
          <span className="text-eyebrow">Simple pricing</span>
        </div>
        <h2 className="text-section text-center mb-4 animate-on-scroll">
          Create more.<br />Design less.
        </h2>
        <p className="text-body-lg text-center mb-16 animate-on-scroll">Start free. Upgrade when SWAPP becomes part of your publishing rhythm.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={plan.id} className={`pricing-card animate-on-scroll animate-on-scroll-delay-${i + 1} ${plan.featured ? 'featured' : ''}`}>
              <p className={`text-[12px] uppercase tracking-widest font-semibold mb-3 ${plan.featured ? 'text-[rgba(247,245,240,0.5)]' : 'text-[#6B6B67]'}`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-[40px] font-black tracking-[-0.03em] ${plan.featured ? 'text-[#F7F5F0]' : 'text-[#111111]'}`} style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>
                  {plan.priceFormatted}
                </span>
                <span className={`text-[14px] ${plan.featured ? 'text-[rgba(247,245,240,0.5)]' : 'text-[#6B6B67]'}`}>{plan.period}</span>
              </div>
              <p className={`text-[13px] mb-4 ${plan.featured ? 'text-[rgba(247,245,240,0.65)]' : 'text-[#6B6B67]'}`}>
                {plan.description}
              </p>
              <div className={`h-px my-6 ${plan.featured ? 'bg-[rgba(247,245,240,0.1)]' : 'bg-[rgba(17,17,17,0.08)]'}`} />
              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={14} strokeWidth={2.5} className="text-[#FF5A00] mt-0.5 flex-shrink-0" />
                    <span className={`text-[14px] ${plan.featured ? 'text-[rgba(247,245,240,0.75)]' : 'text-[#6B6B67]'}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className={`w-full flex items-center justify-center py-3 rounded-lg text-[14px] font-semibold transition-all ${
                  plan.featured
                    ? 'bg-[#FF5A00] text-white hover:bg-[#e05000]'
                    : 'border border-[rgba(17,17,17,0.15)] text-[#111111] hover:border-[#111111]'
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- FINAL CTA --------------------------------------------------------------
function FinalCTA() {
  return (
    <section className="section-dark section-spacing">
      <div className="container-narrow text-center">
        <div className="animate-on-scroll mb-6">
          <span className="text-eyebrow">Get started</span>
        </div>
        <h2
          className="animate-on-scroll"
          style={{ fontSize: 'clamp(40px,6vw,80px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, color: '#F7F5F0', marginBottom: 24 }}
        >
          Your next carousel is<br />already halfway designed.
        </h2>
        <p className="animate-on-scroll text-[18px] mb-12" style={{ color: 'rgba(247,245,240,0.55)' }}>
          Start with a structure. Make it yours.
        </p>
        <Link to="/pricing" className="btn-accent animate-on-scroll flex items-center gap-2 w-fit mx-auto text-[16px] px-8 py-4">
          Create your first carousel
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

// ---- MAIN PAGE --------------------------------------------------------------
export default function HomePage() {
  useScrollAnimation();
  const templates = getPublishedTemplates();

  return (
    <div className="bg-[#F7F5F0]">
      <Navbar />

      {/* Hero */}
      <section className="pt-[64px]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-64px)] py-16">
            {/* Left copy */}
            <div>
              <div className="animate-on-scroll mb-6">
                <span className="text-eyebrow">The carousel workspace</span>
              </div>
              <h1 className="text-hero mb-8 animate-on-scroll animate-on-scroll-delay-1">
                Make carousels<br />worth swiping.
              </h1>
              <p className="text-[20px] text-[#6B6B67] leading-relaxed mb-4 max-w-lg animate-on-scroll animate-on-scroll-delay-2">
                Start with a proven structure. Swap the content. Make it yours.
              </p>
              <p className="text-[17px] text-[#6B6B67] leading-relaxed mb-10 max-w-lg animate-on-scroll animate-on-scroll-delay-2">
                Professionally structured carousel templates and a powerful canvas to turn them into
                your own content in minutes.
              </p>
              <div className="flex flex-wrap gap-4 animate-on-scroll animate-on-scroll-delay-3">
                <Link to="/pricing" className="btn-accent flex items-center gap-2 !px-7 !py-4 text-[16px]">
                  Create your first carousel
                  <ArrowRight size={17} />
                </Link>
                <Link to="/templates" className="btn-ghost flex items-center gap-2 !px-7 !py-4 text-[16px]">
                  Explore templates
                </Link>
              </div>
            </div>

            {/* Right: real carousel deck */}
            <div className="hidden lg:flex items-center justify-center animate-on-scroll animate-on-scroll-delay-2">
              <HeroCarouselDeck />
            </div>
          </div>
        </div>
      </section>

      <StatsStrip />
      <TemplateShowcase />
      <FeaturedTemplate />
      <SwapConcept />
      <CanvasSection />
      <AIRemixSection />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
