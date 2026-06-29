import { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Wrench, FolderGit2, BookOpen, PenSquare,
  Presentation, FileText, TerminalSquare, Mail, Github, Linkedin,
  Twitter, Youtube, Instagram, Copy, Sun, Moon, Volume2, Calendar,
  Atom, BookHeart, Code2, BookMarked, Gauge, Satellite, Trophy,
  Download, Zap, Search, ArrowRight, ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSound } from "@/contexts/SoundContext";

const SECTIONS = [
  { id: "now",       label: "Now — What I'm working on",     icon: Calendar,      keywords: ["now", "current", "working"] },
  { id: "education", label: "Education — IISER Kolkata",      icon: GraduationCap, keywords: ["education", "iiser", "university", "degree"] },
  { id: "skills",    label: "Skills — Tech stack",            icon: Wrench,        keywords: ["skills", "tech", "python", "react", "ml"] },
  { id: "projects",  label: "Projects — F1, stocks, football",icon: FolderGit2,    keywords: ["projects", "f1", "football", "stocks", "ipl"] },
  { id: "github",    label: "GitHub — Activity feed",         icon: Github,        keywords: ["github", "repos", "contributions", "code"] },
  { id: "f1widget",  label: "F1 Widget — Live standings",     icon: Gauge,         keywords: ["f1", "formula", "standings", "race", "motorsport"] },
  { id: "telemetry", label: "Telemetry — Monaco lap data",    icon: Gauge,         keywords: ["telemetry", "monaco", "speed", "brake", "throttle"] },
  { id: "tyremodel", label: "Tyre Model — Degradation sim",  icon: Zap,           keywords: ["tyre", "tire", "degradation", "strategy", "pit"] },
  { id: "satellite", label: "Satellite — ResNet50 ML model", icon: Satellite,     keywords: ["satellite", "resnet", "deforestation", "ml", "eurosat"] },
  { id: "f1tracker", label: "F1 Tracker — Internship targets",icon: Trophy,        keywords: ["internship", "f1", "teams", "job", "career"] },
  { id: "coding",    label: "Codeforces — Rating graph",      icon: Code2,         keywords: ["codeforces", "rating", "competitive", "cp"] },
  { id: "iiser",     label: "IISER — Lab notebook",           icon: Atom,          keywords: ["lab", "physics", "gamma", "spectroscopy", "iiser"] },
  { id: "research",  label: "Research — Papers & interests",  icon: BookOpen,      keywords: ["research", "papers", "quantum", "arxiv"] },
  { id: "reading",   label: "arXiv — Reading list",           icon: BookMarked,    keywords: ["arxiv", "reading", "papers"] },
  { id: "blog",      label: "Blog — Devlogs",                 icon: PenSquare,     keywords: ["blog", "posts", "devlog", "writing"] },
  { id: "workshops", label: "Workshops & Certificates",       icon: Presentation,  keywords: ["workshops", "certificates", "qiskit"] },
  { id: "physics",   label: "Physics — Interactive demos",    icon: Atom,          keywords: ["physics", "quantum", "pendulum", "wave"] },
  { id: "resume",    label: "Resume / CV",                    icon: FileText,      keywords: ["resume", "cv", "download"] },
  { id: "terminal",  label: "Terminal — Easter egg",          icon: TerminalSquare,keywords: ["terminal", "command", "cli"] },
  { id: "guestbook", label: "Guestbook — Leave a note",       icon: BookHeart,     keywords: ["guestbook", "message", "note"] },
  { id: "contact",   label: "Contact — Get in touch",         icon: Mail,          keywords: ["contact", "email", "message", "hire"] },
];

const SOCIALS = [
  { label: "GitHub → berasankhadeep20-lang",      url: "https://github.com/berasankhadeep20-lang",                       icon: Github },
  { label: "LinkedIn → Sankhadeep Bera",          url: "https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/",         icon: Linkedin },
  { label: "X / Twitter → @RonnieDeep04",         url: "https://x.com/RonnieDeep04",                                     icon: Twitter },
  { label: "YouTube → @ronniedeep",               url: "https://youtube.com/@ronniedeep",                                 icon: Youtube },
  { label: "Instagram → @ronnie_deep_04",         url: "https://www.instagram.com/ronnie_deep_04/",                      icon: Instagram },
  { label: "Codeforces → Ronnie_Deep_04",         url: "https://codeforces.com/profile/Ronnie_Deep_04",                  icon: Code2 },
];

