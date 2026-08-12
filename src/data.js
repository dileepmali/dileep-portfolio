/*
 * All copy lives here. Every entry below is real — the previous file carried
 * the purchased template's placeholder companies, universities and testimonials
 * alongside the genuine content, which is worse than having fewer sections.
 *
 * Anything not yet known is left as null and simply does not render, rather
 * than being filled in with something plausible.
 */

import portrait from "./assets/dileep.png";

/*
 * The hero portrait. Dileep's own photograph, cut out of its background.
 *
 * Made from `image.png` in this folder, which is the untouched original and is
 * kept only as the source to re-cut from. The subject was lifted with the
 * system's own subject-detection rather than keyed on brightness — the
 * photograph is outdoors in daylight and there is no colour to key against —
 * and then cropped to the waist, because the full frame is Dileep sitting on a
 * low wall and lifting him off it leaves him seated on nothing. The stylesheet
 * fades out everything below the belt for the same reason; the two go together.
 *
 * To replace: drop a cut-out PNG in src/assets (transparent background, facing
 * camera — 700×923 RGBA is the shape that fits) and point this import at it.
 * A differently proportioned image means updating `--photo-w`'s ratio in the
 * stylesheet to match, or the card beside the portrait drifts off its edge.
 *
 * Set to null and the hero falls back to a marked silhouette at the exact same
 * footprint.
 */
export const PHOTO = portrait;

export const ME = {
  name: "Dileep Kumar",
  role: "Frontend Developer",
  company: "AnantKaya Solutions",
  companyFull: "AnantKaya Solutions Private Limited",
  email: "dileepmali205@gmail.com",
  experience: "1.3",
  lead:
    "Working across Android, iOS and the mobile web — taking products from an empty repository to something running on real devices.",
  stats: [
    { value: "02", label: "Products shipped" },
    { value: "1.3+", label: "Years of experience" },
  ],
};

/*
 * The menu, in page order — one entry per section that actually exists.
 *
 * The rail and the hero both still handle `href: null`, which means the item is
 * listed but has nowhere to go yet: it renders as a plain label rather than a
 * link, so nothing on screen claims to be clickable when it is not. Nothing
 * uses that today; adding an entry without an href is how a section that has
 * not been built gets a placeholder in the menu.
 */
export const NAV = [
  { label: "Home", href: "#top" },
  { label: "About me", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "What you get", href: "#what-you-get" },
  { label: "Contact", href: "#contact" },
];

export const WORK = [
  {
    id: "anantspace",
    name: "AnantSpace",
    tagline: "A personal data vault",
    summary:
      "People store and organise their own information in one place. The same experience on a phone and in a browser, built from an empty repository to something running on real devices.",
    platforms: ["Android", "iOS", "Web"],
    role: "Frontend",
    at: "AnantKaya Solutions",
    live: false,
    url: null,
  },
  {
    id: "aukra",
    name: "Aukra",
    tagline: "A digital ledger",
    summary:
      "Recording money in and money out, in the Khatabook mould. Shipped end to end and live on every platform it targets.",
    platforms: ["Web", "Android", "iOS"],
    role: "Frontend",
    at: "AnantKaya Solutions",
    live: true,
    url: null,
  },
];

/*
 * PLACEHOLDER — every word below is invented.
 *
 * The timeline was asked for before the real story was written down, so this is
 * a stand-in with the right shape: five steps, school leaving to working
 * developer, one dated beat each. None of it is true and none of it should ship.
 * Replace the five entries with real years and real sentences; the section reads
 * whatever is in this array, so nothing else has to change.
 *
 * The beats that were here before this stood in, and belong back in it, are:
 * joining AnantKaya Solutions as a frontend developer, shipping AnantSpace, and
 * shipping Aukra.
 *
 * `year` is the display string, apostrophe and all, because that is how the
 * reference sets it. `when` is written out rather than computed from the year —
 * a date this section does not have cannot be subtracted from today.
 *
 * ⚠️  `story` is a DRAFT, written to Dileep's brief rather than by him.
 *
 * It is what the card opens into, and it exists because the panel needed
 * something longer than the two lines already printed on the card — opening a
 * card to be shown the same sentence twice is worse than not opening it. Each
 * one only stretches what its `body` already says and adds no fact that was not
 * there: no dates, no numbers, no names beyond the ones elsewhere in this file.
 *
 * They are still somebody else's sentences about his life. Read them and put
 * them in your own words — the rest of this file is real and these should be
 * too. Delete a `story` and its card simply stops offering to open.
 */
