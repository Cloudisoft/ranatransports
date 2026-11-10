/** Only these three people appear on the public website. */
export type Leader = {
  id: "dinesh" | "jalpesh" | "tej";
  name: string;
  honorific?: string;
  role: string;
  generation: string;
  years: string;
  photo?: string;
  photoAlt?: string;
  initials: string;
  summary: string;
};

export const LEADERS: Leader[] = [
  {
    id: "dinesh",
    honorific: "Late Shri",
    name: "Dinesh Vasantlal Rana",
    role: "Founder — Dinesh Transport",
    generation: "First Generation",
    years: "7 April 1947 – 10 May 2021",
    photo: "/people/dinesh-rana-portrait.jpg",
    photoAlt: "Late Shri Dinesh Vasantlal Rana",
    initials: "DR",
    summary:
      "The founder whose determination and hard work established the beginning of the family transportation business. His belief in responsibility, perseverance and honest effort remains the foundation of our legacy.",
  },
  {
    id: "jalpesh",
    name: "Jalpesh Rana",
    role: "Second-Generation Successor & Business Expansion Leader",
    generation: "Second Generation",
    years: "Expansion from c. 2015–2016",
    photo: "/people/jalpesh-rana-portrait.jpg",
    photoAlt: "Jalpesh Rana",
    initials: "JR",
    summary:
      "Jalpesh Rana carried forward the founder's work, contributing to stronger transportation operations, commercial relationships and long-term business continuity. His contribution helped prepare the business for the opportunities of the next generation.",
  },
  {
    id: "tej",
    name: "Tej Rana",
    role: "Chief Executive Officer",
    generation: "Third Generation",
    years: "Joined 2021",
    // Add an approved photograph at /public/people/tej-rana-portrait.jpg and set `photo` here.
    photo: undefined,
    photoAlt: "Tej Rana",
    initials: "TR",
    summary:
      "Tej Rana represents the future of Rana Transport & Logistics. Joining the business in 2021, he brought a fresh perspective to a family enterprise built through decades of transportation work. His leadership is focused on developing corporate relationships, exploring new commercial opportunities, modernizing business systems and strengthening the company's logistics identity.",
  },
];

export const leader = (id: Leader["id"]) => LEADERS.find((l) => l.id === id)!;

export const DIRECTION = [
  { title: "Growth with Purpose", body: "Developing commercial transportation opportunities through thoughtful long-term planning." },
  { title: "Strong Business Relationships", body: "Building professional connections with clients, suppliers and transportation partners." },
  { title: "Modern Logistics Thinking", body: "Preparing the business for more effective digital communication, shipment visibility and operational coordination." },
  { title: "Respect for Our Foundation", body: "Maintaining the values established by the founder while working towards future opportunities." },
];
