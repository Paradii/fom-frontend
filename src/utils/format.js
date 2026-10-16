import dayjs from "dayjs";

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

export const onlyDigits = (value) => {
  return String(value ?? "").replace(/\D/g, "");
};

export const formatBaht = (value) => {
  const digits = onlyDigits(value);
  return digits ? `${digits} บาท` : "";
};

export const formatThaiDate = (iso) => {
  return dayjs(iso).locale("th").format("D MMM BBBB");
};

export const formatDateTime = (iso) => {
  return dayjs(iso).locale("th").format("D MMM BBBB · HH:mm");
};

export const formatCountdown = (seconds) => {
  const minute = String(Math.floor(seconds / 60)).padStart(2, "0");
  const second = String(seconds % 60).padStart(2, "0");
  return `${minute}:${second}`;
};

export const maskPromptPay = (id) => {
  return `xxx-xxx-${onlyDigits(id).slice(-4)}`;
};
