'use client';
import { useEffect, useRef } from 'react';

const CYAN = '#00e5ff';
const TRAIL = 'rgba(0, 229, 255, 0.5)';
const GRID = 40;
const SCROLL_MS = 1500; // must match globals.css grid-scroll duration

type Pt = { x: number; y: number };

// Current grid-scroll phase in pixels (0..GRID)
function gridOffset() {
  return (performance.now() % SCROLL_MS) / SCROLL_MS * GRID;
}

// Snap value to nearest grid line given current scroll phase
function snapY(v: number, offset: number) {
  return Math.round((v - offset) / GRID) * GRID + offset;
}

function buildPath(w: number, h: number): Pt[] {
  const offset = gridOffset();
  const fromRight = Math.random() > 0.5;
  const rawY = h * 0.4 + Math.random() * h * 0.35;
  const entryY = snapY(rawY, offset);
  // Keep horizontal leg short so drift doesn't push the cycle off-canvas
  const turnX = Math.round((w * 0.25 + Math.random() * w * 0.5) / GRID) * GRID;

  return fromRight
    ? [{ x: w + 20, y: entryY }, { x: turnX, y: entryY }, { x: turnX, y: -20 }]
    : [{ x: -20, y: entryY }, { x: turnX, y: entryY }, { x: turnX, y: -20 }];
}

export function LightCycle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let scheduleId: ReturnType<typeof setTimeout>;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function runCycle() {
      if (!canvas || !ctx) return;
      const waypoints = buildPath(canvas.width, canvas.height);
      let wpIndex = 1;
      // Trail stores actual drawn positions (base Y + drift at recording time)
      const trail: Pt[] = [];
      const speed = 2.5;
      const pos = { ...waypoints[0] };
      const startOffset = gridOffset();

      function step() {
        if (!canvas || !ctx) return;

        // How far the grid has scrolled since cycle started (in canvas pre-perspective px)
        const drift = (gridOffset() - startOffset + GRID) % GRID;

        const target = waypoints[wpIndex];
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          pos.x = target.x;
          pos.y = target.y;
          wpIndex++;
          trail.push({ x: pos.x, y: pos.y + drift });
          if (wpIndex >= waypoints.length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scheduleNext();
            return;
          }
        } else {
          pos.x += (dx / dist) * speed;
          pos.y += (dy / dist) * speed;
          trail.push({ x: pos.x, y: pos.y + drift });
        }

        if (trail.length > 500) trail.shift();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = TRAIL;
          ctx.lineWidth = 3;
          ctx.shadowColor = CYAN;
          ctx.shadowBlur = 12;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 5;
          ctx.stroke();
        }

        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y + drift, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        animId = requestAnimationFrame(step);
      }

      animId = requestAnimationFrame(step);
    }

    function scheduleNext() {
      scheduleId = setTimeout(runCycle, 8000 + Math.random() * 6000);
    }

    scheduleId = setTimeout(runCycle, 3000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scheduleId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{
        zIndex: 6,
        transform: 'perspective(300px) rotateX(65deg)',
        transformOrigin: 'top center',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
      }}
    />
  );
}
