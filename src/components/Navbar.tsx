import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useActiveSection } from "@/hooks/useActiveSection";

const links = [
  { label: "Now",       href: "now" },
  { label: "Education", href: "education" },
  { label: "Skills",    href: "skills" },
  { label: "Projects",  href: "projects" },
  { label: "GitHub",    href: "github" },
  { label: "Coding",    href: "coding" },
  { label: "Research",  href: "research" },
  { label: "Blog",      href: "blog" },
  { label: "Physics",   href: "physics" },
  { label: "Resume",    href: "resume" },
  { label: "Terminal",  href: "terminal" },
  { label: "Contact",   href: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ids = links.map((l) => l.href);
  const active = useActiveSection(ids);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const c = containerRef.current;
    if (el && c) {
      const rect = el.getBoundingClientRect();
      const cRect = c.getBoundingClientRect();
      setPill({ left: rect.left - cRect.left, width: rect.width, opacity: 1 });
    } else {
      setPill((p) => ({ ...p, opacity: 0 }));
    }
  }, [active]);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, mobileOpen ? 300 : 0);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileOpen ? "glass py-3" : "py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center gap-4">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="text-lg font-bold gradient-text shrink-0"
          >
            SB
          </a>

          {/* Desktop nav */}
          <div ref={containerRef} className="hidden md:flex relative items-center gap-1 overflow-x-auto scrollbar-none">
            <motion.div
              className="absolute h-8 rounded-full bg-primary/15 border border-primary/30"
              animate={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{ top: "50%", translateY: "-50%" }}
            />
            {links.map((l) => (
              <a
                key={l.href}
                ref={(el) => (itemRefs.current[l.href] = el)}
                href={`#${l.href}`}
                onClick={(e) => scrollTo(e, l.href)}
                className={`relative z-10 px-3 py-1 text-xs whitespace-nowrap transition-colors ${
                  active === l.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true });
                document.dispatchEvent(ev);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="Open command palette"
            >
              <span>⌘K</span>
            </button>
            <ThemeSwitcher />
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-full glass text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 glass border-l border-border/50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <span className="font-bold gradient-text">Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={`#${l.href}`}
                    onClick={(e) => scrollTo(e, l.href)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm transition-all ${
                      active === l.href
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {l.label}
                    {active === l.href && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </a>
                ))}
              </nav>
              <div className="px-5 py-4 border-t border-border/40 text-xs text-muted-foreground">
                Sankhadeep Bera · IISER Kolkata
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
