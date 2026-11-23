import { Suspense, lazy, useState } from "react";
import { FaComments, FaLinkedin } from "react-icons/fa6";
import { BrowserRouter } from "react-router-dom";

import Overview from "./components/home/Overview";
import { siteConfig } from "./constants/siteConfig";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const CertificatesSection = lazy(() => import("./components/Certificates/CertificatesSection"));
const Contact = lazy(() => import("./components/Contact"));

const PortfolioChatbot = lazy(() => import("./components/chatbot/PortfolioChatbot"));

const SectionFallback = ({ compact = false }) => (
  <div className={`${compact ? "min-h-[160px]" : "min-h-[260px]"} w-full`} aria-hidden='true' />
);

function ChatLauncher() {
  const [activated, setActivated] = useState(false);
  const button = (
    <button type="button" aria-label="Open assistant" aria-expanded="false"
      onClick={() => setActivated(true)}
      className="fixed bottom-3 right-3 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#38bdf8] text-2xl text-white shadow-[0_0_42px_rgba(56,189,248,0.42)] sm:right-6 sm:h-16 sm:w-16">
      <FaComments aria-hidden="true" />
    </button>
  );
  return activated ? <Suspense fallback={button}><PortfolioChatbot /></Suspense> : button;
}

const App = () => {


  return (
    <BrowserRouter>
      <a
        href='#main-content'
        className='skip-link'
      >
        Skip to main content
      </a>

      <div className='relative z-0 bg-primary'>
        <div className='bg-primary'>
          <Navbar />
          <Hero />
          <Overview />
        </div>

        <main id='main-content'>
          <Suspense fallback={<SectionFallback />}>
            <Works />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>
          <Suspense fallback={<SectionFallback compact />}>
            <Tech />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <CertificatesSection />
          </Suspense>
          <div className='relative z-0'>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>

          </div>
        </main>
        <footer className="border-t border-slate-700">
          <div className="portfolio-wrap flex flex-wrap items-center justify-between gap-5 py-10">
            <p>© {new Date().getFullYear()} {siteConfig.name}<br />
              <span className="text-sm text-secondary">Full-stack developer</span>
            </p>
            <div className="flex flex-wrap gap-5 text-sky-300">
              <a href="https://github.com/Afrid25">GitHub</a>
              <a href={siteConfig.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5"><FaLinkedin aria-hidden="true" />LinkedIn</a>
              <a href={`mailto:${siteConfig.email}`}>Email</a>
              <a href="https://wa.me/8801849667752">WhatsApp</a>
            </div>
          </div>
        </footer>
        <ChatLauncher />
        <div className='h-20 sm:h-0' aria-hidden='true' />
      </div>
    </BrowserRouter>
  );
};

export default App;

