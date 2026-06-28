import { useEffect, useState } from "react";
import { F1RowSkeleton } from "@/components/SkeletonCard";
import { motion } from "framer-motion";
import { Trophy, Clock, Flag } from "lucide-react";

interface Driver {
  position: string;
  Driver: { givenName: string; familyName: string; code: string; nationality: string };
  Constructors: { name: string }[];
  points: string;
  wins: string;
}

interface Race {
  raceName: string;
  Circuit: { circuitName: string; Location: { country: string } };
  date: string;
  time?: string;
  round: string;
}

const TEAM_COLORS: Record<string, string> = {
  "Red Bull": "#3671C6",
  Ferrari: "#E8002D",
  Mercedes: "#27F4D2",
  McLaren: "#FF8000",
  "Aston Martin": "#229971",
  Alpine: "#FF87BC",
  Williams: "#64C4FF",
  "RB F1 Team": "#6692FF",
  "Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD",
};

const FLAG_EMOJIS: Record<string, string> = {
  British: "🇬🇧", Dutch: "🇳🇱", Spanish: "🇪🇸", Monegasque: "🇲🇨",
  Mexican: "🇲🇽", Australian: "🇦🇺", Canadian: "🇨🇦", German: "🇩🇪",
  Finnish: "🇫🇮", French: "🇫🇷", Thai: "🇹🇭", Chinese: "🇨🇳",
  American: "🇺🇸", Brazilian: "🇧🇷", Japanese: "🇯🇵", Italian: "🇮🇹",
  Danish: "🇩🇰", New: "🇳🇿",
};

const F1Widget = () => {
  const [standings, setStandings] = useState<Driver[]>([]);
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"standings" | "next">("standings");
  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`).then((r) =>
        r.ok ? r.json() : null
      ),
    ]).then(([sData, schedData]) => {
      if (sData) {
        const list =
          sData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
        setStandings(list.slice(0, 10));
      }
      if (schedData) {
        const races: Race[] = schedData?.MRData?.RaceTable?.Races || [];
        const now = Date.now();
        const upcoming = races.find((r) => new Date(r.date + "T" + (r.time || "14:00:00Z")).getTime() > now);
        setNextRace(upcoming || null);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [year]);

  useEffect(() => {
    if (!nextRace) return;
    const target = new Date(nextRace.date + "T" + (nextRace.time || "14:00:00Z")).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setCountdown("Race started! 🏁"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextRace]);

  const medalColor = (pos: number) => {
    if (pos === 1) return "text-yellow-400";
    if (pos === 2) return "text-slate-300";
    if (pos === 3) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <section id="f1widget" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          🏎️ F1 {year} Season
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Live standings & upcoming race — powered by Ergast API
        </p>

        <div className="flex gap-2 mb-6 justify-center">
          {(["standings", "next"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "glass text-muted-foreground hover:text-primary"
              }`}
            >
              {t === "standings" ? "🏆 Driver Standings" : "⏭️ Next Race"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            Loading F1 data…
          </div>
        ) : tab === "standings" ? (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3 border-b border-border/50">
              <span className="w-8">#</span>
              <span>Driver</span>
              <span className="text-right pr-6">Team</span>
              <span className="text-right w-14">PTS</span>
            </div>
            {standings.map((d, i) => {
              const team = d.Constructors[0]?.name || "";
              const teamColor = TEAM_COLORS[team] || "hsl(var(--primary))";
              const flag = FLAG_EMOJIS[d.Driver.nationality] || "🏁";
              return (
                <motion.div
                  key={d.Driver.code}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-0 items-center px-5 py-3 border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors"
                >
                  <div
                    className={`w-8 text-sm font-bold ${medalColor(parseInt(d.position))}`}
                  >
                    {d.position}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ background: teamColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {flag} {d.Driver.givenName} <span className="text-primary">{d.Driver.familyName}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{d.wins} wins</div>
                    </div>
                  </div>
                  <div
                    className="text-[10px] font-medium pr-6 truncate text-right"
                    style={{ color: teamColor }}
                  >
                    {team}
                  </div>
                  <div className="text-sm font-bold text-primary text-right w-14">
                    {d.points}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : nextRace ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">🏁</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Round {nextRace.round}
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-1">{nextRace.raceName}</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.country}
            </p>
            <div className="flex items-center justify-center gap-3 mb-6 text-sm text-muted-foreground">
              <Flag className="w-4 h-4 text-primary" />
              {new Date(nextRace.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="glass rounded-xl p-4 inline-block">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3" /> Race starts in
              </div>
              <div className="text-2xl font-bold font-mono gradient-text">{countdown}</div>
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            No upcoming race data available.
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          Data via{" "}
          <a href="https://api.jolpi.ca/ergast/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Jolpi Ergast API
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/berasankhadeep20-lang/F1-Pitwall-Dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            See my full F1 Pitwall Dashboard →
          </a>
        </p>
      </div>
    </section>
  );
};

export default F1Widget;
