import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import ComputersCanvas from "./canvas/Computers";

/**
 * Mobile detection hook - runs outside Canvas
 * This determines whether to show the 3D Canvas or fallback
 */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Check on mount
    checkIsMobile();
    
    // Add listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);
  
  return isMobile;
};

const Hero = () => {
  const isMobile = useIsMobile(768);

  return (
    <section className={"relative w-full h-screen mx-auto"}>
      {/* Text Content - Always visible */}
      <div
        className={`absolute inset-0 top-[70px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10 pointer-events-none`}
      >
        <div className='flex flex-col justify-center items-center mt-5 pointer-events-auto'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div className="pointer-events-auto">
          <h3 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF]'>AFRID </span>
          </h3>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I am a CSE student, truly passionate about <br className='sm:block hidden' />
             cyber security and full stack development.
          </p>
        </div>
      </div>

      {/* 
        3D Canvas - Uses CSS display to show/hide instead of conditional rendering.
        This ensures R3F context is properly initialized and prevents
        "Hooks can only be used within the Canvas component" error.
      */}
      <div 
        className="absolute inset-0"
        style={{ display: isMobile ? 'none' : 'block' }}
      >
        <ComputersCanvas />
      </div>
      
      {/* Mobile Fallback - Shows when isMobile is true */}
      {isMobile && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a2e 100%)',
          }}
        >
          {/* 
            To use a fallback image, add import at top:
            import fallbackImage from "../assets/herobg.png";
            
            Then replace this div with:
            <img src={fallbackImage} alt="Desktop Setup" className="w-full h-full object-cover opacity-80" />
          */}
          <div className="text-center px-4">
            <p className="text-white-100 text-sm sm:text-base opacity-60">
              View on desktop for 3D experience
            </p>
          </div>
        </div>
      )}
      
      {/* Scroll Indicator - Works on both mobile and desktop */}
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-20'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
