import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Globe3D({ size = 350 }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Globe geometry
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);

    // Create gradient texture for globe
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Gradient background
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "#1E293B");
    gradient.addColorStop(0.5, "#0F172A");
    gradient.addColorStop(1, "#020617");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add grid lines
    ctx.strokeStyle = "rgba(249, 115, 22, 0.2)";
    ctx.lineWidth = 1;

    // Latitude lines
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i / 12) * 512);
      ctx.lineTo(512, (i / 12) * 512);
      ctx.stroke();
    }

    // Longitude lines
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo((i / 12) * 512, 0);
      ctx.lineTo((i / 12) * 512, 512);
      ctx.stroke();
    }

    // Add some "city" dots
    ctx.fillStyle = "#F97316";
    const cities = [
      [180, 120], [220, 200], [300, 180], [120, 280], [400, 300],
      [150, 150], [350, 250], [80, 350], [450, 150], [280, 380],
      [100, 200], [380, 100], [200, 400], [320, 320], [60, 280],
    ];
    for (const [x, y] of cities) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add glow around dots
    ctx.shadowColor = "#F97316";
    ctx.shadowBlur = 15;
    for (const [x, y] of cities) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);

    // Globe material
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Add orbital ring
    const ringGeometry = new THREE.TorusGeometry(1.4, 0.01, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Second orbital ring
    const ring2 = ring.clone();
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.z = Math.PI / 4;
    ring2.scale.set(0.9, 0.9, 0.9);
    scene.add(ring2);

    // Particles (stars)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.8 + Math.random() * 0.5;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xf97316, 0.5);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      globe.rotation.y += 0.003;
      atmosphere.rotation.y += 0.003;
      glow.rotation.y += 0.003;
      ring.rotation.z += 0.002;
      ring2.rotation.z -= 0.001;
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = { renderer, animationId };

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    />
  );
}
