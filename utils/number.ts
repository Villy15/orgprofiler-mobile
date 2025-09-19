export const toNum = (s: string, fallback = 0) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
};
