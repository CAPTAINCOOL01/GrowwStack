/**
 * An enquiry nobody can reply to is not a lead, so the short forms need at
 * least one working contact method before anything is saved or counted.
 */
export function contactProblem(email: string, phone: string): string | null {
  const e = email.trim();
  const p = phone.trim();
  if (!e && !p) return "Add an email address or phone number so we can reply.";
  if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Check the email address.";
  if (p && p.replace(/\D/g, "").length < 8) return "Check the phone number.";
  return null;
}
