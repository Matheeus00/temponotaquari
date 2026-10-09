import { useEffect, useState } from 'react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 0);

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      className="back-to-top"
      type="button"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      hidden={!visible}
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m6 14 6-6 6 6M12 8v12" />
      </svg>
    </button>
  );
};
