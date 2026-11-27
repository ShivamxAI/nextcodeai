import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Terminal,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Github,
  Download,
  Sun,
  Moon,
  ShieldCheck,
  Check,
  CornerDownLeft,
  RotateCcw,
  ChevronRight,
  Monitor,
  Server,
  Cloud,
  LockKeyhole,
  KeyRound,
  Fingerprint,
  ShieldOff,
  FileKey,
  BellOff,
  AlertTriangle,
  Plus,
  Circle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/nextcode/Editor";
import { content as c, snippets, GITHUB_URL, MARKETPLACE_URL } from "@/data/content";
import roadmap from "@/data/roadmap.json";
import preview from "@/assets/nextcode-preview.png.asset.json";
const Report = lazy(() => import("@/components/nextcode/Report"));
function DeferredReport() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "300px" });
  return (
    <div ref={ref}>
      {visible ? (
        <Suspense
          fallback={
            <div className="empty-report" aria-busy="true">
              <span className="section-label">{c.report.emptyBadge}</span>
            </div>
          }
        >
          <Report />
        </Suspense>
      ) : (
        <div className="empty-report">
          <span className="section-label">{c.report.emptyBadge}</span>
        </div>
      )}
    </div>
  );
}
const previewURL = preview.url.startsWith("https://")
  ? preview.url
  : `https://id-preview--201f37a2-d9d1-47b3-a4af-b91109f11abb.lovable.app${preview.url}`;
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.title },
      { property: "og:description", content: c.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: previewURL },
      { name: "twitter:image", content: previewURL },
    ],
  }),
  component: Index,
});
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  );
}
function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
function Accordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="accordion-row">
      <summary>
        {title}
        <Plus aria-hidden="true" />
      </summary>
      <p>{children}</p>
    </details>
  );
}
function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setN(value);
      return;
    }
    const interval = setInterval(
      () =>
        setN((current) => {
          if (current >= value) {
            clearInterval(interval);
            return value;
          }
          return current + 1;
        }),
      100,
    );
    return () => clearInterval(interval);
  }, [visible, value, reduced]);
  return <span ref={ref}>{n}</span>;
}
function Index() {
  const [light, setLight] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  useEffect(() => {
    const isLight = localStorage.getItem("nextcode-theme") === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -55% 0px" },
    );
    c.nav.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  function toggleTheme() {
    setLight((v) => {
      document.documentElement.classList.toggle("light", !v);
      localStorage.setItem("nextcode-theme", !v ? "light" : "dark");
      return !v;
    });
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
      />
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#" className="wordmark" aria-label="NextCode home">
            <Terminal strokeWidth={2.5} />
            {c.name}
          </a>
          <nav className="navlinks" aria-label="Main navigation">
            {c.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "active" : ""}
                aria-current={active === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
              title={light ? "Dark theme" : "Light theme"}
            >
              {light ? <Moon size={15} /> : <Sun size={15} />}
            </Button>
            <Button asChild variant="outline" size="sm" className="nav-install">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <Github />
                {c.hero.github}
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </header>
      <main id="main">
        <Hero />
        <TryIt />
        <Modes />
        <Story />
        <section id="privacy" className="section">
          <div className="container">
            <Reveal>
              <Heading {...c.privacy} />
            </Reveal>
            <div className="privacy-grid">
              {c.privacy.items.map((item, i) => {
                const Icon = [KeyRound, Fingerprint, ShieldOff, FileKey, BellOff][i] ?? ShieldCheck;
                return (
                  <Reveal key={item.title}>
                    <article className="feature">
                      <Icon />
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
            <Reveal>
              <p className="honest-note">
                <AlertTriangle />
                {c.privacy.note}
              </p>
            </Reveal>
          </div>
        </section>
        <Setup />
        <section id="models" className="section">
          <div className="container">
            <Reveal>
              <Heading {...c.models} />
              <div className="models-layout">
                <div className="model-block">
                  <span className="section-label">{c.models.localTitle}</span>
                  <h3>{c.models.localModel}</h3>
                  <p>{c.models.localDetail}</p>
                </div>
                <div className="model-block">
                  <span className="section-label">{c.models.cloudTitle}</span>
                  <div className="provider-list">
                    {c.models.providers.map((name) => (
                      <span key={name}>
                        <Circle size={5} />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="honest-note">
                <Info />
                {c.models.note}
              </p>
            </Reveal>
          </div>
        </section>
        <section id="report" className="section report-section">
          <div className="container">
            <Reveal>
              <Heading {...c.report} />
              <div className="report-method">
                <p>{c.report.method}</p>
                <div className="task-types">
                  <div>
                    <span className="eyebrow">{c.report.line}</span>
                    <p>{c.report.lineDescription}</p>
                  </div>
                  <div>
                    <span className="eyebrow">{c.report.block}</span>
                    <p>{c.report.blockDescription}</p>
                  </div>
                </div>
              </div>
              <p className="report-metrics">{c.report.metrics}</p>
            </Reveal>
            <DeferredReport />
            <h3 className="report-read-title">{c.report.read}</h3>
            {c.report.caveats.map((item) => (
              <Accordion key={item.title} title={item.title}>
                {item.text}
              </Accordion>
            ))}
          </div>
        </section>
        <section id="roadmap" className="section">
          <div className="container">
            <Reveal>
              <Heading {...c.roadmap} />
            </Reveal>
            <div className="roadmap-list">
              {roadmap.map((item, i) => (
                <Reveal key={item.id}>
                  <details className="accordion-row roadmap-row">
                    <summary>
                      <span className="roadmap-index">{String(i + 1).padStart(2, "0")}</span>
                      <span>{item.title}</span>
                      <span className="status-chip" data-status={item.status}>
                        {item.status}
                      </span>
                      <Plus aria-hidden="true" />
                    </summary>
                    <p>{item.description}</p>
                  </details>
                </Reveal>
              ))}
            </div>
            <p className="honest-note">
              <Info />
              {c.roadmap.note}
            </p>
          </div>
        </section>
        <section id="limitations" className="section">
          <div className="container limitations-layout">
            <Reveal>
              <Heading {...c.limitations} />
            </Reveal>
            <ul className="limitations-list">
              {c.limitations.items.map((item) => (
                <li key={item}>
                  <AlertTriangle />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="faq" className="section">
          <div className="container faq-layout">
            <Reveal>
              <Heading {...c.faq} />
            </Reveal>
            <div>
              {c.faq.items.map((item) => (
                <Accordion key={item.q} title={item.q}>
                  {item.a}
                </Accordion>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <a href="#" className="wordmark">
                <Terminal />
                {c.name}
              </a>
              <h2>{c.footer.headline}</h2>
            </div>
            <Button asChild>
              <a href={MARKETPLACE_URL} target="_blank" rel="noreferrer">
                <Download />
                {c.hero.install}
                <ArrowUpRight />
              </a>
            </Button>
          </div>
          <div className="footer-bottom">
            <a href="https://github.com/ShivamxAI" target="_blank" rel="noreferrer">
              {c.footer.by} <ArrowUpRight size={10} className="inline" />
            </a>
            <div className="footer-links">
              <a href={MARKETPLACE_URL} target="_blank" rel="noreferrer">
                {c.footer.marketplace}
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                {c.footer.github}
              </a>
              <a href={`${GITHUB_URL}/commits/main`} target="_blank" rel="noreferrer">
                {c.footer.changelog}
              </a>
            </div>
            <span>{c.footer.note}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
function Hero() {
  const reduced = useReducedMotion();
  const text = "def greet(name: str) -> str:\n    ";
  const [typed, setTyped] = useState(0);
  const [ghost, setGhost] = useState(false);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    if (reduced) {
      setTyped(text.length);
      setGhost(true);
      return;
    }
    const interval = setInterval(
      () =>
        setTyped((current) => {
          if (current >= text.length) {
            clearInterval(interval);
            return current;
          }
          return current + 1;
        }),
      32,
    );
    const timer = setTimeout(() => setGhost(true), 1900);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [reduced, text.length]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (
        e.key === "Tab" &&
        ghost &&
        !accepted &&
        (e.target === document.body || e.target === document.documentElement)
      ) {
        e.preventDefault();
        setAccepted(true);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [ghost, accepted]);
  return (
    <section
      className="hero"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--cursor-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--cursor-y", `${e.clientY - rect.top}px`);
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow">
            <span className="live-dot" />
            {c.hero.eyebrow}
          </div>
          <h1>
            {c.hero.headline}
            <span>{c.hero.accent}</span>
          </h1>
          <p className="hero-description">{c.hero.description}</p>
          <div className="hero-buttons">
            <Button asChild>
              <a href={MARKETPLACE_URL} target="_blank" rel="noreferrer">
                <Download />
                {c.hero.install}
                <ArrowUpRight />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <Github />
                {c.hero.github}
                <ArrowUpRight />
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#report">
                {c.hero.report}
                <ArrowDown />
              </a>
            </Button>
          </div>
          <p className="hero-footnote">
            <ShieldCheck size={11} />
            {c.hero.footnote}
          </p>
        </motion.div>
        <motion.div
          className="hero-editor"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Editor file={c.hero.file} hero accepted={accepted} lines={5}>
            <span className="code-comment"># Your next line, without the interruption.</span>
            {"\n\n"}
            <span className="code-keyword">{text.slice(0, typed)}</span>
            {ghost && (
              <span className={accepted ? "code-string" : "ghost-text"}>
                {'return f"Hello, {name}!"'}
              </span>
            )}
            <span className="caret" />
          </Editor>
        </motion.div>
        <div className="scroll-cue">
          <ArrowDown size={12} />
          {c.hero.scroll}
        </div>
      </div>
    </section>
  );
}
function TryIt() {
  const [language, setLanguage] = useState("Python");
  const [index, setIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const list = snippets[language] ?? snippets["Python"] ?? [];
  const snippet = list[index] ?? list[0];
  if (!snippet) return null;
  return (
    <section id="try-it" className="section">
      <div className="container">
        <Reveal>
          <Heading {...c.demo} />
        </Reveal>
        <Reveal className="demo-layout">
          <div>
            <div className="language-list" role="group" aria-label="Demo language">
              {Object.keys(snippets).map((name, i) => (
                <Button
                  variant="ghost"
                  key={name}
                  aria-label={name}
                  aria-pressed={name === language}
                  onClick={() => {
                    setLanguage(name);
                    setIndex(0);
                    setAccepted(false);
                  }}
                >
                  <span className="lang-mark">{["Py", "JS", "Ja", "Go", "Rb", "Ph"][i]}</span>
                  {name}
                  {language === name && <ChevronRight size={12} className="ml-auto" />}
                </Button>
              ))}
            </div>
            <p className="demo-notice">
              <Info size={12} />
              {c.demo.notice}
            </p>
            <p className="section-label mt-4">
              <Count value={6} /> languages · inline completion
            </p>
          </div>
          <div>
            <div
              tabIndex={0}
              role="group"
              aria-label="Simulated code editor"
              onKeyDown={(e) => {
                if (e.key === "Tab" && !accepted && !e.shiftKey) {
                  e.preventDefault();
                  setAccepted(true);
                }
              }}
            >
              <Editor file={snippet.file} lines={5} accepted={accepted}>
                <span className="code-keyword">{snippet.code}</span>
                <span className={accepted ? "code-string" : "ghost-text"}>{snippet.ghost}</span>
                <span className="caret" />
              </Editor>
            </div>
            <div className="demo-toolbar">
              <Button onClick={() => setAccepted(true)} disabled={accepted} size="sm">
                {accepted ? <Check /> : <CornerDownLeft />}
                {accepted ? c.demo.accepted : c.demo.accept}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIndex((index + 1) % list.length);
                  setAccepted(false);
                }}
              >
                {c.demo.next}
                <ArrowRight />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={c.demo.reset}
                title={c.demo.reset}
                onClick={() => setAccepted(false)}
              >
                <RotateCcw />
              </Button>
              <span className="demo-state">{accepted ? "" : c.demo.waiting}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function Modes() {
  const [mode, setMode] = useState<"local" | "cloud">("local");
  const [provider, setProvider] = useState("Gemini");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.8, 0.9, 1]);
  const reduced = useReducedMotion();
  const hosts: Record<string, string> = {
    Gemini: "generativelanguage.googleapis.com",
    Claude: "api.anthropic.com",
    OpenAI: "api.openai.com",
    "OpenAI-compatible": "your configured host",
  };
  return (
    <section id="modes" className="pinned-section" ref={ref}>
      <div className="pin">
        <div className="container">
          <div className="modes-heading">
            <Heading {...c.modes} />
            <div className="segment" role="group" aria-label="Completion mode">
              <Button
                variant="ghost"
                aria-pressed={mode === "local"}
                onClick={() => setMode("local")}
              >
                <Monitor />
                {c.modes.local}
              </Button>
              <Button
                variant="ghost"
                aria-pressed={mode === "cloud"}
                onClick={() => setMode("cloud")}
              >
                <Cloud />
                {c.modes.cloud}
              </Button>
            </div>
          </div>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="flow" style={{ opacity: reduced ? 1 : nodeOpacity }}>
              {mode === "local" ? (
                <div className="flow-boundary">
                  <div className="flow-node">
                    <Monitor />
                    {c.modes.editor}
                  </div>
                  <ArrowRight className="flow-arrow" />
                  <div className="flow-node">
                    <Server />
                    {c.modes.localHost}
                  </div>
                  <span className="flow-badge">
                    <ShieldCheck size={11} />
                    {c.modes.localBadge}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flow-node small">
                    <Monitor />
                    {c.modes.editor}
                  </div>
                  <ArrowRight className="flow-arrow" />
                  <div className="flow-node small">
                    <LockKeyhole />
                    {c.modes.consent}
                  </div>
                  <ArrowRight className="flow-arrow" />
                  <div className="flow-boundary">
                    <div className="flow-node small">
                      <Cloud />
                      {provider}
                    </div>
                    <span className="flow-badge">{c.modes.cloudBadge}</span>
                  </div>
                </>
              )}
            </motion.div>
            <p className="flow-caption">
              {mode === "local" ? c.modes.localDescription : c.modes.cloudDescription}
            </p>
          </motion.div>
          {mode === "cloud" && (
            <div className="flex justify-center mb-5">
              <div className="segment flex-wrap" role="group" aria-label="Cloud provider">
                {c.models.providers.map((name) => (
                  <Button
                    size="sm"
                    variant="ghost"
                    key={name}
                    aria-pressed={provider === name}
                    onClick={() => setProvider(name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="consent-preview">
            <div>
              <h3>{c.modes.consentTitle}</h3>
              <small>{c.modes.draft}</small>
            </div>
            <div>
              <p>
                {c.modes.consentText
                  .replace("{provider}", provider)
                  .replace("{host}", hosts[provider] ?? "your configured host")}
              </p>
              <div className="consent-actions" aria-label="Consent dialog wording preview">
                <span>{c.modes.cancel}</span>
                <span>{c.modes.allow}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setStep(Math.min(6, Math.max(0, Math.floor(v * 7)))),
  );
  const current = c.story.steps[step] ?? c.story.steps[0];
  if (!current) return null;
  return (
    <section id="how-it-works" className="pinned-section" ref={ref}>
      <div className="pin">
        <div className="container">
          <div className="story-layout">
            <div>
              <Heading {...c.story} />
              <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="story-step">
                  <span className="story-number">{String(step + 1).padStart(2, "0")}</span>
                  <h3>{current.title}</h3>
                </div>
                <p className="story-detail">{current.detail}</p>
              </motion.div>
              <div className="story-dots" aria-hidden="true">
                {c.story.steps.map((s, i) => (
                  <i key={s.title} className={i <= step ? "active" : ""} />
                ))}
              </div>
              {reduced && (
                <div className="mt-6">
                  {c.story.steps.slice(1).map((s) => (
                    <div key={s.title} className="mb-3">
                      <h3 className="text-sm">{s.title}</h3>
                      <p className="text-xs text-muted-foreground">{s.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Editor file="completion.py" lines={6} accepted={step === 6}>
                <span className="code-comment"># Fill in the middle</span>
                {"\n"}
                <span className="code-keyword">def greet(name: str) -&gt; str:</span>
                {"\n    "}
                {step >= 5 ? (
                  <span className={step === 6 ? "code-string" : "ghost-text"}>
                    return f"Hello, {"{name}"}!"
                  </span>
                ) : (
                  <span className="caret" />
                )}
                {"\n\n"}
                <span className="code-keyword">print</span>
                <span>(greet(</span>
                <span className="code-string">"world"</span>
                <span>))</span>
              </Editor>
              <div className="story-examples">
                <div>
                  <h4>{c.story.lineTitle}</h4>
                  <p>{c.story.lineDescription}</p>
                </div>
                <div>
                  <h4>{c.story.blockTitle}</h4>
                  <p>{c.story.blockDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Setup() {
  const [mode, setMode] = useState<"local" | "cloud">("local");
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () =>
        setProgress((v) => {
          if (v >= 100) {
            setRunning(false);
            return 100;
          }
          return Math.min(100, v + 5);
        }),
      130,
    );
    return () => clearInterval(timer);
  }, [running]);
  return (
    <section id="setup" className="section">
      <div className="container">
        <Reveal>
          <Heading {...c.setup} />
          <div className="setup-layout">
            <div>
              <div className="segment" role="group" aria-label="Setup mode">
                <Button
                  variant="ghost"
                  aria-pressed={mode === "local"}
                  onClick={() => setMode("local")}
                >
                  <Monitor />
                  {c.modes.local}
                </Button>
                <Button
                  variant="ghost"
                  aria-pressed={mode === "cloud"}
                  onClick={() => setMode("cloud")}
                >
                  <Cloud />
                  {c.modes.cloud}
                </Button>
              </div>
              <div className="setup-steps">
                {c.setup[mode].map((item, i) => (
                  <div key={item.title} className="setup-step">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="setup-tool">
              {mode === "local" ? (
                <>
                  <h3>
                    <Terminal size={15} className="inline mr-2" />
                    {c.setup.download}
                  </h3>
                  <p>{c.setup.progress}</p>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label={c.setup.download}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <motion.div
                      className="progress-fill"
                      animate={{ scaleX: progress / 100 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="setup-progress-label">
                    <span>{progress === 100 ? c.setup.complete : c.setup.progress}</span>
                    <span>{progress}%</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={running}
                    onClick={() => {
                      setProgress(0);
                      setRunning(true);
                    }}
                  >
                    <Download />
                    {c.setup.progressButton}
                  </Button>
                </>
              ) : (
                <>
                  <h3>
                    <KeyRound size={15} className="inline mr-2" />
                    {c.modes.cloud}
                  </h3>
                  <div className="provider-list">
                    {c.models.providers.map((name) => (
                      <span key={name}>
                        <Circle size={5} />
                        {name}
                      </span>
                    ))}
                  </div>
                  <p>{c.setup.cloudNote}</p>
                </>
              )}
            </div>
          </div>
          <p className="honest-note">
            <Info />
            {mode === "local" ? c.setup.localNote : c.setup.cloudNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
