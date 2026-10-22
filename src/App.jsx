import { useEffect, useState } from "react";
import { CONFIG as C } from "./config.js";

const enc = encodeURIComponent;
const names = `${C.partner1} & ${C.partner2}`;
const mono = (C.partner1[0] + C.partner2[0]).toUpperCase();

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=" + enc(C.mapQuery || C.venueName);
const calUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${enc(C.eventTitle)}&dates=${C.startISO}/${C.endISO}` +
  `&location=${enc(C.venueName + ", " + C.venueAddress)}` +
  `&details=${enc("Invitation to " + names + "’s wedding.")}`;

/* ---------- Icons ---------- */
const ICONS = {
  pin: (<><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  glass: (<><path d="M7 4h10l-1 7a4 4 0 0 1-8 0L7 4z" /><path d="M12 15v5M9 20h6" /></>),
  fork: <path d="M8 3v7a2 2 0 0 0 2 2v9M6 3v6M10 3v6M17 21V3c-2 1-3 4-3 8h3" />,
  music: (<><path d="M9 18V6l10-2v12" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="16" r="2" /></>),
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] || ICONS.heart}
    </svg>
  );
}

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

/* ---------- Envelope intro ---------- */
function Envelope({ onDone }) {
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
    }, reduce ? 50 : 2300);
    return () => clearTimeout(t);
  }, [open, onDone]);

  return (
    <div id="intro" className={gone ? "gone" : ""} role="dialog" aria-label="Wedding invitation">
      <p className="intro-line">{C.introLine}</p>
      <div className="env-wrap">
        <div className={"env" + (open ? " open" : "")} onClick={() => setOpen(true)}>
          <div className="env-back" />
          <div className="letter">
            <small>You’re invited</small>
            <span className="serif">{names}</span>
          </div>
          <div className="env-front" />
          <div className="flap" />
          <button className="seal" aria-label="Open the invitation" onClick={() => setOpen(true)}>
            <span>{mono}</span>
          </button>
        </div>
        <p className="tap" style={{ visibility: open ? "hidden" : "visible" }}>
          Tap the seal to open
        </p>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */
function Hero() {
  return (
    <section className="page hero" id="top">
      <Sprig />
      <p className="lead">We’re getting married</p>
      <h1>
        {C.partner1}
        <span className="amp">and</span>
        {C.partner2}
      </h1>
      <p className="when">{C.dateLabel}</p>
      <p className="where">{C.venueName}</p>
      <a className="btn ghost" href={calUrl} target="_blank" rel="noopener noreferrer">
        Add to calendar
      </a>
      <p className="hint">Scroll for the details</p>
    </section>
  );
}

function Welcome() {
  return (
    <section className="page">
      <h2>{C.welcomeTitle}</h2>
      <p className="sub">A note from us</p>
      <p className="body">{C.welcomeText}</p>
    </section>
  );
}

function Venue() {
  return (
    <section className="page">
      <h2>The venue</h2>
      <p className="sub">Where to find us</p>
      <p className="venue-name">{C.venueName}</p>
      <p className="addr">{C.venueAddress}</p>
      <a className="btn" href={mapUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
    </section>
  );
}

function Schedule() {
  return (
    <section className="page">
      <h2>Schedule</h2>
      <p className="sub">Our day, step by step</p>
      <ol className="timeline">
        {C.schedule.map((s) => (
          <li key={s.time + s.title}>
            <span className="dot"><Icon name={s.icon} /></span>
            <div>
              <p className="t-time">{s.time}</p>
              <p className="t-title">{s.title}</p>
              <p className="t-note">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DressCode() {
  return (
    <section className="page">
      <h2>{C.dressTitle}</h2>
      <p className="sub">What to wear</p>
      <p className="body">{C.dressText}</p>
      <div className="swatches">
        {C.palette.map((p) => (
          <div className="sw" key={p.name}>
            <i style={{ background: p.hex }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
      {C.paletteAvoid && <p className="avoid">{C.paletteAvoid}</p>}
    </section>
  );
}

function Stay() {
  return (
    <section className="page">
      <h2>Where to stay</h2>
      <p className="sub">Hotels nearby</p>
      <div className="stays">
        {C.stay.map((h) => (
          <div className="stay" key={h.name}>
            <h3>{h.name}</h3>
            <p>{h.note}</p>
            {h.link && <a href={h.link} target="_blank" rel="noopener noreferrer">View hotel</a>}
          </div>
        ))}
      </div>
      {C.stayNote && <p className="body small-note">{C.stayNote}</p>}
    </section>
  );
}

function Gifts() {
  return (
    <section className="page">
      <h2>Gifts</h2>
      <p className="sub">Only if you wish</p>
      <p className="body">{C.giftsText}</p>
      {C.giftsLink && (
        <p style={{ marginTop: 28 }}>
          <a className="btn ghost" href={C.giftsLink} target="_blank" rel="noopener noreferrer">
            {C.giftsLinkLabel}
          </a>
        </p>
      )}
    </section>
  );
}

function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const buildText = () => {
    let t = attending
      ? `Hi! This is ${name.trim()}. I’m happy to say I’ll be at your wedding on ${C.dateLabel}, with ${guests} guest(s) in total.`
      : `Hi! This is ${name.trim()}. I’m sorry, I won’t be able to make it to your wedding on ${C.dateLabel}.`;
    if (note.trim()) t += `\n\nNote: ${note.trim()}`;
    return t;
  };

  const valid = () => {
    if (!name.trim()) {
      setMsg("Please enter your name first.");
      return false;
    }
    setMsg("");
    return true;
  };

  const sendWhatsApp = (e) => {
    e.preventDefault();
    if (!valid()) return;
    const base = C.whatsapp ? `https://wa.me/${C.whatsapp}` : "https://wa.me/";
    window.open(`${base}?text=${enc(buildText())}`, "_blank", "noopener");
    setMsg("WhatsApp is opening. Press send there to complete your RSVP.");
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!valid()) return;
    window.location.href =
      `mailto:${C.email}?subject=${enc("RSVP – " + name.trim())}&body=${enc(buildText())}`;
  };

  return (
    <section className="page" id="rsvp">
      <h2>Will you join us?</h2>
      <p className="sub">Please reply by {C.rsvpBy}</p>
      <form onSubmit={sendWhatsApp} noValidate>
        <div>
          <label htmlFor="gname">Your name</label>
          <input type="text" id="gname" autoComplete="name" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <span className="legend">Can you make it?</span>
          <div className="choice">
            <input type="radio" name="att" id="yes" checked={attending} onChange={() => setAttending(true)} />
            <label htmlFor="yes">Joyfully accept</label>
            <input type="radio" name="att" id="no" checked={!attending} onChange={() => setAttending(false)} />
            <label htmlFor="no">Regretfully decline</label>
          </div>
        </div>

        {attending && (
          <div>
            <label htmlFor="guests">Number of guests, including you</label>
            <select id="guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="note">Food preferences or a message for us</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button className="btn" type="submit">Send RSVP on WhatsApp</button>
        <p className="msg" role="status" aria-live="polite">{msg}</p>
        {C.email && (
          <p className="alt">
            Prefer email? <a href="#" onClick={sendEmail}>Send by email</a>
          </p>
        )}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <p className="serif">{C.closing}</p>
      <p>{C.dateLabel}</p>
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    document.title = `${names} – Wedding invitation`;
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", !unlocked);
  }, [unlocked]);

  return (
    <div className="device">
      <Envelope onDone={() => setUnlocked(true)} />
      <div className="screen" id="screen">
        <main className="app">
          <Hero />
          <Welcome />
          <Venue />
          <Schedule />
          <DressCode />
          <Stay />
          <Gifts />
          <Rsvp />
          <Footer />
        </main>
      </div>
    </div>
  );
}
