import { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// ---- TOAST SYSTEM -----------------------------------------------------------

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const COLORS = {
  success: 'text-green-400 bg-green-400/10 border-green-400/20',
  error: 'text-red-400 bg-red-400/10 border-red-400/20',
  warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  info: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const Icon = ICONS[toast.type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-fade-in ${COLORS[toast.type]}`}>
      <Icon size={15} className="flex-shrink-0" />
      <span className="text-[13px] font-medium flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity ml-1">
        <X size={13} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 min-w-[320px] max-w-[400px]">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ---- CONFIRM DIALOG ---------------------------------------------------------

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  danger = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
      <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-[17px] font-bold text-[#F7F5F0] mb-2">{title}</h3>
        <p className="text-[14px] text-[rgba(247,245,240,0.55)] mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.12)] text-[13px] font-medium text-[rgba(247,245,240,0.6)] hover:text-[rgba(247,245,240,0.9)] transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
              danger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#FF5A00] text-white hover:bg-[#e05000]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- SLIDE PREVIEW MODAL ----------------------------------------------------

interface SlideModalProps {
  open: boolean;
  slides: Array<{ src: string; label: string }>;
  currentIndex: number;
  onNavigate: (idx: number) => void;
  onClose: () => void;
}

export function SlideModal({ open, slides, currentIndex, onNavigate, onClose }: SlideModalProps) {
  if (!open || slides.length === 0) return null;
  const current = slides[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#1a1917]">
          <img src={current.src} alt={current.label} className="w-full object-contain max-h-[70vh]" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white disabled:opacity-30 transition-all"
          >
            &larr; Prev
          </button>
          <span className="text-[13px] text-white/50">{currentIndex + 1} / {slides.length}</span>
          <button
            onClick={() => onNavigate(Math.min(slides.length - 1, currentIndex + 1))}
            disabled={currentIndex === slides.length - 1}
            className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white disabled:opacity-30 transition-all"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- STAT CARD ---------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  color?: string;
  loading?: boolean;
}

export function StatCard({ label, value, sub, icon, color = '#FF5A00', loading }: StatCardProps) {
  return (
    <div className="bg-[#1a1917] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {sub && <span className="text-[10px] text-[rgba(247,245,240,0.3)] uppercase tracking-widest">{sub}</span>}
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
      ) : (
        <div>
          <p className="text-[28px] font-black tracking-[-0.03em] text-[#F7F5F0]" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>
            {value}
          </p>
          <p className="text-[12px] text-[rgba(247,245,240,0.4)] mt-0.5">{label}</p>
        </div>
      )}
    </div>
  );
}

// ---- STATUS BADGE ------------------------------------------------------------

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    published: 'bg-[rgba(34,197,94,0.12)] text-green-400 border-green-400/20',
    draft: 'bg-[rgba(255,255,255,0.06)] text-[rgba(247,245,240,0.45)] border-[rgba(255,255,255,0.08)]',
    archived: 'bg-[rgba(255,255,255,0.03)] text-[rgba(247,245,240,0.25)] border-[rgba(255,255,255,0.06)]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}

// ---- PAGE HEADER ------------------------------------------------------------

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  back?: { label: string; to: string };
}

export function PageHeader({ title, subtitle, actions, back }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {back && (
          <a href={back.to} className="flex items-center gap-1.5 text-[12px] text-[rgba(247,245,240,0.35)] hover:text-[rgba(247,245,240,0.6)] mb-2 no-underline transition-colors">
            &larr; {back.label}
          </a>
        )}
        <h1 className="text-[24px] font-bold tracking-[-0.025em] text-[#F7F5F0]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[rgba(247,245,240,0.4)] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ---- INPUT FIELD ------------------------------------------------------------

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  charCount?: { current: number; max: number };
}

export function AdminInput({ label, required, hint, error, charCount, ...props }: AdminInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] font-medium">
          {label}{required && <span className="text-[#FF5A00] ml-0.5">*</span>}
        </label>
        {charCount && (
          <span className={`text-[10px] ${charCount.current > charCount.max * 0.9 ? 'text-amber-400' : 'text-[rgba(247,245,240,0.25)]'}`}>
            {charCount.current}/{charCount.max}
          </span>
        )}
      </div>
      <input
        {...props}
        className={`w-full bg-[rgba(255,255,255,0.05)] border rounded-lg px-3 py-2.5 text-[13px] text-[rgba(247,245,240,0.85)] outline-none transition-colors placeholder:text-[rgba(247,245,240,0.2)] ${
          error
            ? 'border-red-400/50 focus:border-red-400'
            : 'border-[rgba(255,255,255,0.08)] focus:border-[#FF5A00]'
        }`}
      />
      {hint && !error && <p className="text-[11px] text-[rgba(247,245,240,0.3)] mt-1.5">{hint}</p>}
      {error && <p className="text-[11px] text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

// ---- SELECT FIELD -----------------------------------------------------------

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function AdminSelect({ label, required, hint, children, ...props }: AdminSelectProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] font-medium mb-1.5">
        {label}{required && <span className="text-[#FF5A00] ml-0.5">*</span>}
      </label>
      <select
        {...props}
        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[13px] text-[rgba(247,245,240,0.75)] outline-none focus:border-[#FF5A00] transition-colors"
      >
        {children}
      </select>
      {hint && <p className="text-[11px] text-[rgba(247,245,240,0.3)] mt-1.5">{hint}</p>}
    </div>
  );
}

// ---- TEXTAREA FIELD ---------------------------------------------------------

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  hint?: string;
}

export function AdminTextarea({ label, required, hint, ...props }: AdminTextareaProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[rgba(247,245,240,0.4)] font-medium mb-1.5">
        {label}{required && <span className="text-[#FF5A00] ml-0.5">*</span>}
      </label>
      <textarea
        {...props}
        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[13px] text-[rgba(247,245,240,0.85)] outline-none focus:border-[#FF5A00] resize-none transition-colors placeholder:text-[rgba(247,245,240,0.2)]"
      />
      {hint && <p className="text-[11px] text-[rgba(247,245,240,0.3)] mt-1.5">{hint}</p>}
    </div>
  );
}
