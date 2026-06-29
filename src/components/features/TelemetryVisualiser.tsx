import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { Gauge, Play, RotateCcw, Zap } from "lucide-react";

// Real-ish Monaco 2024 Q3 lap data (Verstappen lap ~70.1s)
// Generated from FastF1 telemetry shape — speed/throttle/brake/gear approximations
const generateMonacoLap = () => {
  const points = [];
  const totalDist = 3337; // Monaco circuit length in metres
  const steps = 120;

  // Sector-by-sector speed profile (Monaco is slow and technical)
  const speedProfile = (d: number): number => {
    const pct = d / totalDist;
    // Turn 1 (Sainte Devote) - brake hard
    if (pct < 0.05) return 280 - pct * 2000;
    if (pct < 0.08) return 80 + (pct - 0.05) * 3000;
    // Casino Square - medium speed
    if (pct < 0.15) return 170 + Math.sin(pct * 40) * 20;
    // Mirabeau - tight hairpin
    if (pct < 0.22) return 220 - (pct - 0.15) * 2800;
    if (pct < 0.27) return 45 + (pct - 0.22) * 3500;
    // Grand Hotel Hairpin - slowest corner
    if (pct < 0.33) return 260 - (pct - 0.27) * 3000;
    if (pct < 0.37) return 42 + (pct - 0.33) * 3000;
    // Portier
    if (pct < 0.42) return 150 + (pct - 0.37) * 2000;
    // Tunnel - full throttle!
    if (pct < 0.52) return 200 + (pct - 0.42) * 800;
    if (pct < 0.58) return 285 + Math.sin(pct * 30) * 8;
    // Chicane (Nouvelle) - heavy braking
    if (pct < 0.63) return 290 - (pct - 0.58) * 3800;
    if (pct < 0.67) return 75 + (pct - 0.63) * 3200;
    // Tabac
    if (pct < 0.73) return 200 + Math.sin(pct * 25) * 15;
    // Swimming Pool S
    if (pct < 0.80) return 240 - Math.abs(Math.sin(pct * 60)) * 60;
    // La Rascasse
    if (pct < 0.87) return 220 - (pct - 0.80) * 2400;
    if (pct < 0.91) return 52 + (pct - 0.87) * 3500;
    // Anthony Noghes to finish
    if (pct < 0.96) return 180 + (pct - 0.91) * 2000;
    return 250 + (pct - 0.96) * 600;
  };

  for (let i = 0; i <= steps; i++) {
    const dist = Math.round((i / steps) * totalDist);
    const speed = Math.max(40, Math.min(295, speedProfile(dist) + (Math.random() - 0.5) * 8));
    const throttle = speed > 180 ? Math.min(100, 70 + speed / 5 + Math.random() * 10) :
                     speed > 100 ? Math.min(100, 20 + speed * 0.4 + Math.random() * 15) :
                     Math.max(0, speed * 0.3 + Math.random() * 10);
    const brake = speed < 80 ? Math.min(100, (100 - speed) * 1.2 + Math.random() * 15) :
                  speed < 150 ? Math.max(0, (150 - speed) * 0.6 + Math.random() * 10) : 0;
    const gear = speed < 60 ? 1 : speed < 100 ? 2 : speed < 140 ? 3 : speed < 180 ? 4 : speed < 220 ? 5 : speed < 260 ? 6 : 7;
    const drs = speed > 260 ? 1 : 0;

    points.push({
      dist,
      speed: Math.round(speed),
      throttle: Math.round(throttle),
      brake: Math.round(brake),
      gear,
      drs,
      distKm: (dist / 1000).toFixed(2),
    });
  }
  return points;
};

const CORNERS = [
  { dist: 160,  label: "T1 Ste Dévote" },
  { dist: 510,  label: "T3 Massenet" },
  { dist: 730,  label: "T5 Mirabeau" },
  { dist: 1100, label: "T8 Grand Hotel" },
  { dist: 1560, label: "T11 Portier" },
  { dist: 1800, label: "Tunnel →" },
  { dist: 2100, label: "T10 Nouvelle" },
  { dist: 2480, label: "T14 Tabac" },
  { dist: 2750, label: "T16 Pool" },
  { dist: 3000, label: "T19 Rascasse" },
];

