import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, ChevronUp, ExternalLink, Download, Atom, BarChart2, Zap, Activity } from "lucide-react";

const experiments = [
  {
    id: "gamma",
    title: "Gamma Ray Spectroscopy",
    date: "June 2026",
    tags: ["Nuclear Physics", "MCA", "SCA", "NaI(Tl)", "HpGe"],
    emoji: "☢️",
    abstract:
      "Gamma ray spectroscopy using MCA and SCA systems with NaI(Tl), CdZnTe, and HpGe detectors. Calibrated MCA using Co-60, determined unknown energies for Cs-137 and Na-22, measured photopeak efficiencies, identified coincidence sum peaks, and determined absolute Co-60 activity via γ-γ coincidence without any geometric efficiency calibration.",
    keyResults: [
      { label: "Cs-137 Energy",     value: "0.6917 MeV", note: "4.5% error (extrapolation below cal. range)", color: "text-cyan-400" },
      { label: "Na-22 Energy",      value: "1.271 MeV",  note: "0.3% error — excellent",                    color: "text-green-400" },
      { label: "Co-60 Sum Peak",    value: "2.505 MeV",  note: "P = 0.596% coincidence probability",       color: "text-yellow-400" },
      { label: "HpGe Resolution",   value: "≈ 9 keV",    note: "vs 53 keV for NaI(Tl) at 1.173 MeV",     color: "text-purple-400" },
      { label: "Detector τ",        value: "82.1 ns",    note: "from accidental coincidence Sl 3",          color: "text-orange-400" },
      { label: "Co-60 Activity",    value: "(43,462 ± 1,643) Bq", note: "geometry-independent — efficiency cancels", color: "text-rose-400" },
    ],
    sections: [
      {
        title: "Energy Calibration (MCA)",
        icon: "📏",
        content:
          "Calibrated the MCA using two Co-60 lines (1.173 and 1.332 MeV) as reference points. Linear fit: E (MeV) = 7.907×10⁻⁴ · xc + 0.03814. Applied to Cs-137 (xc = 826.44, measured 0.6917 MeV vs literature 0.662 MeV, 4.5% error) and Na-22 (xc = 1559.22, measured 1.271 MeV vs 1.275 MeV, 0.3% error). Na-22 accuracy excellent; Cs-137 deviation reflects extrapolation below calibration range and PMT non-linearity at lower pulse heights.",
      },
      {
        title: "Photopeak Efficiency",
        icon: "📈",
        content:
          "ε = (counts under photopeak)/(total counts). For Co-60: 7.33% at 1.173 MeV and 6.90% at 1.332 MeV. Decrease consistent with declining photoelectric cross-section σ_pe ∝ Z⁵/Eγ³·⁵. At higher energies, Compton scattering dominates and secondary photons escape the 2×2 crystal, reducing peak-to-total ratio.",
      },
      {
        title: "Coincidence Sum Peak",
        icon: "⚡",
        content:
          "Co-60 de-excites via cascade: two simultaneous gammas (Δt ~10⁻¹² s) can register as single event at Esum = 2.505 MeV. Measured coincidence probability P = 6482/(597117+490424) = 0.596%. Cs-137 (single gamma emitter) showed only P = 0.071% with poor R² = 0.627 — attributable to accidental pulse pile-up, not true summing. This contrast directly demonstrates coincidence summing is decay-scheme-dependent.",
      },
      {
        title: "Compton Edge & Backscatter",
        icon: "🔬",
        content:
          "Aluminium block placed behind Co-60 source enhanced backscatter peak. For 1.173 MeV: α = 2.295, ECE = 0.963 MeV, EBS = 0.210 MeV. Verified ECE + EBS ≈ Eγ to within 1% (channel sum 1421.58 vs photopeak at 1436). Discrepancy from finite detector geometry and multiple scattering effects.",
      },
      {
        title: "Detector Comparison",
        icon: "🔭",
        content:
          "Resolution ranking: HpGe (ΔE ≈ 9 keV, R = 0.76%) >> CdZnTe (17.5 keV, 1.49%) > NaI(Tl) 3×3 (49.4 keV, 4.21%) ≈ NaI(Tl) 2×2 (53.4 keV, 4.55%). HpGe generates ~396,000 electron-hole pairs per MeV vs ~3,000 detected photons in NaI, reducing statistical fluctuations by ~11×. Trade-off: HpGe requires cryogenic cooling at 77 K.",
      },
      {
        title: "γ-γ Coincidence — Absolute Activity",
        icon: "⚛️",
        content:
          "Two NaI(Tl) 3×3 detectors flanking Co-60 source. Key insight: A = N₁·N₂/N₁₂,actual — efficiency factors ε₁ and ε₂ cancel exactly. Step 1: τ = N₁₂,acc/(2N₁N₂) = 0.01067/(2×254.577×255.060) = 82.1 ns (from Sl 3 — both SCAs at 1.332 MeV, all coincidences accidental). Step 2: N₁₂,acc in Sl 2 = 0.01289 s⁻¹. Step 3: N₁₂,actual = 1.818 − 0.01289 = 1.8051 s⁻¹. Final: A = 307.639×254.973/1.8051 = 43,462 Bq. Uncertainty 3.78% dominated by fluctuation in the low coincidence rate.",
      },
    ],
    pdfNote: "Full 49-page report with Gaussian fits, OriginPro spectra, and all data tables available",
    pdfUrl: "/gamma_ray_spectroscopy.pdf",
    detectors: [
      { name: "NaI(Tl) 2×2", res: "4.55%", temp: "Room", color: "#3b82f6" },
      { name: "NaI(Tl) 3×3", res: "4.21%", temp: "Room", color: "#06b6d4" },
      { name: "CdZnTe",       res: "1.49%", temp: "Room", color: "#8b5cf6" },
      { name: "HpGe",         res: "0.76%", temp: "77 K",  color: "#22c55e" },
    ],
  },
];

