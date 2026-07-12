import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FaAward,
  FaBrain,
  FaChevronDown,
  FaCheckCircle,
  FaCode,
  FaDesktop,
  FaExternalLinkAlt,
  FaMedal,
  FaMicrophone,
  FaMusic,
  FaRegFilePdf,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";

import { certificateGroups } from "../../data/certificates";
import { SectionWrapper } from "../../hoc";
import { styles } from "../../styles";
import { fadeIn, textVariant } from "../../utils/motion";

const themeStyles = {
  purple: {
    color: "#8b5cf6",
    secondary: "#c084fc",
    bg: "rgba(139, 92, 246, 0.12)",
    shadow: "rgba(139, 92, 246, 0.3)",
  },
  blueGold: {
    color: "#38bdf8",
    secondary: "#fbbf24",
    bg: "rgba(56, 189, 248, 0.12)",
    shadow: "rgba(56, 189, 248, 0.26)",
  },
  green: {
    color: "#22c55e",
    secondary: "#86efac",
    bg: "rgba(34, 197, 94, 0.12)",
    shadow: "rgba(34, 197, 94, 0.26)",
  },
  amber: {
    color: "#f59e0b",
    secondary: "#fde68a",
    bg: "rgba(245, 158, 11, 0.12)",
    shadow: "rgba(245, 158, 11, 0.26)",
  },
  gold: {
    color: "#fbbf24",
    secondary: "#fde68a",
    bg: "rgba(251, 191, 36, 0.12)",
    shadow: "rgba(251, 191, 36, 0.24)",
  },
  silver: {
    color: "#cbd5e1",
    secondary: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    shadow: "rgba(148, 163, 184, 0.22)",
  },
  bronze: {
    color: "#fb923c",
    secondary: "#fdba74",
    bg: "rgba(251, 146, 60, 0.12)",
    shadow: "rgba(251, 146, 60, 0.24)",
  },
};

const iconMap = {
  award: FaAward,
  brain: FaBrain,
  code: FaCode,
  desktop: FaDesktop,
  medal: FaMedal,
  microphone: FaMicrophone,
  music: FaMusic,
  shield: FaShieldAlt,
};

const categoryIconMap = {
  "ai-tech": FaBrain,
  "tech-activity": FaCode,
  "web-development": FaCode,
  "cultural-achievement": FaMedal,
  "workshops-training": FaShieldAlt,
};

const groupThemeMap = {
  "ai-tech": themeStyles.purple,
  "tech-activity": themeStyles.blueGold,
  "web-development": themeStyles.blueGold,
  "cultural-achievement": themeStyles.amber,
  "workshops-training": themeStyles.green,
};

