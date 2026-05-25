import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight, Menu, X, Github, Linkedin, Twitter, Youtube,
  Zap, Code2, Users, Calendar, Mic2, Star, ExternalLink,
  Mail, Terminal, Layers, Award, ChevronRight, ChevronUp,
  Cpu, Globe, BarChart2, MessageCircle, GraduationCap,
  Package, CheckCircle, Heart, Flame,
} from "lucide-react";
import botVisual from "@/imports/grid_fault_inspection_bot_VISUAL.png";
import hexaVisual from "@/imports/soil_analysis_hexacopter_VISUAL.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = "#d4af37";
const GOLD_BRIGHT = "#f5c518";
const GOLD_GLOW = "rgba(212,175,55,0.35)";

// ─── Motion helpers ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={`relative ${className}`} style={style}>
      {/* Cinematic light sweep on reveal */}
      {inView && (
        <motion.div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.45) 40%, rgba(245,197,24,0.6) 50%, rgba(212,175,55,0.45) 60%, transparent 100%)`, zIndex: 10 }}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        {children}
      </motion.div>
    </div>
  );
}

function FadeItem({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <motion.div variants={fadeUp} className={className} style={style}>{children}</motion.div>;
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const hovering = useRef(false);
  const animId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onOver = (e: MouseEvent) => {
      hovering.current = !!(e.target as Element).closest("a, button");
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14;
      ring.current.y += (pos.current.y - ring.current.y) * 0.14;
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`;
        dotRef.current.style.top = `${pos.current.y}px`;
      }
      if (ringRef.current) {
        const size = hovering.current ? 48 : 32;
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = hovering.current ? GOLD : `rgba(212,175,55,0.5)`;
        ringRef.current.style.boxShadow = hovering.current ? `0 0 16px ${GOLD_GLOW}` : "none";
      }
      animId.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999]"
        style={{ background: GOLD }}
      />
      <div
        ref={ringRef}
        className="fixed rounded-full border-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] transition-[width,height,border-color,box-shadow] duration-150"
        style={{ borderColor: `rgba(212,175,55,0.5)` }}
      />
    </>
  );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[100] bg-transparent">
      <div className="h-full transition-none" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})`, boxShadow: `0 0 8px ${GOLD_GLOW}` }} />
    </div>
  );
}

// ─── Particle Canvas ──────────────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const scrollVel = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onScroll = () => {
      scrollVel.current += (window.scrollY - lastScrollY.current) * 0.04;
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      r: number; o: number; life: number; maxLife: number; burst: boolean;
    };

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.4,
      o: Math.random() * 0.45 + 0.05,
      life: 1, maxLife: 1, burst: false,
    }));

    // Burst on load — radial explosion from hero center
    const bx = canvas.width / 2, by = canvas.height * 0.42;
    for (let i = 0; i < 55; i++) {
      const ang = (i / 55) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const spd = Math.random() * 2.8 + 0.5;
      const life = 90 + Math.floor(Math.random() * 70);
      particles.push({
        x: bx + (Math.random() - 0.5) * 30,
        y: by + (Math.random() - 0.5) * 30,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        r: Math.random() * 2.5 + 0.5, o: Math.random() * 0.85 + 0.3,
        life, maxLife: life, burst: true,
      });
    }

    let id: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scrollVel.current *= 0.88;
      const sv = scrollVel.current;

      for (let pi = particles.length - 1; pi >= 0; pi--) {
        const p = particles[pi];
        if (p.burst) {
          p.life--;
          if (p.life <= 0) { particles.splice(pi, 1); continue; }
          p.vx *= 0.97; p.vy *= 0.97;
          p.x += p.vx; p.y += p.vy;
          const lr = p.life / p.maxLife;
          const alpha = p.o * lr * lr;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.4 + lr * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${alpha})`;
          ctx.fill();
          if (lr > 0.45) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
            ctx.strokeStyle = `rgba(245,197,24,${alpha * 0.45})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        } else {
          const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) { p.vx += (dx / d) * 0.08; p.vy += (dy / d) * 0.08; }
          p.vy += sv * 0.05;
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > 1.3) { p.vx = (p.vx / spd) * 1.3; p.vy = (p.vy / spd) * 1.3; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${p.o})`;
          ctx.fill();
        }
      }

      // Connections between ambient particles only
      const ambient = particles.filter(p => !p.burst);
      for (let i = 0; i < ambient.length; i++) {
        for (let j = i + 1; j < ambient.length; j++) {
          const dx = ambient[i].x - ambient[j].x, dy = ambient[i].y - ambient[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(ambient[i].x, ambient[i].y);
            ctx.lineTo(ambient[j].x, ambient[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.07 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />;
}

// ─── Floating Orbs ────────────────────────────────────────────────────────────

function FloatingOrbs() {
  const orbs = [
    { size: 520, color: "rgba(212,175,55,0.055)", x: "10%", y: "18%", dur: 26, dx: 65, dy: 50 },
    { size: 400, color: "rgba(168,85,247,0.07)", x: "80%", y: "52%", dur: 32, dx: -80, dy: 45 },
    { size: 310, color: "rgba(59,130,246,0.045)", x: "48%", y: "78%", dur: 22, dx: 50, dy: -65 },
    { size: 230, color: "rgba(212,175,55,0.04)", x: "88%", y: "10%", dur: 38, dx: -50, dy: 72 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.x, top: orb.y,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
          animate={{ x: [0, orb.dx, -orb.dx * 0.4, 0], y: [0, orb.dy, -orb.dy * 0.3, 0] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 5 }}
        />
      ))}
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ target, suffix = "" }: { target: number | string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || typeof target !== "number") return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1500, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{typeof target === "number" ? count : target}{suffix}</span>;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ label, percent }: { label: string; percent: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-mono-code font-medium" style={{ color: GOLD }}>{percent}%</span>
      </div>
      <div className="h-px bg-border overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({ children, className = "", intensity = 10 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transition = "none";
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * intensity}deg) rotateX(${-(y - 0.5) * intensity}deg) scale(1.025)`;
    el.style.boxShadow = `0 22px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.1)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,175,55,0.09) 0%, transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  }, [intensity]);

  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "";
    if (glareRef.current) { glareRef.current.style.opacity = "0"; }
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`relative ${className}`} style={{ transformStyle: "preserve-3d", transition: "transform 0.5s ease" }}>
      {/* Specular glare layer */}
      <div ref={glareRef} className="absolute inset-0 rounded pointer-events-none transition-opacity duration-300" style={{ opacity: 0, zIndex: 5 }} />
      {children}
    </div>
  );
}

// ─── Ripple Button ────────────────────────────────────────────────────────────

function RippleBtn({ children, className = "", onClick, style }: { children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handle = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onClick?.();
  };
  return (
    <span onClick={handle} className={`relative overflow-hidden inline-flex items-center justify-center ${className}`} style={{ transform: "translateZ(0)", ...style }}>
      {children}
      {ripples.map(rp => (
        <span key={rp.id} className="animate-ripple pointer-events-none" style={{ left: rp.x, top: rp.y }} />
      ))}
    </span>
  );
}

// ─── Typing Text ──────────────────────────────────────────────────────────────

const WORDS = ["AI.", "Automation.", "Community.", "The Future."];

