import { siteConfig } from "../constants/siteConfig";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="intro-title" className="bg-primary">
      <div className="portfolio-wrap grid items-center gap-10 pb-14 pt-28 md:grid-cols-[1.6fr_1fr] md:py-32">
        <div>
          <p className="eyebrow">Full-stack developer · CSE student</p>
          <h1 id="intro-title" className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">Hi, I’m Afrid.</h1>
          <p className="mt-4 text-2xl sm:text-4xl">I build web applications.</p>
          <p className="mt-5 max-w-xl leading-7 text-secondary">I’m MD Afrid Foisal Opu, a Computer Science and Engineering student at International Islamic University Chattogram. I work with React, Next.js, Node.js, Express.js and MongoDB.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="action action-primary" href="#projects">View my projects</a>
            <a className="action" href={siteConfig.resume.downloadUrl} download>Download resume</a>
          </div>
          <div className="mt-5 flex gap-5 text-sm underline underline-offset-4">
            <a href="https://github.com/Afrid25">GitHub profile</a>
            <a href="https://www.linkedin.com/in/md-afrid-foisal-opu-0474b8307/">LinkedIn</a>
          </div>
        </div>
        <img src="/seo/afrid-profile.png" width="853" height="1280" alt="MD Afrid Foisal Opu" fetchPriority="high" className="mx-auto aspect-[4/5] w-full max-w-xs rounded-xl border border-slate-700 bg-slate-800 object-cover object-top" />
      </div>
    </section>
  );
}
