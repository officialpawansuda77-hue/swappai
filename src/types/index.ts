// ---- ELEMENT TYPES ---------------------------------------------------------

export type ElementType = 'text' | 'image' | 'shape' | 'icon' | 'logo';
export type ShapeType = 'rectangle' | 'circle' | 'line' | 'triangle';

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textCase?: 'none' | 'uppercase' | 'lowercase';
  textDecoration?: 'none' | 'underline';
}

export interface ImageProperties {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
  brightness?: number;
  opacity?: number;
}

export interface ShapeProperties {
  shapeType: ShapeType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export type ElementProperties = TextProperties | ImageProperties | ShapeProperties;

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  properties: ElementProperties;
}

// ---- SLIDE TYPES -----------------------------------------------------------

export interface SlideBackground {
  type: 'solid' | 'image';
  value: string;
}

export interface Slide {
  id: string;
  order: number;
  width: number;
  height: number;
  background: SlideBackground;
  elements: CanvasElement[];
  previewUrl?: string;
}

// ---- TEMPLATE TYPES --------------------------------------------------------

export type TemplateCategory =
  | 'AI' | 'Business' | 'Marketing' | 'Education' | 'Personal Brand'
  | 'Creator' | 'SaaS' | 'Finance' | 'Productivity' | 'Motivation'
  | 'Product' | 'Quotes' | 'Other';

export type TemplateStatus = 'draft' | 'published' | 'archived';
export type TemplateSourceType = 'original' | 'licensed' | 'generated' | 'reference_inspired';
export type TemplateStyle =
  | 'Minimal' | 'Editorial' | 'Bold' | 'Dark' | 'Typography'
  | 'Educational' | 'Luxury' | 'Corporate' | 'Playful' | 'Modern'
  | 'Data' | 'Personal Brand';
export type TemplateAudience =
  | 'Creators' | 'Founders' | 'Marketers' | 'Agencies' | 'Businesses'
  | 'Coaches' | 'Educators' | 'Influencers' | 'General';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  categoryId?: string;
  tags: string[];
  style?: TemplateStyle;
  audience?: TemplateAudience;
  thumbnailUrl: string;
  aspectRatio: '4:5' | '1:1' | '3:4';
  width: number;
  height: number;
  slideCount: number;
  isTrending: boolean;
  isNew: boolean;
  sourceType: TemplateSourceType;
  sourceUrl?: string;
  sourcePlatform?: string;
  attributionRequired: boolean;
  licenseNotes?: string;
  status: TemplateStatus;
  useCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  slides: Slide[];
}

// ---- ADMIN TEMPLATE FORM (for creation/editing) ----------------------------

export interface TemplateFormData {
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  style?: TemplateStyle;
  audience?: TemplateAudience;
  sourceType: TemplateSourceType;
  sourceUrl?: string;
  sourcePlatform?: string;
  attributionRequired: boolean;
  licenseNotes?: string;
  isTrending: boolean;
  isNew: boolean;
}

// ---- SLIDE UPLOAD STATE ----------------------------------------------------

export type SlideUploadStatus = 'pending' | 'uploading' | 'processing' | 'done' | 'error';

export interface SlideUploadItem {
  localId: string;
  file: File;
  previewDataUrl: string;
  status: SlideUploadStatus;
  errorMsg?: string;
  publicUrl?: string;
  storagePath?: string;
  width?: number;
  height?: number;
  slideId?: string;
  elements?: CanvasElement[];
  background?: SlideBackground;
  deconstructStatus?: 'idle' | 'deconstructing' | 'done' | 'error';
  deconstructSummary?: string;
}

// ---- PROJECT TYPES ---------------------------------------------------------

export interface Project {
  id: string;
  userId: string;
  templateId?: string;
  name: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
}

// ---- PROFILE / AUTH --------------------------------------------------------

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

// ---- ADMIN STATS -----------------------------------------------------------

export interface AdminStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  totalUses: number;
  addedThisMonth: number;
}

// ---- CATEGORY --------------------------------------------------------------

export interface TemplateCategory_DB {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ---- BRAND KIT -------------------------------------------------------------

export interface BrandKit {
  id: string;
  userId: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
}

// ---- EDITOR STATE ----------------------------------------------------------

export interface EditorState {
  project: Project | null;
  currentSlideIndex: number;
  selectedElementId: string | null;
  history: Project[];
  historyIndex: number;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isPreviewMode: boolean;
}

// ---- AI GENERATION ---------------------------------------------------------

export type ToneType = 'professional' | 'educational' | 'bold' | 'funny' | 'minimal' | 'storytelling';
export type AudienceType = 'creator' | 'founder' | 'marketer' | 'business' | 'general';

export interface AIGenerationParams {
  topic: string;
  tone: ToneType;
  audience: AudienceType;
  slideCount: number;
}

export interface GeneratedSlideContent {
  headline: string;
  body?: string;
  cta?: string;
  slideType: 'hook' | 'content' | 'tip' | 'cta' | 'cover';
}

// ---- EXPORT ----------------------------------------------------------------

export type ExportFormat = 'png' | 'jpg' | 'pdf';
export type ExportScope = 'current' | 'all';

export interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  width: number;
  height: number;
}

// ---- FAVORITES -------------------------------------------------------------

export interface Favorite {
  id: string;
  userId: string;
  templateId: string;
  createdAt: string;
}

// ---- USAGE -----------------------------------------------------------------

export interface TemplateUsageRecord {
  id: string;
  templateId: string;
  userId?: string;
  projectId?: string;
  createdAt: string;
}
