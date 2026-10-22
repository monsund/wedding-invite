import { useEffect, useId, useState } from "react";
import { CONFIG as C } from "./config.js";

const enc = encodeURIComponent;
const names = `${C.partner1} & ${C.partner2}`;

// Each event is an all-day entry; dates come from config as YYYY-MM-DD
const toDate = (iso) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const fmt = (d, opts) => d.toLocaleDateString("en-GB", opts);
const ymd = (d) => fmt(d, { year: "numeric" }) + String(d.getMonth() + 1).padStart(2, "0") +
  String(d.getDate()).padStart(2, "0");

const EVENTS = C.events.map((e) => {
  const date = toDate(e.date);
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const where = e.address || e.place;
  return {
    ...e,
    date,
    mapUrl: e.mapLink || "https://www.google.com/maps/search/?api=1&query=" + enc(where),
    calUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${enc(names + "’s wedding, " + e.place)}&dates=${ymd(date)}/${ymd(next)}` +
      `&location=${enc(where)}` +
      `&details=${enc("Invitation to " + names + "’s wedding at the " + e.host.toLowerCase() + ".")}`,
  };
});

function Sprig() {
  return (
    <svg className="sprig" viewBox="0 0 92 120" fill="none" aria-hidden="true">
      <path d="M46 118V42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <g fill="currentColor" opacity=".85">
        <ellipse cx="34" cy="96" rx="12" ry="5" transform="rotate(-35 34 96)" />
        <ellipse cx="58" cy="84" rx="12" ry="5" transform="rotate(35 58 84)" />
        <ellipse cx="33" cy="72" rx="11" ry="4.5" transform="rotate(-35 33 72)" />
        <ellipse cx="59" cy="60" rx="11" ry="4.5" transform="rotate(35 59 60)" />
      </g>
      <g className="bloom" fill="currentColor" opacity=".9">
        <circle cx="46" cy="14" r="8" /><circle cx="58" cy="23" r="8" /><circle cx="53" cy="37" r="8" />
        <circle cx="39" cy="37" r="8" /><circle cx="34" cy="23" r="8" />
      </g>
      <circle cx="46" cy="26" r="5" fill="var(--paper)" />
    </svg>
  );
}

/* ---------- Cover: gatefold doors tied with a ribbon ---------- */
const SKIN = "#C68A64";
const HAIR = "#2E1F26";
const WINE = "#8A4051";
const GOLD = "#C29A55";
// Dimasa wedding attire
const WHITE = "#FBF8F2";
const LINEN = "#DCD2C0";
const RED = "#C24545";
const YELLOW = "#E6B84A";
const GREEN = "#7E9F4E";
const ORANGE = "#DD8440";
const DARK = "#3A2630";
const VEIL = "#D24E4E";

function Flower({ x, y, r = 8, c = "var(--rose)" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} r={r * 0.55} fill={c}
          cx={Math.sin((a * Math.PI) / 180) * r * 0.55}
          cy={-Math.cos((a * Math.PI) / 180) * r * 0.55} />
      ))}
      <circle r={r * 0.3} fill={GOLD} />
    </g>
  );
}

function Bloom({ x, y, r = 9 }) {
  return (
    <g>
      <ellipse cx={x - r * 1.1} cy={y + r * 0.5} rx={r * 0.9} ry={r * 0.38}
        fill="var(--sage)" transform={`rotate(-30 ${x - r * 1.1} ${y + r * 0.5})`} />
      <ellipse cx={x + r * 1.1} cy={y + r * 0.5} rx={r * 0.9} ry={r * 0.38}
        fill="var(--sage)" transform={`rotate(30 ${x + r * 1.1} ${y + r * 0.5})`} />
      <Flower x={x - r * 0.9} y={y + r * 0.2} r={r * 0.62} c="#E3A9AE" />
      <Flower x={x + r * 0.9} y={y + r * 0.2} r={r * 0.62} c="#E3A9AE" />
      <Flower x={x} y={y} r={r} />
    </g>
  );
}

// Marigold string hanging from the arch
function Toran({ x, y, n }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y + n * 8}`} stroke={GOLD} strokeWidth=".8" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x} cy={y + 6 + i * 8} r="3.2" fill={i % 2 ? "#E0A64F" : "#D98C3F"} />
      ))}
      <Flower x={x} y={y + n * 8 + 6} r={5} />
    </g>
  );
}

// Bride and groom in Dimasa wedding attire; `children` is the arm that changes per scene
// Skirt bands from waist to hem: [top, height, colour]
const SKIRT_BANDS = [
  [236, 14, RED], [250, 10, YELLOW], [260, 26, GREEN], [272, 1.5, YELLOW], [286, 4, DARK],
  [290, 12, RED], [302, 8, ORANGE], [310, 22, GREEN], [320, 1.5, YELLOW], [332, 4, DARK],
  [336, 10, YELLOW], [346, 6, RED], [352, 36, YELLOW], [388, 20, DARK],
];
const WRAP_BANDS = [[194, 10, RED], [204, 3, YELLOW], [207, 9, GREEN], [216, 3, YELLOW], [219, 19, RED]];

