import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle, X } from 'lucide-react';
import Navbar from '../components/marketing/Navbar';
import { ToneType, AudienceType, AIGenerationParams } from '../types';
import { getPublishedTemplates } from '../lib/templates';
import TemplateCard from '../components/templates/TemplateCard';
import { useAuth } from '../contexts/AuthContext';
import { canGenerateCarousel, recordCarouselGeneration } from '../lib/subscription';

const TONES: ToneType[] = ['professional', 'educational', 'bold', 'funny', 'minimal', 'storytelling'];
const AUDIENCES: AudienceType[] = ['creator', 'founder', 'marketer', 'business', 'general'];
const SLIDE_COUNTS = [5, 6, 7, 8, 10];

function generateDemoSlides(params: AIGenerationParams) {
  // Demo generation — returns template-based slides
  const templates = getPublishedTemplates();
  const match = templates.find(t =>
    params.topic.toLowerCase().includes(t.category.toLowerCase()) ||
    t.tags.some(tag => params.topic.toLowerCase().includes(tag))
  ) || templates[0];
  return match;
}

export default function CreatePage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneType>('educational');
  const [audience, setAudience] = useState<AudienceType>('creator');
  const [slideCount, setSlideCount] = useState(7);
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/pricing', { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5A00] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile && !user) {
    return null;
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    const uid = user?.id || profile?.userId || 'demo-user';
    const check = await canGenerateCarousel(uid);
    if (!check.allowed) {
      setLimitError(check.reason || "You've reached your monthly carousel limit. Upgrade your plan to continue creating.");
      return;
    }

    setLoading(true);

    // Record generation
    await recordCarouselGeneration(uid);

    // Simulate generation delay
    await new Promise(r => setTimeout(r, 1200));

    // Demo: use matched template as base
    const params: AIGenerationParams = { topic, tone, audience, slideCount };
    const tpl = generateDemoSlides(params);

    // Navigate to editor with the template
    navigate(`/editor/new?template=${tpl.id}&topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <Navbar />
      <div className="pt-[64px]">
        <div className="container-narrow py-20">
          <div className="mb-3">
            <span className="text-eyebrow">AI Carousel Generator</span>
          </div>
          <h1 className="text-[clamp(36px,5vw,60px)] font-bold tracking-[-0.025em] leading-tight mb-4">
            What do you want<br />to post about?
          </h1>
          <p className="text-body-lg mb-12">
            Enter your topic and we'll generate an editable carousel structure for you.
          </p>

          <div className="bg-white rounded-2xl border border-[rgba(17,17,17,0.08)] p-8 shadow-sm">
            {/* Topic */}
            <div className="mb-8">
              <label className="block text-[11px] uppercase tracking-widest text-[#6B6B67] mb-3">Topic</label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. 7 AI tools for small businesses..."
                className="input-field !h-24 resize-none"
                maxLength={200}
              />
              <p className="text-[12px] text-[#6B6B67] mt-1 text-right">{topic.length}/200</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Tone */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6B6B67] mb-3">Tone</label>
                <div className="flex flex-col gap-1.5">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all capitalize ${
                        tone === t
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F7F5F0] text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(17,17,17,0.06)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6B6B67] mb-3">Audience</label>
                <div className="flex flex-col gap-1.5">
                  {AUDIENCES.map(a => (
                    <button
                      key={a}
                      onClick={() => setAudience(a)}
                      className={`px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all capitalize ${
                        audience === a
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F7F5F0] text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(17,17,17,0.06)]'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide count */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6B6B67] mb-3">Slides</label>
                <div className="flex flex-col gap-1.5">
                  {SLIDE_COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => setSlideCount(n)}
                      className={`px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all ${
                        slideCount === n
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F7F5F0] text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(17,17,17,0.06)]'
                      }`}
                    >
                      {n} slides
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || loading}
              className={`btn-accent w-full flex items-center justify-center gap-2 !py-4 text-[15px] font-semibold transition-all ${
                !topic.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating carousel...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate carousel
                  <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="text-center text-[12px] text-[#6B6B67] mt-3">
              Creates fully editable slides — not flattened images
            </p>
          </div>

          {/* Or browse templates */}
          <div className="mt-10 text-center">
            <p className="text-[15px] text-[#6B6B67] mb-4">Or start from a template</p>
            <div className="flex flex-wrap justify-center gap-3">
              {getPublishedTemplates().slice(0, 4).map(t => (
                <a
                  key={t.id}
                  href={`/editor/new?template=${t.id}`}
                  className="px-4 py-2 rounded-full border border-[rgba(17,17,17,0.12)] text-[13px] font-medium text-[#6B6B67] hover:border-[#111111] hover:text-[#111111] transition-all no-underline"
                >
                  {t.name.split(' ').slice(0, 4).join(' ')}...
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generation Limit Modal */}
      {limitError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-[440px] w-full text-center relative shadow-2xl border border-[rgba(0,0,0,0.08)]">
            <button
              onClick={() => setLimitError(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B6B67] hover:text-[#111111] hover:bg-[rgba(0,0,0,0.05)]"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-[22px] font-bold mb-2">Monthly Limit Reached</h3>
            <p className="text-[14px] text-[#6B6B67] mb-6 leading-relaxed">
              {limitError}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/pricing"
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-[14px] transition-all text-center shadow-lg shadow-[#FF5A00]/25"
              >
                Upgrade Plan
              </Link>
              <button
                type="button"
                onClick={() => setLimitError(null)}
                className="w-full py-3 px-6 rounded-full border border-[rgba(17,17,17,0.15)] text-[#111111] font-semibold text-[14px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
