const today = new Date();

const timeAt = (daysAgo, hour, minute) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const minutesAgo = (minutes) => {
  return new Date(today.getTime() - minutes * 60000).toISOString();
};

export const mockShop = {
  shopId: 1,
  accountId: 1,
  shopName: "ครัวป้าแดง",
  status: "approved",
  ownerName: "ป้าแดง ใจดี",
  phone: "081-234-5678",
  address: "12/3 ซอยประชาอุทิศ 5 ต.บางมด อ.ทุ่งครุ กรุงเทพฯ",
  isOpen: true,
  description: "อาหารตามสั่ง รสจัดจ้าน ทำสดทุกจาน",
  openHours: [
    { day: "จันทร์", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "อังคาร", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "พุธ", isOpen: false, openTime: "08:00", closeTime: "20:00" },
    { day: "พฤหัสบดี", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    { day: "ศุกร์", isOpen: true, openTime: "08:00", closeTime: "21:00" },
    { day: "เสาร์", isOpen: true, openTime: "09:00", closeTime: "21:00" },
    { day: "อาทิตย์", isOpen: true, openTime: "09:00", closeTime: "20:00" },
  ],
  deliveryFee: 20,
  minOrder: 60,
  promptPayId: "081-234-5678",
  accountName: "นางแดง ใจดี",
};

const baseShop = { ...mockShop };

export const mockAccounts = [
  {
    accountId: 1,
    accountType: "shop",
    accountName: "ครัวป้าแดง",
    newOrderCount: 0,
    isOpen: true,
  },
  {
    accountId: 2,
    accountType: "shop",
    accountName: "ข้าวมันไก่ป้าแดง สาขา 2",
    newOrderCount: 2,
    isOpen: true,
  },
  {
    accountId: 3,
    accountType: "customer",
    accountName: "ป้าแดง ใจดี",
    newOrderCount: 0,
  },
];

export const mockCategories = [
  { categoryId: 1, categoryName: "ข้าว" },
  { categoryId: 2, categoryName: "เส้น" },
  { categoryId: 3, categoryName: "ต้ม / แกง" },
  { categoryId: 4, categoryName: "เมนูนึ่ง" },
  { categoryId: 5, categoryName: "เครื่องดื่ม" },
];

export const mockTags = [
  { tagId: 1, tagName: "เผ็ด", tagType: "taste" },
  { tagId: 2, tagName: "เปรี้ยว", tagType: "taste" },
  { tagId: 3, tagName: "หวาน", tagType: "taste" },
  { tagId: 4, tagName: "เค็ม", tagType: "taste" },
  { tagId: 5, tagName: "มัน", tagType: "taste" },
  { tagId: 6, tagName: "กลมกล่อม", tagType: "taste" },
  { tagId: 7, tagName: "หอมสมุนไพร", tagType: "taste" },
  { tagId: 11, tagName: "หมู", tagType: "ingredient" },
  { tagId: 12, tagName: "ไก่", tagType: "ingredient" },
  { tagId: 13, tagName: "กุ้ง", tagType: "ingredient" },
  { tagId: 14, tagName: "ปลา", tagType: "ingredient" },
  { tagId: 15, tagName: "เนื้อวัว", tagType: "ingredient" },
  { tagId: 16, tagName: "ปลาหมึก", tagType: "ingredient" },
  { tagId: 17, tagName: "ไข่", tagType: "ingredient" },
  { tagId: 18, tagName: "ผัก", tagType: "ingredient" },
  { tagId: 19, tagName: "เต้าหู้", tagType: "ingredient" },
  { tagId: 20, tagName: "ชา / กาแฟ", tagType: "ingredient" },
  { tagId: 21, tagName: "นม", tagType: "ingredient" },
  { tagId: 31, tagName: "ผัด", tagType: "cooking_method" },
  { tagId: 32, tagName: "ทอด", tagType: "cooking_method" },
  { tagId: 33, tagName: "ต้ม", tagType: "cooking_method" },
  { tagId: 34, tagName: "นึ่ง", tagType: "cooking_method" },
  { tagId: 35, tagName: "ย่าง", tagType: "cooking_method" },
  { tagId: 36, tagName: "แกง", tagType: "cooking_method" },
  { tagId: 37, tagName: "ยำ", tagType: "cooking_method" },
  { tagId: 38, tagName: "ตุ๋น", tagType: "cooking_method" },
  { tagId: 40, tagName: "อบ", tagType: "cooking_method" },
  {
    tagId: 39,
    tagName: "ไม่ปรุง (เครื่องดื่ม/ของหวาน)",
    tagType: "cooking_method",
  },
];

export const mockMenus = [
  {
    menuId: 1,
    menuName: "ข้าวกะเพราหมูสับ",
    categoryId: 1,
    price: 55,
    description: "กะเพราแท้ ผัดไฟแรง หอมใบกะเพรา",
    tagIds: [1, 4, 11, 17, 31],
    optionGroups: [
      {
        id: 1,
        groupName: "เลือกเนื้อสัตว์",
        isRequired: true,
        maxSelect: 1,
        options: [
          { optionName: "หมูสับ", extraPrice: 0 },
          { optionName: "ไก่", extraPrice: 0 },
          { optionName: "กุ้ง", extraPrice: 20 },
        ],
      },
      {
        id: 2,
        groupName: "ท็อปปิ้ง",
        isRequired: false,
        maxSelect: 2,
        options: [
          { optionName: "ไข่ดาว", extraPrice: 10 },
          { optionName: "ไข่เจียว", extraPrice: 15 },
        ],
      },
    ],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 2,
    menuName: "ข้าวผัดกุ้ง",
    categoryId: 1,
    price: 70,
    description: "ข้าวผัดหอมกระทะ กุ้งตัวโต",
    tagIds: [4, 6, 13, 17, 31],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 3,
    menuName: "ข้าวมันไก่",
    categoryId: 1,
    price: 50,
    description: "ไก่ต้มนุ่ม น้ำจิ้มเต้าเจี้ยวสูตรร้าน",
    tagIds: [5, 6, 12, 33],
    optionGroups: [],
    imageUrl: "",
    isAvailable: false,
  },
  {
    menuId: 4,
    menuName: "ผัดซีอิ๊วหมู",
    categoryId: 2,
    price: 60,
    description: "เส้นใหญ่ผัดซีอิ๊ว ใส่คะน้า",
    tagIds: [3, 4, 11, 18, 31],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 5,
    menuName: "ก๋วยเตี๋ยวต้มยำ",
    categoryId: 2,
    price: 60,
    description: "ต้มยำน้ำใส เส้นเล็ก หมูชิ้น ลูกชิ้น",
    tagIds: [1, 2, 11, 33],
    optionGroups: [
      {
        id: 3,
        groupName: "เลือกเส้น",
        isRequired: true,
        maxSelect: 1,
        options: [
          { optionName: "เส้นเล็ก", extraPrice: 0 },
          { optionName: "เส้นใหญ่", extraPrice: 0 },
          { optionName: "บะหมี่", extraPrice: 0 },
        ],
      },
    ],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 6,
    menuName: "ต้มยำกุ้งน้ำข้น",
    categoryId: 3,
    price: 120,
    description: "กุ้งแม่น้ำ น้ำข้นเข้มข้น",
    tagIds: [1, 2, 7, 13, 33],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 7,
    menuName: "แกงเขียวหวานไก่",
    categoryId: 3,
    price: 80,
    description: "พริกแกงตำเอง กะทิสด",
    tagIds: [1, 3, 5, 12, 36],
    optionGroups: [],
    imageUrl: "",
    isAvailable: false,
  },
  {
    menuId: 8,
    menuName: "ปลานึ่งมะนาว",
    categoryId: 4,
    price: 180,
    description: "ปลากะพงนึ่ง น้ำยำมะนาวรสจัด",
    tagIds: [1, 2, 7, 14, 34],
    optionGroups: [],
    imageUrl: "",
    isAvailable: false,
  },
  {
    menuId: 9,
    menuName: "ไข่ตุ๋น",
    categoryId: 4,
    price: 40,
    description: "ไข่ตุ๋นเนื้อเนียน โรยต้นหอม",
    tagIds: [6, 17, 34],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 10,
    menuName: "ชาไทยเย็น",
    categoryId: 5,
    price: 35,
    description: "ชาไทยใบชาแท้ หวานมัน",
    tagIds: [3, 5, 20, 21, 39],
    optionGroups: [
      {
        id: 4,
        groupName: "ระดับความหวาน",
        isRequired: true,
        maxSelect: 1,
        options: [
          { optionName: "หวานปกติ", extraPrice: 0 },
          { optionName: "หวานน้อย", extraPrice: 0 },
          { optionName: "ไม่หวาน", extraPrice: 0 },
        ],
      },
    ],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 11,
    menuName: "โกโก้เย็น",
    categoryId: 5,
    price: 35,
    description: "โกโก้เข้ม นมสด",
    tagIds: [3, 5, 21, 39],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
  {
    menuId: 12,
    menuName: "น้ำเปล่า",
    categoryId: 5,
    price: 10,
    description: "",
    tagIds: [6, 39],
    optionGroups: [],
    imageUrl: "",
    isAvailable: true,
  },
];

export const mockCustomers = [
  {
    customerId: 1,
    displayName: "มายด์ 🌷",
    phone: "089-111-2233",
  },
  {
    customerId: 2,
    displayName: "Ton Thanakorn",
    phone: "086-222-3344",
  },
  {
    customerId: 3,
    displayName: "แพรวา",
    phone: "081-333-4455",
  },
  {
    customerId: 4,
    displayName: "Bank_BKK",
    phone: "092-444-5566",
  },
  {
    customerId: 5,
    displayName: "น้องฟ้า",
    phone: "095-555-6677",
  },
  {
    customerId: 6,
    displayName: "Kwan K.",
    phone: "084-666-7788",
  },
  {
    customerId: 7,
    displayName: "ลุงสมชาย",
    phone: "087-777-8899",
  },
  {
    customerId: 8,
    displayName: "Ploy",
    phone: "083-888-9900",
  },
];

export const mockBatches = [
  {
    batchId: 1,
    batchCode: "R-03",
    token: "r03x7k2m",
    orderIds: [1005, 1006],
    status: "active",
    createdAt: minutesAgo(27),
    scannedAt: minutesAgo(25),
    cancelledAt: null,
  },
  {
    batchId: 2,
    batchCode: "R-02",
    token: "r02p4n8q",
    orderIds: [1007],
    status: "completed",
    createdAt: minutesAgo(107),
    scannedAt: minutesAgo(105),
    cancelledAt: null,
  },
];

export const mockOrders = [
  {
    orderId: 1001,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "paid",
    items: [
      {
        menuId: 1,
        menuName: "ข้าวกะเพราหมูสับ",
        quantity: 2,
        price: 55,
        options: [
          { optionName: "หมูสับ", extraPrice: 0 },
          { optionName: "ไข่ดาว", extraPrice: 10 },
        ],
        note: "เผ็ดน้อย 1 จาน",
      },
      {
        menuId: 10,
        menuName: "ชาไทยเย็น",
        quantity: 1,
        price: 35,
        options: [{ optionName: "หวานน้อย", extraPrice: 0 }],
      },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    deliveryFee: 20,
    createdAt: minutesAgo(2),
  },
  {
    orderId: 1002,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    slipCheck: "manual",
    status: "paid",
    items: [
      { menuId: 6, menuName: "ต้มยำกุ้งน้ำข้น", quantity: 1, price: 120 },
    ],
    deliveryAddress: "คอนโด The Base ตึก B ชั้น 8",
    deliveryFee: 20,
    createdAt: minutesAgo(5),
  },
  {
    orderId: 1003,
    customerId: 3,
    payerName: "แพรวา ทองดี",
    status: "preparing",
    items: [
      { menuId: 4, menuName: "ผัดซีอิ๊วหมู", quantity: 1, price: 60 },
      { menuId: 11, menuName: "โกโก้เย็น", quantity: 2, price: 35 },
    ],
    deliveryAddress: "มจธ. ตึกวิศวกรรมเครื่องกล",
    deliveryFee: 20,
    createdAt: minutesAgo(18),
  },
  {
    orderId: 1017,
    customerId: 8,
    payerName: "พลอย รุ่งเรือง",
    status: "preparing",
    items: [{ menuId: 3, menuName: "ข้าวมันไก่", quantity: 1, price: 50 }],
    deliveryAddress: "บ้านเลขที่ 9 ซอยพุทธบูชา 36",
    deliveryFee: 20,
    createdAt: minutesAgo(12),
  },
  {
    orderId: 1004,
    customerId: 4,
    payerName: "ภาณุ แก้วใส",
    status: "ready",
    items: [
      {
        menuId: 5,
        menuName: "ก๋วยเตี๋ยวต้มยำ",
        quantity: 2,
        price: 60,
        options: [{ optionName: "เส้นเล็ก", extraPrice: 0 }],
        note: "ไม่ใส่ถั่วงอก",
      },
      { menuId: 12, menuName: "น้ำเปล่า", quantity: 2, price: 10 },
    ],
    deliveryAddress: "ซอยประชาอุทิศ 45 บ้านเลขที่ 88",
    deliveryFee: 20,
    createdAt: minutesAgo(35),
  },
  {
    orderId: 1018,
    customerId: 6,
    payerName: "กวินทรา คงเจริญ",
    status: "ready",
    items: [
      { menuId: 7, menuName: "แกงเขียวหวานไก่", quantity: 1, price: 80 },
      { menuId: 9, menuName: "ไข่ตุ๋น", quantity: 1, price: 40 },
    ],
    deliveryAddress: "คอนโด Lumpini ตึก A ชั้น 12",
    deliveryFee: 20,
    createdAt: minutesAgo(28),
  },
  {
    orderId: 1005,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "delivering",
    batchId: 1,
    items: [{ menuId: 2, menuName: "ข้าวผัดกุ้ง", quantity: 1, price: 70 }],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    deliveryFee: 20,
    createdAt: minutesAgo(50),
  },
  {
    orderId: 1006,
    customerId: 5,
    payerName: "ฟ้าใส บุญมา",
    status: "completed",
    batchId: 1,
    items: [
      {
        menuId: 1,
        menuName: "ข้าวกะเพราหมูสับ",
        quantity: 1,
        price: 55,
        options: [{ optionName: "หมูสับ", extraPrice: 0 }],
      },
      { menuId: 9, menuName: "ไข่ตุ๋น", quantity: 1, price: 40 },
    ],
    deliveryAddress: "หมู่บ้านพฤกษา 12 ซอย 3",
    deliveryFee: 20,
    createdAt: minutesAgo(55),
  },
  {
    orderId: 1007,
    deliveryNote: "วางไว้หน้าประตูตามที่ลูกค้าแจ้ง",
    proofTimeSource: "exif",
    customerId: 6,
    payerName: "กวินทรา คงเจริญ",
    status: "completed",
    batchId: 2,
    items: [{ menuId: 8, menuName: "ปลานึ่งมะนาว", quantity: 1, price: 180 }],
    deliveryAddress: "คอนโด Lumpini ตึก A ชั้น 12",
    deliveryFee: 20,
    createdAt: minutesAgo(130),
  },
  {
    orderId: 1008,
    customerId: 7,
    payerName: "สมชาย ใจดี",
    status: "cancelled",
    cancelReason: "เมนูหมด",
    refundStatus: "pending",
    items: [{ menuId: 7, menuName: "แกงเขียวหวานไก่", quantity: 1, price: 80 }],
    deliveryAddress: "ตลาดบางมด ร้านลุงสมชาย",
    deliveryFee: 20,
    createdAt: minutesAgo(150),
  },
  {
    orderId: 1009,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    status: "completed",
    items: [
      { menuId: 6, menuName: "ต้มยำกุ้งน้ำข้น", quantity: 1, price: 120 },
      {
        menuId: 1,
        menuName: "ข้าวกะเพราหมูสับ",
        quantity: 1,
        price: 55,
        options: [{ optionName: "หมูสับ", extraPrice: 0 }],
      },
    ],
    deliveryAddress: "คอนโด The Base ตึก B ชั้น 8",
    deliveryFee: 20,
    createdAt: timeAt(1, 18, 20),
  },
  {
    orderId: 1019,
    customerId: 5,
    payerName: "ฟ้าใส บุญมา",
    status: "cancelled",
    cancelReason: "นอกพื้นที่จัดส่ง",
    refundStatus: "refunded",
    refundSlipUrl: "",
    items: [{ menuId: 11, menuName: "โกโก้เย็น", quantity: 2, price: 35 }],
    deliveryAddress: "หมู่บ้านพฤกษา 12 ซอย 3",
    deliveryFee: 20,
    createdAt: timeAt(1, 17, 40),
  },
  {
    orderId: 1010,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "completed",
    items: [
      {
        menuId: 1,
        menuName: "ข้าวกะเพราหมูสับ",
        quantity: 1,
        price: 55,
        options: [{ optionName: "ไก่", extraPrice: 0 }],
      },
      {
        menuId: 10,
        menuName: "ชาไทยเย็น",
        quantity: 1,
        price: 35,
        options: [{ optionName: "หวานปกติ", extraPrice: 0 }],
      },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    deliveryFee: 20,
    createdAt: timeAt(1, 12, 5),
  },
  {
    orderId: 1011,
    customerId: 3,
    payerName: "แพรวา ทองดี",
    status: "completed",
    items: [{ menuId: 4, menuName: "ผัดซีอิ๊วหมู", quantity: 2, price: 60 }],
    deliveryAddress: "มจธ. ตึกวิศวกรรมเครื่องกล",
    deliveryFee: 20,
    createdAt: timeAt(2, 12, 30),
  },
  {
    orderId: 1012,
    customerId: 8,
    payerName: "พลอย รุ่งเรือง",
    status: "completed",
    items: [
      { menuId: 2, menuName: "ข้าวผัดกุ้ง", quantity: 1, price: 70 },
      { menuId: 11, menuName: "โกโก้เย็น", quantity: 1, price: 35 },
    ],
    deliveryAddress: "บ้านเลขที่ 9 ซอยพุทธบูชา 36",
    deliveryFee: 20,
    createdAt: timeAt(3, 19, 0),
  },
  {
    orderId: 1013,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "completed",
    items: [
      {
        menuId: 5,
        menuName: "ก๋วยเตี๋ยวต้มยำ",
        quantity: 1,
        price: 60,
        options: [{ optionName: "เส้นใหญ่", extraPrice: 0 }],
      },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    deliveryFee: 20,
    createdAt: timeAt(4, 12, 15),
  },
  {
    orderId: 1014,
    customerId: 4,
    payerName: "ภาณุ แก้วใส",
    status: "completed",
    items: [
      { menuId: 6, menuName: "ต้มยำกุ้งน้ำข้น", quantity: 1, price: 120 },
      { menuId: 3, menuName: "ข้าวมันไก่", quantity: 2, price: 50 },
    ],
    deliveryAddress: "ซอยประชาอุทิศ 45 บ้านเลขที่ 88",
    deliveryFee: 20,
    createdAt: timeAt(5, 18, 45),
  },
  {
    orderId: 1015,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    status: "completed",
    items: [{ menuId: 8, menuName: "ปลานึ่งมะนาว", quantity: 1, price: 180 }],
    deliveryAddress: "คอนโด The Base ตึก B ชั้น 8",
    deliveryFee: 20,
    createdAt: timeAt(6, 19, 30),
  },
  {
    orderId: 1016,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "completed",
    items: [
      {
        menuId: 1,
        menuName: "ข้าวกะเพราหมูสับ",
        quantity: 1,
        price: 55,
        options: [{ optionName: "หมูสับ", extraPrice: 0 }],
      },
      { menuId: 12, menuName: "น้ำเปล่า", quantity: 1, price: 10 },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    deliveryFee: 20,
    createdAt: timeAt(7, 12, 0),
  },
];

const STEP_MINUTES = {
  paid: 0,
  accepted: 3,
  ready: 20,
  delivering: 25,
  completed: 40,
  cancelled: 4,
};

const STEPS = ["paid", "accepted", "ready", "delivering", "completed"];

const STEP_COUNT = {
  paid: 1,
  preparing: 2,
  ready: 3,
  delivering: 4,
  completed: 5,
  cancelled: 1,
};

const getLogBy = (order, status) => {
  if (status === "paid") return "ระบบตรวจสลิป";
  if (status === "cancelled" && order.cancelReason.includes("15 นาที")) {
    return "ระบบ";
  }
  if (["delivering", "completed"].includes(status)) return "คนส่ง";
  return "ร้าน";
};

const getBatchCode = (at) => {
  const day = new Date(at).toDateString();
  let last = 0;
  mockBatches.forEach((b) => {
    const number = Number(b.batchCode.slice(2));
    const isSameDay = new Date(b.createdAt).toDateString() === day;
    if (isSameDay && number > last) last = number;
  });
  return `R-${String(last + 1).padStart(2, "0")}`;
};

const PROOF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#DCCBB3"/><rect x="300" y="210" width="200" height="220" rx="16" fill="#C4A57E"/><text x="400" y="500" font-size="32" text-anchor="middle" fill="#6B5B45" font-family="sans-serif">รูปถุงอาหารหน้าประตูห้อง</text></svg>`;
const PROOF_PHOTO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PROOF_SVG)}`;

const ADDRESS_INFO = {
  "หอพักชวนชม ห้อง 305": ["หอพัก", "ฝากไว้ที่ป้อม รปภ."],
  "คอนโด The Base ตึก B ชั้น 8": ["หอพัก", "โทรหาก่อนขึ้นตึก"],
  "มจธ. ตึกวิศวกรรมเครื่องกล": ["ที่ทำงาน", "หน้าห้อง 302"],
  "บ้านเลขที่ 9 ซอยพุทธบูชา 36": ["บ้าน", "ประตูรั้วสีเขียว"],
  "ซอยประชาอุทิศ 45 บ้านเลขที่ 88": ["บ้าน", "ตรงข้ามร้านสะดวกซื้อ"],
  "คอนโด Lumpini ตึก A ชั้น 12": ["หอพัก", "ฝากไว้ที่ล็อบบี้"],
  "หมู่บ้านพฤกษา 12 ซอย 3": ["บ้าน", "บ้านหลังหัวมุม"],
  "ตลาดบางมด ร้านลุงสมชาย": ["ที่ทำงาน", "แผงที่ 5"],
};

mockOrders.forEach((order) => {
  const start = new Date(order.createdAt).getTime();
  const info = ADDRESS_INFO[order.deliveryAddress] || ["บ้าน", ""];
  order.shopId = 1;
  order.addressLabel = info[0];
  order.addressNote = info[1];
  if (order.status === "completed" && !order.batchId) {
    const at = new Date(start + STEP_MINUTES.delivering * 60000);
    mockBatches.push({
      batchId: mockBatches.length + 1,
      batchCode: getBatchCode(at),
      token: `t${order.orderId}`,
      orderIds: [order.orderId],
      status: "completed",
      createdAt: at.toISOString(),
      scannedAt: at.toISOString(),
      cancelledAt: null,
    });
    order.batchId = mockBatches.length;
  }
  const batch = mockBatches.find((b) => b.batchId === order.batchId);
  const steps = STEPS.slice(0, STEP_COUNT[order.status]);
  if (order.status === "cancelled") steps.push("cancelled");
  const logs = steps.map((status) => {
    let at = start + STEP_MINUTES[status] * 60000;
    if (batch && status === "delivering") {
      at = new Date(batch.scannedAt).getTime();
    }
    if (batch && status === "completed") {
      at = new Date(batch.scannedAt).getTime() + 15 * 60000;
    }
    return {
      status,
      at: new Date(at).toISOString(),
      by: getLogBy(order, status),
    };
  });
  logs.unshift({
    status: "pending_payment",
    at: new Date(start - 60000).toISOString(),
    by: "ลูกค้า",
  });
  order.statusLogs = logs;
  order.transRef = `016${order.orderId}APP0${order.customerId}8842`;
  if (order.status === "completed") {
    order.proofTakenAt = logs[logs.length - 1].at;
    order.proofTimeSource = order.proofTimeSource || "camera";
    order.deliveryPhotoUrl = PROOF_PHOTO;
  }
});

export const mockTagRequests = [];

export const REGULAR_MIN_ORDERS = 3;

export const getBatch = (batchId) => {
  return mockBatches.find((b) => b.batchId === batchId);
};

export const itemTotal = (item) => {
  let extra = 0;
  (item.options || []).forEach((option) => {
    extra += option.extraPrice;
  });
  return (item.price + extra) * item.quantity;
};

export const orderTotal = (order) => {
  let total = 0;
  order.items.forEach((item) => {
    total += itemTotal(item);
  });
  return total;
};

export const paidTotal = (order) => {
  return orderTotal(order) + order.deliveryFee;
};

export const optionText = (item) => {
  return (item.options || []).map((o) => o.optionName).join(" · ");
};

export const itemText = (order) => {
  return order.items
    .map((item) => `${item.menuName} ×${item.quantity}`)
    .join(", ");
};

export const isRegularCustomer = (customerId) => {
  const from = Date.now() - 30 * 24 * 60 * 60000;
  const count = mockOrders.filter((o) => {
    const isRecent = new Date(o.createdAt).getTime() >= from;
    const isAccepted = !["paid", "cancelled", "pending_payment"].includes(
      o.status,
    );
    return o.customerId === customerId && isAccepted && isRecent;
  }).length;
  return count >= REGULAR_MIN_ORDERS;
};

export const addStatusLog = (order, status, by) => {
  order.status = status;
  order.statusLogs.push({ status, at: new Date().toISOString(), by });
};

const onSwitchShop = (accountId) => {
  const current = mockAccounts.find((a) => a.accountId === mockShop.accountId);
  current.shop = { ...mockShop };
  current.isOpen = mockShop.isOpen;
  const account = mockAccounts.find((a) => a.accountId === accountId);
  const shop = account.shop || {
    ...baseShop,
    accountId: account.accountId,
    shopName: account.accountName,
    status: "approved",
    isOpen: account.isOpen,
  };
  Object.assign(mockShop, shop);
};

export const fetchSaveShop = (payload) => {
  if (payload.actionType === "open") {
    mockShop.isOpen = payload.isOpen;
  }
  if (payload.actionType === "U") {
    Object.assign(mockShop, payload.shop);
    const account = mockAccounts.find(
      (a) => a.accountId === mockShop.accountId,
    );
    account.accountName = mockShop.shopName;
  }
  if (payload.actionType === "request") {
    const accountId = mockAccounts.length + 1;
    const account = {
      accountId: accountId,
      accountType: "shop",
      accountName: payload.shop.shopName,
      status: "pending",
      requestedAt: new Date().toISOString(),
      newOrderCount: 0,
      isOpen: false,
      shop: {
        ...mockShop,
        ...payload.shop,
        accountId: accountId,
        description: "",
        status: "pending",
        isOpen: false,
      },
    };
    mockAccounts.splice(mockAccounts.length - 1, 0, account);
    onSwitchShop(accountId);
  }
  if (payload.actionType === "approve") {
    const account = mockAccounts.find((a) => a.accountId === payload.accountId);
    account.status = "approved";
    if (account.shop) account.shop.status = "approved";
    if (mockShop.accountId === account.accountId) {
      mockShop.status = "approved";
    }
  }
  if (payload.actionType === "switch") {
    onSwitchShop(payload.accountId);
  }
  return { success: true };
};

export const fetchSaveOrder = (payload) => {
  const order = mockOrders.find((o) => o.orderId === payload.orderId);
  if (payload.actionType === "accept") {
    addStatusLog(order, "accepted", payload.by);
    order.status = "preparing";
  }
  if (payload.actionType === "status") {
    addStatusLog(order, payload.status, payload.by);
  }
  if (payload.actionType === "cancel") {
    addStatusLog(order, "cancelled", payload.by);
    order.cancelReason = payload.reason;
    order.refundStatus = payload.isRefund ? "pending" : "none";
  }
  if (payload.actionType === "refund") {
    order.refundStatus = "refunded";
    order.refundSlipUrl = payload.slipUrl;
    order.refundAt = new Date().toISOString();
  }
  return { success: true };
};

export const fetchSaveBatch = (payload) => {
  if (payload.actionType === "A") {
    const now = new Date().toISOString();
    const code = Math.random().toString(36).slice(2, 6);
    const batch = {
      batchId: mockBatches.length + 1,
      batchCode: getBatchCode(now),
      token: [code, ...payload.orderIds].join("-"),
      orderIds: payload.orderIds,
      status: "active",
      createdAt: now,
      scannedAt: null,
      cancelledAt: null,
    };
    mockBatches.push(batch);
    mockOrders.forEach((o) => {
      if (payload.orderIds.includes(o.orderId)) o.batchId = batch.batchId;
    });
    return { success: true, batch: batch };
  }
  if (payload.actionType === "cancel") {
    const batch = getBatch(payload.batchId);
    if (batch.scannedAt) return { success: false };
    batch.status = "cancelled";
    batch.cancelledAt = new Date().toISOString();
    mockOrders.forEach((o) => {
      if (o.batchId === batch.batchId) o.batchId = null;
    });
  }
  return { success: true };
};

export const fetchSaveMenu = (payload) => {
  const index = mockMenus.findIndex((m) => m.menuId === payload.menuId);
  if (payload.actionType === "A") {
    const newId = Math.max(...mockMenus.map((m) => m.menuId), 0) + 1;
    mockMenus.push({ ...payload.menu, menuId: newId });
    payload.tagRequests.forEach((request) => {
      mockTagRequests.push({ ...request, menuId: newId });
    });
  }
  if (payload.actionType === "U") {
    mockMenus[index] = { ...payload.menu, menuId: payload.menuId };
  }
  if (payload.actionType === "D") {
    if (index === -1) return { success: false };
    mockMenus.splice(index, 1);
  }
  if (payload.actionType === "available") {
    mockMenus[index].isAvailable = payload.isAvailable;
  }
  return { success: true };
};

export const fetchSaveTagRequest = (payload) => {
  mockTagRequests.push(payload);
  return { success: true };
};

export const SHOP_CHIPS = ["ทั้งหมด", "อาหารตามสั่ง", "ก๋วยเตี๋ยว", "ส้มตำ"];

export const mockNearbyShops = [
  {
    shopId: 1,
    shopName: "ครัวป้าแดง",
    categoryName: "อาหารตามสั่ง",
    chip: "อาหารตามสั่ง",
    distance: 0.8,
    color: "#FFE8DE",
    iconColor: "#C78A00",
  },
  {
    shopId: 2,
    shopName: "ก๋วยเตี๋ยวเรือลุงหมาย",
    categoryName: "ก๋วยเตี๋ยว",
    chip: "ก๋วยเตี๋ยว",
    distance: 1.2,
    deliveryFee: 20,
    minOrder: 50,
    openTime: "09:00",
    closeTime: "19:00",
    isOpen: true,
    phone: "082-345-6789",
    color: "#FFF1D6",
    iconColor: "#C78A00",
  },
  {
    shopId: 3,
    shopName: "ส้มตำแม่นวล",
    categoryName: "อาหารอีสาน",
    chip: "ส้มตำ",
    distance: 1.9,
    deliveryFee: 25,
    minOrder: 80,
    openTime: "10:00",
    closeTime: "20:00",
    isOpen: true,
    phone: "083-456-7890",
    color: "#FDE7E7",
    iconColor: "#B42318",
  },
  {
    shopId: 4,
    shopName: "ชานมน้องฟ้า",
    categoryName: "เครื่องดื่ม",
    chip: "เครื่องดื่ม",
    distance: 2.4,
    deliveryFee: 30,
    minOrder: 60,
    openTime: "10:00",
    closeTime: "21:00",
    isOpen: false,
    phone: "084-567-8901",
    color: "#E6EEFF",
    iconColor: "#1D4ED8",
  },
];

export const mockOtherMenus = [
  {
    shopId: 2,
    menuId: 101,
    menuName: "เส้นเล็กน้ำตก",
    categoryName: "เส้น",
    price: 50,
    description: "น้ำซุปเข้มข้น หมูตุ๋นนุ่ม",
    tagIds: [4, 7, 11, 33],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 2,
    menuId: 102,
    menuName: "เกาเหลา",
    categoryName: "เส้น",
    price: 70,
    description: "ไม่ใส่เส้น เครื่องแน่น",
    tagIds: [4, 11, 33],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 2,
    menuId: 103,
    menuName: "ก๋วยเตี๋ยวเรือเนื้อ",
    categoryName: "เส้น",
    price: 60,
    description: "เนื้อเปื่อย ลูกชิ้นเนื้อ",
    tagIds: [4, 15, 33],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 2,
    menuId: 104,
    menuName: "ชาดำเย็น",
    categoryName: "เครื่องดื่ม",
    price: 25,
    description: "",
    tagIds: [3, 20, 39],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 3,
    menuId: 201,
    menuName: "ตำไทย",
    categoryName: "ส้มตำ",
    price: 50,
    description: "ตำสด เปรี้ยวหวานกลมกล่อม",
    tagIds: [1, 2, 3, 18, 37],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 3,
    menuId: 202,
    menuName: "ไก่ย่าง",
    categoryName: "ของย่าง",
    price: 80,
    description: "ไก่ย่างเขาสวนกวาง ครึ่งตัว",
    tagIds: [4, 12, 35],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 3,
    menuId: 203,
    menuName: "ข้าวเหนียว",
    categoryName: "ข้าว",
    price: 10,
    description: "",
    tagIds: [6, 34],
    optionGroups: [],
    isAvailable: true,
  },
  {
    shopId: 4,
    menuId: 301,
    menuName: "ชานมไข่มุก",
    categoryName: "เครื่องดื่ม",
    price: 45,
    description: "ไข่มุกเคี้ยวหนึบ หวานกำลังดี",
    tagIds: [3, 5, 20, 21, 39],
    optionGroups: [],
    isAvailable: true,
  },
];

export const mockMe = {
  customerId: 1,
  displayName: "มายด์ 🌷",
  payerName: "ณัฐธิดา มีสุข",
  isNew: false,
  consentAt: timeAt(5, 9, 30),
  isLocationOn: true,
  refundPromptPay: "089-111-2233",
  addressId: 1,
  deletedAt: null,
};

export const mockAddresses = [
  {
    addressId: 1,
    label: "หอพัก",
    address: "หอพักชวนชม ห้อง 305",
    note: "ฝากไว้ที่ป้อม รปภ.",
    phone: "089-111-2233",
    isMain: true,
  },
  {
    addressId: 2,
    label: "ที่ทำงาน",
    address: "อาคารสาทรซิตี้ทาวเวอร์ ชั้น 12",
    note: "",
    phone: "089-111-2233",
    isMain: false,
  },
];

export const mockCart = {
  shopId: null,
  items: [],
};

export const mockMyOrders = [
  {
    orderId: 5310,
    shopId: 2,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "completed",
    items: [
      { menuId: 101, menuName: "เส้นเล็กน้ำตก", quantity: 2, price: 50 },
      { menuId: 102, menuName: "เกาเหลา", quantity: 1, price: 70 },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    addressLabel: "หอพัก",
    addressNote: "ฝากไว้ที่ป้อม รปภ.",
    deliveryFee: 20,
    createdAt: timeAt(9, 18, 5),
  },
  {
    orderId: 6127,
    shopId: 3,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    status: "cancelled",
    cancelReason: "วัตถุดิบหมด",
    refundStatus: "pending",
    items: [
      { menuId: 201, menuName: "ตำไทย", quantity: 1, price: 50 },
      { menuId: 202, menuName: "ไก่ย่าง", quantity: 1, price: 80 },
      { menuId: 203, menuName: "ข้าวเหนียว", quantity: 2, price: 10 },
    ],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    addressLabel: "หอพัก",
    addressNote: "ฝากไว้ที่ป้อม รปภ.",
    deliveryFee: 25,
    createdAt: timeAt(10, 11, 47),
  },
];

mockMyOrders.forEach((order) => {
  const start = new Date(order.createdAt).getTime();
  let steps = STEPS;
  if (order.status === "cancelled") steps = ["paid", "cancelled"];
  order.statusLogs = steps.map((status) => {
    return {
      status,
      at: new Date(start + STEP_MINUTES[status] * 60000).toISOString(),
      by: getLogBy(order, status),
    };
  });
  order.transRef = `016${order.orderId}APP018842`;
  if (order.status === "completed") {
    order.proofTakenAt = order.statusLogs[4].at;
    order.proofTimeSource = "camera";
    order.deliveryPhotoUrl = PROOF_PHOTO;
  }
});

export const ACTIVE_STATUS = ["paid", "preparing", "ready", "delivering"];

export const getShop = (shopId) => {
  const shop = mockNearbyShops.find((s) => s.shopId === shopId);
  if (shopId !== 1) return shop;
  const day = mockShop.openHours[(new Date().getDay() + 6) % 7];
  return {
    ...shop,
    shopName: mockShop.shopName,
    isOpen: mockShop.isOpen,
    deliveryFee: mockShop.deliveryFee,
    minOrder: mockShop.minOrder,
    openTime: day.openTime,
    closeTime: day.closeTime,
    phone: mockShop.phone,
    promptPayId: mockShop.promptPayId,
  };
};

export const getShopMenus = (shopId) => {
  if (shopId !== 1) {
    return mockOtherMenus.filter((m) => m.shopId === shopId);
  }
  return mockMenus.map((m) => {
    const category = mockCategories.find((c) => c.categoryId === m.categoryId);
    return { ...m, shopId: 1, categoryName: category?.categoryName };
  });
};

export const getMenu = (menuId) => {
  const menu = mockOtherMenus.find((m) => m.menuId === menuId);
  if (menu) return menu;
  return getShopMenus(1).find((m) => m.menuId === menuId);
};

export const getMyOrders = () => {
  const shopOrders = mockOrders.filter((o) => {
    return o.customerId === mockMe.customerId;
  });
  const result = [...shopOrders, ...mockMyOrders].filter((o) => {
    return !mockMe.deletedAt || o.createdAt > mockMe.deletedAt;
  });
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
};

export const getOrder = (orderId) => {
  const order = mockOrders.find((o) => o.orderId === orderId);
  return order || mockMyOrders.find((o) => o.orderId === orderId);
};

export const getActiveOrder = () => {
  return getMyOrders().find((o) => ACTIVE_STATUS.includes(o.status));
};

export const PAY_MINUTES = 15;

export const getPaySecondsLeft = (order) => {
  const deadline = new Date(order.createdAt).getTime() + PAY_MINUTES * 60000;
  return Math.max(0, Math.round((deadline - Date.now()) / 1000));
};

export const getLog = (order, status) => {
  return order.statusLogs.find((l) => l.status === status);
};

export const getRecommendMenus = (shopId) => {
  const score = {};
  getMyOrders().forEach((order) => {
    order.items.forEach((item) => {
      const menu = getMenu(item.menuId);
      (menu?.tagIds || []).forEach((tagId) => {
        score[tagId] = (score[tagId] || 0) + item.quantity;
      });
    });
  });
  const result = getShopMenus(shopId)
    .filter((m) => m.isAvailable)
    .map((m) => {
      let total = 0;
      m.tagIds.forEach((tagId) => {
        total += score[tagId] || 0;
      });
      return { ...m, score: total };
    })
    .filter((m) => m.score > 0);
  result.sort((a, b) => b.score - a.score);
  return result.slice(0, 3);
};

export const cartTotal = () => {
  let total = 0;
  mockCart.items.forEach((item) => {
    total += itemTotal(item);
  });
  return total;
};

export const cartCount = () => {
  let count = 0;
  mockCart.items.forEach((item) => {
    count += item.quantity;
  });
  return count;
};

export const fetchSaveCart = (payload) => {
  if (payload.actionType === "add") {
    if (mockCart.shopId !== payload.shopId) mockCart.items = [];
    mockCart.shopId = payload.shopId;
    mockCart.items.push({ ...payload.item, key: Date.now() });
  }
  if (payload.actionType === "qty") {
    const item = mockCart.items.find((i) => i.key === payload.key);
    item.quantity = payload.quantity;
    if (payload.quantity === 0) {
      mockCart.items = mockCart.items.filter((i) => i.key !== payload.key);
    }
  }
  if (payload.actionType === "reorder") {
    mockCart.shopId = payload.order.shopId;
    mockCart.items = payload.order.items.map((item, index) => {
      return { ...item, key: Date.now() + index };
    });
  }
  if (payload.actionType === "clear") {
    mockCart.shopId = null;
    mockCart.items = [];
  }
  return { success: true };
};

export const fetchSaveAddress = (payload) => {
  if (payload.actionType === "A") {
    const newId = Math.max(...mockAddresses.map((a) => a.addressId), 0) + 1;
    mockAddresses.push({ ...payload.address, addressId: newId });
    mockMe.addressId = newId;
  }
  if (payload.actionType === "U") {
    const address = mockAddresses.find((a) => {
      return a.addressId === payload.addressId;
    });
    Object.assign(address, payload.address);
    mockMe.addressId = payload.addressId;
  }
  if (payload.actionType === "D") {
    const index = mockAddresses.findIndex((a) => {
      return a.addressId === payload.addressId;
    });
    mockAddresses.splice(index, 1);
    if (mockMe.addressId === payload.addressId) {
      mockMe.addressId = mockAddresses[0]?.addressId || null;
    }
  }
  if (payload.actionType === "select") {
    mockMe.addressId = payload.addressId;
  }
  if (payload.address?.isMain) {
    mockAddresses.forEach((a) => {
      a.isMain = a.addressId === mockMe.addressId;
    });
  }
  return { success: true };
};

export const fetchSaveMe = (payload) => {
  if (payload.actionType === "consent") {
    mockMe.isNew = false;
    mockMe.isLocationOn = payload.isLocationOn;
    mockMe.consentAt = null;
    if (payload.isLocationOn) mockMe.consentAt = new Date().toISOString();
  }
  if (payload.actionType === "location") {
    mockMe.isLocationOn = payload.isLocationOn;
    if (payload.isLocationOn) mockMe.consentAt = new Date().toISOString();
  }
  if (payload.actionType === "refund") {
    mockMe.refundPromptPay = payload.refundPromptPay;
  }
  if (payload.actionType === "delete") {
    if (getActiveOrder()) return { success: false };
    mockMe.isNew = true;
    mockMe.consentAt = null;
    mockMe.isLocationOn = false;
    mockMe.refundPromptPay = "";
    mockMe.addressId = null;
    mockMe.deletedAt = new Date().toISOString();
    mockAddresses.splice(0, mockAddresses.length);
    fetchSaveCart({ actionType: "clear" });
  }
  return { success: true };
};

export const fetchSaveMyOrder = (payload) => {
  if (payload.actionType === "A") {
    const shop = getShop(mockCart.shopId);
    const address = mockAddresses.find((a) => {
      return a.addressId === mockMe.addressId;
    });
    const allIds = [...mockOrders, ...mockMyOrders].map((o) => o.orderId);
    const now = new Date().toISOString();
    const order = {
      orderId: Math.max(...allIds) + 1,
      shopId: shop.shopId,
      customerId: mockMe.customerId,
      payerName: mockMe.payerName,
      status: "pending_payment",
      items: mockCart.items.map((item) => {
        return {
          menuId: item.menuId,
          menuName: item.menuName,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
          note: item.note,
        };
      }),
      deliveryAddress: address.address,
      addressLabel: address.label,
      addressNote: address.note,
      deliveryFee: shop.deliveryFee,
      createdAt: now,
      statusLogs: [{ status: "pending_payment", at: now, by: "ลูกค้า" }],
    };
    order.transRef = `016${order.orderId}APP018842`;
    mockMyOrders.push(order);
    mockMe.refundPromptPay = payload.refundPromptPay;
    fetchSaveCart({ actionType: "clear" });
    return { success: true, order: order };
  }
  const order = getOrder(payload.orderId);
  if (payload.actionType === "slip") {
    order.slipUrl = payload.slipUrl;
  }
  if (payload.actionType === "paid") {
    addStatusLog(order, "paid", "ระบบตรวจสลิป");
    if (order.shopId === 1) {
      const index = mockMyOrders.findIndex((o) => o.orderId === order.orderId);
      mockMyOrders.splice(index, 1);
      mockOrders.push(order);
    }
  }
  if (payload.actionType === "cancel") {
    const isPaid = order.status !== "pending_payment";
    addStatusLog(order, "cancelled", payload.by || "ลูกค้า");
    order.cancelReason = payload.reason;
    order.refundStatus = isPaid ? "pending" : "none";
  }
  return { success: true };
};

export const getBatchByToken = (token) => {
  const batch = mockBatches.find((b) => b.token === token);
  if (batch) return batch;
  const orderIds = token.split("-").slice(1).map(Number);
  const orders = mockOrders.filter((o) => orderIds.includes(o.orderId));
  if (orderIds.length === 0 || orders.length !== orderIds.length) return;
  const now = new Date().toISOString();
  const newBatch = {
    batchId: mockBatches.length + 1,
    batchCode: getBatchCode(now),
    token: token,
    orderIds: orderIds,
    status: "active",
    createdAt: now,
    scannedAt: null,
    cancelledAt: null,
  };
  mockBatches.push(newBatch);
  orders.forEach((o) => {
    o.batchId = newBatch.batchId;
  });
  return newBatch;
};

export const fetchSaveDelivery = (payload) => {
  const batch = getBatchByToken(payload.token);
  const orders = mockOrders.filter((o) => batch.orderIds.includes(o.orderId));
  if (payload.actionType === "scan") {
    if (batch.scannedAt || batch.status !== "active") return { success: true };
    batch.scannedAt = new Date().toISOString();
    orders.forEach((o) => {
      if (o.status === "ready") addStatusLog(o, "delivering", "คนส่ง");
    });
  }
  if (payload.actionType === "deliver") {
    const order = orders.find((o) => o.orderId === payload.orderId);
    addStatusLog(order, "completed", "คนส่ง");
    order.proofTakenAt = payload.takenAt;
    order.proofTimeSource = payload.timeSource;
    order.deliveryPhotoUrl = payload.photoUrl;
    order.deliveryNote = payload.note;
    const isAllDone = orders.every((o) => o.status === "completed");
    if (isAllDone) batch.status = "completed";
  }
  return { success: true };
};
