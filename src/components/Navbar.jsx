import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import menuIcon from "../assets/navbar-menu.svg";
import { navLinks } from "../constants";
import { siteConfig } from "../constants/siteConfig";
import { styles } from "../styles";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavClick = (title) => {
    setActive(title);
    setOpen(false);
  };

  return (
    <nav
      aria-label='Primary'
      className={`${styles.paddingX} fixed top-0 z-40 w-full transition duration-300 ${
        scrolled ? "border-b border-white/10 bg-primary/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className='mx-auto flex w-full max-w-7xl flex-col'>
        <div className='flex items-center justify-between gap-4 py-4'>
          <a
            href='#top'
            onClick={() => handleNavClick("Home")}
            className='text-xl font-black uppercase tracking-[0.32em] text-white transition hover:text-[#ff8b8b] sm:text-2xl'
          >
            {siteConfig.shortName}
          </a>

          <ul className='hidden items-center gap-5 md:flex lg:gap-8'>
            {navLinks.map((nav) => (
              <li key={nav.id}>
                <a
                  href={`#${nav.id}`}
                  onClick={() => handleNavClick(nav.title)}
                  className={`inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-[0.18em] transition duration-300 hover:text-white ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>

          <button
            type='button'
            aria-label='Toggle navigation menu'
            aria-expanded={open}
            aria-controls='mobile-navigation'
            onClick={() => setOpen((value) => !value)}
            className='inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4c4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] md:hidden'
          >
            <img src={menuIcon} alt='menu' className='h-3 w-5 object-contain' />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id='mobile-navigation'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className='overflow-hidden md:hidden'
            >
              <motion.ul
                initial={{ y: -12 }}
                animate={{ y: 0 }}
                exit={{ y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='mt-2 flex w-full flex-col gap-2 rounded-[28px] border border-white/10 bg-primary/95 p-4 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl'
              >
                {navLinks.map((nav) => (
                  <li key={nav.id}>
                    <a
                      href={`#${nav.id}`}
                      onClick={() => handleNavClick(nav.title)}
                      className={`flex min-h-[52px] w-full items-center rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                        active === nav.title
                          ? "border-[#ff4c4c]/35 bg-[#ff4c4c]/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-secondary hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      {nav.title}
                    </a>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
