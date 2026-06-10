"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ThemeToggle from "@/components/ThemeToggle";
import { portfolioData } from "@/data/portfolio";
import Link from "next/link";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // GSAP Entrance animations
  useGSAP(
    () => {
      // 1. Initial States
      gsap.set(".nav-logo", { opacity: 0 });
      gsap.set(".nav-right", { opacity: 0 });
      
      gsap.set(".about-page-header .tl span", { yPercent: 110 });
      gsap.set(".about-bio p", { opacity: 0, y: 20 });
      gsap.set(".about-bio .cv-btn", { opacity: 0, y: 16 });
      
      gsap.set(".about-side > div", { opacity: 0, y: 24 });
      
      // 2. Entrance Timeline
      const tl = gsap.timeline();
      
      tl.to([".nav-logo", ".nav-right"], {
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out"
      });

      tl.to(".about-page-header .tl span", {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.08,
        ease: "power3.out"
      }, "-=0.4");

      // Animate biography paragraphs
      tl.to(".about-bio p", {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6");

      tl.to(".about-bio .cv-btn", {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out"
      }, "-=0.4");

      // Timeline scroll reveal for side columns
      gsap.utils.toArray<HTMLElement>(".about-side > div").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        });
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

      // Refresh ScrollTrigger positions
      setTimeout(() => ScrollTrigger.refresh(), 200);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
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
              <Link href="/about" className="active">About</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <main className="about-page-main">
        {/* Detailed Grid layout */}
        <section className="about-page-body">
          <div className="about-grid">
            <div className="about-bio">
              {/* Sticky Header */}
              <div className="about-page-header" style={{ marginBottom: "36px" }}>
                <p className="s-label">My story</p>
                <h1 className="about-page-title">
                  <span className="tl">
                    <span>About</span>
                  </span>
                  <span className="tl">
                    <span>Me</span>
                  </span>
                </h1>
              </div>

              {portfolioData.bio.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
              
              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-btn"
                >
                  View CV
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
                
                <Link href="/" className="cv-btn" style={{ borderStyle: "dashed" }}>
                  ← Back to Home
                </Link>
              </div>
            </div>

            <div className="about-side">
              <div>
                <h3 className="detail-h">Experience</h3>
                <ul className="exp-list">
                  {portfolioData.experience.map((exp, idx) => (
                    <li key={idx} className="exp-item" style={{ flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%" }}>
                        <div className="ei-l">
                          <span className="ei-co">{exp.company}</span>
                          <span className="ei-role">{exp.role}</span>
                        </div>
                        <span className="ei-yr">{exp.years}</span>
                      </div>
                      {exp.bullets && (
                        <ul style={{ paddingLeft: "16px", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.5" }}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="detail-h">Key Achievements</h3>
                <ul className="awards-list">
                  {portfolioData.awards.map((award, idx) => (
                    <li key={idx} className="award-item">
                      <div className="aw-l">
                        <span className="aw-title">{award.title}</span>
                        <span className="aw-issuer">{award.issuer}</span>
                      </div>
                      <span className="aw-yr">{award.year}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="detail-h">Skills</h3>
                <div className="skills-row">
                  {portfolioData.skills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ borderTop: "1px solid var(--border)", marginTop: "120px" }}>
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
