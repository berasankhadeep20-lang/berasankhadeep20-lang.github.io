import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, ExternalLink, X, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTilt } from "@/hooks/useTilt";
import { useSound } from "@/contexts/SoundContext";
import TechBadge from "@/components/TechBadge";
import { streamFromFunction } from "@/lib/streamChat";

interface Project {
  title: string;
  desc: string;
  longDesc: string;
  url: string;
  repo: string;
  tags: string[];
  emoji: string;
  highlights: string[];
  demoUrl?: string;
  image?: string;
  datePublished?: string;
  license?: string;
}

const SITE = "https://berasankhadeep20-lang.github.io";

const projects: Project[] = [
  {
    title: "F1 AI Race Predictor",
    desc: "ML system predicting Formula 1 race outcomes using historical data, driver stats, and analytics.",
    longDesc:
      "A gradient-boosted ML pipeline that ingests historical race telemetry, qualifying times, weather and driver form to forecast podium positions for upcoming Grand Prix events. Engineered with feature pipelines for circuit-specific bias and tyre strategy.",
    url: "https://github.com/berasankhadeep20-lang/F1-AI-Predictor",
    repo: "berasankhadeep20-lang/F1-AI-Predictor",
    tags: ["Python", "scikit-learn", "Pandas", "ML"],
    emoji: "🏎️",
    highlights: [
      "End-to-end data pipeline from raw race CSVs to predictions",
      "Per-circuit feature engineering (street vs permanent track)",
      "Backtested across multiple recent F1 seasons",
    ],
    datePublished: "2024-08-01",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "LLM for Stock Market",
    desc: "LLM-based project analyzing stock market data and generating financial insights.",
    longDesc:
      "Combines structured market data with LLM-powered narrative generation to surface insights, summarise earnings sentiment and produce explainable forecasts for retail investors.",
    url: "https://github.com/berasankhadeep20-lang/LLM-For-stock-market",
    repo: "berasankhadeep20-lang/LLM-For-stock-market",
    tags: ["LLM", "Finance", "NLP", "Python"],
    emoji: "📈",
    highlights: [
      "Prompt-tuned analysis of price + fundamentals",
      "Sentiment scoring on news and earnings reports",
      "Generates plain-English daily briefs",
    ],
    datePublished: "2024-10-01",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "AI Football Predictor",
    desc: "ML model predicting football match outcomes using team stats and historical metrics.",
    longDesc:
      "A classification model that predicts win/draw/loss using team strength ratings, recent form, head-to-head history, and home/away effects. Includes calibration so probabilities are usable for betting analytics or fan dashboards.",
    url: "https://github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    repo: "berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    tags: ["Python", "ML", "Sports Analytics"],
    emoji: "⚽",
    highlights: [
      "Feature set spanning ELO ratings + recent form",
      "Probability calibration via isotonic regression",
      "Multi-league training data",
    ],
    datePublished: "2025-01-15",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "Freight Rate Intelligence",
    desc: "Zero-cost freight market dashboard built on public equity proxies and Fed data — auto-updated every 6 hours.",
    longDesc:
      "Most logistics intelligence (Freightos, DAT, Baltic Exchange) is locked behind expensive APIs. Instead, this pipeline tracks publicly traded freight movers — BDRY, ZIM, XPO — as real-time proxies for the underlying rate environment. Combined with FRED macro series, it surfaces week-over-week shifts, anomaly z-scores, and cross-modal contagion via a Pearson correlation matrix. Total infra cost: $0.",
    url: "https://github.com/berasankhadeep20-lang/freight-rate-intelligence",
    repo: "berasankhadeep20-lang/freight-rate-intelligence",
    tags: ["Python", "yfinance", "FRED", "SQLite", "GitHub Actions"],
    emoji: "🚢",
    highlights: [
      "6 market proxies via yfinance + 2 FRED macro series — no paid keys",
      "SQLite store with dedup so re-runs never corrupt history",
      "WoW % change + rolling Z-score anomaly alerts",
      "GitHub Actions cron every 6h, auto-deploy to GitHub Pages",
    ],
    demoUrl: "https://lnkd.in/gPsc-xW4",
    datePublished: "2026-04-15",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "IPL Auction Simulator",
    desc: "Full-stack multiplayer IPL Auction with 500+ real players, AI teams, and live speech auctioneer.",
    longDesc:
      "A real-time multiplayer IPL auction simulator built with React + TypeScript + Firebase Realtime Database. Features 500+ real IPL players, AI-controlled teams with intelligent bidding logic, Web Speech API auctioneer, official IPL bid increments, squad validation rules, and complex pool transitions. Supports multiple simultaneous human players bidding in real time.",
    url: "https://github.com/berasankhadeep20-lang",
    repo: "berasankhadeep20-lang/berasankhadeep20-lang.github.io",
    tags: ["React", "TypeScript", "Firebase", "Vite", "Web Speech API"],
    emoji: "🏏",
    highlights: [
      "500+ real IPL player database with base prices",
      "AI teams with adaptive bidding strategies",
      "Web Speech API auctioneer narrates every bid in real-time",
      "Firebase Realtime Database for multiplayer sync",
      "Official IPL squad rules (overseas, RTM, etc.)",
    ],
    datePublished: "2025-12-01",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "MATCHDAY Football Dashboard",
    desc: "Live football dashboard covering all major European leagues with match results, standings, and fixtures.",
    longDesc:
      "A React + Vite + Tailwind dashboard that pulls live data from football-data.org API via a Cloudflare Worker CORS proxy. Covers EPL, La Liga, Bundesliga, Serie A, Ligue 1, and Champions League. Shows live scores, league standings, top scorers, and upcoming fixtures with an elegant dark-glassmorphism design.",
    url: "https://github.com/berasankhadeep20-lang",
    repo: "berasankhadeep20-lang/berasankhadeep20-lang.github.io",
    tags: ["React", "Vite", "Tailwind", "Cloudflare Workers", "API"],
    emoji: "⚽",
    highlights: [
      "6 major European leagues + Champions League",
      "Cloudflare Worker CORS proxy — no backend server needed",
      "Live scores, standings, fixtures, top scorers",
      "Deployed to GitHub Pages",
    ],
    datePublished: "2026-02-01",
    license: "https://opensource.org/licenses/MIT",
  },
  {
    title: "AARSHI Official Website",
    desc: "Full SPA for IISER Kolkata's Theatrical & Dramatics Society with Firebase member portal.",
    longDesc:
      "Built from scratch for AARSHI — the Theatrical and Dramatics Society of IISER Kolkata. A full single-page application with a Firebase-backed member portal restricted to @iiserkol.ac.in emails, admin approval workflow, attendance tracking, achievement badges, Mrignayanee & Pages to Stages 2026 event modals, web push reminders, contribution heatmap, trophy room, Konami easter egg, curtain animation, typewriter hero, and a custom 404.",
    url: "https://aarshiofficial.github.io",
    repo: "berasankhadeep20-lang/berasankhadeep20-lang.github.io",
    tags: ["React", "Firebase", "TypeScript", "Vite", "Tailwind"],
    emoji: "🎭",
    highlights: [
      "Firebase Auth + Firestore member portal (institute email only)",
      "Admin approval + attendance + achievement system",
      "Event modals for Mrignayanee 2026 & Pages to Stages 2026",
      "Web push reminders, Konami easter egg, curtain animation",
      "Fully deployed at aarshiofficial.github.io",
    ],
    demoUrl: "https://aarshiofficial.github.io",
    datePublished: "2026-03-01",
    license: "https://opensource.org/licenses/MIT",
  },
];