export const JOURNEY = [
  {
    year: "'21",
    title: "Out of school, into a borrowed laptop",
    body: "Board exams finished and I had no idea what a repository was. That summer went on taking a borrowed laptop apart and getting it working again.",
    story:
      "Board exams finished and the summer opened up with nothing in it. The laptop was not mine — it was lent to me, which is the only reason I was careful with it, and not careful enough. I opened things I had no business opening. I broke the machine badly enough that I had to fix it before anyone noticed, and fixing it taught me more than breaking it did. Nobody set me a syllabus. I did not know the word repository, I had never heard of a framework, and I could not have told you what a developer actually does all day. What I had was a machine that did exactly what it was told, and a whole summer to find out what to tell it.",
    who: "@dileep",
    when: "5 years ago",
    href: null,
  },
  {
    year: "'22",
    title: "First lines that did something",
    body: "A friend showed me HTML. I built a cricket scoreboard that only ever worked on my own screen, and could not stop opening it.",
    story:
      "A friend showed me a page of HTML and I did not sleep much that week. The first thing I made was a cricket scoreboard, because that was the only thing I wanted badly enough to build twice. It was ugly. The scores were typed in by hand and it forgot everything the moment the page reloaded. It worked on exactly one screen in the world, which was mine, and I still opened it four or five times a day just to look at it. That is the part I would not trade — not the code, which was bad, but finding out that a thing I typed could sit there afterwards and do something.",
    who: "@dileep",
    when: "4 years ago",
    href: null,
  },
  {
    year: "'23",
    title: "College, and the builds nobody asked for",
    body: "Between lectures: a timetable app for my own class, then a portfolio for a senior who needed one by Friday. Both shipped late.",
    story:
      "College gave me lectures and a lot of gaps between them, and the gaps are where everything actually got built. First a timetable app for my own class, because ours changed constantly and nobody could keep up with it. Then a portfolio for a senior who needed one by Friday and asked me on Wednesday. Both of them shipped late. Late is the word I want to keep in, because that was the lesson: writing the thing is not the job, finishing it by a date somebody else is counting on is the job. Nobody had asked for either of these. Building things nobody asked for is how I found out what I was slow at.",
    who: "@dileep",
    when: "3 years ago",
    href: null,
  },
  {
    year: "'24",
    title: "Three months of other people's CSS",
    body: "First internship. I learned more from review comments on my pull requests than from a year of following tutorials.",
    story:
      "The first internship was the first time my code was somebody else's problem. Until then everything I wrote had one reader. Now it went into a pull request and came back with comments on it, and the comments were about things tutorials never mention: why this name is wrong, why this will break for the next person, why the shorter version is not the better one. It stung for about a fortnight and then it stopped stinging and started being the fastest I had ever learned anything. Three months of reading other people's CSS taught me more than the year of tutorials before it, and most of what it taught me was how to be read.",
    who: "@dileep",
    when: "2 years ago",
    href: null,
  },
  {
    year: "'25",
    title: "Full time on a product team",
    body: "Joined as a frontend developer. First real deadline, first real handover, first thing I built running on somebody else's phone.",
    story:
      "I joined AnantKaya Solutions as a frontend developer and stopped practising. A deadline at work is not a deadline you set yourself — people plan around it, and moving it costs somebody something. I took two products from an empty repository through to a handover, across Android, iOS and the browser, which meant learning that a build is not finished when it runs on my machine but when it runs on a stranger's. The first time I watched somebody use one of them on their own phone, holding it the way people actually hold phones, I understood what all of it had been for. That is still the part I am chasing.",
    who: "@dileep",
    when: "1 year ago",
    href: null,
  },
];

/*
 * PLACEHOLDER — none of these five projects exist.
 *
 * The section was asked for before there was work to put in it, so this is a
 * stand-in with the right shape: five cards, each with a number, a name, a line
 * about it, and the stack it was built on.
 *
 * `plate` is the drawn cover — see ProjectPlate.jsx. `screen` picks which
 * device and which layout is drawn on it, `ground` the field it stands in, and
 * `tilt` how far the device is turned. They are covers, not screenshots, and
 * are honest about it: there is not a word of copy on any of those screens.
 *
 * The two real projects are in `WORK` above — AnantSpace and Aukra — and they
 * are what belongs here, with real screenshots, once there are screenshots to
 * use. Add `image` to an entry and the card renders that photograph in place of
 * the drawing, with nothing else to change. `href` stays null until there is
 * somewhere for a card to go, and an unset one simply renders no link.
 */
