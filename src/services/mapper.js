// แปลงข้อมูลจาก backend (camelCase แล้วจาก http.js) ให้อยู่ในรูปแบบเดียวกับ
// ข้อมูลจำลองใน mock/mockData.js หน้าจอเดิมจะได้ใช้ต่อได้โดยไม่ต้องรู้ว่ามาจากไหน

const DAY_NAMES = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
];

const SHOP_COLORS = [
  { color: "#FFE8DE", iconColor: "#C78A00" },
  { color: "#FFF1D6", iconColor: "#C78A00" },
  { color: "#FDE7E7", iconColor: "#B42318" },
  { color: "#E6EEFF", iconColor: "#1D4ED8" },
  { color: "#E7F4EF", iconColor: "#0E6E5C" },
];

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  return Number(value);
};

const toTime = (value) => (value ? value.slice(0, 5) : "");

const toApiTime = (value) => (value ? `${value}:00`.slice(0, 8) : null);

// backend: weekday 0 = วันจันทร์ ตรงกับลำดับ openHours ของหน้าตั้งค่าร้าน
export const toOpenHours = (rows = []) => {
  return DAY_NAMES.map((day, weekday) => {
    const row = rows.find((r) => r.weekday === weekday);
    return {
      day,
      weekday,
      isOpen: row ? !row.isClosed : false,
      openTime: toTime(row?.openTime) || "08:00",
      closeTime: toTime(row?.closeTime) || "20:00",
    };
  });
};

export const toShopHourPayload = (hour) => {
  return {
    weekday: hour.weekday,
    openTime: hour.isOpen ? toApiTime(hour.openTime) : null,
    closeTime: hour.isOpen ? toApiTime(hour.closeTime) : null,
    isClosed: !hour.isOpen,
  };
};

export const todayHour = (openHours = []) => {
  return openHours[(new Date().getDay() + 6) % 7];
};

export const toShop = (row, hours = [], ownerName = "") => {
  const openHours = toOpenHours(hours);
  const today = todayHour(openHours);
  return {
    shopId: row.shopId,
    accountId: row.shopId,
    ownerId: row.ownerId,
    shopName: row.shopName,
    shopType: row.shopType || "",
    status: "approved",
    ownerName: ownerName,
    phone: row.phone || "",
    address: "",
    latitude: row.latitude,
    longitude: row.longitude,
    coverImageUrl: row.coverImageUrl || "",
    isOpen: Boolean(row.isOpen),
    description: row.description || "",
    openHours: openHours,
    openTime: today?.isOpen ? today.openTime : "",
    closeTime: today?.isOpen ? today.closeTime : "",
    deliveryFee: toNumber(row.deliveryFee),
    minOrder: toNumber(row.minOrderAmount),
    promptPayId: row.promptpayId || "",
    accountName: row.promptpayAccountName || "",
  };
};

export const toShopPayload = (shop) => {
  return {
    shopName: shop.shopName,
    shopType: shop.shopType || null,
    description: shop.description || null,
    phone: shop.phone ? shop.phone.replace(/\D/g, "") : null,
    coverImageUrl: shop.coverImageUrl || null,
    latitude: shop.latitude ?? null,
    longitude: shop.longitude ?? null,
    promptpayId: shop.promptPayId ? shop.promptPayId.replace(/\D/g, "") : null,
    promptpayAccountName: shop.accountName || null,
    minOrderAmount: shop.minOrder ?? 0,
    deliveryFee: shop.deliveryFee ?? 0,
  };
};

export const toAccount = (row) => {
  return {
    accountId: row.shopId,
    accountType: "shop",
    accountName: row.shopName,
    status: "approved",
    newOrderCount: 0,
    isOpen: Boolean(row.isOpen),
  };
};

