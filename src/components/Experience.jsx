import { motion } from "framer-motion";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ExperienceCard = ({ experience, index }) => (
  <motion.article
    variants={fadeIn("up", "spring", index * 0.12, 0.75)}
    className='flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_-50px_rgba(255,76,76,0.28)]'
  >
    <div className='flex items-center justify-between gap-4'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30'>
        <img
          src={experience.icon}
          alt={experience.company_name}
          className='h-7 w-7 object-contain'
          loading='lazy'
          decoding='async'
        />
      </div>
      <span className='text-xs uppercase tracking-[0.24em] text-white/40'>{experience.date}</span>
    </div>

    <h3 className='mt-6 text-2xl font-semibold tracking-[-0.03em] text-white'>
      {experience.title}
    </h3>
    <p className='mt-2 text-sm uppercase tracking-[0.24em] text-white/45'>
      {experience.company_name}
    </p>

    <ul className='mt-6 space-y-3'>
      {experience.points.map((point, pointIndex) => (
        <li
          key={`${experience.title}-${pointIndex}`}
          className='flex gap-3 text-sm leading-7 text-white/65'
        >
          <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4c4c]' />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </motion.article>
);

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Growth Areas</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Technical Journey.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mx-auto mt-4 max-w-3xl text-center text-[16px] leading-8 text-white/60'
      >
        Four areas that shape how I learn, design, and build as a developer.
      </motion.p>

      <div className='mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {experiences.map((experience, index) => (
          <ExperienceCard key={`experience-${index}`} experience={experience} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "journey");
