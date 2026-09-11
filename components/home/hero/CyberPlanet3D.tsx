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
    // 1. Procedural Swirling Fluid/Cyber Marble Texture
    // -------------------------------------------------------------
    const createPlanetTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // === Vibrant deep-ocean teal base (NOT pitch black) ===
      const bgGrad = ctx.createLinearGradient(0, 0, 2048, 1024);
      bgGrad.addColorStop(0, "#052840");
      bgGrad.addColorStop(0.25, "#074060");
      bgGrad.addColorStop(0.5, "#085070");
      bgGrad.addColorStop(0.75, "#064055");
      bgGrad.addColorStop(1, "#041830");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // === Large vivid teal equatorial belt ===
      const beltGrad = ctx.createLinearGradient(0, 280, 0, 744);
      beltGrad.addColorStop(0, "rgba(0,240,200,0)");
      beltGrad.addColorStop(0.25, "rgba(0,200,190,0.55)");
      beltGrad.addColorStop(0.5, "rgba(0,220,210,0.7)");
      beltGrad.addColorStop(0.75, "rgba(0,200,190,0.55)");
      beltGrad.addColorStop(1, "rgba(0,240,200,0)");
      ctx.fillStyle = beltGrad;
      ctx.fillRect(0, 280, 2048, 464);

      // === Bright swirling gas clouds ===
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const rx = Math.random() * 450 + 100;
        const ry = Math.random() * 180 + 40;
        const rot = Math.random() * Math.PI * 2;
        const alpha = 0.35 + Math.random() * 0.55;
        const hue = 170 + Math.random() * 40; // teal to cyan range
        const swirlGrad = ctx.createRadialGradient(x, y, 0, x, y, rx);
        swirlGrad.addColorStop(0, `hsla(${hue}, 100%, 60%, ${alpha})`);
        swirlGrad.addColorStop(0.4, `hsla(${hue + 10}, 90%, 50%, ${alpha * 0.6})`);
        swirlGrad.addColorStop(1, "hsla(200, 80%, 40%, 0)");
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = swirlGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // === Bright cyan streaks / lightning arcs ===
      ctx.shadowColor = "#00ffdd";
      ctx.shadowBlur = 20;
      for (let i = 0; i < 25; i++) {
        const sx = Math.random() * 2048;
        const sy = Math.random() * 1024;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(
          sx + 220, sy - 90,
          sx + 480, sy + 140,
          sx + 780, sy + 10
        );
        ctx.strokeStyle = `rgba(0, 255, 220, ${0.35 + Math.random() * 0.45})`;
        ctx.lineWidth = Math.random() * 5 + 1.5;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // === Bright planet-surface dots (data nodes) ===
      for (let i = 0; i < 250; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const r = Math.random() * 3 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 255, 240, ${0.4 + Math.random() * 0.6})`;
        ctx.fill();
      }

      // === Subtle latitude grid lines ===
      for (let i = 0; i < 9; i++) {
        const y = i * 115;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.strokeStyle = `rgba(0, 200, 200, ${0.06 + Math.random() * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
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
    const planetGeometry = new THREE.SphereGeometry(2.35, 96, 96);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.25,
      metalness: 0.45,
      emissive: new THREE.Color("#00e5b0"),
      emissiveIntensity: 0.65
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
    // 4. Multiple 3D Holographic Code Orbital Rings
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

      const curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(240);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );

      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const ringLine = new THREE.Line(ringGeo, lineMat);
      ringGroup.add(ringLine);

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

    createCyberOrbitalRing(3.4, 3.1, Math.PI * 0.38, Math.PI * 0.15, Math.PI * 0.22, "#00f5c8", 65, 0.0055);
    createCyberOrbitalRing(3.9, 3.6, -Math.PI * 0.32, Math.PI * 0.28, -Math.PI * 0.15, "#38bdf8", 80, -0.004);
    createCyberOrbitalRing(4.4, 4.0, Math.PI * 0.52, -Math.PI * 0.18, Math.PI * 0.42, "#00f5c8", 95, 0.0032);
    createCyberOrbitalRing(4.8, 4.3, -Math.PI * 0.15, Math.PI * 0.45, Math.PI * 0.1, "#818cf8", 60, -0.0028);

    // -------------------------------------------------------------
    // 5. Directional Lights (strong enough to reveal surface detail)
    // -------------------------------------------------------------
    // Warm ambient — prevents dark side from being pitch black
    const ambient = new THREE.AmbientLight(0x88ccbb, 3.5);
    scene.add(ambient);

    // Primary CYAN key light — top-right, very bright
    const keyLight = new THREE.DirectionalLight(0x00f5c8, 7.0);
    keyLight.position.set(6, 5, 9);
    scene.add(keyLight);

    // Front-center white fill — ensures the face the user sees is lit
    const frontFill = new THREE.DirectionalLight(0xd0f8ff, 4.5);
    frontFill.position.set(0, 0, 12);
    scene.add(frontFill);

    // Cool blue back fill — dark side has color, not black
    const fillLight = new THREE.DirectionalLight(0x0284c7, 3.5);
    fillLight.position.set(-8, -3, -4);
    scene.add(fillLight);

    // Violet rim accent
    const rimLight = new THREE.PointLight(0xa855f7, 5.5, 30);
    rimLight.position.set(-2, 7, -4);
    scene.add(rimLight);

    // Teal point light very close to planet (boosts surface glow)
    const surfaceGlow = new THREE.PointLight(0x00e5b8, 6.0, 15);
    surfaceGlow.position.set(3, 2, 7);
    scene.add(surfaceGlow);

    // -------------------------------------------------------------
    // 6. Interactive Drag & Mouse Tilt
    // -------------------------------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.12;
    let targetRotationY = 0;
    let mouseTiltX = 0;
    let mouseTiltY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseTiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.3;
      mouseTiltY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;

      if (isDragging) {
        targetRotationY += (e.clientX - previousMousePosition.x) * 0.008;
        targetRotationX += (e.clientY - previousMousePosition.y) * 0.008;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = "grab";
    domEl.addEventListener("mousedown", () => { isDragging = true; });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () => { isDragging = false; });

    // -------------------------------------------------------------
    // 7. Animation Loop
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      planetMesh.rotation.y += 0.0038;
      orbitalRings.forEach(r => r.group.rotation.z += r.speed);
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      rootGroup.rotation.y += (targetRotationY + mouseTiltX - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX + mouseTiltY - rootGroup.rotation.x) * 0.08;

      if (!isDragging) targetRotationY += 0.0018;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", () => { isDragging = false; });
      planetGeometry.dispose();
      planetMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      planetTexture.dispose();
      renderer.dispose();
      if (container.contains(domEl)) container.removeChild(domEl);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "540px",
        height: "500px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "24px"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          borderRadius: "999px",
          background: "rgba(3, 10, 26, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(0, 245, 200, 0.35)",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#00f5c8",
          transition: "all 0.3s ease",
          opacity: isHovered ? 1 : 0.85
        }}
      >
        <RotateCw size={13} />
        <span>Hành Tinh Lập Trình 3D • Kéo Để Xoay</span>
      </div>
    </div>
  );
}
