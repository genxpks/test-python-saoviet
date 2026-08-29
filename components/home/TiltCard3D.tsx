"use client";

import { useState, useRef, ReactNode, CSSProperties } from "react";

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;      // Maximum rotation degrees (default: 8)
  perspective?: number;  // 3D perspective in px (default: 1000)
  scale?: number;        // Scale on hover (default: 1.015)
  glowColor?: string;    // Reflection specular color (default: rgba(37, 99, 235, 0.15))
}

export default function TiltCard3D({
  children,
  className = "",
  style = {},
  maxTilt = 8,
  perspective = 1000,
  scale = 1.015,
  glowColor = "rgba(37, 99, 235, 0.12)"
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-maxTilt to +maxTilt)
    const rotateX = ((centerY - y) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: transformStyle,
        transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease",
        transformStyle: "preserve-3d",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* 3D Dynamic Specular Light Glare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor} 0%, transparent 65%)`,
          opacity: glarePos.opacity,
          transition: "opacity 0.3s ease"
        }}
      />
      {children}
    </div>
  );
}
