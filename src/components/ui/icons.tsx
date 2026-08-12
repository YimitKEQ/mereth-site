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

