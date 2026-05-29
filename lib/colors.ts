// Donia palette as TS constants, mirroring the prototype `C` object.
// Used in inline styles where Tailwind v4 arbitrary values would be too verbose.
export const C = {
  bg: "#F4E9D6",
  surface: "#FFFFFF",
  ink: "#2A0F1A",
  ink2: "#6F4A5A",
  ink3: "#B59AA5",
  line: "rgba(42,15,26,0.08)",
  coral: "#F4486F",
  coralDeep: "#D62E55",
  indigo: "#41087B",
  indigoDeep: "#2A0454",
  mango: "#F9A01C",
  mangoDeep: "#D9871F",
  pink: "#ED4673",
  mint: "#5DBFA0",
  plum: "#7B278C",
  green: "#5C8A45",
  creamSoft: "#FDF7F6",
} as const;

export type ColorKey = keyof typeof C;