function Bride({ children }) {
  const id = useId().replace(/:/g, "");
  const skirt = "M102 236c-6 60-14 116-26 164q52 12 104 0c-12-48-20-104-26-164z";
  const torso = "M108 176c6-6 34-6 42 0l6 62h-54z";
  const bands = (list, x, w) => list.map(([y, h, c]) => <rect key={y} x={x} y={y} width={w} height={h} fill={c} />);
  return (
    <g transform="translate(-14 0)">
      <defs>
        <clipPath id={id + "s"}><path d={skirt} /></clipPath>
        <clipPath id={id + "t"}><path d={torso} /></clipPath>
      </defs>
      <path d="M112 122C88 130 80 170 78 220c-4 70-12 130-26 184h32c8-74 14-144 20-204z" fill={VEIL} opacity=".5" />
      <g clipPath={`url(#${id}s)`}>{bands(SKIRT_BANDS, 60, 140)}</g>
      <path d="M80 388q50 9 98 0" stroke={GOLD} strokeWidth="1.2" />
      <path d={torso} fill={YELLOW} />
      <g clipPath={`url(#${id}t)`}>{bands(WRAP_BANDS, 100, 60)}</g>
      <path d="M108 182c-10 23-14 43-12 66" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
      <path d="M108 182c-4 9-7 17-9 25" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      <path d="M96 236v6" stroke={GOLD} strokeWidth="10" />
      <circle cx="96" cy="252" r="5" fill={SKIN} />
      {children}
      <path d="M150 182l4 14" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      <rect x="122" y="154" width="12" height="22" fill={SKIN} />
      <path d="M116 174q12 14 24 0M114 176q14 22 28 0" stroke={GOLD} strokeWidth="2.4" />
      <circle cx="128" cy="194" r="3" fill={GOLD} />
      <circle cx="128" cy="140" r="19" fill={SKIN} />
      <path d="M109 145c-4-25 19-35 38-15-11-6-27-4-35 18z" fill={HAIR} />
      <circle cx="106" cy="146" r="10" fill={HAIR} />
      <path d="M104 150c-4-30 16-42 36-36 10 4 14 12 12 18-12-12-32-12-40 8-2 20-6 35-4 50z" fill={VEIL} opacity=".55" />
      <path d="M152 132c-12-12-32-12-40 8" stroke={GOLD} strokeWidth="1.5" />
      <path d="M138 120l2 8" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="140" cy="129" r="2.4" fill={GOLD} />
      <circle cx="121" cy="156" r="2" fill={GOLD} />
    </g>
  );
}

