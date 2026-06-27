import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Same command processor from TerminalSection but self-contained
const INFO: Record<string, string> = {
  name: "Sankhadeep Bera",
  email: "berasankhadeep20@gmail.com",
  github: "https://github.com/berasankhadeep20-lang",
};

const COMMANDS: Record<string, string> = {
  help: "List commands",
  whoami: "Who am I",
  projects: "My projects",
  skills: "Tech skills",
  contact: "Contact info",
  socials: "Social links",
  neofetch: "System info",
  clear: "Clear terminal",
  exit: "Close terminal",
};

let cwd = "~";

function process(input: string): string[] {
  const cmd = input.trim().toLowerCase();
  if (cmd === "help") return ["Commands: " + Object.keys(COMMANDS).join(" · ")];
  if (cmd === "whoami") return ["Sankhadeep Bera — BS-MS @ IISER Kolkata · Programmer · ML Enthusiast"];
  if (cmd === "projects") return ["F1 AI Predictor · LLM Stocks · Football Predictor · Freight Intel · IPL Auction · AARSHI · MATCHDAY"];
  if (cmd === "skills") return ["Python · Java · TypeScript · React · Qiskit · scikit-learn · Firebase · Vite"];
  if (cmd === "contact") return [`Email: ${INFO.email}`, `GitHub: ${INFO.github}`];
  if (cmd === "socials") return ["LinkedIn · X/Twitter · YouTube · Instagram · Codeforces — all @ronnie_deep_04 / RonnieDeep04"];
  if (cmd === "neofetch") return [
    "  ╭─────────────────────────╮",
    "  │  sankhadeep@portfolio   │",
    "  ├─────────────────────────┤",
    "  │  OS:   Portfolio v2     │",
    "  │  Uni:  IISER Kolkata    │",
    "  │  Lang: Python · Java    │",
    "  │  Shell: /bin/curious    │",
    "  ╰─────────────────────────╯",
  ];
  if (cmd === "clear") return ["__CLEAR__"];
  if (cmd === "exit") return ["__EXIT__"];
  if (cmd === "") return [];
  return [`command not found: ${cmd}`, "type 'help' for commands"];
}

interface Line { type: "input" | "output"; text: string; }

const TerminalEasterEgg = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "🎉 You found the easter egg terminal!" },
    { type: "output", text: "Type 'help' for commands, 'exit' to close." },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ignoreRef = useRef(false);

  // Listen for any key typed outside an input/textarea/contenteditable
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return; // already open — let the terminal handle it
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isEditable = (e.target as HTMLElement)?.isContentEditable;
      if (tag === "input" || tag === "textarea" || isEditable) return;
      // Ignore modifier-only keys, function keys, etc.
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
      // Alphanumeric or punctuation — open terminal and seed the char
      setOpen(true);
      setInput(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const submit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next); setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(history[next]); }
      return;
    }
    if (e.key !== "Enter") return;
    const result = process(input);
    if (input.trim()) setHistory((p) => [...p, input]);
    setHistIdx(-1);
    if (result[0] === "__EXIT__") { setOpen(false); setInput(""); return; }
    if (result[0] === "__CLEAR__") { setLines([]); }
    else {
      setLines((p) => [
        ...p,
        { type: "input", text: input },
        ...result.map((t) => ({ type: "output" as const, text: t })),
        { type: "output", text: "" },
      ]);
    }
    setInput("");
  }, [input, history, histIdx]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl overflow-hidden w-full max-w-xl shadow-2xl"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
              <button
                onClick={() => setOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-muted-foreground">sankhadeep@portfolio — easter egg</span>
              <span className="ml-auto text-[10px] text-muted-foreground">Press any key to trigger</span>
            </div>
            {/* Body */}
            <div
              ref={bodyRef}
              className="p-4 h-64 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((l, i) => (
                <div key={i}>
                  {l.type === "input" ? (
                    <div>
                      <span className="text-green-400">❯ </span>
                      <span className="text-foreground">{l.text}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground whitespace-pre">{l.text}</div>
                  )}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-green-400">❯ </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={submit}
                  className="flex-1 bg-transparent outline-none text-foreground ml-1 caret-primary"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalEasterEgg;
