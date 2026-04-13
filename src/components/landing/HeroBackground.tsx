"use client";

import { useEffect, useRef } from "react";

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number }[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.002;

      // Node network
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if (nodes[i].x < 0 || nodes[i].x > canvas.width) nodes[i].vx *= -1;
        if (nodes[i].y < 0 || nodes[i].y > canvas.height) nodes[i].vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.globalAlpha = (1 - dist / 140) * 0.18;
            ctx.strokeStyle = "#5ab3cc";
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#5ab3cc";
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 40;
      const scale = Math.min(canvas.width, canvas.height) * 0.17;

      // Wireframe skull rings
      ctx.lineWidth = 0.8;
      for (let ring = 0; ring < 5; ring++) {
        const ry = -0.7 + ring * 0.3;
        const rRadius = Math.sqrt(Math.max(0, 1 - ry * ry)) * scale;
        ctx.beginPath();
        ctx.ellipse(cx, cy + ry * scale * 0.6, rRadius, rRadius * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(90,179,204,0.1)";
        ctx.stroke();
      }

      // Vertical meridians
      for (let m = 0; m < 8; m++) {
        const a = (m / 8) * Math.PI * 2 + angle;
        ctx.beginPath();
        for (let s = 0; s <= 20; s++) {
          const lat = -Math.PI / 2 + (s / 20) * Math.PI * 1.2;
          const r = Math.cos(lat) * scale;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(lat) * scale * 0.6;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(90,179,204,${0.03 + 0.05 * Math.abs(Math.cos(a))})`;
        ctx.stroke();
      }

      // Eye sockets
      ctx.strokeStyle = "rgba(90,179,204,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx - scale * 0.3, cy - scale * 0.1, scale * 0.17, scale * 0.12, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + scale * 0.3, cy - scale * 0.1, scale * 0.17, scale * 0.12, 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Nasal
      ctx.beginPath();
      ctx.moveTo(cx - scale * 0.07, cy + scale * 0.06);
      ctx.lineTo(cx, cy + scale * 0.19);
      ctx.lineTo(cx + scale * 0.07, cy + scale * 0.06);
      ctx.strokeStyle = "rgba(90,179,204,0.14)";
      ctx.stroke();

      // Jaw
      ctx.beginPath();
      ctx.moveTo(cx - scale * 0.5, cy + scale * 0.2);
      ctx.quadraticCurveTo(cx - scale * 0.4, cy + scale * 0.58, cx, cy + scale * 0.68);
      ctx.quadraticCurveTo(cx + scale * 0.4, cy + scale * 0.58, cx + scale * 0.5, cy + scale * 0.2);
      ctx.strokeStyle = "rgba(90,179,204,0.15)";
      ctx.stroke();

      // Teeth
      for (let tooth = -3; tooth <= 3; tooth++) {
        ctx.beginPath();
        ctx.rect(cx + tooth * scale * 0.06 - scale * 0.025, cy + scale * 0.34, scale * 0.048, scale * 0.065);
        ctx.strokeStyle = "rgba(90,179,204,0.1)";
        ctx.stroke();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
