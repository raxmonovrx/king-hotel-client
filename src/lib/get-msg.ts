export function getMsg(r?: any, fallback = "Ошибка. Попробуйте позже.") {
  return (
    r?.data?.message ||
    r?.data?.msg ||
    r?.error?.data?.message ||
    r?.error?.data?.msg ||
    r?.error?.message ||
    fallback
  );
}
