/**
 * Vehicle catalogue — Indian commercial vehicle classes with typical cargo
 * dimensions and payloads (as commonly quoted by Indian transporters).
 *
 * These are TYPICAL specifications for the class, not a guarantee for a
 * specific vehicle. The legal payload of any truck depends on its registered
 * GVW, unladen weight, axle limits and body build. Set `verified: true` once
 * the operations team confirms a vehicle's exact figures; availability is
 * always confirmed per enquiry.
 */
export type VehicleCategory = "small" | "medium" | "heavy" | "container" | "dumper";

export type CabType = "auto" | "mini" | "pickup" | "lcv" | "hcv" | "tractor";
export type BodyType = "auto-box" | "open" | "container" | "tipper" | "flatbed";

export type Drawing = {
  cab: CabType;
  body: BodyType;
  /** Deck (floor) height above ground, ft */
  deckFt: number;
  /** Wheel radius, ft */
  wheelFt: number;
  /** Cab roof height above ground, ft */
  cabHeightFt: number;
  /** Axle positions in ft measured from the rear of the cargo body */
  axles: number[];
};

export type Vehicle = {
  id: string;
  name: string;
  /** e.g. "LCV · 2 axles · 6 tyres" */
  spec: string;
  category: VehicleCategory;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  /** What the height dimension measures */
  heightRef: "cargo" | "side wall" | "deck";
  capacityKg: [number, number];
  /** Tipper body volume, cubic metres */
  volumeM3?: number;
  bestFor: string;
  cargo: string[];
  loading: string;
  drawing: Drawing;
  /** Optional licensed photo path under /public; replaces the drawing */
  image?: string;
  verified: boolean;
};

export const VEHICLE_FILTERS: { id: VehicleCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "small", label: "Small Commercial" },
  { id: "medium", label: "Medium (LCV / ICV)" },
  { id: "heavy", label: "Heavy Trucks" },
  { id: "container", label: "Container & Trailer" },
  { id: "dumper", label: "Tippers / Dumpers" },
];

export const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  small: "Small Commercial",
  medium: "Medium Commercial",
  heavy: "Heavy Commercial",
  container: "Container & Long-Haul",
  dumper: "Tipper / Dumper",
};

