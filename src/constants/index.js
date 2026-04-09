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
    id: "top",
    title: "Home",
  },
  {
    id: "about",
    title: "About",
  },
  {
    id: "journey",
    title: "Technical Journey",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Frontend Development",
    icon: web,
  },
  {
    title: "Responsive UI Design",
    icon: mobile,
  },
  {
    title: "Backend Development",
    icon: backend,
  },
  {
    title: "Product Building",
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
    name: "Git",
    icon: git,
  },
  {
    name: "Figma",
    icon: figma,
  },
  {
    name: "Docker",
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
      "Building a student productivity platform around focus, planning, and daily structure.",
      "Designing core flows in Figma before translating them into responsive React interfaces.",
      "Using product thinking to keep the experience purposeful and easy to navigate.",
    ],
  },
  {
    title: "Frontend & UI Development",
    company_name: "Independent Projects",
    icon: frontend,
    iconBg: "#1d1836",
    date: "2025 - Present",
    points: [
      "Creating responsive portfolio and project interfaces with React, Tailwind, HTML, CSS, and JavaScript.",
      "Improving spacing, readability, and component structure for cleaner user experiences.",
      "Practicing reusable UI patterns with a strong focus on mobile responsiveness.",
    ],
  },
  {
    title: "AI & Automation Experiments",
    company_name: "Personal Research",
    icon: ai,
    iconBg: "#1d1836",
    date: "2025 - Present",
    points: [
      "Exploring voice-driven and AI-assisted workflows through personal automation projects.",
      "Testing how natural interaction can improve task flow and reduce friction.",
      "Turning experiments into working prototypes with practical user-facing outcomes.",
    ],
  },
  {
    title: "Cyber Security Exploration",
    company_name: "Independent Study",
    icon: security,
    iconBg: "#1d1836",
    date: "2025 - Present",
    points: [
      "Studying networking, Linux workflows, and common security concepts alongside development.",
      "Learning how secure thinking improves product decisions from the start.",
      "Building technical depth that supports more reliable and resilient software.",
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
      "A blood donation platform that helps people search donors by group and location, request support quickly, and manage emergency response more efficiently.",
    tags: [{ name: "HTML" }, { name: "JavaScript" }, { name: "CSS" }],
    image: bloodbank,
    source_code_link: "https://github.com/Afrid25/Blood-Bank-App",
    live_link: "https://afrid25.github.io/Blood-Bank-App/",
  },
  {
    name: "Bookeeds",
    description:
      "A student productivity product focused on planning, tracking goals, and reducing distraction through a more intentional digital workflow.",
    tags: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }, { name: "PHP" }],
    image: bookeeds,
    source_code_link: "https://github.com/Afrid25/BOOK-OF-DEEDS-update-",
    live_link: "https://bookofdeeds.great-site.net/",
  },
  {
    name: "AI Controller for PC",
    description:
      "A voice-command desktop automation experiment for launching apps, running searches, and handling common computer actions with hands-free control.",
    tags: [
      { name: "Python" },
      { name: "SQL" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
    ],
    image: aicontroller,
    source_code_link: "https://github.com/Afrid25",
    live_link: "",
  },
];

export { services, technologies, experiences, testimonials, projects };