const LabNotebook = () => {
  const [openExp, setOpenExp] = useState<string | null>("gamma");
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {experiments.map((exp) => (
        <div key={exp.id} className="glass rounded-2xl overflow-hidden">
          {/* Experiment header */}
          <button
            onClick={() => setOpenExp(openExp === exp.id ? null : exp.id)}
            className="w-full flex items-start gap-4 p-5 text-left hover:bg-primary/5 transition-colors"
          >
            <span className="text-2xl mt-0.5">{exp.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-semibold text-foreground">{exp.title}</h3>
                <span className="text-xs text-muted-foreground font-mono">{exp.date}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {exp.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {openExp === exp.id ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            )}
          </button>

          <AnimatePresence>
            {openExp === exp.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-6 space-y-5 border-t border-border/40">
                  {/* Abstract */}
                  <p className="text-sm text-muted-foreground leading-relaxed pt-4">{exp.abstract}</p>

                  {/* Key results grid */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                      <BarChart2 className="w-3.5 h-3.5" /> Key Results
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {exp.keyResults.map((r) => (
                        <div key={r.label} className="rounded-xl bg-muted/20 border border-border/40 p-3">
                          <div className={`text-sm font-bold font-mono ${r.color}`}>{r.value}</div>
                          <div className="text-[10px] font-semibold text-foreground mt-0.5">{r.label}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{r.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detector comparison visual */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Detector Resolution at 1.173 MeV
                    </h4>
                    <div className="space-y-2">
                      {exp.detectors.map((d) => (
                        <div key={d.name} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">{d.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(parseFloat(d.res) / 5) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="h-full rounded-full"
                              style={{ background: d.color }}
                            />
                          </div>
                          <span className="text-xs font-mono w-10 text-right" style={{ color: d.color }}>{d.res}</span>
                          <span className="text-[10px] text-muted-foreground w-10">{d.temp}</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-muted-foreground mt-1">Lower is better. HpGe requires cryogenic cooling (77 K).</p>
                    </div>
                  </div>

                  {/* Collapsible sections */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                      <FlaskConical className="w-3.5 h-3.5" /> Experiment Sections
                    </h4>
                    <div className="space-y-2">
                      {exp.sections.map((s) => (
                        <div key={s.title} className="rounded-xl border border-border/40 overflow-hidden">
                          <button
                            onClick={() => setOpenSection(openSection === s.title ? null : s.title)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/5 transition-colors"
                          >
                            <span className="text-base">{s.icon}</span>
                            <span className="text-sm font-medium text-foreground flex-1">{s.title}</span>
                            {openSection === s.title ? (
                              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>
                          <AnimatePresence>
                            {openSection === s.title && (
                              <motion.div
                                initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                                  {s.content}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Crown result callout */}
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <Atom className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-yellow-400 mb-1">Crown Result — Geometry-Independent Activity</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          A = N₁ · N₂ / N₁₂,actual — efficiency factors ε₁ and ε₂ cancel exactly in the ratio, 
                          so no knowledge of detector solid angle, crystal size, or source-detector distance is required. 
                          This is the international standard method for absolute activity calibration of cascade emitters, 
                          used by national metrology institutes worldwide.
                        </div>
                        <div className="mt-2 font-mono text-sm text-yellow-400">
                          A = (43,462 ± 1,643) Bq ≈ 43.5 kBq
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PDF link */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-4">
                    <FlaskConical className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{exp.pdfNote}</span>
                    <a
                      href={exp.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      <Download className="w-3 h-3" /> Full Report PDF
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* More coming soon */}
      <div className="glass rounded-2xl p-5 border border-dashed border-border/40 text-center">
        <div className="text-muted-foreground text-sm">
          🧪 More experiments coming — CFD (OpenFOAM), Quantum Lab, Optics...
        </div>
      </div>
    </div>
  );
};

export default LabNotebook;
