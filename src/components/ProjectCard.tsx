import { Project } from "@/data/portfolio";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isWip = project.isWip;

  return (
    <a
      href={isWip ? undefined : project.link}
      target={isWip ? undefined : "_blank"}
      rel={isWip ? undefined : "noopener noreferrer"}
      className={`pcard ${project.gradientClass} ${isWip ? "pcard--wip" : ""}`}
      style={{ display: "block" }}
    >
      <article className="pcard-inner">
        <div className="pcard-info">
          <div className="pcard-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span className="pnum">{project.num}</span>
            {isWip && (
              <span className="wip-badge">
                <span className="wip-badge-dot"></span>Work in progress
              </span>
            )}
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pcard-mid">
            <p className="pyear">{project.company} / {project.year}</p>
            <h3 className="pname" dangerouslySetInnerHTML={{ __html: project.name }}></h3>
          </div>

          <div className="pmetrics">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="pmetric">
                <span className="pm-val">{metric.val}</span>
                <span className="pm-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pcard-vis">
          <div className="pcard-bg"></div>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              className="pcard-img"
              src={project.imagePath}
              alt={`${project.name} cover`}
              fill
              unoptimized
              priority={project.num === "01"}
            />
          </div>
          <div className="pcard-img-overlay"></div>
          {!isWip && (
            <div className="p-arrow" aria-hidden="true" style={{ zIndex: 3 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 12L12 2M12 2H4M12 2V10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </article>
    </a>
  );
}
