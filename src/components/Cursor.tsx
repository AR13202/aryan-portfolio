"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [labelText, setLabelText] = useState("Guest");
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Check if device supports hover / fine pointer
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const matches = mediaQuery.matches;
    if (matches) {
      setTimeout(() => {
        setIsFinePointer(true);
      }, 0);
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    if (!matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // First movement to show cursor
    const handleFirstMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursor.style.opacity = "1";
    };

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = "1";
    };

    // Global delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, .pcard:not(.pcard--wip)");
      
      if (interactiveEl) {
        document.body.classList.add("is-hovering");
        if (interactiveEl.getAttribute("data-cursor") === "hi") {
          setLabelText("Say hi! 👋");
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, .pcard:not(.pcard--wip)");
      
      if (interactiveEl) {
        document.body.classList.remove("is-hovering");
        setLabelText("Guest");
      }
    };

    document.addEventListener("mousemove", handleFirstMove, { once: true });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("mousemove", handleFirstMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <div ref={cursorRef} className="cursor" id="cursor" aria-hidden="true">
      <div className="cursor-arrow">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 2L2 21L6.8 16.2L10.4 24L13.4 22.6L9.8 14.8L17 14.8L2 2Z"
            fill="white"
            stroke="#0C0C0B"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="cursor-label" id="cursorLabel">
        <span className="cursor-label-dot"></span>
        <span id="cursorLabelText">{labelText}</span>
      </div>
    </div>
  );
}
