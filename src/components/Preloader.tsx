"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const nameSpanRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already visited in this session
    const isVisited = sessionStorage.getItem("portfolio_visited");

    if (isVisited) {
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 0);
      return;
    }

    // First visit animation sequence
    sessionStorage.setItem("portfolio_visited", "true");

    const windowLoadedRef = { current: document.readyState === "complete" };

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onComplete();
      }
    });

    const handleLoad = () => {
      windowLoadedRef.current = true;
      if (tl.paused()) {
        tl.play();
      }
    };

    if (document.readyState !== "complete") {
      window.addEventListener("load", handleLoad);
    }

    // Reveal name
    tl.to(nameSpanRef.current, {
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    });

    // Animate loading bar to 90%
    tl.to(barRef.current, {
      width: "90%",
      duration: 1.8,
      ease: "power2.out"
    }, "-=0.4");

    // Pause here if the page is not yet fully loaded
    tl.add(() => {
      if (!windowLoadedRef.current) {
        tl.pause();
      }
    });

    // Complete the remaining 10%
    tl.to(barRef.current, {
      width: "100%",
      duration: 0.4,
      ease: "power1.out"
    });

    // Fade out and slide up preloader (hold for 0.5s before exiting)
    tl.to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut"
    }, "+=0.5");

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={preloaderRef}
      id="preloader"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}
      aria-hidden="true"
    >
      <div className="pl-name">
        <span
          ref={nameSpanRef}
          style={{
            display: "inline-block",
            transform: "translateY(110%)"
          }}
        >
          Aryan Verma
        </span>
      </div>
      <div className="pl-bar-wrap">
        <div 
          ref={barRef} 
          className="pl-bar" 
          id="plBar" 
          style={{ width: "0%", transition: "none" }}
        ></div>
      </div>
    </div>
  );
}
