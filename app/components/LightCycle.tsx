'use client';
import { useEffect, useRef } from 'react';

const CYAN = '#00e5ff';
const TRAIL_GLOW = 'rgba(0, 229, 255, 0.6)';

type Waypoint = { x: number; y: number };

function buildPath(w: number, h: number): Waypoint[] {
  // Spawn from left edge, move right, turn down or up, exit right or bottom
  const midY = h * 0.35 + Math.random() * h * 0.3;
  const turnX = w * 0.2 + Math.random() * w * 0.5;
  const goDown = Math.random() > 0.5;

  return [
    { x: -20, y: midY },
    { x: turnX, y: midY },
    { x: turnX, y: goDown ? h + 20 : -20 },
  ];
}

export function LightCycle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Don't run on touch-only devices
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
      const w = canvas.width;
      const h = canvas.height;
      const waypoints = buildPath(w, h);

      let wpIndex = 1;
      const trail: Waypoint[] = [{ ...waypoints[0] }];
      const speed = 3;
      let pos = { ...waypoints[0] };

      function step() {
        if (!canvas || !ctx) return;
        const target = waypoints[wpIndex];
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          pos = { ...target };
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

        // Keep trail length bounded
        if (trail.length > 400) trail.shift();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail
        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = TRAIL_GLOW;
          ctx.lineWidth = 2;
          ctx.shadowColor = CYAN;
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Bright core line
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 4;
          ctx.stroke();
        }

        // Draw head
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        animId = requestAnimationFrame(step);
      }

      animId = requestAnimationFrame(step);
    }

    function scheduleNext() {
      // 8-14 second gap between appearances
      const delay = 8000 + Math.random() * 6000;
      scheduleId = setTimeout(runCycle, delay);
    }

    // First run after a short initial delay
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
      style={{ zIndex: 5 }}
    />
  );
}
