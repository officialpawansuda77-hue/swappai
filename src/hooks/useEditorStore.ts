import { useState, useCallback, useRef } from 'react';
import { Project, Slide, CanvasElement, EditorState } from '../types';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

export function useEditorStore(initialProject: Project | null = null) {
  const [state, setState] = useState<EditorState>({
    project: initialProject,
    currentSlideIndex: 0,
    selectedElementId: null,
    history: initialProject ? [initialProject] : [],
    historyIndex: 0,
    saveStatus: 'saved',
    isPreviewMode: false,
  });

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushHistory = useCallback((project: Project) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(project);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        ...prev,
        project,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        project: prev.history[newIndex],
        historyIndex: newIndex,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        project: prev.history[newIndex],
        historyIndex: newIndex,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const setCurrentSlide = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentSlideIndex: index, selectedElementId: null }));
  }, []);

  const setSelectedElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const updateElement = useCallback((slideIndex: number, elementId: string, updates: Partial<CanvasElement>) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlides = prev.project.slides.map((slide, i) => {
        if (i !== slideIndex) return slide;
        return {
          ...slide,
          elements: slide.elements.map(el =>
            el.id === elementId ? { ...el, ...updates } : el
          ),
        };
      });
      const newProject = { ...prev.project, slides: newSlides, updatedAt: new Date().toISOString() };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const addElement = useCallback((slideIndex: number, element: CanvasElement) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlides = prev.project.slides.map((slide, i) => {
        if (i !== slideIndex) return slide;
        return { ...slide, elements: [...slide.elements, element] };
      });
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElementId: element.id,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const deleteElement = useCallback((slideIndex: number, elementId: string) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlides = prev.project.slides.map((slide, i) => {
        if (i !== slideIndex) return slide;
        return { ...slide, elements: slide.elements.filter(el => el.id !== elementId) };
      });
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElementId: null,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const addSlide = useCallback((afterIndex: number) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlide: Slide = {
        id: uuidv4(),
        order: afterIndex + 1,
        width: 1080,
        height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [],
      };
      const newSlides = [
        ...prev.project.slides.slice(0, afterIndex + 1),
        newSlide,
        ...prev.project.slides.slice(afterIndex + 1).map((s, i) => ({ ...s, order: afterIndex + 2 + i })),
      ];
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        currentSlideIndex: afterIndex + 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const duplicateSlide = useCallback((slideIndex: number) => {
    setState(prev => {
      if (!prev.project) return prev;
      const orig = prev.project.slides[slideIndex];
      const dup: Slide = {
        ...orig,
        id: uuidv4(),
        order: slideIndex + 1,
        elements: orig.elements.map(el => ({ ...el, id: uuidv4() })),
      };
      const newSlides = [
        ...prev.project.slides.slice(0, slideIndex + 1),
        dup,
        ...prev.project.slides.slice(slideIndex + 1).map((s, i) => ({ ...s, order: slideIndex + 2 + i })),
      ];
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        currentSlideIndex: slideIndex + 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const deleteSlide = useCallback((slideIndex: number) => {
    setState(prev => {
      if (!prev.project || prev.project.slides.length <= 1) return prev;
      const newSlides = prev.project.slides
        .filter((_, i) => i !== slideIndex)
        .map((s, i) => ({ ...s, order: i }));
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      const newSlideIndex = Math.min(slideIndex, newSlides.length - 1);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        currentSlideIndex: newSlideIndex,
        selectedElementId: null,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const updateSlideBackground = useCallback((slideIndex: number, background: Slide['background']) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlides = prev.project.slides.map((s, i) =>
        i === slideIndex ? { ...s, background } : s
      );
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const updateAllSlidesBackground = useCallback((background: Slide['background']) => {
    setState(prev => {
      if (!prev.project) return prev;
      const newSlides = prev.project.slides.map(s => ({ ...s, background }));
      const newProject = { ...prev.project, slides: newSlides };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const bringForward = useCallback((slideIndex: number, elementId: string) => {
    setState(prev => {
      if (!prev.project) return prev;
      const slide = prev.project.slides[slideIndex];
      if (!slide) return prev;
      const el = slide.elements.find(e => e.id === elementId);
      if (!el) return prev;
      const maxZ = Math.max(...slide.elements.map(e => e.zIndex), 0);
      const newSlides = prev.project.slides.map((s, i) =>
        i === slideIndex
          ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, zIndex: maxZ + 1 } : e) }
          : s
      );
      const newProject = { ...prev.project, slides: newSlides };
      return { ...prev, project: newProject, saveStatus: 'unsaved' };
    });
  }, []);

  const sendBackward = useCallback((slideIndex: number, elementId: string) => {
    setState(prev => {
      if (!prev.project) return prev;
      const slide = prev.project.slides[slideIndex];
      if (!slide) return prev;
      const el = slide.elements.find(e => e.id === elementId);
      if (!el) return prev;
      const minZ = Math.min(...slide.elements.map(e => e.zIndex), 0);
      const newSlides = prev.project.slides.map((s, i) =>
        i === slideIndex
          ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, zIndex: Math.max(0, minZ - 1) } : e) }
          : s
      );
      const newProject = { ...prev.project, slides: newSlides };
      return { ...prev, project: newProject, saveStatus: 'unsaved' };
    });
  }, []);

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      if (!prev.project) return prev;
      const slides = [...prev.project.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(toIndex, 0, moved);
      const reordered = slides.map((s, i) => ({ ...s, order: i }));
      const newProject = { ...prev.project, slides: reordered };
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newProject);
      return {
        ...prev,
        project: newProject,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        currentSlideIndex: toIndex,
        saveStatus: 'unsaved',
      };
    });
  }, []);

  const setProject = useCallback((project: Project | null) => {
    setState({
      project,
      currentSlideIndex: 0,
      selectedElementId: null,
      history: project ? [project] : [],
      historyIndex: 0,
      saveStatus: 'saved',
      isPreviewMode: false,
    });
  }, []);

  const setSaveStatus = useCallback((status: EditorState['saveStatus']) => {
    setState(prev => ({ ...prev, saveStatus: status }));
  }, []);

  const togglePreviewMode = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode, selectedElementId: null }));
  }, []);

  return {
    state,
    undo,
    redo,
    setCurrentSlide,
    setSelectedElement,
    updateElement,
    addElement,
    deleteElement,
    addSlide,
    duplicateSlide,
    deleteSlide,
    updateSlideBackground,
    updateAllSlidesBackground,
    bringForward,
    sendBackward,
    reorderSlides,
    setProject,
    setSaveStatus,
    togglePreviewMode,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    currentSlide: state.project?.slides[state.currentSlideIndex] || null,
    selectedElement: state.project?.slides[state.currentSlideIndex]?.elements.find(
      el => el.id === state.selectedElementId
    ) || null,
  };
}
