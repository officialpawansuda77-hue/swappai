import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  selector: string = '.animate-on-scroll',
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [selector, options]);
}

export function useScrollAnimation() {
  useEffect(() => {
    const selector = '.animate-on-scroll';
    const elements = document.querySelectorAll(selector);

    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.02, rootMargin: '120px 0px 120px 0px' }
    );

    elements.forEach(el => {
      // Immediately reveal elements already near or within the viewport (especially Hero)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}
