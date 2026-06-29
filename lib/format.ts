export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}$ ${digits}`;
}

const LOWERCASE_WORDS = new Set(["a", "al", "c", "con", "de", "del", "e", "en", "la", "las", "los", "o", "para", "por", "s", "sin", "y"]);
const PRESERVE_WORDS = new Set([
  "ACAI",
  "BCAA",
  "DDL",
  "KETO",
  "Q10",
  "TACC",
  "ZMA",
]);

function formatProductWord(word: string, index: number): string {
  const normalized = word.toLowerCase();
  const lettersOnly = word.replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9]/g, "").toUpperCase();

  if (PRESERVE_WORDS.has(lettersOnly)) return word.toUpperCase();
  if (index > 0 && LOWERCASE_WORDS.has(normalized)) return normalized;
  if (/\d/.test(word) || word.includes("&") || word.includes("/")) return word;

  return normalized.replace(/(^|[-"'(])([a-záéíóúüñ])/g, (match, prefix, char) =>
    `${prefix}${char.toUpperCase()}`,
  );
}

export function formatProductName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(formatProductWord)
    .join(" ");
}

export function parsePrice(value: string | number | undefined | null): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value > 0 ? value : undefined;

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^xx$/i, "")
    .replace(/^x$/i, "")
    .replace(/^-$/, "")
    .replace(/\$/g, "")
    .replace(/\s/g, "");

  if (!normalized || normalized === "xx" || normalized === "x" || normalized === "-") {
    return undefined;
  }

  const hasCommaDecimal =
    /,\d{1,2}$/.test(normalized) && !/\.\d{3}/.test(normalized.replace(/,\d{1,2}$/, ""));

  let numeric = normalized;
  if (hasCommaDecimal) {
    numeric = normalized.replace(/\./g, "").replace(",", ".");
  } else {
    numeric = normalized.replace(/\./g, "").replace(/,/g, "");
  }

  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
}