const CertificatePreview = ({ certificate, compact = false }) => {
  const theme = themeStyles[certificate.theme];

  if (certificate.fileType === "summary") {
    return (
      <div
        className='flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-black/30 p-5'
        style={{ background: `linear-gradient(145deg, ${theme.bg}, rgba(255,255,255,0.035))` }}
      >
        <div
          className='h-1 w-20 rounded-full'
          style={{ background: `linear-gradient(90deg, ${theme.color}, ${theme.secondary})` }}
        />
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/45'>
            Certificate Record
          </p>
          <p className='mt-3 text-lg font-black leading-tight text-white'>{certificate.title}</p>
          <p className='mt-2 text-sm leading-6 text-white/55'>{certificate.issuer}</p>
        </div>
        <p className='text-xs font-bold uppercase tracking-[0.18em]' style={{ color: theme.color }}>
          {certificate.badge}
        </p>
      </div>
    );
  }

  if (certificate.fileType === "pdf") {
    return (
      <div
        className='flex h-full min-h-[180px] flex-col items-center justify-center gap-3 rounded-[22px] border border-white/10 bg-black/30 p-5 text-center'
        style={{ background: `linear-gradient(145deg, ${theme.bg}, rgba(255,255,255,0.03))` }}
      >
        <FaRegFilePdf className='text-4xl' style={{ color: theme.color }} aria-hidden='true' />
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/50'>
            PDF Certificate
          </p>
          <p className='mt-2 text-sm font-semibold text-white'>{certificate.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-full min-h-[180px] overflow-hidden rounded-[22px] border border-white/10 bg-black/30'>
      <img
        src={certificate.file}
        alt={`${certificate.title} certificate`}
        width='1200'
        height='900'
        className={`h-full w-full ${compact ? "object-cover" : "object-contain"} bg-white`}
        loading='lazy'
        decoding='async'
      />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent' />
    </div>
  );
};

const TimelineCertificateItem = ({ certificate, index, isLast, onOpen }) => {
  const theme = themeStyles[certificate.theme];
  const Icon = iconMap[certificate.icon] || FaAward;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 170, damping: 24, delay: index * 0.04 }}
      className='relative md:grid md:grid-cols-[72px_minmax(0,1fr)] md:gap-6'
    >
      <div className='relative hidden md:block'>
        {!isLast ? (
          <span
            className='absolute left-1/2 top-12 h-[calc(100%+24px)] w-px -translate-x-1/2 bg-gradient-to-b from-white/20 via-white/10 to-transparent'
            aria-hidden='true'
          />
        ) : null}
        <motion.span
          className='absolute left-1/2 top-7 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border bg-primary'
          style={{ borderColor: `${theme.color}80`, boxShadow: `0 0 34px -8px ${theme.shadow}` }}
          whileHover={{ scale: 1.15 }}
        >
          <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: theme.color }} />
        </motion.span>
      </div>

      <motion.article
        layout
        className='group relative flex min-h-[220px] w-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_32px_90px_-58px_rgba(255,76,76,0.42)] transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:flex-row'
        style={{ boxShadow: `0 30px 90px -62px ${theme.shadow}` }}
      >
        <div
          className='absolute inset-x-0 top-0 h-1'
          style={{
            background: `linear-gradient(90deg, ${theme.color}, ${theme.secondary})`,
          }}
        />

        <div className='sm:w-[34%] sm:min-w-[240px] lg:min-w-[300px]'>
          <CertificatePreview certificate={certificate} compact />
        </div>

        <div className='flex flex-1 flex-col p-2 pt-5 sm:p-5'>
          <div className='mb-4 flex flex-wrap items-center gap-2'>
            <span
              className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border text-lg'
              style={{
                color: theme.color,
                backgroundColor: theme.bg,
                borderColor: `${theme.color}55`,
              }}
            >
              <Icon aria-hidden='true' />
            </span>
            <span
              className='inline-flex min-h-[34px] items-center rounded-full border px-3 text-xs font-bold uppercase tracking-[0.16em]'
              style={{
                color: theme.secondary,
                backgroundColor: theme.bg,
                borderColor: `${theme.color}55`,
              }}
            >
              {certificate.badge}
            </span>
            <span className='inline-flex min-h-[34px] items-center rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-bold uppercase tracking-[0.16em] text-white/60'>
              {certificate.categoryLabel}
            </span>
            {certificate.verified ? (
              <span className='inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200'>
                <FaCheckCircle aria-hidden='true' /> Verified
              </span>
            ) : null}
            {certificate.id === "bteb-computer-office" ? (
              <span className='inline-flex min-h-[34px] items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 text-xs font-black uppercase tracking-[0.16em] text-emerald-100'>
                BTEB
              </span>
            ) : null}
          </div>

          <h3 className='text-[20px] font-bold leading-tight tracking-[-0.02em] text-white'>
            {certificate.title}
          </h3>
          <p className='mt-3 text-sm font-semibold text-white/72'>{certificate.issuer}</p>
          <p className='mt-1 text-xs leading-5 text-white/45'>{certificate.issuerDetail}</p>

          <p className='mt-4 text-[14px] leading-7 text-white/62'>{certificate.caption}</p>

          <div className='mt-5 grid gap-2 text-xs text-white/48 sm:grid-cols-2'>
            <p>
              <span className='text-white/75'>Date:</span> {certificate.date}
            </p>
            {certificate.grade ? (
              <p>
                <span className='text-white/75'>Grade:</span>{" "}
                <span className='font-black' style={{ color: theme.color }}>
                  {certificate.grade}
                </span>
              </p>
            ) : null}
            {certificate.duration ? (
              <p>
                <span className='text-white/75'>Duration:</span> {certificate.duration}
              </p>
            ) : null}
            {certificate.location || certificate.venue ? (
              <p>
                <span className='text-white/75'>Place:</span>{" "}
                {certificate.location || certificate.venue}
              </p>
            ) : null}
          </div>

          <div className='mt-auto flex flex-wrap gap-3 pt-6'>
            <button
              type='button'
              onClick={() => onOpen(certificate)}
              className='inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition duration-300 hover:border-white/25 hover:bg-white/10'
            >
              Quick View
            </button>
            {certificate.file ? (
              <a
                href={certificate.file}
                target='_blank'
                rel='noreferrer'
                className='inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-primary transition duration-300 hover:-translate-y-0.5'
                style={{
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.secondary})`,
                }}
              >
                View Certificate <FaExternalLinkAlt className='text-xs' aria-hidden='true' />
              </a>
            ) : null}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

const CategoryAccordionCard = ({ group, isOpen, onToggle, onOpenCertificate, index }) => {
  const theme = groupThemeMap[group.id] || themeStyles.purple;
  const Icon = categoryIconMap[group.id] || FaAward;
  const panelId = `${group.id}-certificates-panel`;

  return (
    <motion.section
      layout
      variants={fadeIn("up", "spring", index * 0.07, 0.65)}
      className='overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] shadow-[0_28px_90px_-68px_rgba(56,189,248,0.65)]'
      style={
        isOpen
          ? {
              background:
                "linear-gradient(#111327, #111327) padding-box, linear-gradient(135deg, #8b5cf6, #38bdf8, #f59e0b) border-box",
              borderColor: "transparent",
              boxShadow: `0 30px 110px -70px ${theme.shadow}`,
            }
          : undefined
      }
    >
      <motion.button
        type='button'
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        className='group flex w-full flex-col gap-5 p-5 text-left transition duration-300 sm:flex-row sm:items-center sm:justify-between sm:p-6'
      >
        <div className='flex min-w-0 gap-4'>
          <span
            className='flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border text-2xl'
            style={{
              color: theme.color,
              backgroundColor: theme.bg,
              borderColor: `${theme.color}55`,
              boxShadow: isOpen ? `0 0 42px -24px ${theme.color}` : undefined,
            }}
          >
            <Icon aria-hidden='true' />
          </span>

          <span className='min-w-0'>
            <span className='block text-xs font-semibold uppercase tracking-[0.22em] text-white/38'>
              Achievement Category
            </span>
            <span className='mt-2 block text-2xl font-black leading-tight text-white'>
              {group.title}
            </span>
            <span className='mt-2 block text-sm leading-6 text-white/56'>{group.description}</span>
          </span>
        </div>

        <span className='flex shrink-0 items-center gap-4 sm:pl-5'>
          <span>
            <span className='block text-right text-3xl font-black' style={{ color: theme.color }}>
              {group.certificates.length}
            </span>
            <span className='block text-xs font-bold uppercase tracking-[0.18em] text-white/42'>
              Certificates
            </span>
          </span>
          <span
            className='flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition group-hover:bg-white/[0.1]'
            aria-hidden='true'
          >
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.24 }}>
              <FaChevronDown />
            </motion.span>
          </span>
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            key='content'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
            className='overflow-hidden'
          >
            <motion.div
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.08 },
                },
              }}
              className='space-y-7 border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 lg:px-8'
            >
              {group.certificates.map((certificate, certificateIndex) => (
                <TimelineCertificateItem
                  key={certificate.id}
                  certificate={certificate}
                  index={certificateIndex}
                  isLast={certificateIndex === group.certificates.length - 1}
                  onOpen={onOpenCertificate}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
};

const CertificateModal = ({ certificate, onClose }) => {
  const theme = themeStyles[certificate.theme];
  const details = useMemo(
    () =>
      [
        ["Issuer", certificate.issuer],
        ["Date", certificate.date],
        ["Grade", certificate.grade],
        ["Duration", certificate.duration],
        ["Registration", certificate.registration],
        ["Venue", certificate.venue],
        ["Location", certificate.location],
        ["Partners", certificate.partners],
      ].filter(([, value]) => Boolean(value)),
    [certificate]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md'
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className='relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-primary shadow-2xl'
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className='h-1.5'
          style={{ background: `linear-gradient(90deg, ${theme.color}, ${theme.secondary})` }}
        />
        <div className='flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6'>
          <div>
            <span
              className='inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]'
              style={{
                color: theme.secondary,
                backgroundColor: theme.bg,
                borderColor: `${theme.color}55`,
              }}
            >
              {certificate.badge}
            </span>
            <h3 className='mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl'>
              {certificate.title}
            </h3>
            <p className='mt-2 text-sm text-white/58'>{certificate.caption}</p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close certificate preview'
            className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10'
          >
            <FaTimes aria-hidden='true' />
          </button>
        </div>

        <div className='grid max-h-[calc(92vh-130px)] gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]'>
          <div className='min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-black/35'>
            {certificate.fileType === "summary" ? (
              <CertificatePreview certificate={certificate} />
            ) : certificate.fileType === "pdf" ? (
              <iframe
                src={`${certificate.file}#toolbar=1&navpanes=0`}
                title={`${certificate.title} preview`}
                className='h-[72vh] min-h-[420px] w-full'
              />
            ) : (
              <img
                src={certificate.file}
                alt={`${certificate.title} certificate`}
                width='1200'
                height='900'
                className='h-full max-h-[72vh] w-full object-contain bg-white'
              />
            )}
          </div>

          <div className='space-y-3'>
            {details.map(([label, value]) => (
              <div key={label} className='rounded-[18px] border border-white/10 bg-white/[0.04] p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-white/38'>
                  {label}
                </p>
                <p className='mt-2 text-sm leading-6 text-white/78'>{value}</p>
              </div>
            ))}
            {certificate.file ? (
              <a
                href={certificate.file}
                target='_blank'
                rel='noreferrer'
                className='inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-primary transition hover:-translate-y-0.5'
                style={{
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.secondary})`,
                }}
              >
                View Full Certificate <FaExternalLinkAlt className='text-xs' aria-hidden='true' />
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CertificatesSection = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <>
      <motion.div variants={textVariant()} className='text-center sm:text-left'>
        <p className={styles.sectionSubText}>Verified Credentials</p>
        <h2 className={styles.sectionHeadText}>Certificates & Achievements.</h2>
        <motion.div
          className='mt-5 h-1 w-32 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#38bdf8] to-[#f59e0b]'
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-5 max-w-3xl text-[16px] leading-8 text-white/60'
      >
        A curated record of AI learning, software development, leadership, and structured training
        achievements. Choose a category to expand the achievement timeline and verify each
        certificate.
      </motion.p>

      <div className='mt-10 space-y-5'>
        {certificateGroups.map((group, index) => (
          <CategoryAccordionCard
            key={group.id}
            group={group}
            index={index}
            isOpen={openCategory === group.id}
            onToggle={() => setOpenCategory((current) => (current === group.id ? null : group.id))}
            onOpenCertificate={setSelectedCertificate}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedCertificate ? (
          <CertificateModal
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(CertificatesSection, "certificates", 0.03);
