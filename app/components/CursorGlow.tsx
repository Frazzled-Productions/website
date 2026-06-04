'use client';
import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX - 60}px`;
        ref.current.style.top = `${e.clientY - 60}px`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-40 rounded-full"
      style={{
        top: '-120px',
        left: '-120px',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(123, 47, 255, 0.6) 0%, rgba(123, 47, 255, 0.2) 40%, transparent 70%)',
      }}
    />
  );
}
