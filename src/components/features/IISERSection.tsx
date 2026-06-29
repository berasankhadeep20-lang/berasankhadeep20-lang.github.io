import { useState } from "react";
import { GraduationCap, BookOpen, Quote, MapPin, FlaskConical } from "lucide-react";
import LabNotebook from "./LabNotebook";
import CourseMap from "./CourseMap";

const SEMESTERS = [
  {
    sem: "Sem 1", year: "2025",
    courses: ["Calculus I", "Classical Mechanics", "Intro Chemistry", "Biology I", "English Communication"],
    status: "done",
  },
  {
    sem: "Sem 2", year: "2026",
    courses: ["Calculus II", "Electromagnetism", "Organic Chemistry", "Biology II", "Programming Fundamentals"],
    status: "current",
  },
  {
    sem: "Sem 3+", year: "2026+",
    courses: ["Quantum Mechanics", "Statistical Physics", "Algorithms & DS", "Linear Algebra", "Thermal Physics"],
    status: "upcoming",
  },
];

const PINS = [
  { name: "Hostel Block", x: 22, y: 60 },
  { name: "Physics Dept.", x: 55, y: 35 },
  { name: "Library", x: 70, y: 50 },
  { name: "Lake Side", x: 35, y: 80 },
];

const IISERSection = () => {
  const [tab, setTab] = useState<"courses" | "lab" | "citations" | "map">("lab");

  return (
    <section id="iiser" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <GraduationCap className="w-7 h-7" /> Life at IISER Kolkata
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          BS-MS journey, lab notebook, and the campus I call home.
        </p>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {([
            { id: "lab",      label: "🧪 Lab Notebook", icon: FlaskConical },
            { id: "courses",  label: "📚 Courses",      icon: BookOpen },
            { id: "citations",label: "📄 Citations",    icon: Quote },
            { id: "map",      label: "🗺️ Campus",      icon: MapPin },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "glass text-muted-foreground hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "lab" && <LabNotebook />}

        {tab === "courses" && (
          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-muted-foreground mb-5">
              Click any course node to see details. Arrows show prerequisites. Dashed lines = future courses.
            </p>
            <CourseMap />
          </div>
        )}

        {tab === "citations" && (
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              {[
                { label: "Citations", value: "0" },
                { label: "Papers",    value: "0" },
                { label: "h-index",   value: "0" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/30 p-6">
                  <div className="text-3xl font-bold gradient-text">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Auto-syncs from Google Scholar once first paper is indexed.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                🎓 Currently focused on coursework and lab experiments. Research publications expected from Year 3 onwards.
              </p>
            </div>
          </div>
        )}

        {tab === "map" && (
          <div className="glass rounded-2xl p-6">
            <div className="relative w-full aspect-[2/1] rounded-xl bg-gradient-to-br from-emerald-900/30 via-teal-800/20 to-blue-900/30 overflow-hidden border border-border/40">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 50">
                <path d="M0 30 Q 25 20, 50 30 T 100 30" stroke="hsl(var(--primary))" strokeWidth="0.3" fill="none" />
                <circle cx="50" cy="30" r="20" stroke="hsl(var(--secondary))" strokeWidth="0.2" fill="none" />
              </svg>
              {PINS.map((p) => (
                <div
                  key={p.name}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <MapPin className="w-5 h-5 text-primary fill-primary/30" />
                  <span className="text-[10px] font-mono whitespace-nowrap absolute left-1/2 -translate-x-1/2 mt-0 px-1.5 py-0.5 rounded bg-background/80">
                    {p.name}
                  </span>
                </div>
              ))}
              <div className="absolute bottom-2 right-3 text-[9px] text-muted-foreground font-mono">
                IISER Kolkata · Mohanpur, WB
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IISERSection;
