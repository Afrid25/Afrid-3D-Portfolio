import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { SectionWrapper } from "../hoc";
import { socialLinks } from "../constants/siteConfig";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const initialFormState = {
  name: "",
  email: "",
  message: "",
};

const contactSocialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com",
    Icon: FaLinkedinIn,
  },
  {
    name: "GitHub",
    href: socialLinks.find((link) => link.name === "GitHub")?.href || "https://github.com/Afrid25",
    Icon: FaGithub,
  },
  {
    name: "Facebook",
    href:
      socialLinks.find((link) => link.name === "Facebook")?.href || "https://www.facebook.com",
    Icon: FaFacebookF,
  },
  {
    name: "Twitter",
    href: socialLinks.find((link) => link.name === "Twitter")?.href || "https://x.com",
    Icon: FaXTwitter,
  },
];

const Contact = () => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback({ type: "idle", message: "" });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: import.meta.env.VITE_EMAILJS_TO_NAME,
          from_email: form.email,
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setForm(initialFormState);
      setFeedback({
        type: "success",
        message: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Message sending failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div variants={textVariant()} className='text-center'>
        <p className={styles.sectionSubText}>Get In Touch</p>
        <h2 className={styles.sectionHeadText}>Contact.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("up", "tween", 0.1, 0.8)}
        className='mx-auto mt-10 w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_28px_90px_-54px_rgba(255,76,76,0.3)] sm:p-10'
      >
        <form onSubmit={handleSubmit} className='mx-auto flex w-full max-w-xl flex-col gap-6'>
          <label className='flex flex-col gap-3 text-left'>
            <span className='text-sm font-semibold uppercase tracking-[0.2em] text-white/60'>
              Name
            </span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='Your Name'
              autoComplete='name'
              required
              className='min-h-[56px] rounded-2xl border border-white/10 bg-black/20 px-5 text-base text-white placeholder:text-white/35 focus:border-[#ff4c4c]/50 focus:outline-none'
            />
          </label>

          <label className='flex flex-col gap-3 text-left'>
            <span className='text-sm font-semibold uppercase tracking-[0.2em] text-white/60'>
              Email
            </span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Your Email'
              autoComplete='email'
              required
              className='min-h-[56px] rounded-2xl border border-white/10 bg-black/20 px-5 text-base text-white placeholder:text-white/35 focus:border-[#ff4c4c]/50 focus:outline-none'
            />
          </label>

          <label className='flex flex-col gap-3 text-left'>
            <span className='text-sm font-semibold uppercase tracking-[0.2em] text-white/60'>
              Message
            </span>
            <textarea
              name='message'
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder='Your Message'
              required
              className='rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-base text-white placeholder:text-white/35 focus:border-[#ff4c4c]/50 focus:outline-none'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#ff4c4c] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_-20px_rgba(255,76,76,0.8)] transition duration-300 hover:bg-[#ff6262] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {feedback.message ? (
            <p
              role='status'
              aria-live='polite'
              className={`text-center text-sm ${
                feedback.type === "success" ? "text-[#7dffb1]" : "text-[#ff9b9b]"
              }`}
            >
              {feedback.message}
            </p>
          ) : null}
        </form>

        <div className='mx-auto mt-10 max-w-xl border-t border-white/10 pt-8 text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-white/60'>
            Follow Me
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6'>
            {contactSocialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target='_blank'
                rel='noreferrer'
                aria-label={`Open ${name}`}
                className='inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:text-[#ff6262] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4c4c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]'
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
