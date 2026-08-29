"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  text?: string;
  color: string;
}

const CODE_SYMBOLS = ["def", "class", "import", "{}", "=>", "async", "0x1F", "print()", "return", "lambda", "</>", "int", "str", "True", "False"];
const PALETTE = [
  "rgba(37, 99, 235, 0.45)",   // Cyber blue
  "rgba(8, 145, 178, 0.45)",   // Cyan
  "rgba(124, 58, 237, 0.45)",  // Violet
  "rgba(5, 150, 105, 0.4)",    // Emerald
  "rgba(217, 119, 6, 0.35)"    // Amber
];

export default function Canvas3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates in 3D space
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 3D particles
    const particleCount = Math.min(55, Math.floor(width / 30));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1.5,
        text: i % 2 === 0 ? CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)] : undefined,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      });
    }

    const fov = 400; // Field of view

    const render = () => {
      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const offsetX = (mouseX - width / 2) * 0.15;
      const offsetY = (mouseY - height / 2) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Render & Project 3D particles
      const projected: { px: number; py: number; scale: number; p: Particle }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle in 3D
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around boundaries
        if (p.z <= 50) p.z = 950;
        if (p.z > 1000) p.z = 60;
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;

        // 3D Perspective Projection formula
        const scale = fov / (fov + p.z);
        const px = (p.x - offsetX) * scale + width / 2;
        const py = (p.y - offsetY) * scale + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          projected.push({ px, py, scale, p });
        }
      }

      // Draw 3D network lines between nearby projected particles
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = Math.max(0.5, 1.2 * a.scale);
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // Draw 3D glowing nodes / code tokens
      for (let i = 0; i < projected.length; i++) {
        const { px, py, scale, p } = projected[i];

        if (p.text) {
          // Render 3D Code Token
          ctx.font = `${Math.max(9, Math.floor(13 * scale))}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, px, py);
        } else {
          // Render Glowing 3D Node
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85
      }}
    />
  );
}
