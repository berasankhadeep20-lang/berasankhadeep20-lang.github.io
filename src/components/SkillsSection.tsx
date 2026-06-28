import { motion } from "framer-motion";
import { useState } from "react";
import SkillsConstellation from "./SkillsConstellation";

const skills = [
  { name: "Python",            level: 85, icon: "🐍", years: 3, category: "Language" },
  { name: "Java",              level: 70, icon: "☕", years: 2, category: "Language" },
  { name: "TypeScript/React",  level: 75, icon: "⚛️", years: 2, category: "Web" },
  { name: "Machine Learning",  level: 75, icon: "🤖", years: 2, category: "AI/ML" },
  { name: "Qiskit/Quantum",    level: 60, icon: "🔬", years: 1, category: "Physics" },
  { name: "DaVinci Resolve",   level: 80, icon: "🎬", years: 3, category: "Creative" },
  { name: "Firebase",          level: 72, icon: "🔥", years: 1, category: "Backend" },
  { name: "Data Analysis",     level: 68, icon: "📊", years: 2, category: "AI/ML" },
  { name: "Git/GitHub",        level: 80, icon: "🐙", years: 3, category: "Tools" },
  { name: "LaTeX",             level: 70, icon: "📄", years: 1, category: "Tools" },
  { name: "Pandas/NumPy",      level: 78, icon: "🧮", years: 2, category: "AI/ML" },
  { name: "Competitive Prog.", level: 65, icon: "🏆", years: 2, category: "CS" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Language": "hsl(var(--primary))",
  "Web":      "#f97316",
  "AI/ML":    "#8b5cf6",
  "Physics":  "#06b6d4",
  "Creative": "#ec4899",
  "Backend":  "#f59e0b",
  "Tools":    "#22c55e",
  "CS":       "#3b82f6",
};

const SkillsSection = () => {
  const [view, setView] = useState<"bars" | "graph" | "heatmap">("graph");
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Skills</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Drag the constellation, or switch to a classic view
        </p>
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setView("graph")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              view === "graph"
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-primary"
            }`}
          >
            ✦ Constellation
          </button>
          <button
            onClick={() => setView("bars")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              view === "bars"
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-primary"
            }`}
          >
            ▤ Bars
          </button>
          <button
            onClick={() => setView("heatmap")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              view === "heatmap"
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-primary"
            }`}
          >
            🔥 Heatmap
          </button>
        </div>

        {view === "graph" ? (
          <SkillsConstellation />
        ) : view === "heatmap" ? (
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((s, i) => {
                const color = CATEGORY_COLORS[s.category] || "hsl(var(--primary))";
                const intensity = s.level / 100;
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="relative rounded-xl p-4 border border-border/40 hover:scale-105 transition-transform cursor-default group"
                    style={{
                      background: `color-mix(in srgb, ${color} ${Math.round(intensity * 22)}%, hsl(var(--card)))`,
                      borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
                    }}
                  >
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-xs font-semibold text-foreground leading-tight">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{s.category}</div>
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-muted-foreground">{s.years}yr{s.years !== 1 ? "s" : ""}</span>
                        <span style={{ color }} className="font-mono font-bold">{s.level}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.04 }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {Object.entries(CATEGORY_COLORS).map(([cat, col]) => (
                <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: col }} />
                  {cat}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 max-w-2xl mx-auto">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4 group hover:glow-primary transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    <span className="mr-2">{s.icon}</span>
                    {s.name}
                  </span>
                  <span className="text-xs text-primary font-mono">{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-bg"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
