import { portfolioData } from "@/data/portfolio";

export default function Marquee() {
  const items = [...portfolioData.skills, ...portfolioData.skills];

  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((skill, index) => (
          <span key={index} className="mq-item">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
