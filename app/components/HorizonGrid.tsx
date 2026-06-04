'use client';
import { useEffect, useRef } from 'react';

const GRID = 40;
const SCROLL_MS = 1500;
const DR = GRID / SCROLL_MS; // canvas px per ms
const SPEED = 2.5; // cycle base px per frame

type Pt = { x: number; y: number };
type Cycle = { pos: Pt; waypoints: Pt[]; wpIdx: number; trail: Pt[] };

function buildCycle(w: number, h: number): Cycle {
  const fromRight = Math.random() > 0.5;
  const rawY = h * 0.3 + Math.random() * h * 0.4;
  // Entry Y must be a pure multiple of GRID - no phase offset.
  // drawnY = entryY + drift = (n*GRID) + drift, which equals grid line n + floor(drift/GRID).
  const entryY = Math.round(rawY / GRID) * GRID;
  const turnX = Math.round((w * 0.25 + Math.random() * w * 0.5) / GRID) * GRID;
  const entry: Pt = fromRight ? { x: w + 20, y: entryY } : { x: -20, y: entryY };
  const turn: Pt = { x: turnX, y: entryY };
  const exitPt: Pt = { x: turnX, y: entryY - 800 };
  return { pos: { ...entry }, waypoints: [entry, turn, exitPt], wpIdx: 1, trail: [{ ...entry }] };
}

export function HorizonGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const startMs = performance.now();
    let animId = 0;
    let scheduleId: ReturnType<typeof setTimeout>;
    let cycle: Cycle | null = null;
    const hasMouse = !window.matchMedia('(hover: none)').matches;

    function spawnCycle() {
      if (!canvas) return;
      cycle = buildCycle(canvas.width, canvas.height);
    }

    function scheduleCycle(delay: number) {
      scheduleId = setTimeout(spawnCycle, delay);
    }

    if (hasMouse) scheduleCycle(3000);

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;
      const elapsed = timestamp - startMs;
      const drift = elapsed * DR;
      const phase = drift % GRID;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Horizontal grid lines - same clock as cycle drift, guaranteed sync
      ctx.strokeStyle = 'rgba(123, 47, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      for (let y = phase - GRID; y <= canvas.height + GRID; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Vertical grid lines
      ctx.strokeStyle = 'rgba(123, 47, 255, 0.4)';
      ctx.beginPath();
      for (let x = 0; x <= canvas.width + GRID; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();

      // Cycle update
      if (cycle) {
        const { pos, waypoints, trail } = cycle;
        const drawnY = pos.y + drift;

        if (drawnY < -20 || drawnY > canvas.height + 20) {
          cycle = null;
          if (hasMouse) scheduleCycle(8000 + Math.random() * 6000);
        } else {
          const target = waypoints[cycle.wpIdx];
          const dx = target.x - pos.x;
          const dy = target.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= SPEED) {
            pos.x = target.x;
            pos.y = target.y;
            trail.push({ ...pos });
            cycle.wpIdx++;
            if (cycle.wpIdx >= waypoints.length) {
              cycle = null;
              if (hasMouse) scheduleCycle(8000 + Math.random() * 6000);
            }
          } else {
            pos.x += (dx / dist) * SPEED;
            pos.y += (dy / dist) * SPEED;
            trail.push({ ...pos });
          }
          if (trail.length > 500) trail.shift();
        }
      }

      // Cycle draw - all trail Y offsets by same drift, keeping shape correct
      if (cycle && cycle.trail.length > 1) {
        const { trail, pos } = cycle;

        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y + drift);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y + drift);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y + drift);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y + drift);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 5;
        ctx.stroke();

        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y + drift, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

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
        transform: 'perspective(300px) rotateX(65deg)',
        transformOrigin: 'top center',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
      }}
    />
  );
}
