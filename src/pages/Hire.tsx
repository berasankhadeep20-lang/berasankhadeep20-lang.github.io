import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Mail, Github, Linkedin, ExternalLink, MapPin, GraduationCap, Zap, Trophy, ChevronRight } from "lucide-react";

const PROJECTS = [
  {
    emoji: "🏎️",
    title: "F1 Pitwall Dashboard",
    desc: "Real-time race telemetry, sector times, DRS detection, team radio, championship probability — built on OpenF1 API.",
    tags: ["React", "FastF1", "OpenF1", "Recharts"],
    url: "https://github.com/berasankhadeep20-lang",
    impact: "Live race data · Telemetry charts · DRS detection",
  },
  {
    emoji: "📈",
    title: "Freight Rate Intelligence",
    desc: "Zero-cost freight market dashboard using public equity proxies & FRED macrodata. Auto-deploys every 6 hours via GitHub Actions.",
    tags: ["Python", "yfinance", "FRED", "SQLite", "GitHub Actions"],
    url: "https://github.com/berasankhadeep20-lang/freight-rate-intelligence",
    impact: "6 market proxies · Zero API cost · Anomaly Z-scores",
  },
  {
    emoji: "🌍",
    title: "Satellite Deforestation Detection",
    desc: "ResNet50 on EuroSAT RGB dataset for land-use classification and deforestation detection. ~99% validation accuracy.",
    tags: ["Python", "PyTorch", "ResNet50", "EuroSAT"],
    url: "https://github.com/berasankhadeep20-lang",
    impact: "~99% val accuracy · EuroSAT RGB · Transfer learning",
  },
];

const SKILLS = [
  { cat: "Languages",   items: ["Python", "Java", "TypeScript"] },
  { cat: "ML/Data",     items: ["PyTorch", "scikit-learn", "Pandas", "NumPy"] },
  { cat: "Web",         items: ["React", "Vite", "Firebase", "Supabase"] },
  { cat: "Tools",       items: ["Git", "GitHub Actions", "LaTeX", "OpenFOAM*"] },
  { cat: "Physics",     items: ["Qiskit", "Nuclear physics lab", "CFD (in progress)"] },
];

const F1_TEAMS = [
  { team: "Red Bull Racing",    location: "Milton Keynes, UK",   window: "Aug–Oct 2026", role: "Data Science / Performance" },
  { team: "Mercedes AMG F1",   location: "Brackley, UK",        window: "Aug–Oct 2026", role: "Vehicle Performance Analyst" },
  { team: "McLaren F1",        location: "Woking, UK",          window: "Aug–Oct 2026", role: "Strategy & Analytics" },
  { team: "Ferrari",            location: "Maranello, Italy",    window: "Sep–Nov 2026", role: "Data Analytics" },
  { team: "Aston Martin F1",   location: "Silverstone, UK",     window: "Aug–Oct 2026", role: "Performance Engineering" },
];

const Hire = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="fixed top-0 w-full z-50 glass border-b border-border/40 py-3 px-6 flex items-center justify-between">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          ← Back to portfolio
        </Link>
        <span className="text-xs text-muted-foreground hidden sm:block">sankhadeep-hire · F1/F2 Internship 2026</span>
        <a
          href="/Sankhadeep_Bera_CV.pdf"
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-3 h-3" /> CV
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 space-y-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full gradient-bg flex items-center justify-center text-3xl">
            🏎️
          </div>
          <h1 className="text-4xl font-bold gradient-text">Sankhadeep Bera</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> BS-MS Physics · IISER Kolkata</span>
            <span>·</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Kolkata, India</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Open to F1/F2 internships
            </span>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            First-year BS-MS student building a portfolio targeting data science, performance analytics,
            and simulation roles at Formula 1 and Formula 2 teams. Strong foundations in Python, ML,
            and physics — actively learning CFD and telemetry analysis.
          </p>
          <div className="flex gap-3 justify-center flex-wrap pt-2">
            <a href="mailto:berasankhadeep20@gmail.com"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-bg text-primary-foreground text-sm font-medium">
              <Mail className="w-4 h-4" /> Get in touch
            </a>
            <a href="https://github.com/berasankhadeep20-lang" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </motion.div>

        {/* Why F1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Why Formula 1
          </h2>
          <div className="glass rounded-2xl p-6 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>F1 operates at the intersection of everything I'm building toward: physics-based simulation, high-frequency data analysis, and ML-driven decision-making under real-time constraints. I've been following the sport seriously since 2019 and building F1-adjacent projects since 2024.</p>
            <p>My F1 AI Race Predictor uses gradient-boosted models on historical telemetry. My F1 Pitwall Dashboard integrates live OpenF1 endpoints for sector times, DRS events, and championship probability. I understand the difference between a tyre degradation model and a pit strategy model — and why both matter.</p>
            <p>I'm applying for 2026–27 placement/internship cycles specifically targeting data science, performance analytics, and simulation roles. Application windows: Aug–Oct 2026 for UK-based teams.</p>
          </div>
        </motion.div>

        {/* Key projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Key Projects
          </h2>
          <div className="space-y-4">
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 hover:glow-primary transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground font-mono">{p.impact}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            <Link to="/#projects" className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2">
              View all projects on portfolio <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-4">Technical Skills</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SKILLS.map(s => (
              <div key={s.cat} className="glass rounded-xl p-4">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{s.cat}</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map(item => (
                    <span key={item} className="text-xs px-2 py-0.5 rounded-full bg-muted/40 text-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">* CFD with OpenFOAM — in progress, resuming on campus access</p>
        </motion.div>

        {/* F1 team tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">🏁 F1/F2 Application Tracker</h2>
          <p className="text-xs text-muted-foreground mb-4">Teams I'm targeting for 2026–27 internship cycle</p>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2 border-b border-border/40 gap-4">
              <span>Team / Role</span><span>Window</span><span>Status</span>
            </div>
            {F1_TEAMS.map((t, i) => (
              <div key={t.team} className={`grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-border/20 last:border-0 items-center ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                <div>
                  <div className="text-sm font-medium">{t.team}</div>
                  <div className="text-[10px] text-muted-foreground">{t.location} · {t.role}</div>
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">{t.window}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                  Researching
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold gradient-text">Let's talk</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Reach out directly — I respond to every message within 24 hours.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:berasankhadeep20@gmail.com"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-primary-foreground text-sm font-medium">
              <Mail className="w-4 h-4" /> berasankhadeep20@gmail.com
            </a>
          </div>
          <div className="flex gap-4 justify-center text-sm text-muted-foreground pt-2">
            <a href="https://github.com/berasankhadeep20-lang" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</a>
            <a href="https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hire;
