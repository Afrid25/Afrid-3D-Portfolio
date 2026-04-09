import { motion } from "framer-motion";

import { styles } from "../styles";
import profilePhoto from "../assets/profile-photoroom.png";

const Hero = () => {
  return (
    <section
      id='top'
      className='relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,76,76,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_22%),linear-gradient(180deg,_#0f0f0f_0%,_#141414_100%)]'
    >
      <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
        <div className='absolute left-[-8%] top-20 h-56 w-56 rounded-full bg-[#ff4c4c]/12 blur-3xl' />
        <div className='absolute bottom-8 right-[-10%] h-64 w-64 rounded-full bg-white/6 blur-3xl' />
      </div>

      <div
        className={`${styles.paddingX} relative mx-auto flex min-h-[100svh] max-w-7xl items-center py-24 pt-32`}
      >
        <div className='grid w-full gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center'>
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className='flex flex-col items-center justify-center text-center lg:items-start lg:text-left'
          >
            <h1 className={`${styles.heroHeadText} text-white`}>I AM AFRID A</h1>
            <p className='mt-5 text-lg font-medium tracking-[0.3em] text-white/70 sm:text-xl'>
              CSE Student
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className='relative mx-auto flex w-full justify-center lg:mx-0 lg:justify-end'
          >
            <div className='absolute h-[260px] w-[260px] rounded-full bg-[#ff4c4c]/18 blur-3xl sm:h-[320px] sm:w-[320px] lg:h-[420px] lg:w-[420px]' />
            <div className='relative flex aspect-square w-[260px] items-end justify-center overflow-hidden rounded-full border-4 border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_rgba(255,255,255,0.03)_46%,_rgba(0,0,0,0.34)_100%)] shadow-[0_40px_100px_-40px_rgba(255,76,76,0.45)] sm:w-[320px] lg:w-[420px]'>
              <img
                src={profilePhoto}
                alt='Afrid profile'
                className='h-full w-full translate-y-3 scale-[1.14] object-contain object-top sm:translate-y-4'
                fetchPriority='high'
                decoding='async'
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
