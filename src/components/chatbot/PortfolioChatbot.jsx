import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaArrowDown,
  FaBriefcase,
  FaComments,
  FaDownload,
  FaEnvelope,
  FaMicrophone,
  FaMoon,
  FaPaperPlane,
  FaSun,
  FaTelegram,
  FaTrash,
  FaWhatsapp,
  FaXmark,
} from "react-icons/fa6";

import { createLocalAssistantReply } from "../../lib/assistantEngine";
import {
  buildCompactKnowledge,
  flattenKnowledge,
  loadPortfolioKnowledge,
} from "../../lib/portfolioKnowledge";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "afrid-portfolio-chat";
const MAX_HISTORY = 20;
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 8;
const TYPING_SPEED = 14; // ms per character for streaming illusion

const DEFAULT_QUICK_PROMPTS = [
  "Quick chat with Afrid",
  "Who is Afrid?",
  "Show me your best project",
  "What tech stack do you use?",
  "Tell me about Bookeeds",
  "How can I hire you?",
  "Download your resume",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const nowTime = () =>
  new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date());

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createMessage = (role, content, actions = [], extras = {}) => ({
  id: `${role}-${uid()}`,
  role,
  content,
  actions,
  time: nowTime(),
  ...extras,
});

const getContactActions = (profile = {}) => [
  {
    label: "WhatsApp",
    type: "link",
    value: profile.links?.whatsapp || "https://wa.me/8801849667752",
  },
  {
    label: "Telegram",
    type: "link",
    value: profile.links?.telegram || "tg://resolve?phone=8801849667752",
  },
  {
    label: "Email Afrid",
    type: "link",
    value: `mailto:${profile.email || "25afridfoisal00@gmail.com"}`,
  },
];

const getActionIcon = (action) => {
  const label = (action.label || "").toLowerCase();
  if (label.includes("whatsapp")) return <FaWhatsapp aria-hidden="true" />;
  if (label.includes("telegram")) return <FaTelegram aria-hidden="true" />;
  if (label.includes("email") || label.includes("mail")) return <FaEnvelope aria-hidden="true" />;
  if (action.type === "download") return <FaDownload aria-hidden="true" />;
  if (action.type === "scroll") return <FaArrowDown aria-hidden="true" />;
  return <FaBriefcase aria-hidden="true" />;
};

/* ------------------------------------------------------------------ */
/*  Typing Indicator                                                   */
/* ------------------------------------------------------------------ */

