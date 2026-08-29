"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  color: string;
  isBright: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  alpha: number;
  thickness: number;
  life: number;
  maxLife: number;
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Color palette for cosmic stars
    const starColors = [
      "255, 255, 255",     // Diamond white
      "180, 245, 255",     // Cyan tint
      "200, 220, 255",     // Soft blue
      "230, 200, 255",     // Soft violet
      "0, 245, 200"        // Neon Teal
    ];

    // Generate 320 Depth-based Stars
    const STAR_COUNT = 320;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const z = Math.random() * 800 + 100;
      const depthRatio = 1 - z / 950;
      const isBright = Math.random() < 0.12;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        r: isBright ? Math.random() * 1.5 + 1.2 : Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() * 0.15 + 0.03) * (depthRatio * 1.2 + 0.2),
        vy: (Math.random() * 0.08 - 0.04) * (depthRatio * 1.2 + 0.2),
        color: starColors[Math.floor(Math.random() * starColors.length)],
        isBright
      };
    });

    // Shooting stars queue
    const shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      if (shootingStars.length >= 2) return;
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 deg downward
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.3,
        len: Math.random() * 90 + 70,
        speed: Math.random() * 7 + 9,
        angle,
        alpha: 1,
        thickness: Math.random() * 1.5 + 1,
        life: 0,
        maxLife: Math.random() * 35 + 25
      });
    };

    let time = 0;
    let nextShootingStarTime = Math.random() * 200 + 150;

    const draw = () => {
      time++;
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update moving stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Cosmic Drift movement
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around borders
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;
        if (s.y > height + 10) s.y = -10;
        if (s.y < -10) s.y = height + 10;

        // Parallax offset based on depth (z)
        const depthFactor = (1000 - s.z) / 1000;
        const renderX = s.x - mouseX * depthFactor;
        const renderY = s.y - mouseY * depthFactor;

        // Twinkle sinusoidal pulse
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, Math.min(1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35));

        // Draw star core
        ctx.beginPath();
        ctx.arc(renderX, renderY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();

        // If star is bright, draw soft radial halo + cross flare
        if (s.isBright && currentAlpha > 0.55) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color}, ${currentAlpha * 0.25})`;
          ctx.fill();

          // 4-point subtle star diffraction spike
          const spikeLen = s.r * 4.5;
          ctx.strokeStyle = `rgba(${s.color}, ${currentAlpha * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(renderX - spikeLen, renderY);
          ctx.lineTo(renderX + spikeLen, renderY);
          ctx.moveTo(renderX, renderY - spikeLen);
          ctx.lineTo(renderX, renderY + spikeLen);
          ctx.stroke();
        }
      }

      // 2. Shooting stars generation & animation
      if (time > nextShootingStarTime) {
        spawnShootingStar();
        time = 0;
        nextShootingStarTime = Math.random() * 260 + 160; // Spawn every ~3-7 seconds
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;

        // Fade out
        ss.alpha = Math.max(0, 1 - ss.life / ss.maxLife);

        if (ss.life >= ss.maxLife || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, "rgba(0, 245, 200, 0)");
        grad.addColorStop(0.6, `rgba(59, 130, 246, ${ss.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha * 0.95})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glowing head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none"
      }}
    />
  );
}

export default function WaveBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        background: "#030612"
      }}
      aria-hidden="true"
    >
      {/* 1. Dynamic Moving Starfield Canvas with Shooting Stars */}
      <StarField />

      {/* 2. Layered Cosmic Nebula Clouds (with subtle CSS pulse) */}
      <div
        className="nebula-cloud-purple"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "70vw",
          height: "70vh",
          background: "radial-gradient(ellipse at center, rgba(120, 50, 230, 0.2) 0%, rgba(70, 15, 160, 0.1) 40%, transparent 70%)",
          filter: "blur(65px)",
          borderRadius: "50%",
          animation: "cosmicPulse 12s ease-in-out infinite alternate"
        }}
      />

      <div
        className="nebula-cloud-blue"
        style={{
          position: "absolute",
          top: "15%",
          left: "-12%",
          width: "60vw",
          height: "60vh",
          background: "radial-gradient(ellipse at center, rgba(0, 80, 240, 0.18) 0%, rgba(0, 30, 140, 0.08) 45%, transparent 70%)",
          filter: "blur(75px)",
          borderRadius: "50%",
          animation: "cosmicPulse 16s ease-in-out infinite alternate-reverse"
        }}
      />

      <div
        className="nebula-cloud-teal"
        style={{
          position: "absolute",
          bottom: "2%",
          left: "20%",
          width: "65vw",
          height: "50vh",
          background: "radial-gradient(ellipse at center, rgba(0, 220, 180, 0.16) 0%, rgba(0, 120, 140, 0.06) 45%, transparent 70%)",
          filter: "blur(70px)",
          borderRadius: "50%",
          animation: "cosmicPulse 14s ease-in-out infinite alternate"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "8%",
          width: "45vw",
          height: "45vh",
          background: "radial-gradient(ellipse at center, rgba(34, 211, 238, 0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
          borderRadius: "50%"
        }}
      />

      {/* 3. Deep Horizon Celestial Aurora Shimmer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35vh",
          background: "linear-gradient(to top, rgba(0, 180, 160, 0.12) 0%, rgba(3, 6, 18, 0) 100%)"
        }}
      />

      {/* 4. Fine Horizon Laser Orbit Line */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 5%, rgba(0,245,200,0.18) 30%, rgba(120,200,255,0.22) 50%, rgba(0,245,200,0.18) 70%, transparent 95%)",
          filter: "blur(0.5px)"
        }}
      />
    </div>
  );
}
