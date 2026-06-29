import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ChevronRight, Lock } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  sem: number;
  status: "done" | "current" | "planned" | "future";
  prereqs: string[];
  desc: string;
  grade?: string;
  x: number; y: number;
}

const COURSES: Course[] = [
  // Sem 1 — done
  { id: "calc1", name: "Calculus I",          code: "MA1101", sem: 1, status: "done",    prereqs: [],              desc: "Limits, derivatives, integration, fundamental theorem of calculus.", x: 1, y: 0 },
  { id: "mech",  name: "Classical Mechanics", code: "PH1101", sem: 1, status: "done",    prereqs: [],              desc: "Newtonian mechanics, conservation laws, oscillations.", x: 2, y: 0 },
  { id: "chem",  name: "Intro Chemistry",     code: "CH1101", sem: 1, status: "done",    prereqs: [],              desc: "Atomic structure, bonding, periodic trends.", x: 3, y: 0 },
  { id: "prog",  name: "Prog. Fundamentals",  code: "CS1101", sem: 1, status: "done",    prereqs: [],              desc: "Python basics, algorithms, data structures introduction.", x: 4, y: 0 },

  // Sem 2 — current
  { id: "calc2", name: "Calculus II",         code: "MA1201", sem: 2, status: "current", prereqs: ["calc1"],       desc: "Multivariable calculus, partial derivatives, vector calculus.", x: 1, y: 1 },
  { id: "em",    name: "Electromagnetism",    code: "PH1201", sem: 2, status: "current", prereqs: ["mech","calc1"],desc: "Maxwell's equations, electric and magnetic fields, waves.", x: 2, y: 1 },
  { id: "linalg",name: "Linear Algebra",      code: "MA1202", sem: 2, status: "current", prereqs: ["calc1"],       desc: "Matrices, eigenvalues, vector spaces, linear transformations.", x: 3, y: 1 },
  { id: "cs2",   name: "Data Structures",     code: "CS1201", sem: 2, status: "current", prereqs: ["prog"],        desc: "Trees, graphs, sorting, dynamic programming, complexity.", x: 4, y: 1 },

  // Sem 3 — planned
  { id: "qm",    name: "Quantum Mechanics",   code: "PH2101", sem: 3, status: "planned", prereqs: ["em","calc2","linalg"], desc: "Schrödinger equation, wave functions, hydrogen atom, spin.", x: 2, y: 2 },
  { id: "thermo",name: "Thermal Physics",     code: "PH2102", sem: 3, status: "planned", prereqs: ["mech","calc2"],       desc: "Thermodynamics, statistical mechanics, entropy.", x: 1, y: 2 },
  { id: "algo",  name: "Algorithms & DS",     code: "CS2101", sem: 3, status: "planned", prereqs: ["cs2","linalg"],       desc: "Advanced algorithms, graph theory, NP-completeness.", x: 4, y: 2 },
  { id: "mathphy",name:"Mathematical Physics",code: "MA2101", sem: 3, status: "planned", prereqs: ["calc2","linalg"],     desc: "ODEs, PDEs, Fourier analysis, complex analysis.", x: 3, y: 2 },

  // Sem 4 — future
  { id: "aqm",   name: "Adv. Quantum Mech.", code: "PH3101", sem: 4, status: "future",  prereqs: ["qm"],                   desc: "Perturbation theory, identical particles, scattering.", x: 2, y: 3 },
  { id: "statmech",name:"Statistical Mech.", code: "PH3102", sem: 4, status: "future",  prereqs: ["thermo","qm"],          desc: "Partition functions, phase transitions, Bose-Einstein/Fermi-Dirac.", x: 1, y: 3 },
  { id: "ml",    name: "Machine Learning",   code: "CS3101", sem: 4, status: "future",  prereqs: ["algo","linalg"],        desc: "Supervised/unsupervised learning, neural networks, optimisation.", x: 4, y: 3 },
  { id: "qcomp", name: "Quantum Computing",  code: "PH4101", sem: 5, status: "future",  prereqs: ["aqm","ml"],             desc: "Qubits, quantum gates, Grover/Shor algorithms.", x: 3, y: 3 },
];

const STATUS_CFG = {
  done:    { label: "Completed", color: "hsl(var(--primary))", bg: "bg-primary/10 border-primary/30",     dot: "bg-primary" },
  current: { label: "In progress", color: "#f59e0b",           bg: "bg-yellow-500/10 border-yellow-500/30", dot: "bg-yellow-400 animate-pulse" },
  planned: { label: "Planned",   color: "#8b5cf6",             bg: "bg-purple-500/10 border-purple-500/30", dot: "bg-purple-400" },
  future:  { label: "Future",    color: "#6b7280",             bg: "bg-muted/20 border-border/30",           dot: "bg-muted-foreground" },
};

