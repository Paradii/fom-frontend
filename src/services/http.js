import { clearToken, getToken } from "@/services/token";

const BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api/v1`;

const toCamel = (text) => {
  return text.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
};

const toSnake = (text) => {
  return text.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
};

const convertKeys = (value, convert) => {
  if (Array.isArray(value)) return value.map((v) => convertKeys(v, convert));
  if (value && typeof value === "object") {
    const result = {};
    Object.keys(value).forEach((key) => {
      result[convert(key)] = convertKeys(value[key], convert);
    });
    return result;
  }
  return value;
};

const ERROR_TEXT = {
  400: "ข้อมูลไม่ถูกต้อง",
  401: "กรุณาเข้าสู่ระบบใหม่",
  403: "ไม่มีสิทธิ์ทำรายการนี้",
  404: "ไม่พบข้อมูล",
  409: "ข้อมูลมีการเปลี่ยนแปลง กรุณาโหลดใหม่",
  410: "รายการหมดอายุแล้ว",
  422: "ข้อมูลไม่ถูกต้อง",
};

export class ApiError extends Error {
  constructor(status, message, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

const DETAIL_TEXT = [
  ["This shop is not accepting orders", "ร้านปิดรับคำสั่งซื้ออยู่"],
  ["does not meet this shop's minimum", "ยอดอาหารยังไม่ถึงขั้นต่ำของร้าน"],
  ["menus are unavailable", "มีเมนูที่หมดแล้ว กรุณาตรวจตะกร้าอีกครั้ง"],
  ["options are unavailable", "มีตัวเลือกที่หมดแล้ว กรุณาเลือกใหม่"],
  ["Please select an option", "กรุณาเลือกตัวเลือกให้ครบ"],
  ["saved delivery addresses", "กรุณาเลือกที่อยู่จัดส่ง"],
  ["PromptPay ID", "ร้านยังไม่ได้ตั้งพร้อมเพย์ จึงชำระเงินไม่ได้"],
  ["Payment QR has expired", "QR หมดอายุแล้ว"],
  ["no longer waiting for a slip", "แนบสลิปไปแล้ว รอตรวจอยู่"],
  ["already claimed this batch", "รอบส่งนี้มีคนรับไปแล้ว"],
  ["already assigned to a delivery batch", "คำสั่งซื้อนี้อยู่ในรอบส่งแล้ว"],
  ["Invalid order status transition", "สถานะคำสั่งซื้อเปลี่ยนไปแล้ว กรุณาโหลดใหม่"],
];

const hasThai = (text) => /[฀-๿]/.test(text);

const getErrorMessage = (status, body) => {
  const detail = body?.detail;
  if (typeof detail === "string") {
    if (hasThai(detail)) return detail;
    const found = DETAIL_TEXT.find(([key]) => detail.includes(key));
    if (found) return found[1];
  }
  return ERROR_TEXT[status] || "เกิดข้อผิดพลาด กรุณาลองใหม่";
};

// ทุก response ของ backend ห่อเป็น { message, data } และใช้ snake_case
// ฟังก์ชันนี้แกะ data ออกมาและแปลงชื่อฟิลด์เป็น camelCase ให้
export const request = async (method, path, options = {}) => {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  Object.entries(options.params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    url.searchParams.set(toSnake(key), value);
  });

  const headers = { "Content-Type": "application/json" };
  const hasOwnToken = "token" in options;
  const token = hasOwnToken ? options.token : getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(convertKeys(options.body, toSnake)) : undefined,
    });
  } catch (err) {
    throw new ApiError(0, "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้", err);
  }

  const body = await resp.json().catch(() => null);
  if (!resp.ok) {
    if (resp.status === 401 && !hasOwnToken) clearToken();
    throw new ApiError(resp.status, getErrorMessage(resp.status, body), body?.detail);
  }
  return convertKeys(body?.data ?? body, toCamel);
};

export const api = {
  get: (path, params, options) => request("GET", path, { ...options, params }),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};
