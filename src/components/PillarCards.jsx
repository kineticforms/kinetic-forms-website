import { useState, useEffect, useRef, useCallback } from "react";

// On touch devices (no hover), fire the active state when the card
// scrolls into the center of the viewport, hold it, then release.
function useCardActive(holdMs = 1800) {
  const [active, setActive] = useState(false);
  const [hasHover, setHasHover] = useState(true);
  const ref = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    if (hasHover || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          setActive(true);
          setTimeout(() => setActive(false), holdMs);
          // Allow re-trigger after leaving viewport
          setTimeout(() => { firedRef.current = false; }, holdMs + 500);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasHover, holdMs]);

  const onMouseEnter = useCallback(() => hasHover && setActive(true), [hasHover]);
  const onMouseLeave = useCallback(() => hasHover && setActive(false), [hasHover]);

  return { ref, active, onMouseEnter, onMouseLeave };
}

// ═══════════════════════════════════════════════════════════
// VELOCITY
// ═══════════════════════════════════════════════════════════

function VelocityCard({ pillar }) {
  const { ref, active: hovered, onMouseEnter, onMouseLeave } = useCardActive(1200);
  const [streakKey, setStreakKey] = useState(0);

  useEffect(() => {
    if (hovered) setStreakKey((k) => k + 1);
  }, [hovered]);

  return (
    <div
      ref={ref}
      className="relative p-7 md:p-8 border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-150 min-h-[280px] md:min-h-0"
      style={{
        borderColor: hovered ? "#a1a1aa" : undefined,
        boxShadow: hovered ? "0 10px 40px rgba(0,0,0,0.08)" : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Light streaks that fire across the card on hover */}
      {hovered && (
        <div key={streakKey} className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute h-[1px]"
              style={{
                top: `${15 + i * 18}%`,
                left: 0,
                width: "40%",
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 40%, rgba(0,0,0,0.12), rgba(0,0,0,0.06) 60%, transparent)",
                animation: `velocity-streak ${300 + i * 60}ms ${i * 40}ms ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Icon: double chevron that snaps forward */}
        <div
          className="w-10 h-10 md:w-12 md:h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4 md:mb-6 text-zinc-900 transition-all duration-150"
          style={{
            transform: hovered ? "translateX(6px)" : "translateX(0)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6">
            <path
              d="M5 7l5 5-5 5"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-all duration-150"
              style={{
                opacity: hovered ? 0.35 : 0.9,
                transform: hovered ? "translateX(-2px)" : "translateX(0)",
              }}
            />
            <path
              d="M11 7l5 5-5 5"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="transition-all duration-150"
              style={{
                transform: hovered ? "translateX(3px)" : "translateX(0)",
              }}
            />
          </svg>
        </div>

        {/* Title and text blur-snap on hover */}
        <h3
          className="font-bold text-lg md:text-lg mb-3 md:mb-2 transition-all duration-150"
          style={{
            transform: hovered ? "translateX(2px)" : "translateX(0)",
          }}
        >
          {pillar.title}
        </h3>
        <p
          className="text-base md:text-sm text-zinc-500 leading-relaxed transition-all duration-200"
          style={{
            transform: hovered ? "translateX(1px)" : "translateX(0)",
          }}
        >
          {pillar.description}
        </p>
      </div>

      {/* Afterimage: the whole card content "ghosts" to the right on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-100"
        style={{
          opacity: hovered ? 0.025 : 0,
          transform: "translateX(8px)",
          filter: "blur(4px)",
          background: "inherit",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PERSONALITY — the big wow moment
// ═══════════════════════════════════════════════════════════

// Color palette: vintage tropical maximalism
// Beverly Hills Hotel / Martinique wallpaper vibes
const TROPIC = {
  jungle: "#1b3a2d",
  emerald: "#2d6a4f",
  sage: "#52796f",
  coral: "#e07a5f",
  salmon: "#d4956a",
  gold: "#c9922e",
  cream: "#f0e6d3",
  flamingo: "#d4727e",
  flamingoPale: "#e8a0a8",
  deepBg: "#0e1f18",
};

// Profile icon: friendly face with smile, winks on hover
function ProfileIcon({ hovered }) {
  const fill = hovered ? TROPIC.cream : "currentColor";
  const detail = hovered ? TROPIC.deepBg : "white";
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6">
      {/* Head */}
      <circle cx="12" cy="8.5" r="5" fill={fill} style={{ transition: "fill 150ms" }} />
      {/* Shoulders */}
      <path d="M2 22 C2 17, 6.5 14, 12 14 C17.5 14, 22 17, 22 22" fill={fill} style={{ transition: "fill 150ms" }} />
      {/* Eyes: friendly dots in default, left stays open + right winks on hover */}
      <circle cx="10" cy="8" r="0.8" fill={detail} style={{ transition: "fill 150ms" }} />
      {hovered ? (
        <path d="M13.2 7.4 Q14 8.6 14.8 7.4" stroke={detail} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      ) : (
        <circle cx="14" cy="8" r="0.8" fill={detail} style={{ transition: "fill 150ms" }} />
      )}
      {/* Smile: always present, gets bigger on hover */}
      <path
        d={hovered ? "M10 10.5 Q12 12.5 14 10.5" : "M10.5 10 Q12 11.2 13.5 10"}
        stroke={detail}
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        style={{ transition: "d 150ms" }}
      />
    </svg>
  );
}

// Confetti piece
function Confetti({ color, x, y, dx, rotation, delay, shape = "rect" }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: shape === "rect" ? 8 : 6,
        height: shape === "rect" ? 5 : 6,
        borderRadius: shape === "circle" ? "50%" : shape === "rect" ? "1px" : "0",
        backgroundColor: color,
        animation: `confetti-fall 1.4s ${delay}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        "--cx": "0px",
        "--cy": "-10px",
        "--dx": `${dx}px`,
        "--cr": `${rotation}deg`,
      }}
    />
  );
}


// Streamers: curving ribbons that snake across the card
function Streamer({ color, d, delay, duration, style = {} }) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={style}
    >
      <path
        d={d}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        strokeDasharray="8 6"
        style={{
          strokeDashoffset: 200,
          animation: `streamer-draw ${duration}ms ${delay}ms ease-out forwards`,
        }}
      />
    </svg>
  );
}