// A sleeve drawn as an outline stroke under a white stroke, so it reads against the white shirt
function Sleeve({ d }) {
  return (
    <>
      <path d={d} stroke={LINEN} strokeWidth="14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={WHITE} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// One side of the groom's stole: red with yellow edges and an orange centre stripe
function StoleSide({ x1, x2, x3, x4 }) {
  const top = 170, bottom = 320;
  return (
    <g>
      <path d={`M${x1} ${top}L${x2} ${top}L${x4} ${bottom}L${x3} ${bottom}z`} fill={RED} />
      <path d={`M${x1 + 1.5} ${top}L${x3 + 1.5} ${bottom}M${x2 - 1.5} ${top}L${x4 - 1.5} ${bottom}`}
        stroke={YELLOW} strokeWidth="1.6" />
      <path d={`M${(x1 + x2) / 2} ${top}L${(x3 + x4) / 2} ${bottom}`} stroke={ORANGE} strokeWidth="2" />
      <path d={`M${x3 + 2} ${bottom}v5M${x3 + 6} ${bottom}v6M${x4 - 6} ${bottom}v6M${x4 - 2} ${bottom}v5`}
        stroke={RED} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function Groom({ children }) {
  return (
    <g transform="translate(14 0)">
      <rect x="250" y="326" width="17" height="72" rx="6" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      <rect x="277" y="326" width="17" height="72" rx="6" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      <ellipse cx="256" cy="400" rx="11" ry="5" fill={WHITE} stroke={LINEN} />
      <ellipse cx="288" cy="400" rx="11" ry="5" fill={WHITE} stroke={LINEN} />
      <path d="M248 172c8-6 40-6 48 0l12 166q-36 8-72 0z" fill={WHITE} stroke={LINEN} />
      <path d="M272 178v150" stroke={LINEN} />
      <path d="M254 170q18-10 36 0" stroke={RED} strokeWidth="6" />
      <StoleSide x1={252} x2={265} x3={247} x4={260} />
      <StoleSide x1={279} x2={292} x3={284} x4={297} />
      <Sleeve d="M294 178c8 27 12 52 10 84" />
      <circle cx="304" cy="268" r="5.5" fill={SKIN} />
      {children}
      <rect x="266" y="152" width="12" height="18" fill={SKIN} />
      <path d="M261 166h22l-2 8h-18z" fill={WHITE} stroke={LINEN} />
      <circle cx="272" cy="138" r="19" fill={SKIN} />
      <path d="M256 146c4 16 28 16 32 0-4 8-28 8-32 0z" fill={HAIR} />
      <path d="M249 138c-4-34 50-38 47 0-9-9-38-9-47 0z" fill={WHITE} stroke={LINEN} />
      <path d="M252 128c12-12 32-12 42-2M256 118c10-8 26-8 34 0" stroke={LINEN} strokeWidth="1.2" />
    </g>
  );
}

function Couple() {
  return (
    <svg className="couple" viewBox="0 0 400 430" fill="none">
      {/* Floral arch */}
      <path d="M30 430V175a170 170 0 0 1 340 0v255" stroke="var(--sage)" strokeWidth="2.5" />
      <path d="M42 430V175a158 158 0 0 1 316 0v255" stroke={GOLD} strokeWidth=".8" strokeDasharray="2 5" />
      <Toran x={78} y={68} n={6} />
      <Toran x={128} y={30} n={4} />
      <Toran x={272} y={30} n={4} />
      <Toran x={322} y={68} n={6} />
      {[[30, 175], [370, 175], [53, 90], [347, 90], [115, 28], [285, 28], [30, 285], [370, 285]].map(([x, y]) => (
        <Bloom key={x + "-" + y} x={x} y={y} />
      ))}
      <Bloom x={200} y={6} r={12} />

      {/* Ground */}
      <ellipse cx="200" cy="404" rx="150" ry="9" fill="var(--rose-soft)" />
      <ellipse cx="120" cy="410" rx="5" ry="2" fill="#E3A9AE" transform="rotate(20 120 410)" />
      <ellipse cx="236" cy="412" rx="5" ry="2" fill="#E3A9AE" transform="rotate(-25 236 412)" />
      <ellipse cx="318" cy="408" rx="4" ry="1.8" fill="var(--rose)" transform="rotate(10 318 408)" />

      <Bride>
        <path d="M150 182c6 18 8 34 7 50" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
        <path d="M157 220v6" stroke={GOLD} strokeWidth="10" />
        <path d="M157 217v2" stroke="var(--rose)" strokeWidth="10" />
      </Bride>

      <Groom>
        <Sleeve d="M250 180c-5 18-7 32-7 46" />
      </Groom>
      <Ribbon />
      <circle cx="143" cy="236" r="6" fill={SKIN} />
      <circle cx="257" cy="236" r="6" fill={SKIN} />
    </svg>
  );
}

// Ribbon held by the bride (left) and groom (right), tied in a bow between them
function Ribbon() {
  const half = (cls, x) => (
    <g className={"rb " + cls}>
      <rect x={x} y="230" width="57" height="12" fill="var(--ribbon)" />
      <rect x={x} y="234" width="57" height="2.5" fill="var(--ribbon-light)" />
    </g>
  );
  return (
    <g>
      <path d="M139 240c-3 18-7 38-14 58l7-2 3 7c6-20 10-42 11-61z" fill="var(--ribbon-dark)"
        stroke="var(--ribbon-light)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M261 240c3 18 7 38 14 58l-7-2-3 7c-6-20-10-42-11-61z" fill="var(--ribbon-dark)"
        stroke="var(--ribbon-light)" strokeWidth="1.2" strokeLinejoin="round" />
      {half("rb-l", 143)}
      {half("rb-r", 200)}
      <g transform="translate(200 236) scale(.64) translate(-60 -40)">
        <g className="knot">
          <path d="M55 44c-6 14-15 26-25 38l8-3 5 7c8-14 14-28 18-41z" fill="var(--ribbon)" />
          <path d="M65 44c6 14 15 26 25 38l-8-3-5 7c-8-14-14-28-18-41z" fill="var(--ribbon)" />
          <path d="M60 40C44 18 14 6 8 26c-5 18 22 26 52 14z" fill="var(--ribbon)" />
          <path d="M60 40c16-22 46-34 52-14 5 18-22 26-52 14z" fill="var(--ribbon)" />
          <path d="M60 40c-14-10-34-16-40-10 8 4 24 8 40 10zM60 40c14-10 34-16 40-10-8 4-24 8-40 10z"
            fill="var(--ribbon-dark)" opacity=".55" />
          <path d="M56 36C42 20 20 12 14 24M64 36c14-16 36-24 42-12" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" fill="none" />
          <rect x="51" y="30" width="18" height="21" rx="6" fill="var(--ribbon-dark)" />
          <rect x="55" y="33" width="4" height="14" rx="2" fill="#fff" opacity=".18" />
        </g>
      </g>
    </g>
  );
}

// Couple's initials in gold inside a laurel wreath, sitting above the arch on the cover
const LAUREL = [110, 125, 140, 155, 170, 185, 200, 215];

function Monogram() {
  const leaf = (a, i) => {
    const r = i % 2 ? 49 : 55;
    const x = r * Math.cos((a * Math.PI) / 180), y = r * Math.sin((a * Math.PI) / 180);
    return <ellipse key={a} cx={x} cy={y} rx="5.5" ry="2.2" transform={`rotate(${a + 90 + (i % 2 ? -25 : 25)} ${x} ${y})`} />;
  };
  return (
    <div className="mono">
      <svg viewBox="-60 -60 120 120" fill="none">
        <circle r="44" stroke={GOLD} strokeWidth=".7" />
        <circle r="40.5" stroke={GOLD} strokeWidth=".6" strokeDasharray="1 3" />
        <path d="M-36 30a52 52 0 0 1-8-68M36 30a52 52 0 0 0 8-68" stroke={GOLD} strokeWidth=".8" />
        <g fill={GOLD} fillOpacity=".75">
          {LAUREL.map(leaf)}
          {LAUREL.map((a, i) => leaf(180 - a, i))}
        </g>
        <path d="M-5 56c2-3 4-4 5-4s3 1 5 4M0 52l-4 8M0 52l4 8" stroke={GOLD} strokeWidth=".9" strokeLinecap="round" />
        <circle cy="52" r="2.4" fill={GOLD} />
        <Flower x={0} y={-52} r={7} />
      </svg>
      <p><span>{C.partner1[0]}</span><i>&amp;</i><span>{C.partner2[0]}</span></p>
    </div>
  );
}

function CoverArt() {
  return (
    <div className="cover" aria-hidden="true">
      <div className="cover-bg"><span className="shine" /></div>
      <div className="hero-frame" />
      <Corner at="tl" /><Corner at="tr" /><Corner at="bl" /><Corner at="br" />
      <Monogram />
      <Couple />
    </div>
  );
}

function Cover({ onDone }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      setGone(true);
      onDone();
      window.scrollTo(0, 0);
      document.getElementById("screen")?.scrollTo(0, 0);
    }, reduce ? 50 : 2100);
    return () => clearTimeout(t);
  }, [open, onDone]);

  return (
    <div id="intro" className={[open && "open", gone && "gone"].filter(Boolean).join(" ")}
      role="dialog" aria-label="Wedding invitation">
      <div className="door left"><CoverArt /></div>
      <div className="door right"><CoverArt /></div>
      <button className="untie" disabled={open} onClick={() => setOpen(true)}
        aria-label={`Untie the ribbon to open ${names}’s wedding invitation`} />
      <p className="tap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a5 5 0 0 1-3.9-1.9L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
        </svg>
        Tap to untie ribbon
      </p>
    </div>
  );
}

