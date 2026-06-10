"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import Preloader from "@/components/Preloader";
import ThemeToggle from "@/components/ThemeToggle";
import { portfolioData } from "@/data/portfolio";
import Link from "next/link";
import Image from "next/image";

// Register ScrollTrigger and MotionPath client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

interface Slide {
  company: string;
  year: string;
  name: string;
  desc: string;
  tags: string[];
  metrics: { val: string; label: string }[];
  link: string;
  image: string;
  caption: string;
  num: string;
}

const slides: Slide[] = [
  ...portfolioData.projects.map((project) => ({
    company: project.company,
    year: project.year,
    name: project.name,
    desc: project.desc,
    tags: project.tags,
    metrics: project.metrics.map((m) => ({ val: m.val, label: m.label })),
    link: project.link,
    image: project.imagePath,
    caption: project.caption,
    num: project.num,
  })),
  {
    company: "Connect & Collaborate",
    year: "Available for Hire",
    name: "Let's build something together!",
    desc: "Feel free to connect on LinkedIn to discuss full-stack software development engineering (SDE), custom web applications, or collaboration opportunities. You can also explore my open-source repositories on GitHub, download my resume, or get in touch via email.",
    tags: ["LinkedIn", "GitHub", "Resume", "Email"],
    metrics: [
      { val: "LinkedIn", label: "Professional network & career updates" },
      { val: "GitHub", label: "24+ active open-source projects" },
    ],
    link: portfolioData.linkedin,
    image: "/images/explore-connect.png",
    caption: "Explore & Connect",
    num: String(portfolioData.projects.length + 1).padStart(2, "0"),
  },
];

const baseCoordinates = [
  { cx: 180, cy: 250 },
  { cx: 500, cy: 600 },
  { cx: 820, cy: 950 },
  { cx: 480, cy: 1300 },
  { cx: 160, cy: 1650 },
  { cx: 500, cy: 2000 },
  { cx: 840, cy: 2350 },
  { cx: 520, cy: 2700 },
  { cx: 180, cy: 3050 },
  { cx: 500, cy: 3400 }
];

const cardRotations = [-6, 4, -5, 8, -8, 5, -4, 7, -6, 5, -5, 6];

const cardCoordinates = slides.map((_, i) => {
  const baseLen = baseCoordinates.length;
  const cycle = Math.floor(i / baseLen);
  const baseCoord = baseCoordinates[i % baseLen];
  return {
    cx: baseCoord.cx,
    cy: baseCoord.cy + cycle * 3500
  };
});

const mobileCardStates = slides.map((_, i) => {
  const coord = cardCoordinates[i];
  return {
    scale: 2.8,
    rotate: i % 2 === 0 ? 6 : -4,
    cx: coord.cx,
    cy: coord.cy
  };
});

const getDesktopScale = (index: number) => {
  const scales = [2.5, 1.9, 2.4, 2.0, 1.6, 1.8, 1.5, 1.7, 1.4];
  return scales[index % scales.length];
};

const getDesktopRotate = (index: number) => {
  const rotations = [20, -5, 8, -4, 5, -6, 4, -3, 5];
  return rotations[index % rotations.length];
};

const generatePath = (x1: number, y1: number, x2: number, y2: number, index: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cp1x = x1 + dx * 0.3;
  const cp1y = y1 + (index % 2 === 0 ? -60 : 60);
  const cp2x = x1 + dx * 0.7;
  const cp2y = y2 + (index % 2 === 0 ? 60 : -60);
  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
};

