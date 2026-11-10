/**
 * Vehicle catalogue.
 *
 * IMPORTANT: every figure below is an ILLUSTRATIVE planning range supplied in the
 * website brief. Actual permissible payload depends on the specific vehicle's
 * registered gross weight, unladen weight, axle limits, body configuration and
 * route regulations. Set `verified: true` (and replace the ranges) only once the
 * operations team confirms the exact vehicle specification.
 */
export type VehicleCategory = "small" | "medium" | "heavy" | "dumper" | "container";

export type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  payload: string;
  body: string;
  bestFor: string;
  cargo: string[];
  loading: string;
  art: "three-wheeler" | "mini" | "pickup" | "lcv" | "truck6" | "truck8" | "truck10" | "truck12" | "dumper" | "container";
  axles?: number;
  verified: boolean;
};

export const VEHICLE_FILTERS: { id: VehicleCategory | "all"; label: string }[] = [
  { id: "all", label: "All Vehicles" },
  { id: "small", label: "Small Commercial" },
  { id: "medium", label: "Medium Commercial" },
  { id: "heavy", label: "Heavy Commercial" },
  { id: "dumper", label: "Dumpers" },
  { id: "container", label: "Long-Haul / Container" },
];

export const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  small: "Small Commercial",
  medium: "Medium Commercial",
  heavy: "Heavy Commercial",
  dumper: "Dumper",
  container: "Container & Long-Haul",
};

export const VEHICLES: Vehicle[] = [
  {
    id: "three-wheeler",
    name: "Three-Wheeler",
    category: "small",
    payload: "Up to 500 kg",
    body: "5–6 ft",
    bestFor: "Small cartons, retail goods and light local cargo.",
    cargo: ["Cartons", "Retail goods", "Light parcels"],
    loading: "Open or closed cargo deck, manual loading",
    art: "three-wheeler",
    verified: false,
  },
  {
    id: "mini-truck",
    name: "Tata Ace",
    category: "small",
    payload: "Up to 750 kg",
    body: "6–7 ft",
    bestFor: "Local business cargo, retail supply and small commercial loads.",
    cargo: ["Retail supply", "Local deliveries", "Small commercial loads"],
    loading: "Open deck with side boards, manual loading",
    art: "mini",
    verified: false,
  },
  {
    id: "pickup-8ft",
    name: "Pickup 8 ft",
    category: "medium",
    payload: "Up to 1,250 kg",
    body: "Approx. 8 ft",
    bestFor: "Commercial packages and medium-sized goods.",
    cargo: ["Commercial packages", "Medium goods", "Equipment"],
    loading: "Open deck, rear tailgate loading",
    art: "pickup",
    verified: false,
  },
  {
    id: "lcv-1-7",
    name: "1.7 Ton Vehicle",
    category: "medium",
    payload: "Up to 1,700 kg",
    body: "9–10 ft",
    bestFor: "Larger light-commercial loads.",
    cargo: ["Palletised goods", "Distributor stock", "Light industrial goods"],
    loading: "Open or containerised body, rear loading",
    art: "lcv",
    verified: false,
  },
  {
    id: "truck-6w",
    name: "6 Wheeler Truck",
    category: "heavy",
    payload: "6–9 tonnes",
    body: "14–19 ft",
    bestFor: "Medium-to-heavy commercial freight.",
    cargo: ["Commercial freight", "Bagged goods", "Industrial supplies"],
    loading: "Open body or closed container, dock or manual loading",
    art: "truck6",
    axles: 2,
    verified: false,
  },
  {
    id: "truck-8w",
    name: "8 Wheeler Truck",
    category: "heavy",
    payload: "10–14 tonnes",
    body: "17–22 ft",
    bestFor: "Larger commercial and industrial shipments.",
    cargo: ["Industrial shipments", "Bulk bags", "Building materials"],
    loading: "Open body, side and rear loading",
    art: "truck8",
    axles: 3,
    verified: false,
  },
  {
    id: "truck-10w",
    name: "10 Wheeler Truck",
    category: "heavy",
    payload: "15–20 tonnes",
    body: "20–24 ft",
    bestFor: "High-volume road freight and heavier business loads.",
    cargo: ["High-volume freight", "Steel & metal products", "FMCG full loads"],
    loading: "Open body or closed container, crane / forklift / manual",
    art: "truck10",
    axles: 3,
    verified: false,
  },
  {
    id: "truck-12w",
    name: "12 Wheeler Truck",
    category: "heavy",
    payload: "20–25 tonnes",
    body: "22–28 ft",
    bestFor: "Larger freight movement and eligible industrial cargo.",
    cargo: ["Industrial cargo", "Full truckloads", "Long-distance freight"],
    loading: "Open body, side and rear loading",
    art: "truck12",
    axles: 4,
    verified: false,
  },
  {
    id: "dumper-6w",
    name: "6 Wheeler Dumper",
    category: "dumper",
    payload: "6–10 tonnes",
    body: "Configuration-dependent",
    bestFor: "Eligible construction and bulk material movements.",
    cargo: ["Sand", "Soil", "Aggregates"],
    loading: "Excavator / loader top-loading, hydraulic tipping",
    art: "dumper",
    axles: 2,
    verified: false,
  },
  {
    id: "dumper-8w",
    name: "8 Wheeler Dumper",
    category: "dumper",
    payload: "10–16 tonnes",
    body: "Configuration-dependent",
    bestFor: "Approved site and construction material loads.",
    cargo: ["Aggregates", "Construction fill", "Soil"],
    loading: "Excavator / loader top-loading, hydraulic tipping",
    art: "dumper",
    axles: 3,
    verified: false,
  },
  {
    id: "dumper-10w",
    name: "10 Wheeler Dumper",
    category: "dumper",
    payload: "16–22 tonnes",
    body: "Configuration-dependent",
    bestFor: "Higher-volume eligible bulk transport.",
    cargo: ["Bulk aggregates", "Sand", "Approved bulk material"],
    loading: "Excavator / loader top-loading, hydraulic tipping",
    art: "dumper",
    axles: 3,
    verified: false,
  },
  {
    id: "dumper-12w",
    name: "12 Wheeler Dumper",
    category: "dumper",
    payload: "20–25 tonnes",
    body: "Configuration-dependent",
    bestFor: "Larger approved construction and industrial bulk loads.",
    cargo: ["Industrial bulk", "Construction material", "Aggregates"],
    loading: "Excavator / loader top-loading, hydraulic tipping",
    art: "dumper",
    axles: 4,
    verified: false,
  },
  {
    id: "container-longhaul",
    name: "Container & Long-Haul Trucks",
    category: "container",
    payload: "Confirmed on enquiry",
    body: "Confirmed on enquiry",
    bestFor: "Cargo requiring enclosed bodies, larger load space or long-distance arrangements.",
    cargo: ["Enclosed cargo", "Long-haul freight", "Weather-sensitive goods"],
    loading: "Closed container body, dock or rear loading",
    art: "container",
    verified: false,
  },
];

export const VEHICLE_DISCLAIMER =
  "All capacities and body sizes are preliminary illustrations, not confirmed company vehicle specifications. Actual permissible payload depends on the particular vehicle's registered gross weight, unladen weight, axle limits, body configuration, route restrictions and applicable regulations. Wheel count alone does not determine capacity. Availability is confirmed by our operations team for each requirement.";