export const PROJECTS = [
  {
    id: "ledger",
    name: "Ledger",
    tagline: "Money in, money out, offline first",
    tags: ["React Native", "SQLite", "Offline sync"],
    plate: { screen: "ledger", ground: "sand", tilt: -6 },
    href: null,
  },
  {
    id: "vault",
    name: "Vault",
    tagline: "One place for everything you own",
    tags: ["React", "Firebase", "Auth"],
    plate: { screen: "vault", ground: "pearl", tilt: -3 },
    href: null,
  },
  {
    id: "signal",
    name: "Signal",
    tagline: "A dashboard that reads at a glance",
    tags: ["TypeScript", "Charts", "Design system"],
    plate: { screen: "signal", ground: "taupe", tilt: 3 },
    href: null,
  },
  {
    id: "orbit",
    name: "Orbit",
    tagline: "Scheduling for teams in three timezones",
    tags: ["Next.js", "Node", "Postgres"],
    plate: { screen: "orbit", ground: "bone", tilt: 5 },
    href: null,
  },
  {
    id: "relay",
    name: "Relay",
    tagline: "Delivery tracking on a courier's phone",
    tags: ["Android", "Maps", "Push"],
    plate: { screen: "relay", ground: "citrus", tilt: -6 },
    href: null,
  },
];

/*
 * The screen that answers "so what do I actually get".
 *
 * `statement` is the sentence, written as the pieces it is made of: a string is
 * a run of words, an object is one of the small chips that sit inline between
 * them. The section renders each word as its own element so they can arrive one
 * after another as the sentence is scrolled through — see WhatYouGet.jsx.
 *
 * The chips are decorative and carry no text of their own. `icon` names one of
 * the four glyphs the component draws; anything else renders the plain tile.
 *
 * Every claim in here is one the two shipped products support: built from
 * nothing, runs on both phones and in a browser, handed over. Nothing about
 * team size, turnaround or process, none of which there is evidence for.
 */
export const WHAT_YOU_GET = {
  // Title case, word for word, as the reference sets it — this is the one
  // heading on the page that is a title rather than a sentence.
  title: ["What", "You Get?"],
  label: "What working with me looks like",
  statement: [
    "Frontend built end to end",
    { icon: "repo" },
    "— an interface taken from an empty repository",
    { icon: "device" },
    "to something running on Android, iOS",
    { icon: "browser" },
    "and in the browser,",
    { icon: "ship" },
    "handed over ready to ship.",
  ],
};

// Fill in an href and the link appears in the nav and footer automatically.
/*
 * The hero's trait card — how the work gets done, not what it is built in.
 * The stack already appears on this page in the work section's platform lists;
 * repeating it in the hero says nothing new.
 *
 * "Strategist" from the reference's version is deliberately not here: it claims
 * a role, and the others are all things a frontend developer demonstrates in
 * the work itself. Swap it in if it is wanted.
 */
export const TRAITS = [
  "Creative",
  "Reliable",
  "Precise",
  "Builder",
  "Efficient",
];

export const SOCIALS = [
  { label: "GitHub", short: "GH", href: null },
  { label: "LinkedIn", short: "IN", href: null },
];

/*
 * The rail's ticker: what the work is built with, and where it ends up.
 *
 * Two groups rather than one long list, because they answer different
 * questions — the stack says what the code is, the stores say how far it
 * actually goes. Running them through one strip keeps the rail short while
 * still saying both.
 *
 * Add or remove entries freely; the strip loops on whatever is here.
 */
export const TICKER = [
  { label: "Flutter", group: "stack" },
  { label: "C++", group: "stack" },
  { label: "Java", group: "stack" },
  { label: "Firebase", group: "stack" },
  { label: "React", group: "stack" },
  { label: "Android", group: "platform" },
  { label: "iOS", group: "platform" },
  { label: "Google Play", group: "store" },
  { label: "App Store", group: "store" },
  { label: "Samsung", group: "store" },
  { label: "Vivo", group: "store" },
  { label: "Indus", group: "store" },
];
