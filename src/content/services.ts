export type Service = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  body: string;
  idealFor: string;
  cargo: string[];
  planning: string;
  visual: "highway" | "boxes" | "industrial" | "network" | "longhaul" | "heavy" | "dumper" | "corporate" | "fleet" | "ftl";
  /** Only services approved as available are shown. Flip to false to hide one. */
  approved: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "road-freight",
    title: "Road Freight Transportation",
    short: "Commercial goods movement for business supply chains.",
    intro: "Dependable road transportation begins with understanding the cargo, destination and delivery requirements.",
    body: "We support business transportation enquiries for commercial goods movement across local, regional and longer-distance routes.",
    idealFor: "Manufacturers, distributors, wholesalers, traders and commercial businesses.",
    cargo: ["Packaged goods", "Commercial cargo", "Raw materials", "Finished products"],
    planning: "We review load size, route and timing, then recommend a suitable vehicle class before quoting.",
    visual: "highway",
    approved: true,
  },
  {
    slug: "commercial-goods",
    title: "Commercial Goods Transportation",
    short: "Regular movement of products, materials and supplies.",
    intro: "Businesses depend on regular movement of products, materials and supplies.",
    body: "Our commercial transportation approach focuses on understanding load requirements, coordinating suitable vehicles and supporting business logistics needs.",
    idealFor: "Retail supply chains, wholesale distribution, packaged products and general commercial cargo.",
    cargo: ["Cartons & packaged products", "Retail stock", "Wholesale consignments"],
    planning: "Share dispatch frequency and typical load; we discuss a practical vehicle and scheduling arrangement.",
    visual: "boxes",
    approved: true,
  },
  {
    slug: "industrial-cargo",
    title: "Industrial Cargo Transportation",
    short: "Industrial materials, manufactured products and commercial loads.",
    intro: "Industrial transportation requires careful consideration of cargo size, weight, handling needs and destination.",
    body: "We assist businesses with enquiries for suitable transportation solutions for approved industrial and manufacturing-related goods, subject to cargo compatibility.",
    idealFor: "Manufacturing supplies, production materials, machinery components and eligible industrial cargo.",
    cargo: ["Production materials", "Machinery components", "Manufactured goods"],
    planning: "Dimensions, weight and handling needs are reviewed for lawful vehicle suitability before confirmation.",
    visual: "industrial",
    approved: true,
  },
  {
    slug: "regional-intercity",
    title: "Regional & Intercity Transportation",
    short: "Coordination within Gujarat and nearby business regions.",
    intro: "Connect business destinations through transportation planning that considers distance, route availability and shipment requirements.",
    body: "Our Gujarat foundation supports a strategic focus on transportation connectivity between regional business centres and major commercial destinations.",
    idealFor: "Intercity business movements, distributor supply and regional goods transport.",
    cargo: ["Distributor supply", "Intercity consignments", "Regional goods"],
    planning: "Tell us both locations and preferred dates; we confirm route and vehicle availability.",
    visual: "network",
    approved: true,
  },
  {
    slug: "long-distance",
    title: "Intercity & Long-Distance Transportation",
    short: "Shipments between commercial and industrial destinations.",
    intro: "Long-distance cargo movement needs appropriate vehicle allocation, route planning and clear communication.",
    body: "Our approach supports businesses seeking transportation between important commercial and industrial destinations across India.",
    idealFor: "Intercity freight, corporate supply chains and long-haul commercial goods.",
    cargo: ["Long-haul freight", "Corporate supply", "Inter-state consignments"],
    planning: "Routes, transit planning and communication checkpoints are agreed before dispatch.",
    visual: "longhaul",
    approved: true,
  },
  {
    slug: "heavy-commercial",
    title: "Heavy Commercial Transportation",
    short: "Vehicles suited to larger dimensions, weights and volumes.",
    intro: "Larger shipments require vehicles suited to their dimensions, weight and loading requirements.",
    body: "Explore suitable heavy commercial vehicle categories for approved high-volume and industrial loads.",
    idealFor: "Bulk commercial loads, industrial products and higher-volume freight.",
    cargo: ["High-volume freight", "Industrial products", "Bulk commercial loads"],
    planning: "Payload is matched to the specific vehicle's permitted capacity — never wheel count alone.",
    visual: "heavy",
    approved: true,
  },
  {
    slug: "dumper-construction",
    title: "Bulk Cargo & Construction Materials",
    short: "Dumper and heavy vehicle options for eligible bulk material.",
    intro: "Construction and infrastructure activities often require dedicated vehicles for loose and bulk materials.",
    body: "We support enquiries for dumper transportation suited to eligible construction materials and site requirements.",
    idealFor: "Sand, soil, aggregates and approved construction materials.",
    cargo: ["Sand", "Soil", "Aggregates", "Approved construction material"],
    planning: "Material density, site access and body volume are considered when proposing a dumper configuration.",
    visual: "dumper",
    approved: true,
  },
  {
    slug: "corporate",
    title: "Corporate Transportation Solutions",
    short: "Recurring and contract-based business transportation.",
    intro: "Business transportation requirements can extend beyond a single shipment.",
    body: "We welcome corporate enquiries involving repeat movements, recurring dispatches, ongoing supply needs and commercial transport arrangements.",
    idealFor: "Manufacturers, distributors, corporate buyers and businesses with repeat transportation requirements.",
    cargo: ["Recurring dispatches", "Scheduled supply", "Contract movements"],
    planning: "We discuss volumes, lanes and frequency to structure a recurring arrangement.",
    visual: "corporate",
    approved: true,
  },
  {
    slug: "fleet-coordination",
    title: "Fleet & Vehicle Coordination",
    short: "Vehicle sourcing, assignment and coordination.",
    intro: "Choosing an appropriate vehicle is an important part of transportation planning.",
    body: "Our team can review vehicle requirements, load information and scheduling considerations to help coordinate suitable transport arrangements, according to verified operational capabilities.",
    idealFor: "Businesses needing help selecting and scheduling the right vehicle class.",
    cargo: ["Mixed requirements", "Multi-vehicle movements"],
    planning: "Load information and schedules are matched to available, suitable vehicles.",
    visual: "fleet",
    approved: true,
  },
  {
    slug: "full-truckload",
    title: "Full Truckload & Bulk Transport",
    short: "Dedicated vehicle enquiries for larger shipments.",
    intro: "For larger shipments, dedicated full-truck transport arrangements may be appropriate.",
    body: "Contact our team to discuss shipment volume, weight, route and vehicle requirements, subject to availability.",
    idealFor: "Wholesalers, distributors and manufacturers moving full loads.",
    cargo: ["Full truckloads", "Bulk consignments", "B2B distribution"],
    planning: "Volume, weight and route are reviewed to propose a dedicated vehicle.",
    visual: "ftl",
    approved: true,
  },
];

export const APPROVED_SERVICES = SERVICES.filter((s) => s.approved);
