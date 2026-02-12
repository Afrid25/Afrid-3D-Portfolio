import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import profilePic from "../assets/profile.jpeg";


const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-10 flex flex-col md:flex-row items-center gap-10"
      >
        {/* Text */}
        <p className="text-secondary text-[17px] max-w-3xl leading-[30px]">
          I am a CSE student and web developer passionate about building impactful digital products.
          I work with technologies like JavaScript, TypeScript, React, and Node.js to create scalable
          and user-friendly applications.

          <br /><br />

          I founded Book of Deeds, a student community platform designed to help students stay productive
          and avoid social media distraction. My goal is to build startups that compete at a global level
          and solve meaningful problems through technology.

          <br /><br />

          I believe in continuous learning, smart execution, and turning ideas into real products.
        </p>

        {/* Profile Image */}
        <div className="w-[250px] h-[250px] flex-shrink-0">
          <img
            src={profilePic}
            alt="Afrid"
            className="w-full h-full object-cover object-top rounded-2xl shadow-lg"
          />
        </div>
      </motion.div>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
