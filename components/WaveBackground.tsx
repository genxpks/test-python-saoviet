"use client";

import { useEffect, useRef } from "react";

export default function WaveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}
      aria-hidden="true"
    >
      <div className="wave-layer-wrap">
        <svg
          className="wave wave-1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(100,180,220,0.045)"
            d="M0,128 C180,200 360,40 540,100 C720,160 900,240 1080,180 C1260,120 1350,60 1440,80 L1440,320 L0,320 Z"
          />
        </svg>

        <svg
          className="wave wave-2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(80,160,210,0.035)"
            d="M0,200 C200,140 400,260 600,200 C800,140 1000,100 1200,160 C1320,200 1400,220 1440,210 L1440,320 L0,320 Z"
          />
        </svg>

        <svg
          className="wave wave-3"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(60,140,200,0.025)"
            d="M0,240 C240,180 480,280 720,240 C960,200 1200,150 1440,190 L1440,320 L0,320 Z"
          />
        </svg>

        <svg
          className="wave wave-4"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(0,245,200,0.02)"
            d="M0,160 C160,100 320,220 480,180 C640,140 800,80 960,120 C1120,160 1300,200 1440,160 L1440,320 L0,320 Z"
          />
        </svg>

        <svg
          className="wave wave-5"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(100,190,230,0.03)"
            d="M0,280 C300,240 600,300 900,260 C1100,230 1300,240 1440,250 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 10% 80%, rgba(80,160,220,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 90% 70%, rgba(0,245,200,0.05) 0%, transparent 55%)
          `
        }}
      />
    </div>
  );
}
