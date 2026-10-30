// ชั้นข้อมูลกลางของทุกหน้า
// - VITE_USE_MOCK=true  ใช้ข้อมูลจำลองใน mock/mockData.js เหมือนเดิม
// - ไม่ตั้งหรือ false   เรียก FOMBackend จริง แล้วเติมผลลง store เดิม (mockShop, mockOrders ...)
// หน้าจอยังอ่าน store แบบเดิม แต่ต้อง await ฟังก์ชัน fetchSave... และเรียก load... ก่อนแสดงผล
import liff from "@line/liff";
import * as mock from "@/mock/mockData";
import {
  mockAccounts,
  mockAddresses,
  mockBatches,
  mockCart,
  mockCategories,
  mockCustomers,
  mockMe,
  mockMenus,
  mockMyOrders,
  mockNearbyShops,
  mockOrders,
  mockOtherMenus,
  mockShop,
  mockTagRequests,
  mockTags,
  SHOP_CHIPS,
} from "@/mock/mockData";
import { api, ApiError } from "@/services/http";
import {
  clearToken,
  getRiderToken,
  getToken,
  setRiderToken,
  setToken,
} from "@/services/token";
import {
  toAccount,
  toAddress,
  toAddressPayload,
  toCategory,
  toCustomer,
  toMe,
  toMenu,
  toMenuPayload,
  toNearbyShop,
  toOrder,
  toShop,
  toShopHourPayload,
  toShopPayload,
  toTag,
} from "@/services/mapper";

export * from "@/mock/mockData";

const SHOP_ONLY_API = import.meta.env.VITE_SHOP_ONLY_API === "true";

export const isMockPath = (path) => {
  if (import.meta.env.VITE_USE_MOCK === "true") return true;
  if (!SHOP_ONLY_API) return false;
  return !path.startsWith("/shop") && !path.startsWith("/login");
};

export const USE_MOCK = isMockPath(window.location.pathname);

const SHOP_KEY = "fom_shop_id";
const ADDRESS_KEY = "fom_address_id";
const LOCATION_KEY = "fom_location_on";
const BATCH_KEY = "fom_batches";
const CART_KEY = "fom_cart";
const PDPA_VERSION = "1.0";

const listeners = new Set();

// แจ้งหน้าที่ฟังอยู่ (เช่น ดรอปดาวน์) ให้อ่าน store ใหม่หลังโหลดข้อมูลเสร็จ
export const onDataChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const ok = (extra = {}) => {
  listeners.forEach((fn) => fn());
  return { success: true, ...extra };
};
const fail = (err) => ({
  success: false,
  status: err?.status,
  message: err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
});

const replace = (list, rows) => {
  list.splice(0, list.length, ...rows);
};

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ไม่มี storage ก็ทำงานต่อได้ แค่จำค่าข้ามการรีเฟรชไม่ได้
  }
};

// โหมด API: ล้างข้อมูลตัวอย่างออกก่อน จะได้ไม่ปนกับข้อมูลจริง
if (!USE_MOCK) {
  [
    mockAccounts,
    mockAddresses,
    mockBatches,
    mockCategories,
    mockCustomers,
    mockMenus,
    mockMyOrders,
    mockNearbyShops,
    mockOrders,
    mockOtherMenus,
    mockTags,
  ].forEach((list) => list.splice(0, list.length));
  Object.keys(mockShop).forEach((key) => delete mockShop[key]);
  Object.assign(mockShop, { shopName: "", ownerName: " ", openHours: [] });
  Object.assign(mockMe, {
    customerId: null,
    displayName: " ",
    isNew: true,
    consentAt: null,
    isLocationOn: readJson(LOCATION_KEY, false),
    refundPromptPay: "",
    addressId: readJson(ADDRESS_KEY, null),
    deletedAt: null,
  });
  Object.assign(mockCart, readJson(CART_KEY, { shopId: null, items: [] }));
  SHOP_CHIPS.splice(1, SHOP_CHIPS.length);
}

/* ---------- เข้าสู่ระบบ ---------- */

export const isLoggedIn = () => USE_MOCK || Boolean(getToken());

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN;
let liffReady = null;

const initLiff = () => {
  if (!liffReady) liffReady = liff.init({ liffId: LIFF_ID });
  return liffReady;
};

const exchangeLineToken = async () => {
  try {
    const resp = await api.post("/auth/line", { idToken: liff.getIDToken() });
    setToken(resp.token);
  } catch (err) {
    if (err.status === 401) {
      liff.logout();
      liff.login();
    }
    throw err;
  }
};

