"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeScrollScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const isDark = () => document.documentElement.classList.contains("dark");

    // Main 3D group positioned to the right on desktop, centered subtly on mobile
    const group = new THREE.Group();
    const updateGroupOffset = () => {
      const mobile = window.innerWidth < 768;
      group.position.x = mobile ? 0 : 2.1;
      group.scale.setScalar(mobile ? 0.78 : 1);
    };
    updateGroupOffset();
    scene.add(group);

    // Outer wireframe icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: isDark() ? 0x8fbc9f : 0x426451,
      wireframe: true,
      transparent: true,
      opacity: isDark() ? 0.22 : 0.16
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerMesh);

    // Inner wireframe torus knot
    const innerGeo = new THREE.TorusKnotGeometry(0.85, 0.24, 96, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark() ? 0x6ee7b7 : 0x2d4a3a,
      wireframe: true,
      transparent: true,
      opacity: isDark() ? 0.18 : 0.12
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Orbiting ring
    const ringGeo = new THREE.TorusGeometry(2.45, 0.015, 12, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark() ? 0xa7f3d0 : 0x426451,
      transparent: true,
      opacity: isDark() ? 0.25 : 0.18
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.6;
    group.add(ringMesh);

    // Floating particles across the viewport
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark() ? 0x8fbc9f : 0x426451,
      size: 0.045,
      transparent: true,
      opacity: isDark() ? 0.45 : 0.35
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Sync colors on dark/light toggle
    const updateThemeColors = () => {
      const dark = isDark();
      outerMat.color.setHex(dark ? 0x8fbc9f : 0x426451);
      outerMat.opacity = dark ? 0.22 : 0.16;
      innerMat.color.setHex(dark ? 0x6ee7b7 : 0x2d4a3a);
      innerMat.opacity = dark ? 0.18 : 0.12;
      ringMat.color.setHex(dark ? 0xa7f3d0 : 0x426451);
      ringMat.opacity = dark ? 0.25 : 0.18;
      particleMat.color.setHex(dark ? 0x8fbc9f : 0x426451);
      particleMat.opacity = dark ? 0.45 : 0.35;
    };

    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let targetScroll = 0;
    let currentScroll = 0;
    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = window.scrollY / maxScroll;
    };
    onScroll();

    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateGroupOffset();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      currentScroll += (targetScroll - currentScroll) * 0.06;
      currentMouseX += (mouseX - currentMouseX) * 0.05;
      currentMouseY += (mouseY - currentMouseY) * 0.05;

      if (!prefersReducedMotion) {
        outerMesh.rotation.y = elapsed * 0.18 + currentScroll * Math.PI * 2.2;
        outerMesh.rotation.x = elapsed * 0.1 + currentScroll * Math.PI * 1.1;

        innerMesh.rotation.y = -elapsed * 0.25 - currentScroll * Math.PI * 3;
        innerMesh.rotation.z = elapsed * 0.14 + currentScroll * 2;

        ringMesh.rotation.z = elapsed * 0.12 + currentScroll * Math.PI * 1.5;

        particles.rotation.y = elapsed * 0.03 + currentScroll * 0.6;
        particles.position.y = -currentScroll * 2.2;
      }

      // Smooth camera parallax + scroll depth
      const mobile = window.innerWidth < 768;
      const baseX = mobile ? 0 : Math.sin(currentScroll * Math.PI * 2) * -1.4 + 2.1;
      group.position.x += (baseX - group.position.x) * 0.06;
      group.position.y = Math.cos(currentScroll * Math.PI * 2) * 0.45;

      camera.position.x = currentMouseX * 0.45;
      camera.position.y = -currentMouseY * 0.35;
      camera.position.z = 7.5 - Math.sin(currentScroll * Math.PI) * 1.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