export default function WorkPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const xToRef = useRef<any>(null);
  const yToRef = useRef<any>(null);

  // Resize listener to detect mobile vs desktop layouts dynamically
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll listener for sticky floating nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add scroll-snap styling class to body while on this page
  useEffect(() => {
    document.documentElement.classList.add("work-page-active");
    return () => {
      document.documentElement.classList.remove("work-page-active");
    };
  }, []);

  // Copy email utility
  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // useGSAP: Entrance animations and Desktop ScrollTrigger
  useGSAP(
    () => {
      if (!preloaderDone) return;

      // 1. Initial states of nav elements
      gsap.set(".nav-logo", { opacity: 0 });
      gsap.set(".nav-right", { opacity: 0 });
      
      const entryTl = gsap.timeline();
      entryTl.to([".nav-logo", ".nav-right"], {
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out"
      });

      // Shared helper for fading detail panels on desktop
      const setupPanelFades = (timeline: gsap.core.Timeline) => {
        const panels = gsap.utils.toArray(".work-details-panel");
        panels.forEach((panel: any, idx: number) => {
          // First panel is fully visible initially, others are hidden
          gsap.set(panel, { 
            opacity: idx === 0 ? 1 : 0, 
            pointerEvents: idx === 0 ? "auto" : "none" 
          });
          
          if (idx > 0) {
            // Fade out previous, fade in current mid-transition
            timeline.to(panels[idx - 1] as HTMLElement, { 
              opacity: 0, 
              pointerEvents: "none", 
              duration: 0.35, 
              ease: "power2.inOut" 
            }, idx - 0.5)
            .to(panel, { 
              opacity: 1, 
              pointerEvents: "auto", 
              duration: 0.35, 
              ease: "power2.inOut" 
            }, idx - 0.5);
          }
        });
      };

      if (!isMobile) {
        const paths = pathsRef.current;
        if (!paths || paths.length === 0) return;

        // Camera panning quickTo interpolations
        xToRef.current = gsap.quickTo(".pov-pan", "x", { duration: 1.3, ease: "expo" });
        yToRef.current = gsap.quickTo(".pov-pan", "y", { duration: 1.3, ease: "expo" });

        // Lock scale/rotate origin to the center of the SVG viewbox (500, 500)
        gsap.set(".pov-scale", { svgOrigin: "500 500" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-page",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
          onUpdate: () => {
            if (xToRef.current && yToRef.current) {
              // Pan the camera relative to the center (500, 500) of the viewport
              xToRef.current(500 - Number(gsap.getProperty(".focal-point", "x")));
              yToRef.current(500 - Number(gsap.getProperty(".focal-point", "y")));
            }
          },
          defaults: { duration: 1, ease: "none" },
        });

        // Larger zoom scale values suited for desktop screens
        const firstRotate = getDesktopRotate(0);
        const firstScale = getDesktopScale(0);

        tl.to(".focal-point", { motionPath: paths[0], immediateRender: true }, 0)
          .fromTo(
            ".pov-scale",
            { scale: firstScale, rotate: firstRotate, svgOrigin: "500 500" },
            { rotate: getDesktopRotate(1), scale: getDesktopScale(1), svgOrigin: "500 500", ease: "sine.inOut" },
            0
          );

        // Dynamically add subsequent paths and animations to the timeline
        for (let i = 1; i < slides.length - 1; i++) {
          const targetScale = getDesktopScale(i + 1);
          const targetRotate = getDesktopRotate(i + 1);
          
          tl.to(".focal-point", { motionPath: paths[i] }, i)
            .to(".pov-scale", { rotate: targetRotate, scale: targetScale, svgOrigin: "500 500", ease: "sine.inOut" }, i);
        }

        setupPanelFades(tl);

        // Initial position setup for camera pan (centered at 500, 500)
        gsap.set(".pov-pan", {
          x: 500 - Number(gsap.getProperty(".focal-point", "x")),
          y: 500 - Number(gsap.getProperty(".focal-point", "y")),
        });
      }

      setTimeout(() => ScrollTrigger.refresh(), 300);
    },
    { scope: containerRef, dependencies: [preloaderDone, isMobile] }
  );

  // useGSAP: Mobile state-driven arrow transitions
  useGSAP(
    () => {
      if (!preloaderDone || !isMobile) return;

      const targetState = mobileCardStates[activeIndex];

      // Animate Camera position
      gsap.to(".pov-pan", {
        x: 500 - targetState.cx,
        y: 500 - targetState.cy,
        duration: 0.85,
        ease: "power2.inOut",
        overwrite: "auto"
      });

      // Animate Zoom/Rotation
      gsap.to(".pov-scale", {
        scale: targetState.scale,
        rotate: targetState.rotate,
        svgOrigin: "500 500",
        duration: 0.85,
        ease: "power2.inOut",
        overwrite: "auto"
      });

      // Fade detail panels
      const panels = gsap.utils.toArray(".work-details-panel");
      panels.forEach((panel: any, idx: number) => {
        gsap.to(panel, {
          opacity: idx === activeIndex ? 1 : 0,
          pointerEvents: idx === activeIndex ? "auto" : "none",
          duration: 0.45,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      });
    },
    { scope: containerRef, dependencies: [preloaderDone, isMobile, activeIndex] }
  );

  return (
    <div ref={containerRef} className="work-page">
      {/* Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Nav */}
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">
          {portfolioData.name.toLowerCase().replace(/\s+/g, "")}
        </Link>
        <div className="nav-right">
          <ul className="nav-links">
            <li>
              <Link href="/work" className="active">Work</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      {/* Metadata Detail Panel (Left column on desktop) */}
      <div className="work-details-container">
        {slides.map((slide, idx) => (
          <div key={idx} className="work-details-panel">
            <div className="w-detail-header">
              <p className="w-detail-company">{slide.company}</p>
              <span className="w-detail-year">{slide.year}</span>
            </div>
            <h2 className="w-detail-title">{slide.name}</h2>
            <p className="w-detail-desc">{slide.desc}</p>
            
            <div className="w-detail-tags">
              {slide.tags.map((tag, tIdx) => (
                <span key={tIdx} className="w-detail-tag">{tag}</span>
              ))}
            </div>
            
            <div className="w-detail-metrics">
              {slide.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="w-detail-metric">
                  <span className="w-detail-metric-val">{metric.val}</span>
                  <span className="w-detail-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
            
            <div className="w-detail-actions">
              {idx === slides.length - 1 ? (
                <div className="cf-email-row" style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                  <a href={slide.link} target="_blank" rel="noopener noreferrer" className="cv-btn">
                    Connect on LinkedIn
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 12L12 2M12 2H4M12 2V10" />
                    </svg>
                  </a>
                  <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="cv-btn secondary-btn" style={{ marginLeft: "4px" }}>
                    View GitHub
                  </a>
                  <a href={`mailto:${portfolioData.email}`} className="cv-btn secondary-btn">
                    Email Me
                  </a>
                  <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copyEmail} aria-label="Copy email">
                    {copied ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <svg width="10" height="10" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M2 7l3.5 3.5L11 3" />
                        </svg>
                        Copied!
                      </span>
                    ) : "Copy"}
                  </button>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="cv-btn secondary-btn">
                    Download CV
                  </a>
                </div>
              ) : (
                <a href={slide.link} target="_blank" rel="noopener noreferrer" className="cv-btn">
                  View Live Project
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12L12 2M12 2H4M12 2V10" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed SVG Polaroid Canvas (Right 70% viewport on desktop) */}
      <div className="work-canvas-container">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g className="pov-scale">
            <g className="pov-pan">
              {/* Dynamic Collage of Polaroids */}
              {slides.map((slide, index) => {
                const { cx, cy } = cardCoordinates[index];
                return (
                  <foreignObject
                    key={index}
                    x={cx - 120}
                    y={cy - 150}
                    width={240}
                    height={300}
                    transform={`rotate(${cardRotations[index % cardRotations.length]}, ${cx}, ${cy})`}
                    className="polaroid-fo"
                  >
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="polaroid-card-link"
                      style={{ display: "block", width: "100%", height: "100%" }}
                    >
                      <div className="polaroid-card">
                        <div className="polaroid-image-container">
                          <Image
                            src={slide.image}
                            alt={slide.name}
                            fill
                            unoptimized
                            priority={index === 0}
                            className="polaroid-image"
                          />
                        </div>
                        <div className="polaroid-caption">
                          <span className="caption-text">{slide.caption}</span>
                        </div>
                      </div>
                    </a>
                  </foreignObject>
                );
              })}

              {/* Curved Motion Paths (invisible tracker paths, mapped exactly to coordinates) */}
              <g className="motion-paths" fill="none" stroke="none">
                {slides.map((_, i) => {
                  if (i === slides.length - 1) return null;
                  const c1 = cardCoordinates[i];
                  const c2 = cardCoordinates[i + 1];
                  const pathD = generatePath(c1.cx, c1.cy, c2.cx, c2.cy, i);
                  return (
                    <path
                      key={i}
                      ref={(el) => { if (el) pathsRef.current[i] = el; }}
                      d={pathD}
                    />
                  );
                })}
              </g>
              
              {/* Invisible Focal Point Circle tracked by GSAP */}
              <circle className="focal-point" r="0" fill="none" cx="0" cy="0" />
            </g>
          </g>
        </svg>

        {/* Mobile Arrow Navigation Controls */}
        {isMobile && (
          <div className="mobile-controls">
            <button
              className="mobile-arrow prev"
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous Project"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              className="mobile-arrow next"
              onClick={() => setActiveIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={activeIndex === slides.length - 1}
              aria-label="Next Project"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Normal Window Scroll Spacers with Snap triggers (Desktop Only) */}
      {!isMobile && (
        <div className="container-snap">
          {slides.map((_, i) => (
            <section key={i} id={`s${i + 1}`}></section>
          ))}
        </div>
      )}
    </div>
  );
}
