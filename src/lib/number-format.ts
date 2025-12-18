export function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

export function groupThousands(digits: string) {
  if (!digits) return "";
  // 3000 -> "3 000"
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
