import { Project, Slide } from '../types';
import { getTemplateById } from './templates';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'swapp_user_projects';

export function createProjectFromTemplate(templateId: string, topic?: string): Project {
  const tpl = getTemplateById(templateId);
  const projId = uuidv4();
  if (!tpl) {
    return {
      id: projId,
      userId: 'demo',
      name: topic || 'Untitled Carousel',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [{
        id: uuidv4(),
        order: 0,
        width: 1080,
        height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [],
      }],
    };
  }

  const slides: Slide[] = tpl.slides.map((s, i) => ({
    id: uuidv4(),
    order: i,
    width: s.width && s.width > 50 ? s.width : 1080,
    height: s.height && s.height > 50 ? s.height : 1350,
    background: { ...s.background },
    elements: s.elements.map(el => ({ ...el, id: uuidv4(), properties: { ...el.properties } })),
  }));

  return {
    id: projId,
    userId: 'demo',
    templateId: tpl.id,
    name: topic ? `${topic}` : tpl.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides,
  };
}

function getInitialDemoProjects(): Project[] {
  const p1 = createProjectFromTemplate('tpl_01', '7 AI Tools for My Agency');
  p1.id = 'proj_01';
  p1.updatedAt = new Date(Date.now() - 3600000 * 4).toISOString();

  const p2 = createProjectFromTemplate('tpl_04', 'My Personal Brand Guide');
  p2.id = 'proj_02';
  p2.updatedAt = new Date(Date.now() - 3600000 * 28).toISOString();

  return [p1, p2];
}

export function getUserProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = getInitialDemoProjects();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const seeded = getInitialDemoProjects();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch (err) {
    console.error('Failed to load user projects:', err);
    return getInitialDemoProjects();
  }
}

export function getProjectById(id: string): Project | null {
  const projects = getUserProjects();
  const found = projects.find(p => p.id === id);
  if (found) return found;

  if (id === 'proj_01') {
    const p1 = createProjectFromTemplate('tpl_01', '7 AI Tools for My Agency');
    p1.id = 'proj_01';
    saveUserProject(p1);
    return p1;
  }
  if (id === 'proj_02') {
    const p2 = createProjectFromTemplate('tpl_04', 'My Personal Brand Guide');
    p2.id = 'proj_02';
    saveUserProject(p2);
    return p2;
  }

  return null;
}

export function saveUserProject(project: Project): void {
  try {
    const projects = getUserProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    const updated = { ...project, updatedAt: new Date().toISOString() };
    if (existingIndex >= 0) {
      projects[existingIndex] = updated;
    } else {
      projects.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save project:', err);
  }
}

export function deleteUserProject(id: string): void {
  try {
    const projects = getUserProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to delete project:', err);
  }
}
