import { Project, Slide } from '../types';
import { getTemplateById } from './templates';
import { supabase, isSupabaseConfigured } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_PREFIX = 'swapp_projects_';

const isValidUUID = (str?: string): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

function getLocalProjects(userId: string): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalProjects(userId: string, projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to set local projects:', err);
  }
}

// ─── CREATE PROJECT FROM TEMPLATE ────────────────────────────────────────────
export function createProjectFromTemplate(
  templateId: string,
  topic?: string,
  userId?: string
): Project {
  const tpl = getTemplateById(templateId);
  const projId = uuidv4();
  const ownerId = userId || 'anonymous';

  if (!tpl) {
    return {
      id: projId,
      userId: ownerId,
      name: topic || 'Untitled Carousel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [
        {
          id: uuidv4(),
          order: 0,
          width: 1080,
          height: 1350,
          background: { type: 'solid', value: '#111111' },
          elements: [],
        },
      ],
    };
  }

  const slides: Slide[] = tpl.slides.map((s, i) => ({
    id: uuidv4(),
    order: i,
    width: s.width && s.width > 50 ? s.width : 1080,
    height: s.height && s.height > 50 ? s.height : 1350,
    background: { ...s.background },
    elements: s.elements.map(el => ({
      ...el,
      id: uuidv4(),
      properties: { ...el.properties },
    })),
  }));

  const project: Project = {
    id: projId,
    userId: ownerId,
    templateId: tpl.id,
    name: topic ? `${topic}` : tpl.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides,
  };

  return project;
}

// ─── GET USER PROJECTS ────────────────────────────────────────────────────────
export async function getUserProjects(userId?: string): Promise<Project[]> {
  if (!userId) return [];

  // Try fetching from Supabase
  if (isSupabaseConfigured && isValidUUID(userId)) {
    try {
      const { data: dbProjects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && dbProjects) {
        // Fetch slides for all projects
        const projectIds = dbProjects.map(p => p.id);
        let allSlides: Record<string, Slide[]> = {};

        if (projectIds.length > 0) {
          const { data: dbSlides } = await supabase
            .from('project_slides')
            .select('*')
            .in('project_id', projectIds)
            .order('slide_index', { ascending: true });

          if (dbSlides) {
            allSlides = dbSlides.reduce((acc, row) => {
              const slide: Slide = {
                id: row.id,
                order: row.slide_index,
                width: row.width || 1080,
                height: row.height || 1350,
                background: row.background || { type: 'solid', value: '#FFFFFF' },
                elements: row.elements || [],
              };
              if (!acc[row.project_id]) acc[row.project_id] = [];
              acc[row.project_id].push(slide);
              return acc;
            }, {} as Record<string, Slide[]>);
          }
        }

        const mapped: Project[] = dbProjects.map(p => ({
          id: p.id,
          userId: p.user_id,
          templateId: p.template_id,
          name: p.name,
          thumbnailUrl: p.thumbnail_url,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          slides: allSlides[p.id] || [],
        }));

        setLocalProjects(userId, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase projects fetch failed, fallback to local:', err);
    }
  }

  // Fallback to local user cache
  return getLocalProjects(userId);
}

// ─── GET PROJECT BY ID ────────────────────────────────────────────────────────
export async function getProjectById(
  id: string,
  userId?: string
): Promise<Project | null> {
  // First check Supabase if authenticated
  if (isSupabaseConfigured && isValidUUID(id)) {
    try {
      const { data: p, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && p) {
        // Strict Authorization Check: If user is authenticated, ensure ownership
        if (userId && p.user_id && p.user_id !== userId) {
          console.warn('Unauthorized access to project', id);
          return null;
        }

        // Fetch project slides
        const { data: dbSlides } = await supabase
          .from('project_slides')
          .select('*')
          .eq('project_id', id)
          .order('slide_index', { ascending: true });

        const slides: Slide[] = (dbSlides || []).map(row => ({
          id: row.id,
          order: row.slide_index,
          width: row.width || 1080,
          height: row.height || 1350,
          background: row.background || { type: 'solid', value: '#FFFFFF' },
          elements: row.elements || [],
        }));

        return {
          id: p.id,
          userId: p.user_id,
          templateId: p.template_id,
          name: p.name,
          thumbnailUrl: p.thumbnail_url,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          slides,
        };
      }
    } catch (err) {
      console.warn('Supabase single project fetch failed:', err);
    }
  }

  // Fallback to local storage (scoped to user)
  if (userId) {
    const userProjects = getLocalProjects(userId);
    const found = userProjects.find(p => p.id === id);
    if (found) return found;
    // Strict isolation: authenticated users cannot access other users' projects or guest projects
    return null;
  }

  // Fallback check in general user storage only for unauthenticated guests
  const guestProjects = getLocalProjects('anonymous');
  const guestFound = guestProjects.find(p => p.id === id);
  if (guestFound) return guestFound;

  return null;
}

// ─── SAVE USER PROJECT ────────────────────────────────────────────────────────
export async function saveUserProject(project: Project, userId?: string): Promise<void> {
  const effectiveUserId = userId || project.userId || 'anonymous';
  const updatedProject: Project = {
    ...project,
    userId: effectiveUserId,
    updatedAt: new Date().toISOString(),
  };

  // 1. Immediately update user-scoped local storage for responsive UI
  const existing = getLocalProjects(effectiveUserId);
  const idx = existing.findIndex(p => p.id === updatedProject.id);
  if (idx >= 0) {
    existing[idx] = updatedProject;
  } else {
    existing.unshift(updatedProject);
  }
  setLocalProjects(effectiveUserId, existing);

  // 2. Persist to Supabase if configured and valid UUIDs
  if (isSupabaseConfigured && isValidUUID(updatedProject.id) && isValidUUID(effectiveUserId)) {
    try {
      const templateIdForDb = isValidUUID(updatedProject.templateId) ? updatedProject.templateId : null;

      // Upsert project
      const { error: pErr } = await supabase.from('projects').upsert(
        {
          id: updatedProject.id,
          user_id: effectiveUserId,
          template_id: templateIdForDb,
          name: updatedProject.name,
          thumbnail_url: updatedProject.thumbnailUrl || null,
          updated_at: updatedProject.updatedAt,
        },
        { onConflict: 'id' }
      );

      if (pErr) throw pErr;

      // Upsert slides if present
      if (updatedProject.slides && updatedProject.slides.length > 0) {
        // Remove existing slides to keep exact indices
        await supabase.from('project_slides').delete().eq('project_id', updatedProject.id);

        const slideRows = updatedProject.slides.map((s, i) => ({
          id: isValidUUID(s.id) ? s.id : uuidv4(),
          project_id: updatedProject.id,
          slide_index: i,
          width: s.width || 1080,
          height: s.height || 1350,
          background: s.background,
          elements: s.elements,
          updated_at: updatedProject.updatedAt,
        }));

        await supabase.from('project_slides').insert(slideRows);
      }
    } catch (err) {
      console.warn('Failed to sync project to Supabase:', err);
    }
  }
}

// ─── DELETE USER PROJECT ──────────────────────────────────────────────────────
export async function deleteUserProject(id: string, userId?: string): Promise<void> {
  const effectiveUserId = userId || 'anonymous';

  // 1. Delete from local storage
  const existing = getLocalProjects(effectiveUserId).filter(p => p.id !== id);
  setLocalProjects(effectiveUserId, existing);

  // 2. Delete from Supabase
  if (isSupabaseConfigured && isValidUUID(id)) {
    try {
      await supabase.from('project_slides').delete().eq('project_id', id);
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to delete project from Supabase:', err);
    }
  }
}