/* ---------- Sections ---------- */
// Marigold beads along a quadratic curve from p0 to p2 (control point p1)
const beadsAlong = ([x0, y0], [x1, y1], [x2, y2], n) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), u = 1 - t;
    return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2];
  });
const MARIGOLD = ["#D98C3F", "#E0A64F", "#E8B85A"];

function Garland() {
  const swag = [
    ...beadsAlong([32, 32], [116, 96], [200, 26], 21),
    ...beadsAlong([200, 26], [284, 96], [368, 32], 21).slice(1),
  ];
  const strand = (x, y) => (
    <g className="str">
      <path d={`M${x} ${y}v62`} stroke={GOLD} strokeWidth=".8" />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={x} cy={y + 8 + i * 8} r="3.6" fill={MARIGOLD[i % 3]} />
      ))}
      <path d={`M${x - 5} ${y + 74}q0-9 5-9t5 9z`} fill={GOLD} />
      <circle cx={x} cy={y + 76} r="1.6" fill={GOLD} />
    </g>
  );
  return (
    <svg className="garland" viewBox="0 0 400 150">
      <path d="M32 32Q116 96 200 26Q284 96 368 32" fill="none" stroke={GOLD} strokeWidth=".8" />
      {swag.map(([x, y], i) =>
        i % 5 === 2 ? (
          <ellipse key={i} cx={x} cy={y + 4} rx="5" ry="2.2" fill="var(--sage)" />
        ) : (
          <circle key={i} cx={x} cy={y} r="4.4" fill={MARIGOLD[i % 3]} />
        )
      )}
      {strand(116, 62)}
      {strand(284, 62)}
      <Flower x={200} y={26} r={9} />
    </svg>
  );
}

// [left %, top %, size px, delay seconds]
const SPARKLES = [
  [10, 30, 14, 0], [88, 26, 18, -1.2], [16, 52, 10, -2.1], [84, 48, 13, -.6],
  [9, 74, 16, -1.7], [90, 70, 11, -2.6], [24, 22, 9, -.9], [76, 86, 12, -1.4],
];

function Sparkles() {
  return SPARKLES.map(([x, y, size, delay]) => (
    <svg key={x + "-" + y} className="sparkle" viewBox="-10 -10 20 20"
      style={{ "--x": x + "%", "--y": y + "%", "--s": size + "px", "--delay": delay + "s" }}>
      <path d="M0-10C1-2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10z" fill="currentColor" />
    </svg>
  ));
}

function Corner({ at }) {
  return (
    <svg className={"corner " + at} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.1"
      strokeLinecap="round">
      <path d="M10 74V28Q10 10 28 10h46" />
      <path d="M74 10c9 0 12 8 6 11-4 2-8-2-5-5M10 74c0 9 8 12 11 6 2-4-2-8-5-5" />
      <path d="M30 30c10-2 20 2 24 10 2 5-2 9-6 7M30 30c-2 10 2 20 10 24 5 2 9-2 7-6" />
      <g fill="currentColor" fillOpacity=".4">
        <path d="M38 19c6-6 14-6 19 0-5 5-13 5-19 0zM19 38c-6 6-6 14 0 19 5-5 5-13 0-19z" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="62" cy="19" r="1.5" /><circle cx="68" cy="19" r="1" />
        <circle cx="19" cy="62" r="1.5" /><circle cx="19" cy="68" r="1" />
      </g>
      <g stroke="none"><Flower x={27} y={27} r={8} /></g>
    </svg>
  );
}

