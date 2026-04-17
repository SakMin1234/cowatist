// Simple keyword-based content moderation for commission descriptions.
// Returns the matched terms, empty array means clean.
const PROHIBITED_TERMS = [
  "nsfw", "porn", "porno", "sex", "nude", "naked",
  "gore", "blood", "decapitat", "dismember",
  "rape", "incest", "pedo", "loli", "shota",
  "kill", "murder", "suicide", "self-harm",
  "bestiality", "zoophilia",
  "racist", "nazi", "swastika",
];

export function detectProhibitedContent(text: string): string[] {
  const lower = text.toLowerCase();
  return PROHIBITED_TERMS.filter((term) => lower.includes(term));
}
