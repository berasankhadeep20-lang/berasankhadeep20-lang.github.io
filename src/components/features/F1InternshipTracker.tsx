import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, Clock, Search, AlertCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

type Status = "researching" | "preparing" | "applied" | "waiting" | "rejected" | "offer";

interface Team {
  name: string;
  series: "F1" | "F2" | "F1 Academy";
  location: string;
  country: string;
  flag: string;
  window: string;
  roles: string[];
  skills: string[];
  status: Status;
  url: string;
  notes: string;
  priority: "high" | "medium";
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  researching: { label: "Researching",  color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/25",   icon: Search },
  preparing:   { label: "Preparing",    color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25", icon: BookOpen },
  applied:     { label: "Applied",      color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/25", icon: CheckCircle2 },
  waiting:     { label: "Waiting",      color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/25", icon: Clock },
  rejected:    { label: "Rejected",     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/25",       icon: AlertCircle },
  offer:       { label: "Offer 🎉",     color: "text-green-400",  bg: "bg-green-500/10 border-green-500/25",  icon: CheckCircle2 },
};

const TEAMS: Team[] = [
  {
    name: "Red Bull Racing", series: "F1", location: "Milton Keynes", country: "UK", flag: "🇬🇧",
    window: "Aug–Oct 2026", roles: ["Data Scientist", "Performance Analyst", "Simulation Engineer"],
    skills: ["Python", "MATLAB", "CFD", "Machine Learning", "Data Visualisation"],
    status: "researching", url: "https://www.redbullracing.com/en-int/career", priority: "high",
    notes: "Primary target. Oracle partnership means strong data science culture.",
  },
  {
    name: "Mercedes AMG F1", series: "F1", location: "Brackley", country: "UK", flag: "🇬🇧",
    window: "Aug–Oct 2026", roles: ["Vehicle Performance Analyst", "Data Engineer", "Aerodynamics (CFD)"],
    skills: ["Python", "CFD (OpenFOAM/ANSYS)", "MATLAB", "SQL", "Statistics"],
    status: "researching", url: "https://www.mercedesamgf1.com/en/careers/", priority: "high",
    notes: "HPPC (High Performance Powertrain & Chassis) division — strong simulation team.",
  },
  {
    name: "McLaren F1", series: "F1", location: "Woking", country: "UK", flag: "🇬🇧",
    window: "Aug–Oct 2026", roles: ["Strategy & Analytics", "Telemetry Engineer", "Data Scientist"],
    skills: ["Python", "R", "Machine Learning", "Telemetry", "Statistics"],
    status: "researching", url: "https://www.mclaren.com/racing/careers/", priority: "high",
    notes: "Strong analytics culture. Racing Reference data partnership.",
  },
  {
    name: "Ferrari (Scuderia)", series: "F1", location: "Maranello", country: "Italy", flag: "🇮🇹",
    window: "Sep–Nov 2026", roles: ["Data Analytics", "Performance Engineering", "Vehicle Dynamics"],
    skills: ["Python", "MATLAB", "CFD", "C++", "Statistics"],
    status: "researching", url: "https://www.ferrari.com/en-EN/formula1/careers", priority: "medium",
    notes: "Italian HQ — language not required but helpful. Strong physics culture.",
  },
  {
    name: "Aston Martin Aramco F1", series: "F1", location: "Silverstone", country: "UK", flag: "🇬🇧",
    window: "Aug–Oct 2026", roles: ["Performance Engineering", "Data Scientist", "Simulation"],
    skills: ["Python", "MATLAB", "CFD", "ML", "Telemetry"],
    status: "researching", url: "https://www.astonmartinf1.com/en-gb/careers", priority: "medium",
    notes: "Newer team, growing fast. Lawrence Stroll investment means expanding tech team.",
  },
  {
    name: "Alpine F1 Team", series: "F1", location: "Enstone", country: "UK", flag: "🇬🇧",
    window: "Aug–Oct 2026", roles: ["Data Science", "Performance Analysis", "Strategy"],
    skills: ["Python", "Machine Learning", "Statistics", "Telemetry"],
    status: "researching", url: "https://www.alpinecars.com/en/formula-1/careers/", priority: "medium",
    notes: "Renault-backed. Good for ML roles.",
  },
  {
    name: "Prema Racing (F2)", series: "F2", location: "Padova", country: "Italy", flag: "🇮🇹",
    window: "Sep–Nov 2026", roles: ["Data Analyst", "Performance Engineer"],
    skills: ["Python", "Telemetry", "Data Analysis", "Motorsport knowledge"],
    status: "researching", url: "https://www.prenaracing.com/", priority: "medium",
    notes: "Top F2 team. Good entry point into motorsport data roles.",
  },
  {
    name: "ART Grand Prix (F2)", series: "F2", location: "La Chapelle-de-Guinchay", country: "France", flag: "🇫🇷",
    window: "Sep–Nov 2026", roles: ["Data Engineer", "Telemetry Analyst"],
    skills: ["Python", "Data Analysis", "Motorsport", "Telemetry"],
    status: "researching", url: "https://www.artgrandprix.com/", priority: "medium",
    notes: "Historic F2 team. French connection — some knowledge of French useful.",
  },
];

const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} whitespace-nowrap font-medium`}>
      <Icon className="w-2.5 h-2.5" /> {cfg.label}
    </span>
  );
};

const F1InternshipTracker = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "F1" | "F2">("all");

  const filtered = TEAMS.filter(t => filter === "all" || t.series === filter);
  const counts = Object.fromEntries(
    (Object.keys(STATUS_CONFIG) as Status[]).map(s => [s, TEAMS.filter(t => t.status === s).length])
  );

  return (
    <section id="f1tracker" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">🏁 F1/F2 Internship Tracker</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Teams I'm targeting for the 2026–27 placement cycle · Application windows Aug–Nov 2026
        </p>

        {/* Status summary */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className={`rounded-xl p-2.5 text-center border ${cfg.bg}`}>
                <div className={`text-xl font-bold ${cfg.color}`}>{counts[s]}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "F1", "F2"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-primary"
              }`}>
              {f === "all" ? "All Teams" : f}
            </button>
          ))}
        </div>

        {/* Team list */}
        <div className="space-y-3">
          {filtered.map((t, i) => {
            const isOpen = expanded === t.name;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`glass rounded-2xl overflow-hidden border ${t.priority === "high" ? "border-primary/20" : "border-border/30"}`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : t.name)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-primary/5 transition-colors"
                >
                  <span className="text-xl">{t.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{t.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${t.series === "F1" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {t.series}
                      </span>
                      {t.priority === "high" && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">★ Priority</span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.location}, {t.country} · {t.window}</div>
                  </div>
                  <StatusBadge status={t.status} />
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="border-t border-border/40 p-4 space-y-3"
                  >
                    <p className="text-xs text-muted-foreground">{t.notes}</p>
                    <div>
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5">Target Roles</div>
                      <div className="flex flex-wrap gap-1.5">
                        {t.roles.map(r => <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{r}</span>)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Skills They List</div>
                      <div className="flex flex-wrap gap-1.5">
                        {t.skills.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{s}</span>)}
                      </div>
                    </div>
                    <a href={t.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" /> Careers page
                    </a>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Application windows are estimates based on previous years. Tracking updates manually.
        </p>
      </div>
    </section>
  );
};

export default F1InternshipTracker;
