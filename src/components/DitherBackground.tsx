"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader, MAX_CLICKS } from "@/utils/circleRippleShader";

export default function DitherBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const clickIndexRef = useRef<number>(0);

  // Store uniforms ref so click listener can update them
  const uniformsRef = useRef<{
    uResolution: { value: THREE.Vector2 };
    uTime: { value: number };
    uColor: { value: THREE.Color };
    uClickPos: { value: THREE.Vector2[] };
    uClickTimes: { value: Float32Array };
    uShapeType: { value: number };
    uPixelSize: { value: number };
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Initialize Three.js Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // transparent background to blend with CSS backgrounds
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // 2. Scene & Orthographic Camera for Full-Screen Quad
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3. Initialize Custom Uniforms
    const uniforms = {
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00c96b") }, // accent green
      uClickPos: {
        value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-9999, -9999)),
      },
      uClickTimes: { value: new Float32Array(MAX_CLICKS).fill(-9999) },
      uShapeType: { value: 1 }, // 1 = Circle (SHAPE_CIRCLE)
      uPixelSize: { value: 12.0 }, // Coarse dither resolution
    };
    uniformsRef.current = uniforms;

    // 4. Create Shader Material (using GLSL3 to support Out variables)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      glslVersion: THREE.GLSL3,
      depthWrite: false,
      depthTest: false,
    });

    // 5. Plane geometry covering the viewport
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. Resize handler
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // 7. Click ripple trigger (global listener to bypass overlay pointer-events)
    const handleWindowClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top); // WebGL Y starts at bottom

        const clickPos = uniforms.uClickPos.value;
        const clickTimes = uniforms.uClickTimes.value;

        // Circular buffer override index
        const index = clickIndexRef.current % MAX_CLICKS;
        clickPos[index].set(x, y);
        clickTimes[index] = lastTimeRef.current;

        clickIndexRef.current++;
      }
    };

    window.addEventListener("click", handleWindowClick);

    // 8. Animation render loop
    const clock = new THREE.Clock();
    let animId: number;

    const render = () => {
      const elapsed = clock.getElapsedTime();
      lastTimeRef.current = elapsed;
      uniforms.uTime.value = elapsed;

      // Sync color with active theme dynamically
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (isLight) {
        uniforms.uColor.value.set("#00a854"); // Darker green in light mode for readability
      } else {
        uniforms.uColor.value.set("#00c96b"); // Vibrant green in dark mode
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    // 9. Cleanups
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("click", handleWindowClick);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "auto", // Allow clicks to pass to this container
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Allow clicks to fall through canvas to container
          opacity: 0.85,
        }}
      />
    </div>
  );
}
