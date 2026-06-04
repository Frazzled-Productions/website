'use client';
import { useEffect, useRef } from 'react';

const CYAN = '#00e5ff';
const TRAIL = 'rgba(0, 229, 255, 0.5)';
const GRID = 40;

type Pt = { x: number; y: number };

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

function buildPath(w: number, h: number): Pt[] {
  const fromRight = Math.random() > 0.5;
  // Enter from left or right at a snapped row in the lower half
  const entryY = snap(h * 0.45 + Math.random() * h * 0.4);
  // Turn somewhere across the canvas, snapped to a column
  const turnX = snap(w * 0.2 + Math.random() * w * 0.6);

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
      const trail: Pt[] = [{ ...waypoints[0] }];
      const speed = 2.5;
      const pos = { ...waypoints[0] };

      function step() {
        if (!canvas || !ctx) return;
        const target = waypoints[wpIndex];
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          pos.x = target.x;
          pos.y = target.y;
          trail.push({ ...pos });
          wpIndex++;
          if (wpIndex >= waypoints.length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scheduleNext();
            return;
          }
        } else {
          pos.x += (dx / dist) * speed;
          pos.y += (dy / dist) * speed;
          trail.push({ ...pos });
        }

        if (trail.length > 600) trail.shift();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (trail.length > 1) {
          // Glow trail
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = TRAIL;
          ctx.lineWidth = 3;
          ctx.shadowColor = CYAN;
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Bright core
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 5;
          ctx.stroke();
        }

        // Head
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
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
