"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseAlpha: number;
  color: string;
}

export default function Canvas3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates in centered space
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.4;
      targetMouseY = (e.clientY - height / 2) * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Detect theme — light mode dùng màu pastel, dark mode dùng neon
    const isLightMode = () => {
      return document.documentElement.getAttribute("data-theme") !== "dark";
    };

    // Dark mode: neon vibrant | Light mode: muted blue/indigo pastel
    const getDarkColors = () => [
      "rgba(0, 245, 200,",
      "rgba(59, 130, 246,",
      "rgba(34, 211, 238,",
      "rgba(139, 92, 246,"
    ];

    const getLightColors = () => [
      "rgba(37, 99, 235,",      // blue-600
      "rgba(99, 102, 241,",     // indigo-500
      "rgba(14, 165, 233,",     // sky-500
      "rgba(124, 58, 237,"      // violet-600
    ];

    const getColors = () => isLightMode() ? getLightColors() : getDarkColors();
    const getOpacity = () => isLightMode() ? 0.35 : 0.85;
    const getParticleAlphaMultiplier = () => isLightMode() ? 0.45 : 1.0;

    // Generate 3D Particles
    const PARTICLE_COUNT = 60;
    const particles: Particle3D[] = [];
    let colors = getColors();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1.5,
        baseAlpha: Math.random() * 0.55 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const fov = 450;

    // Render loop
    const render = () => {
      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Re-sample colors each frame to respond to theme changes
      colors = getColors();
      const alphaMultiplier = getParticleAlphaMultiplier();
      const lineColor = isLightMode()
        ? "rgba(37, 99, 235,"       // blue-600 lines on light
        : "rgba(0, 245, 200,";      // teal lines on dark

      // Projected 2D particles list for line connections
      const projected: { x: number; y: number; alpha: number; color: string; size: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles in 3D
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around 3D bounds
        const boundX = width * 0.9;
        const boundY = height * 0.9;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < 80) p.z = 900;
        if (p.z > 900) p.z = 80;

        // Perspective projection with camera tilt
        const adjX = p.x - mouseX * (1 - p.z / 1000);
        const adjY = p.y - mouseY * (1 - p.z / 1000);
        const scale = fov / (fov + p.z);

        const px = cx + adjX * scale;
        const py = cy + adjY * scale;

        // Alpha based on depth — giảm thêm khi light mode
        const depthAlpha = Math.max(0, Math.min(1, 1 - p.z / 950)) * p.baseAlpha * alphaMultiplier;
        const renderSize = p.size * scale * 1.8;

        // Cycle màu theo theme
        const particleColor = colors[Math.floor(Math.random() * 4)] ?? p.color;
        projected.push({ x: px, y: py, alpha: depthAlpha, color: particleColor, size: renderSize });

        // Draw glowing particle dot
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, renderSize), 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor} ${depthAlpha})`;
        ctx.fill();

        // Subtle soft outer glow (nhỏ hơn khi light mode)
        if (!isLightMode()) {
          ctx.beginPath();
          ctx.arc(px, py, Math.max(2, renderSize * 2.5), 0, Math.PI * 2);
          ctx.fillStyle = `${particleColor} ${depthAlpha * 0.25})`;
          ctx.fill();
        }
      }

      // Draw subtle connecting constellation lines
      const maxDistance = isLightMode() ? 100 : 140;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * Math.min(p1.alpha, p2.alpha) * (isLightMode() ? 0.3 : 0.55);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor} ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
        zIndex: 0
      }}
    />
  );
}
