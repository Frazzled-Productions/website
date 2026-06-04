'use client';
import { useEffect, useState } from 'react';

export function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(timer);
          setDone(true);
        }
      }, 55);
      return () => clearInterval(timer);
    }, 600);
    return () => clearTimeout(delay);
  }, [text]);

  return (
    <p
      className="gradient-text text-xl md:text-2xl font-medium tracking-wide"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      {displayed}
      {!done && (
        <span className="animate-pulse" style={{ color: 'var(--cyan)' }}>|</span>
      )}
    </p>
  );
}
