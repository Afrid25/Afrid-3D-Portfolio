import { socialLinks } from "../constants/siteConfig";

const iconClassName = "h-6 w-6";
const iconTone = {
  email: "text-[#ff8c6a]",
  github: "text-white",
  facebook: "text-[#1877f2]",
  instagram: "text-[#ff6b9a]",
  twitter: "text-[#f5f5f5]",
  whatsapp: "text-[#25d366]",
  youtube: "text-[#ff3b30]",
};
const accentTone = {
  email: "group-hover:border-[#ff8c6a]/40 group-hover:bg-[#ff8c6a]/10",
  github: "group-hover:border-white/25 group-hover:bg-white/8",
  facebook: "group-hover:border-[#1877f2]/40 group-hover:bg-[#1877f2]/10",
  instagram: "group-hover:border-[#ff6b9a]/40 group-hover:bg-[#ff6b9a]/10",
  twitter: "group-hover:border-white/25 group-hover:bg-white/8",
  whatsapp: "group-hover:border-[#25d366]/40 group-hover:bg-[#25d366]/10",
  youtube: "group-hover:border-[#ff3b30]/40 group-hover:bg-[#ff3b30]/10",
};

const SocialIcon = ({ type }) => {
  switch (type) {
    case "email":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path d='M4 6h16v12H4z' stroke='currentColor' strokeWidth='1.5' />
          <path d='m4 7 8 6 8-6' stroke='currentColor' strokeWidth='1.5' />
        </svg>
      );
    case "github":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path
            d='M12 2.75a9.25 9.25 0 0 0-2.93 18.03c.46.08.63-.2.63-.45v-1.71c-2.56.56-3.1-1.09-3.1-1.09-.41-1.05-1.02-1.33-1.02-1.33-.84-.58.07-.57.07-.57.93.06 1.42.96 1.42.96.82 1.42 2.16 1.01 2.69.77.08-.61.32-1.01.58-1.25-2.04-.23-4.19-1.02-4.19-4.55 0-1 .36-1.82.95-2.46-.1-.23-.41-1.17.09-2.44 0 0 .78-.25 2.55.94a8.7 8.7 0 0 1 4.64 0c1.77-1.19 2.55-.94 2.55-.94.5 1.27.19 2.21.09 2.44.59.64.95 1.46.95 2.46 0 3.54-2.15 4.31-4.2 4.55.33.29.62.86.62 1.73v2.57c0 .25.17.54.64.45A9.25 9.25 0 0 0 12 2.75Z'
            stroke='currentColor'
            strokeWidth='1.2'
          />
        </svg>
      );
    case "facebook":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path
            d='M13.5 21v-7h2.2l.3-2.5h-2.5v-1.6c0-.72.2-1.2 1.23-1.2H16V6.45c-.2-.03-.9-.08-1.73-.08-1.71 0-2.87 1.04-2.87 2.95v2.18H9V14h2.4v7h2.1Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path
            d='M12 4.25a7.75 7.75 0 0 0-6.73 11.59L4 20l4.3-1.2A7.75 7.75 0 1 0 12 4.25Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path
            d='M9.3 8.95c.18-.4.37-.41.55-.42h.46c.16 0 .4.06.61.52.21.45.71 1.55.77 1.66.06.11.1.24.02.39-.08.16-.12.26-.24.39-.12.14-.25.3-.36.4-.12.11-.25.24-.11.48.14.23.62 1.02 1.34 1.65.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.68.75-.91.16-.24.32-.2.54-.12.23.08 1.44.68 1.69.8.25.12.42.18.48.29.06.12.06.67-.15 1.31-.2.64-1.2 1.22-1.67 1.29-.43.06-.97.09-1.56-.1-.36-.12-.82-.27-1.4-.52-2.48-1.08-4.1-3.61-4.23-3.78-.12-.16-1-1.33-1-2.53 0-1.2.63-1.8.85-2.05Z'
            stroke='currentColor'
            strokeWidth='1.2'
          />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <rect x='4.5' y='4.5' width='15' height='15' rx='4' stroke='currentColor' strokeWidth='1.5' />
          <circle cx='12' cy='12' r='3.25' stroke='currentColor' strokeWidth='1.5' />
          <circle cx='16.75' cy='7.25' r='.75' fill='currentColor' />
        </svg>
      );
    case "youtube":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path
            d='M19.8 8.17a2.12 2.12 0 0 0-1.5-1.5C17 6.3 12 6.3 12 6.3s-5 0-6.3.37a2.12 2.12 0 0 0-1.5 1.5C3.8 9.48 3.8 12 3.8 12s0 2.52.4 3.83a2.12 2.12 0 0 0 1.5 1.5c1.3.37 6.3.37 6.3.37s5 0 6.3-.37a2.12 2.12 0 0 0 1.5-1.5c.4-1.31.4-3.83.4-3.83s0-2.52-.4-3.83Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <path d='m10.25 14.85 4.15-2.85-4.15-2.85v5.7Z' fill='currentColor' />
        </svg>
      );
    case "twitter":
      return (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className={`${iconClassName} ${iconTone[type]}`}
          aria-hidden='true'
        >
          <path
            d='M4.75 5.5h3.43l3.42 4.9 4.25-4.9h3.4l-5.95 6.86L20 18.5h-3.43l-3.75-5.37-4.66 5.37h-3.4l6.35-7.33L4.75 5.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      );
    default:
      return null;
  }
};

const activeLinks = socialLinks.filter(({ enabled, href }) => enabled && href);

const SocialLinks = ({ className = "" }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${className}`.trim()}>
      {activeLinks.map((link) => {
        const isExternal = !link.href.startsWith("mailto:");

        return (
          <a
            key={link.name}
            href={link.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            aria-label={`${link.name}: ${link.description}`}
            className='group flex min-h-[148px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-black/20 px-4 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4c4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]'
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition duration-300 ${accentTone[link.icon] || ""}`}
            >
              <SocialIcon type={link.icon} />
            </span>
            <span className='mt-4'>
              <span className='block text-sm font-semibold uppercase tracking-[0.16em] text-white'>
                {link.name}
              </span>
              <span className='mt-2 block text-xs leading-6 text-white/45'>{link.description}</span>
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