const distanceKm = (from, to) => {
  if (!from || to.latitude == null || to.longitude == null) return null;
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(to.latitude - from.latitude);
  const dLng = rad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(from.latitude)) *
      Math.cos(rad(to.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
};

export const toNearbyShop = (row, index, location) => {
  return {
    ...toShop(row),
    categoryName: row.shopType || "ร้านอาหาร",
    chip: row.shopType || "ร้านอาหาร",
    distance: distanceKm(location, row),
    ...SHOP_COLORS[index % SHOP_COLORS.length],
  };
};

export const toOptionGroup = (row) => {
  return {
    id: row.optionGroupId,
    optionGroupId: row.optionGroupId,
    groupName: row.groupName,
    isRequired: Boolean(row.isRequired),
    maxSelect: row.maxSelect,
    options: (row.options || []).map((o) => ({
      optionId: o.optionId,
      optionName: o.optionName,
      extraPrice: toNumber(o.extraPrice),
    })),
  };
};

export const toMenu = (row, categories = [], groups = []) => {
  const category = categories.find((c) => c.categoryId === row.categoryId);
  return {
    menuId: row.menuId,
    shopId: row.shopId,
    menuName: row.menuName,
    categoryId: row.categoryId,
    categoryName: category?.categoryName || "",
    price: toNumber(row.price),
    description: row.description || "",
    // backend ยังไม่มี API อ่านแท็กของเมนู
    tagIds: [],
    optionGroups: groups.map(toOptionGroup),
    imageUrl: row.imageUrl || "",
    isAvailable: Boolean(row.isAvailable),
  };
};

export const toMenuPayload = (menu, shopId) => {
  return {
    shopId: shopId,
    categoryId: menu.categoryId,
    menuName: menu.menuName,
    price: menu.price,
    description: menu.description || null,
    imageUrl: menu.imageUrl || null,
    isAvailable: menu.isAvailable ?? true,
  };
};

export const toCategory = (row) => ({
  categoryId: row.categoryId,
  categoryName: row.categoryName,
  shopId: row.shopId,
});

export const toTag = (row) => ({
  tagId: row.tagId,
  tagName: row.tagName,
  tagType: row.tagType,
});

export const toAddress = (row) => {
  return {
    addressId: row.addressId,
    label: row.label,
    address: row.addressText,
    note: row.landmark || "",
    phone: row.phone,
    latitude: row.latitude,
    longitude: row.longitude,
    isMain: Boolean(row.isDefault),
  };
};

export const toAddressPayload = (address) => {
  return {
    label: address.label,
    phone: (address.phone || "").replace(/\D/g, ""),
    addressText: address.address,
    landmark: address.note || null,
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
    isDefault: Boolean(address.isMain),
  };
};

const LOG_BY = {
  pending_payment: "ลูกค้า",
  paid: "ระบบตรวจสลิป",
  preparing: "ร้าน",
  ready: "ร้าน",
  delivering: "คนส่ง",
  completed: "คนส่ง",
};

// backend ยังไม่มี API ประวัติสถานะ (order_status_logs) จึงสร้างจากเวลาที่มีในคำสั่งซื้อ
const toStatusLogs = (row) => {
  const logs = [
    { status: "pending_payment", at: row.createdAt, by: LOG_BY.pending_payment },
  ];
  if (row.paidAt) logs.push({ status: "paid", at: row.paidAt, by: LOG_BY.paid });
  const flow = ["preparing", "ready", "delivering", "completed"];
  const reached = flow.indexOf(row.status);
  flow.slice(0, reached + 1).forEach((status) => {
    let at = row.updatedAt;
    if (status === "completed") at = row.completedAt || row.updatedAt;
    logs.push({ status, at, by: LOG_BY[status] });
  });
  if (row.status === "cancelled") {
    const by = row.cancelledBy === "customer" ? "ลูกค้า" : "ร้าน";
    logs.push({ status: "cancelled", at: row.cancelledAt || row.updatedAt, by });
  }
  return logs;
};

export const toOrder = (row) => {
  const items = (row.items || []).map((item) => ({
    orderItemId: item.orderItemId,
    menuId: item.menuId,
    menuName: item.menuName,
    quantity: item.quantity,
    price: toNumber(item.unitPrice),
    options: (item.options || []).map((o) => ({
      optionId: o.optionId,
      optionName: o.optionName,
      extraPrice: toNumber(o.extraPrice),
    })),
    note: item.note || "",
  }));
  return {
    orderId: row.orderId,
    orderNo: row.orderNo,
    shopId: row.shopId,
    customerId: row.userId,
    payerName: "",
    status: row.status,
    items: items,
    isDetailLoaded: Boolean(row.items),
    deliveryAddress: row.deliveryAddressText,
    addressLabel: row.deliveryLabel,
    addressNote: row.deliveryLandmark || "",
    deliveryPhone: row.deliveryPhone,
    deliveryLatitude: row.deliveryLatitude,
    deliveryLongitude: row.deliveryLongitude,
    deliveryFee: toNumber(row.deliveryFee),
    foodTotal: toNumber(row.foodTotal),
    totalAmount: toNumber(row.totalAmount),
    batchId: row.batchId || null,
    cancelReason: row.cancelReason || "",
    refundStatus: "none",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    statusLogs: toStatusLogs(row),
  };
};

export const toCustomer = (order) => ({
  customerId: order.customerId,
  displayName: `ลูกค้า #${order.customerId}`,
  phone: "",
});

export const toMe = (row) => {
  return {
    customerId: row.userId,
    displayName: row.displayName,
    imgUrl: row.imgUrl,
    payerName: row.refundAccountName || row.displayName,
    isNew: !row.pdpaConsent,
    consentAt: row.pdpaConsentAt || null,
    refundPromptPay: row.refundPromptpayId || "",
    refundAccountName: row.refundAccountName || "",
    deletedAt: null,
  };
};
