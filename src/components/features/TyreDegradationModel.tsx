import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { Gauge, Info } from "lucide-react";

type Compound = "soft" | "medium" | "hard" | "inter" | "wet";
type Circuit = "monaco" | "silverstone" | "spa" | "monza" | "singapore";

interface CompoundConfig {
  label: string; color: string; emoji: string;
  baseTime: number; degradRate: number; cliff: number; optWindow: [number, number];
}
interface CircuitConfig {
  label: string; flag: string; laps: number; tyreMulti: number;
}

const COMPOUNDS: Record<Compound, CompoundConfig> = {
  soft:   { label: "Soft",   color: "#ef4444", emoji: "🔴", baseTime: 0,    degradRate: 0.095, cliff: 22, optWindow: [1,  18] },
  medium: { label: "Medium", color: "#f59e0b", emoji: "🟡", baseTime: 0.35, degradRate: 0.055, cliff: 38, optWindow: [5,  32] },
  hard:   { label: "Hard",   color: "#e5e7eb", emoji: "⚪", baseTime: 0.72, degradRate: 0.028, cliff: 55, optWindow: [10, 50] },
  inter:  { label: "Inter",  color: "#22c55e", emoji: "🟢", baseTime: 2.1,  degradRate: 0.12,  cliff: 18, optWindow: [1,  15] },
  wet:    { label: "Wet",    color: "#3b82f6", emoji: "🔵", baseTime: 4.5,  degradRate: 0.18,  cliff: 12, optWindow: [1,  10] },
};

const CIRCUITS: Record<Circuit, CircuitConfig> = {
  monaco:     { label: "Monaco",     flag: "🇲🇨", laps: 78,  tyreMulti: 0.85 },
  silverstone:{ label: "Silverstone",flag: "🇬🇧", laps: 52,  tyreMulti: 1.25 },
  spa:        { label: "Spa",        flag: "🇧🇪", laps: 44,  tyreMulti: 1.10 },
  monza:      { label: "Monza",      flag: "🇮🇹", laps: 53,  tyreMulti: 0.80 },
  singapore:  { label: "Singapore",  flag: "🇸🇬", laps: 62,  tyreMulti: 0.90 },
};

const BASE_LAP = 90.0; // seconds, adjusted per circuit

