import { useEffect, useRef, useState, type ReactNode } from 'react';
import './DismissibleDetails.css';

interface DismissibleDetailsProps {
  className: string;
  summary: string;
  children: ReactNode;
}

export const DismissibleDetails = ({
  className,
  summary,
  children,
}: DismissibleDetailsProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const positionContent = () => {
      const details = detailsRef.current;
      const summary = details?.querySelector('summary');
      const content = details?.querySelector<HTMLElement>(':scope > :not(summary)');
      if (!details || !summary || !content) {
        return;
      }

      const summaryRect = summary.getBoundingClientRect();
      const spaceAbove = summaryRect.top;
      const spaceBelow = window.innerHeight - summaryRect.bottom;
      const contentHeight = content.scrollHeight;
      const maxContentHeight = Math.min(window.innerHeight * 0.65, 460);
      const requiredHeight = Math.min(contentHeight, maxContentHeight) + 16;
      const side = spaceBelow >= requiredHeight || spaceBelow >= spaceAbove
        ? 'below'
        : 'above';
      const availableHeight = Math.max(0, (side === 'above' ? spaceAbove : spaceBelow) - 16);
      const contentWidth = Math.min(content.getBoundingClientRect().width, window.innerWidth - 16);
      const left = Math.min(
        Math.max(8, summaryRect.left),
        Math.max(8, window.innerWidth - contentWidth - 8),
      );

      details.dataset.side = side;
      details.style.setProperty('--dialog-left', `${left}px`);
      details.style.setProperty('--dialog-width', `${contentWidth}px`);
      details.style.setProperty('--dialog-max-height', `min(65vh, 460px, ${availableHeight}px)`);
      const contentRect = content.getBoundingClientRect();
      const top = side === 'above'
        ? Math.max(8, summaryRect.top - contentRect.height - 8)
        : Math.min(window.innerHeight - contentRect.height - 8, summaryRect.bottom + 8);
      details.style.setProperty('--dialog-top', `${top}px`);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && detailsRef.current?.open) {
        detailsRef.current.open = false;
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', positionContent);
    window.addEventListener('scroll', positionContent, true);
    positionContent();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', positionContent);
      window.removeEventListener('scroll', positionContent, true);
    };
  }, [isOpen]);

  return (
    <details
      ref={detailsRef}
      className={`${className} dismissible-details`}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>{summary}</summary>
      {children}
    </details>
  );
};