const TypingIndicator = ({ lightMode }) => (
  <div className={`flex justify-start`}>
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl border px-4 py-3 ${
        lightMode
          ? "border-slate-200 bg-white text-slate-600"
          : "border-white/10 bg-white/[0.06] text-white/60"
      }`}
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.16 }}
          className={`h-1.5 w-1.5 rounded-full ${lightMode ? "bg-slate-500" : "bg-white/70"}`}
        />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

const PortfolioChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [mode, setMode] = useState("general");
  const [lightMode, setLightMode] = useState(false);
  const [error, setError] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);

  const requestTimes = useRef([]);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortRef = useRef(null);
  const submitMessageRef = useRef(null);

  const flatKnowledge = useMemo(
    () => (knowledge ? flattenKnowledge(knowledge) : null),
    [knowledge],
  );

  const quickPrompts =
    flatKnowledge?.profile?.assistant?.quickPrompts || DEFAULT_QUICK_PROMPTS;

  /* -------------------- Stable mobile viewport -------------------- */
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--chat-height", `${window.innerHeight}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  /* -------------------- Mobile keyboard offset -------------------- */
  useEffect(() => {
    if (!window.visualViewport) {
      return undefined;
    }

    const handler = () => {
      const offset = Math.max(0, window.innerHeight - window.visualViewport.height);
      document.documentElement.style.setProperty("--keyboard-offset", `${offset}px`);
    };

    handler();
    window.visualViewport.addEventListener("resize", handler);
    window.visualViewport.addEventListener("scroll", handler);

    return () => {
      window.visualViewport.removeEventListener("resize", handler);
      window.visualViewport.removeEventListener("scroll", handler);
    };
  }, []);

  /* -------------------- Load knowledge + history -------------------- */
  useEffect(() => {
    let active = true;

    loadPortfolioKnowledge()
      .then((data) => {
        if (!active) return;
        setKnowledge(data);

        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) {
              const repaired = parsed.map((message, index) =>
                index === 0 && message.role === "assistant"
                  ? { ...message, actions: getContactActions(data.profile) }
                  : message,
              );
              setMessages(repaired);
              return;
            }
          } catch {
            /* ignore */
          }
        }

        const greeting =
          data.profile?.assistant?.greeting ||
          "Hi, I'm Afrid's portfolio assistant. Ask me about his work, projects, skills, CV, or contact details.";

        setMessages([
          createMessage("assistant", greeting, [
            ...getContactActions(data.profile),
            { label: "Download Resume", type: "download", value: data.profile?.resume?.url },
          ]),
        ]);
      })
      .catch(() => {
        setError("Assistant knowledge is temporarily unavailable.");
      });

    if (typeof window !== "undefined") {
      setVoiceSupported(
        Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
      );
    }

    return () => {
      active = false;
      abortRef.current?.abort?.();
    };
  }, []);

  /* -------------------- Persist messages -------------------- */
  useEffect(() => {
    if (messages.length) {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(messages.slice(-MAX_HISTORY)),
        );
      } catch {
        /* storage full – ignore */
      }
    }
  }, [messages]);

  /* -------------------- Auto-scroll -------------------- */
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  /* -------------------- Unread badge -------------------- */
  useEffect(() => {
    if (!open && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") setUnread((n) => n + 1);
    } else if (open) {
      setUnread(0);
    }
  }, [messages, open]);

  const measureAndResize = useCallback((el) => {
    if (!el) {
      return;
    }

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  /* -------------------- Rate limiter -------------------- */
  const canSendMessage = useCallback(() => {
    const now = Date.now();
    requestTimes.current = requestTimes.current.filter(
      (t) => now - t < RATE_LIMIT_WINDOW,
    );
    if (requestTimes.current.length >= RATE_LIMIT_MAX) {
      setError("You're sending messages a bit fast. Please wait a few seconds.");
      return false;
    }
    requestTimes.current.push(now);
    setError("");
    return true;
  }, []);

  /* -------------------- Action runner -------------------- */
  const runAction = useCallback(
    (action) => {
      if (!action) return;

      switch (action.type) {
        case "scroll": {
          const el = document.getElementById(action.value);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setOpen(false);
          }
          break;
        }
        case "link":
          if (action.value)
            window.open(action.value, "_blank", "noopener,noreferrer");
          break;
        case "download":
          if (action.value) {
            const a = document.createElement("a");
            a.href = action.value;
            a.download = "";
            a.rel = "noopener";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
          break;
        case "prompt":
          submitMessageRef.current?.(action.value);
          break;
        default:
          break;
      }
    },
    [],
  );

  /* -------------------- Streaming animation -------------------- */
  const streamAssistantReply = useCallback((fullText, actions = []) => {
    return new Promise((resolve) => {
      const id = `assistant-${uid()}`;
      setStreamingId(id);
      setMessages((curr) => [
        ...curr,
        createMessage("assistant", "", [], { id, streaming: true }),
      ]);

      let i = 0;
      const tick = () => {
        i += Math.max(1, Math.floor(fullText.length / 120)); // adaptive
        const slice = fullText.slice(0, i);
        setMessages((curr) =>
          curr.map((m) => (m.id === id ? { ...m, content: slice } : m)),
        );
        if (i < fullText.length) {
          setTimeout(tick, TYPING_SPEED);
        } else {
          setMessages((curr) =>
            curr.map((m) =>
              m.id === id
                ? { ...m, content: fullText, actions, streaming: false }
                : m,
            ),
          );
          setStreamingId(null);
          resolve();
        }
      };
      tick();
    });
  }, []);

  /* -------------------- API call -------------------- */
  const requestAssistantReply = async (question, history) => {
    if (!knowledge) throw new Error("Knowledge not loaded");

    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message: question,
        mode,
        history: history
          .slice(-8)
          .map(({ role, content }) => ({ role, content })),
        knowledge: buildCompactKnowledge(knowledge),
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.json();
  };

  /* -------------------- Submit -------------------- */
  const submitMessage = useCallback(
    async (value) => {
      const question = (value ?? input).trim();

      if (!knowledge) {
        setError("Assistant is still loading. Try again in a moment.");
        return;
      }
      if (!question || loading || streamingId) return;
      if (!canSendMessage()) return;

      const userMessage = createMessage("user", question);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        let reply;
        try {
          reply = await requestAssistantReply(question, nextMessages);
        } catch (e) {
          if (e?.name === "AbortError") return;
          // Fallback to local engine
          reply = createLocalAssistantReply({ query: question, knowledge, mode });
          reply = { answer: reply.text, actions: reply.actions || [] };
        }

        setLoading(false);
        await streamAssistantReply(
          reply.answer || "I couldn't find an answer for that. Try asking differently?",
          reply.actions || [],
        );
      } catch {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, knowledge, loading, streamingId, messages, mode],
  );

  /* -------------------- Voice input -------------------- */
  const startVoiceInput = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [listening]);

  /* -------------------- Reset conversation -------------------- */
  const resetConversation = useCallback(() => {
    if (!knowledge) return;
    const greeting =
      knowledge.profile?.assistant?.greeting ||
      "Hi, I'm Afrid's portfolio assistant. Fresh start. What would you like to know about Afrid?";
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([
      createMessage("assistant", greeting, [
        ...getContactActions(knowledge.profile),
        { label: "Download Resume", type: "download", value: knowledge.profile?.resume?.url },
      ]),
    ]);
    setError("");
  }, [knowledge]);

  useEffect(() => {
    submitMessageRef.current = submitMessage;
  }, [submitMessage]);

  /* ------------------------------------------------------------------ */
  /*  Styling                                                           */
  /* ------------------------------------------------------------------ */
  const panelClass = lightMode
    ? "border-slate-200 bg-white/95 text-slate-950 shadow-[0_30px_100px_-35px_rgba(15,23,42,0.45)]"
    : "border-white/10 bg-[#080b16]/95 text-white shadow-[0_30px_100px_-35px_rgba(255,76,76,0.48)]";

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  const chatbot = (
    <div
      className="pointer-events-none fixed inset-x-3 z-30 flex justify-end sm:inset-x-auto sm:right-6"
      style={{ bottom: "calc(0.75rem + var(--keyboard-offset, 0px))" }}
    >
      <AnimatePresence>
        {open && (
          <motion.section
            id="portfolio-chat-panel"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Portfolio assistant chat"
            role="dialog"
            className={`pointer-events-auto mb-4 flex h-[min(720px,calc(var(--chat-height,100vh)-88px))] w-[calc(100vw-24px)] max-w-[440px] min-w-0 flex-col overflow-hidden rounded-[22px] border backdrop-blur-2xl sm:w-[420px] sm:rounded-[28px] ${panelClass}`}
          >
            {/* ---------- HEADER ---------- */}
            <header
              className={`border-b px-4 py-4 ${
                lightMode ? "border-slate-200 bg-slate-50/70" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ff4c4c] text-white shadow-[0_0_34px_rgba(255,76,76,0.45)] sm:h-11 sm:w-11">
                    <FaComments aria-hidden="true" />
                    <motion.span
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#080b16] bg-[#68ff9f]"
                    />
                  </span>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.16em]">
                      Portfolio Assistant
                    </h2>
                    <p className={lightMode ? "text-xs text-slate-500" : "text-xs text-white/45"}>
                      {loading || streamingId ? "Thinking..." : "Online - Ask me anything"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={resetConversation}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${
                      lightMode
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    } transition`}
                  >
                    <FaTrash aria-hidden="true" className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightMode((v) => !v)}
                    aria-label="Toggle theme"
                    title="Toggle theme"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${
                      lightMode
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    } transition`}
                  >
                    {lightMode ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close assistant"
                    title="Close"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${
                      lightMode
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    } transition`}
                  >
                    <FaXmark aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { id: "general", label: "General" },
                  { id: "bookeeds", label: "Ask Bookeeds" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`min-h-[38px] rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.08em] transition sm:text-xs sm:tracking-[0.14em] ${
                      mode === item.id
                        ? "border-[#ff4c4c] bg-[#ff4c4c] text-white"
                        : lightMode
                          ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </header>

            {/* ---------- MESSAGES ---------- */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-3 py-4 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-5"
            >
              <div className="space-y-4">
                {messages.map((message) => {
                  const assistant = message.role === "assistant";
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex ${assistant ? "justify-start" : "justify-end"}`}
                    >
                      <div className="max-w-[92%] sm:max-w-[88%]">
                        <div
                          className={`whitespace-pre-line break-words rounded-[20px] px-3.5 py-3 text-sm leading-6 sm:rounded-[22px] sm:px-4 ${
                            assistant
                              ? lightMode
                                ? "border border-slate-200 bg-white text-slate-700"
                                : "border border-white/10 bg-white/[0.06] text-white/80"
                              : "bg-[#ff4c4c] text-white shadow-[0_14px_36px_-22px_rgba(255,76,76,0.85)]"
                          }`}
                        >
                          {message.content}
                          {message.streaming && (
                            <motion.span
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-current"
                            />
                          )}
                        </div>
                        <div
                          className={`mt-1 px-1 text-[11px] ${
                            assistant
                              ? lightMode
                                ? "text-slate-400"
                                : "text-white/35"
                              : "text-right text-white/45"
                          }`}
                        >
                          {message.time}
                        </div>

                        {assistant && !message.streaming && message.actions?.length ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.actions.map((action, idx) => (
                              <button
                                key={`${message.id}-${action.label}-${idx}`}
                                type="button"
                                onClick={() => runAction(action)}
                                className={`inline-flex min-h-[34px] items-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${
                                  lightMode
                                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                                }`}
                              >
                                {getActionIcon(action)}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}

                {loading && <TypingIndicator lightMode={lightMode} />}
              </div>
            </div>

            {/* ---------- FOOTER ---------- */}
            <div
              className={`border-t p-3 sm:p-4 ${
                lightMode ? "border-slate-200 bg-slate-50/70" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="mb-3 flex flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(prompt)}
                    disabled={loading || !!streamingId}
                    className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition ${
                      lightMode
                        ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    } disabled:opacity-50`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {error && (
                <p className={`mb-2 text-xs ${lightMode ? "text-rose-600" : "text-[#ff9b9b]"}`}>
                  {error}
                </p>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitMessage();
                }}
                className={`flex items-end gap-2 rounded-2xl border p-2 transition ${
                  lightMode
                    ? "border-slate-200 bg-white focus-within:border-[#ff4c4c]"
                    : "border-white/10 bg-black/25 focus-within:border-[#ff4c4c]"
                }`}
              >
                <textarea
                  ref={(el) => {
                    textareaRef.current = el;
                    measureAndResize(el);
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={(e) => measureAndResize(e.target)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything about Afrid..."
                  aria-label="Type your question"
                  className={`max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none ${
                    lightMode
                      ? "text-slate-800 placeholder:text-slate-400"
                      : "text-white placeholder:text-white/35"
                  }`}
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    aria-label={listening ? "Stop voice input" : "Start voice input"}
                    title={listening ? "Stop listening" : "Voice input"}
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                      listening
                        ? "animate-pulse bg-[#ff4c4c] text-white"
                        : lightMode
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-white/10 text-white/70 hover:bg-white/15"
                    }`}
                  >
                    <FaMicrophone aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !!streamingId || !input.trim()}
                  aria-label="Send message"
                  title="Send"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4c4c] text-white shadow-[0_12px_34px_-18px_rgba(255,76,76,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPaperPlane aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ---------- FAB ---------- */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.96 }}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-controls="portfolio-chat-panel"
        aria-expanded={open}
        className="pointer-events-auto group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4c4c] text-white shadow-[0_0_42px_rgba(255,76,76,0.42)] sm:h-16 sm:w-16"
      >
        <span className="absolute inset-0 rounded-full bg-[#ff4c4c] opacity-35 blur-xl transition group-hover:opacity-55" />
        <FaComments aria-hidden="true" className="relative text-2xl" />
        {unread > 0 && !open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#ff4c4c] shadow-md"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </motion.button>
    </div>
  );

  if (typeof document === "undefined") {
    return chatbot;
  }

  return createPortal(chatbot, document.body);
};

export default PortfolioChatbot;