const QUICK_FACTS = [
  { label: "IISER Kolkata — BS-MS Physics, Year 1",   keywords: ["iiser", "physics", "year", "student"] },
  { label: "Co-60 Activity: (43,462 ± 1,643) Bq",     keywords: ["gamma", "cobalt", "activity", "spectroscopy"] },
  { label: "ResNet50 EuroSAT: ~99% val accuracy",      keywords: ["resnet", "satellite", "accuracy", "ml"] },
  { label: "Codeforces: Ronnie_Deep_04",               keywords: ["codeforces", "handle", "rating"] },
  { label: "F1 Pitwall Dashboard — OpenF1 live data",  keywords: ["f1", "pitwall", "openf1", "telemetry"] },
  { label: "Email: berasankhadeep20@gmail.com",        keywords: ["email", "contact", "gmail"] },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { mode, toggleMode } = useTheme();
  const { toggle: toggleSound, enabled: soundOn, play } = useSound();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen(p => !p);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => { play("click"); fn(); setOpen(false); setQuery(""); };
  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filter sections by query
  const q = query.toLowerCase();
  const filteredSections = useMemo(() =>
    q ? SECTIONS.filter(s =>
      s.label.toLowerCase().includes(q) ||
      s.keywords.some(k => k.includes(q))
    ) : SECTIONS,
  [q]);

  const filteredSocials = useMemo(() =>
    q ? SOCIALS.filter(s => s.label.toLowerCase().includes(q)) : [],
  [q]);

  const filteredFacts = useMemo(() =>
    q ? QUICK_FACTS.filter(f =>
      f.label.toLowerCase().includes(q) ||
      f.keywords.some(k => k.includes(q))
    ) : [],
  [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => { setOpen(false); setQuery(""); }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: -10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -10 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl glass rounded-2xl overflow-hidden shadow-2xl border border-border/50"
          >
            <Command label="Global command menu" className="bg-transparent" shouldFilter={false}>
              <div className="flex items-center px-4 border-b border-border/50">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search sections, projects, commands…"
                  className="flex-1 px-3 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-xs text-muted-foreground hover:text-primary px-2">✕</button>
                )}
              </div>

              <Command.List className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results for "{query}"
                </Command.Empty>

                {/* Quick facts when searching */}
                {filteredFacts.length > 0 && (
                  <Command.Group heading="Quick Facts" className="text-xs text-muted-foreground px-2 py-1">
                    {filteredFacts.map(f => (
                      <Command.Item key={f.label} onSelect={() => run(() => navigator.clipboard.writeText(f.label))}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>{f.label}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">copy</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Sections */}
                <Command.Group heading="Jump to section" className="text-xs text-muted-foreground px-2 py-1">
                  {filteredSections.map(s => (
                    <Command.Item key={s.id} onSelect={() => run(() => goto(s.id))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                      <s.icon className="w-4 h-4 shrink-0" />
                      <span>{s.label}</span>
                      <ArrowRight className="ml-auto w-3.5 h-3.5 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Socials when searching */}
                {filteredSocials.length > 0 && (
                  <Command.Group heading="Open social" className="text-xs text-muted-foreground px-2 py-1 mt-1">
                    {filteredSocials.map(s => (
                      <Command.Item key={s.label} onSelect={() => run(() => window.open(s.url, "_blank", "noopener,noreferrer"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <s.icon className="w-4 h-4 shrink-0" />
                        {s.label}
                        <ExternalLink className="ml-auto w-3.5 h-3.5 text-muted-foreground" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Actions — always visible */}
                {!q && (
                  <>
                    <Command.Group heading="Actions" className="text-xs text-muted-foreground px-2 py-1 mt-1">
                      <Command.Item onSelect={() => run(() => navigator.clipboard.writeText("berasankhadeep20@gmail.com"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <Copy className="w-4 h-4" /> Copy email
                      </Command.Item>
                      <Command.Item onSelect={() => run(() => window.open("/hire", "_blank"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <FileText className="w-4 h-4" /> Open hire page
                      </Command.Item>
                      <Command.Item onSelect={() => run(() => { const a = document.createElement("a"); a.href = "/Sankhadeep_Bera_CV.pdf"; a.download = "Sankhadeep_Bera_CV.pdf"; a.click(); })}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <Download className="w-4 h-4" /> Download CV / Resume
                      </Command.Item>
                      <Command.Item onSelect={() => run(toggleMode)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        Toggle {mode === "dark" ? "light" : "dark"} mode
                      </Command.Item>
                      <Command.Item onSelect={() => run(toggleSound)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                        <Volume2 className="w-4 h-4" /> Sound: {soundOn ? "On" : "Off"}
                      </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Open social" className="text-xs text-muted-foreground px-2 py-1 mt-1">
                      {SOCIALS.map(s => (
                        <Command.Item key={s.label} onSelect={() => run(() => window.open(s.url, "_blank", "noopener,noreferrer"))}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary">
                          <s.icon className="w-4 h-4" /> {s.label}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  </>
                )}
              </Command.List>

              <div className="px-4 py-2 border-t border-border/50 flex justify-between text-[10px] text-muted-foreground">
                <span>↑↓ navigate · ↵ select · esc close</span>
                <span>⌘K</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
