"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw } from "lucide-react";

export default function CyberPlanet3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 580;
    let height = container.clientHeight || 520;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 8.2;
    camera.position.y = 0.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // -------------------------------------------------------------
    // 1. Procedural Swirling Fluid/Cyber Marble Texture (Like Mockup)
    // -------------------------------------------------------------
    const createPlanetTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Deep cosmic ocean navy base
      const bgGrad = ctx.createLinearGradient(0, 0, 2048, 1024);
      bgGrad.addColorStop(0, "#010818");
      bgGrad.addColorStop(0.3, "#041432");
      bgGrad.addColorStop(0.7, "#02203c");
      bgGrad.addColorStop(1, "#010714");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Swirling Emerald-Teal & Cyan Gas Clouds (Organic Fluid Bands)
      for (let i = 0; i < 45; i++) {
        ctx.beginPath();
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const radiusX = Math.random() * 380 + 120;
        const radiusY = Math.random() * 140 + 40;
        const rotation = Math.random() * Math.PI * 2;

        const swirlGrad = ctx.createRadialGradient(x, y, 10, x, y, radiusX);
        swirlGrad.addColorStop(0, "rgba(0, 245, 200, 0.75)");
        swirlGrad.addColorStop(0.35, "rgba(6, 182, 212, 0.45)");
        swirlGrad.addColorStop(0.7, "rgba(14, 80, 180, 0.2)");
        swirlGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = swirlGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // High-contrast bright glowing cyan streaks (Like in Mockup)
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const startX = Math.random() * 2048;
        const startY = Math.random() * 1024;
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX + 200, startY - 80,
          startX + 400, startY + 120,
          startX + 700, startY + 20
        );
        ctx.strokeStyle = "rgba(0, 255, 220, 0.38)";
        ctx.lineWidth = Math.random() * 6 + 2;
        ctx.shadowColor = "#00f5c8";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }

      // Cyber Binary & Code Annotations
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(200, 250, 255, 0.4)";
      ctx.font = "bold 13px 'Courier New', monospace";
      const codeSnippets = [
        "101100101101001010101101",
        "def init_cyber_matrix():",
        "SELECT * FROM STARS_2026",
        "010101101010010101101011",
        "const SYSTEM = 'TinHocSaoViet'",
        "matrix[x][y] = 0x00F5C8",
        "import tensorflow as tf",
        "class HologramEngine3D:"
      ];
      for (let i = 0; i < 50; i++) {
        const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        ctx.fillText(text, Math.random() * 1900, Math.random() * 980);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const planetTexture = createPlanetTexture();

    // -------------------------------------------------------------
    // 2. Planet Core Sphere (Rich Shading)
    // -------------------------------------------------------------
    const planetGeometry = new THREE.SphereGeometry(2.35, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.28,
      metalness: 0.72,
      emissive: new THREE.Color("#00333d"),
      emissiveIntensity: 0.75
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    rootGroup.add(planetMesh);

    // -------------------------------------------------------------
    // 3. Holographic Atmosphere Glow (Fresnel Shell)
    // -------------------------------------------------------------
    const atmosphereGeometry = new THREE.SphereGeometry(2.48, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00f5c8"),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    rootGroup.add(atmosphereMesh);

    // -------------------------------------------------------------
    // 4. Multiple 3D Holographic Code Orbital Rings (Matching Mockup)
    // -------------------------------------------------------------
    const orbitalRings: { group: THREE.Group; speed: number }[] = [];

    const createCyberOrbitalRing = (
      rx: number,
      ry: number,
      rotX: number,
      rotY: number,
      rotZ: number,
      colorHex: string,
      particleCount: number,
      speed: number
    ) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(rotX, rotY, rotZ);

      // Smooth elliptical curve
      const curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(240);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );

      // 1. Solid glowing core line
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const ringLine = new THREE.Line(ringGeo, lineMat);
      ringGroup.add(ringLine);

      // 2. High-density Orbiting Cyber Particles
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const pt = curve.getPoint(i / particleCount);
        particlePositions[i * 3] = pt.x;
        particlePositions[i * 3 + 1] = pt.y;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color(colorHex),
        size: 0.14,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      ringGroup.add(particles);

      rootGroup.add(ringGroup);
      orbitalRings.push({ group: ringGroup, speed });
    };

    // 4 Distinct 3D Rings at Tilted Angles (Exact Mockup Alignment)
    createCyberOrbitalRing(3.4, 3.1, Math.PI * 0.38, Math.PI * 0.15, Math.PI * 0.22, "#00f5c8", 65, 0.0055);
    createCyberOrbitalRing(3.9, 3.6, -Math.PI * 0.32, Math.PI * 0.28, -Math.PI * 0.15, "#38bdf8", 80, -0.004);
    createCyberOrbitalRing(4.4, 4.0, Math.PI * 0.52, -Math.PI * 0.18, Math.PI * 0.42, "#00f5c8", 95, 0.0032);
    createCyberOrbitalRing(4.8, 4.3, -Math.PI * 0.15, Math.PI * 0.45, Math.PI * 0.1, "#818cf8", 60, -0.0028);

    // -------------------------------------------------------------
    // 5. Directional Lights & Specular Highlights
    // -------------------------------------------------------------
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    // Bright cyan key light (top-right specular glow)
    const keyLight = new THREE.DirectionalLight(0x00f5c8, 3.5);
    keyLight.position.set(7, 5, 6);
    scene.add(keyLight);

    // Deep blue fill light
    const fillLight = new THREE.DirectionalLight(0x0284c7, 2.5);
    fillLight.position.set(-7, -4, -3);
    scene.add(fillLight);

    // Violet rim accent
    const rimLight = new THREE.PointLight(0xa855f7, 4.0, 25);
    rimLight.position.set(0, 6, -3);
    scene.add(rimLight);

    // -------------------------------------------------------------
    // 6. Interactive Drag & Mouse Tilt Physics
    // -------------------------------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.12;
    let targetRotationY = 0;
    let mouseTiltX = 0;
    let mouseTiltY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseTiltX = relX * 0.3;
      mouseTiltY = relY * 0.3;

      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = "grab";
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // -------------------------------------------------------------
    // 7. Animation Loop
    // -------------------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Continuous Planet Self-Rotation
      planetMesh.rotation.y += 0.0038;

      // Orbit rotations
      orbitalRings.forEach(r => {
        r.group.rotation.z += r.speed;
      });

      // Smooth levitation
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      // Mouse drag & tilt interpolation
      rootGroup.rotation.y += (targetRotationY + mouseTiltX - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX + mouseTiltY - rootGroup.rotation.x) * 0.08;

      if (!isDragging) {
        targetRotationY += 0.0018;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domEl.removeEventListener("mousedown", onMouseDown);
      domEl.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      planetGeometry.dispose();
      planetMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      planetTexture.dispose();
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Holographic Backdrop Ambient Light Ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(0, 245, 200, 0.22) 0%, rgba(14, 165, 233, 0.12) 45%, transparent 70%)",
          filter: "blur(55px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Cyber Grid Base Aura */}
      <div
        style={{
          position: "absolute",
          bottom: "2%",
          left: "50%",
          transform: "translateX(-50%) rotateX(75deg)",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "2px dashed rgba(0, 245, 200, 0.3)",
          boxShadow: "0 0 35px rgba(0, 245, 200, 0.25), inset 0 0 30px rgba(0, 245, 200, 0.18)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Three.js Canvas Container (Borderless, Floating freely) */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          touchAction: "none"
        }}
      />

      {/* Floating Micro-Badge: Drag to Rotate */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "20px",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.4rem 0.95rem",
          borderRadius: "var(--radius-full)",
          background: "rgba(3, 10, 26, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 245, 200, 0.35)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(0,245,200,0.2)",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#00f5c8",
          letterSpacing: "0.02em",
          pointerEvents: "none",
          transition: "all 0.3s ease",
          opacity: isHovered ? 1 : 0.85
        }}
      >
        <RotateCw size={13} className="animate-spin-slow" />
        <span>Hành Tinh Lập Trình 3D • Kéo Để Xoay</span>
      </div>
    </div>
  );
}