function TypingText() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    if (!del && shown === word) { const t = setTimeout(() => setDel(true), 1800); return () => clearTimeout(t); }
    if (del && shown === "") { setDel(false); setIdx(i => (i + 1) % WORDS.length); return; }
    const t = setTimeout(() => setShown(del ? shown.slice(0, -1) : word.slice(0, shown.length + 1)), del ? 45 : 95);
    return () => clearTimeout(t);
  }, [shown, del, idx]);

  return (
    <span>
      <span className="text-gold-gradient">{shown}</span>
      <span className="animate-blink ml-0.5 font-thin" style={{ color: GOLD }}>|</span>
    </span>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function Countdown({ target }: { target: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="flex gap-3 mt-3">
      {([["d", t.d], ["h", t.h], ["m", t.m], ["s", t.s]] as [string, number][]).map(([k, v]) => (
        <div key={k} className="flex flex-col items-center">
          <span className="text-base font-mono-code font-bold leading-none" style={{ color: GOLD }}>{String(v).padStart(2, "0")}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{k}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    const pieces = Array.from({ length: 80 }, () => ({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12, vy: -(Math.random() * 12 + 4),
      color: [GOLD, GOLD_BRIGHT, "#ffffff", "#00ff88"][Math.floor(Math.random() * 4)],
      size: Math.random() * 6 + 3, rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 10,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.rot += p.rotV;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2); ctx.restore();
      }
      if (alive) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [active]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Canvas 2D Wireframe Torus ────────────────────────────────────────────────

function HeroGeometryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Build torus vertices + edges
    const R = 110, r = 38, rings = 32, segs = 20;
    type Vec3 = [number, number, number];
    const verts: Vec3[] = [];
    const edges: [number, number][] = [];
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < segs; j++) {
        const u = (i / rings) * Math.PI * 2;
        const v = (j / segs) * Math.PI * 2;
        verts.push([
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v),
        ]);
        edges.push([i * segs + j, i * segs + ((j + 1) % segs)]);
        edges.push([i * segs + j, ((i + 1) % rings) * segs + j]);
      }
    }

    // Icosahedron vertices (golden ratio)
    const t = (1 + Math.sqrt(5)) / 2;
    const icoBase: Vec3[] = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ].map(([x, y, z]) => { const n = Math.sqrt(x*x+y*y+z*z); return [x/n*60, y/n*60, z/n*60]; });
    const icoEdges: [number, number][] = [
      [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
      [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11],
    ];

    let angle = 0;
    let id: number;

    const project = (v: Vec3, rotY: number, rotX: number, cx: number, cy: number, fov: number): [number, number, number] => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let [x, y, z] = v;
      // Rotate Y
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      // Rotate X
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const pz = fov / (fov + z2 + 250);
      return [cx + x1 * pz, cy + y2 * pz, z2];
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.004;
      const cx = canvas.width * 0.65;
      const cy = canvas.height * 0.42;
      const rotY = angle + mouse.current.x * 0.25;
      const rotX = angle * 0.4 + mouse.current.y * 0.18;

      // Draw torus
      const proj = verts.map(v => project(v, rotY, rotX, cx, cy, 600));
      for (const [a, b] of edges) {
        const pa = proj[a], pb = proj[b];
        const depth = (pa[2] + pb[2]) / 2;
        const op = Math.max(0.02, Math.min(0.45, (depth + 250) / 500)) * 0.7;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.strokeStyle = `rgba(212,175,55,${op})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Draw icosahedron (counter-rotate)
      const icoProj = icoBase.map(v => project(v, -angle * 0.7, angle * 0.5, cx, cy, 600));
      for (const [a, b] of icoEdges) {
        const pa = icoProj[a], pb = icoProj[b];
        const op = 0.15;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.strokeStyle = `rgba(245,197,24,${op})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      id = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Events", href: "#events" },
  { label: "Podcast", href: "#podcast" },
  { label: "Community", href: "#community" },
  { label: "Contact", href: "#contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-xl" : "bg-transparent"}`} style={{ borderBottom: scrolled ? `1px solid ${GOLD}22` : "none" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-xl font-black uppercase tracking-widest">
          Creova<span style={{ color: GOLD }}>.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left" style={{ background: GOLD }} />
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <RippleBtn className="text-sm font-medium px-5 py-2 rounded" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}>
            Free Tech Audit <ArrowRight size={14} className="inline ml-1" />
          </RippleBtn>
        </div>
        <button className="md:hidden text-foreground p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-5 space-y-4">
          {navLinks.map(l => <a key={l.label} href={l.href} className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded" style={{ background: GOLD, color: "#0a0a0a" }}>
            Free Tech Audit <ArrowRight size={14} />
          </a>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Floating atmospheric orbs */}
      <FloatingOrbs />

      {/* Animated grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Canvas wireframe geometry */}
      <HeroGeometryCanvas />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3, background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ zIndex: 3, background: "linear-gradient(to bottom, transparent, #0a0a0a)" }} />

      <div className="relative max-w-7xl mx-auto px-6 py-32" style={{ zIndex: 4 }}>
        <AnimatedSection>
          <FadeItem>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code text-muted-foreground border rounded px-3 py-1.5 mb-10" style={{ borderColor: `${GOLD}33` }}>
              <Flame size={11} style={{ color: GOLD }} />
              3 client spots + 1 hackathon planned for Q3 2026
            </div>
          </FadeItem>

          <FadeItem>
            <p className="text-sm font-mono-code mb-4 uppercase tracking-widest" style={{ color: GOLD }}>
              Creova Solution
            </p>
          </FadeItem>

          <FadeItem>
            <h1 className="font-display font-black uppercase leading-none tracking-tight mb-6 text-[clamp(3.5rem,11vw,10rem)]">
              <TypingText />
              <br />
              <span className="text-foreground opacity-20 text-[0.5em]">Build. Automate. Connect.</span>
            </h1>
          </FadeItem>

          <FadeItem>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4 font-light leading-relaxed">
              AI, automation, custom software, and community events for founders who want to grow.
            </p>
          </FadeItem>

          <FadeItem>
            <p className="text-base text-muted-foreground/50 max-w-xl mb-12 leading-relaxed">
              From AI integration to hackathons. From 1-on-1 mentorship to job boards. We build technology and bring people together.
            </p>
          </FadeItem>

          <FadeItem>
            <div className="flex flex-wrap gap-4 items-center">
              <RippleBtn className="text-sm font-medium px-8 py-3.5 rounded animate-gold-pulse" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}>
                Free Tech Audit <ArrowRight size={15} className="inline ml-2" />
              </RippleBtn>
              <a href="#events" className="inline-flex items-center gap-2 border text-foreground font-medium px-8 py-3.5 rounded text-sm hover:border-opacity-60 transition-all hover:-translate-y-0.5" style={{ borderColor: "#2a2a2a" }}>
                Upcoming Events <ArrowRight size={15} />
              </a>
            </div>
          </FadeItem>

          {/* Floating stats */}
          <FadeItem className="mt-16 grid grid-cols-3 gap-px max-w-md" style={{ background: "#2a2a2a" }}>
            {[["25+", "Solutions"], ["5.0", "Rating"], ["500+", "Subscribers"]].map(([v, l]) => (
              <div key={l} className="bg-background px-4 py-3 text-center">
                <div className="font-display text-xl font-black" style={{ color: GOLD }}>{v}</div>
                <div className="text-[10px] font-mono-code text-muted-foreground uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </FadeItem>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ zIndex: 4 }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} className="w-5 h-8 border border-border/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full" style={{ background: GOLD, opacity: 0.6 }} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: 25, suffix: "+", label: "Solutions Deployed" },
  { value: "5.0", suffix: "", label: "Client Rating" },
  { value: 100, suffix: "+", label: "GitHub Contributions" },
  { value: 500, suffix: "+", label: "Newsletter Subscribers" },
  { value: 15, suffix: "+", label: "Mentorship Matches" },
  { value: 10, suffix: "+", label: "Podcast Episodes" },
];

function Stats() {
  return (
    <section className="border-y" style={{ borderColor: "#2a2a2a", background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px" style={{ background: "#2a2a2a" } as React.CSSProperties}>
          {stats.map((s, i) => (
            <FadeItem key={i}>
              <div className="bg-[#111111] px-4 py-8 text-center relative overflow-hidden group">
                <div className="shimmer-gold absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="font-display text-4xl font-black mb-1 relative" style={{ color: GOLD }}>
                  <Counter target={s.value as number} suffix={s.suffix} />
                </div>
                <div className="text-xs font-mono-code text-muted-foreground uppercase tracking-widest relative">{s.label}</div>
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)` }} />
              </div>
            </FadeItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

const services = [
  { icon: Code2, title: "Custom Software", desc: "Web apps, dashboards, internal tools built for your specific workflow.", features: ["Tailored to your process", "Source code owned by you", "30 days of support"], timeline: "4–8 weeks", badge: "Most Popular" },
  { icon: Zap, title: "AI & Automation", desc: "LLM integration, smart workflows, and robotic process automation.", features: ["ChatGPT/Claude integration", "Document processing", "Workflow automation"], timeline: "2–6 weeks", badge: "" },
  { icon: Layers, title: "Technical Consulting", desc: "Audits, stack reviews, roadmap planning, fractional CTO.", features: ["No lock-in contracts", "Plain English explanations", "Actionable roadmap"], timeline: "1-week sprint+", badge: "" },
  { icon: Cpu, title: "MVP in 30 Days", desc: "From idea to deployed working product in one month.", features: ["Working deployed app", "Full source code", "Basic documentation", "Deployment support"], timeline: "30 days", badge: "Fast Track" },
];

function Services() {
  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>What We Do</span>
                <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">Services</h2>
              </div>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Custom solutions for growing businesses. Fixed-price packages available.</p>
            </div>
          </FadeItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#2a2a2a" }}>
            {services.map((s, i) => (
              <FadeItem key={i}>
                <TiltCard className="bg-background p-8 h-full group" intensity={8}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      {/* Energy rings — expand outward on hover */}
                      <div className="absolute inset-0 rounded-xl border opacity-0 group-hover:opacity-100 transition-all duration-300 scale-100 group-hover:scale-[1.3]"
                        style={{ borderColor: `${GOLD}35`, borderWidth: 1 }} />
                      <div className="absolute inset-0 rounded-xl border opacity-0 group-hover:opacity-50 transition-all duration-500 scale-100 group-hover:scale-[1.65]"
                        style={{ borderColor: `${GOLD}18`, borderWidth: 1 }} />
                      <div className="absolute inset-0 rounded-xl border flex items-center justify-center transition-all duration-300"
                        style={{ borderColor: `${GOLD}28`, background: `${GOLD}06` }}>
                        <s.icon size={17} style={{ color: GOLD, opacity: 0.75 }} className="relative z-10 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </div>
                    {s.badge && <span className="text-xs font-mono-code border rounded px-2 py-0.5" style={{ color: GOLD, borderColor: `${GOLD}44` }}>{s.badge}</span>}
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{s.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {s.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle size={11} className="shrink-0" style={{ color: GOLD }} />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-border pt-5">
                    <span className="text-xs font-mono-code text-muted-foreground">{s.timeline}</span>
                    <a href="#contact" className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: GOLD }}>
                      Learn More <ArrowRight size={11} />
                    </a>
                  </div>
                </TiltCard>
              </FadeItem>
            ))}
          </div>

          <FadeItem className="mt-10 text-center">
            <p className="text-muted-foreground text-sm">
              Not sure what you need?{" "}
              <a href="#contact" className="underline underline-offset-4 hover:opacity-80 transition-opacity" style={{ color: GOLD }}>
                Book a free 20-min discovery call →
              </a>
            </p>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Dev Lab ──────────────────────────────────────────────────────────────────

const devCards = [
  { title: "Boilerplates", desc: "React, Node, Python starters to launch your project faster.", icon: Package },
  { title: "Clean Code", desc: "Documented, tested, production-ready examples.", icon: Terminal },
  { title: "Multi-Stack", desc: "AWS, Vercel, Supabase examples for real-world apps.", icon: Layers },
  { title: "Open Source", desc: "Free to use, fork, and contribute. MIT licensed.", icon: Code2 },
];

function DevLab() {
  return (
    <section className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Free & Open</span>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">DEV LAB</h2>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Open-source tools, boilerplates, and code we maintain — free for anyone to use.</p>
            </div>
          </FadeItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devCards.map((c, i) => (
              <FadeItem key={i}>
                <TiltCard className="border border-border rounded p-6 h-full flex flex-col hover:border-opacity-50 transition-all" intensity={12}>
                  <c.icon size={20} className="mb-5 shrink-0" style={{ color: GOLD }} />
                  <h3 className="font-display text-xl font-bold uppercase mb-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-5 flex-1">{c.desc}</p>
                  <a href="#" className="text-xs font-medium flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: GOLD }}>
                    View on GitHub <ExternalLink size={10} />
                  </a>
                </TiltCard>
              </FadeItem>
            ))}
          </div>

          <FadeItem className="mt-10 flex items-center gap-3">
            <Github size={14} className="text-muted-foreground" />
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All code on GitHub: github.com/creovasolution →
            </a>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Belief ───────────────────────────────────────────────────────────────────

function Belief() {
  return (
    <section className="py-36 border-y" style={{ borderColor: "#2a2a2a", position: "relative", overflow: "hidden" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(212,175,55,0.05), transparent)" }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem>
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-8" style={{ color: GOLD }}>Our Belief</span>
          </FadeItem>
          <FadeItem>
            <blockquote className="font-display font-black uppercase leading-tight max-w-5xl text-[clamp(2rem,5.5vw,5rem)]">
              "Technology should be a{" "}
              <span className="text-gold-gradient">tool</span>
              {", not a "}
              <span className="text-gold-gradient">trap.</span>"
            </blockquote>
          </FadeItem>
          <FadeItem>
            <p className="mt-10 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              We believe in honest code, clear communication, and building things that last. Creova Solution exists to give founders and teams the clarity, code, and consulting they need to grow without technical debt.
            </p>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Blueprint / Architecture Diagram ────────────────────────────────────────

const BP_NODES = [
  { x: 80,  y: 185, num: "01", title: "Audit",     sub: ["Discovery", "Tech review"] },
  { x: 295, y: 88,  num: "02", title: "Architect",  sub: ["Stack design", "Roadmap"] },
  { x: 510, y: 185, num: "03", title: "Build",      sub: ["Dev + AI", "Integration"] },
  { x: 510, y: 318, num: "AI", title: "Automate",   sub: ["LLM flows", "Scripts"] },
  { x: 725, y: 88,  num: "04", title: "Launch",     sub: ["Deploy", "QA"] },
  { x: 940, y: 185, num: "05", title: "Scale",      sub: ["Support", "Iteration"] },
];

const BP_EDGES = [
  "M 80 185 L 295 88",
  "M 295 88 L 510 185",
  "M 510 185 L 510 318",
  "M 510 185 L 725 88",
  "M 725 88 L 940 185",
  "M 510 318 Q 790 395 940 185",
];

function BlueprintSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#080808" }}>
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.035) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Corner bracket marks */}
      {[
        { top: "top-5 left-5",   border: "border-t border-l" },
        { top: "top-5 right-5",  border: "border-t border-r" },
        { top: "bottom-5 left-5",  border: "border-b border-l" },
        { top: "bottom-5 right-5", border: "border-b border-r" },
      ].map(({ top, border }) => (
        <div key={top} className={`absolute ${top} ${border} w-5 h-5 pointer-events-none`} style={{ borderColor: `${GOLD}28` }} />
      ))}

      <div className="max-w-7xl mx-auto px-6" ref={wrapRef}>
        <AnimatedSection>
          <FadeItem className="mb-14">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Methodology</span>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">The Blueprint</h2>
              <p className="text-xs font-mono-code text-muted-foreground leading-relaxed">
                <span style={{ color: GOLD }}>// </span>From idea to deployed system<br />
                <span style={{ color: GOLD }}>// </span>Every step. Every layer.
              </p>
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* SVG Diagram */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <svg viewBox="0 0 1020 400" className="w-full min-w-[680px]" style={{ maxHeight: 400 }}>
            <defs>
              <filter id="bp-glow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="bp-dot">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Animated edge paths */}
            {BP_EDGES.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(212,175,55,0.22)"
                strokeWidth="1"
                strokeDasharray="5 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.3 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}

            {/* Flowing gold signal dots */}
            {inView && BP_EDGES.map((d, i) => (
              <circle key={`dot-${i}`} r="2.5" fill={GOLD} opacity="0.9" filter="url(#bp-dot)">
                <animateMotion
                  dur={`${2.2 + i * 0.38}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.48}s`}
                  path={d}
                />
              </circle>
            ))}

            {/* Nodes */}
            {BP_NODES.map((n, i) => (
              <motion.g
                key={n.num}
                transform={`translate(${n.x}, ${n.y})`}
                style={{ transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.65 + i * 0.12, type: "spring", stiffness: 180, damping: 18 }}
              >
                {/* Ghost outer ring */}
                <circle cx={0} cy={0} r="35" fill="rgba(212,175,55,0.02)" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                {/* Main ring */}
                <circle cx={0} cy={0} r="26" fill="#080808" stroke="rgba(212,175,55,0.55)" strokeWidth="1" filter="url(#bp-glow)" />
                {/* Inner tint */}
                <circle cx={0} cy={0} r="18" fill="rgba(212,175,55,0.07)" />
                {/* Node number */}
                <text x={0} y={-3} textAnchor="middle" fill={GOLD} fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                  {n.num}
                </text>
                {/* Node title */}
                <text x={0} y={8} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5.8" fontFamily="JetBrains Mono, monospace">
                  {n.title.toUpperCase()}
                </text>
                {/* Sub-labels */}
                {n.sub.map((line, j) => (
                  <motion.text
                    key={j}
                    x={0}
                    y={44 + j * 12}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.2)"
                    fontSize="5.5"
                    fontFamily="JetBrains Mono, monospace"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                  >
                    {line}
                  </motion.text>
                ))}
                {/* Corner tick marks at bounding box */}
                {([[-1,-1],[1,-1],[1,1],[-1,1]] as [number,number][]).map(([sx, sy], ti) => (
                  <g key={ti}>
                    <line x1={sx*35} y1={sy*35} x2={sx*35 - sx*7} y2={sy*35} stroke="rgba(212,175,55,0.25)" strokeWidth="0.8" />
                    <line x1={sx*35} y1={sy*35} x2={sx*35} y2={sy*35 - sy*7} stroke="rgba(212,175,55,0.25)" strokeWidth="0.8" />
                  </g>
                ))}
              </motion.g>
            ))}

            {/* Footer revision stamp */}
            <motion.text
              x="510" y="390"
              textAnchor="middle"
              fill="rgba(212,175,55,0.13)"
              fontSize="6.5"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="2.5"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 2.4, duration: 0.7 }}
            >
              CREOVA SOLUTION — SYSTEM ARCHITECTURE REV. 2026
            </motion.text>
          </svg>
        </div>

        {/* Legend */}
        <AnimatedSection className="mt-8 flex flex-wrap gap-8 items-center">
          <FadeItem className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
            <span className="text-xs font-mono-code text-muted-foreground">Process node</span>
          </FadeItem>
          <FadeItem className="flex items-center gap-2">
            <svg width="28" height="4"><line x1="0" y1="2" x2="28" y2="2" stroke="rgba(212,175,55,0.4)" strokeWidth="1" strokeDasharray="4 3" /></svg>
            <span className="text-xs font-mono-code text-muted-foreground">Data flow path</span>
          </FadeItem>
          <FadeItem className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full animate-gold-pulse" style={{ background: GOLD }} />
            <span className="text-xs font-mono-code text-muted-foreground">Live signal</span>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Grid Fault Inspection Bot ────────────────────────────────────────────────

const BOT_DIAGRAM_NODES = [
  { id: "batt",   x: 100, y: 240, abbr: "BATT",  title: "Power Source",   sub: ["12V 20Ah", "LiFePO4"],  bg: "rgba(212,175,55,0.08)" },
  { id: "buck",   x: 100, y: 125, abbr: "5VREG",  title: "Buck Converter", sub: ["SD200-5", "5A / 5V"],   bg: "rgba(212,175,55,0.05)" },
  { id: "mcu",    x: 300, y: 185, abbr: "RPi4",   title: "Main Controller",sub: ["BCM2711", "1.5 GHz"],   bg: "rgba(212,175,55,0.10)" },
  { id: "driver", x: 520, y: 240, abbr: "2×32A",  title: "Motor Driver",   sub: ["Sabertooth", "2×32A"],  bg: "rgba(212,175,55,0.05)" },
  { id: "lmotor", x: 720, y: 170, abbr: "L-MTR",  title: "Left Motor",     sub: ["5203 Series", "312 RPM"],bg: "rgba(212,175,55,0.05)" },
  { id: "rmotor", x: 720, y: 305, abbr: "R-MTR",  title: "Right Motor",    sub: ["5203 Series", "312 RPM"],bg: "rgba(212,175,55,0.05)" },
  { id: "camera", x: 520, y: 88,  abbr: "FLIR",   title: "Thermal Camera", sub: ["Boson 640", "VGA 30 Hz"],bg: "rgba(212,175,55,0.12)" },
  { id: "modem",  x: 720, y: 50,  abbr: "5G",     title: "5G Modem",       sub: ["Sixfab", "Real-time"],  bg: "rgba(212,175,55,0.05)" },
];

const BOT_DIAGRAM_EDGES = [
  { path: "M 100 240 L 520 240",         color: GOLD },
  { path: "M 100 240 L 100 125",         color: GOLD },
  { path: "M 100 125 L 300 185",         color: GOLD },
  { path: "M 300 185 L 520 240",         color: "rgba(212,175,55,0.7)" },
  { path: "M 300 185 L 520 88",          color: "rgba(212,175,55,0.7)" },
  { path: "M 300 185 Q 490 10 720 50",   color: "rgba(212,175,55,0.7)" },
  { path: "M 520 240 L 720 170",         color: GOLD },
  { path: "M 520 240 L 720 305",         color: GOLD },
];

const BOT_PARTS = [
  { name: "Main Controller",       product: "Raspberry Pi 4B (4GB)",         cat: "electrical", type: "mcu",        qty: 1,  total: 55.00   },
  { name: "Thermal Imager",        product: "FLIR Boson 640 Radiometric",     cat: "electrical", type: "sensor",     qty: 1,  total: 2800.00 },
  { name: "5G Communications",     product: "Sixfab 5G Modem Kit",            cat: "electrical", type: "module",     qty: 1,  total: 350.00  },
  { name: "Motor Controller",      product: "Sabertooth 2×32",                cat: "electrical", type: "driver",     qty: 1,  total: 125.00  },
  { name: "Left Drive Motor",      product: "GoBILDA 5203 Yellow Jacket",     cat: "electrical", type: "actuator",   qty: 1,  total: 35.00   },
  { name: "Right Drive Motor",     product: "GoBILDA 5203 Yellow Jacket",     cat: "electrical", type: "actuator",   qty: 1,  total: 35.00   },
  { name: "Battery Pack",          product: "Bioenno 12V 20Ah LiFePO4",       cat: "electrical", type: "power",      qty: 1,  total: 220.00  },
  { name: "MCU Power Regulator",   product: "SD200-5 Step Down 5V",           cat: "electrical", type: "power",      qty: 1,  total: 15.00   },
  { name: "Chassis Frame Rails",   product: "2020 V-Slot Aluminum Extrusion", cat: "mechanical", type: "structural", qty: 4,  total: 18.00   },
  { name: "Drive Wheels",          product: "120mm Rough Terrain Wheels",     cat: "mechanical", type: "mechanism",  qty: 2,  total: 24.00   },
  { name: "Rear Swivel Caster",    product: "2-inch Heavy Duty Caster",       cat: "mechanical", type: "mechanism",  qty: 1,  total: 8.50    },
  { name: "Weatherproof Housing",  product: "PETG 3D-Printed Enclosure IP65", cat: "mechanical", type: "3d_printed", qty: 1,  total: 15.00   },
  { name: "Camera Gimbal Mount",   product: "PETG Vibration-Isolated Mount",  cat: "mechanical", type: "3d_printed", qty: 1,  total: 3.50    },
  { name: "Motor Mount Plates",    product: "Reinforced PETG Brackets",       cat: "mechanical", type: "3d_printed", qty: 2,  total: 5.00    },
  { name: "Corner Brackets",       product: "2020 Aluminum Corner Brackets",  cat: "mechanical", type: "structural", qty: 8,  total: 6.00    },
  { name: "T-Slot Nuts",           product: "M5 T-Nuts for 2020 Profile",     cat: "mechanical", type: "misc",       qty: 20, total: 2.00    },
  { name: "Frame Screws",          product: "M5 Button Head Hex Screws",      cat: "mechanical", type: "misc",       qty: 20, total: 1.60    },
  { name: "PCB Standoffs",         product: "M3 Nylon Hex Standoffs",         cat: "mechanical", type: "misc",       qty: 8,  total: 0.40    },
];

const BOT_PHASES = [
  {
    id: "fabricate", label: "01 / Fabricate",
    steps: [
      "Print weatherproof main housing and lids in PETG",
      "Print high-precision thermal camera gimbal mount",
      "Print reinforced motor mounting brackets",
      "Cut and deburr aluminum V-slot rails to length",
      "Test-fit M3 nylon standoffs into enclosure floor",
    ],
  },
  {
    id: "wire", label: "02 / Wiring",
    steps: [
      "Solder high-current XT60 leads to motor driver power input",
      "Connect motors to driver terminals with 16AWG wire",
      "Wire battery output to 5V buck converter input",
      "Solder 5V regulated output to Raspberry Pi power pins",
      "Establish UART serial link between MCU and motor driver (GPIO18 → S1)",
      "Apply heat shrink to all exposed power junctions",
    ],
  },
  {
    id: "bringup", label: "03 / Bring-up",
    steps: [
      "Verify 5V rail stability before connecting MCU",
      "Initialize 5G modem and verify cellular data link",
      "Capture and stream VGA frames from Boson camera",
      "Calibrate motor driver throttle range and direction",
      "Test failsafe logic for battery low-voltage cutoff",
    ],
  },
  {
    id: "assemble", label: "04 / Assembly",
    steps: [
      "Assemble 2020 frame using corner brackets and M5 hardware",
      "Mount drive motors and wheels to chassis rails",
      "Secure swivel caster to rear chassis center",
      "Install RPi, modem, and driver into printed enclosure via M3 standoffs",
      "Fix thermal camera mount to front of enclosure",
      "Secure battery pack to frame center using Velcro straps",
      "Perform final enclosure seal and IP65 verification",
    ],
  },
];

function BotShowcaseSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-80px" });
  const [activePhase, setActivePhase] = useState(0);
  const [showAllParts, setShowAllParts] = useState(false);

  const totalCost = BOT_PARTS.reduce((sum, p) => sum + p.total, 0);
  const displayedParts = showAllParts ? BOT_PARTS : BOT_PARTS.slice(0, 9);

  const typeColor = (type: string) => {
    const m: Record<string, string> = {
      mcu: "#a855f7", sensor: GOLD_BRIGHT, module: "#3b82f6", driver: "#ef4444",
      actuator: "#22c55e", power: "#f97316", structural: "#64748b",
      mechanism: "#14b8a6", "3d_printed": "#ec4899", misc: "#4b5563",
    };
    return m[type] ?? GOLD;
  };

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#060608" }}>
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(212,175,55,0.008) 3px, rgba(212,175,55,0.008) 4px)`,
        }}
      />
      {/* Corner bracket marks */}
      {(["top-5 left-5 border-t border-l", "top-5 right-5 border-t border-r", "bottom-5 left-5 border-b border-l", "bottom-5 right-5 border-b border-r"] as const).map((cls) => (
        <div key={cls} className={`absolute ${cls} w-5 h-5 pointer-events-none`} style={{ borderColor: `${GOLD}28` }} />
      ))}

      <div className="max-w-7xl mx-auto px-6" ref={wrapRef}>

        {/* ── Header ── */}
        <AnimatedSection>
          <FadeItem className="mb-14">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>
              Case Study / Client Build
            </span>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase leading-none">
                Grid Fault<br />
                <span className="text-gold-gradient">Inspection Bot</span>
              </h2>
              <div className="text-right">
                <p className="text-xs font-mono-code text-muted-foreground leading-relaxed">
                  <span style={{ color: GOLD }}>// </span>Autonomous thermal fault detection<br />
                  <span style={{ color: GOLD }}>// </span>Power line corridor inspection robot
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono-code"
                  style={{ borderColor: `${GOLD}33`, color: GOLD, background: `rgba(212,175,55,0.05)` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-gold-pulse" style={{ background: GOLD }} />
                  System Deployed
                </div>
              </div>
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* ── Hero row: image + specs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: `${GOLD}22`, background: "#0d0d10" }}>
              <ImageWithFallback
                src={botVisual}
                alt="Grid Fault Inspection Bot — autonomous wheeled robot with FLIR thermal camera on aluminum T-slot frame"
                className="w-full h-[380px] object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* HUD overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)` }} />
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}22, transparent)` }} />
                <div className="absolute top-4 left-4 font-mono-code text-xs" style={{ color: `${GOLD}88` }}>CAM_01 // THERMAL</div>
                <div className="absolute top-4 right-4 font-mono-code text-xs flex items-center gap-1.5" style={{ color: `${GOLD}88` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 5px #22c55e88" }} />
                  5G ONLINE
                </div>
                <div className="absolute bottom-4 left-4 font-mono-code text-xs" style={{ color: `${GOLD}66` }}>640×512 @ 30Hz</div>
                <div className="absolute bottom-4 right-4 font-mono-code text-xs" style={{ color: `${GOLD}66` }}>IP65 RATED</div>
                {/* Corner brackets */}
                {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map(c => (
                  <div key={c} className={`absolute ${c} w-4 h-4`} style={{ borderColor: `${GOLD}44` }} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 justify-center"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              Autonomous wheeled robot designed for thermal fault detection across high-voltage power line service corridors.
              Combines a <span style={{ color: GOLD }}>FLIR Boson 640 radiometric camera</span>, real-time{" "}
              <span style={{ color: GOLD }}>5G video streaming</span>, and a rugged{" "}
              <span style={{ color: GOLD }}>differential-drive chassis</span> capable of navigating asphalt and light gravel.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Resolution",    val: "640 × 512 px" },
                { label: "Connectivity",  val: "5G Real-time" },
                { label: "Frame Rate",    val: "30 Hz VGA" },
                { label: "Voltage",       val: "12V LiFePO4" },
                { label: "Drive System",  val: "Differential" },
                { label: "Protection",    val: "IP65 Rated" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3.5 border" style={{ borderColor: `${GOLD}18`, background: "#0d0d10" }}>
                  <div className="text-xs font-mono-code mb-0.5" style={{ color: GOLD }}>{s.label}</div>
                  <div className="text-sm font-medium text-foreground">{s.val}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 border" style={{ borderColor: `${GOLD}33`, background: `rgba(212,175,55,0.04)` }}>
              <div className="text-xs font-mono-code mb-1" style={{ color: GOLD }}>Bill of Materials</div>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl font-black" style={{ color: GOLD }}>
                  ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-muted-foreground pb-1">total / {BOT_PARTS.length} components</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono-code mb-2.5" style={{ color: GOLD }}>{"// "} Platform Stack</div>
              <div className="flex flex-wrap gap-2">
                {["Raspberry Pi 4", "FLIR Boson 640", "Sabertooth 2×32", "Sixfab 5G", "LiFePO4 12V", "PETG Frame", "Linux / Python"].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded text-xs font-mono-code border"
                    style={{ borderColor: `${GOLD}22`, color: "rgba(255,255,255,0.5)", background: "#0a0a0a" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Electrical Architecture Diagram ── */}
        <AnimatedSection className="mb-20">
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: GOLD }}>Electrical Architecture</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
            </div>
          </FadeItem>

          <FadeItem>
            <div className="overflow-x-auto pb-2 -mx-2 px-2 rounded-2xl border" style={{ borderColor: `${GOLD}18`, background: "#080808" }}>
              <svg viewBox="0 0 840 380" className="w-full min-w-[680px]" style={{ maxHeight: 380 }}>
                <defs>
                  <filter id="bot-glow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="bot-dot">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Edge paths */}
                {BOT_DIAGRAM_EDGES.map((e, i) => (
                  <motion.path
                    key={i}
                    d={e.path}
                    fill="none"
                    stroke={e.color}
                    strokeWidth="1"
                    strokeDasharray="5 4"
                    strokeOpacity="0.35"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}

                {/* Flowing signal dots */}
                {inView && BOT_DIAGRAM_EDGES.map((e, i) => (
                  <circle key={`dot-${i}`} r="2.5" fill={GOLD} opacity="0.95" filter="url(#bot-dot)">
                    <animateMotion
                      dur={`${2.0 + i * 0.33}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.38}s`}
                      path={e.path}
                    />
                  </circle>
                ))}

                {/* Nodes */}
                {BOT_DIAGRAM_NODES.map((n, i) => (
                  <motion.g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    style={{ transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.11, type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <circle cx={0} cy={0} r="37" fill="rgba(212,175,55,0.015)" stroke="rgba(212,175,55,0.07)" strokeWidth="0.5" />
                    <circle cx={0} cy={0} r="28" fill="#080808" stroke="rgba(212,175,55,0.5)" strokeWidth="1" filter="url(#bot-glow)" />
                    <circle cx={0} cy={0} r="20" fill={n.bg} />
                    <text x={0} y={-4} textAnchor="middle" fill={GOLD} fontSize="8.5" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="0.5">
                      {n.abbr}
                    </text>
                    <text x={0} y={9} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="5" fontFamily="JetBrains Mono, monospace">
                      {n.title.split(" ").slice(-1)[0].toUpperCase()}
                    </text>
                    {n.sub.map((line, j) => (
                      <motion.text
                        key={j}
                        x={0}
                        y={46 + j * 11}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.2)"
                        fontSize="5.2"
                        fontFamily="JetBrains Mono, monospace"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.6 + i * 0.08, duration: 0.5 }}
                      >
                        {line}
                      </motion.text>
                    ))}
                    {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]).map(([sx, sy], ti) => (
                      <g key={ti}>
                        <line x1={sx * 37} y1={sy * 37} x2={sx * 37 - sx * 6} y2={sy * 37} stroke="rgba(212,175,55,0.2)" strokeWidth="0.7" />
                        <line x1={sx * 37} y1={sy * 37} x2={sx * 37} y2={sy * 37 - sy * 6} stroke="rgba(212,175,55,0.2)" strokeWidth="0.7" />
                      </g>
                    ))}
                  </motion.g>
                ))}

                <motion.text
                  x="420" y="373"
                  textAnchor="middle"
                  fill="rgba(212,175,55,0.11)"
                  fontSize="5.8"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="2.5"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2.4, duration: 0.7 }}
                >
                  CREOVA SOLUTION — GRID FAULT INSPECTION BOT — ELECTRICAL SCHEMATIC REV. 2026
                </motion.text>
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                <span className="text-xs font-mono-code text-muted-foreground">System node</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="28" height="4"><line x1="0" y1="2" x2="28" y2="2" stroke="rgba(212,175,55,0.4)" strokeWidth="1" strokeDasharray="4 3" /></svg>
                <span className="text-xs font-mono-code text-muted-foreground">Signal path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-gold-pulse" style={{ background: GOLD }} />
                <span className="text-xs font-mono-code text-muted-foreground">Live signal</span>
              </div>
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* ── Bill of Materials ── */}
        <AnimatedSection className="mb-20">
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: GOLD }}>Bill of Materials</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
              <span className="text-xs font-mono-code" style={{ color: "rgba(255,255,255,0.28)" }}>{BOT_PARTS.length} components</span>
            </div>
          </FadeItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedParts.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl p-4 border transition-colors duration-200"
                style={{ borderColor: `${GOLD}14`, background: "#0a0a0c" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}14`; }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="text-xs font-medium text-foreground leading-tight">{p.name}</div>
                  <span className="shrink-0 text-xs font-mono-code" style={{ color: GOLD }}>${p.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground/55 leading-tight mb-3">{p.product}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono-code"
                      style={{ background: `${typeColor(p.type)}16`, color: typeColor(p.type), border: `1px solid ${typeColor(p.type)}30` }}>
                      {p.type}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono-code border"
                      style={{ borderColor: `${GOLD}18`, color: "rgba(255,255,255,0.28)" }}>
                      {p.cat}
                    </span>
                  </div>
                  {p.qty > 1 && (
                    <span className="text-xs font-mono-code text-muted-foreground/35">×{p.qty}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => setShowAllParts(v => !v)}
              className="text-xs font-mono-code transition-opacity hover:opacity-70"
              style={{ color: GOLD }}
            >
              {showAllParts ? "↑ Show less" : `+ Show ${BOT_PARTS.length - 9} more components →`}
            </button>
            <div className="font-mono-code text-xs">
              <span className="text-muted-foreground">Total BOM: </span>
              <span style={{ color: GOLD }} className="font-bold">${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Assembly Phases ── */}
        <AnimatedSection>
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: GOLD }}>Assembly Phases</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
            </div>
          </FadeItem>

          <FadeItem>
            <div className="flex flex-wrap gap-2 mb-8">
              {BOT_PHASES.map((phase, i) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(i)}
                  className="px-4 py-2 rounded-lg text-xs font-mono-code transition-all duration-200 border"
                  style={{
                    borderColor: activePhase === i ? `${GOLD}66` : `${GOLD}18`,
                    background: activePhase === i ? `rgba(212,175,55,0.1)` : "transparent",
                    color: activePhase === i ? GOLD : "rgba(255,255,255,0.38)",
                    boxShadow: activePhase === i ? `0 0 18px rgba(212,175,55,0.1)` : "none",
                  }}
                >
                  {phase.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BOT_PHASES[activePhase].steps.map((step, i) => (
                <motion.div
                  key={`${activePhase}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.065, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 rounded-xl p-4 border"
                  style={{ borderColor: `${GOLD}14`, background: "#0a0a0c" }}
                >
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono-code text-xs font-bold"
                    style={{ background: `rgba(212,175,55,0.1)`, color: GOLD, border: `1px solid ${GOLD}33`, marginTop: "1px" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                </motion.div>
              ))}
            </div>
          </FadeItem>
        </AnimatedSection>

      </div>
    </section>
  );
}

// ─── Soil Analysis Hexacopter ─────────────────────────────────────────────────

const HEXA_DIAGRAM_NODES = [
  { id: "lipo",    x: 72,  y: 200, abbr: "6S",     title: "Flight Battery",    sub: ["22000mAh", "22.2V"],    bg: "rgba(249,115,22,0.13)", r: 26 },
  { id: "pdb",     x: 215, y: 200, abbr: "PDB",    title: "Power Distrib.",    sub: ["Maucn PL", "5V/12V"],   bg: "rgba(212,175,55,0.08)", r: 24 },
  { id: "fc",      x: 420, y: 200, abbr: "PX4",    title: "Flight Controller", sub: ["Cube Orange+", "PX4"],  bg: "rgba(212,175,55,0.14)", r: 30 },
  { id: "esc1",    x: 420, y: 82,  abbr: "ESC1",   title: "Motor Arm 1",       sub: ["Flame 60A", "CW"],      bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "esc2",    x: 521, y: 141, abbr: "ESC2",   title: "Motor Arm 2",       sub: ["Flame 60A", "CCW"],     bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "esc3",    x: 521, y: 259, abbr: "ESC3",   title: "Motor Arm 3",       sub: ["Flame 60A", "CW"],      bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "esc4",    x: 420, y: 318, abbr: "ESC4",   title: "Motor Arm 4",       sub: ["Flame 60A", "CCW"],     bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "esc5",    x: 319, y: 259, abbr: "ESC5",   title: "Motor Arm 5",       sub: ["Flame 60A", "CW"],      bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "esc6",    x: 319, y: 141, abbr: "ESC6",   title: "Motor Arm 6",       sub: ["Flame 60A", "CCW"],     bg: "rgba(212,175,55,0.06)", r: 22 },
  { id: "jetson",  x: 685, y: 122, abbr: "JETSON", title: "Companion Comp.",   sub: ["Orin Nano", "1024CUDA"],bg: "rgba(168,85,247,0.12)", r: 26 },
  { id: "gps",     x: 685, y: 278, abbr: "RTK",    title: "RTK GPS",           sub: ["Here3+", "CAN bus"],    bg: "rgba(34,197,94,0.11)", r: 24 },
  { id: "camera",  x: 598, y: 44,  abbr: "MSPEC",  title: "Multispectral",     sub: ["RedEdge-P", "5-band"],  bg: "rgba(245,197,24,0.12)", r: 24 },
];

const HEXA_DIAGRAM_EDGES = [
  { path: "M 72 200 L 215 200",               color: "#f97316", dot: true  },
  { path: "M 215 200 L 420 200",              color: GOLD,      dot: true  },
  { path: "M 215 200 Q 445 100 685 122",      color: "#f97316", dot: false },
  { path: "M 420 200 L 420 82",               color: GOLD,      dot: true  },
  { path: "M 420 200 L 521 141",              color: GOLD,      dot: true  },
  { path: "M 420 200 L 521 259",              color: GOLD,      dot: true  },
  { path: "M 420 200 L 420 318",              color: GOLD,      dot: true  },
  { path: "M 420 200 L 319 259",              color: GOLD,      dot: true  },
  { path: "M 420 200 L 319 141",              color: GOLD,      dot: true  },
  { path: "M 685 122 Q 552 161 420 200",      color: "#a855f7", dot: true  },
  { path: "M 420 200 Q 552 239 685 278",      color: "#22c55e", dot: true  },
  { path: "M 685 122 L 598 44",              color: "#3b82f6", dot: true  },
];

const HEXA_PARTS = [
  { name: "Flight Controller",     product: "Cube Orange+ Standard Set",    cat: "electrical", type: "mcu",        qty: 1,  total: 350.00  },
  { name: "Companion Computer",    product: "NVIDIA Jetson Orin Nano",       cat: "electrical", type: "mcu",        qty: 1,  total: 499.00  },
  { name: "Multispectral Camera",  product: "MicaSense RedEdge-P",           cat: "electrical", type: "sensor",     qty: 1,  total: 8500.00 },
  { name: "RTK GPS Module",        product: "Here3+ GPS RTK",                cat: "electrical", type: "sensor",     qty: 1,  total: 220.00  },
  { name: "ESC Controllers ×6",    product: "T-Motor Flame 60A (×6)",        cat: "electrical", type: "actuator",   qty: 6,  total: 390.00  },
  { name: "PDB + Regulator",       product: "Maucn PL-200 Power Module",     cat: "electrical", type: "power",      qty: 1,  total: 85.00   },
  { name: "Flight Battery",        product: "Tattu Plus 6S 22000mAh LiPo",  cat: "electrical", type: "power",      qty: 1,  total: 450.00  },
  { name: "Telemetry Radio",       product: "Holybro SiK 500mW",            cat: "electrical", type: "module",     qty: 1,  total: 45.00   },
  { name: "Hexacopter Frame",      product: "Tarot 680PRO Carbon Fiber",     cat: "mechanical", type: "structural", qty: 1,  total: 165.00  },
  { name: "Brushless Motors ×6",   product: "T-Motor MN4014 KV400 (×6)",    cat: "mechanical", type: "mechanism",  qty: 6,  total: 450.00  },
  { name: "Camera Gimbal Mount",   product: "3-Axis Stabilized Gimbal",      cat: "mechanical", type: "mechanism",  qty: 1,  total: 250.00  },
  { name: "Carbon Propellers ×3",  product: "T-Motor 15×5 CF Prop Set",     cat: "mechanical", type: "mechanism",  qty: 3,  total: 180.00  },
  { name: "Jetson Mount Plate",    product: "PETG Vibration-Damped Mount",   cat: "mechanical", type: "3d_printed", qty: 1,  total: 3.00    },
  { name: "GPS Mast Mount",        product: "Folding GPS Antenna Mast",      cat: "mechanical", type: "structural", qty: 1,  total: 12.00   },
  { name: "Vehicle Landing Cradle",product: "ASA UV-Resistant Cradle ×4",   cat: "mechanical", type: "3d_printed", qty: 4,  total: 32.00   },
  { name: "M3 Fasteners",          product: "M3 Button Head Screws ×24",    cat: "mechanical", type: "misc",       qty: 24, total: 1.20    },
];

const HEXA_PHASES = [
  {
    id: "fabricate", label: "01 / Fabricate",
    steps: [
      "3D print Jetson Mount Plate in PETG (30% infill, 3 shells) — keep flat for accurate M2.5 holes",
      "Print 4× Vehicle Landing Cradles in ASA in a heated enclosure (40% infill, 4 shells)",
      "Install heat-set inserts or M2.5 nylon standoffs into Jetson mount plate",
      "Assemble folding carbon fiber arms and center plates on Tarot 680PRO",
      "Dry-fit multispectral camera to gimbal bracket — verify clearance",
      "Apply Loctite 242 blue threadlocker to all motor mounting bolts before final tightening",
    ],
  },
  {
    id: "wire", label: "02 / Wiring",
    steps: [
      "Solder main XT90-AS lead and 6× ESC power wires to PDB — confirm polarity",
      "Route and crimp PWM signal leads from each ESC to Flight Controller (PWM1–PWM6)",
      "Construct high-current battery cable from Tattu XT90 to PDB bus — verify polarity",
      "Connect Jetson power input to 12V regulated rail on PDB",
      "Wire CAN bus (FC CAN1_H/L to Here3+ GPS) and UART telemetry link (FC UART1 to Holybro)",
      "Establish Ethernet link between Jetson ETH port and MicaSense RedEdge-P camera",
    ],
  },
  {
    id: "bringup", label: "03 / Bring-up",
    steps: [
      "Flash PX4 firmware and configure hexacopter (X6) frame type in QGroundControl",
      "Calibrate all 6 ESC endpoints and verify motor CW/CCW rotation direction",
      "Configure RTK GPS inject settings and verify centimeter-level fix status",
      "Initialize Jetson Orin Nano — flash Linux, install ROS2, verify CSI/ETH camera stream",
      "Test MAVLink communication via UART between Flight Controller and Jetson companion",
    ],
  },
  {
    id: "assemble", label: "04 / Assembly",
    steps: [
      "Secure Flight Controller and PDB within center frame with vibration dampeners",
      "Mount all 6 T-Motor MN4014 motors — verify CW/CCW prop adapter orientation",
      "Install 3-axis gimbal and MicaSense RedEdge-P multispectral camera assembly",
      "Attach GPS mast to top plate and mount Here3+ RTK module for maximum sky view",
      "Mount 4× Vehicle Landing Cradles to vehicle roof rack with M3 bolts",
      "Perform final balance check with battery installed — adjust motor arm positions",
    ],
  },
];

function HexacopterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const animId = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const ARM_COUNT = 6;
    const ARM_LEN = 110;
    const CENTER_R = 16;
    const MOTOR_R = 13;
    const PROP_R = 36;

    const loop = () => {
      t.current += 0.015;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2 + mouse.current.x * 14;
      const cy = H / 2 + mouse.current.y * 8;

      ctx.clearRect(0, 0, W, H);

      const progress = Math.min(t.current / 2.4, 1);

      // Blueprint grid dots
      const spacing = 38;
      for (let gx = spacing; gx < W; gx += spacing) {
        for (let gy = spacing; gy < H; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212,175,55,0.07)";
          ctx.fill();
        }
      }

      // Arms + motors + props
      for (let i = 0; i < ARM_COUNT; i++) {
        const angle = (i * Math.PI * 2) / ARM_COUNT - Math.PI / 2;
        const tipX = cx + Math.cos(angle) * ARM_LEN * progress;
        const tipY = cy + Math.sin(angle) * ARM_LEN * progress;

        // Arm with glow pass
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tipX, tipY);
          if (pass === 0) {
            ctx.strokeStyle = `rgba(212,175,55,0.08)`;
            ctx.lineWidth = 8;
          } else {
            const ag = ctx.createLinearGradient(cx, cy, tipX, tipY);
            ag.addColorStop(0, `rgba(212,175,55,0.35)`);
            ag.addColorStop(1, `rgba(212,175,55,0.85)`);
            ctx.strokeStyle = ag;
            ctx.lineWidth = 1.5;
          }
          ctx.stroke();
        }

        if (progress > 0.45) {
          const mp = Math.min((progress - 0.45) / 0.4, 1);

          // Motor ring glow
          const mgrd = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, MOTOR_R * 2.5);
          mgrd.addColorStop(0, `rgba(212,175,55,${0.18 * mp})`);
          mgrd.addColorStop(1, "rgba(212,175,55,0)");
          ctx.fillStyle = mgrd;
          ctx.beginPath();
          ctx.arc(tipX, tipY, MOTOR_R * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Motor circle
          ctx.beginPath();
          ctx.arc(tipX, tipY, MOTOR_R * mp, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(12,12,14,0.9)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(212,175,55,${0.75 * mp})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (progress > 0.75) {
            const pp = Math.min((progress - 0.75) / 0.25, 1);
            const spin = t.current * (i % 2 === 0 ? 3.5 : -3.5);
            const bladeAlpha = 0.28 * pp;

            // Two blades
            for (let b = 0; b < 2; b++) {
              const bs = spin + b * Math.PI;
              ctx.beginPath();
              ctx.moveTo(tipX, tipY);
              ctx.arc(tipX, tipY, PROP_R * pp * 0.38, bs, bs + Math.PI * 0.75);
              ctx.strokeStyle = `rgba(212,175,55,${bladeAlpha})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }

            // Propeller disc suggestion
            ctx.beginPath();
            ctx.arc(tipX, tipY, PROP_R * pp * 0.38, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(212,175,55,${0.06 * pp})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Flowing particle outward along arm
        if (progress === 1) {
          const p2 = ((t.current * 0.55 + i * 0.168) % 1);
          const partX = cx + Math.cos(angle) * ARM_LEN * p2;
          const partY = cy + Math.sin(angle) * ARM_LEN * p2;
          const pgrd = ctx.createRadialGradient(partX, partY, 0, partX, partY, 7);
          pgrd.addColorStop(0, "rgba(212,175,55,0.95)");
          pgrd.addColorStop(1, "rgba(212,175,55,0)");
          ctx.fillStyle = pgrd;
          ctx.beginPath();
          ctx.arc(partX, partY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(partX, partY, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#f5c518";
          ctx.fill();
        }
      }

      // Center body
      if (progress > 0.15) {
        const bp = Math.min((progress - 0.15) / 0.25, 1);
        const cgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, CENTER_R * 3);
        cgrd.addColorStop(0, `rgba(212,175,55,${0.22 * bp})`);
        cgrd.addColorStop(1, "rgba(212,175,55,0)");
        ctx.fillStyle = cgrd;
        ctx.beginPath();
        ctx.arc(cx, cy, CENTER_R * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, CENTER_R * bp, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(12,12,14,0.95)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(212,175,55,${0.9 * bp})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // PX4 label
        if (bp > 0.8) {
          ctx.fillStyle = `rgba(212,175,55,${(bp - 0.8) * 5 * 0.7})`;
          ctx.font = `bold 7px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("PX4", cx, cy);
        }
      }

      // GPS mast (green spike above center)
      if (progress > 0.88) {
        const gp = Math.min((progress - 0.88) / 0.12, 1);
        ctx.beginPath();
        ctx.moveTo(cx, cy - CENTER_R);
        ctx.lineTo(cx, cy - CENTER_R - 28 * gp);
        ctx.strokeStyle = `rgba(34,197,94,${0.7 * gp})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (gp > 0.6) {
          const dp = (gp - 0.6) / 0.4;
          const gGrd = ctx.createRadialGradient(cx, cy - CENTER_R - 28, 0, cx, cy - CENTER_R - 28, 8 * dp);
          gGrd.addColorStop(0, `rgba(34,197,94,${0.7 * dp})`);
          gGrd.addColorStop(1, "rgba(34,197,94,0)");
          ctx.fillStyle = gGrd;
          ctx.beginPath();
          ctx.arc(cx, cy - CENTER_R - 28, 8 * dp, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy - CENTER_R - 28, 3.5 * dp, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,197,94,${0.9 * dp})`;
          ctx.fill();
        }
      }

      // Camera payload (magenta disc below center)
      if (progress > 0.82) {
        const kp = Math.min((progress - 0.82) / 0.18, 1);
        ctx.beginPath();
        ctx.arc(cx, cy + CENTER_R + 14 * kp, 8 * kp, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245,197,24,${0.6 * kp})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}

function HexaShowcaseSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-80px" });
  const [activePhase, setActivePhase] = useState(0);
  const [showAllParts, setShowAllParts] = useState(false);

  const totalCost = HEXA_PARTS.reduce((sum, p) => sum + p.total, 0);
  const displayedParts = showAllParts ? HEXA_PARTS : HEXA_PARTS.slice(0, 9);

  const typeColor = (type: string) => {
    const m: Record<string, string> = {
      mcu: "#a855f7", sensor: GOLD_BRIGHT, module: "#3b82f6", actuator: "#22c55e",
      power: "#f97316", structural: "#64748b", mechanism: "#14b8a6",
      "3d_printed": "#ec4899", misc: "#4b5563",
    };
    return m[type] ?? GOLD;
  };

  // Hexacopter blueprint geometry
  const bpCx = 240, bpCy = 150, bpArm = 88, bpBodyR = 28, bpMotorR = 10, bpPropR = 48;
  const bpMotors = [0, 60, 120, 180, 240, 300].map((deg, i) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: bpCx + bpArm * Math.cos(rad), y: bpCy + bpArm * Math.sin(rad), cw: i % 2 === 0, num: i + 1 };
  });
  const hexBodyPts = [0, 60, 120, 180, 240, 300].map(d => {
    const r = (d - 90) * Math.PI / 180;
    return `${bpCx + bpBodyR * Math.cos(r)},${bpCy + bpBodyR * Math.sin(r)}`;
  }).join(" ");

  return (
    <section className="relative overflow-hidden" style={{ background: "#02030b", paddingTop: "7rem", paddingBottom: "7rem" }}>

      {/* ═══ LAYERED BACKGROUND SYSTEM ═══ */}
      {/* Blueprint graph paper — fine 20px + coarse 80px grids */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(168,85,247,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,85,247,0.055) 1px, transparent 1px),
          linear-gradient(rgba(212,175,55,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
      }} />
      {/* Coordinate numbers along top */}
      <div className="absolute top-8 left-0 right-0 pointer-events-none flex justify-around px-6 overflow-hidden" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(168,85,247,0.18)" }}>
        {[...Array(12)].map((_, i) => <span key={i}>{String(i * 80).padStart(4, "0")}</span>)}
      </div>
      {/* Coordinate numbers along left */}
      <div className="absolute top-0 bottom-0 left-4 pointer-events-none flex flex-col justify-around py-12" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(168,85,247,0.18)" }}>
        {[...Array(10)].map((_, i) => <span key={i}>{String(i * 80).padStart(4, "0")}</span>)}
      </div>
      {/* Animated horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.22) 20%, rgba(212,175,55,0.18) 50%, rgba(168,85,247,0.22) 80%, transparent 100%)", zIndex: 1 }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      {/* Nebula depth layers */}
      <div className="absolute pointer-events-none" style={{ top: "-5%", right: "-8%", width: "55%", height: "70%", background: "radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "0%", left: "-8%", width: "45%", height: "55%", background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 65%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ top: "35%", left: "30%", width: "40%", height: "35%", background: "radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, transparent 70%)", borderRadius: "50%" }} />
      {/* Corner engineering marks */}
      {(["top-3 left-6 border-t border-l", "top-3 right-6 border-t border-r", "bottom-3 left-6 border-b border-l", "bottom-3 right-6 border-b border-r"]).map((cls) => (
        <div key={cls} className={`absolute ${cls} w-8 h-8 pointer-events-none`} style={{ borderColor: "rgba(168,85,247,0.38)", borderWidth: "1px" }} />
      ))}
      {/* Telemetry marquee ticker */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden pointer-events-none border-b" style={{ borderColor: "rgba(168,85,247,0.14)", background: "rgba(2,3,11,0.85)", zIndex: 2 }}>
        <motion.div
          className="flex items-center h-full font-mono-code text-xs whitespace-nowrap gap-0"
          style={{ color: "rgba(168,85,247,0.5)" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map(ri => (
            <span key={ri} className="flex gap-0 items-center">
              {["ALT: 0m AGL", "BATT: 22.2V", "GPS_FIX: 3D-RTK", "SATS: 24", "HDOP: 0.32", "MODE: AUTO", "THROTTLE: 0%", "ARM: SAFE", "MSPEC: STANDBY", "RSSI: -52dBm", "TEMP: 23°C", "HEAD: 000°", "SPD: 0.0m/s", "JETSON: ONLINE", "MAVLINK: OK"].map((item, j) => (
                <span key={j} className="flex items-center px-4 border-r" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
                  <span style={{ color: "rgba(168,85,247,0.25)", marginRight: 6 }}>▸</span>{item}
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={wrapRef}>

        {/* ── Header ── */}
        <AnimatedSection className="mt-10">
          <FadeItem className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#a855f7", boxShadow: "0 0 10px #a855f755" }} />
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: "#a855f7" }}>Case Study / Aerial Robotics</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.45), transparent)" }} />
              <span className="text-xs font-mono-code" style={{ color: "rgba(168,85,247,0.28)" }}>SYS_ID: HEXA-680-2026</span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-5xl md:text-7xl font-black uppercase leading-none">
                Soil Analysis<br />
                <span style={{ background: "linear-gradient(135deg, #a855f7 0%, #d4af37 55%, #f5c518 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Hexacopter
                </span>
              </h2>
              <div className="text-right">
                <p className="text-xs font-mono-code text-muted-foreground leading-relaxed">
                  <span style={{ color: "#a855f7" }}>// </span>Autonomous multispectral soil mapping<br />
                  <span style={{ color: "#a855f7" }}>// </span>Centimeter-level RTK GPS precision<br />
                  <span style={{ color: "#a855f7" }}>// </span>NVIDIA Jetson Orin edge AI
                </p>
                <div className="mt-3 flex gap-2 justify-end">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono-code"
                    style={{ borderColor: "rgba(168,85,247,0.42)", color: "#a855f7", background: "rgba(168,85,247,0.08)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#a855f7", animation: "gold-pulse 1.5s infinite" }} />
                    Mission Ready
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono-code"
                    style={{ borderColor: "rgba(34,197,94,0.3)", color: "#22c55e", background: "rgba(34,197,94,0.06)" }}>
                    RTK ACTIVE
                  </div>
                </div>
              </div>
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* ── Hero: canvas + photo + specs ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">
          {/* Canvas wireframe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden border"
            style={{ borderColor: "rgba(168,85,247,0.22)", background: "#07080f", minHeight: 280 }}
          >
            <div className="absolute top-3 left-3 z-10 font-mono-code text-xs" style={{ color: "rgba(168,85,247,0.7)" }}>DRONE_WIRE // TOP_VIEW</div>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 font-mono-code text-xs" style={{ color: "rgba(168,85,247,0.7)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 6px #a855f7" }} />
              ASSEMBLING
            </div>
            <HexacopterCanvas />
            <div className="absolute bottom-3 left-3 font-mono-code text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>6-ARM // RTK // MSPEC</div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative group rounded-2xl overflow-hidden border"
            style={{ borderColor: "rgba(168,85,247,0.22)", background: "#0a0810" }}
          >
            <ImageWithFallback
              src={hexaVisual}
              alt="Soil Analysis Hexacopter — carbon fiber frame with 6 T-Motor brushless motors and MicaSense RedEdge-P multispectral camera"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              style={{ minHeight: 280 }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(2,3,11,0.75) 0%, transparent 45%)" }} />
            <div className="absolute top-3 left-3 font-mono-code text-xs" style={{ color: "rgba(168,85,247,0.75)" }}>CAM_PAYLOAD // NADIR</div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono-code text-xs" style={{ color: "rgba(34,197,94,0.88)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e88" }} />
              RTK FIX
            </div>
            {/* HUD corner brackets */}
            {[["top-1/3 left-4 border-t border-l"], ["top-1/3 right-4 border-t border-r"]].map(([cls]) => (
              <div key={cls} className={`absolute ${cls} w-5 h-5 pointer-events-none`} style={{ borderColor: "rgba(168,85,247,0.55)", borderWidth: 1 }} />
            ))}
            <div className="absolute bottom-3 left-3 font-mono-code text-xs" style={{ color: "rgba(212,175,55,0.65)" }}>640×512 // 5-BAND MSPEC</div>
            <div className="absolute bottom-3 right-3 font-mono-code text-xs" style={{ color: "rgba(212,175,55,0.65)" }}>±1cm RTK</div>
          </motion.div>

          {/* Specs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 justify-center"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              Autonomous hexacopter platform for precision agriculture, combining a{" "}
              <span style={{ color: "#a855f7" }}>MicaSense RedEdge-P multispectral camera</span> with{" "}
              <span style={{ color: GOLD }}>centimeter-level RTK GPS</span> and real-time{" "}
              <span style={{ color: "#a855f7" }}>NVIDIA Jetson AI processing</span> for soil health mapping.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Bands",      val: "5-band Spectral",   color: "#a855f7" },
                { label: "Precision",  val: "±1cm RTK",          color: "#22c55e" },
                { label: "AI Compute", val: "1024 CUDA Cores",   color: "#a855f7" },
                { label: "Battery",    val: "6S 22,000mAh",      color: "#f97316" },
                { label: "Lift",       val: "6× T-Motor MN4014", color: GOLD },
                { label: "Comms",      val: "MAVLink + Ethernet", color: "#3b82f6" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 border" style={{ borderColor: `${s.color}18`, background: "#0a0a0f" }}>
                  <div className="text-xs font-mono-code mb-0.5" style={{ color: s.color }}>{s.label}</div>
                  <div className="text-xs font-medium text-foreground">{s.val}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.05)" }}>
              <div className="text-xs font-mono-code mb-1" style={{ color: "#a855f7" }}>Bill of Materials</div>
              <div className="flex items-end gap-2">
                <span className="font-display text-3xl font-black" style={{ background: "linear-gradient(135deg,#a855f7,#d4af37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-muted-foreground pb-0.5">total / {HEXA_PARTS.length} line items</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── DEVICE BLUEPRINT GALLERY ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <AnimatedSection className="mb-24">
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: "#a855f7" }}>Device Schematics</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.45), transparent)" }} />
              <span className="text-xs font-mono-code" style={{ color: "rgba(212,175,55,0.38)" }}>BLUEPRINT // REV.A // 2026</span>
            </div>
          </FadeItem>

          {/* Row 1: Hexacopter Frame (wide) + Multispectral Camera */}
          <FadeItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

              {/* ── Hexacopter Frame Top-View Blueprint ── */}
              <div className="md:col-span-2 rounded-2xl border overflow-hidden relative group" style={{ borderColor: "rgba(168,85,247,0.22)", background: "#060810" }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(168,85,247,0.14)", background: "rgba(168,85,247,0.04)" }}>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(168,85,247,0.7)" }}>FRAME // TOP VIEW // TAROT 680PRO</span>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>DWG-FRAME-01 // SCALE 1:10</span>
                </div>
                <svg viewBox="0 0 480 300" className="w-full" style={{ maxHeight: 300 }}>
                  <defs>
                    <pattern id="hfbp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(168,85,247,0.07)" strokeWidth="0.4" />
                    </pattern>
                    <filter id="hfbp-purple"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="hfbp-gold"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <marker id="hf-ae" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <path d="M0,0.5 L4,2.5 L0,4.5 z" fill="rgba(212,175,55,0.7)" />
                    </marker>
                    <marker id="hf-as" markerWidth="5" markerHeight="5" refX="1" refY="2.5" orient="auto-start-reverse">
                      <path d="M0,0.5 L4,2.5 L0,4.5 z" fill="rgba(212,175,55,0.7)" />
                    </marker>
                  </defs>
                  <rect width="480" height="300" fill="url(#hfbp-grid)" />
                  {/* Corner registration marks */}
                  {[[10,10],[470,10],[10,290],[470,290]].map(([x,y],i) => (
                    <g key={i}>
                      <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="rgba(168,85,247,0.45)" strokeWidth="0.6" />
                      <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="rgba(168,85,247,0.45)" strokeWidth="0.6" />
                      <circle cx={x} cy={y} r="2" fill="rgba(168,85,247,0.6)" />
                    </g>
                  ))}
                  {/* Axis cross (faint) */}
                  <line x1={bpCx-210} y1={bpCy} x2={bpCx+210} y2={bpCy} stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" strokeDasharray="8 5" />
                  <line x1={bpCx} y1={bpCy-145} x2={bpCx} y2={bpCy+145} stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" strokeDasharray="8 5" />
                  {/* Horizontal dimension: 680mm */}
                  {inView && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.7 }}>
                      <line x1={bpCx-bpArm-bpPropR} y1={19} x2={bpCx+bpArm+bpPropR} y2={19} stroke="rgba(212,175,55,0.6)" strokeWidth="0.8" markerStart="url(#hf-as)" markerEnd="url(#hf-ae)" />
                      <text x={bpCx} y={15} textAnchor="middle" fill="rgba(212,175,55,0.75)" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">680mm</text>
                      <line x1={bpCx-bpArm-bpPropR} y1={13} x2={bpCx-bpArm-bpPropR} y2={25} stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" />
                      <line x1={bpCx+bpArm+bpPropR} y1={13} x2={bpCx+bpArm+bpPropR} y2={25} stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" />
                    </motion.g>
                  )}
                  {/* Vertical dimension */}
                  {inView && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.7 }}>
                      <line x1={453} y1={bpCy-bpArm-bpPropR} x2={453} y2={bpCy+bpArm+bpPropR} stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" markerStart="url(#hf-as)" markerEnd="url(#hf-ae)" />
                      <text x={467} y={bpCy} textAnchor="middle" fill="rgba(212,175,55,0.6)" fontSize="7" fontFamily="JetBrains Mono, monospace" transform={`rotate(-90,467,${bpCy})`}>680mm</text>
                    </motion.g>
                  )}
                  {/* Propeller discs */}
                  {bpMotors.map((m, i) => (
                    <motion.circle key={`p${i}`} cx={m.x} cy={m.y} r={bpPropR}
                      fill="none" stroke={m.cw ? "rgba(212,175,55,0.14)" : "rgba(168,85,247,0.14)"}
                      strokeWidth="0.9" strokeDasharray="5 3"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.25 + i * 0.1, duration: 0.6 }}
                      style={{ transformBox: "fill-box", transformOrigin: `${m.x}px ${m.y}px` } as React.CSSProperties}
                    />
                  ))}
                  {/* Arms */}
                  {bpMotors.map((m, i) => (
                    <motion.line key={`a${i}`} x1={bpCx} y1={bpCy} x2={m.x} y2={m.y}
                      stroke="rgba(232,244,255,0.52)" strokeWidth="2.2" strokeLinecap="round"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                    />
                  ))}
                  {/* Body hexagon */}
                  <motion.polygon points={hexBodyPts}
                    fill="rgba(168,85,247,0.07)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.1"
                    filter="url(#hfbp-purple)"
                    initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.05, duration: 0.5 }}
                    style={{ transformBox: "fill-box", transformOrigin: `${bpCx}px ${bpCy}px` } as React.CSSProperties}
                  />
                  {/* GPS mast */}
                  {inView && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}>
                      <line x1={bpCx} y1={bpCy-bpBodyR} x2={bpCx} y2={bpCy-bpBodyR-26} stroke="rgba(34,197,94,0.72)" strokeWidth="1.5" />
                      <circle cx={bpCx} cy={bpCy-bpBodyR-26} r={5} fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.65)" strokeWidth="0.9" filter="url(#hfbp-purple)" />
                      <text x={bpCx+9} y={bpCy-bpBodyR-23} fill="rgba(34,197,94,0.65)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">GPS RTK</text>
                    </motion.g>
                  )}
                  {/* Camera payload */}
                  {inView && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
                      <circle cx={bpCx} cy={bpCy+bpBodyR+18} r={11} fill="rgba(245,197,24,0.06)" stroke="rgba(245,197,24,0.58)" strokeWidth="0.9" />
                      <circle cx={bpCx} cy={bpCy+bpBodyR+18} r={5} fill="none" stroke="rgba(245,197,24,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                      <text x={bpCx+15} y={bpCy+bpBodyR+22} fill="rgba(245,197,24,0.58)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">MSPEC CAM</text>
                    </motion.g>
                  )}
                  {/* Motor nodes */}
                  {bpMotors.map((m, i) => (
                    <motion.g key={`m${i}`}
                      initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.45 + i * 0.1, duration: 0.4, type: "spring", stiffness: 210 }}
                      style={{ transformBox: "fill-box", transformOrigin: `${m.x}px ${m.y}px` } as React.CSSProperties}
                    >
                      <circle cx={m.x} cy={m.y} r={bpMotorR} fill="#060810" stroke={m.cw ? "rgba(212,175,55,0.8)" : "rgba(168,85,247,0.8)"} strokeWidth="1.1" filter="url(#hfbp-gold)" />
                      <circle cx={m.x} cy={m.y} r={bpMotorR-4} fill={m.cw ? "rgba(212,175,55,0.08)" : "rgba(168,85,247,0.08)"} />
                      <text x={m.x} y={m.y+1} textAnchor="middle" dominantBaseline="middle" fill={m.cw ? "rgba(212,175,55,0.92)" : "rgba(168,85,247,0.92)"} fontSize="5.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">M{m.num}</text>
                      <text x={m.x} y={m.y+bpMotorR+10} textAnchor="middle" fill={m.cw ? "rgba(212,175,55,0.5)" : "rgba(168,85,247,0.5)"} fontSize="5" fontFamily="JetBrains Mono, monospace">{m.cw ? "CW" : "CCW"}</text>
                    </motion.g>
                  ))}
                  {/* Center */}
                  <circle cx={bpCx} cy={bpCy} r={3} fill="rgba(168,85,247,0.9)" />
                  {/* Title block */}
                  {inView && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.7 }}>
                      <rect x={28} y={256} width={160} height={37} fill="rgba(6,8,16,0.93)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.6" />
                      <line x1={28} y1={270} x2={188} y2={270} stroke="rgba(168,85,247,0.2)" strokeWidth="0.4" />
                      <text x={38} y={267} fill="rgba(168,85,247,0.88)" fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="700">TAROT 680PRO HEXACOPTER</text>
                      <text x={38} y={278} fill="rgba(212,175,55,0.52)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">DWG: FRAME-01 // TOP VIEW // SCALE 1:10</text>
                      <text x={38} y={288} fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="JetBrains Mono, monospace">CREOVA SOLUTION // REV.A // 2026</text>
                    </motion.g>
                  )}
                </svg>
              </div>

              {/* ── Multispectral Camera Blueprint ── */}
              <div className="rounded-2xl border overflow-hidden flex flex-col group" style={{ borderColor: "rgba(245,197,24,0.22)", background: "#070810" }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(245,197,24,0.14)", background: "rgba(245,197,24,0.04)" }}>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(245,197,24,0.7)" }}>MSPEC // CAM_01</span>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>RedEdge-P</span>
                </div>
                <svg viewBox="0 0 220 240" className="w-full flex-1" style={{ minHeight: 200 }}>
                  <defs>
                    <pattern id="cam-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(245,197,24,0.06)" strokeWidth="0.4" />
                    </pattern>
                    <filter id="cam-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <rect width="220" height="240" fill="url(#cam-grid)" />
                  {[[8,8],[212,8],[8,232],[212,232]].map(([x,y],i) => (
                    <g key={i}>
                      <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="rgba(245,197,24,0.38)" strokeWidth="0.6" />
                      <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="rgba(245,197,24,0.38)" strokeWidth="0.6" />
                    </g>
                  ))}
                  {/* Camera body */}
                  <motion.rect x={50} y={50} width={120} height={90} rx={7}
                    fill="rgba(245,197,24,0.04)" stroke="rgba(245,197,24,0.58)" strokeWidth="1.1" filter="url(#cam-glow)"
                    initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties}
                  />
                  {/* 5 spectral band lenses */}
                  {[
                    { cx: 80,  cy: 78,  band: "B",   color: "#3b82f6", nm: "475nm" },
                    { cx: 110, cy: 78,  band: "G",   color: "#22c55e", nm: "560nm" },
                    { cx: 140, cy: 78,  band: "R",   color: "#ef4444", nm: "668nm" },
                    { cx: 93,  cy: 110, band: "RE",  color: "#f97316", nm: "717nm" },
                    { cx: 127, cy: 110, band: "NIR", color: "#a855f7", nm: "840nm" },
                  ].map((l, i) => (
                    <motion.g key={l.band}
                      initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.4, type: "spring", stiffness: 230 }}
                      style={{ transformBox: "fill-box", transformOrigin: `${l.cx}px ${l.cy}px` } as React.CSSProperties}
                    >
                      <circle cx={l.cx} cy={l.cy} r={14} fill="rgba(0,0,0,0.55)" stroke={`${l.color}45`} strokeWidth="0.6" />
                      <circle cx={l.cx} cy={l.cy} r={11} fill={`${l.color}10`} stroke={`${l.color}80`} strokeWidth="1.1" filter="url(#cam-glow)" />
                      <circle cx={l.cx} cy={l.cy} r={6.5} fill={`${l.color}12`} stroke={`${l.color}50`} strokeWidth="0.7" />
                      <circle cx={l.cx} cy={l.cy} r={2.8} fill={l.color} opacity="0.75" />
                      <text x={l.cx} y={l.cy+21} textAnchor="middle" fill={`${l.color}95`} fontSize="5.8" fontFamily="JetBrains Mono, monospace" fontWeight="700">{l.band}</text>
                      <text x={l.cx} y={l.cy+30} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="4.5" fontFamily="JetBrains Mono, monospace">{l.nm}</text>
                    </motion.g>
                  ))}
                  {/* Ethernet connector */}
                  <rect x={88} y={140} width={44} height={13} rx={2} fill="none" stroke="rgba(245,197,24,0.42)" strokeWidth="0.8" />
                  {[0,1,2,3,4,5,6,7].map(j => <line key={j} x1={91+j*5} y1={140} x2={91+j*5} y2={153} stroke="rgba(245,197,24,0.25)" strokeWidth="0.5" />)}
                  <text x={110} y={168} textAnchor="middle" fill="rgba(245,197,24,0.4)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">ETH // CONNECTOR</text>
                  {/* Labels */}
                  <text x={110} y={200} textAnchor="middle" fill="rgba(245,197,24,0.72)" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">MICASENSE REDEDGE-P</text>
                  <text x={110} y={213} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">5-BAND MULTISPECTRAL // NDVI</text>
                  <text x={110} y={224} textAnchor="middle" fill="rgba(245,197,24,0.35)" fontSize="5" fontFamily="JetBrains Mono, monospace">DWG: CAM-01 // FRONT VIEW</text>
                </svg>
              </div>
            </div>
          </FadeItem>

          {/* Row 2: Flight Controller + Motor/ESC + Battery */}
          <FadeItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* ── Flight Controller Blueprint ── */}
              <div className="rounded-2xl border overflow-hidden flex flex-col group" style={{ borderColor: "rgba(168,85,247,0.24)", background: "#070810" }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(168,85,247,0.14)", background: "rgba(168,85,247,0.04)" }}>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(168,85,247,0.7)" }}>FLIGHT_CTRL // MCU</span>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Cube Orange+</span>
                </div>
                <svg viewBox="0 0 220 220" className="w-full flex-1" style={{ minHeight: 180 }}>
                  <defs>
                    <pattern id="fc-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(168,85,247,0.065)" strokeWidth="0.4" />
                    </pattern>
                    <filter id="fc-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <rect width="220" height="220" fill="url(#fc-grid)" />
                  {[[8,8],[212,8],[8,212],[212,212]].map(([x,y],i) => (
                    <g key={i}>
                      <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="rgba(168,85,247,0.38)" strokeWidth="0.6" />
                      <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="rgba(168,85,247,0.38)" strokeWidth="0.6" />
                    </g>
                  ))}
                  {/* PCB body */}
                  <motion.rect x={42} y={42} width={136} height={100} rx={5}
                    fill="rgba(168,85,247,0.04)" stroke="rgba(168,85,247,0.55)" strokeWidth="1.1" filter="url(#fc-glow)"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                  {/* IMU block (vibration isolated) */}
                  <motion.rect x={84} y={62} width={52} height={36} rx={3}
                    fill="rgba(168,85,247,0.07)" stroke="rgba(168,85,247,0.42)" strokeWidth="0.7" strokeDasharray="3.5 2"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                  <text x={110} y={80} textAnchor="middle" dominantBaseline="middle" fill="rgba(168,85,247,0.65)" fontSize="6" fontFamily="JetBrains Mono, monospace" fontWeight="700">IMU</text>
                  <text x={110} y={91} textAnchor="middle" fill="rgba(168,85,247,0.35)" fontSize="4.8" fontFamily="JetBrains Mono, monospace">ISOLATED</text>
                  {/* PWM output pins */}
                  {Array.from({ length: 8 }, (_, j) => (
                    <motion.g key={j}
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 + j * 0.04 }}
                    >
                      <rect x={49 + j * 15.5} y={30} width={10} height={12} rx={1.5}
                        fill="rgba(212,175,55,0.07)" stroke="rgba(212,175,55,0.52)" strokeWidth="0.7" />
                      <text x={54 + j * 15.5} y={37.5} textAnchor="middle" fill="rgba(212,175,55,0.6)" fontSize="4.2" fontFamily="JetBrains Mono, monospace">{j+1}</text>
                    </motion.g>
                  ))}
                  <text x={110} y={25} textAnchor="middle" fill="rgba(212,175,55,0.42)" fontSize="5" fontFamily="JetBrains Mono, monospace">PWM OUT</text>
                  {/* CAN connector */}
                  <rect x={178} y={68} width={14} height={26} rx={2}
                    fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.52)" strokeWidth="0.8" />
                  <text x={197} y={81} fill="rgba(34,197,94,0.6)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">CAN</text>
                  {/* UART connector */}
                  <rect x={28} y={68} width={14} height={26} rx={2}
                    fill="rgba(168,85,247,0.06)" stroke="rgba(168,85,247,0.52)" strokeWidth="0.8" />
                  <text x={8} y={81} fill="rgba(168,85,247,0.6)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">UART</text>
                  {/* USB */}
                  <rect x={95} y={142} width={30} height={14} rx={2.5}
                    fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.48)" strokeWidth="0.8" />
                  <text x={110} y={149} textAnchor="middle" dominantBaseline="middle" fill="rgba(59,130,246,0.6)" fontSize="5" fontFamily="JetBrains Mono, monospace">USB-C</text>
                  {/* STM32 chip */}
                  <rect x={52} y={54} width={26} height={22} rx={2}
                    fill="rgba(168,85,247,0.09)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.7" />
                  <text x={65} y={65} textAnchor="middle" dominantBaseline="middle" fill="rgba(168,85,247,0.7)" fontSize="4.8" fontFamily="JetBrains Mono, monospace" fontWeight="700">STM32H7</text>
                  {/* Barometer */}
                  <circle cx={148} cy={100} r={7} fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.4)" strokeWidth="0.7" />
                  <text x={148} y={101} textAnchor="middle" dominantBaseline="middle" fill="rgba(59,130,246,0.55)" fontSize="4" fontFamily="JetBrains Mono, monospace">BARO</text>
                  {/* Labels */}
                  <text x={110} y={180} textAnchor="middle" fill="rgba(168,85,247,0.72)" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">CUBE ORANGE+</text>
                  <text x={110} y={192} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">PX4 // 480MHz // TRIPLE IMU</text>
                  <text x={110} y={203} textAnchor="middle" fill="rgba(168,85,247,0.35)" fontSize="5" fontFamily="JetBrains Mono, monospace">DWG: FC-01 // TOP VIEW</text>
                </svg>
              </div>

              {/* ── Brushless Motor + ESC Blueprint ── */}
              <div className="rounded-2xl border overflow-hidden flex flex-col group" style={{ borderColor: "rgba(20,184,166,0.24)", background: "#070810" }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(20,184,166,0.14)", background: "rgba(20,184,166,0.04)" }}>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(20,184,166,0.7)" }}>PROPULSION // MOTOR</span>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>MN4014 KV400</span>
                </div>
                <svg viewBox="0 0 220 220" className="w-full flex-1" style={{ minHeight: 180 }}>
                  <defs>
                    <pattern id="mot-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(20,184,166,0.06)" strokeWidth="0.4" />
                    </pattern>
                    <filter id="mot-glow"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <rect width="220" height="220" fill="url(#mot-grid)" />
                  {[[8,8],[212,8],[8,212],[212,212]].map(([x,y],i) => (
                    <g key={i}>
                      <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="rgba(20,184,166,0.38)" strokeWidth="0.6" />
                      <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="rgba(20,184,166,0.38)" strokeWidth="0.6" />
                    </g>
                  ))}
                  {/* Motor outer bell */}
                  <motion.circle cx={80} cy={100} r={44}
                    fill="rgba(20,184,166,0.03)" stroke="rgba(20,184,166,0.48)" strokeWidth="1.1" filter="url(#mot-glow)"
                    initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 170 }}
                    style={{ transformBox: "fill-box", transformOrigin: "80px 100px" } as React.CSSProperties}
                  />
                  {/* Stator */}
                  <motion.circle cx={80} cy={100} r={33}
                    fill="rgba(20,184,166,0.05)" stroke="rgba(20,184,166,0.32)" strokeWidth="0.8"
                    initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ transformBox: "fill-box", transformOrigin: "80px 100px" } as React.CSSProperties}
                  />
                  {/* Stator windings */}
                  {Array.from({ length: 9 }, (_, j) => {
                    const ang = (j * 40 - 90) * Math.PI / 180;
                    return (
                      <motion.line key={j}
                        x1={80 + 20 * Math.cos(ang)} y1={100 + 20 * Math.sin(ang)}
                        x2={80 + 31 * Math.cos(ang)} y2={100 + 31 * Math.sin(ang)}
                        stroke="rgba(20,184,166,0.45)" strokeWidth="2.2" strokeLinecap="round"
                        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 + j * 0.04, duration: 0.3 }}
                      />
                    );
                  })}
                  {/* Rotor gap */}
                  <circle cx={80} cy={100} r={18} fill="rgba(0,0,0,0.65)" stroke="rgba(20,184,166,0.28)" strokeWidth="0.7" />
                  {/* Shaft */}
                  <circle cx={80} cy={100} r={7} fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.7)" strokeWidth="1.1" />
                  <circle cx={80} cy={100} r={2.8} fill="rgba(20,184,166,0.8)" />
                  <text x={80} y={154} textAnchor="middle" fill="rgba(20,184,166,0.5)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">CROSS-SECTION VIEW</text>
                  {/* ESC PCB */}
                  <motion.rect x={148} y={58} width={56} height={84} rx={4}
                    fill="rgba(212,175,55,0.03)" stroke="rgba(212,175,55,0.42)" strokeWidth="0.9"
                    initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                  <text x={176} y={75} textAnchor="middle" fill="rgba(212,175,55,0.7)" fontSize="6.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">ESC</text>
                  {/* MOSFET grid on ESC */}
                  {[[151,82],[163,82],[175,82],[151,96],[163,96],[175,96]].map(([x,y],j) => (
                    <rect key={j} x={x} y={y} width={10} height={9} rx={1}
                      fill="rgba(212,175,55,0.07)" stroke="rgba(212,175,55,0.35)" strokeWidth="0.5" />
                  ))}
                  <text x={176} y={72} textAnchor="middle" fill="rgba(212,175,55,0.32)" fontSize="4.5" fontFamily="JetBrains Mono, monospace">60A</text>
                  {/* Phase wires */}
                  {[88, 100, 112].map((y, j) => (
                    <motion.path key={j}
                      d={`M ${80+44} ${y} Q 125 ${y} 148 ${72+j*14}`}
                      fill="none" stroke={["#ef4444", "#22c55e", "#3b82f6"][j]} strokeWidth="1.3" strokeDasharray="3.5 2.5" opacity="0.65"
                      initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                      transition={{ delay: 0.7 + j * 0.1, duration: 0.6 }}
                    />
                  ))}
                  <text x={176} y={116} textAnchor="middle" fill="rgba(212,175,55,0.35)" fontSize="4.5" fontFamily="JetBrains Mono, monospace">UVW PHASE</text>
                  {/* Labels */}
                  <text x={110} y={182} textAnchor="middle" fill="rgba(20,184,166,0.7)" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">T-MOTOR MN4014</text>
                  <text x={110} y={194} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">KV400 // HEAVY LIFT // 15&quot; PROP</text>
                  <text x={110} y={205} textAnchor="middle" fill="rgba(20,184,166,0.35)" fontSize="5" fontFamily="JetBrains Mono, monospace">DWG: MOT-01 // CROSS-SECTION</text>
                </svg>
              </div>

              {/* ── 6S LiPo Battery Blueprint ── */}
              <div className="rounded-2xl border overflow-hidden flex flex-col group" style={{ borderColor: "rgba(249,115,22,0.24)", background: "#070810" }}>
                <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "rgba(249,115,22,0.14)", background: "rgba(249,115,22,0.04)" }}>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(249,115,22,0.7)" }}>POWER // 6S LIPO</span>
                  <span className="font-mono-code text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>Tattu 22000mAh</span>
                </div>
                <svg viewBox="0 0 220 220" className="w-full flex-1" style={{ minHeight: 180 }}>
                  <defs>
                    <pattern id="bat-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(249,115,22,0.06)" strokeWidth="0.4" />
                    </pattern>
                    <filter id="bat-glow"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <linearGradient id="bat-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(249,115,22,0.1)" />
                      <stop offset="100%" stopColor="rgba(249,115,22,0.04)" />
                    </linearGradient>
                  </defs>
                  <rect width="220" height="220" fill="url(#bat-grid)" />
                  {[[8,8],[212,8],[8,212],[212,212]].map(([x,y],i) => (
                    <g key={i}>
                      <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="rgba(249,115,22,0.38)" strokeWidth="0.6" />
                      <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="rgba(249,115,22,0.38)" strokeWidth="0.6" />
                    </g>
                  ))}
                  {/* Battery pack */}
                  <motion.rect x={28} y={60} width={164} height={88} rx={6}
                    fill="url(#bat-grad)" stroke="rgba(249,115,22,0.6)" strokeWidth="1.2" filter="url(#bat-glow)"
                    initial={{ opacity: 0, scale: 0.88 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties}
                  />
                  {/* 6 cell dividers */}
                  {[1,2,3,4,5].map(j => (
                    <motion.line key={j} x1={28 + j * (164/6)} y1={60} x2={28 + j * (164/6)} y2={148}
                      stroke="rgba(249,115,22,0.38)" strokeWidth="0.7"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.45 + j * 0.07, duration: 0.4 }}
                    />
                  ))}
                  {/* Cell charge bars */}
                  {Array.from({ length: 6 }, (_, j) => (
                    <motion.rect key={j}
                      x={32 + j * (164/6)} y={65} width={(164/6) - 8} height={24} rx={2}
                      fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.22)" strokeWidth="0.4"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + j * 0.07 }}
                    />
                  ))}
                  {/* Cell labels */}
                  {Array.from({ length: 6 }, (_, j) => (
                    <text key={j} x={28 + (j + 0.5) * (164/6)} y={106} textAnchor="middle"
                      fill="rgba(249,115,22,0.62)" fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                      S{j+1}
                    </text>
                  ))}
                  {/* Cell voltage */}
                  {Array.from({ length: 6 }, (_, j) => (
                    <text key={j} x={28 + (j + 0.5) * (164/6)} y={118} textAnchor="middle"
                      fill="rgba(249,115,22,0.35)" fontSize="4.8" fontFamily="JetBrains Mono, monospace">
                      3.7V
                    </text>
                  ))}
                  {/* XT90-AS connector */}
                  <motion.g initial={{ opacity: 0, y: -6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.85, duration: 0.5 }}>
                    <rect x={84} y={40} width={52} height={20} rx={3.5}
                      fill="rgba(249,115,22,0.06)" stroke="rgba(249,115,22,0.65)" strokeWidth="1.1" />
                    <rect x={88} y={44} width={16} height={12} rx={2}
                      fill="rgba(249,115,22,0.14)" stroke="rgba(249,115,22,0.42)" strokeWidth="0.7" />
                    <text x={120} y={50.5} textAnchor="middle" dominantBaseline="middle" fill="rgba(249,115,22,0.78)" fontSize="5.2" fontFamily="JetBrains Mono, monospace" fontWeight="700">XT90-AS</text>
                    <line x1={110} y1={40} x2={110} y2={60} stroke="rgba(249,115,22,0.35)" strokeWidth="0.5" strokeDasharray="2 2" />
                  </motion.g>
                  {/* Safety strip */}
                  <motion.rect x={33} y={130} width={154} height={11} rx={2}
                    fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.28)" strokeWidth="0.5"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.95 }}
                  />
                  <text x={110} y={136.5} textAnchor="middle" dominantBaseline="middle" fill="rgba(249,115,22,0.45)" fontSize="4.5" fontFamily="JetBrains Mono, monospace">⚠ LIPO 22.2V NOM // 100A PEAK // DO NOT SHORT</text>
                  {/* Labels */}
                  <text x={110} y={175} textAnchor="middle" fill="rgba(249,115,22,0.72)" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">TATTU PLUS 6S</text>
                  <text x={110} y={187} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5.5" fontFamily="JetBrains Mono, monospace">22,000mAh // SMART BMS</text>
                  <text x={110} y={198} textAnchor="middle" fill="rgba(249,115,22,0.35)" fontSize="5" fontFamily="JetBrains Mono, monospace">DWG: BAT-01 // SIDE VIEW</text>
                </svg>
              </div>
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* ── Electrical / System Architecture Diagram ── */}
        <AnimatedSection className="mb-20">
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: "#a855f7" }}>System Architecture</span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, rgba(168,85,247,0.4), transparent)` }} />
            </div>
          </FadeItem>

          <FadeItem>
            <div className="overflow-x-auto pb-2 -mx-2 px-2 rounded-2xl border" style={{ borderColor: "rgba(168,85,247,0.15)", background: "#070810" }}>
              <svg viewBox="0 0 800 400" className="w-full min-w-[680px]" style={{ maxHeight: 400 }}>
                <defs>
                  <filter id="hexa-glow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="hexa-dot">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="hexa-glow-purple">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Hexagonal drone body wireframe hint */}
                {inView && (
                  <motion.polygon
                    points="420,140 480,170 480,230 420,260 360,230 360,170"
                    fill="rgba(168,85,247,0.025)"
                    stroke="rgba(168,85,247,0.12)"
                    strokeWidth="0.8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                )}

                {/* Edge paths */}
                {HEXA_DIAGRAM_EDGES.map((e, i) => (
                  <motion.path
                    key={i}
                    d={e.path}
                    fill="none"
                    stroke={e.color}
                    strokeWidth={i < 3 ? "1.2" : "0.9"}
                    strokeDasharray={i < 3 ? "6 4" : "4 3"}
                    strokeOpacity="0.38"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.3, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}

                {/* Flowing signal dots */}
                {inView && HEXA_DIAGRAM_EDGES.filter(e => e.dot).map((e, i) => (
                  <circle key={`dot-${i}`} r="2.5" fill={e.color} opacity="0.9" filter="url(#hexa-dot)">
                    <animateMotion
                      dur={`${1.8 + i * 0.28}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.32}s`}
                      path={e.path}
                    />
                  </circle>
                ))}

                {/* Nodes */}
                {HEXA_DIAGRAM_NODES.map((n, i) => {
                  const nodeColor = n.id === "jetson" ? "#a855f7"
                    : n.id === "gps" ? "#22c55e"
                    : n.id === "camera" ? "#f5c518"
                    : n.id === "lipo" ? "#f97316"
                    : GOLD;
                  return (
                    <motion.g
                      key={n.id}
                      transform={`translate(${n.x}, ${n.y})`}
                      style={{ transformBox: "fill-box", transformOrigin: "center" } as React.CSSProperties}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={inView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.09, type: "spring", stiffness: 200, damping: 18 }}
                    >
                      <circle cx={0} cy={0} r={n.r + 10} fill="rgba(0,0,0,0.01)" stroke={`${nodeColor}06`} strokeWidth="0.5" />
                      <circle cx={0} cy={0} r={n.r} fill="#070810" stroke={`${nodeColor}55`} strokeWidth="1" filter="url(#hexa-glow)" />
                      <circle cx={0} cy={0} r={n.r - 7} fill={n.bg} />
                      <text x={0} y={-3} textAnchor="middle" fill={nodeColor} fontSize={n.r > 24 ? "8" : "6.5"} fontFamily="JetBrains Mono, monospace" fontWeight="700">
                        {n.abbr}
                      </text>
                      <text x={0} y={9} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4.8" fontFamily="JetBrains Mono, monospace">
                        {n.title.split(" ").slice(-1)[0].toUpperCase()}
                      </text>
                      {n.sub.map((line, j) => (
                        <motion.text
                          key={j}
                          x={0}
                          y={n.r + 14 + j * 10}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.2)"
                          fontSize="4.8"
                          fontFamily="JetBrains Mono, monospace"
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : {}}
                          transition={{ delay: 1.6 + i * 0.07, duration: 0.5 }}
                        >
                          {line}
                        </motion.text>
                      ))}
                      {([[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]).map(([sx, sy], ti) => (
                        <g key={ti}>
                          <line x1={sx * (n.r + 10)} y1={sy * (n.r + 10)} x2={sx * (n.r + 10) - sx * 5} y2={sy * (n.r + 10)} stroke={`${nodeColor}20`} strokeWidth="0.7" />
                          <line x1={sx * (n.r + 10)} y1={sy * (n.r + 10)} x2={sx * (n.r + 10)} y2={sy * (n.r + 10) - sy * 5} stroke={`${nodeColor}20`} strokeWidth="0.7" />
                        </g>
                      ))}
                    </motion.g>
                  );
                })}

                <motion.text
                  x="400" y="390"
                  textAnchor="middle"
                  fill="rgba(168,85,247,0.1)"
                  fontSize="5.8"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="2.5"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2.5, duration: 0.8 }}
                >
                  CREOVA SOLUTION — SOIL ANALYSIS HEXACOPTER — SYSTEM SCHEMATIC REV. 2026
                </motion.text>
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 items-center">
              {[
                { color: "#f97316", label: "Main power (22.2V)" },
                { color: GOLD,      label: "FC arm / PWM" },
                { color: "#a855f7", label: "UART / MAVLink" },
                { color: "#22c55e", label: "CAN / RTK GPS" },
                { color: "#3b82f6", label: "Ethernet / Camera" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <svg width="22" height="4"><line x1="0" y1="2" x2="22" y2="2" stroke={l.color} strokeWidth="1.2" strokeDasharray="4 2" /></svg>
                  <span className="text-xs font-mono-code text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </FadeItem>
        </AnimatedSection>

        {/* ── Bill of Materials ── */}
        <AnimatedSection className="mb-20">
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: "#a855f7" }}>Bill of Materials</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.4), transparent)" }} />
              <span className="text-xs font-mono-code" style={{ color: "rgba(255,255,255,0.28)" }}>{HEXA_PARTS.length} line items</span>
            </div>
          </FadeItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedParts.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.06 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl p-4 border transition-colors duration-200"
                style={{ borderColor: "rgba(168,85,247,0.1)", background: "#080810" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.28)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.1)"; }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="text-xs font-medium text-foreground leading-tight">{p.name}</div>
                  <span className="shrink-0 text-xs font-mono-code" style={{ color: GOLD }}>${p.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground/55 leading-tight mb-3">{p.product}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono-code"
                      style={{ background: `${typeColor(p.type)}16`, color: typeColor(p.type), border: `1px solid ${typeColor(p.type)}30` }}>
                      {p.type}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono-code border"
                      style={{ borderColor: "rgba(168,85,247,0.18)", color: "rgba(255,255,255,0.28)" }}>
                      {p.cat}
                    </span>
                  </div>
                  {p.qty > 1 && <span className="text-xs font-mono-code text-muted-foreground/35">×{p.qty}</span>}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => setShowAllParts(v => !v)}
              className="text-xs font-mono-code transition-opacity hover:opacity-70"
              style={{ color: "#a855f7" }}
            >
              {showAllParts ? "↑ Show less" : `+ Show ${HEXA_PARTS.length - 9} more components →`}
            </button>
            <div className="font-mono-code text-xs">
              <span className="text-muted-foreground">Total BOM: </span>
              <span style={{ color: GOLD }} className="font-bold">${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Assembly Phases ── */}
        <AnimatedSection>
          <FadeItem className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code uppercase tracking-widest" style={{ color: "#a855f7" }}>Assembly Phases</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.4), transparent)" }} />
            </div>
          </FadeItem>

          <FadeItem>
            <div className="flex flex-wrap gap-2 mb-8">
              {HEXA_PHASES.map((phase, i) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(i)}
                  className="px-4 py-2 rounded-lg text-xs font-mono-code transition-all duration-200 border"
                  style={{
                    borderColor: activePhase === i ? "rgba(168,85,247,0.55)" : "rgba(168,85,247,0.14)",
                    background: activePhase === i ? "rgba(168,85,247,0.1)" : "transparent",
                    color: activePhase === i ? "#a855f7" : "rgba(255,255,255,0.38)",
                    boxShadow: activePhase === i ? "0 0 20px rgba(168,85,247,0.12)" : "none",
                  }}
                >
                  {phase.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HEXA_PHASES[activePhase].steps.map((step, i) => (
                <motion.div
                  key={`${activePhase}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.065, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 rounded-xl p-4 border"
                  style={{ borderColor: "rgba(168,85,247,0.12)", background: "#080810" }}
                >
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono-code text-xs font-bold"
                    style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", marginTop: "1px" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                </motion.div>
              ))}
            </div>
          </FadeItem>
        </AnimatedSection>

      </div>
    </section>
  );
}

// ─── Built for Clients ────────────────────────────────────────────────────────

const bars = [
  { label: "Need custom software (off-the-shelf doesn't fit)", percent: 84 },
  { label: "Struggle with manual, repetitive processes", percent: 73 },
  { label: "Want technical consulting or fractional CTO", percent: 67 },
  { label: "Delay projects due to technical debt", percent: 61 },
];

const checkItems = ["Technical strategy for non-technical founders", "Clean code examples & explanations", "Consulting frameworks & templates", "Case studies: problem → solution", "Client success stories (anonymized)", "GitHub repo access & code snippets"];

function BuiltForClients() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Data-Driven</span>
            <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">Built for Our Clients</h2>
          </FadeItem>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeItem className="space-y-8">
              {bars.map((b, i) => <ProgressBar key={i} {...b} />)}
            </FadeItem>
            <FadeItem>
              <h3 className="font-display text-xl font-bold uppercase mb-6 text-muted-foreground tracking-wide">What you get with us</h3>
              <ul className="space-y-3.5">
                {checkItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                    <span className="text-foreground/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeItem>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Industries Marquee ───────────────────────────────────────────────────────

const industries = ["SaaS", "E-commerce", "Logistics", "FinTech", "HealthTech", "EdTech", "Professional Services", "Non-profits", "Manufacturing", "PropTech", "CleanTech", "AgriTech"];

function IndustriesMarquee() {
  return (
    <section className="py-20 border-y overflow-hidden" style={{ borderColor: "#2a2a2a", background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <AnimatedSection>
          <FadeItem>
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-2" style={{ color: GOLD }}>Experience</span>
            <h2 className="font-display text-5xl md:text-6xl font-black uppercase leading-none">Industries We Serve</h2>
          </FadeItem>
        </AnimatedSection>
      </div>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {[...industries, ...industries].map((ind, i) => (
            <span key={i} className="inline-flex items-center gap-6 shrink-0 px-6">
              <span className="font-display text-3xl font-black uppercase text-foreground/10 hover:text-gold-gradient transition-all duration-300">{ind}</span>
              <span style={{ color: GOLD, opacity: 0.3 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

const events = [
  { emoji: "🚀", type: "Hackathon", title: "Creova Hack: Fall 2026", theme: "AI for Local Business", date: "Sept 12–14, 2026", format: "Hybrid (online + in-person)", prize: "$2,000+", cost: "Register", highlight: true, countdown: new Date("2026-09-12T00:00:00") },
  { emoji: "🎨", type: "Design Challenge", title: "Creova Design Challenge", theme: "Design an AI interface for seniors", date: "Aug 15–22, 2026", format: "Async + Live Finale", prize: "$1,000", cost: "Register", highlight: false, countdown: new Date("2026-08-15T00:00:00") },
  { emoji: "🔨", type: "Build Night", title: "APIs from Zero", theme: "Build your first working API from scratch", date: "Aug 12, 2026 · 6–9 PM ET", format: "30 min tutorial + 2 hrs", prize: "", cost: "Free", highlight: false, countdown: null },
  { emoji: "🤖", type: "AI Demo Day", title: "Automate Your Inbox", theme: "Live automation of Gmail + GPT. All code posted to GitHub.", date: "Aug 27, 2026 · 12–1 PM ET", format: "Online", prize: "", cost: "Free", highlight: false, countdown: null },
  { emoji: "💬", type: "Office Hours", title: "Free Tech Consults", theme: "30-min tech consults. No sales pitch.", date: "Every Thursday, 2–4 PM ET", format: "Zoom", prize: "", cost: "Free", highlight: false, countdown: null },
];

function Events() {
  return (
    <section id="events" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Community</span>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">Build, Design,<br />and Connect.</h2>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Free and low-cost community events for developers, designers, and founders.</p>
            </div>
          </FadeItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e, i) => (
              <FadeItem key={i}>
                <TiltCard
                  className={`border rounded p-6 h-full flex flex-col transition-colors`}
                  intensity={8}
                >
                  <div style={e.highlight ? { borderColor: `${GOLD}55`, background: `${GOLD}08` } as React.CSSProperties : { borderColor: "#2a2a2a" } as React.CSSProperties} className="absolute inset-0 rounded border pointer-events-none" />
                  <div className="relative flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-code text-muted-foreground uppercase tracking-wide">{e.type}</span>
                    {e.highlight && <span className="text-xs font-mono-code border rounded px-2 py-0.5" style={{ color: GOLD, borderColor: `${GOLD}44` }}>Featured</span>}
                  </div>
                  <div className="relative text-2xl mb-3">{e.emoji}</div>
                  <h3 className="relative font-display text-xl font-bold uppercase mb-2 leading-tight">{e.title}</h3>
                  <p className="relative text-xs text-muted-foreground mb-4 flex-1 leading-relaxed">{e.theme}</p>
                  {e.countdown && <Countdown target={e.countdown} />}
                  <div className="relative space-y-1.5 mt-4 mb-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar size={10} style={{ color: GOLD }} className="shrink-0" />{e.date}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Globe size={10} style={{ color: GOLD }} className="shrink-0" />{e.format}</div>
                    {e.prize && <div className="flex items-center gap-2 text-xs" style={{ color: GOLD }}><Award size={10} className="shrink-0" />Prizes: {e.prize}</div>}
                  </div>
                  <RippleBtn className={`relative text-xs font-medium py-2 px-4 rounded border w-full transition-colors ${e.cost === "Free" ? "border-border text-muted-foreground hover:text-foreground" : ""}`} style={e.cost !== "Free" ? { borderColor: `${GOLD}44`, color: GOLD } : {}}>
                    {e.cost === "Free" ? "Join Free →" : `${e.cost} →`}
                  </RippleBtn>
                </TiltCard>
              </FadeItem>
            ))}
          </div>

          <FadeItem className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Calendar size={12} /> View full calendar</a>
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><MessageCircle size={12} /> Suggest a topic</a>
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Heart size={12} /> Sponsor an event</a>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Podcast ──────────────────────────────────────────────────────────────────

function Podcast() {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="podcast" className="py-24 border-y" style={{ borderColor: "#2a2a2a", background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeItem>
              <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Audio</span>
              <h2 className="font-display text-6xl font-black uppercase leading-none mb-6">Creova Cast</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm text-sm">Conversations with founders, builders, and creators about technology, community, and everything in between. Weekly · 30–45 min.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Spotify", "Apple Podcasts", "YouTube", "RSS"].map(p => (
                  <span key={p} className="text-xs font-mono-code border border-border rounded px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-opacity-60 transition-colors">
                    {p}
                  </span>
                ))}
              </div>
            </FadeItem>

            <FadeItem>
              <div className="border rounded p-6 mb-4" style={{ borderColor: `${GOLD}33`, background: `${GOLD}06` }}>
                <span className="text-xs font-mono-code uppercase tracking-wide block mb-4" style={{ color: GOLD }}>Latest Episode</span>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded flex items-center justify-center shrink-0" style={{ background: `${GOLD}22` }}>
                    <Mic2 size={22} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono-code mb-1">Ep. 12</div>
                    <div className="font-display text-xl font-bold uppercase leading-tight">"Building in Public"</div>
                  </div>
                </div>

                {/* Waveform visualizer */}
                <div className="flex items-center gap-0.5 mb-5 h-8">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full shrink-0"
                      style={{ background: GOLD, minHeight: 3 }}
                      animate={playing ? { height: [`${Math.random() * 20 + 4}px`, `${Math.random() * 28 + 4}px`, `${Math.random() * 16 + 4}px`] } : { height: `${4 + (i % 7) * 3}px` }}
                      transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4, ease: "easeInOut" }}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <RippleBtn
                    onClick={() => setPlaying(!playing)}
                    className="text-sm font-medium px-5 py-2.5 rounded flex-1 flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}
                  >
                    {playing ? "⏸ Pause" : "▶ Listen now"}
                  </RippleBtn>
                </div>
              </div>

              <div className="border border-border rounded divide-y divide-border overflow-hidden">
                {[{ ep: "11", title: "From Zero to $10K MRR" }, { ep: "10", title: "The No-Code Frontier" }, { ep: "9", title: "Open Source vs. VC Money" }].map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 group hover:bg-[#1a1a1a] transition-colors">
                    <span className="text-xs font-mono-code text-muted-foreground w-8 shrink-0">Ep.{ep.ep}</span>
                    <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors flex-1">{ep.title}</span>
                    <ChevronRight size={12} className="text-muted-foreground shrink-0 transition-colors" style={{ color: "inherit" }} />
                  </div>
                ))}
                <div className="px-4 py-3">
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all episodes →</a>
                </div>
              </div>
            </FadeItem>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Mentorship ───────────────────────────────────────────────────────────────

const mentorshipOptions = [
  { icon: Users, title: "1:1 Mentorship", desc: "Monthly 60-min calls + async support for focused, personal guidance.", duration: "3 months", cost: "Free", spots: "5 per quarter" },
  { icon: GraduationCap, title: "Group Cohort", desc: "Cohort of 8 mentees, weekly group calls around shared goals.", duration: "6 weeks", cost: "Free", spots: "Next: Aug 2026" },
  { icon: MessageCircle, title: "Office Hours", desc: "Open 2 hours/week, first come first served. No application required.", duration: "Ongoing", cost: "Free", spots: "Tuesdays 2–4 PM ET" },
];

function Mentorship() {
  return (
    <section id="community" className="py-24 border-t" style={{ borderColor: "#2a2a2a" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Give & Grow</span>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">Creova<br />Mentorship</h2>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">15 mentors. 30 mentees matched. 200+ hours of guidance given.</p>
            </div>
          </FadeItem>

          {/* Progress bar showing matched this quarter */}
          <FadeItem className="mb-12 p-6 border border-border rounded">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground">Mentee spots filled this quarter</span>
              <span className="font-mono-code font-medium" style={{ color: GOLD }}>3 / 5 matched</span>
            </div>
            <ProgressBar label="" percent={60} />
          </FadeItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {mentorshipOptions.map((m, i) => (
              <FadeItem key={i}>
                <TiltCard className="border border-border bg-background rounded p-6 h-full flex flex-col" intensity={8}>
                  <m.icon size={17} className="mb-5 shrink-0" style={{ color: GOLD }} />
                  <h3 className="font-display text-xl font-bold uppercase mb-2">{m.title}</h3>
                  <p className="text-xs text-muted-foreground mb-5 flex-1 leading-relaxed">{m.desc}</p>
                  <div className="space-y-1.5 mb-6 text-xs border-t border-border pt-4">
                    {[["Duration", m.duration], ["Cost", m.cost], ["Spots", m.spots]].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>
                        <span style={k === "Cost" ? { color: GOLD } : {}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <RippleBtn className="text-xs font-medium text-center border rounded py-2 w-full" style={{ borderColor: `${GOLD}44`, color: GOLD } as React.CSSProperties}>
                    Apply →
                  </RippleBtn>
                </TiltCard>
              </FadeItem>
            ))}
          </div>

          <FadeItem>
            <div className="border border-border rounded p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="font-display text-lg font-bold uppercase block mb-1">🙋 Want to mentor?</span>
                <p className="text-xs text-muted-foreground">Give back to the community. Get featured on our website. Free event tickets.</p>
              </div>
              <RippleBtn className="text-xs font-medium border border-border text-muted-foreground rounded px-5 py-2 hover:text-foreground shrink-0 transition-colors">
                Apply to Mentor →
              </RippleBtn>
            </div>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  { text: "Creova Solution turned our manual spreadsheets into a custom dashboard. Saved us 15 hours per week.", name: "Sarah M.", title: "Operations Director", company: "Logistics Co." },
  { text: "The technical audit alone paid for itself. They found issues we didn't even know existed.", name: "David K.", title: "Founder", company: "SaaS Startup" },
  { text: "Finally, a tech partner who explains things clearly and delivers on time. No jargon.", name: "Priya L.", title: "Product Manager", company: "E-commerce Brand" },
  { text: "The hackathon organized by Creova brought together 40+ builders. Two projects are now real startups.", name: "Marcus T.", title: "Past Participant", company: "Community Member" },
];

function Testimonials() {
  return (
    <section className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Social Proof</span>
            <h2 className="font-display text-6xl md:text-7xl font-black uppercase leading-none">What Our Clients Say</h2>
          </FadeItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px" style={{ background: "#2a2a2a" }}>
            {testimonials.map((t, i) => (
              <FadeItem key={i}>
                <TiltCard className="bg-[#111111] p-8 h-full" intensity={5}>
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={11} style={{ fill: GOLD, color: GOLD }} />)}
                  </div>
                  <blockquote className="text-foreground/85 leading-relaxed mb-8 text-sm">"{t.text}"</blockquote>
                  <div className="border-t border-border pt-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GOLD}22` }}>
                      <span className="text-xs font-bold" style={{ color: GOLD }}>{t.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.title}, {t.company}</div>
                    </div>
                  </div>
                </TiltCard>
              </FadeItem>
            ))}
          </div>

          <div className="border border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[["25+", "Solutions Deployed"], ["15+", "Client Companies"], ["4.9", "Average Rating"], ["95%", "Would Recommend"]].map(([v, l]) => (
              <div key={l} className="p-6 text-center">
                <div className="font-display text-3xl font-black mb-1" style={{ color: GOLD }}>{v}</div>
                <div className="text-xs text-muted-foreground font-mono-code uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Our Approach ─────────────────────────────────────────────────────────────

const values = [
  { icon: Code2, title: "Technical Excellence", desc: "Clean, maintainable, documented code. No shortcuts." },
  { icon: BarChart2, title: "Business-First", desc: "Every line of code serves a real business goal." },
  { icon: Users, title: "Community-Led", desc: "We build with, for, and because of our community." },
  { icon: CheckCircle, title: "Transparent", desc: "No jargon. Honest timelines. Fair pricing." },
];

function Approach() {
  return (
    <section className="py-24 border-t" style={{ borderColor: "#2a2a2a" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <FadeItem className="mb-16">
            <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Philosophy</span>
            <h2 className="font-display text-6xl font-black uppercase leading-none">Our Approach</h2>
          </FadeItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((v, i) => (
              <FadeItem key={i}>
                <div className="group">
                  <div className="w-12 h-12 border border-border rounded mb-6 flex items-center justify-center transition-all group-hover:border-opacity-50" style={{ "--tw-border-opacity": "0.3" } as React.CSSProperties}>
                    <v.icon size={17} className="text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Limited CTA ──────────────────────────────────────────────────────────────

function LimitedCTA() {
  return (
    <section className="py-32 border-y relative overflow-hidden" style={{ borderColor: "#2a2a2a" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.12), transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <FadeItem>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code border rounded px-4 py-1.5 mb-10" style={{ color: GOLD, borderColor: `${GOLD}44` }}>
              <Flame size={11} style={{ color: GOLD }} />3 client spots remaining for Q3 2026
            </div>
          </FadeItem>

          <FadeItem>
            <h2 className="font-display font-black uppercase leading-none mb-8 text-[clamp(2.5rem,7.5vw,7rem)]">
              Ready to Build Something that <span className="text-gold-gradient">Lasts?</span>
            </h2>
          </FadeItem>

          {/* Urgency meter */}
          <FadeItem className="max-w-sm mx-auto mb-10">
            <div className="flex justify-between text-xs font-mono-code mb-2">
              <span className="text-muted-foreground">Q3 Capacity</span>
              <span style={{ color: GOLD }}>82% filled</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#2a2a2a" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})` }}
                initial={{ width: 0 }}
                whileInView={{ width: "82%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">3 spots left of 17 total</p>
          </FadeItem>

          <FadeItem>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              We keep our roster small on purpose — every client gets our full attention. If you need a technical audit, an MVP build, or a consultancy retainer, now is the time.
            </p>
          </FadeItem>

          <FadeItem>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <RippleBtn
                className="text-sm font-medium px-8 py-4 rounded animate-gold-pulse"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}
              >
                Free Technical Discovery Call <ArrowRight size={15} className="inline ml-2" />
              </RippleBtn>
              <a href="#" className="inline-flex items-center gap-2 border text-foreground font-medium px-8 py-4 rounded text-sm hover:border-opacity-50 transition-all hover:-translate-y-0.5" style={{ borderColor: "#2a2a2a" }}>
                <Github size={15} /> View GitHub
              </a>
            </div>
          </FadeItem>

          <FadeItem>
            <p className="text-xs text-muted-foreground/50 font-mono-code">
              Response within 24 hrs · No long-term contracts · Ontario-based (remote)
            </p>
          </FadeItem>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (!email) return;
    setSent(true);
  };

  return (
    <section className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeItem>
              <span className="text-xs font-mono-code uppercase tracking-widest block mb-3" style={{ color: GOLD }}>Stay Connected</span>
              <h2 className="font-display text-5xl font-black uppercase leading-none mb-5">The Creova Letter</h2>
              <p className="text-muted-foreground mb-7 text-sm leading-relaxed max-w-sm">Weekly tech tips, upcoming events, and open-source finds — straight to your inbox.</p>
              <ul className="space-y-3 mb-7">
                {["One AI/automation tip per week", "One open-source tool or snippet", "Upcoming events & highlights", "Job board picks"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle size={11} style={{ color: GOLD }} className="shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/50">Join 500+ founders, developers, and creators.</p>
            </FadeItem>

            <FadeItem>
              <div ref={containerRef} className="border border-border rounded p-8 relative overflow-hidden">
                <Confetti active={sent} />
                {sent ? (
                  <div className="text-center py-8 relative z-10">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${GOLD}22` }}>
                      <CheckCircle size={32} style={{ color: GOLD }} />
                    </div>
                    <h3 className="font-display text-3xl font-bold uppercase mb-2">You're in!</h3>
                    <p className="text-muted-foreground text-sm">Check your inbox. No spam, ever.</p>
                  </div>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 text-xs font-mono-code border rounded px-3 py-1.5 mb-6" style={{ color: GOLD, borderColor: `${GOLD}33` }}>
                      🎁 Free: 10 Automation Scripts to Save 10 Hours/Week
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-mono-code text-muted-foreground uppercase tracking-wide block mb-2">Email address</label>
                      <input
                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && submit()}
                        placeholder="you@example.com"
                        className="w-full bg-background border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors"
                        style={{ "--tw-ring-color": GOLD } as React.CSSProperties}
                        onFocus={e => { e.currentTarget.style.borderColor = `${GOLD}44`; }}
                        onBlur={e => { e.currentTarget.style.borderColor = ""; }}
                      />
                    </div>
                    <RippleBtn
                      onClick={submit}
                      className="w-full py-3 rounded text-sm font-medium text-center flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}
                    >
                      Subscribe <ArrowRight size={14} />
                    </RippleBtn>
                    <p className="text-xs text-muted-foreground/50 mt-3 text-center">No spam. Unsubscribe anytime.</p>
                    <div className="mt-5 pt-4 border-t border-border text-center">
                      <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">📚 View past issues →</a>
                    </div>
                  </>
                )}
              </div>
            </FadeItem>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const [footerEmail, setFooterEmail] = useState("");
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contact" className="border-t pt-16 pb-8" style={{ borderColor: "#2a2a2a", background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display text-2xl font-black uppercase tracking-widest mb-2">
              Creova<span style={{ color: GOLD }}>.</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">Build. Automate. Connect.</p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-muted-foreground transition-all duration-200 hover:scale-110" style={{ "--hover-color": GOLD } as React.CSSProperties}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ""; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Quick Links", items: ["Home", "Services", "Events", "Podcast", "Community", "Contact"] },
            { title: "Services", items: ["Custom Software", "AI & Automation", "Technical Consulting", "MVP in 30 Days"] },
            { title: "Community", items: ["Hackathons", "Workshops", "Mentorship", "Job Board", "Newsletter"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-mono-code uppercase tracking-widest text-muted-foreground mb-5">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map(l => (
                  <li key={l}><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-mono-code uppercase tracking-widest text-muted-foreground mb-5">Stay in Touch</h4>
            <div className="space-y-2 mb-6">
              <input type="email" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} placeholder="your@email.com"
                className="w-full bg-[#111111] border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors"
                onFocus={e => { e.currentTarget.style.borderColor = `${GOLD}44`; }}
                onBlur={e => { e.currentTarget.style.borderColor = ""; }}
              />
              <RippleBtn onClick={() => setFooterEmail("")} className="w-full py-2 rounded text-xs font-medium flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, color: "#0a0a0a" } as React.CSSProperties}>
                Subscribe →
              </RippleBtn>
            </div>
            <div className="space-y-2">
              <a href="mailto:hello@creovasolution.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={10} /> hello@creovasolution.com
              </a>
              <a href="#" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Calendar size={10} /> Book a free call
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">© 2026 Creova Solution. All rights reserved. Built with open-source tools and community love.</p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Use", "Code of Conduct"].map(l => (
              <a key={l} href="#" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollTop}
        className="fixed bottom-8 right-8 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        style={{ borderColor: `${GOLD}44`, background: "#0a0a0a", color: GOLD }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${GOLD_GLOW}`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
      >
        <ChevronUp size={16} />
      </button>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <DevLab />
      <Belief />
      <BlueprintSection />
      <BotShowcaseSection />
      <HexaShowcaseSection />
      <BuiltForClients />
      <IndustriesMarquee />
      <Events />
      <Podcast />
      <Mentorship />
      <Testimonials />
      <Approach />
      <LimitedCTA />
      <Newsletter />
      <Footer />
    </div>
  );
}
