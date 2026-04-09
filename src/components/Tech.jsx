import { motion } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Core Stack</p>
        <h2 className={styles.sectionHeadText}>Technologies.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 max-w-3xl text-[16px] leading-8 text-white/60'
      >
        A focused toolkit for building responsive interfaces, smooth product flows, and practical
        web applications without unnecessary complexity.
      </motion.p>

      <div className='mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
        {technologies.map((technology, index) => (
          <motion.article
            key={technology.name}
            variants={fadeIn("up", "spring", index * 0.04, 0.6)}
            className='rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-5 text-center shadow-[0_20px_60px_-50px_rgba(255,76,76,0.28)]'
          >
            <img
              src={technology.icon}
              alt={technology.name}
              className='mx-auto h-11 w-11 object-contain'
              loading='lazy'
              decoding='async'
            />
            <p className='mt-4 text-sm font-medium text-white'>{technology.name}</p>
          </motion.article>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