const generateDegData = (
  compound: Compound, circuit: Circuit, fuelLoad: number, temp: number
) => {
  const cfg = COMPOUNDS[compound];
  const circ = CIRCUITS[circuit];
  const data = [];
  const maxLaps = Math.min(circ.laps, cfg.cliff + 15);

  for (let lap = 1; lap <= maxLaps; lap++) {
    // Fuel effect: ~0.035s per kg, starting ~105kg reducing each lap
    const fuelEffect = (fuelLoad * (1 - (lap - 1) / circ.laps)) * 0.035;

    // Temperature effect
    const tempEffect = (temp - 30) * 0.008;

    // Degradation: polynomial + cliff effect
    const linearDeg = cfg.degradRate * (lap - 1) * circ.tyreMulti;
    const cliffEffect = lap > cfg.cliff
      ? Math.pow((lap - cfg.cliff) * 0.15, 2)
      : 0;

    const lapTime = BASE_LAP + cfg.baseTime + linearDeg + cliffEffect + fuelEffect + tempEffect;
    const degradPct = Math.min(100, ((linearDeg + cliffEffect) / (BASE_LAP * 0.15)) * 100);

    const inOptWindow = lap >= cfg.optWindow[0] && lap <= cfg.optWindow[1];

    data.push({
      lap,
      lapTime: parseFloat(lapTime.toFixed(3)),
      degradPct: parseFloat(degradPct.toFixed(1)),
      isCliff: lap === cfg.cliff,
      inOptWindow,
    });
  }
  return data;
};

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(3);
  return `${m}:${parseFloat(s) < 10 ? "0" : ""}${s}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="glass rounded-xl p-3 text-xs space-y-1 border border-border/50">
      <div className="font-mono text-muted-foreground">Lap {label}</div>
      <div className="text-foreground font-bold">{formatTime(d?.lapTime)}</div>
      <div className="text-muted-foreground">Deg: {d?.degradPct}%</div>
      {d?.inOptWindow && <div className="text-green-400">✓ Optimal window</div>}
      {d?.isCliff && <div className="text-red-400">⚠ Cliff starts here</div>}
    </div>
  );
};

const TyreDegradationModel = () => {
  const [compound, setCompound] = useState<Compound>("medium");
  const [circuit, setCircuit]   = useState<Circuit>("silverstone");
  const [fuelLoad, setFuelLoad] = useState(105);
  const [trackTemp, setTrackTemp] = useState(35);
  const [view, setView] = useState<"laptime" | "deg">("laptime");
  const [data, setData]           = useState(() => generateDegData("medium", "silverstone", 105, 35));

  useEffect(() => {
    setData(generateDegData(compound, circuit, fuelLoad, trackTemp));
  }, [compound, circuit, fuelLoad, trackTemp]);

  const cfg = COMPOUNDS[compound];
  const circ = CIRCUITS[circuit];
  const optStart = data.find(d => d.inOptWindow)?.lap ?? 1;
  const optEnd   = [...data].reverse().find(d => d.inOptWindow)?.lap ?? data.length;
  const cliffLap = cfg.cliff;
  const lapDelta  = data.length > 1
    ? (data[data.length - 1].lapTime - data[0].lapTime).toFixed(3)
    : "0";

  return (
    <section id="tyremodel" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          🛞 Tyre Degradation Model
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Interactive lap time & degradation predictor — adjust compound, circuit, fuel & temperature
        </p>

        {/* Controls */}
        <div className="glass rounded-2xl p-5 mb-6 space-y-4">
          {/* Compound */}
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Tyre Compound</div>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(COMPOUNDS) as Compound[]).map(c => (
                <button key={c} onClick={() => setCompound(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    compound === c
                      ? "text-background border-transparent"
                      : "border-border/40 text-muted-foreground hover:border-primary/40"
                  }`}
                  style={compound === c ? { background: COMPOUNDS[c].color } : {}}>
                  {COMPOUNDS[c].emoji} {COMPOUNDS[c].label}
                </button>
              ))}
            </div>
          </div>

          {/* Circuit */}
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Circuit</div>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(CIRCUITS) as Circuit[]).map(ci => (
                <button key={ci} onClick={() => setCircuit(ci)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    circuit === ci
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/40 text-muted-foreground hover:border-primary/40"
                  }`}>
                  {CIRCUITS[ci].flag} {CIRCUITS[ci].label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">
                Fuel Load — {fuelLoad} kg
              </label>
              <input type="range" min={60} max={110} value={fuelLoad}
                onChange={e => setFuelLoad(Number(e.target.value))}
                className="w-full mt-2 accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>60 kg (low)</span><span>110 kg (full)</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">
                Track Temp — {trackTemp}°C
              </label>
              <input type="range" min={15} max={55} value={trackTemp}
                onChange={e => setTrackTemp(Number(e.target.value))}
                className="w-full mt-2 accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>15°C (cold)</span><span>55°C (hot)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Compound",   val: cfg.label,              color: cfg.color },
            { label: "Cliff Lap",  val: `Lap ${cliffLap}`,     color: "#ef4444" },
            { label: "Opt. Window",val: `L${optStart}–L${optEnd}`, color: "#22c55e" },
            { label: "Δ Lap Time", val: `+${lapDelta}s`,        color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-3 text-center">
              <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart tabs */}
        <div className="flex gap-2 mb-4">
          {(["laptime", "deg"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                view === v ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-primary"
              }`}>
              {v === "laptime" ? "⏱ Lap Time" : "📉 Degradation %"}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-4">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="lap" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 9 }} label={{ value: "Lap", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 9 }} width={48}
                tickFormatter={v => view === "laptime" ? formatTime(v) : `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              {/* Optimal window shading */}
              <ReferenceLine x={optStart} stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1} />
              <ReferenceLine x={optEnd}   stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1} label={{ value: "Opt window", fill: "#22c55e", fontSize: 8 }} />
              {/* Cliff marker */}
              <ReferenceLine x={cliffLap} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "Cliff", fill: "#ef4444", fontSize: 8 }} />
              <Line
                type="monotone"
                dataKey={view === "laptime" ? "lapTime" : "degradPct"}
                stroke={cfg.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                name={view === "laptime" ? "Lap Time (s)" : "Degradation (%)"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insight */}
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            The cliff is the lap where tyre temperature and wear combine to cause rapid grip loss.
            In real F1 strategy, the pit window is typically 2–3 laps before the cliff.
            Higher track temperatures and fuel loads both accelerate degradation.
            {" "}<strong className="text-foreground">Tyre deg modelling</strong> is a core F1 strategy function —
            teams run thousands of simulations per race weekend.
          </span>
        </div>
      </div>
    </section>
  );
};

export default TyreDegradationModel;
