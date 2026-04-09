import { motion } from "framer-motion";

import { styles } from "../styles";
import { siteConfig, profileHighlights } from "../constants/siteConfig";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>About Me</p>
        <h2 className={styles.sectionHeadText}>Clean work, clear intent.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]'
      >
        <div className='rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_90px_-52px_rgba(255,76,76,0.35)] sm:p-10'>
          <p className='max-w-2xl text-base leading-8 text-white/70 sm:text-lg'>
            {siteConfig.about}
          </p>
          <p className='mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg'>
            {siteConfig.summary}
          </p>

          <div className='mt-10 flex flex-wrap items-center gap-4'>
            <a
              href={siteConfig.resume.downloadUrl}
              download
              aria-label='Download my CV as PDF'
              className='inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#ff4c4c] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(255,76,76,0.8)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff6262] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4c4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]'
            >
              {siteConfig.resume.label}
            </a>
            <span className='text-sm uppercase tracking-[0.28em] text-white/40'>
              {siteConfig.location}
            </span>
          </div>

          <div className='mt-10 rounded-[28px] border border-white/10 bg-black/20 p-6'>
            <p className='text-sm uppercase tracking-[0.24em] text-white/40'>Availability</p>
            <p className='mt-3 text-lg font-medium text-white'>{siteConfig.availability}</p>
          </div>
        </div>

        <aside className='grid gap-4'>
          {profileHighlights.map((item) => (
            <article
              key={item.label}
              className='rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_-50px_rgba(255,76,76,0.28)]'
            >
              <p className='text-sm uppercase tracking-[0.24em] text-white/40'>{item.label}</p>
              <h3 className='mt-3 text-2xl font-semibold tracking-[-0.03em] text-white'>
                {item.value}
              </h3>
              <p className='mt-3 text-sm leading-7 text-white/60'>{item.description}</p>
            </article>
          ))}
        </aside>
      </motion.div>
    </>
  );
};

export default SectionWrapper(About, "about");
