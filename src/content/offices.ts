/**
 * Office directory. Postal details must be verified against current company
 * records before launch. Coordinates are approximate locality centres used for
 * map pins only — set `verified: true` after confirming the exact location.
 */
export type Office = {
  id: string;
  city: string;
  label: string;
  address: string;
  region: "gujarat" | "maharashtra" | "delhi";
  lat: number;
  lng: number;
  isHQ?: boolean;
  verified: boolean;
};

export const OFFICES: Office[] = [
  {
    id: "nadiad",
    city: "Nadiad",
    label: "Historical Headquarters",
    address: "Salun Bazaar, Rana Chowk, Nadiad, Gujarat, India",
    region: "gujarat",
    lat: 22.6939,
    lng: 72.8616,
    isHQ: true,
    verified: false,
  },
  {
    id: "ahmedabad-makarba",
    city: "Ahmedabad",
    label: "Ahmedabad — Makarba",
    address: "Kataria Enclave, Makarba, Ahmedabad, Gujarat 380051, India",
    region: "gujarat",
    lat: 22.9946,
    lng: 72.5009,
    verified: false,
  },
  {
    id: "ahmedabad-vastrapur",
    city: "Ahmedabad",
    label: "Ahmedabad — Vastrapur",
    address: "Vastrapur Gam, Near Somnath Mahadev Mandir, Ahmedabad, Gujarat, India",
    region: "gujarat",
    lat: 23.0395,
    lng: 72.5293,
    verified: false,
  },
  {
    id: "petlad",
    city: "Petlad",
    label: "Petlad",
    address: "Near College Chowk, Petlad, Anand District, Gujarat 388450, India",
    region: "gujarat",
    lat: 22.4768,
    lng: 72.7997,
    verified: false,
  },
  {
    id: "mumbai",
    city: "Mumbai",
    label: "Mumbai",
    address: "Juhu Lane, Andheri West, Mumbai, Maharashtra, India",
    region: "maharashtra",
    lat: 19.1197,
    lng: 72.8397,
    verified: false,
  },
  {
    id: "new-delhi",
    city: "New Delhi",
    label: "New Delhi",
    address: "Rana Road / Rana Lanes, Bijwasan, Near Gatta Factory, New Delhi 110061, India",
    region: "delhi",
    lat: 28.5413,
    lng: 77.0453,
    verified: false,
  },
];

export const mapsSearchUrl = (o: Pick<Office, "address">) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`;

export const mapsDirectionsUrl = (o: Pick<Office, "address">) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.address)}`;

export const mapsEmbedUrl = (o: Pick<Office, "address">) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(o.address)}&z=15&output=embed`;

export const REGIONS = [
  {
    id: "gujarat",
    name: "Gujarat",
    stateId: "gj",
    body: "The foundation of our business and an important region for commercial and industrial transportation opportunities.",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    stateId: "rj",
    body: "An important commercial region for transportation enquiries and potential business connectivity.",
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    stateId: "mh",
    body: "A key state for commerce, manufacturing and longer-distance transport requirements, with Mumbai an important business destination.",
  },
  {
    id: "delhi",
    name: "Delhi & Northern India",
    stateId: "dl",
    body: "A strategic market for industrial supply, commercial transportation and long-distance logistics opportunities.",
  },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];
