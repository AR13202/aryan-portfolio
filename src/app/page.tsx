"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Preloader from "@/components/Preloader";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectCard from "@/components/ProjectCard";
import Marquee from "@/components/Marquee";
import DitherBackground from "@/components/DitherBackground";
import Typewriter from "@/components/Typewriter";
import { portfolioData } from "@/data/portfolio";
import Link from "next/link";
import Image from "next/image";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const workSectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky floating nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Copy email utility
  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // GSAP animations
  useGSAP(
    () => {
      if (!preloaderDone) return;

      // 1. Initial States (hidden by default to prevent flashing before anims)
      gsap.set(".nav-logo", { opacity: 0 });
      gsap.set(".nav-right", { opacity: 0 });
      gsap.set(".pill", { opacity: 0, x: 32 });
      gsap.set(".hero-desc", { opacity: 0, y: 16 });
      gsap.set(".scroll-hint", { opacity: 0 });

      // Use yPercent to handle CSS transform offsets cleanly without jumping
      gsap.set(".hero-title .tl span", { yPercent: 110 });
      gsap.set(".hero-eyebrow span", { yPercent: 110 });

      gsap.set(".pcard", { opacity: 0, y: 40 });
      gsap.set(".about-bio .cv-btn", { opacity: 0, y: 16 });

      // 2. Hero Entrance Animation
      const tl = gsap.timeline();

      tl.to([".nav-logo", ".nav-right"], {
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out"
      });

      tl.to(".hero-title .tl span", {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.5");

      tl.to(".hero-eyebrow span", {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out"
      }, "-=0.8");

      tl.to(".hero-desc", {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out"
      }, "-=0.7");

      tl.to(".pill", {
        x: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6");

      tl.to(".scroll-hint", {
        opacity: 1,
        duration: 0.6
      }, "-=0.2");

      // 3. ScrollTrigger animations
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Skip scroll animations if motion is reduced
        gsap.set(".pcard, .work-resume-strip, .about-bio .cv-btn, .planet-tile, .planet-title", { opacity: 1, y: 0 });
        return;
      }

      // Section title reveals
      gsap.utils.toArray<HTMLElement>(".s-title").forEach((el) => {
        const spans = el.querySelectorAll(".tl span");
        gsap.set(spans, { yPercent: 110 });
        gsap.to(spans, {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
      });

      // Intro About ScrollTrigger reveal
      gsap.fromTo(
        "#intro-about div:first-child",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#intro-about",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        ".floating-badge",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "#intro-about",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Work section: horizontal scroll on desktop, vertical fallback on mobile
      const mm = gsap.matchMedia();

      // Mobile / Tablet: standard vertical scrolling
      mm.add("(max-width: 899px)", () => {
        // Project cards reveal
        gsap.utils.toArray<HTMLElement>(".pcard").forEach((el, i) => {
          gsap.set(el, { opacity: 0, y: 40 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        });

        // Reveal see-more-card on mobile
        const seeMoreEl = document.querySelector(".see-more-card") as HTMLElement;
        if (seeMoreEl) {
          gsap.set(seeMoreEl, { opacity: 0, y: 24 });
          gsap.to(seeMoreEl, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: seeMoreEl,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        }

        // Reveal pdf-strip on mobile
        const pdfStripEl = document.querySelector(".work-resume-strip") as HTMLElement;
        if (pdfStripEl) {
          gsap.set(pdfStripEl, { opacity: 0, y: 24 });
          gsap.to(pdfStripEl, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pdfStripEl,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        }
      });

      // Desktop: horizontal scrolling
      mm.add("(min-width: 900px)", () => {
        const track = trackRef.current;
        const workSection = workSectionRef.current;
        if (!track || !workSection) return;

        // Set initial state of cards and resume strip for stagger animation
        const cards = track.querySelectorAll(".pcard, .see-more-card");
        gsap.set(cards, { opacity: 0, y: 40 });
        gsap.set(".work-resume-strip", { opacity: 0, y: 24 });

        // Stagger fade-in / slide-up on entry
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: workSection,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });

        // Fade in resume strip on entry
        gsap.to(".work-resume-strip", {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: workSection,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });

        // Horizontal scrolling pin with entry and exit pauses
        const scrollDist = track.scrollWidth - window.innerWidth + 88;
        const extraPadding = window.innerWidth * 0.4; // 40% of viewport width for buffer pauses

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: workSection,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollDist + extraPadding}`,
            invalidateOnRefresh: true,
          }
        });

        // 1. Initial pause (before moving tiles)
        scrollTimeline.to({}, { duration: 0.15 });

        // 2. Animate tiles horizontally
        scrollTimeline.to(track, {
          x: () => -scrollDist,
          ease: "none",
          duration: 0.70
        });

        // Fade out header and resume strip towards the end of the horizontal scroll (during the last part of horizontal movement)
        scrollTimeline.to([".sticky-header", ".work-resume-strip"], {
          opacity: 0,
          duration: 0.22,
          ease: "power1.out"
        }, 0.63);

        // 3. Final pause (after moving tiles)
        scrollTimeline.to({}, { duration: 0.15 });
      });

      // Contact Headline reveal
      gsap.utils.toArray<HTMLElement>(".contact-headline .tl span").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // Contact footer reveal
      gsap.fromTo(
        ".contact-footer",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );

      // Reveal and Telescope Zoom planet tiles on scroll (All Viewports)
      const planetSection = document.getElementById("planet");
      if (planetSection) {
        const planetTiles = planetSection.querySelectorAll(".planet-tile");
        const planetTitle = planetSection.querySelector(".planet-title");

        const planetTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: planetSection,
            start: "top top",
            end: "+=2000",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        // Set initial timeline states
        planetTimeline.set(planetTitle, { opacity: 0, y: 0 });
        planetTimeline.set(planetTiles, { opacity: 0, scale: 0.6, xPercent: 0, yPercent: 0 });
        planetTimeline.set(".word-for-the", { x: 0, opacity: 1 });
        planetTimeline.set(".word-planet", { x: 0, opacity: 1 });
        planetTimeline.set(".planet-lens", {
          xPercent: -50,
          yPercent: -50,
          left: "50%",
          top: "50%",
          scale: 0.08,
          opacity: 0
        });

        // Stage 1: Reveal Section Title Wrapper & Tiles (0 to 0.2 progress)
        planetTimeline.to(planetTitle, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out"
        }, 0);

        planetTimeline.to(planetTiles, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          stagger: 0.015,
          ease: "power2.out"
        }, 0);

        // Stage 2: Slide words to make space (0.2 to 0.45 progress)
        planetTimeline.to(".word-for-the", {
          x: () => window.innerWidth < 900 ? "0px" : "-11vw",
          y: () => window.innerWidth < 900 ? "-45px" : "0px",
          duration: 0.25,
          ease: "power2.out"
        }, 0.2);

        planetTimeline.to(".word-planet", {
          x: () => window.innerWidth < 900 ? "0px" : "1vw",
          y: () => window.innerWidth < 900 ? "45px" : "0px",
          duration: 0.25,
          ease: "power2.out"
        }, 0.2);

        // Stage 3: Crab photo lens appears with fade-in (0.45 to 0.65 progress)
        planetTimeline.to(".planet-lens", {
          opacity: 1,
          scale: 0.08,
          duration: 0.2,
          ease: "power2.inOut"
        }, 0.45);

        // Stage 4: Zoom Crab Lens & Disperse Tiles (0.65 to 1.0 progress)
        const zoomStart = 0.65;
        const zoomDuration = 0.35;

        // Expand the lens to cover the entire screen
        planetTimeline.to(".planet-lens", {
          scale: 1.0,
          borderRadius: 0,
          borderWidth: 0,
          duration: zoomDuration,
          ease: "power1.in"
        }, zoomStart);

        // Translate text further out and fade away (No zoom)
        planetTimeline.to(".word-for-the", {
          x: () => window.innerWidth < 900 ? "0px" : "-15vw",
          y: () => window.innerWidth < 900 ? "-100px" : "0px",
          opacity: 0,
          duration: zoomDuration * 0.7,
          ease: "power1.out"
        }, zoomStart);

        planetTimeline.to(".word-planet", {
          x: () => window.innerWidth < 900 ? "0px" : "15vw",
          y: () => window.innerWidth < 900 ? "100px" : "0px",
          opacity: 0,
          duration: zoomDuration * 0.7,
          ease: "power1.out"
        }, zoomStart);

        // Top-left tiles dispersion (no scale)
        planetTimeline.to(".tile-mantis", { xPercent: -180, yPercent: -180, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);
        planetTimeline.to(".tile-mountain-forest", { xPercent: -150, yPercent: -160, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);
        planetTimeline.to(".tile-forest-trail", { xPercent: -220, yPercent: -60, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);

        // Bottom-left tiles dispersion (no scale)
        planetTimeline.to(".tile-leaf-macro", { xPercent: -180, yPercent: 180, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);
        planetTimeline.to(".tile-underwater", { xPercent: -150, yPercent: 160, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);

        // Bottom-middle tile dispersion (no scale)
        planetTimeline.to(".tile-dragonfly", { yPercent: 180, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);

        // Top-right tiles dispersion (no scale)
        planetTimeline.to(".tile-bird-clouds-1", { xPercent: 180, yPercent: -180, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);
        planetTimeline.to(".tile-mystic-forest", { xPercent: 180, yPercent: -60, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);

        // Bottom-right tiles dispersion (no scale)
        planetTimeline.to(".tile-space-mountain", { xPercent: 160, yPercent: 160, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);
        planetTimeline.to(".tile-bird-clouds-2", { xPercent: 180, yPercent: 180, opacity: 0, duration: zoomDuration, ease: "power1.in" }, zoomStart);

        // Mouse move parallax interaction on top of scroll zoom
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xForce = (clientX - innerWidth / 2) / (innerWidth / 2);
          const yForce = (clientY - innerHeight / 2) / (innerHeight / 2);

          planetTiles.forEach((tile) => {
            const depth = parseFloat(tile.getAttribute("data-depth") || "0.2");
            const moveX = xForce * 40 * depth;
            const moveY = yForce * 40 * depth;
            gsap.to(tile, {
              x: moveX,
              y: moveY,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto"
            });
          });
        };

        planetSection.addEventListener("mousemove", handleMouseMove);
        return () => {
          planetSection.removeEventListener("mousemove", handleMouseMove);
        };
      }

      // Refresh ScrollTrigger positions after things load
      setTimeout(() => ScrollTrigger.refresh(), 400);
    },
    { scope: containerRef, dependencies: [preloaderDone] }
  );

  return (
    <div ref={containerRef}>
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
              <Link href="/work">Work</Link>
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

      <main>
        {/* Hero Section */}
        <section id="hero">
          <DitherBackground />
          <p className="hero-eyebrow">
            <span>
              <Typewriter
                texts={[
                  "Fullstack AI Developer",
                  "AI Integration Engineer",
                  "Fullstack Engineer",
                  "Backend Developer",
                  "Software Developer"
                ]}
                delay={60}
                pause={2500}
                infinite={true}
              />
            </span>
          </p>

          <h1 className="hero-title">
            <span className="tl">
              <span>{portfolioData.name.split(" ")[0]}</span>
            </span>
            <span className="tl">
              <span>{portfolioData.name.split(" ")[1]}</span>
            </span>
          </h1>

          <div className="hero-bottom">
            <p className="hero-desc">
              <span>{portfolioData.bio[0]}</span>
            </p>
            <div className="hero-right">
              <div className="pill available">
                <span className="pill-dot"></span>Available for work
              </div>
              <div className="pill">{portfolioData.location}</div>
            </div>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <div className="sh-line"></div>
            <span>Scroll</span>
          </div>
        </section>

        {/* Marquee Ticker */}
        <Marquee />

        {/* Intro About Section */}
        <section id="intro-about">
          <div>
            <p className="s-label">Who I am</p>
            <h2 className="intro-about-title">
              <span className="tl">
                <span>About Me</span>
              </span>
            </h2>
            <p className="intro-about-desc">
              {portfolioData.bio[1]}
            </p>
            <Link href="/about" className="cv-btn">
              Read Full Story
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12L12 2M12 2H4M12 2V10" />
              </svg>
            </Link>
          </div>

          <div className="intro-about-badges">
            <span className="floating-badge badge-1">🚀 Three.js & R3F</span>
            <span className="floating-badge badge-2">⚡ Next.js</span>
            <span className="floating-badge badge-3">⚛️ React</span>
            <span className="floating-badge badge-4">🖥️ WebGL</span>
            <span className="floating-badge badge-5">🌐 TypeScript</span>
            <span className="floating-badge badge-6">☁️ AWS Lambda</span>
            <span className="floating-badge badge-7">🟢 Node.js</span>
            <span className="floating-badge badge-8">🐻 Zustand</span>
            <span className="floating-badge badge-9">🗄️ MySQL & DynamoDB</span>
            <span className="floating-badge badge-10">🎨 Tailwind CSS</span>
            <span className="floating-badge badge-11">🛠️ Git & GitHub</span>
            <span className="floating-badge badge-12">🏎️ Perf Optimization</span>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" ref={workSectionRef}>
          <div className="s-header sticky-header">
            <div>
              <p className="s-label">Selected Projects</p>
              <h2 className="s-title">
                <span className="tl">
                  <span>Work</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="projects-track-container">
            <div className="projects-track" ref={trackRef}>
              {portfolioData.projects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}

              <Link href="/work" className="see-more-card" style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
                <div className="pdf-strip">
                  <div>
                    <p className="pdf-strip-title">
                      Explore More
                    </p>
                    <p className="pdf-strip-desc">
                      Check out my other web experiments, custom projects, and interactive layouts on the dedicated work page.
                    </p>
                  </div>
                  <span className="cv-btn">
                    Explore Work
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12L12 2M12 2H4M12 2V10" />
                    </svg>
                  </span>
                </div>
              </Link>

            </div>
          </div>

          {/* Resume Strip */}
          <div className="pdf-strip work-resume-strip">
            <div>
              <p className="pdf-strip-title">
                Looking for details?
              </p>
              <p className="pdf-strip-desc">
                You can download my full resume for comprehensive details about my technical skills, professional history, and project architectures.
              </p>
            </div>
            <a
              href={`/resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-btn"
            >
              View Resume
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12L12 2M12 2H4M12 2V10" />
              </svg>
            </a>
          </div>
        </section>

        {/* Planet Section */}
        <section id="planet">
          <div className="planet-content">
            <h2 className="planet-title">
              <span className="word-for-the">have an</span>
              <span className="planet-lens">
                <Image
                  src="/images/planet/solarsystem-center.png"
                  alt="Solar System Focus"
                  fill
                  unoptimized
                  priority
                />
              </span>
              <span className="word-planet">idea?</span>
            </h2>
          </div>

          <div className="planet-tiles">
            {/* Tile 1: Mantis */}
            <div className="planet-tile tile-mantis" data-depth="0.15">
              <Image src="/images/planet/ikarusdelta-dark-dashboard.png" alt="Ikarus 3D Client Dashboard" fill unoptimized />
            </div>

            {/* Tile 2: Mountain Forest */}
            <div className="planet-tile tile-mountain-forest" data-depth="0.3">
              <Image src="/images/planet/inv-dashboard.png" alt="InvPro Inventory Dashboard" fill unoptimized />
            </div>

            {/* Tile 3: Forest Trail */}
            <div className="planet-tile tile-forest-trail" data-depth="0.25">
              <Image src="/images/planet/ppf-cyber.png" alt="PPF Cybertruck Customizer" fill unoptimized />
            </div>

            {/* Tile 4: Leaf Macro */}
            <div className="planet-tile tile-leaf-macro" data-depth="0.4">
              <Image src="/images/planet/alliance-landing.png" alt="Alliance Corporate Platform" fill unoptimized />
            </div>

            {/* Tile 5: Underwater */}
            <div className="planet-tile tile-underwater" data-depth="0.2">
              <Image src="/images/planet/ikarusdelta-bathtub.png" alt="Ikarus 3D Configurator Editor" fill unoptimized />
            </div>

            {/* Tile 6: Dragonfly */}
            <div className="planet-tile tile-dragonfly" data-depth="0.35">
              <Image src="/images/planet/mattress-exploded.png" alt="Mattress Exploded Layers" fill unoptimized />
            </div>

            {/* Tile 7: Mystic Forest */}
            <div className="planet-tile tile-mystic-forest" data-depth="0.1">
              <Image src="/images/planet/ikarusdelta-analytics.png" alt="Ikarus 3D Analytics Dashboard" fill unoptimized />
            </div>

            {/* Tile 8: Bird Clouds (Top Right) */}
            <div className="planet-tile tile-bird-clouds-1" data-depth="0.2">
              <Image src="/images/planet/active-selector.png" alt="3D Desk Customizer Selector" fill unoptimized />
            </div>

            {/* Tile 9: Space Mountain */}
            <div className="planet-tile tile-space-mountain" data-depth="0.3">
              <Image src="/images/planet/inv-outstanding.png" alt="InvPro Outstanding Payments" fill unoptimized />
            </div>

            {/* Tile 10: Bird Clouds (Bottom Right) */}
            <div className="planet-tile tile-bird-clouds-2" data-depth="0.45">
              <Image src="/images/planet/ppf-landing.png" alt="PPF Customizer Landing" fill unoptimized />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <p className="s-label">Get in touch</p>

          <div className="contact-headline">
            <span className="tl">
              <span>Say hi!</span>
            </span>
            <span className="tl">
              <span>
                <a href={`mailto:${portfolioData.email}`} data-cursor="hi">
                  Let&apos;s talk{" "}
                  <svg
                    width="0.7em"
                    height="0.7em"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "0.12em",
                    }}
                  >
                    <path
                      d="M3 15L15 3M15 3H5M15 3V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </span>
            </span>
          </div>

          <div className="contact-footer">
            <div className="cf-left">
              <div className="cf-email-row">
                <p>{portfolioData.email}</p>
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={copyEmail}
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 7l3.5 3.5L11 3" />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" />
                      <path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6" />
                    </svg>
                  )}
                </button>
              </div>
              <p>{portfolioData.location}</p>
            </div>
            <div className="cf-right">
              <a href={`mailto:${portfolioData.email}`} data-cursor="hi">
                Email
              </a>
              <a
                href={portfolioData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hi"
              >
                LinkedIn
              </a>
              <a
                href={portfolioData.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hi"
              >
                GitHub
              </a>
              <a
                href={portfolioData.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hi"
              >
                LeetCode
              </a>
            </div>
          </div>

          <p className="copy">
            © {new Date().getFullYear()} {portfolioData.name} · {portfolioData.title}
          </p>
        </section>
      </main>
    </div>
  );
}
