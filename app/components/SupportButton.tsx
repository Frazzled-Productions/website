'use client';

import { track } from '@vercel/analytics';
import { useEffect, useRef, useState } from 'react';

type SupportButtonProps = {
  /** The studio's Ko-fi page URL, e.g. https://ko-fi.com/frazzledproductions */
  kofiUrl: string;
};

/**
 * The "Support the studio" pill. Clicking it opens Ko-fi's donation panel in an
 * on-page modal overlay (an iframe), so the visitor donates without leaving the
 * site. A new-tab fallback link is provided in case the iframe is blocked.
 */
export function SupportButton({ kofiUrl }: SupportButtonProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Ko-fi's embeddable donation panel for the same page.
  const embedUrl = `${kofiUrl.replace(/\/$/, '')}/?hidefeed=true&widget=true&embed=true&preview=true`;

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleOpen() {
    track('support_click');
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="kofi-button text-base font-medium"
      >
        <span style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Support the studio
        </span>
      </button>

      {open && (
        <div
          className="kofi-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Support Frazzled Productions"
          onClick={() => setOpen(false)}
        >
          <div className="kofi-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeRef}
              type="button"
              className="kofi-modal-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <iframe
              src={embedUrl}
              title="Support Frazzled Productions on Ko-fi"
              className="kofi-modal-iframe"
            />
            <a
              href={kofiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="kofi-modal-fallback"
            >
              Trouble loading? Open Ko-fi in a new tab
            </a>
          </div>
        </div>
      )}
    </>
  );
}
