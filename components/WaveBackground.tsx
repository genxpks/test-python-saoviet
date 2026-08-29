"use client";

import { useEffect, useRef } from "react";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.4 + 0.05,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      twinkleSpeed: Math.random() * 0.006 + 0.002
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.twinkleDir * s.twinkleSpeed;
        if (s.alpha >= 0.85 || s.alpha <= 0.1) s.twinkleDir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
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
      {/* Star field canvas */}
      <StarField />

      {/* Nebula cloud — purple top-right */}
      <div style={{
        position: "absolute",
        top: "-5%",
        right: "-5%",
        width: "65vw",
        height: "65vh",
        background: "radial-gradient(ellipse, rgba(100,40,200,0.22) 0%, rgba(60,10,140,0.1) 40%, transparent 70%)",
        filter: "blur(60px)",
        borderRadius: "50%"
      }} />

      {/* Nebula cloud — deep blue left */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "-10%",
        width: "55vw",
        height: "55vh",
        background: "radial-gradient(ellipse, rgba(0,60,200,0.2) 0%, rgba(0,20,120,0.08) 45%, transparent 70%)",
        filter: "blur(70px)",
        borderRadius: "50%"
      }} />

      {/* Nebula cloud — teal bottom-center */}
      <div style={{
        position: "absolute",
        bottom: "0%",
        left: "25%",
        width: "60vw",
        height: "45vh",
        background: "radial-gradient(ellipse, rgba(0,190,160,0.18) 0%, rgba(0,100,120,0.08) 45%, transparent 70%)",
        filter: "blur(65px)",
        borderRadius: "50%"
      }} />

      {/* Nebula accent — blue mid-right */}
      <div style={{
        position: "absolute",
        top: "45%",
        right: "5%",
        width: "40vw",
        height: "40vh",
        background: "radial-gradient(ellipse, rgba(30,100,220,0.14) 0%, transparent 65%)",
        filter: "blur(55px)",
        borderRadius: "50%"
      }} />

      {/* Cosmic horizon glow at bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30vh",
        background: "linear-gradient(to top, rgba(0,140,130,0.1) 0%, transparent 100%)"
      }} />

      {/* Horizon line shimmer */}
      <div style={{
        position: "absolute",
        bottom: "28%",
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent 5%, rgba(0,245,200,0.15) 30%, rgba(100,180,255,0.12) 50%, rgba(0,245,200,0.15) 70%, transparent 95%)",
        filter: "blur(1px)"
      }} />
    </div>
  );
}
