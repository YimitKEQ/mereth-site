import type { SVGProps } from "react";

/**
 * Inline icons, sized to 1em so they inherit the text size.
 *
 * Deliberately a hand-rolled set rather than an icon package: the site needs
 * about a dozen glyphs and a dependency would outweigh them.
 */

type Props = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: Props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChevronDown = (props: Props) => (
  <Icon {...props}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const ChevronUp = (props: Props) => (
  <Icon {...props}>
    <path d="M18 15l-6-6-6 6" />
  </Icon>
);

export const Menu = (props: Props) => (
  <Icon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const X = (props: Props) => (
  <Icon {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

export const Search = (props: Props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
);

export const User = (props: Props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </Icon>
);

export const Calendar = (props: Props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 11h18" />
  </Icon>
);

export const Copy = (props: Props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 012-2h10" />
  </Icon>
);

export const Download = (props: Props) => (
  <Icon {...props}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
    <path d="M4 19h16" />
  </Icon>
);

export const Discord = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M19.3 5.3A16.8 16.8 0 0015.1 4l-.2.4a12.6 12.6 0 00-5.8 0L8.9 4a16.8 16.8 0 00-4.2 1.3C2.1 9.2 1.4 13 1.7 16.7a16.9 16.9 0 005.1 2.6l.6-1.7a11 11 0 01-1.7-.8l.4-.3a12.1 12.1 0 0011.8 0l.4.3a11 11 0 01-1.7.8l.6 1.7a16.9 16.9 0 005.1-2.6c.4-4.3-.7-8.1-2.5-11.4zM8.9 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z" />
  </svg>
);

export const Facebook = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3z" />
  </svg>
);

export const YouTube = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M21.6 7.2s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2h-.02s-4 0-6.8.2c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.75.8 1.75.75 2.2.85 1.6.15 6.8.2 6.8.2s4 0 6.8-.21c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.6-.2-3.3-.2-3.3zM9.9 14.2V8.6l5.2 2.8-5.2 2.8z" />
  </svg>
);

export const Check = (props: Props) => (
  <Icon {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Icon>
);

export const Book = (props: Props) => (
  <Icon {...props}>
    <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3z" />
    <path d="M4 17a3 3 0 013-3h11" />
  </Icon>
);

export const Shield = (props: Props) => (
  <Icon {...props}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  </Icon>
);

export const Coins = (props: Props) => (
  <Icon {...props}>
    <ellipse cx="12" cy="7" rx="8" ry="3.5" />
    <path d="M4 7v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V7" />
    <path d="M4 12v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-5" />
  </Icon>
);

export const Bag = (props: Props) => (
  <Icon {...props}>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </Icon>
);

export const Ticket = (props: Props) => (
  <Icon {...props}>
    <path d="M3 9a2 2 0 002-2h14a2 2 0 002 2v1a2 2 0 000 4v1a2 2 0 00-2 2H5a2 2 0 00-2-2v-1a2 2 0 000-4z" />
  </Icon>
);

export const Sparkle = (props: Props) => (
  <Icon {...props}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Icon>
);

/**
 * Quiet mode, on and off.
 *
 * A waning moon for "settle down", a sun for "bring the decoration back". Both
 * read at 16px, which a more literal pair of glyphs (a wave and a flourish) did
 * not.
 */
export const Calm = (props: Props) => (
  <Icon {...props}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </Icon>
);

export const Ornate = (props: Props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
  </Icon>
);