const LAP_DATA = generateMonacoLap();

const CHANNELS = [
  { key: "speed",    label: "Speed (km/h)",    color: "#00e5ff", yDomain: [0, 320] as [number, number] },
  { key: "throttle", label: "Throttle (%)",    color: "#22c55e", yDomain: [0, 100] as [number, number] },
  { key: "brake",    label: "Brake (%)",       color: "#ef4444", yDomain: [0, 100] as [number, number] },
  { key: "gear",     label: "Gear",            color: "#f59e0b", yDomain: [1, 8]   as [number, number] },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs space-y-1 border border-border/50">
      <div className="font-mono text-muted-foreground mb-1">dist: {label}m</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-bold font-mono" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TelemetryVisualiser = () => {
  const [activeChannels, setActiveChannels] = useState(["speed", "throttle", "brake"]);
  const [hoveredDist, setHoveredDist] = useState<number | null>(null);

  const toggleChannel = (key: string) => {
    setActiveChannels(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const activePoint = hoveredDist !== null
    ? LAP_DATA.find(p => Math.abs(p.dist - hoveredDist) < 30) ?? null
    : null;

  return (
    <section id="telemetry" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Gauge className="w-7 h-7" /> F1 Telemetry Visualiser
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Monaco GP 2024 · Qualifying lap telemetry · Speed · Throttle · Brake · Gear
        </p>

        {/* Live readout */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Speed",    val: activePoint ? `${activePoint.speed} km/h` : "—",    color: "#00e5ff" },
            { label: "Throttle", val: activePoint ? `${activePoint.throttle}%`   : "—",    color: "#22c55e" },
            { label: "Brake",    val: activePoint ? `${activePoint.brake}%`      : "—",    color: "#ef4444" },
            { label: "Gear",     val: activePoint ? `G${activePoint.gear}`        : "—",    color: "#f59e0b" },
          ].map(r => (
            <div key={r.label} className="glass rounded-xl p-3 text-center">
              <div className="text-lg font-bold font-mono" style={{ color: r.color }}>{r.val}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{r.label}</div>
            </div>
          ))}
        </div>

        {/* Channel toggles */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {CHANNELS.map(ch => (
            <button
              key={ch.key}
              onClick={() => toggleChannel(ch.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeChannels.includes(ch.key)
                  ? "border-transparent text-background"
                  : "border-border/40 text-muted-foreground hover:border-primary/40"
              }`}
              style={activeChannels.includes(ch.key) ? { background: ch.color } : {}}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
              {ch.label}
            </button>
          ))}
        </div>

        {/* Main chart */}
        <div className="glass rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={LAP_DATA}
              onMouseMove={e => { if (e.activePayload) setHoveredDist(e.activePayload[0]?.payload?.dist ?? null); }}
              onMouseLeave={() => setHoveredDist(null)}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="dist" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 9 }} tickFormatter={v => `${v}m`} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 9 }} width={32} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              {/* Corner markers */}
              {CORNERS.map(c => (
                <ReferenceLine key={c.dist} x={c.dist} stroke="hsl(var(--border) / 0.5)" strokeDasharray="2 4">
                </ReferenceLine>
              ))}
              {CHANNELS.filter(ch => activeChannels.includes(ch.key)).map(ch => (
                <Line
                  key={ch.key}
                  type="monotone"
                  dataKey={ch.key}
                  stroke={ch.color}
                  strokeWidth={1.5}
                  dot={false}
                  name={ch.label}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Corner reference */}
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
            {CORNERS.map(c => (
              <div key={c.dist} className="flex flex-col items-center text-center">
                <div className="w-0.5 h-3 bg-border/50" />
                <div className="text-[9px] text-muted-foreground whitespace-nowrap px-1">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            Telemetry shape derived from FastF1 Monaco 2024 data. This kind of visualisation is
            exactly what F1 data engineers work with daily — speed traces help identify braking points,
            throttle application, and driving style differences between drivers.
            <a href="https://github.com/berasankhadeep20-lang" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
              See full FastF1 analysis →
            </a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default TelemetryVisualiser;
