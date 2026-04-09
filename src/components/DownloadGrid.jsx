import { featuredDownloads, siteConfig } from "../constants/siteConfig";

const ResourceIcon = ({ type }) => {
  if (type === "cube") {
    return (
      <svg viewBox='0 0 24 24' fill='none' className='h-6 w-6 text-[#915EFF]' aria-hidden='true'>
        <path d='m12 3.75 7 4.04v8.08l-7 4.04-7-4.04V7.79l7-4.04Z' stroke='currentColor' strokeWidth='1.5' />
        <path d='M12 12 5 7.8M12 12l7-4.2M12 12v7.9' stroke='currentColor' strokeWidth='1.5' />
      </svg>
    );
  }

  return (
    <svg viewBox='0 0 24 24' fill='none' className='h-6 w-6 text-[#915EFF]' aria-hidden='true'>
      <path d='M7.5 3.75h6.5L18.75 8.5v11.75h-11.5V3.75Z' stroke='currentColor' strokeWidth='1.5' />
      <path d='M14 3.75V8.5h4.75M12 11.25v5.5M9.75 14.5 12 16.75l2.25-2.25' stroke='currentColor' strokeWidth='1.5' />
    </svg>
  );
};

const DownloadGrid = ({ className = "" }) => {
  return (
    <div className={`grid grid-cols-1 gap-4 xl:grid-cols-2 ${className}`.trim()}>
      {featuredDownloads.map((item) => (
        <article
          key={item.title}
          className='rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_-40px_rgba(145,94,255,0.45)]'
        >
          <div className='flex items-start gap-4'>
            <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#915EFF]/10'>
              <ResourceIcon type={item.icon} />
            </span>
            <div>
              <p className='text-sm uppercase tracking-[0.24em] text-secondary'>Resource</p>
              <h3 className='mt-2 text-2xl font-bold text-white'>{item.title}</h3>
              <p className='mt-3 text-sm leading-7 text-secondary'>{item.description}</p>
            </div>
          </div>

          <div className='mt-6 flex flex-wrap gap-3'>
            <a
              href={item.href}
              download
              className='inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#915EFF] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#7c4af0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]'
            >
              {item.cta}
            </a>

            {item.title === "Recruiter Resume" ? (
              <a
                href={siteConfig.resume.previewUrl}
                className='inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#915EFF]/70 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]'
              >
                {siteConfig.resume.previewLabel}
              </a>
            ) : (
              <a
                href='#top'
                className='inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#915EFF]/70 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]'
              >
                Preview in Hero
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default DownloadGrid;
