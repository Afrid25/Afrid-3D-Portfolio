import { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";

import Overview from "./components/home/Overview";
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
        <Suspense fallback={null}>
          <PortfolioChatbot />
        </Suspense>
        <div className='h-20 sm:h-0' aria-hidden='true' />
      </div>
    </BrowserRouter>
  );
};

export default App;

