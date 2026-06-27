import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, GitCommit, Star, GitFork, Calendar, ExternalLink } from "lucide-react";

const USER = "berasankhadeep20-lang";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
}

interface PinnedRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
}

interface Event {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

// Pinned repos — update manually when you pin/unpin
const PINNED_NAMES = [
  "berasankhadeep20-lang.github.io",
  "F1-AI-Predictor",
  "LLM-For-stock-market",
  "AI-Football-Match-Outcome-Predictor",
  "Stock-market-ml",
  "aarshiofficial.github.io",
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
};

const GitHubFeed = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [pinned, setPinned] = useState<PinnedRepo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [heatmap, setHeatmap] = useState<{ date: string; count: number }[]>([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pinned" | "recent" | "activity">("pinned");

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
    ])
      .then(([allRepos, e]) => {
        const nonForks = (allRepos as Repo[]).filter((r) => !r.fork);
        setRepos(nonForks.slice(0, 6));

        // Build pinned list from known names
        const pinnedList = PINNED_NAMES.map((name) =>
          (allRepos as Repo[]).find((r) => r.name === name)
        ).filter(Boolean) as PinnedRepo[];
        setPinned(pinnedList.length > 0 ? pinnedList : nonForks.slice(0, 6));

        setEvents(e as Event[]);

        // Build 90-day contribution heatmap from events
        const buckets: Record<string, number> = {};
        const now = Date.now();
        for (let i = 89; i >= 0; i--) {
          const d = new Date(now - i * 86400000);
          buckets[d.toISOString().split("T")[0]] = 0;
        }
        let total = 0;
        (e as Event[]).forEach((ev) => {
          const day = ev.created_at.split("T")[0];
          if (day in buckets) {
            const inc = ev.type === "PushEvent" ? (ev.payload?.commits?.length || 1) : 1;
            buckets[day] += inc;
            total += inc;
          }
        });
        setHeatmap(
          Object.entries(buckets).map(([date, count]) => ({ date, count }))
        );
        setTotalContribs(total);
      })
      .catch((err) => setError(`GitHub API error (${err})`))
      .finally(() => setLoading(false));
  }, []);

  const eventLabel = (e: Event) => {
    switch (e.type) {
      case "PushEvent":
        return `Pushed ${e.payload?.commits?.length || 0} commit(s)`;
      case "CreateEvent":
        return `Created ${e.payload?.ref_type || "repo"}`;
      case "WatchEvent":
        return "Starred a repo";
      case "ForkEvent":
        return "Forked";
      case "PullRequestEvent":
        return `${e.payload?.action || "updated"} PR`;
      case "IssuesEvent":
        return `${e.payload?.action || "updated"} issue`;
      case "DeleteEvent":
        return `Deleted ${e.payload?.ref_type || "branch"}`;
      default:
        return e.type.replace("Event", "");
    }
  };

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const maxCount = Math.max(1, ...heatmap.map((h) => h.count));

  const cellColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "hsl(183 100% 30% / 0.5)";
    if (intensity < 0.5) return "hsl(183 100% 40% / 0.7)";
    if (intensity < 0.75) return "hsl(183 100% 50% / 0.85)";
    return "hsl(183 100% 50%)";
  };

  const RepoCard = ({ r, i }: { r: PinnedRepo; i: number }) => (
    <motion.a
      href={r.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="glass rounded-xl p-4 block hover:-translate-y-1 hover:glow-primary transition-all group"
    >
      <div className="flex items-start justify-between mb-1">
        <div className="font-semibold text-primary truncate text-sm group-hover:gradient-text transition-colors">{r.name}</div>
        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0 ml-2 mt-0.5 transition-colors" />
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em] mb-3">
        {r.description || "No description"}
      </p>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        {r.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: LANG_COLORS[r.language] || "hsl(var(--primary))" }}
            />
            {r.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {r.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" /> {r.forks_count}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {fmtDate(r.pushed_at)}
        </span>
      </div>
    </motion.a>
  );

  return (
    <section id="github" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Github className="w-7 h-7" /> Live GitHub Activity
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Fetched live · {totalContribs > 0 && <span className="text-primary">{totalContribs} events</span>}
          {totalContribs > 0 && " in the last 90 days"}
        </p>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="text-center text-muted-foreground text-sm">{error}</p>
        ) : (
          <>
            {/* Contribution Heatmap */}
            <div className="glass rounded-2xl p-5 mb-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                <span>Contribution Activity — Last 90 Days</span>
                <a
                  href={`https://github.com/${USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline normal-case"
                >
                  View on GitHub →
                </a>
              </div>
              <div
                className="grid gap-1 overflow-x-auto"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(heatmap.length / 7)}, minmax(10px, 1fr))`,
                  gridTemplateRows: "repeat(7, 10px)",
                  gridAutoFlow: "column",
                }}
              >
                {heatmap.map((h, i) => (
                  <div
                    key={i}
                    title={`${h.date}: ${h.count} event${h.count !== 1 ? "s" : ""}`}
                    className="rounded-sm cursor-default transition-transform hover:scale-125"
                    style={{
                      width: 10,
                      height: 10,
                      background: cellColor(h.count),
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground justify-end">
                <span>Less</span>
                {[0, 0.2, 0.5, 0.75, 1].map((v, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: cellColor(v === 0 ? 0 : Math.ceil(v * maxCount)) }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-6">
              {(["pinned", "recent", "activity"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "glass text-muted-foreground hover:text-primary"
                  }`}
                >
                  {tab === "pinned" ? "📌 Pinned" : tab === "recent" ? "🕐 Recent" : "⚡ Activity"}
                </button>
              ))}
            </div>

            {activeTab === "pinned" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinned.map((r, i) => (
                  <RepoCard key={r.name} r={r} i={i} />
                ))}
              </div>
            )}

            {activeTab === "recent" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((r, i) => (
                  <RepoCard key={r.id} r={r} i={i} />
                ))}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="glass rounded-xl p-4 max-h-[420px] overflow-y-auto scrollbar-thin space-y-3">
                {events.length === 0 && (
                  <p className="text-xs text-muted-foreground">No recent public activity.</p>
                )}
                {events.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex gap-3 text-xs py-2 border-b border-border/30 last:border-0"
                  >
                    <div className="mt-0.5 text-primary shrink-0">
                      <GitCommit className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground font-medium">{eventLabel(e)}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{fmtDate(e.created_at)}</span>
                      </div>
                      <a
                        href={`https://github.com/${e.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary truncate block hover:underline"
                      >
                        {e.repo.name}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GitHubFeed;
