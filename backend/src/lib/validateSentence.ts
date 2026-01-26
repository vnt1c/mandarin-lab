export type ValidateResult =
  | { ok: true; value: string }
  | { ok: false; code: string; message: string };

const MAX_LEN = 50;
const MIN_LEN = 1;

// Common Chinese punctuation (plus ASCII you listed)
const ALLOWED_RE =
  /^[\p{Script=Han}\p{Nd}A-Za-z，。！？、；：：「」『』（）《》【】“”‘’…—·.,?!\s]+$/u;

// Disallow invisible/format/control/surrogate categories
// - Cc: control
// - Cf: format/invisible
// - Cs: surrogate
const DISALLOWED_C_RE = /[\p{Cc}\p{Cf}\p{Cs}]/u;

// Repeated punctuation cap (tune)
const REPEAT_PUNCT_RE = /([，。！？、；])\1{3,}/u;      // 4+ same Chinese punct
const REPEAT_ASCII_PUNCT_RE = /([.!?,])\1{3,}/u;     // 4+ same ASCII punct

export function validateChineseSentence(raw: unknown): ValidateResult {
  if (typeof raw !== "string") {
    return { ok: false, code: "type", message: "sentence must be a string" };
  }

  // Step 0: normalize + trim
  let s = raw.normalize("NFKC").trim();

  // Optional: collapse all whitespace to single spaces
  s = s.replace(/\s+/g, " ");

  if (s.length < MIN_LEN) {
    return { ok: false, code: "min_length", message: "sentence is empty" };
  }
  if (s.length > MAX_LEN) {
    return { ok: false, code: "max_length", message: `max length is ${MAX_LEN}` };
  }

  if (DISALLOWED_C_RE.test(s)) {
    return { ok: false, code: "disallowed_chars", message: "contains invisible/control characters" };
  }

  // Step 1: allowlist
  if (!ALLOWED_RE.test(s)) {
    return { ok: false, code: "charset", message: "contains unsupported characters" };
  }

  // Step 2: structural sanity
  if (!/\p{Script=Han}/u.test(s)) {
    return { ok: false, code: "no_han", message: "must contain at least one Chinese character" };
  }

  if (REPEAT_PUNCT_RE.test(s) || REPEAT_ASCII_PUNCT_RE.test(s)) {
    return { ok: false, code: "punct_repeat", message: "too much repeated punctuation" };
  }

  return { ok: true, value: s };
}
