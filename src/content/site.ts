/**
 * Central business facts. Every page reads from here so that a single edit
 * updates the whole website. Items flagged `verified: false` must be confirmed
 * by the company before launch (see README → "Pre-launch verification").
 */
export const SITE = {
  name: "Rana Transport & Logistics",
  shortName: "Rana Transports",
  tagline: "Beyond Transportation. Into Tomorrow.",
  legacyLine: "One Truck. Three Generations. One Extraordinary Legacy.",
  promise: "Moving Generations. Connecting Businesses.",
  description:
    "Rana Transport & Logistics is a three-generation family transportation business from Nadiad, Gujarat, offering road freight, heavy commercial vehicle and dumper transport enquiries for businesses across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ranatransports.in",
  /** Approximate founding window confirmed by the family. Keep the range until a single year is approved. */
  inception: { from: 1998, to: 2001, label: "1998–2001" },
  heritageYears: "25",
  phone: "+91 8320294127",
  phoneHref: "tel:+918320294127",
  whatsapp: "+91 8320294127",
  whatsappHref:
    "https://wa.me/918320294127?text=" +
    encodeURIComponent("Hello Rana Transport & Logistics, I would like to discuss a transport requirement."),
  email: "contact@ranatransports.in",
  emailHref: "mailto:contact@ranatransports.in",
  hq: "Salun Bazaar, Rana Chowk, Nadiad, Gujarat, India",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/legacy", label: "Our Legacy" },
  { href: "/services", label: "Services" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/network", label: "Network & DMIC" },
  { href: "/leadership", label: "Leadership" },
  { href: "/digital-logistics", label: "Digital Logistics" },
  { href: "/contact", label: "Contact" },
] as const;

export const STRENGTHS = [
  {
    title: "25 Years of Family Transport Heritage",
    body: "A journey that began with one truck and continues through three generations.",
    icon: "legacy",
  },
  {
    title: "Small to Heavy Commercial Vehicles",
    body: "Transportation options for different cargo sizes and business requirements.",
    icon: "truck",
  },
  {
    title: "Pan-India Transport Enquiries",
    body: "Discuss your transportation requirements across major Indian business destinations.",
    icon: "route",
  },
  {
    title: "Business-Focused Logistics",
    body: "Cargo movement, commercial transportation and operational coordination for businesses.",
    icon: "briefcase",
  },
] as const;

export const HIGHLIGHTS = [
  {
    title: "All Truck Types",
    body: "Find suitable options for small, medium and heavy commercial transport requirements.",
    icon: "truck",
  },
  {
    title: "Pan-India Transport Enquiries",
    body: "Enquire about transport movements across major Indian business destinations.",
    icon: "route",
  },
  {
    title: "Competitive Quotations",
    body: "Receive requirement-based commercial pricing.",
    icon: "quote",
  },
  {
    title: "Shipment Coordination",
    body: "Stay connected with the operations team for transport updates.",
    icon: "sync",
  },
  {
    title: "GPS Tracking Support",
    body: "Available only for shipments and vehicles with confirmed tracking integration.",
    icon: "gps",
  },
  {
    title: "Business-Focused Support",
    body: "Direct contact for transportation planning, quotations and corporate enquiries.",
    icon: "briefcase",
  },
] as const;

export const WHY_RANA = [
  { title: "A Family Legacy", body: "Built upon generations of transportation experience — approximately 25 years and counting." },
  { title: "Founder-Led Values", body: "The principles of Late Shri Dinesh Vasantlal Rana carried forward through every generation." },
  { title: "A Personal Approach", body: "Business enquiries handled through direct communication and practical coordination." },
  { title: "Different Cargo Scales", body: "Transport options discussed from light commercial loads to heavy trucks and dumpers." },
  { title: "Industrial & Business Focus", body: "Commercial and industrial transportation for manufacturers, distributors and traders." },
  { title: "Requirement-Based Quotations", body: "Pricing planned around your cargo, route, timing and vehicle needs." },
  { title: "Long-Term Relationships", body: "A focus on customers who value consistent communication and ongoing transport support." },
  { title: "Gujarat Roots, Corridor Focus", body: "A Gujarat foundation with a strategic focus on major commercial corridors." },
  { title: "A Vision for Tomorrow", body: "Future-oriented digital systems developing under Tej Rana's leadership." },
] as const;

export const COMPARISON = {
  left: {
    title: "Typical Transactional Booking Experience",
    note: "A generic illustration of app-first booking models — not a description of any specific company.",
    steps: ["Select a vehicle.", "Enter shipment details.", "Receive a standard service flow."],
  },
  right: {
    title: "The Rana Business Partnership Approach",
    steps: [
      "Discuss cargo requirements.",
      "Review suitable transport options.",
      "Coordinate commercial requirements.",
      "Plan the appropriate movement.",
      "Maintain direct business communication.",
      "Support recurring transportation relationships.",
    ],
  },
} as const;

export const QUOTE_STEPS = [
  { title: "Share your requirement", body: "Cargo, weight, loading & unloading locations and timing." },
  { title: "We review the options", body: "Our team assesses suitable vehicles, route and availability." },
  { title: "Receive a quotation", body: "A requirement-based commercial quotation, discussed directly." },
  { title: "Plan the movement", body: "Loading, dispatch and coordination confirmed with you." },
] as const;
