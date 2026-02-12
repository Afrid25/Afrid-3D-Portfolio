import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  ai,
  frontend,
  security,
  startup,
  bloodbank,
  bookeeds,
  aicontroller,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Ler : Web Development",
    icon: web,
  },
  {
    title: "Ler : React Native Development",
    icon: mobile,
  },
  {
    title: "Ler : Backend Development",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
  title: "Founder & Developer",
  company_name: "Bookeeds",
  icon: startup,
  iconBg: "#1d1836",
  date: "2025 - Present",
  points: [
    "Conceptualized and developing a student productivity platform.",
    "Designing UI in Figma and implementing it using React.",
    "Building core features to reduce social media distraction.",
    "Experimenting with automation and smart user experience flows."
    ],
  },

  {
  title: "Frontend & UI Development",
  company_name: "Independent Projects",
  icon: frontend,
  iconBg: "#1d1836",
  date: "2025 - Present",
  points: [
    "Building responsive web applications using React, HTML, CSS, and JavaScript.",
    "Designing interfaces in Figma and converting them into functional UI.",
    "Practicing reusable components and clean code architecture.",
    "Improving user experience through interactive design patterns."
  ],
  },
  {
  title: "AI & Automation Experiments",
  company_name: "Personal Research",
  icon: ai,
  iconBg: "#1d1836",
  date: "2025 - Present",
  points: [
    "Developed a Python-based voice controller to execute system commands.",
    "Integrated speech recognition for hands-free computer interaction.",
    "Built an experimental AI chatbot for automated responses and task handling.",
    "Explored real-world applications of AI-driven workflow automation."
  ],
  },
  {
  title: "Cyber Security Exploration",
  company_name: "Independent Study",
  icon: security,
  iconBg: "#1d1836",
  date: "2025 - Present",
  points: [
    "Studying networking fundamentals and system security concepts.",
    "Exploring ethical hacking techniques and common vulnerabilities.",
    "Practicing Linux commands and security-related tools.",
    "Understanding real-world cyber attack and prevention methods."
  ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Blood For Life",
    description:
      "A web-based platform that connects blood donors and recipients, enabling users to search for blood by group and location, request donations, and manage donor information efficiently. The system aims to simplify the blood donation process and ensure timely support during emergencies.",
    tags: [
      { name: "HTML", color: "blue-text-gradient" },
      { name: "JavaScript", color: "green-text-gradient" },
      { name: "CSS", color: "pink-text-gradient" },
    ],
    image: bloodbank,
    source_code_link: "https://github.com/Afrid25/Blood-Bank-App",
    live_link: "https://afrid25.github.io/Blood-Bank-App/", // 👈 add this
  },
  {
    name: "Bookeeds",
    description:
      "Book of Deeds is a student-friendly all-in-one productivity and study management application designed to help students organize their academic activities in one place. The app allows users to manage tasks, track study goals, store notes, and plan their daily academic work efficiently, creating a structured and focused learning environment.",
    tags: [
      { name: "HTML", color: "blue-text-gradient" },
      { name: "CSS", color: "green-text-gradient" },
      { name: "JavaScript", color: "pink-text-gradient" },
      { name: "Php", color: "sky_blue-text-gradient" },
    ],
    image: bookeeds,
    source_code_link: "https://github.com/Afrid25/BOOK-OF-DEEDS-update-",
    live_link: "https://bookofdeeds.great-site.net/", // 👈 add this
  },

  {
    name: "Ai controller for pc",
    description:
      "AI Controller for PC is a voice-command-based desktop automation system that allows users to control their computer using natural speech. The application can execute system commands, open applications, perform web searches, and automate routine tasks, providing a hands-free and intelligent user experience.",
    tags: [
      {
        name: "Python",
        color: "blue-text-gradient",
      },
      {
        name: "Sql",
        color: "green-text-gradient",
      },
      {
        name: "CSS",
        color: "pink-text-gradient",
      },
      {
        name: "HTML",
        color: "red-text-gradient",
      },
      {
        name: "Java Script",
        color: "yellow-text-gradient",
      },
    ],
    image: aicontroller,
    source_code_link: "https://github.com/Afrid25",
  },
];

export { services, technologies, experiences, testimonials, projects };
