import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  truck: (
    <>
      <path d="M2 6.5h11v9H2z" />
      <path d="M13 9.5h4.2l3.3 3.4v2.6H13z" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <path d="M8.2 5H15a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 0 0 7h6.8" />
    </>
  ),
  legacy: (
    <>
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7M3 12.5h18" />
    </>
  ),
  quote: (
    <>
      <path d="M5 3.5h10l4 4v13H5z" />
      <path d="M15 3.5v4h4M8.5 12h7M8.5 15.5h7M8.5 8.5h3" />
    </>
  ),
  sync: (
    <>
      <path d="M20 11a8 8 0 0 0-14.3-4.6L4 8M4 13a8 8 0 0 0 14.3 4.6L20 16" />
      <path d="M4 3.5V8h4.5M20 20.5V16h-4.5" />
    </>
  ),
  gps: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path d="M5 3.5h3.3l1.6 4.2-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.2 1.6V19a1.7 1.7 0 0 1-1.8 1.7A16.6 16.6 0 0 1 3.3 5.3 1.7 1.7 0 0 1 5 3.5z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 4v15M6 13l6 6 6-6" />,
  check: <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />,
  close: <path d="M5 5l14 14M19 5L5 19" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M7 4.5v15l12.5-7.5z" />,
  pause: <path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" />,
  replay: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5" />
      <path d="M4 3.5v5h5" />
    </>
  ),
  volumeOn: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  volumeOff: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </>
  ),
  box: (
    <>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20.5V10l5 3V10l5 3V5h4l1 4.5V20.5z" />
      <path d="M7 17h2M11 17h2M15 17h2" />
    </>
  ),
  network: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7 6h10M6 8l5 8.3M18 8l-5 8.3" />
    </>
  ),
  shield: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />,
  handshake: (
    <>
      <path d="M2.5 11.5l4-4 4 1.5 2.5-1.5 4 .5 4.5 3.5" />
      <path d="M6.5 7.5l-4 4 6 6 2-1.5 2 1.5 6-5.5M9.5 12.5l2.5 2.5M12 10.5l3 3" />
    </>
  ),
  spark: <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.3 5.3l3.5 3.5M15.2 15.2l3.5 3.5M5.3 18.7l3.5-3.5M15.2 8.8l3.5-3.5" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z"
    />
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