// Banana leaf: long arching frond with central vein and leaf splits
function BananaLeaf({ color, veinColor, style, className = "" }) {
  return (
    <svg viewBox="0 0 100 200" fill="none" className={className} style={style}>
      <path
        d="M50 195 C48 160, 15 130, 5 80 C0 55, 8 30, 20 15 C28 5, 40 0, 50 5 C60 0, 72 5, 80 15 C92 30, 100 55, 95 80 C85 130, 52 160, 50 195Z"
        fill={color}
      />
      {/* Central vein */}
      <path d="M50 190 C50 150, 48 100, 50 10" stroke={veinColor} strokeWidth="1.5" fill="none" />
      {/* Leaf splits */}
      <path d="M50 40 L28 20" stroke={veinColor} strokeWidth="0.8" opacity="0.6" />
      <path d="M50 40 L72 20" stroke={veinColor} strokeWidth="0.8" opacity="0.6" />
      <path d="M50 70 L15 50" stroke={veinColor} strokeWidth="0.8" opacity="0.5" />
      <path d="M50 70 L85 50" stroke={veinColor} strokeWidth="0.8" opacity="0.5" />
      <path d="M50 100 L10 80" stroke={veinColor} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 100 L90 80" stroke={veinColor} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 130 L18 115" stroke={veinColor} strokeWidth="0.8" opacity="0.3" />
      <path d="M50 130 L82 115" stroke={veinColor} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

// Monstera: recognizable split leaf with fenestrations
function Monstera({ color, holeColor, style, className = "" }) {
  return (
    <svg viewBox="0 0 120 130" fill="none" className={className} style={style}>
      <path
        d="M60 125 C58 105, 35 90, 18 70 C8 57, 5 42, 10 28 C14 18, 22 10, 35 6 C42 4, 50 5, 58 10 C62 5, 70 3, 78 5 C90 8, 100 18, 105 30 C112 48, 108 65, 95 80 C80 95, 62 105, 60 125Z"
        fill={color}
      />
      {/* Central vein */}
      <path d="M60 120 Q58 80, 55 20" stroke={holeColor} strokeWidth="1.2" fill="none" opacity="0.4" />
      {/* Fenestrations (holes) */}
      <ellipse cx="35" cy="55" rx="8" ry="12" fill={holeColor} transform="rotate(-20 35 55)" />
      <ellipse cx="80" cy="50" rx="7" ry="10" fill={holeColor} transform="rotate(15 80 50)" />
      <ellipse cx="45" cy="35" rx="5" ry="8" fill={holeColor} transform="rotate(-10 45 35)" />
      <ellipse cx="72" cy="32" rx="5" ry="7" fill={holeColor} transform="rotate(10 72 32)" />
      {/* Side veins */}
      <path d="M55 50 L25 35" stroke={holeColor} strokeWidth="0.8" opacity="0.3" />
      <path d="M57 50 L90 40" stroke={holeColor} strokeWidth="0.8" opacity="0.3" />
      <path d="M56 75 L22 65" stroke={holeColor} strokeWidth="0.8" opacity="0.3" />
      <path d="M58 75 L95 68" stroke={holeColor} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

// Flamingo: proper S-curve neck, elegant proportions, one-legged pose
function Flamingo({ color, accentColor, style, className = "" }) {
  return (
    <svg viewBox="0 0 60 100" fill="none" className={className} style={style}>
      {/* Tail feathers */}
      <path d="M22 52 C16 48, 12 50, 10 55 C12 52, 16 51, 20 53" fill={accentColor} opacity="0.6" />
      <path d="M22 55 C15 53, 10 56, 8 60 C11 57, 15 55, 20 56" fill={accentColor} opacity="0.5" />
      {/* Body: teardrop shape */}
      <ellipse cx="28" cy="52" rx="14" ry="10" fill={color} transform="rotate(-5 28 52)" />
      {/* Wing detail */}
      <path d="M18 48 C22 44, 30 44, 38 48 C32 46, 24 46, 18 48Z" fill={accentColor} opacity="0.4" />
      {/* S-curve neck */}
      <path
        d="M35 44 C38 38, 40 30, 38 22 C36 16, 32 12, 30 8 C29 5, 30 3, 32 2"
        stroke={color} strokeWidth="5" strokeLinecap="round" fill="none"
      />
      {/* Head */}
      <circle cx="32" cy="3" r="4" fill={color} />
      {/* Beak: proper downward hook */}
      <path d="M35.5 2.5 C37 3, 38 4.5, 36.5 5.5 L34 4" fill={TROPIC.deepBg} />
      <path d="M35.5 2.5 L38 2 C38.5 3, 38 4.5, 36.5 5.5" fill={accentColor} opacity="0.8" />
      {/* Eye */}
      <circle cx="31.5" cy="2.5" r="0.8" fill={TROPIC.deepBg} />
      {/* Standing leg */}
      <path d="M28 60 L26 78 L24 82" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Knee joint */}
      <path d="M24 82 L26 90" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Foot */}
      <path d="M23 90 L29 90" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tucked leg hint */}
      <path d="M30 58 C31 62, 32 64, 34 63" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

// Hibiscus: lush, White Lotus energy. Five overlapping petals, prominent stamen.
function Hibiscus({ style, className = "" }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} style={style}>
      {/* Petals — five overlapping, soft rounded shapes */}
      <path d="M40 38 C32 20, 18 12, 12 18 C6 24, 10 38, 28 40" fill={TROPIC.coral} />
      <path d="M40 38 C22 32, 8 36, 8 46 C8 56, 22 58, 34 48" fill={TROPIC.flamingo} />
      <path d="M40 38 C30 52, 28 68, 36 72 C44 76, 52 64, 48 50" fill={TROPIC.coral} opacity="0.9" />
      <path d="M40 38 C52 54, 66 58, 72 50 C78 42, 68 30, 52 34" fill={TROPIC.flamingo} opacity="0.9" />
      <path d="M40 38 C54 24, 60 10, 52 6 C44 2, 34 12, 36 28" fill={TROPIC.coral} opacity="0.85" />
      {/* Petal veins — subtle darker lines */}
      <path d="M40 38 C34 28, 22 18, 14 20" stroke={TROPIC.flamingo} strokeWidth="0.6" opacity="0.4" fill="none" />
      <path d="M40 38 C28 36, 14 42, 10 48" stroke={TROPIC.coral} strokeWidth="0.6" opacity="0.4" fill="none" />
      <path d="M40 38 C36 50, 32 64, 38 70" stroke={TROPIC.flamingo} strokeWidth="0.6" opacity="0.4" fill="none" />
      <path d="M40 38 C50 48, 62 54, 70 48" stroke={TROPIC.coral} strokeWidth="0.6" opacity="0.4" fill="none" />
      <path d="M40 38 C48 28, 56 14, 50 8" stroke={TROPIC.flamingo} strokeWidth="0.6" opacity="0.4" fill="none" />
      {/* Center */}
      <circle cx="40" cy="38" r="5" fill={TROPIC.gold} />
      <circle cx="40" cy="38" r="3" fill={TROPIC.salmon} />
      {/* Stamen — long, protruding, iconic hibiscus feature */}
      <line x1="40" y1="33" x2="40" y2="16" stroke={TROPIC.flamingo} strokeWidth="1.5" />
      {/* Stamen dots */}
      <circle cx="37" cy="17" r="1.5" fill={TROPIC.gold} />
      <circle cx="40" cy="15" r="1.5" fill={TROPIC.gold} />
      <circle cx="43" cy="17" r="1.5" fill={TROPIC.gold} />
      <circle cx="39" cy="19" r="1" fill={TROPIC.salmon} />
      <circle cx="42" cy="19" r="1" fill={TROPIC.salmon} />
      {/* Leaves */}
      <path d="M22 62 C18 56, 10 58, 8 65 C6 72, 14 74, 22 68" fill={TROPIC.emerald} />
      <path d="M56 64 C60 58, 68 60, 70 66 C72 72, 64 75, 56 70" fill={TROPIC.sage} />
    </svg>
  );
}

// Confetti burst config — colors, positions, timing
const CONFETTI_PIECES = [
  { color: TROPIC.coral, x: "15%", y: "10%", dx: -25, rotation: 420, delay: 0, shape: "rect" },
  { color: TROPIC.gold, x: "35%", y: "5%", dx: 10, rotation: -380, delay: 30, shape: "circle" },
  { color: TROPIC.flamingo, x: "55%", y: "8%", dx: 20, rotation: 300, delay: 60, shape: "rect" },
  { color: TROPIC.emerald, x: "75%", y: "12%", dx: 30, rotation: -450, delay: 20, shape: "circle" },
  { color: TROPIC.cream, x: "25%", y: "15%", dx: -15, rotation: 360, delay: 80, shape: "rect" },
  { color: TROPIC.salmon, x: "65%", y: "6%", dx: -10, rotation: -300, delay: 50, shape: "rect" },
  { color: TROPIC.flamingoPale, x: "45%", y: "3%", dx: 5, rotation: 500, delay: 10, shape: "circle" },
  { color: TROPIC.gold, x: "85%", y: "15%", dx: 15, rotation: -380, delay: 70, shape: "rect" },
  { color: TROPIC.coral, x: "10%", y: "20%", dx: -30, rotation: 320, delay: 40, shape: "circle" },
  { color: TROPIC.emerald, x: "50%", y: "0%", dx: 0, rotation: 400, delay: 15, shape: "rect" },
  { color: TROPIC.flamingo, x: "80%", y: "5%", dx: 25, rotation: -420, delay: 55, shape: "rect" },
  { color: TROPIC.cream, x: "20%", y: "8%", dx: -20, rotation: 350, delay: 90, shape: "circle" },
];

function PersonalityCard({ pillar }) {
  const { ref, active: hovered, onMouseEnter, onMouseLeave } = useCardActive(2200);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (hovered) setBurstKey((k) => k + 1);
  }, [hovered]);

  return (
    <div
      ref={ref}
      className="relative p-7 md:p-8 border rounded-2xl overflow-hidden cursor-default min-h-[280px] md:min-h-0"
      style={{
        backgroundColor: hovered ? TROPIC.deepBg : "white",
        borderColor: hovered ? TROPIC.emerald : "#e4e4e7",
        transition: "background-color 300ms, border-color 300ms, box-shadow 400ms",
        boxShadow: hovered
          ? `0 4px 50px rgba(45, 106, 79, 0.3), 0 0 100px rgba(208, 114, 126, 0.15), 0 0 30px rgba(201, 146, 46, 0.1)`
          : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Layer 1: Tiger stripes ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: hovered ? 0.07 : 0,
          transition: "opacity 500ms 80ms",
          backgroundImage: `
            repeating-linear-gradient(-55deg, transparent, transparent 6px, ${TROPIC.gold}88 6px, ${TROPIC.gold}44 9px, transparent 9px, transparent 18px),
            repeating-linear-gradient(-50deg, transparent, transparent 14px, ${TROPIC.gold}33 14px, ${TROPIC.gold}22 16px, transparent 16px, transparent 28px)
          `,
          backgroundSize: "200% 200%",
          animation: hovered ? "tiger-scroll 10s linear infinite" : "none",
        }}
      />

      {/* ── Layer 2: Hot tropical gradients ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 400ms",
          background: `
            radial-gradient(ellipse at 0% 100%, ${TROPIC.emerald}66 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, ${TROPIC.flamingo}44 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, ${TROPIC.gold}22 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${TROPIC.coral}33 0%, transparent 40%)
          `,
        }}
      />

      {/* ── Layer 3: Dense foliage ── */}
      {/* Banana leaf — top left */}
      <BananaLeaf
        color={TROPIC.emerald}
        veinColor={TROPIC.jungle}
        className="absolute pointer-events-none"
        style={{
          width: 130,
          height: 260,
          top: -90,
          left: -30,
          opacity: hovered ? 0.8 : 0,
          transform: hovered ? "rotate(35deg) scale(1)" : "rotate(35deg) scale(0.3)",
          transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "palm-sway 3.5s ease-in-out infinite" : "none",
          "--sway-start": "33deg",
          "--sway-end": "37deg",
        }}
      />
      {/* Banana leaf — bottom right */}
      <BananaLeaf
        color={TROPIC.jungle}
        veinColor={`${TROPIC.emerald}88`}
        className="absolute pointer-events-none"
        style={{
          width: 110,
          height: 220,
          bottom: -80,
          right: -25,
          opacity: hovered ? 0.65 : 0,
          transform: hovered ? "rotate(-150deg) scale(1)" : "rotate(-150deg) scale(0.3)",
          transition: "all 550ms 60ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "palm-sway 4s 0.2s ease-in-out infinite" : "none",
          "--sway-start": "-153deg",
          "--sway-end": "-147deg",
        }}
      />
      {/* Monstera — top right */}
      <Monstera
        color={TROPIC.sage}
        holeColor={TROPIC.deepBg}
        className="absolute pointer-events-none"
        style={{
          width: 100,
          height: 110,
          top: -25,
          right: -15,
          opacity: hovered ? 0.65 : 0,
          transform: hovered ? "rotate(20deg) scale(1)" : "rotate(20deg) scale(0.2)",
          transition: "all 450ms 40ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "leaf-drift 5s ease-in-out infinite" : "none",
        }}
      />
      {/* Extra banana leaf — mid left, smaller */}
      <BananaLeaf
        color={`${TROPIC.sage}`}
        veinColor={TROPIC.jungle}
        className="absolute pointer-events-none"
        style={{
          width: 70,
          height: 140,
          top: 20,
          left: -15,
          opacity: hovered ? 0.45 : 0,
          transform: hovered ? "rotate(60deg) scale(1)" : "rotate(60deg) scale(0.3)",
          transition: "all 600ms 100ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "palm-sway 5s 0.5s ease-in-out infinite" : "none",
          "--sway-start": "58deg",
          "--sway-end": "62deg",
        }}
      />

      {/* ── Layer 4: Front foliage for depth ── */}
      <Monstera
        color={`${TROPIC.emerald}dd`}
        holeColor={TROPIC.deepBg}
        className="absolute pointer-events-none"
        style={{
          width: 70,
          height: 75,
          top: 15,
          right: 5,
          opacity: hovered ? 0.6 : 0,
          transform: hovered ? "rotate(-25deg) scale(1)" : "rotate(-25deg) scale(0.3)",
          transition: "all 480ms 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      <BananaLeaf
        color={`${TROPIC.emerald}bb`}
        veinColor={TROPIC.jungle}
        className="absolute pointer-events-none"
        style={{
          width: 55,
          height: 110,
          bottom: 10,
          right: 30,
          opacity: hovered ? 0.5 : 0,
          transform: hovered ? "rotate(-140deg) scale(1)" : "rotate(-140deg) scale(0.3)",
          transition: "all 520ms 240ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "palm-sway 4s 0.8s ease-in-out infinite" : "none",
          "--sway-start": "-142deg",
          "--sway-end": "-138deg",
        }}
      />

      {/* ── Layer 5: Hibiscus flowers ── */}
      <Hibiscus
        className="absolute pointer-events-none"
        style={{
          width: 58,
          height: 58,
          bottom: 6,
          left: -4,
          opacity: hovered ? 0.85 : 0,
          transform: hovered ? "rotate(10deg) scale(1)" : "rotate(10deg) scale(0.2)",
          transition: "all 420ms 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "leaf-drift 5s ease-in-out infinite" : "none",
        }}
      />
      <Hibiscus
        className="absolute pointer-events-none"
        style={{
          width: 32,
          height: 32,
          top: 8,
          left: 45,
          opacity: hovered ? 0.45 : 0,
          transform: hovered ? "rotate(-15deg) scale(1)" : "rotate(-15deg) scale(0.2)",
          transition: "all 500ms 260ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />

      {/* ── Layer 6: Flamingos ── */}
      <Flamingo
        color={TROPIC.flamingo}
        accentColor={TROPIC.flamingoPale}
        className="absolute pointer-events-none"
        style={{
          width: 44,
          height: 74,
          bottom: 2,
          right: 55,
          opacity: hovered ? 0.9 : 0,
          transform: hovered ? "scale(1)" : "scale(0.2) translateY(20px)",
          transition: "all 400ms 180ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "flamingo-bob 2.5s ease-in-out infinite" : "none",
          "--flamingo-rot": "-3deg",
        }}
      />
      <Flamingo
        color={TROPIC.flamingoPale}
        accentColor={TROPIC.flamingo}
        className="absolute pointer-events-none"
        style={{
          width: 30,
          height: 50,
          bottom: 10,
          right: 88,
          opacity: hovered ? 0.6 : 0,
          transform: hovered ? "scale(1) scaleX(-1)" : "scale(0.2) scaleX(-1) translateY(20px)",
          transition: "all 500ms 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: hovered ? "flamingo-bob 3s 0.4s ease-in-out infinite" : "none",
          "--flamingo-rot": "2deg",
        }}
      />

      {/* ── Layer 7: Streamers — top half, vibrant ── */}
      {hovered && (
        <div key={`s-${burstKey}`} className="absolute inset-0 pointer-events-none z-10" style={{ clipPath: "inset(0 0 40% 0)" }}>
          <Streamer color={TROPIC.coral} d="M-20 30 C40 10, 80 60, 140 25 C200 -10, 240 50, 320 30" delay={0} duration={1200} style={{ opacity: 0.55 }} />
          <Streamer color={TROPIC.gold} d="M-10 80 C50 100, 100 40, 160 70 C220 100, 260 30, 330 60" delay={80} duration={1400} style={{ opacity: 0.5 }} />
          <Streamer color={TROPIC.flamingo} d="M-30 110 C30 90, 90 130, 150 100 C210 70, 250 120, 320 90" delay={40} duration={1300} style={{ opacity: 0.55 }} />
          <Streamer color={TROPIC.cream} d="M-10 55 C70 35, 120 80, 200 50 C260 25, 280 70, 330 45" delay={60} duration={1100} style={{ opacity: 0.45 }} />
          <Streamer color={TROPIC.emerald} d="M-20 10 C60 30, 100 -5, 180 20 C240 40, 280 5, 330 25" delay={30} duration={1000} style={{ opacity: 0.4 }} />
        </div>
      )}

      {/* ── Layer 8: Confetti burst ── */}
      {hovered && (
        <div key={burstKey} className="absolute inset-0 pointer-events-none z-20">
          {CONFETTI_PIECES.map((piece, i) => (
            <Confetti key={i} {...piece} />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="relative z-30">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-4 md:mb-6"
          style={{
            backgroundColor: hovered ? `${TROPIC.cream}30` : "#fafafa",
            color: hovered ? TROPIC.cream : "#18181b",
            transition: "all 150ms",
          }}
        >
          <ProfileIcon hovered={hovered} />
        </div>

        <h3
          className="text-lg md:text-lg mb-3 md:mb-2"
          style={{
            color: hovered ? TROPIC.cream : "#18181b",
            fontStyle: hovered ? "italic" : "normal",
            fontWeight: hovered ? 800 : 700,
            transition: "color 150ms, font-weight 150ms",
          }}
        >
          {pillar.title}
        </h3>
        <p
          className="text-base md:text-sm leading-relaxed"
          style={{
            color: hovered ? `${TROPIC.cream}cc` : "#71717a",
            transition: "color 200ms",
          }}
        >
          {pillar.description}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PRECISION (kept mostly as-is, just new icon)
// ═══════════════════════════════════════════════════════════

function PrecisionCard({ pillar }) {
  const { ref, active: hovered, onMouseEnter, onMouseLeave } = useCardActive(1500);

  return (
    <div
      ref={ref}
      className="relative p-7 md:p-8 border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-zinc-400 hover:shadow-lg min-h-[280px] md:min-h-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: hovered ? 0.06 : 0,
          backgroundImage:
            "linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Measurement marks */}
      <div
        className="absolute top-0 left-6 right-6 flex justify-between pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovered ? 0.15 : 0 }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-px h-2 bg-zinc-900" />
        ))}
      </div>
      <div
        className="absolute bottom-0 left-6 right-6 flex justify-between pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovered ? 0.15 : 0 }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-px h-2 bg-zinc-900" />
        ))}
      </div>

      <div className="relative z-10">
        {/* Icon: alignment brackets that tighten */}
        <div
          className="w-10 h-10 md:w-12 md:h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-4 md:mb-6 text-zinc-900 transition-all duration-500"
          style={{
            borderRadius: hovered ? "8px" : "50%",
            border: hovered ? "1px solid #e4e4e7" : "1px solid transparent",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6">
            {/* Center dot */}
            <circle cx="12" cy="12" r="1.5" fill="currentColor"
              className="transition-all duration-300"
              style={{ transform: hovered ? "scale(0.8)" : "scale(1)", transformOrigin: "12px 12px" }}
            />
            {/* Brackets that tighten */}
            {[
              { d: "M4 8 L4 4 L8 4", tx: 1.5, ty: 1.5 },
              { d: "M16 4 L20 4 L20 8", tx: -1.5, ty: 1.5 },
              { d: "M4 16 L4 20 L8 20", tx: 1.5, ty: -1.5 },
              { d: "M16 20 L20 20 L20 16", tx: -1.5, ty: -1.5 },
            ].map(({ d, tx, ty }, i) => (
              <path key={i} d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-all duration-500"
                style={{
                  transform: hovered ? `translate(${tx}px, ${ty}px)` : "translate(0, 0)",
                  opacity: hovered ? 1 : 0.4,
                }}
              />
            ))}
            {/* Crosshair lines */}
            {[
              { x1: 12, y1: 6, x2: 12, y2: 10 },
              { x1: 12, y1: 14, x2: 12, y2: 18 },
              { x1: 6, y1: 12, x2: 10, y2: 12 },
              { x1: 14, y1: 12, x2: 18, y2: 12 },
            ].map((line, i) => (
              <line key={i} {...line} stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"
                className="transition-all duration-300"
                style={{ opacity: hovered ? 1 : 0, transitionDelay: "150ms" }}
              />
            ))}
          </svg>
        </div>

        <h3 className="font-bold text-lg md:text-lg mb-3 md:mb-2">{pillar.title}</h3>
        <p className="text-base md:text-sm text-zinc-500 leading-relaxed">{pillar.description}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

const CARD_MAP = {
  Velocity: VelocityCard,
  Personality: PersonalityCard,
  Precision: PrecisionCard,
};

export default function PillarCards({ pillars }) {
  return (
    <div className="grid md:grid-cols-3 gap-8 md:gap-8">
      {pillars.map((pillar) => {
        const Card = CARD_MAP[pillar.title];
        return Card ? <Card key={pillar.title} pillar={pillar} /> : null;
      })}
    </div>
  );
}