function Lotus() {
  const side = (d) => <><path d={d} /><path d={d} transform="scale(-1 1)" /></>;
  return (
    <svg className="lotus" viewBox="-100 -100 200 150" fill="var(--gold)" fillOpacity=".06"
      stroke="currentColor" strokeWidth=".9" strokeLinecap="round">
      {side("M0 20C-40 14-76-6-84-26c28 2 60 16 84 46z")}
      {side("M0 20C-30 0-46-30-40-52c20 12 32 36 40 72z")}
      <path d="M0 20C-18-10-12-50 0-70c12 20 18 60 0 90z" />
      <path d="M0 14V-56M-6 12C-20-6-28-26-30-42M6 12c14-18 22-38 24-54" fill="none" strokeOpacity=".6" />
      <path d="M-70 32h140M-46 41h92" fill="none" strokeDasharray="2 5" />
      {[-60, -40, -20, 0, 20, 40, 60].map((a) => (
        <circle key={a} r="1.6" cy="-84" fill="currentColor" fillOpacity="1" stroke="none" transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}

// [left %, size px, fall seconds, delay seconds]
const PETALS = [
  [8, 20, 18, -2], [22, 15, 22, -9], [38, 18, 16, -5], [55, 14, 24, -14], [70, 19, 19, -3],
  [84, 16, 21, -11], [93, 21, 17, -7], [15, 13, 26, -18], [62, 17, 20, -16], [46, 15, 23, -20],
  [30, 12, 25, -12], [77, 13, 27, -22],
];

function Petals() {
  return PETALS.map(([x, size, d, delay]) => (
    <span key={x} className="petal"
      style={{ "--x": x + "%", "--s": size + "px", "--d": d + "s", "--delay": delay + "s" }}>
      <svg viewBox="0 0 20 20"><path d="M10 1c6 4 8 11 0 18C2 12 4 5 10 1z" /></svg>
    </span>
  ));
}

function Cloud({ className }) {
  return (
    <svg className={"cloud " + className} viewBox="0 0 120 40" fill="var(--bg)" fillOpacity=".7"
      stroke="currentColor" strokeWidth="1">
      <path d="M10 32h96c8 0 10-12 0-13-2-10-16-12-22-4-4-10-22-12-28 0-10-4-20 2-18 9-10 0-14 8-8 8z" />
    </svg>
  );
}

function Hills() {
  const pin = (x, y) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0c-5-6-8-10-8-14a8 8 0 0 1 16 0c0 4-3 8-8 14z" fill="var(--rose)" />
      <circle cy="-14" r="3" fill="var(--bg)" />
    </g>
  );
  return (
    <>
      <Cloud className="c1" />
      <Cloud className="c2" />
      <svg className="hills" viewBox="0 0 400 200" stroke="currentColor" strokeWidth=".9">
        <path d="M0 100C40 60 80 50 120 70s80-30 120-10 90-30 160 10v130H0z" fill="var(--gold)" fillOpacity=".08" />
        <path d="M0 140c50-30 100-40 150-20s100-30 150-5 70-15 100 5v80H0z" fill="var(--rose-soft)" fillOpacity=".45" />
        <path d="M0 175c60-20 120-25 180-10s120-15 220 5v30H0z" fill="var(--sage)" fillOpacity=".16" />
        <path d="M215 200c-20-15 25-28 5-45s-40-20-20-40" fill="none" strokeDasharray="3 4" />
        <g fill="var(--sage)" fillOpacity=".55" stroke="none">
          {[[58, 128], [68, 125], [250, 118], [262, 120], [338, 132]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y}l5-13 5 13z`} />
          ))}
        </g>
        {pin(120, 64)}
        {pin(318, 92)}
      </svg>
    </>
  );
}

// [left %, size px, rise seconds, delay seconds]
const LANTERNS = [
  [12, 20, 22, -3], [28, 14, 26, -14], [46, 24, 20, -9], [64, 16, 24, -1],
  [80, 22, 21, -16], [90, 13, 27, -7], [20, 12, 28, -21], [56, 12, 25, -19],
];

function Lanterns() {
  return LANTERNS.map(([x, size, d, delay]) => (
    <span key={x} className="lantern"
      style={{ "--x": x + "%", "--s": size + "px", "--d": d + "s", "--delay": delay + "s" }}>
      <svg viewBox="0 0 20 28">
        <path d="M3 4q7-6 14 0l-2 18H5z" fill="#E9B85A" />
        <path d="M6 5q4-3 8 0l-1 14H7z" fill="#F6DFA0" />
        <path d="M5 22h10" stroke="#C29A55" strokeWidth="1.2" />
        <ellipse cx="10" cy="24.5" rx="1.6" ry="2.4" fill="#E07B39" />
      </svg>
    </span>
  ));
}

const MOTIFS = {
  garland: () => <><Garland /><Sparkles /></>, lotus: () => <><Lotus /><Petals /></>, hills: Hills,
  lanterns: Lanterns,
};

function PageBg({ motif }) {
  const Motif = MOTIFS[motif];
  return (
    <div className="page-bg" aria-hidden="true">
      <Motif />
      <div className="hero-frame" />
      <Corner at="tl" /><Corner at="tr" /><Corner at="bl" /><Corner at="br" />
    </div>
  );
}

function Hero() {
  return (
    <section className="page hero" id="top">
      <PageBg motif="garland" />
      <Sprig />
      <p className="lead">We’re getting married</p>
      <h1>
        {C.partner1}
        <span className="amp">and</span>
        {C.partner2}
      </h1>
      <div className="save">
        <p className="save-title">Save the date</p>
        <p className="save-month">{fmt(EVENTS[0].date, { month: "long", year: "numeric" })}</p>
        <ul className="save-days">
          {EVENTS.map((e) => (
            <li key={e.place}>
              <span className="save-wd">{fmt(e.date, { weekday: "long" })}</span>
              <strong>{fmt(e.date, { day: "numeric" })}</strong>
              <span className="save-place">{e.place}</span>
              <span className="save-host">{e.host}</span>
              <a className="cal-btn" href={e.calUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                  <path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                </svg>
                Add to calendar
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="hint">Scroll for the details</p>
    </section>
  );
}

const UNITS = [["Days", 86400], ["Hours", 3600], ["Minutes", 60], ["Seconds", 1]];

function Countdown() {
  const target = new Date(C.countdownTo).getTime();
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  let left = Math.max(0, Math.floor((target - now) / 1000));
  if (!left) return <p className="countdown-done">The celebrations have begun</p>;

  return (
    <div className="countdown" role="timer">
      <p className="countdown-title">Counting down to {fmt(EVENTS[0].date, { day: "numeric", month: "long" })}</p>
      <div className="countdown-row">
        {UNITS.map(([label, secs], i) => {
          const n = Math.floor(left / secs);
          left -= n * secs;
          return (
            <div key={label}>
              <strong>{i ? String(n).padStart(2, "0") : n}</strong>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <DreamingCouple />
    </div>
  );
}

// Little scenes the couple daydreams about, shown one at a time in the thought bubble
function Note({ x, y, cls }) {
  return (
    <g className={"n " + cls}>
      <path d={`M${x + 2.4} ${y}v-11l6 2`} stroke={WINE} strokeWidth="1.4" fill="none" />
      <ellipse cx={x} cy={y} rx="2.8" ry="2.2" fill="var(--rose)" transform={`rotate(-20 ${x} ${y})`} />
    </g>
  );
}

function Heart({ x, y, cls }) {
  return (
    <path className={"n " + cls} fill="var(--rose)"
      d={`M${x} ${y + 3}s-4-2.6-4-5.2a2.2 2.2 0 0 1 4-1.2 2.2 2.2 0 0 1 4 1.2c0 2.6-4 5.2-4 5.2z`} />
  );
}

// Arm end points relative to each shoulder: [[left dx, dy], [right dx, dy]]
const ARMS = {
  down: [[-2, 11], [2, 11]], up: [[-5, -11], [5, -11]], out: [[-7, 3], [7, 3]],
  wave: [[-5, -11], [2, 11]], mic: [[-2, 11], [-1, -5]],
};

// A tiny standing figure, feet at (x, y). kind: bride | groom | woman | man
function Mini({ x, y = 88, kind, top, skirt, arms = "down", cls = "" }) {
  const female = kind === "bride" || kind === "woman";
  const [[lx, ly], [rx, ry]] = typeof arms === "string" ? ARMS[arms] : arms;
  const sh = y - 23;
  return (
    <g className={"mini " + cls}>
      {kind === "bride" && <path d={`M${x - 2} ${y - 34}c-6 2-8 12-8 24h4c0-9 1-16 5-20z`} fill={VEIL} opacity=".55" />}
      {female ? (
        <>
          <path d={`M${x - 4} ${y - 16}h8l3.5 16h-15z`} fill={kind === "bride" ? GREEN : skirt} />
          {kind === "bride" && (
            <path d={`M${x - 5} ${y - 12}h10M${x - 6} ${y - 7}h12M${x - 7} ${y - 2}h14`} stroke={YELLOW} strokeWidth="1.6" />
          )}
          <rect x={x - 4} y={y - 24} width="8" height="8" rx="1.5" fill={kind === "bride" ? YELLOW : top} />
          {kind === "bride" && <path d={`M${x - 4} ${y - 19}h8`} stroke={RED} strokeWidth="2" />}
        </>
      ) : (
        <>
          <path d={`M${x - 2} ${y - 9}v9M${x + 2} ${y - 9}v9`} stroke={kind === "groom" ? WHITE : "#EFE6D6"}
            strokeWidth="2.8" strokeLinecap="round" />
          <rect x={x - 4} y={y - 24} width="8" height="16" rx="1.5" fill={kind === "groom" ? WHITE : top}
            stroke={kind === "groom" ? LINEN : "none"} strokeWidth=".5" />
          {kind === "groom" && <path d={`M${x - 2} ${y - 24}v12M${x + 2} ${y - 24}v12`} stroke={RED} strokeWidth="1.4" />}
        </>
      )}
      <path d={`M${x - 4} ${sh}l${lx} ${ly}M${x + 4} ${sh}l${rx} ${ry}`} stroke={SKIN} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={x} cy={y - 29} r="4.5" fill={SKIN} />
      {female && <circle cx={x - 4} cy={y - 30} r="2.2" fill={HAIR} />}
      {kind === "groom" ? (
        <path d={`M${x - 5.5} ${y - 30}a5.5 5.5 0 0 1 11 0c-2-3-9-3-11 0z`} fill={WHITE} stroke={LINEN} strokeWidth=".5" />
      ) : (
        <path d={`M${x - 4.6} ${y - 29}a4.6 4.6 0 0 1 9.2 0c-2-3-7-3-9.2 0z`} fill={kind === "bride" ? VEIL : HAIR}
          opacity={kind === "bride" ? 0.75 : 1} />
      )}
    </g>
  );
}

// A laughing face and shoulders, for the laughter scene
function Bust({ x, kind, top, cls }) {
  const y = 60;
  return (
    <g className={"face " + cls}>
      {kind === "bride" && <path d={`M${x - 3} ${y - 8}c-8 2-11 14-11 30h6c0-12 2-20 6-26z`} fill={VEIL} opacity=".55" />}
      <path d={`M${x - 11} 90q0-18 11-18t11 18z`} fill={top} stroke={kind === "groom" ? LINEN : "none"} strokeWidth=".6" />
      {kind === "bride" && <path d={`M${x - 10} 82h20`} stroke={RED} strokeWidth="3" />}
      {kind === "groom" && <path d={`M${x - 4} 73v17M${x + 4} 73v17`} stroke={RED} strokeWidth="2" />}
      <circle cx={x} cy={y} r="8" fill={SKIN} />
      {kind === "groom" ? (
        <path d={`M${x - 9} ${y - 1}a9 9 0 0 1 18 0c-3-4-15-4-18 0z`} fill={WHITE} stroke={LINEN} strokeWidth=".6" />
      ) : (
        <path d={`M${x - 8} ${y}a8 8 0 0 1 16 0c-3-5-13-5-16 0z`} fill={kind === "bride" ? VEIL : HAIR}
          opacity={kind === "bride" ? 0.8 : 1} />
      )}
      <path d={`M${x - 5} ${y + 1}q1.5-2.5 3 0M${x + 2} ${y + 1}q1.5-2.5 3 0`} stroke={HAIR} strokeWidth="1.1"
        strokeLinecap="round" fill="none" />
      <path d={`M${x - 3.5} ${y + 3.5}q3.5 5 7 0z`} fill={WINE} />
    </g>
  );
}

const Steam = ({ xs }) => (
  <g className="steam" stroke={GOLD} strokeWidth="1" strokeLinecap="round" fill="none">
    {xs.map((x, i) => <path key={x} className={"s" + (i + 1)} d={`M${x} 58q-2-4 0-8t0-8`} />)}
  </g>
);

const Bowl = ({ x, y, fill }) => (
  <>
    <path d={`M${x - 10} ${y}a10 7 0 0 0 20 0z`} fill={WHITE} stroke={LINEN} strokeWidth=".8" />
    <ellipse cx={x} cy={y} rx="10" ry="2.4" fill={fill} />
  </>
);

const DREAMS = [
  ["The wedding", (
    <g>
      <path d="M170 88V60a30 26 0 0 1 60 0v28" stroke="var(--sage)" strokeWidth="1.6" />
      <Flower x={200} y={34} r={5} /><Flower x={178} y={44} r={3.5} /><Flower x={222} y={44} r={3.5} />
      <Flower x={170} y={64} r={3} /><Flower x={230} y={64} r={3} />
      <Mini x={193} kind="bride" arms={[[-2, 11], [3, 7]]} />
      <Mini x={207} kind="groom" arms={[[-3, 7], [2, 11]]} />
      <g className="notes"><Heart x={186} y={48} cls="n1" /><Heart x={214} y={46} cls="n2" /><Heart x={200} y={42} cls="n3" /></g>
    </g>
  )],
  ["Singing", (
    <g>
      <Mini x={162} kind="woman" top={WINE} skirt={ORANGE} arms="up" cls="sing" />
      <Mini x={186} kind="bride" arms="mic" cls="sing d2" />
      <circle cx="189" cy="60" r="1.8" fill={GOLD} />
      <Mini x={212} kind="groom" arms="wave" cls="sing" />
      <Mini x={238} kind="man" top="var(--sage)" arms="up" cls="sing d2" />
      <g className="notes">
        <Note x={172} y={50} cls="n1" /><Note x={226} y={46} cls="n2" /><Note x={200} y={44} cls="n3" />
      </g>
    </g>
  )],
  ["Dancing", (
    <g>
      <Mini x={160} kind="woman" top={WINE} skirt={ORANGE} arms="up" cls="hop" />
      <Mini x={176} kind="man" top="var(--sage)" arms="out" cls="hop d2" />
      <g className="dancers">
        <Mini x={193} kind="bride" arms={[[-7, 3], [3, -12]]} />
        <Mini x={207} kind="groom" arms={[[-3, -12], [7, 3]]} />
      </g>
      <Mini x={224} kind="woman" top="var(--rose)" skirt={GREEN} arms="wave" cls="hop" />
      <Mini x={240} kind="man" top={ORANGE} arms="up" cls="hop d2" />
      <path d="M150 62q-3 5 0 10M250 60q3 5 0 10" stroke={GOLD} strokeLinecap="round" />
    </g>
  )],
  ["The feast", (
    <g>
      <Steam xs={[178, 222, 200]} />
      <rect x="150" y="86" width="100" height="5" rx="2" fill="var(--rose-soft)" />
      <path d="M150 86h100" stroke={GOLD} />
      <Bowl x={178} y={66} fill="#FFFFFF" />
      <path d="M170 66q8-8 16 0z" fill="#FFFFFF" stroke={LINEN} strokeWidth=".5" />
      <Bowl x={222} y={66} fill={ORANGE} />
      <circle cx="218" cy="65.5" r="1.8" fill="#8B4A2B" /><circle cx="224" cy="66.5" r="1.6" fill="#8B4A2B" />
      <circle cx="227" cy="65" r="1.2" fill="var(--sage)" />
      <ellipse cx="168" cy="82" rx="15" ry="4.5" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      <ellipse cx="165" cy="79.5" rx="9" ry="3.6" fill="#C98B4A" />
      <path d="M173 79.5l5-3.5v7z" fill="#C98B4A" />
      <path d="M162 78l2 3M165 77.5l2 3.5" stroke="#9C5E2E" strokeWidth=".7" />
      <circle cx="158.5" cy="78.6" r=".8" fill={DARK} />
      <circle cx="178" cy="83" r="2" fill="#A7C46A" />
      <ellipse cx="200" cy="82" rx="15" ry="4.5" fill={WHITE} stroke={LINEN} strokeWidth=".8" />
      {[[195, -20], [205, 20]].map(([x, a]) => (
        <g key={x} transform={`rotate(${a} ${x} 79)`}>
          <ellipse cx={x} cy="79" rx="5" ry="3.6" fill="#9C4E2E" />
          <path d={`M${x} 76v-6`} stroke={WHITE} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx={x - 1} cy="69.5" r="1.2" fill={WHITE} /><circle cx={x + 1} cy="69.5" r="1.2" fill={WHITE} />
        </g>
      ))}
      <Bowl x={232} y={80} fill="var(--sage)" />
      <path d="M228 79q4-4 8 0" stroke="#A7C46A" strokeWidth="1.2" />
    </g>
  )],
  ["Laughter", (
    <g>
      <Bust x={164} kind="woman" top={WINE} cls="f0" />
      <Bust x={236} kind="man" top="var(--sage)" cls="f1" />
      <Bust x={187} kind="bride" top={YELLOW} cls="f1" />
      <Bust x={213} kind="groom" top={WHITE} cls="f0" />
      <text x="146" y="42" fill="var(--rose)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">ha ha</text>
      <text x="230" y="40" fill="var(--rose)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">ha ha</text>
    </g>
  )],
];

function DreamingCouple() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % DREAMS.length), 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <svg className="dreaming" viewBox="34 -66 332 482" fill="none" aria-hidden="true">
      <ellipse cx="200" cy="404" rx="140" ry="8" fill="var(--rose-soft)" />

      <g className="bubble">
        <g transform="translate(200 18) scale(1.6) translate(-200 -64)">
          <path d="M150 100c-22 0-30-20-16-30-10-20 12-36 30-28 6-20 36-26 50-10 16-14 44-4 40 16 20 4 22 32 4 40 4 16-22 24-34 12-10 12-38 12-46 2-10 8-30 6-28-2z"
            fill="var(--paper)" stroke={GOLD} strokeWidth="1.2" />
          {DREAMS.map(([label, art], k) => (
            <g key={label} className={"dream" + (k === i ? " on" : "")}>
              {art}
              <text x="200" y="99" textAnchor="middle" fill="var(--rose)" fontFamily="DM Sans, sans-serif"
                fontSize="7.5" fontWeight="500" letterSpacing="1.8">{label.toUpperCase()}</text>
            </g>
          ))}
        </g>
        <g fill="var(--paper)" stroke={GOLD} strokeWidth="1">
          <circle className="td d1" cx="122" cy="88" r="5" /><circle className="td d2" cx="118" cy="100" r="3.6" />
          <circle className="td d3" cx="116" cy="110" r="2.4" />
          <circle className="td d1" cx="286" cy="84" r="5" /><circle className="td d2" cx="294" cy="94" r="3.6" />
          <circle className="td d3" cx="300" cy="103" r="2.4" />
        </g>
      </g>

      <g className="lean">
        <Bride>
          <path d="M150 182 160 210 139 163" stroke={SKIN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M156.5 202l-2.5-5.5" stroke={GOLD} strokeWidth="10" />
        </Bride>
        <circle cx="124" cy="161" r="5.5" fill={SKIN} />
      </g>
      <g className="lean lean-r">
        <Groom>
          <Sleeve d="M250 180 240 210 261 163" />
        </Groom>
        <circle cx="276" cy="161" r="5.5" fill={SKIN} />
      </g>
    </svg>
  );
}

function Welcome() {
  return (
    <section className="page welcome">
      <PageBg motif="lotus" />
      <h2>{C.welcomeTitle}</h2>
      <p className="sub">A note from us</p>
      <p className="body">{C.welcomeText}</p>
      <Countdown />
    </section>
  );
}

function Venue() {
  return (
    <section className="page">
      <PageBg motif="hills" />
      <h2>The venues</h2>
      <p className="sub">Where to find us</p>
      <div className="venues">
        {EVENTS.map((e) => (
          <div key={e.place}>
            <p className="venue-name">{e.place}</p>
            <p className="addr">
              {e.host} · {fmt(e.date, { weekday: "long", day: "numeric", month: "long" })}
              {e.address && <><br />{e.address}</>}
            </p>
            <a className="btn" href={e.mapUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="page closing">
      <PageBg motif="lanterns" />
      <Monogram />
      <p className="closing-with">{C.closing}</p>
      <p className="closing-names">
        {C.partner1}<i>&amp;</i>{C.partner2}
      </p>
      <svg className="divider" viewBox="0 0 200 20" fill="none" aria-hidden="true">
        <path d="M10 10h66M124 10h66" stroke={GOLD} strokeWidth=".9" />
        <path d="M80 10l5-4 5 4-5 4zM110 10l5-4 5 4-5 4z" fill={GOLD} />
        <Flower x={100} y={10} r={8} />
      </svg>
      <p className="closing-date">{C.dateLabel}</p>
      <p className="closing-places">{EVENTS.map((e) => e.place).join(" · ")}</p>
      {C.closingNote && <p className="closing-note">{C.closingNote}</p>}
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    document.title = `M&M – Wedding invitation`;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", !unlocked);
  }, [unlocked]);

  return (
    <div className="device">
      <Cover onDone={() => setUnlocked(true)} />
      <div className="screen" id="screen">
        <main className="app">
          <Hero />
          <Welcome />
          <Venue />
          <Footer />
        </main>
      </div>
    </div>
  );
}
