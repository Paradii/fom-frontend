const TOKEN_KEY = "fom_token";
const RIDER_KEY = "fom_rider_token";

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // เบราว์เซอร์ปิด storage ไว้ ใช้ได้แค่ระหว่างเปิดหน้านี้
  }
};

export const getToken = () => read(TOKEN_KEY);
export const setToken = (token) => write(TOKEN_KEY, token);
export const clearToken = () => write(TOKEN_KEY, null);

// token ของคนส่งผูกกับรอบส่ง (batch) แยกจาก token ผู้ใช้ที่ล็อกอิน
export const getRiderToken = (batchToken) => read(`${RIDER_KEY}:${batchToken}`);
export const setRiderToken = (batchToken, token) => {
  write(`${RIDER_KEY}:${batchToken}`, token);
};
