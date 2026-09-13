export const CATEGORIES = [
  "Consumer App",
  "Hardware",
  "Agriculture",
  "Fintech",
  "Health",
  "Climate",
  "Retail",
];

export function formatMoney(n) {
  return "$" + Number(n || 0).toLocaleString("en-US");
}
