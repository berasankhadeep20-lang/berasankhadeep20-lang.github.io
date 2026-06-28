import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Code2, ExternalLink } from "lucide-react";

interface CFUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  friendOfCount: number;
}

interface CFContest {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

const RANK_COLORS: Record<string, string> = {
  newbie:         "#808080",
  pupil:          "#008000",
  specialist:     "#03a89e",
  expert:         "#0000ff",
  "candidate master": "#aa00aa",
  master:         "#ff8c00",
  "international master": "#ff8c00",
  grandmaster:    "#ff0000",
  "international grandmaster": "#ff0000",
  "legendary grandmaster": "#ff0000",
};

const HANDLE = "Ronnie_Deep_04";

const CodeforcesCard = () => {
  const [user, setUser] = useState<CFUser | null>(null);
  const [history, setHistory] = useState<CFContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"stats" | "graph">("graph");

  useEffect(() => {
    Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${HANDLE}`).then(r => r.ok ? r.json() : null),
      fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`).then(r => r.ok ? r.json() : null),
    ]).then(([uData, rData]) => {
      if (uData?.status === "OK") setUser(uData.result[0]);
      if (rData?.status === "OK") setHistory(rData.result);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const rankColor = user ? (RANK_COLORS[user.rank] || "hsl(var(--primary))") : "hsl(var(--primary))";

  // Mini SVG rating graph
  const RatingGraph = () => {
    if (!history.length) return (
      <div className="text-center text-muted-foreground text-xs py-8">No contest history yet.</div>
    );

    const ratings = history.map(c => c.newRating);
    const minR = Math.min(...ratings) - 50;
    const maxR = Math.max(...ratings) + 50;
    const W = 500; const H = 140;
    const pad = 28;

    const x = (i: number) => pad + (i / (history.length - 1)) * (W - 2 * pad);
    const y = (r: number) => H - pad - ((r - minR) / (maxR - minR)) * (H - 2 * pad);

    const polyline = history.map((c, i) => `${x(i)},${y(c.newRating)}`).join(" ");
    const area = `${x(0)},${H - pad} ` + history.map((c, i) => `${x(i)},${y(c.newRating)}`).join(" ") + ` ${x(history.length - 1)},${H - pad}`;

    // Rating bands
    const bands = [
      { min: 1200, max: 1400, color: "#00800020", label: "Pupil" },
      { min: 1400, max: 1600, color: "#03a89e20", label: "Specialist" },
      { min: 1600, max: 1900, color: "#0000ff20", label: "Expert" },
      { min: 1900, max: 2100, color: "#aa00aa20", label: "C. Master" },
    ];

    return (
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground flex justify-between px-1">
          <span>{history.length} contests</span>
          <span>Peak: <span className="text-primary font-mono font-bold">{Math.max(...ratings)}</span></span>
        </div>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
            {/* Background */}
            <rect x={0} y={0} width={W} height={H} fill="hsl(var(--card))" rx={8} />
            {/* Rating bands */}
            {bands.map(b => {
              const by1 = y(Math.min(b.max, maxR));
              const by2 = y(Math.max(b.min, minR));
              if (b.min > maxR || b.max < minR) return null;
              return (
                <rect key={b.label} x={pad} y={by1} width={W - 2*pad} height={by2 - by1} fill={b.color} />
              );
            })}
            {/* Grid lines */}
            {[minR + (maxR - minR) * 0.25, minR + (maxR - minR) * 0.5, minR + (maxR - minR) * 0.75].map((r, i) => (
              <g key={i}>
                <line x1={pad} y1={y(r)} x2={W - pad} y2={y(r)} stroke="hsl(var(--border))" strokeWidth={0.5} strokeDasharray="4 4" />
                <text x={pad - 4} y={y(r) + 3} fill="hsl(var(--muted-foreground))" fontSize={8} textAnchor="end">{Math.round(r)}</text>
              </g>
            ))}
            {/* Area fill */}
            <polygon points={area} fill="hsl(var(--primary) / 0.1)" />
            {/* Line */}
            <polyline points={polyline} fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinejoin="round" />
            {/* Dots for each contest */}
            {history.map((c, i) => (
              <circle
                key={c.contestId}
                cx={x(i)} cy={y(c.newRating)} r={2.5}
                fill={c.newRating > c.oldRating ? "#22c55e" : "#ef4444"}
                stroke="hsl(var(--card))" strokeWidth={1}
              />
            ))}
            {/* Latest rating label */}
            {history.length > 0 && (
              <text
                x={x(history.length - 1)}
                y={y(history[history.length - 1].newRating) - 6}
                fill="hsl(var(--primary))"
                fontSize={9}
                textAnchor="middle"
                fontWeight="bold"
              >
                {history[history.length - 1].newRating}
              </text>
            )}
          </svg>
        </div>
        {/* Last 5 contests */}
        <div className="space-y-1.5 mt-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Contests</div>
          {[...history].reverse().slice(0, 5).map((c) => (
            <div key={c.contestId} className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground truncate flex-1 text-[10px]">{c.contestName}</span>
              <span className="text-muted-foreground font-mono w-12 text-right">#{c.rank}</span>
              <span className={`font-mono font-bold w-16 text-right ${c.newRating > c.oldRating ? "text-green-400" : "text-red-400"}`}>
                {c.newRating > c.oldRating ? "▲" : "▼"} {Math.abs(c.newRating - c.oldRating)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="coding" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Code2 className="w-7 h-7" /> Competitive Programming
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Codeforces · live data via CF API
        </p>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex gap-2 p-4 border-b border-border/40">
            {(["graph", "stats"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                  tab === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-primary"
                }`}
              >
                {t === "graph" ? "📈 Rating Graph" : "🏆 Stats"}
              </button>
            ))}
            <a
              href={`https://codeforces.com/profile/${HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Profile
            </a>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-muted/40 rounded w-1/3" />
                <div className="h-32 bg-muted/40 rounded" />
                <div className="h-3 bg-muted/40 rounded w-2/3" />
              </div>
            ) : !user ? (
              <p className="text-center text-muted-foreground text-sm">Could not load CF data. Check API.</p>
            ) : (
              <>
                {/* User badge */}
                <div className="flex items-center gap-4 mb-5 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <Trophy className="w-6 h-6" style={{ color: rankColor }} />
                  <div>
                    <div className="font-bold" style={{ color: rankColor }}>{user.handle}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user.rank}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xl font-bold font-mono" style={{ color: rankColor }}>{user.rating}</div>
                    <div className="text-[10px] text-muted-foreground">Max: {user.maxRating} ({user.maxRank})</div>
                  </div>
                </div>

                {tab === "graph" && <RatingGraph />}

                {tab === "stats" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Current Rating", value: user.rating, color: rankColor },
                      { label: "Max Rating",     value: user.maxRating, color: rankColor },
                      { label: "Contests",       value: history.length, color: "hsl(var(--primary))" },
                      { label: "Max Rank Achieved", value: user.maxRank, color: "hsl(var(--secondary))" },
                      { label: "Contribution",   value: user.contribution >= 0 ? `+${user.contribution}` : user.contribution, color: "#22c55e" },
                      { label: "Best Contest Rank", value: history.length ? `#${Math.min(...history.map(c => c.rank))}` : "—", color: "#f59e0b" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-muted/20 border border-border/40 p-4 text-center">
                        <div className="text-lg font-bold font-mono capitalize" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeforcesCard;
