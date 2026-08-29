"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Orbit, Code2, RotateCw } from "lucide-react";

export default function CyberPlanet3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 460;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8.5;
    camera.position.y = 0.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Root Group for smooth tilt and rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // -------------------------------------------------------------
    // 1. Procedural High-Tech Planet Texture Generation
    // -------------------------------------------------------------
    const createPlanetTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Deep space base
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      grad.addColorStop(0, "#030c1e");
      grad.addColorStop(0.5, "#061838");
      grad.addColorStop(1, "#020712");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Swirling Aurora & Cyber Continents
      for (let i = 0; i < 28; i++) {
        ctx.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 160 + 60;
        const swirlGrad = ctx.createRadialGradient(x, y, 10, x, y, r);
        swirlGrad.addColorStop(0, "rgba(0, 245, 200, 0.45)");
        swirlGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.25)");
        swirlGrad.addColorStop(0.8, "rgba(99, 102, 241, 0.12)");
        swirlGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = swirlGrad;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Latitude / Longitude Glowing Grid Lines
      ctx.strokeStyle = "rgba(0, 245, 200, 0.18)";
      ctx.lineWidth = 1.2;
      for (let y = 30; y < 512; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
      for (let x = 30; x < 1024; x += 65) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }

      // Digital Binary / Code Stream Overlay on Texture
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 10px monospace";
      const codeLines = [
        "10100101011001",
        "def evaluate_code():",
        "import * as SaoViet",
        "01001011010110",
        "std::vector<int>",
        "matrix[x][y] = 2026",
        "const AI_SYS = true",
        "SELECT * FROM STARS"
      ];
      for (let i = 0; i < 40; i++) {
        const text = codeLines[Math.floor(Math.random() * codeLines.length)];
        ctx.fillText(text, Math.random() * 950, Math.random() * 500);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const planetTexture = createPlanetTexture();

    // -------------------------------------------------------------
    // 2. Planet Core Sphere
    // -------------------------------------------------------------
    const planetGeometry = new THREE.SphereGeometry(2.3, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.35,
      metalness: 0.65,
      emissive: new THREE.Color("#003844"),
      emissiveIntensity: 0.6
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    rootGroup.add(planetMesh);

    // -------------------------------------------------------------
    // 3. Atmosphere Glow Shell (Fresnel Rim Lighting)
    // -------------------------------------------------------------
    const atmosphereGeometry = new THREE.SphereGeometry(2.45, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00f5c8"),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    rootGroup.add(atmosphereMesh);

    // Subtle Outer Cloud / Aura Sphere
    const cloudGeometry = new THREE.SphereGeometry(2.34, 48, 48);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#38bdf8"),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      roughness: 0.1
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    rootGroup.add(cloudMesh);

    // -------------------------------------------------------------
    // 4. Glowing Cyber Orbital Rings (Vòng Quỹ Đạo Đa Chiều)
    // -------------------------------------------------------------
    const orbitalRings: THREE.Group[] = [];

    // Helper: Create Glowing Ring with Code & Dash Markers
    const createOrbitalRing = (
      radiusX: number,
      radiusY: number,
      rotX: number,
      rotY: number,
      rotZ: number,
      colorHex: string,
      particleCount: number,
      speedMultiplier: number
    ) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = rotX;
      ringGroup.rotation.y = rotY;
      ringGroup.rotation.z = rotZ;

      // Elliptical curve
      const curve = new THREE.EllipseCurve(
        0, 0,
        radiusX, radiusY,
        0, 2 * Math.PI,
        false,
        0
      );

      const points = curve.getPoints(160);
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );

      // Line Ring
      const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const ringLine = new THREE.Line(ringGeometry, lineMaterial);
      ringGroup.add(ringLine);

      // Orbiting Neon Particles along track
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const pt = curve.getPoint(i / particleCount);
        particlePositions[i * 3] = pt.x;
        particlePositions[i * 3 + 1] = pt.y;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color(colorHex),
        size: 0.12,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const ringParticles = new THREE.Points(particleGeo, particleMat);
      ringGroup.add(ringParticles);

      rootGroup.add(ringGroup);

      return {
        group: ringGroup,
        speed: speedMultiplier
      };
    };

    // 3 Unique Tilted Concentric Orbits
    const ring1 = createOrbitalRing(3.5, 3.2, Math.PI * 0.38, Math.PI * 0.15, Math.PI * 0.2, "#00f5c8", 45, 0.006);
    const ring2 = createOrbitalRing(4.1, 3.8, -Math.PI * 0.28, Math.PI * 0.35, -Math.PI * 0.1, "#38bdf8", 60, -0.0045);
    const ring3 = createOrbitalRing(4.7, 4.4, Math.PI * 0.55, -Math.PI * 0.22, Math.PI * 0.45, "#818cf8", 75, 0.0035);

    // -------------------------------------------------------------
    // 5. Lighting Setup
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0x00f5c8, 2.8);
    mainDirectional.position.set(6, 4, 5);
    scene.add(mainDirectional);

    const blueBackLight = new THREE.DirectionalLight(0x3b82f6, 2.2);
    blueBackLight.position.set(-6, -3, -4);
    scene.add(blueBackLight);

    const violetRimLight = new THREE.PointLight(0xa855f7, 3.5, 20);
    violetRimLight.position.set(0, 5, -2);
    scene.add(violetRimLight);

    // -------------------------------------------------------------
    // 6. Interactive Drag & Mouse Tilt Physics
    // -------------------------------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.15;
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
      mouseTiltX = relX * 0.35;
      mouseTiltY = relY * 0.35;

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
      planetMesh.rotation.y += 0.0035;
      cloudMesh.rotation.y += 0.0055;
      cloudMesh.rotation.x = Math.sin(elapsedTime * 0.4) * 0.05;

      // Orbit rotations
      ring1.group.rotation.z += ring1.speed;
      ring2.group.rotation.z += ring2.speed;
      ring3.group.rotation.z += ring3.speed;

      // Levitation floating motion
      rootGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.18;

      // Smooth mouse interpolation & drag rotation
      rootGroup.rotation.y += (targetRotationY + mouseTiltX - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationX + mouseTiltY - rootGroup.rotation.x) * 0.08;

      // Idle slow spin if not dragging
      if (!isDragging) {
        targetRotationY += 0.0015;
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
      cloudGeometry.dispose();
      cloudMaterial.dispose();
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
        height: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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
          width: "360px",
          height: "360px",
          background: "radial-gradient(circle, rgba(0, 245, 200, 0.16) 0%, rgba(14, 165, 233, 0.1) 45%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Cyber Grid Base Aura */}
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "50%",
          transform: "translateX(-50%) rotateX(75deg)",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: "2px dashed rgba(0, 245, 200, 0.25)",
          boxShadow: "0 0 25px rgba(0, 245, 200, 0.2), inset 0 0 20px rgba(0, 245, 200, 0.15)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Three.js Canvas Container */}
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
          bottom: "12px",
          right: "16px",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.35rem 0.85rem",
          borderRadius: "var(--radius-full)",
          background: "rgba(3, 10, 26, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 245, 200, 0.25)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4), 0 0 12px rgba(0,245,200,0.15)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#00f5c8",
          letterSpacing: "0.02em",
          pointerEvents: "none",
          transition: "all 0.3s ease",
          opacity: isHovered ? 1 : 0.85
        }}
      >
        <RotateCw size={12} className="animate-spin-slow" />
        <span>Hành Tinh Lập Trình 3D • Kéo Để Xoay</span>
      </div>

      {/* Floating Orbital Stats Pill */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.35rem 0.85rem",
          borderRadius: "var(--radius-full)",
          background: "rgba(3, 10, 26, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#38bdf8",
          pointerEvents: "none"
        }}
      >
        <Orbit size={13} />
        <span>Vũ Trụ Khảo Thí 2026</span>
      </div>
    </div>
  );
}
