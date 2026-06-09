export interface Project {
  id: string;
  num: string;
  company: string;
  name: string;
  year: string;
  tags: string[];
  link: string;
  metrics: { val: string; label: string }[];
  gradientClass: string;
  imagePath: string;
  isWip?: boolean;
  desc: string;
  caption: string;
}

export interface Experience {
  company: string;
  role: string;
  years: string;
  location?: string;
  bullets?: string[];
}

export interface Award {
  title: string;
  issuer: string;
  year: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  leetcode: string;
  bio: string[];
  projects: Project[];
  experience: Experience[];
  awards: Award[];
  skills: string[];
}

export const portfolioData: PortfolioData = {
  name: "Aryan Verma",
  title: "Fullstack AI Developer",
  location: "Chandigarh, India",
  email: "aryan2k13@gmail.com",
  phone: "+917973695450",
  github: "https://github.com/AR13202",
  linkedin: "https://www.linkedin.com/in/aryan-verma-in/",
  leetcode: "https://leetcode.com/Aryan545/",
  bio: [
    "I am a Fullstack AI Developer specializing in building scalable web applications and integrating advanced AI capabilities with robust serverless backends. With 2+ years of hands-on experience, I focus on bridging the gap between immersive user interfaces and high-performance serverless backends.",
    "My engineering approach is performance-first. I focus on optimizing cloud architectures, reducing Next.js bundle sizes by 40%, designing secure systems, and embedding intelligent AI-driven features for seamless workflows.",
    "I take ownership of the entire development lifecycle—from backend microservices and database query optimization to intuitive frontend interfaces and AI pipelines. I build secure, low-latency applications that solve complex business problems."
  ],
  projects: [
    {
      id: "ikarus-delta",
      num: "01",
      company: "Ikarus 3D",
      name: "SaaS Configurator & Analytics Dashboard",
      year: "2024 - 2026",
      tags: ["Next.js", "Cognito RBAC", "AWS Lambda", "DynamoDB"],
      link: "https://app.ikarusdelta.com/",
      metrics: [
        { val: "−40%", label: "Next.js bundle size reduction" },
        { val: "−30%", label: "Cold start latency optimization" }
      ],
      gradientClass: "p-gymondo1",
      imagePath: "/images/ikarusdelta-case.png",
      desc: "A performance-optimized SaaS dashboard featuring role-based access control (RBAC), serverless backend microservices, and cached database queries to minimize response times.",
      caption: "SaaS Dashboard"
    },
    {
      id: "globetrotters",
      num: "02",
      company: "Personal Project",
      name: "GlobeTrotters Multiplayer Quiz",
      year: "2024",
      tags: ["Vite", "React", "Node.js", "Socket.io", "Express"],
      link: "https://github.com/AR13202/GlobeTrotters",
      metrics: [
        { val: "Real-time", label: "Multiplayer room state synchronization" },
        { val: "Low Latency", label: "WebSocket-based connection" }
      ],
      gradientClass: "p-caixabank",
      imagePath: "/images/globetrotters-case.png",
      desc: "A real-time multiplayer quiz game using Socket.io and Node.js/Express with room-based state management, enabling seamless interactive gameplay for solo and group users.",
      caption: "GlobeTrotters Quiz"
    },
    {
      id: "ppf-visualizer",
      num: "03",
      company: "Global Hitech Films",
      name: "Paint Protection Film Visualizer",
      year: "2025",
      tags: ["React", "Zustand", "State Optimization", "WebGL"],
      link: "https://globalhitechfilms.com/ppf/visualizer",
      metrics: [
        { val: "60 FPS", label: "Smooth rendering on mobile devices" },
        { val: "Optimized", label: "State synchronization & layout performance" }
      ],
      gradientClass: "p-zattoo",
      imagePath: "/images/ppf-case.png",
      desc: "An interactive web visualizer optimized for paint protection film customizations with smooth performance, centralized Zustand state management, and optimized asset loading.",
      caption: "PPF Visualizer"
    },
    {
      id: "alliance-engineering",
      num: "04",
      company: "Alliance Engineering",
      name: "Premium Corporate Engineering Platform",
      year: "2025",
      tags: ["Next.js", "Vanilla CSS", "Responsive UI", "SEO"],
      link: "https://www.allianceengineeringco.com/",
      metrics: [
        { val: "100%", label: "SEO and performance score on Lighthouse" },
        { val: "Pixel-Perfect", label: "Responsive design across all screen sizes" }
      ],
      gradientClass: "p-nt-onboarding",
      imagePath: "/images/alliance-case.png",
      desc: "High-performance corporate engineering platform optimized for search engine visibility, fast load times, and pixel-perfect responsiveness.",
      caption: "Corporate Platform"
    },
    {
      id: "alliance-inventory",
      num: "05",
      company: "Alliance Engineering",
      name: "Internal Inventory Management System",
      year: "2025",
      tags: ["Fullstack", "Next.js", "MySQL", "RBAC"],
      link: "https://inventory.allianceengineeringco.com/login",
      metrics: [
        { val: "Secure", label: "Role-Based Access Control & secure login" },
        { val: "Optimized", label: "Database query caching & low latency" }
      ],
      gradientClass: "p-gymondo1",
      imagePath: "/images/inventory-case.png",
      desc: "Secure business inventory manager with role-based access control, relational database schemas, and optimized query pipelines.",
      caption: "Inventory System"
    },
    {
      id: "mattress-configurator",
      num: "06",
      company: "E-Commerce Integration",
      name: "Interactive Mattress Configurator",
      year: "2025",
      tags: ["Next.js", "Zustand", "E-Commerce", "UI Customizer"],
      link: "https://mattress-configurator-tf5f.vercel.app/",
      metrics: [
        { val: "Interactive", label: "Real-time layer & size customizer" },
        { val: "E-Commerce", label: "Seamless checkout state integration" }
      ],
      gradientClass: "p-caixabank",
      imagePath: "/images/mattress-case.png",
      desc: "A premium web customizer engine for custom mattress configuration with real-time state synchronization and e-commerce checkout flow integration.",
      caption: "Mattress Configurator"
    },
    {
      id: "solar-system",
      num: "07",
      company: "Personal Project",
      name: "Solar System 3D Visualization",
      year: "2024",
      tags: ["React", "WebGL", "Interactive Camera", "R3F"],
      link: "https://github.com/AR13202/solar-system",
      metrics: [
        { val: "Interactive", label: "Planet close-up views & camera transitions" },
        { val: "Realistic", label: "Dynamic orbital paths & space lighting" }
      ],
      gradientClass: "p-zattoo",
      imagePath: "/images/solarsystem-case.png",
      desc: "An interactive solar system web visualization featuring realistic lighting, asteroid belts, and smooth transitions to explore planets in detail.",
      caption: "Solar System"
    },
    {
      id: "pricing-calculator",
      num: "08",
      company: "AI SaaS Integration",
      name: "AI-Powered Pricing & Quote Calculator",
      year: "2025",
      tags: ["Next.js", "AI Cost Algorithms", "React", "Responsive UI"],
      link: "https://pricing-calculator-pi.vercel.app/",
      metrics: [
        { val: "AI-Driven", label: "Dynamic resource pricing estimation" },
        { val: "Instant", label: "Real-time quote breakdown charts" }
      ],
      gradientClass: "p-nt-onboarding",
      imagePath: "/images/pricing-calculator-case.png",
      desc: "An AI-oriented SaaS resource pricing calculator featuring dynamic breakdown charts, configurable AI model metrics, and responsive state handling.",
      caption: "Pricing Calculator"
    },
    {
      id: "active-configurator",
      num: "09",
      company: "Ikarus 3D",
      name: "Active SaaS Product Configurator Engine",
      year: "2024 - 2025",
      tags: ["Next.js", "Shopify Integration", "Odoo Integration", "REST APIs"],
      link: "https://active.ikarusdelta.com/product/1/1",
      metrics: [
        { val: "E-Commerce", label: "Shopify & Odoo third-party integration" },
        { val: "Flexible", label: "REST APIs for remote configurator embedding" }
      ],
      gradientClass: "p-gymondo1",
      imagePath: "/images/active-case.png",
      desc: "An embeddable configurator engine integrated with Shopify and Odoo e-commerce systems via custom REST APIs, expanding market reach.",
      caption: "Active Configurator"
    }
  ],
  experience: [
    {
      company: "Ikarus 3D",
      role: "Software Development Engineer - 2",
      years: "Sep 2025 - Mar 2026",
      location: "Mohali, Punjab, India",
      bullets: [
        "Optimized mobile performance across complex full-stack web interfaces built with React and Next.js, improving rendering efficiency, asset loading, and state management via Zustand.",
        "Reduced application build size by 40% through advanced bundle optimization in Vite/Next.js, dependency auditing, dynamic imports, and monorepo restructuring — significantly improving load performance.",
        "Architected and implemented CRM integration features using Python, AWS API Gateway, Lambda functions, and DynamoDB, increasing product usability and customer workflow efficiency by 30%.",
        "Refactored and modularized the frontend codebase within a monorepo architecture, improving scalability, code reusability, and long-term maintainability while reducing technical debt.",
        "Led and mentored a team of 6 engineers, owning end-to-end feature delivery and architectural decisions across a scalable SaaS platform built using React, Next.js, TypeScript, and Node.js."
      ]
    },
    {
      company: "Ikarus 3D",
      role: "Software Development Engineer - 1",
      years: "Aug 2024 - Sep 2025",
      location: "Mohali, Punjab, India",
      bullets: [
        "Implemented Role-Based Access Control (RBAC), authentication, and authorization by using AWS Cognito and Next.js, resulting in secure user access management and enhanced platform security for the SaaS dashboard.",
        "Developed serverless backend by coding AWS Lambda functions and optimizing cold start time, resulting in 30% reduced latency and lower data transfer costs.",
        "Optimized Firebase queries by restructuring data and reducing redundant calls, improving data-fetching efficiency and reducing platform load times by 30%.",
        "Engineered a fully interactive, modular web configurator using React and TypeScript, enabling users to customize products via an intuitive drag-and-drop interface with real-time rendering.",
        "Integrated third-party e-commerce platforms (Shopify, Odoo) with the SaaS platform using Next.js and REST APIs, resulting in expanded market reach and seamless configurator embedding for users."
      ]
    },
    {
      company: "Chitkara University",
      role: "B.E. Computer Science & Engineering (CGPA: 9.90)",
      years: "Aug 2020 - Aug 2024",
      location: "Rajpura, Punjab, India",
      bullets: [
        "Specialized in Software Engineering, Data Structures & Algorithms, Object-Oriented Programming, and Databases.",
        "Graduated with Academic Excellence Award and a CGPA of 9.90/10."
      ]
    }
  ],
  awards: [
    {
      title: "Chitkara University Academic Excellence Award",
      issuer: "Chitkara University (CGPA 9.90/10)",
      year: "2024"
    },
    {
      title: "SDE Promotion to SDE-2",
      issuer: "Ikarus 3D (Led team of 6 engineers)",
      year: "2025"
    },
    {
      title: "SaaS Dashboard Launch",
      issuer: "Ikarus 3D (Engineered authentication & core analytics features)",
      year: "2024"
    }
  ],
  skills: [
    "🤖 AI Integration",
    "⚡ Next.js & React",
    "🟢 Node.js & Express",
    "🌐 TypeScript & JavaScript",
    "☁️ AWS (Lambda, Cognito, RDS, DynamoDB)",
    "🔒 Role-Based Access Control",
    "🐻 Zustand & State Management",
    "🗄️ MySQL, MongoDB & Firebase",
    "🐳 Docker",
    "🏎️ Performance & Bundle Optimization",
    "💻 C++ & Java",
    "⚙️ OOP & DSA",
    "📐 System Architecture",
    "🛠️ Git & GitHub"
  ]
};