// Grid layout: 5 columns (0–4), 4 rows (0–3)
const COL_W = 150;
const ROW_H = 120;
const PAD   = 24;
const SVG_W = 5 * COL_W + PAD * 2;
const SVG_H = 4 * ROW_H + PAD * 2;

const cx = (x: number) => PAD + x * COL_W + COL_W / 2;
const cy = (y: number) => PAD + y * ROW_H + ROW_H / 2;

const CourseMap = () => {
  const [selected, setSelected] = useState<Course | null>(null);
  const [filter, setFilter] = useState<"all" | "physics" | "cs" | "math">("all");

  const isVisible = (c: Course) => {
    if (filter === "all") return true;
    if (filter === "physics") return c.code.startsWith("PH");
    if (filter === "cs")      return c.code.startsWith("CS");
    if (filter === "math")    return c.code.startsWith("MA");
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "physics", "cs", "math"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
              filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-primary"
            }`}>
            {f === "all" ? "All Courses" : f === "physics" ? "⚛️ Physics" : f === "cs" ? "💻 CS" : "∑ Math"}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs">
        {Object.entries(STATUS_CFG).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${v.dot}`} />
            <span className="text-muted-foreground">{v.label}</span>
          </div>
        ))}
      </div>

      {/* SVG graph */}
      <div className="glass rounded-2xl overflow-x-auto p-2">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ minWidth: 500, maxHeight: 400 }}>
          {/* Prerequisite arrows */}
          {COURSES.map(course =>
            course.prereqs.map(prereqId => {
              const prereq = COURSES.find(c => c.id === prereqId);
              if (!prereq) return null;
              const x1 = cx(prereq.x); const y1 = cy(prereq.y);
              const x2 = cx(course.x); const y2 = cy(course.y);
              const visible = isVisible(course) && isVisible(prereq);
              return (
                <line key={`${prereqId}-${course.id}`}
                  x1={x1} y1={y1 + 22} x2={x2} y2={y2 - 22}
                  stroke={visible ? "hsl(var(--border) / 0.6)" : "hsl(var(--border) / 0.15)"}
                  strokeWidth={1} strokeDasharray={course.status === "future" ? "4 3" : "none"}
                  markerEnd="url(#arrow)"
                />
              );
            })
          )}
          {/* Arrow marker */}
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="hsl(var(--border) / 0.6)" />
            </marker>
          </defs>
          {/* Course nodes */}
          {COURSES.map(course => {
            const cfg = STATUS_CFG[course.status];
            const dim = !isVisible(course);
            const isSelected = selected?.id === course.id;
            return (
              <g key={course.id} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : course)}>
                <rect
                  x={cx(course.x) - 58} y={cy(course.y) - 20}
                  width={116} height={40} rx={8}
                  fill={isSelected ? "hsl(var(--primary) / 0.2)" : "hsl(var(--card))"}
                  stroke={isSelected ? "hsl(var(--primary))" : cfg.color}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={dim ? 0.3 : 1}
                />
                <text x={cx(course.x)} y={cy(course.y) - 5} textAnchor="middle"
                  fill={dim ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))"}
                  fontSize={8.5} fontWeight="600" opacity={dim ? 0.4 : 1}>
                  {course.name}
                </text>
                <text x={cx(course.x)} y={cy(course.y) + 8} textAnchor="middle"
                  fill={cfg.color} fontSize={7} opacity={dim ? 0.4 : 1}>
                  {course.code}
                </text>
                {course.status === "future" && (
                  <text x={cx(course.x)} y={cy(course.y) + 18} textAnchor="middle" fill={cfg.color} fontSize={6} opacity={dim ? 0.3 : 0.7}>
                    🔒 future
                  </text>
                )}
                {course.status === "current" && (
                  <circle cx={cx(course.x) + 50} cy={cy(course.y) - 16} r={4} fill="#f59e0b" opacity={0.9}>
                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
          {/* Semester labels */}
          {[1,2,3,4].map((sem, i) => (
            <text key={sem} x={8} y={PAD + i * ROW_H + ROW_H / 2 + 4}
              fill="hsl(var(--muted-foreground))" fontSize={8} fontWeight="600">
              Sem {sem}
            </text>
          ))}
        </svg>
      </div>

      {/* Selected course detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className={`rounded-2xl p-5 border ${STATUS_CFG[selected.status].bg}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{selected.name}</div>
                <div className="text-xs font-mono text-muted-foreground mt-0.5">{selected.code} · Semester {selected.sem}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_CFG[selected.status].bg}`}
                style={{ color: STATUS_CFG[selected.status].color }}>
                {STATUS_CFG[selected.status].label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{selected.desc}</p>
            {selected.prereqs.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground">Prerequisites:</span>
                {selected.prereqs.map(id => {
                  const c = COURSES.find(c => c.id === id);
                  return c ? (
                    <button key={id} onClick={() => setSelected(c)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1">
                      <ChevronRight className="w-2.5 h-2.5" /> {c.name}
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseMap;
