import { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";

import useIsMobile from "./hooks/useIsMobile";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

const SectionFallback = ({ compact = false }) => (
  <div className={`${compact ? "min-h-[160px]" : "min-h-[260px]"} w-full`} aria-hidden='true' />
);

const App = () => {
  const isMobile = useIsMobile(768);

  return (
    <BrowserRouter>
      <a
        href='#main-content'
        className='skip-link'
      >
        Skip to main content
      </a>

      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-center bg-no-repeat'>
          <Navbar />
          <Hero />
        </div>

        <main id='main-content'>
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>
          <Suspense fallback={<SectionFallback compact />}>
            <Tech />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Works />
          </Suspense>
          <div className='relative z-0'>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
            {!isMobile ? (
              <Suspense fallback={null}>
                <StarsCanvas />
              </Suspense>
            ) : null}
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