export const VEHICLES: Vehicle[] = [
  // ───────────── Small commercial ─────────────
  {
    id: "three-wheeler",
    name: "3-Wheeler Cargo",
    spec: "Three-wheeler · closed box",
    category: "small",
    lengthFt: 5.5,
    widthFt: 4.5,
    heightFt: 5,
    heightRef: "cargo",
    capacityKg: [500, 500],
    bestFor: "Small cartons, retail goods and light local deliveries.",
    cargo: ["Cartons", "Retail goods", "Parcels"],
    loading: "Rear-door box, manual loading",
    drawing: { cab: "auto", body: "auto-box", deckFt: 1.9, wheelFt: 0.85, cabHeightFt: 6.2, axles: [1.6, 8.0] },
    verified: false,
  },
  {
    id: "tata-ace",
    name: "Tata Ace",
    spec: "Mini truck · 7 ft open body",
    category: "small",
    lengthFt: 7,
    widthFt: 4.8,
    heightFt: 1.3,
    heightRef: "side wall",
    capacityKg: [750, 750],
    bestFor: "Local business cargo, retail supply and small commercial loads.",
    cargo: ["Retail supply", "Local deliveries", "Small loads"],
    loading: "Open deck with drop sides, manual loading",
    drawing: { cab: "mini", body: "open", deckFt: 2.3, wheelFt: 0.95, cabHeightFt: 6.1, axles: [1.8, 9.3] },
    verified: false,
  },
  {
    id: "pickup-8ft",
    name: "Pickup 8 ft",
    spec: "Pickup · closed container",
    category: "small",
    lengthFt: 8,
    widthFt: 4.8,
    heightFt: 5.5,
    heightRef: "cargo",
    capacityKg: [1250, 1250],
    bestFor: "Commercial packages and medium-sized goods that need cover.",
    cargo: ["Packaged goods", "E-commerce", "Electronics"],
    loading: "Rear doors, manual loading",
    drawing: { cab: "mini", body: "container", deckFt: 2.4, wheelFt: 1.0, cabHeightFt: 6.4, axles: [2.0, 9.8] },
    verified: false,
  },
  {
    id: "pickup-9ft",
    name: "Pickup 9 ft (1.7 T)",
    spec: "Bonneted pickup · open body",
    category: "small",
    lengthFt: 9,
    widthFt: 5.5,
    heightFt: 1.6,
    heightRef: "side wall",
    capacityKg: [1700, 1700],
    bestFor: "Larger light-commercial loads, hardware and agri produce.",
    cargo: ["Hardware", "Agri produce", "Building materials"],
    loading: "Open deck with tailgate, manual loading",
    drawing: { cab: "pickup", body: "open", deckFt: 2.7, wheelFt: 1.1, cabHeightFt: 6.1, axles: [2.2, 13.4] },
    verified: false,
  },

  // ───────────── Medium commercial ─────────────
  {
    id: "lcv-14ft",
    name: "14 ft LCV",
    spec: "LCV · 2 axles · 6 tyres",
    category: "medium",
    lengthFt: 14,
    widthFt: 6,
    heightFt: 6,
    heightRef: "cargo",
    capacityKg: [2500, 3500],
    bestFor: "Distributor stock, FMCG and household shifting volumes.",
    cargo: ["FMCG", "Palletised goods", "Furniture"],
    loading: "Closed container, rear doors",
    drawing: { cab: "lcv", body: "container", deckFt: 3.2, wheelFt: 1.3, cabHeightFt: 8.0, axles: [3.4, 16.8] },
    verified: false,
  },
  {
    id: "lcv-17ft",
    name: "17 ft LCV",
    spec: "LCV · 2 axles · 6 tyres",
    category: "medium",
    lengthFt: 17,
    widthFt: 6,
    heightFt: 7,
    heightRef: "cargo",
    capacityKg: [4000, 5000],
    bestFor: "Bulky, light-to-medium cargo and intercity distribution.",
    cargo: ["Textiles", "Packaged goods", "White goods"],
    loading: "Closed container, rear doors",
    drawing: { cab: "lcv", body: "container", deckFt: 3.4, wheelFt: 1.35, cabHeightFt: 8.4, axles: [4.0, 20.0] },
    verified: false,
  },
  {
    id: "icv-19ft",
    name: "19 ft ICV",
    spec: "ICV · 2 axles · 6 tyres",
    category: "medium",
    lengthFt: 19,
    widthFt: 7,
    heightFt: 2.5,
    heightRef: "side wall",
    capacityKg: [7000, 7000],
    bestFor: "Medium-weight industrial supplies and bagged goods.",
    cargo: ["Bagged goods", "Industrial supplies", "Steel items"],
    loading: "Open body, side and rear loading",
    drawing: { cab: "lcv", body: "open", deckFt: 3.6, wheelFt: 1.45, cabHeightFt: 8.8, axles: [4.6, 22.2] },
    verified: false,
  },

  // ───────────── Heavy commercial ─────────────
  {
    id: "truck-6w",
    name: "6 Wheeler Truck",
    spec: "HCV · 2 axles · 6 tyres",
    category: "heavy",
    lengthFt: 22,
    widthFt: 7.5,
    heightFt: 3,
    heightRef: "side wall",
    capacityKg: [9000, 10000],
    bestFor: "Medium-to-heavy commercial freight over regional routes.",
    cargo: ["Commercial freight", "Cement bags", "Industrial supplies"],
    loading: "Open body, side and rear loading",
    drawing: { cab: "hcv", body: "open", deckFt: 4.0, wheelFt: 1.65, cabHeightFt: 9.6, axles: [6.0, 26.0] },
    verified: false,
  },
  {
    id: "truck-10w",
    name: "10 Wheeler Truck",
    spec: "HCV · 3 axles · 10 tyres",
    category: "heavy",
    lengthFt: 24,
    widthFt: 8,
    heightFt: 3,
    heightRef: "side wall",
    capacityKg: [16000, 18000],
    bestFor: "High-volume road freight and heavier business loads.",
    cargo: ["Steel & metal", "FMCG full loads", "Grain"],
    loading: "Open body, crane / forklift / manual",
    drawing: { cab: "hcv", body: "open", deckFt: 4.1, wheelFt: 1.7, cabHeightFt: 9.8, axles: [4.3, 8.4, 28.2] },
    verified: false,
  },
  {
    id: "truck-12w",
    name: "12 Wheeler Truck",
    spec: "HCV · 4 axles · 12 tyres",
    category: "heavy",
    lengthFt: 28,
    widthFt: 8,
    heightFt: 3,
    heightRef: "side wall",
    capacityKg: [21000, 25000],
    bestFor: "Larger freight movement and eligible industrial cargo.",
    cargo: ["Industrial cargo", "Full truckloads", "Long-distance freight"],
    loading: "Open body, side and rear loading",
    drawing: { cab: "hcv", body: "open", deckFt: 4.2, wheelFt: 1.7, cabHeightFt: 9.8, axles: [5.0, 9.1, 30.6, 34.2] },
    verified: false,
  },

  // ───────────── Container & trailer ─────────────
  {
    id: "container-20ft",
    name: "20 ft Container",
    spec: "Closed body · SXL · 6 tyres",
    category: "container",
    lengthFt: 20,
    widthFt: 8,
    heightFt: 8,
    heightRef: "cargo",
    capacityKg: [7000, 9000],
    bestFor: "Weather-sensitive and high-value cargo needing full enclosure.",
    cargo: ["Electronics", "Pharma (ambient)", "Garments"],
    loading: "Rear doors, dock or manual",
    drawing: { cab: "hcv", body: "container", deckFt: 4.0, wheelFt: 1.65, cabHeightFt: 9.6, axles: [5.4, 24.2] },
    verified: false,
  },
  {
    id: "container-32ft",
    name: "32 ft MXL Container",
    spec: "Closed body · multi-axle · 14 tyres",
    category: "container",
    lengthFt: 32,
    widthFt: 8,
    heightFt: 8,
    heightRef: "cargo",
    capacityKg: [15000, 18000],
    bestFor: "Long-haul, high-volume cargo across intercity routes.",
    cargo: ["Long-haul freight", "Automotive parts", "Consumer goods"],
    loading: "Rear doors, dock loading",
    drawing: { cab: "hcv", body: "container", deckFt: 4.3, wheelFt: 1.7, cabHeightFt: 9.8, axles: [6.0, 10.1, 34.0, 37.6] },
    verified: false,
  },
  {
    id: "trailer-40ft",
    name: "40 ft Flatbed Trailer",
    spec: "Tractor-trailer · 6 axles · 22 tyres",
    category: "container",
    lengthFt: 40,
    widthFt: 8,
    heightFt: 5,
    heightRef: "deck",
    capacityKg: [25000, 30000],
    bestFor: "Long steel, machinery and project cargo, subject to technical review.",
    cargo: ["Steel coils & plates", "Machinery", "ISO containers"],
    loading: "Crane / forklift, side and top loading",
    drawing: { cab: "tractor", body: "flatbed", deckFt: 5.0, wheelFt: 1.7, cabHeightFt: 10.2, axles: [3.5, 7.6, 11.7, 35.4, 38.9, 45.4] },
    verified: false,
  },

  // ───────────── Tippers / dumpers ─────────────
  {
    id: "tipper-6w",
    name: "6 Wheeler Tipper",
    spec: "Tipper · 2 axles · 6 tyres",
    category: "dumper",
    lengthFt: 14,
    widthFt: 7.5,
    heightFt: 3,
    heightRef: "side wall",
    capacityKg: [9000, 10000],
    volumeM3: 9,
    bestFor: "Eligible construction and bulk material movements.",
    cargo: ["Sand", "Soil", "Aggregates"],
    loading: "Excavator / loader top-loading, hydraulic rear tipping",
    drawing: { cab: "hcv", body: "tipper", deckFt: 4.2, wheelFt: 1.65, cabHeightFt: 9.6, axles: [3.8, 18.4] },
    verified: false,
  },
  {
    id: "tipper-10w",
    name: "10 Wheeler Tipper",
    spec: "Tipper · 3 axles · 10 tyres",
    category: "dumper",
    lengthFt: 18,
    widthFt: 7.8,
    heightFt: 3.5,
    heightRef: "side wall",
    capacityKg: [16000, 20000],
    volumeM3: 14,
    bestFor: "Higher-volume bulk transport for site and infrastructure work.",
    cargo: ["Bulk aggregates", "Sand", "Approved bulk material"],
    loading: "Excavator / loader top-loading, hydraulic rear tipping",
    drawing: { cab: "hcv", body: "tipper", deckFt: 4.3, wheelFt: 1.7, cabHeightFt: 9.8, axles: [3.0, 7.1, 22.6] },
    verified: false,
  },
  {
    id: "tipper-12w",
    name: "12 Wheeler Tipper",
    spec: "Tipper · 4 axles · 12 tyres",
    category: "dumper",
    lengthFt: 20,
    widthFt: 8,
    heightFt: 4,
    heightRef: "side wall",
    capacityKg: [20000, 25000],
    volumeM3: 18,
    bestFor: "Larger approved construction and industrial bulk loads.",
    cargo: ["Industrial bulk", "Construction fill", "Aggregates"],
    loading: "Excavator / loader top-loading, hydraulic rear tipping",
    drawing: { cab: "hcv", body: "tipper", deckFt: 4.4, wheelFt: 1.7, cabHeightFt: 9.8, axles: [3.2, 7.3, 22.2, 26.6] },
    verified: false,
  },
];

export const formatKg = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toLocaleString("en-IN", { maximumFractionDigits: 1 })} t` : `${kg} kg`;

export const formatCapacity = ([min, max]: [number, number]) =>
  min === max
    ? `${min.toLocaleString("en-IN")} kg`
    : max >= 1000
      ? `${(min / 1000).toLocaleString("en-IN")}–${(max / 1000).toLocaleString("en-IN")} t`
      : `${min}–${max} kg`;

export const formatFt = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} ft`;

export const VEHICLE_DISCLAIMER =
  "Dimensions and payloads are typical figures for each vehicle class in India, shown to help you plan — not a guarantee for a specific truck. The lawful payload of any vehicle depends on its registered gross vehicle weight, unladen weight, axle limits and body build; wheel count alone does not decide capacity. Our operations team confirms the exact vehicle, its specification and availability for every enquiry.";

export const vehicle = (id: string) => VEHICLES.find((v) => v.id === id)!;
