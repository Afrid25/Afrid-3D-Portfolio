import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
}) => {
  return (
    <motion.article
      variants={fadeIn("up", "spring", index * 0.12, 0.75)}
      className='flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_32px_80px_-56px_rgba(255,76,76,0.35)]'
    >
      <div className='relative h-[220px] w-full overflow-hidden rounded-[24px] sm:h-[240px]'>
        {live_link ? (
          <a
            href={live_link}
            target='_blank'
            rel='noreferrer'
            aria-label={`Open live demo for ${name}`}
            className='block h-full'
          >
            <img
              src={image}
              alt={`${name} preview`}
              className='h-full w-full object-cover transition duration-500 hover:scale-105'
              loading='lazy'
              decoding='async'
            />
          </a>
        ) : (
          <img
            src={image}
            alt={`${name} preview`}
            className='h-full w-full object-cover'
            loading='lazy'
            decoding='async'
          />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/70 via-transparent to-transparent' />
      </div>

      <div className='flex flex-1 flex-col px-2 pb-2 pt-6'>
        <h3 className='text-2xl font-semibold tracking-[-0.03em] text-white'>{name}</h3>
        <p className='mt-3 text-[15px] leading-7 text-white/62'>{description}</p>

        <div className='mt-5'>
          <p className='text-xs uppercase tracking-[0.24em] text-white/40'>Tech Stack</p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <span
                key={`${name}-${tag.name}`}
                className='rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/70'
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className='mt-auto flex flex-wrap gap-3 pt-8'>
          <a
            href={source_code_link}
            target='_blank'
            rel='noreferrer'
            aria-label={`Open GitHub repository for ${name}`}
            className='inline-flex min-h-[46px] flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10'
          >
            GitHub
          </a>
          {live_link ? (
            <a
              href={live_link}
              target='_blank'
              rel='noreferrer'
              aria-label={`Open live demo for ${name}`}
              className='inline-flex min-h-[46px] flex-1 items-center justify-center rounded-full bg-[#ff4c4c] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(255,76,76,0.8)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff6262]'
            >
              Live Demo
            </a>
          ) : (
            <span className='inline-flex min-h-[46px] flex-1 items-center justify-center rounded-full border border-dashed border-white/10 px-5 text-sm font-semibold text-white/40'>
              Demo Soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Selected Work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className='w-full'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 max-w-3xl text-[16px] leading-8 text-white/60'
        >
          A small set of projects that highlight product thinking, front-end execution, and clean
          presentation across desktop and mobile screens.
        </motion.p>
      </div>

      <div className='mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${project.name}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
