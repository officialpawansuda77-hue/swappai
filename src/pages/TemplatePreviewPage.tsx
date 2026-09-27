import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/marketing/Navbar';
import Footer from '../components/marketing/Footer';
import SlidePreview from '../components/templates/SlidePreview';
import { getTemplateById, getPublishedTemplates, getTemplateByIdAsync } from '../lib/templates';

export default function TemplatePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [template, setTemplate] = useState(() => getTemplateById(id || ''));
  const [loading, setLoading] = useState(!template);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) {
      const syncTpl = getTemplateById(id);
      if (syncTpl) {
        setTemplate(syncTpl);
        setLoading(false);
      } else {
        setLoading(true);
        getTemplateByIdAsync(id).then(res => {
          if (res) setTemplate(res);
          setLoading(false);
        });
      }
    }
  }, [id]);

  const similar = getPublishedTemplates().filter(t => t.id !== id && t.category === template?.category).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] text-[#6B6B67] mb-4">Template not found</p>
          <Link to="/templates" className="btn-primary">Browse templates</Link>
        </div>
      </div>
    );
  }

  const slide = template.slides[currentSlide];
  const previewScale = 0.38;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <Navbar />
      <div className="pt-[64px]">
        <div className="container-wide py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-10">
            <Link to="/templates" className="text-[13px] text-[#6B6B67] hover:text-[#111111] transition-colors no-underline">
              Templates
            </Link>
            <span className="text-[#6B6B67]">/</span>
            <span className="text-[13px] text-[#111111] font-medium">{template.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">
            {/* Slide viewer */}
            <div>
              {/* Main slide */}
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: 1080 * previewScale, height: 1350 * previewScale }}>
                  {slide && <SlidePreview slide={slide} scale={previewScale} />}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="w-10 h-10 rounded-full border border-[rgba(17,17,17,0.15)] flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-[14px] font-medium text-[#6B6B67]">
                  {currentSlide + 1} / {template.slides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide(Math.min(template.slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === template.slides.length - 1}
                  className="w-10 h-10 rounded-full border border-[rgba(17,17,17,0.15)] flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 justify-center flex-wrap">
                {template.slides.map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentSlide ? 'border-[#FF5A00]' : 'border-transparent hover:border-[rgba(17,17,17,0.2)]'
                    }`}
                    style={{ width: 60, height: 75 }}
                  >
                    <SlidePreview slide={s} scale={60 / 1080} />
                  </div>
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:sticky lg:top-20">
              <div className="flex items-start justify-between mb-2">
                <span className="tag tag-accent">{template.category}</span>
                {template.isTrending && <span className="tag tag-dark">Trending</span>}
              </div>
              <h1 className="text-[32px] font-bold tracking-[-0.02em] leading-tight mb-4 mt-3">
                {template.name}
              </h1>
              <p className="text-[16px] text-[#6B6B67] leading-relaxed mb-6">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Slides', value: template.slideCount },
                  { label: 'Aspect ratio', value: template.aspectRatio },
                  { label: 'Width', value: `${template.width}px` },
                  { label: 'Category', value: template.category },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-xl p-4 border border-[rgba(17,17,17,0.06)]">
                    <p className="text-[11px] uppercase tracking-wider text-[#6B6B67] mb-1">{item.label}</p>
                    <p className="text-[15px] font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const hasAdmin = typeof window !== 'undefined' && !!localStorage.getItem('swapp_admin_session');
                    if (!user && !profile && !hasAdmin) {
                      navigate('/pricing', { state: { from: `/editor/new?template=${template.id}` } });
                    } else {
                      navigate(`/editor/new?template=${template.id}`);
                    }
                  }}
                  className="btn-accent flex items-center justify-center gap-2 w-full !py-4 text-[15px]"
                >
                  Open in Canvas
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`btn-ghost w-full flex items-center justify-center gap-2 ${saved ? 'border-[#FF5A00] text-[#FF5A00]' : ''}`}
                >
                  <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save Template'}
                </button>
              </div>

              {/* Tags */}
              {template.tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-wider text-[#6B6B67] mb-3">Tags</p>
                  <div className="flex gap-2 flex-wrap">
                    {template.tags.map(tag => (
                      <span key={tag} className="tag tag-dark capitalize">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar templates */}
          {similar.length > 0 && (
            <div className="mt-20">
              <h2 className="text-[28px] font-bold tracking-[-0.02em] mb-8">More like this</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {similar.map(t => (
                  <Link key={t.id} to={`/templates/${t.id}`} className="no-underline">
                    <div className="template-card">
                      <div style={{ aspectRatio: '4/5' }} className="overflow-hidden">
                        <SlidePreview slide={t.slides[0]} scale={300 / 1080} style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div className="p-4">
                        <p className="text-[13px] font-semibold text-[#111111] mb-1">{t.name}</p>
                        <p className="text-[12px] text-[#6B6B67]">{t.slideCount} slides · {t.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