// เรียกครั้งเดียวตอนเปิดแอป: ถ้าเพิ่งกลับมาจากหน้าเข้าสู่ระบบของ LINE
// liff.init จะอ่าน code ใน URL ให้เอง แล้วแลกเป็น token ของ FOM ทันที
export const initLine = async () => {
  if (import.meta.env.DEV && DEV_TOKEN && !getToken()) setToken(DEV_TOKEN);
  if (USE_MOCK || !LIFF_ID) return ok();
  try {
    await initLiff();
    if (liff.isLoggedIn() && !getToken()) await exchangeLineToken();
    return ok();
  } catch (err) {
    return fail(err);
  }
};

// ปุ่มเข้าสู่ระบบด้วย LINE: ยังไม่ล็อกอิน LINE ให้ไปหน้า LINE แล้วกลับมาที่ Endpoint URL ของ LIFF
export const loginWithLine = async () => {
  if (USE_MOCK) return ok();
  if (!LIFF_ID) {
    return fail({ message: "ยังไม่ได้ตั้งค่า VITE_LIFF_ID จึงเข้าสู่ระบบด้วย LINE ไม่ได้" });
  }
  try {
    await initLiff();
    if (!liff.isLoggedIn()) {
      // ไม่ส่ง redirectUri ให้ LINE กลับไปที่ Endpoint URL ที่ตั้งไว้ ถ้าส่งลิงก์ที่ไม่ตรงกัน LINE จะตอบ 400
      liff.login();
      return ok({ isRedirect: true });
    }
    await exchangeLineToken();
    await loadSession();
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const logout = async () => {
  if (!USE_MOCK) {
    await api.post("/auth/logout").catch(() => null);
    clearToken();
    if (LIFF_ID && liff.isLoggedIn?.()) liff.logout();
    writeJson(SHOP_KEY, null);
  }
  return ok();
};

const loadAccounts = async () => {
  let shops = [];
  try {
    shops = await api.get("/shops/mine");
  } catch (err) {
    // ลูกค้าที่ยังไม่มีร้านได้ 403 ถือว่าไม่มีร้าน
    if (!(err instanceof ApiError) || err.status !== 403) throw err;
  }
  replace(mockAccounts, [
    ...shops.map(toAccount),
    {
      accountId: "customer",
      accountType: "customer",
      accountName: mockMe.displayName,
      newOrderCount: 0,
    },
  ]);
  return shops;
};

const applyShop = async (row) => {
  const hours = await api.get(`/shops/${row.shopId}/hours`);
  Object.keys(mockShop).forEach((key) => delete mockShop[key]);
  Object.assign(mockShop, toShop(row, hours, mockMe.displayName));
  writeJson(SHOP_KEY, row.shopId);
};

// โหลดข้อมูลผู้ใช้ บัญชีร้าน และร้านที่เลือกไว้ล่าสุด เรียกครั้งเดียวตอนเปิดแอป
export const loadSession = async () => {
  if (USE_MOCK || !getToken()) return ok();
  try {
    const me = await api.get("/profile/me");
    Object.assign(mockMe, toMe(me));
    const shops = await loadAccounts();
    const savedId = readJson(SHOP_KEY, null);
    const shop = shops.find((s) => s.shopId === savedId) || shops[0];
    if (shop) await applyShop(shop);
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- ร้านค้า ---------- */

export const fetchSaveShop = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveShop(payload);
  try {
    if (payload.actionType === "open") {
      const row = await api.patch(`/shops/${mockShop.shopId}`, {
        isOpen: payload.isOpen,
      });
      mockShop.isOpen = Boolean(row.isOpen);
    }
    if (payload.actionType === "U") {
      const shop = { ...mockShop, ...payload.shop };
      const body = toShopPayload(shop);
      const row = await api.patch(`/shops/${mockShop.shopId}`, body);
      await Promise.all(
        (shop.openHours || []).map((hour, weekday) => {
          return api.put(
            `/shops/${mockShop.shopId}/hours`,
            toShopHourPayload({ ...hour, weekday }),
          );
        }),
      );
      await applyShop(row);
      await loadAccounts();
    }
    if (payload.actionType === "request") {
      const row = await api.post("/shops", {
        ...toShopPayload({ ...payload.shop, description: payload.shop.address }),
        latitude: payload.shop.latitude,
        longitude: payload.shop.longitude,
      });
      await loadAccounts();
      await applyShop(row);
    }
    if (payload.actionType === "switch") {
      const shops = await api.get("/shops/mine");
      const row = shops.find((s) => s.shopId === payload.accountId);
      if (!row) return fail({ message: "ไม่พบร้านนี้" });
      await applyShop(row);
      replace(mockOrders, []);
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- เมนู หมวดหมู่ แท็ก ---------- */

export const loadTags = async () => {
  if (USE_MOCK) return ok();
  try {
    const rows = await api.get("/tags");
    replace(mockTags, rows.map(toTag));
    return ok();
  } catch (err) {
    return fail(err);
  }
};

const loadCategories = async (shopId) => {
  const rows = await api.get("/categories");
  return rows.filter((r) => r.shopId === shopId).map(toCategory);
};

const loadMenusOf = async (shopId, categories, availableOnly) => {
  const resp = await api.get("/menus", {
    shopId,
    availableOnly,
    limit: 100,
  });
  return Promise.all(
    resp.items.map(async (row) => {
      const groups = await api.get(`/menus/${row.menuId}/options`);
      const old = mockMenus.find((m) => m.menuId === row.menuId);
      const menu = toMenu(row, categories, groups);
      // backend ยังไม่มี API อ่านแท็กของเมนู ใช้ค่าที่เคยบันทึกในรอบนี้แทน
      if (old) menu.tagIds = old.tagIds;
      return menu;
    }),
  );
};

// เมนูทั้งหมดของร้านที่เลือกอยู่ (รวมเมนูที่ปิดขาย) สำหรับหน้า MNU01 / MNU02
export const loadMenus = async () => {
  if (USE_MOCK) return ok();
  if (!mockShop.shopId) return ok();
  try {
    const [categories] = await Promise.all([
      loadCategories(mockShop.shopId),
      mockTags.length ? null : loadTags(),
    ]);
    replace(mockCategories, categories);
    replace(mockMenus, await loadMenusOf(mockShop.shopId, categories, false));
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const fetchSaveCategory = async ({ categoryName }) => {
  if (USE_MOCK) {
    const categoryId = Math.max(0, ...mockCategories.map((c) => c.categoryId)) + 1;
    mockCategories.push({ categoryId, categoryName });
    return ok({ categoryId });
  }
  try {
    const row = await api.post("/categories", {
      shopId: mockShop.shopId,
      categoryName,
      sortOrder: mockCategories.length + 1,
    });
    mockCategories.push(toCategory(row));
    return ok({ categoryId: row.categoryId });
  } catch (err) {
    return fail(err);
  }
};

const saveOptionGroups = async (menuId, groups) => {
  // backend สร้างกลุ่มตัวเลือกได้อย่างเดียว แก้หรือลบกลุ่มเดิมยังไม่ได้
  for (const [index, group] of groups.entries()) {
    if (group.optionGroupId) continue;
    const row = await api.post(`/menus/${menuId}/option-groups`, {
      groupName: group.groupName,
      isRequired: group.isRequired,
      maxSelect: group.maxSelect,
      sortOrder: index + 1,
    });
    for (const [optionIndex, option] of group.options.entries()) {
      await api.post(`/option-groups/${row.optionGroupId}/options`, {
        optionName: option.optionName,
        extraPrice: option.extraPrice || 0,
        isAvailable: true,
        sortOrder: optionIndex + 1,
      });
    }
  }
};

const saveMenuTags = async (menuId, tagIds, oldTagIds = []) => {
  const added = tagIds.filter((id) => !oldTagIds.includes(id));
  const removed = oldTagIds.filter((id) => !tagIds.includes(id));
  await Promise.all([
    ...added.map((id) => api.post(`/menus/${menuId}/tags/${id}`)),
    ...removed.map((id) => api.delete(`/menus/${menuId}/tags/${id}`)),
  ]);
};

const toImageUrl = (url) => (/^https?:\/\//.test(url || "") ? url : null);

export const fetchSaveMenu = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveMenu(payload);
  try {
    if (payload.actionType === "A") {
      const menu = { ...payload.menu, imageUrl: toImageUrl(payload.menu.imageUrl) };
      const row = await api.post("/menus", toMenuPayload(menu, mockShop.shopId));
      await saveOptionGroups(row.menuId, payload.menu.optionGroups || []);
      await saveMenuTags(row.menuId, payload.menu.tagIds || []);
      await Promise.all(
        (payload.tagRequests || []).map((r) => {
          return api.post("/tags", { tagName: r.tagName, tagType: r.tagType });
        }),
      );
      mockMenus.push({
        ...payload.menu,
        menuId: row.menuId,
        imageUrl: menu.imageUrl || "",
      });
    }
    if (payload.actionType === "U") {
      const old = mockMenus.find((m) => m.menuId === payload.menuId);
      const newImage = payload.menu.imageUrl;
      const imageUrl = newImage ? toImageUrl(newImage) : null;
      const isImageKept = Boolean(newImage) && !imageUrl;
      const menu = { ...payload.menu, imageUrl: imageUrl };
      const body = toMenuPayload(menu, mockShop.shopId);
      delete body.shopId;
      if (isImageKept) delete body.imageUrl;
      await api.patch(`/menus/${payload.menuId}`, body);
      await saveOptionGroups(payload.menuId, payload.menu.optionGroups || []);
      await saveMenuTags(payload.menuId, payload.menu.tagIds || [], old?.tagIds);
      if (old) {
        const oldImage = old.imageUrl;
        Object.assign(old, payload.menu);
        if (isImageKept) old.imageUrl = oldImage;
      }
    }
    if (payload.actionType === "D") {
      await api.delete(`/menus/${payload.menuId}`);
      const index = mockMenus.findIndex((m) => m.menuId === payload.menuId);
      if (index >= 0) mockMenus[index].isAvailable = false;
    }
    if (payload.actionType === "available") {
      await api.patch(`/menus/${payload.menuId}`, {
        isAvailable: payload.isAvailable,
      });
      const menu = mockMenus.find((m) => m.menuId === payload.menuId);
      if (menu) menu.isAvailable = payload.isAvailable;
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const fetchSaveTagRequest = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveTagRequest(payload);
  try {
    await api.post("/tags", { tagName: payload.tagName, tagType: payload.tagType });
    mockTagRequests.push(payload);
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- คำสั่งซื้อของร้าน ---------- */

const detailCache = new Map();

// รายการคำสั่งซื้อจาก backend ไม่มีรายการอาหาร ต้องดึงรายละเอียดทีละรายการ
// เก็บไว้ตาม updatedAt จะได้ไม่ดึงซ้ำทุกครั้งที่หน้าโหลดใหม่
const detailKey = (row) => `${row.orderId}:${row.updatedAt}`;

const withDetail = async (row) => {
  const key = detailKey(row);
  if (!detailCache.has(key)) {
    detailCache.set(key, api.get(`/orders/${row.orderId}`));
  }
  try {
    return await detailCache.get(key);
  } catch (err) {
    detailCache.delete(key);
    throw err;
  }
};

const addCustomers = (orders) => {
  orders.forEach((order) => {
    if (mockCustomers.some((c) => c.customerId === order.customerId)) return;
    mockCustomers.push(toCustomer(order));
  });
};

// รอบส่ง (batch) อ่านจากคำสั่งซื้อที่มี batchId ส่วน token ของ QR ได้ครั้งเดียวตอนสร้าง
const buildBatches = (orders) => {
  const saved = readJson(BATCH_KEY, {});
  const groups = {};
  orders.forEach((o) => {
    if (!o.batchId) return;
    groups[o.batchId] = groups[o.batchId] || [];
    groups[o.batchId].push(o);
  });
  const batches = Object.entries(groups).map(([batchId, list]) => {
    const info = saved[batchId] || {};
    const isDone = list.every((o) => ["completed", "cancelled"].includes(o.status));
    const isScanned = list.some((o) => ["delivering", "completed"].includes(o.status));
    return {
      batchId: Number(batchId),
      batchCode: `R-${String(batchId).padStart(2, "0")}`,
      token: info.token || null,
      orderIds: list.map((o) => o.orderId),
      status: isDone ? "completed" : "active",
      createdAt: info.createdAt || list[0].updatedAt,
      scannedAt: isScanned ? list[0].updatedAt : null,
      cancelledAt: null,
    };
  });
  replace(mockBatches, batches);
};

export const paidTotal = (order) => {
  if (!USE_MOCK && !order.isDetailLoaded) return order.totalAmount;
  return mock.paidTotal(order);
};

const WORKING_STATUS = ["paid", "preparing", "ready", "delivering"];

const isUrgentOrder = (row) => {
  const today = new Date().toDateString();
  const isToday = new Date(row.createdAt).toDateString() === today;
  return isToday || WORKING_STATUS.includes(row.status);
};

const applyShopOrders = (shopId, rows) => {
  if (mockShop.shopId !== shopId) return;
  const orders = rows.map(toOrder);
  addCustomers(orders);
  replace(mockOrders, orders);
  buildBatches(orders);
  const account = mockAccounts.find((a) => a.accountId === shopId);
  if (account) {
    account.newOrderCount = orders.filter((o) => o.status === "paid").length;
  }
  listeners.forEach((fn) => fn());
};

let shopOrdersJob = null;

const startShopOrders = (shopId) => {
  const job = { shopId };
  job.first = api
    .get(`/shops/${shopId}/orders`, { limit: 100 })
    .then(async (resp) => {
      const rows = await Promise.all(
        resp.items.map((row) => {
          const isCached = detailCache.has(detailKey(row));
          return isUrgentOrder(row) || isCached ? withDetail(row) : row;
        }),
      );
      applyShopOrders(shopId, rows);
      return resp.items;
    });
  job.done = job.first
    .then(async (items) => {
      const rows = await Promise.all(items.map(withDetail));
      applyShopOrders(shopId, rows);
    })
    .catch(() => null)
    .finally(() => {
      if (shopOrdersJob === job) shopOrdersJob = null;
    });
  return job;
};

export const loadShopOrders = async (isFresh = false) => {
  if (USE_MOCK) return ok();
  if (!mockShop.shopId) return ok();
  if (shopOrdersJob && shopOrdersJob.shopId !== mockShop.shopId) {
    shopOrdersJob = null;
  }
  if (isFresh && shopOrdersJob) await shopOrdersJob.done;
  if (!shopOrdersJob) shopOrdersJob = startShopOrders(mockShop.shopId);
  try {
    await shopOrdersJob.first;
    return ok();
  } catch (err) {
    return fail(err);
  }
};

const replaceOrder = (row) => {
  const order = toOrder(row);
  [mockOrders, mockMyOrders].forEach((list) => {
    const index = list.findIndex((o) => o.orderId === order.orderId);
    if (index >= 0) list[index] = { ...list[index], ...order, items: list[index].items };
  });
};

export const fetchSaveOrder = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveOrder(payload);
  try {
    let status = payload.status;
    if (payload.actionType === "accept") status = "preparing";
    if (payload.actionType === "cancel") status = "cancelled";
    if (payload.actionType === "refund") {
      return fail({ message: "backend ยังไม่มี API บันทึกสลิปโอนคืนของร้าน" });
    }
    const row = await api.patch(`/orders/${payload.orderId}/status`, { status });
    replaceOrder(row);
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const fetchSaveBatch = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveBatch(payload);
  try {
    if (payload.actionType === "A") {
      const resp = await api.post("/delivery-batches", {
        orderIds: payload.orderIds,
        expiresInMinutes: 180,
      });
      const saved = readJson(BATCH_KEY, {});
      saved[resp.batchId] = { token: resp.token, createdAt: new Date().toISOString() };
      writeJson(BATCH_KEY, saved);
      await loadShopOrders(true);
      const batch = mockBatches.find((b) => b.batchId === resp.batchId);
      return ok({ batch });
    }
    if (payload.actionType === "cancel") {
      // backend ให้เฉพาะผู้ดูแลระบบยกเลิกรอบส่งได้
      await api.delete(`/admin/delivery-batches/${payload.batchId}`);
      await loadShopOrders(true);
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- ฝั่งลูกค้า: ร้านและเมนู ---------- */

export const getMyLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 },
    );
  });
};

export const loadNearbyShops = async () => {
  if (USE_MOCK) return ok();
  try {
    const location = mockMe.isLocationOn ? await getMyLocation() : null;
    const resp = await api.get("/shops", { limit: 100 });
    const shops = resp.items.map((row, index) => toNearbyShop(row, index, location));
    shops.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    replace(mockNearbyShops, shops);
    const chips = [...new Set(shops.map((s) => s.chip))];
    replace(SHOP_CHIPS, ["ทั้งหมด", ...chips]);
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const loadShopMenus = async (shopId) => {
  if (USE_MOCK) return ok();
  try {
    const [row, hours, categories] = await Promise.all([
      api.get(`/shops/${shopId}`),
      api.get(`/shops/${shopId}/hours`),
      loadCategories(shopId),
    ]);
    const shop = {
      ...toNearbyShop(row, mockNearbyShops.length, null),
      ...toShop(row, hours),
    };
    const index = mockNearbyShops.findIndex((s) => s.shopId === shopId);
    if (index >= 0) {
      mockNearbyShops[index] = { ...mockNearbyShops[index], ...shop };
    } else {
      mockNearbyShops.push(shop);
    }
    const menus = await loadMenusOf(shopId, categories, true);
    replace(mockOtherMenus, [
      ...mockOtherMenus.filter((m) => m.shopId !== shopId),
      ...menus,
    ]);
    return ok();
  } catch (err) {
    return fail(err);
  }
};

const findShop = (shopId) => {
  return mockNearbyShops.find((s) => s.shopId === shopId);
};

export const getShop = (shopId) => {
  if (USE_MOCK) return mock.getShop(shopId);
  const shop = findShop(shopId);
  return shop || { shopId, shopName: "ร้านค้า", phone: "", promptPayId: "" };
};

export const getShopMenus = (shopId) => {
  if (USE_MOCK) return mock.getShopMenus(shopId);
  return mockOtherMenus.filter((m) => m.shopId === shopId);
};

export const getMenu = (menuId) => {
  if (USE_MOCK) return mock.getMenu(menuId);
  return mockOtherMenus.find((m) => m.menuId === menuId);
};

export const getMyOrders = () => {
  if (USE_MOCK) return mock.getMyOrders();
  const result = [...mockMyOrders];
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
};

export const getOrder = (orderId) => {
  if (USE_MOCK) return mock.getOrder(orderId);
  return (
    mockMyOrders.find((o) => o.orderId === orderId) ||
    mockOrders.find((o) => o.orderId === orderId)
  );
};

export const getActiveOrder = () => {
  return getMyOrders().find((o) => mock.ACTIVE_STATUS.includes(o.status));
};

export const getRecommendMenus = (shopId) => {
  if (USE_MOCK) return mock.getRecommendMenus(shopId);
  // backend ยังไม่มี API เมนูแนะนำ และยังอ่านแท็กของเมนูไม่ได้
  return [];
};

export const getPaySecondsLeft = (order) => {
  if (USE_MOCK || !order.qrExpiresAt) return mock.getPaySecondsLeft(order);
  const deadline = new Date(order.qrExpiresAt).getTime();
  return Math.max(0, Math.round((deadline - Date.now()) / 1000));
};

/* ---------- ฝั่งลูกค้า: ตะกร้า ที่อยู่ บัญชี ---------- */

export const fetchSaveCart = (payload) => {
  const resp = mock.fetchSaveCart(payload);
  if (!USE_MOCK) writeJson(CART_KEY, mockCart);
  return resp;
};

export const loadAddresses = async () => {
  if (USE_MOCK) return ok();
  try {
    const rows = await api.get("/addresses");
    replace(mockAddresses, rows.map(toAddress));
    const isKnown = mockAddresses.some((a) => a.addressId === mockMe.addressId);
    if (!isKnown) {
      const main = mockAddresses.find((a) => a.isMain) || mockAddresses[0];
      mockMe.addressId = main?.addressId || null;
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const fetchSaveAddress = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveAddress(payload);
  try {
    if (payload.actionType === "A") {
      const row = await api.post("/addresses", toAddressPayload(payload.address));
      mockMe.addressId = row.addressId;
    }
    if (payload.actionType === "U") {
      await api.patch(`/addresses/${payload.addressId}`, toAddressPayload(payload.address));
      mockMe.addressId = payload.addressId;
    }
    if (payload.actionType === "D") {
      await api.delete(`/addresses/${payload.addressId}`);
      if (mockMe.addressId === payload.addressId) mockMe.addressId = null;
    }
    if (payload.actionType === "select") {
      mockMe.addressId = payload.addressId;
    }
    writeJson(ADDRESS_KEY, mockMe.addressId);
    if (payload.actionType !== "select") await loadAddresses();
    return ok();
  } catch (err) {
    return fail(err);
  }
};

export const fetchSaveMe = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveMe(payload);
  try {
    if (payload.actionType === "consent") {
      const row = await api.patch("/profile/pdpa-consent", {
        pdpaConsent: true,
        pdpaConsentVersion: PDPA_VERSION,
      });
      mockMe.isNew = false;
      mockMe.consentAt = row.pdpaConsentAt;
    }
    if (["consent", "location"].includes(payload.actionType)) {
      mockMe.isLocationOn = payload.isLocationOn;
      writeJson(LOCATION_KEY, payload.isLocationOn);
    }
    if (payload.actionType === "refund") {
      const row = await api.patch("/profile/refund-account", {
        refundPromptpayId: payload.refundPromptPay.replace(/\D/g, ""),
      });
      mockMe.refundPromptPay = row.refundPromptpayId || "";
    }
    if (payload.actionType === "delete") {
      if (getActiveOrder()) return fail({ message: "มีคำสั่งซื้อที่ยังไม่เสร็จ" });
      await api.post("/privacy-requests", {
        requestType: "delete",
        reason: "ลูกค้าขอลบบัญชีจากหน้าบัญชีของฉัน",
      });
      fetchSaveCart({ actionType: "clear" });
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- ฝั่งลูกค้า: คำสั่งซื้อและชำระเงิน ---------- */

export const loadMyOrders = async () => {
  if (USE_MOCK) return ok();
  try {
    const resp = await api.get("/orders/mine", { limit: 100 });
    const rows = await Promise.all(resp.items.map(withDetail));
    const old = new Map(mockMyOrders.map((o) => [o.orderId, o]));
    replace(
      mockMyOrders,
      rows.map((row) => ({ ...old.get(row.orderId), ...toOrder(row) })),
    );
    const shopIds = [...new Set(mockMyOrders.map((o) => o.shopId))];
    await Promise.all(
      shopIds
        .filter((id) => !findShop(id))
        .map((id) => api.get(`/shops/${id}`).then(
          (row) => mockNearbyShops.push(toNearbyShop(row, mockNearbyShops.length, null)),
          () => null,
        )),
    );
    return ok();
  } catch (err) {
    return fail(err);
  }
};

const loadPayment = async (order) => {
  const payments = await api.get("/payments/mine");
  const payment = payments.find((p) => p.orderId === order.orderId);
  if (!payment) return null;
  return {
    paymentId: payment.paymentId,
    paymentStatus: payment.status,
    qrPayload: payment.qrPayload,
    qrExpiresAt: payment.qrExpiresAt,
    slipUrl: payment.slipImageUrl || "",
  };
};

// โหลดคำสั่งซื้อเดียว พร้อมข้อมูลการชำระเงิน สำหรับหน้า PAY / TRK
export const loadMyOrder = async (orderId) => {
  if (USE_MOCK) return ok();
  try {
    const row = await api.get(`/orders/${orderId}`);
    const order = toOrder(row);
    let payment = await loadPayment(order).catch(() => null);
    if (!payment && order.status === "pending_payment") {
      payment = await createPayment(orderId).catch(() => null);
    }
    Object.assign(order, payment);
    const index = mockMyOrders.findIndex((o) => o.orderId === orderId);
    if (index >= 0) mockMyOrders[index] = { ...mockMyOrders[index], ...order };
    else mockMyOrders.push(order);
    if (!findShop(order.shopId)) {
      const shop = await api.get(`/shops/${order.shopId}`).catch(() => null);
      if (shop) mockNearbyShops.push(toNearbyShop(shop, mockNearbyShops.length, null));
    }
    return ok({ order: getOrder(orderId) });
  } catch (err) {
    return fail(err);
  }
};

const createPayment = async (orderId) => {
  const resp = await api.post("/payments", { orderId });
  return {
    paymentId: resp.payment.paymentId,
    paymentStatus: resp.payment.status,
    qrPayload: resp.qrPayload,
    qrExpiresAt: resp.expiresAt,
  };
};

export const fetchSaveMyOrder = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveMyOrder(payload);
  try {
    if (payload.actionType === "A") {
      if (payload.refundPromptPay) {
        await fetchSaveMe({ actionType: "refund", refundPromptPay: payload.refundPromptPay });
      }
      const row = await api.post("/orders", {
        shopId: mockCart.shopId,
        addressId: mockMe.addressId,
        items: mockCart.items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          optionIds: (item.options || []).map((o) => o.optionId).filter(Boolean),
          note: item.note || null,
        })),
      });
      const order = toOrder(row);
      mockMyOrders.push(order);
      fetchSaveCart({ actionType: "clear" });
      const payment = await createPayment(row.orderId).catch(() => null);
      Object.assign(order, payment);
      return ok({ order });
    }
    const order = getOrder(payload.orderId);
    if (payload.actionType === "slip") {
      if (!order.paymentId) Object.assign(order, await createPayment(order.orderId));
      const slipImageUrl = await uploadImage(payload.slipUrl);
      const row = await api.post(`/payments/${order.paymentId}/slip`, { slipImageUrl });
      order.slipUrl = row.slipImageUrl;
      order.paymentStatus = row.status;
    }
    if (payload.actionType === "cancel") {
      const row = await api.patch(`/orders/${payload.orderId}/status`, {
        status: "cancelled",
      });
      replaceOrder(row);
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};

/* ---------- คนส่ง ---------- */

// backend ยังไม่มี API อัปโหลดรูป ตั้ง VITE_UPLOAD_URL เมื่อมีบริการรับไฟล์
// ต้องตอบกลับ { url } เป็นลิงก์ https ที่เปิดดูได้
export const uploadImage = async (dataUrl) => {
  if (/^https?:\/\//.test(dataUrl)) return dataUrl;
  const uploadUrl = import.meta.env.VITE_UPLOAD_URL;
  if (!uploadUrl) {
    throw new ApiError(0, "ยังอัปโหลดรูปไม่ได้ backend ยังไม่มี API อัปโหลดไฟล์");
  }
  const blob = await (await fetch(dataUrl)).blob();
  const form = new FormData();
  form.append("file", blob, "image.jpg");
  const resp = await fetch(uploadUrl, {
    method: "POST",
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    body: form,
  });
  if (!resp.ok) throw new ApiError(resp.status, "อัปโหลดรูปไม่สำเร็จ");
  const body = await resp.json();
  return body.url || body.data?.url;
};

const riderBatches = new Map();

// คนส่งเปิดลิงก์จาก QR: ดูรายการคำสั่งซื้อในรอบส่ง (ยังไม่ต้องล็อกอิน)
export const loadBatch = async (token) => {
  if (USE_MOCK) return ok({ batch: mock.getBatchByToken(token) });
  try {
    const resp = await api.get("/delivery-batches/scan", { token });
    const batch = {
      batchId: resp.batchId,
      batchCode: `R-${String(resp.batchId).padStart(2, "0")}`,
      token,
      orderIds: resp.orders.map((o) => o.orderId),
      status: resp.status,
      scannedAt: resp.scannedAt,
      isClaimed: Boolean(getRiderToken(token)),
    };
    riderBatches.set(token, batch);
    resp.orders.forEach((o) => {
      const order = {
        orderId: o.orderId,
        status: o.status,
        customerId: null,
        items: [],
        deliveryAddress: o.deliveryAddress.addressText,
        addressLabel: o.deliveryAddress.label,
        addressNote: o.deliveryAddress.landmark || "",
        deliveryPhone: o.deliveryAddress.phone,
        deliveryLatitude: o.deliveryAddress.latitude,
        deliveryLongitude: o.deliveryAddress.longitude,
        batchId: resp.batchId,
      };
      const index = mockOrders.findIndex((x) => x.orderId === o.orderId);
      if (index >= 0) mockOrders[index] = { ...mockOrders[index], ...order };
      else mockOrders.push(order);
    });
    return ok({ batch });
  } catch (err) {
    if (err.status === 410 || err.status === 404) {
      return ok({ batch: { token, status: "cancelled", orderIds: [] } });
    }
    return fail(err);
  }
};

export const getBatchByToken = (token) => {
  if (USE_MOCK) return mock.getBatchByToken(token);
  return riderBatches.get(token);
};

export const fetchSaveDelivery = async (payload) => {
  if (USE_MOCK) return mock.fetchSaveDelivery(payload);
  try {
    if (payload.actionType === "claim") {
      const resp = await api.post(
        `/delivery-batches/claim?token=${encodeURIComponent(payload.token)}`,
        { name: payload.name, phone: payload.phone.replace(/\D/g, "") },
      );
      setRiderToken(payload.token, resp.riderToken);
      await loadBatch(payload.token);
    }
    if (payload.actionType === "deliver") {
      const proofImageUrl = await uploadImage(payload.photoUrl);
      await api.post(
        `/deliveries/${payload.orderId}/complete`,
        { proofImageUrl, deliveryNote: payload.note || null },
        { token: getRiderToken(payload.token) },
      );
      const order = mockOrders.find((o) => o.orderId === payload.orderId);
      if (order) order.status = "completed";
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
};
