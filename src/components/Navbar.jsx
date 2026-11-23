import { useEffect, useRef, useState } from "react";
import { navLinks } from "../constants/navigation";
import { siteConfig } from "../constants/siteConfig";

export default function Navbar() {
  const sheet = useRef(null);
  const [active, setActive] = useState("top");
  useEffect(() => {
    const update = () => {
      const current = navLinks.map(({ id }) => document.getElementById(id))
        .filter(Boolean).filter(el => el.getBoundingClientRect().top <= 130)
        .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
      setActive(current?.id || "top");
    };
    const wide = matchMedia("(min-width: 1024px)");
    const close = () => { if (wide.matches) sheet.current?.close(); };
    window.addEventListener("scroll", update, { passive:true });
    wide.addEventListener("change", close);
    return () => { window.removeEventListener("scroll", update); wide.removeEventListener("change", close); };
  }, []);
  const links = navLinks.map(({ id, title }) => (
    <a key={id} href={`#${id}`} onClick={() => sheet.current?.close()} aria-current={active === id ? "location" : undefined}
      className="block py-3 text-sm text-secondary hover:text-white aria-[current=location]:text-sky-300">{title}</a>
  ));
  const resume = <a href={siteConfig.resume.downloadUrl} download className="action">Resume</a>;
  return <nav aria-label="Primary" className="glass-nav fixed z-40">
    <div className="nav-inner flex min-h-16 items-center justify-between">
      <a href="#top" className="rgb-brand font-bold tracking-[.22em]">AFRID</a>
      <div className="hidden items-center gap-5 lg:flex">{links}{resume}</div>
      <button className="action lg:hidden" onClick={() => sheet.current.showModal()} aria-haspopup="dialog">Menu</button>
      <dialog ref={sheet} aria-label="Navigation" className="ml-auto mr-0 h-dvh max-h-none w-72 bg-slate-900 p-6 text-white backdrop:bg-black/60">
        <button className="action mb-3" onClick={() => sheet.current.close()}>Close menu</button>
        {links}{resume}
      </dialog>
    </div>
  </nav>;
}
