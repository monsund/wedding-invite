// EDIT THIS FILE: every detail on the invitation comes from here.

export const CONFIG = {
  partner1: "Mayuri",
  partner2: "Monsoon",
  introLine: "A letter has arrived for you",

  welcomeTitle: "To the big day",
  welcomeText:
    "We’re getting married, and we would love to have you with us. This page has everything you need to know. Take a look around, then let us know if you can make it.",

  eventTitle: "Mayuri & Monsoon’s wedding",
  dateLabel: "Sunday, 14 February 2027",
  startISO: "20270214T103000", // local start, YYYYMMDDTHHMMSS
  endISO: "20270214T233000",

  venueName: "The Garden Courtyard",
  venueAddress: "12 Lake Road, Your City, State 000000",
  mapQuery: "The Garden Courtyard, Your City",

  // icon: pin | heart | glass | fork | music
  schedule: [
    { time: "3:30 PM", title: "Guest arrival", note: "Light refreshments while everyone settles in", icon: "pin" },
    { time: "4:00 PM", title: "Ceremony", note: "We exchange vows in the garden courtyard", icon: "heart" },
    { time: "5:00 PM", title: "Cocktail hour", note: "Drinks, bites and a little mingling", icon: "glass" },
    { time: "6:30 PM", title: "Dinner and toasts", note: "A shared meal, followed by a few words from loved ones", icon: "fork" },
    { time: "8:30 PM", title: "First dance and open floor", note: "Dancing until late", icon: "music" },
  ],

  dressTitle: "Dress code",
  dressText: "Garden formal. Think soft, flowing fabrics, and shoes you can walk on grass in.",
  palette: [
    { name: "Sage", hex: "#8FA58F" },
    { name: "Dusty rose", hex: "#D9A4AC" },
    { name: "Ivory", hex: "#F3EBDD" },
    { name: "Wine", hex: "#7A2E3F" },
  ],
  paletteAvoid: "Please leave white and ivory to the bride.",

  stay: [
    { name: "The Lakeview Hotel", note: "5 minutes from the venue. Mention our names for the guest rate.", link: "https://example.com" },
    { name: "Courtyard Inn", note: "A quieter option, 10 minutes by car.", link: "https://example.com" },
  ],
  stayNote: "Rooms are limited, so please book early.",

  giftsText:
    "Your presence is the best gift we could ask for. If you would still like to give something, a contribution towards our new home would mean a lot to us.",
  giftsLink: "", // optional
  giftsLinkLabel: "See gift details",

  rsvpBy: "10 January 2027",
  whatsapp: "", // e.g. "919876543210" (country code, no + or spaces). Empty lets the guest pick the contact.
  email: "", // optional fallback, e.g. "us@example.com"

  closing: "With love, Mayuri & Monsoon",
};