const TiltCard = ({ p, onClick, i }: { p: Project; onClick: () => void; i: number }) => {
  const tilt = useTilt(8);
  const { play } = useSound();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, type: "spring" }}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      onClick={() => { play("open"); onClick(); }}
      className="glass rounded-2xl p-6 group block relative overflow-hidden cursor-pointer"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.15))" }}
      />
      <div className="text-3xl mb-3">{p.emoji}</div>
      <h3 className="text-primary font-semibold mb-2 group-hover:gradient-text transition-colors">{p.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
      <div className="flex flex-wrap gap-2">
        {p.tags.slice(0, 3).map((tag) => <TechBadge key={tag} tag={tag} />)}
        {p.tags.length > 3 && (
          <span className="text-xs text-muted-foreground self-center">+{p.tags.length - 3}</span>
        )}
      </div>
      <div className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary transition-colors text-sm">↗</div>
    </motion.div>
  );
};

const ProjectModal = ({ p, onClose }: { p: Project; onClose: () => void }) => {
  const [stats, setStats] = useState<{ stars: number; forks: number } | null>(null);
  const [persona, setPersona] = useState<"recruiter" | "researcher" | "developer" | null>(null);
  const [explanation, setExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const generate = async (who: "recruiter" | "researcher" | "developer") => {
    setPersona(who); setExplanation(""); setAiError(null); setAiLoading(true);
    try {
      await streamFromFunction("project-explainer", { project: p, persona: who }, (chunk) =>
        setExplanation((prev) => prev + chunk)
      );
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Failed to generate explanation");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetch(`https://api.github.com/repos/${p.repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setStats({ stars: d.stargazers_count || 0, forks: d.forks_count || 0 }); })
      .catch(() => {});
  }, [p.repo]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[55] bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl max-w-2xl w-full my-8 overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <button onClick={onClose} className="float-right text-muted-foreground hover:text-primary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <div className="text-4xl mb-3">{p.emoji}</div>
          <h3 className="text-2xl font-bold gradient-text mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground mb-5">{p.longDesc}</p>

          <div className="flex flex-wrap gap-3 mb-6 text-xs">
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-bg text-primary-foreground">
              <Github className="w-3.5 h-3.5" /> View on GitHub
            </a>
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary text-primary">
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
            {stats && (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                  <Star className="w-3.5 h-3.5" /> {stats.stars}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                  <GitFork className="w-3.5 h-3.5" /> {stats.forks}
                </span>
              </>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Highlights</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-primary">›</span><span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Explainer — tailored for…
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {(["recruiter", "researcher", "developer"] as const).map((w) => (
                <button key={w} onClick={() => generate(w)} disabled={aiLoading}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    persona === w
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  } disabled:opacity-50`}>
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
              {aiLoading && <Loader2 className="w-4 h-4 animate-spin text-primary self-center" />}
            </div>
            {aiError && <p className="text-xs text-destructive">{aiError}</p>}
            {explanation && (
              <div className="prose prose-sm prose-invert max-w-none text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {p.tags.map((t) => <TechBadge key={t} tag={t} size="md" />)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Projects</h2>
        <p className="text-center text-muted-foreground text-sm mb-12">
          Click any card to see details, highlights, live GitHub stats, and AI explanations
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <TiltCard key={p.title} p={p} i={i} onClick={() => setOpen(p)} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
