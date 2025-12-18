// src/utils/user.ts
export function emailInitials(email?: string | null) {
  const v = (email ?? "").trim().toLowerCase();
  if (!v) return "GU";
  const name = v.split("@")[0] || v;
  const letters = name.replace(/[^a-z0-9]/g, "").slice(0, 2);
  return (letters || "GU").toUpperCase();
}

export function shortEmail(email?: string | null) {
  const v = (email ?? "").trim();
  if (!v) return "";
  if (v.length <= 28) return v;
  return v.slice(0, 14) + "…" + v.slice(-10);
}
