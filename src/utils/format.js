export const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPrice = (price) => {
  return `฿${Number(price || 0).toLocaleString("th-TH")}`;
};

export const formatTime = (iso) => {
  return new Date(iso).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatLastDate = (iso) => {
  if (!iso) return "-";
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return `วันนี้ ${formatTime(iso)}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "เมื่อวาน";
  }
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
  });
};

const DAYS = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

export const formatDay = (date) => {
  const text = date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${DAYS[date.getDay()]} ${text}`;
};
