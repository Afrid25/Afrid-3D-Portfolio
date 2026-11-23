import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { socialLinks, siteConfig } from "../constants/siteConfig";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="intro-title" className="bg-primary">
      <div className="hero-layout portfolio-wrap grid items-center gap-10 pb-14 pt-28 md:grid-cols-[1.6fr_1fr] md:py-32">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack developer and CSE student</p>
          <h1 id="intro-title" className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">Hi, I’m Afrid.</h1>
          <p className="mt-4 text-2xl sm:text-4xl">I build web applications.</p>
          <p className="mt-2 text-xs text-secondary md:hidden">CSE at IIUC</p>
          <p className="hidden md:block mt-5 max-w-xl leading-7 text-secondary">I’m MD Afrid Foisal Opu, a Computer Science and Engineering student at International Islamic University Chattogram. I work with React, Next.js, Node.js, Express.js and MongoDB.</p>
          </div>
          <div className="hero-links">
          <div className="hero-actions flex gap-2">
            <a className="action action-primary" href="#projects">View my projects</a>
            <a className="action" href={siteConfig.resume.downloadUrl} download>Download resume</a>
          </div>
          <div className="flex gap-2 mt-2">
            <a className="hero-social" aria-label="GitHub" href="https://github.com/Afrid25"><FaGithub /></a>
            <a className="hero-social" aria-label="LinkedIn" href={siteConfig.linkedInUrl} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a className="hero-social" aria-label="Facebook" href={socialLinks.find(link => link.name === "Facebook").href}><FaFacebook /></a>
          </div>
        </div>
        <div className="portrait-frame">
          <img src="/seo/afrid-profile.webp" width="853" height="1280" alt="MD Afrid Foisal Opu" fetchPriority="high" className="mx-auto aspect-[4/5] w-full max-w-xs rounded-xl border border-slate-700 bg-slate-800 object-cover object-top" />
          <span className="portrait-chip chip-top">Developer</span>
          <span className="portrait-chip chip-student">CSE Student</span>
          <span className="portrait-chip chip-bottom">Video Editor</span>
        </div>
      </div>
      <aside className="update-strip portfolio-wrap" aria-label="Upcoming updates">
        <strong>Up next</strong><div className="update-window"><span>Bookeeds development updates · Portfolio video-editing showcase</span></div>
      </aside>
    </section>
  );
}
