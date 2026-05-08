// Founder / company developer override.
// These emails get unlimited access to all paid features without payment.
export const FOUNDER_EMAILS = [
  'ratankumar4937@gmail.com',
];

export function isFounder(email?: string | null): boolean {
  if (!email) return false;
  return FOUNDER_EMAILS.includes(email.toLowerCase().trim());
}
