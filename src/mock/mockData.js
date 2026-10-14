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
  shopName: "ครัวป้าแดง",
  ownerName: "ป้าแดง ใจดี",
  phone: "081-234-5678",
  address: "12/3 ซอยประชาอุทิศ 5 ต.บางมด อ.ทุ่งครุ กรุงเทพฯ",
  isOpen: true,
  deliveryFee: 20,
};

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

export const mockRiders = [
  { riderId: 1, riderName: "สมศักดิ์ ส่งไว", phone: "080-123-4567" },
  { riderId: 2, riderName: "วิชัย ใจดี", phone: "080-765-4321" },
];

export const mockOrders = [
  {
    orderId: 1001,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    riderId: null,
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
    distanceKm: 0.6,
    pin: { lat: 13.8216, lng: 100.51992 },
    deliveryFee: 20,
    createdAt: minutesAgo(2),
  },
  {
    orderId: 1002,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    slipCheck: "manual",
    riderId: null,
    status: "paid",
    items: [
      { menuId: 6, menuName: "ต้มยำกุ้งน้ำข้น", quantity: 1, price: 120 },
    ],
    deliveryAddress: "คอนโด The Base ตึก B ชั้น 8",
    distanceKm: 1.4,
    pin: { lat: 13.8176, lng: 100.52728 },
    deliveryFee: 20,
    createdAt: minutesAgo(5),
  },
  {
    orderId: 1003,
    customerId: 3,
    payerName: "แพรวา ทองดี",
    riderId: null,
    status: "accepted",
    items: [
      { menuId: 4, menuName: "ผัดซีอิ๊วหมู", quantity: 1, price: 60 },
      { menuId: 11, menuName: "โกโก้เย็น", quantity: 2, price: 35 },
    ],
    deliveryAddress: "มจธ. ตึกวิศวกรรมเครื่องกล",
    distanceKm: 0.9,
    pin: { lat: 13.8196, lng: 100.52268 },
    deliveryFee: 20,
    createdAt: minutesAgo(18),
  },
  {
    orderId: 1017,
    customerId: 8,
    payerName: "พลอย รุ่งเรือง",
    riderId: null,
    status: "accepted",
    items: [{ menuId: 3, menuName: "ข้าวมันไก่", quantity: 1, price: 50 }],
    deliveryAddress: "บ้านเลขที่ 9 ซอยพุทธบูชา 36",
    distanceKm: 1.2,
    pin: { lat: 13.8176, lng: 100.52544 },
    deliveryFee: 20,
    createdAt: minutesAgo(12),
  },
  {
    orderId: 1004,
    customerId: 4,
    payerName: "ภาณุ แก้วใส",
    riderId: 1,
    status: "preparing",
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
    distanceKm: 1.8,
    pin: { lat: 13.8216, lng: 100.53096 },
    deliveryFee: 20,
    createdAt: minutesAgo(35),
  },
  {
    orderId: 1018,
    customerId: 6,
    payerName: "กวินทรา คงเจริญ",
    riderId: null,
    status: "preparing",
    items: [
      { menuId: 7, menuName: "แกงเขียวหวานไก่", quantity: 1, price: 80 },
      { menuId: 9, menuName: "ไข่ตุ๋น", quantity: 1, price: 40 },
    ],
    deliveryAddress: "คอนโด Lumpini ตึก A ชั้น 12",
    distanceKm: 2.3,
    pin: { lat: 13.8196, lng: 100.53556 },
    deliveryFee: 20,
    createdAt: minutesAgo(28),
  },
  {
    orderId: 1005,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    riderId: "shop",
    status: "delivering",
    items: [{ menuId: 2, menuName: "ข้าวผัดกุ้ง", quantity: 1, price: 70 }],
    deliveryAddress: "หอพักชวนชม ห้อง 305",
    distanceKm: 0.6,
    pin: { lat: 13.8176, lng: 100.51992 },
    deliveryFee: 20,
    createdAt: minutesAgo(50),
  },
  {
    orderId: 1006,
    customerId: 5,
    payerName: "ฟ้าใส บุญมา",
    riderId: 2,
    status: "completed",
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
    distanceKm: 1.1,
    pin: { lat: 13.8196, lng: 100.52452 },
    deliveryFee: 20,
    createdAt: minutesAgo(95),
  },
  {
    orderId: 1007,
    deliveryNote: "วางไว้หน้าประตูตามที่ลูกค้าแจ้ง",
    proof: { lat: 13.8231, lng: 100.5381 },
    customerId: 6,
    payerName: "กวินทรา คงเจริญ",
    riderId: 1,
    status: "completed",
    items: [{ menuId: 8, menuName: "ปลานึ่งมะนาว", quantity: 1, price: 180 }],
    deliveryAddress: "คอนโด Lumpini ตึก A ชั้น 12",
    distanceKm: 2.3,
    pin: { lat: 13.8216, lng: 100.53556 },
    deliveryFee: 20,
    createdAt: minutesAgo(130),
  },
  {
    orderId: 1008,
    customerId: 7,
    payerName: "สมชาย ใจดี",
    riderId: null,
    status: "cancelled",
    cancelReason: "เมนูหมด",
    refundStatus: "pending",
    items: [{ menuId: 7, menuName: "แกงเขียวหวานไก่", quantity: 1, price: 80 }],
    deliveryAddress: "ตลาดบางมด ร้านลุงสมชาย",
    distanceKm: 0.8,
    pin: { lat: 13.8176, lng: 100.52176 },
    deliveryFee: 20,
    createdAt: minutesAgo(150),
  },
  {
    orderId: 1009,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    riderId: 2,
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
    distanceKm: 1.4,
    pin: { lat: 13.8196, lng: 100.52728 },
    deliveryFee: 20,
    createdAt: timeAt(1, 18, 20),
  },
  {
    orderId: 1019,
    customerId: 5,
    payerName: "ฟ้าใส บุญมา",
    riderId: null,
    status: "cancelled",
    cancelReason: "นอกพื้นที่จัดส่ง",
    refundStatus: "refunded",
    refundSlipUrl: "",
    items: [{ menuId: 11, menuName: "โกโก้เย็น", quantity: 2, price: 35 }],
    deliveryAddress: "หมู่บ้านพฤกษา 12 ซอย 3",
    distanceKm: 1.1,
    pin: { lat: 13.8216, lng: 100.52452 },
    deliveryFee: 20,
    createdAt: timeAt(1, 17, 40),
  },
  {
    orderId: 1010,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    riderId: 1,
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
    distanceKm: 0.6,
    pin: { lat: 13.8216, lng: 100.51992 },
    deliveryFee: 20,
    createdAt: timeAt(1, 12, 5),
  },
  {
    orderId: 1011,
    customerId: 3,
    payerName: "แพรวา ทองดี",
    riderId: 2,
    status: "completed",
    items: [{ menuId: 4, menuName: "ผัดซีอิ๊วหมู", quantity: 2, price: 60 }],
    deliveryAddress: "มจธ. ตึกวิศวกรรมเครื่องกล",
    distanceKm: 0.9,
    pin: { lat: 13.8176, lng: 100.52268 },
    deliveryFee: 20,
    createdAt: timeAt(2, 12, 30),
  },
  {
    orderId: 1012,
    customerId: 8,
    payerName: "พลอย รุ่งเรือง",
    riderId: 1,
    status: "completed",
    items: [
      { menuId: 2, menuName: "ข้าวผัดกุ้ง", quantity: 1, price: 70 },
      { menuId: 11, menuName: "โกโก้เย็น", quantity: 1, price: 35 },
    ],
    deliveryAddress: "บ้านเลขที่ 9 ซอยพุทธบูชา 36",
    distanceKm: 1.2,
    pin: { lat: 13.8196, lng: 100.52544 },
    deliveryFee: 20,
    createdAt: timeAt(3, 19, 0),
  },
  {
    orderId: 1013,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    riderId: 2,
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
    distanceKm: 0.6,
    pin: { lat: 13.8216, lng: 100.51992 },
    deliveryFee: 20,
    createdAt: timeAt(4, 12, 15),
  },
  {
    orderId: 1014,
    customerId: 4,
    payerName: "ภาณุ แก้วใส",
    riderId: 1,
    status: "completed",
    items: [
      { menuId: 6, menuName: "ต้มยำกุ้งน้ำข้น", quantity: 1, price: 120 },
      { menuId: 3, menuName: "ข้าวมันไก่", quantity: 2, price: 50 },
    ],
    deliveryAddress: "ซอยประชาอุทิศ 45 บ้านเลขที่ 88",
    distanceKm: 1.8,
    pin: { lat: 13.8176, lng: 100.53096 },
    deliveryFee: 20,
    createdAt: timeAt(5, 18, 45),
  },
  {
    orderId: 1015,
    customerId: 2,
    payerName: "ธนากร ศรีวงศ์",
    riderId: 2,
    status: "completed",
    items: [{ menuId: 8, menuName: "ปลานึ่งมะนาว", quantity: 1, price: 180 }],
    deliveryAddress: "คอนโด The Base ตึก B ชั้น 8",
    distanceKm: 1.4,
    pin: { lat: 13.8196, lng: 100.52728 },
    deliveryFee: 20,
    createdAt: timeAt(6, 19, 30),
  },
  {
    orderId: 1016,
    customerId: 1,
    payerName: "ณัฐธิดา มีสุข",
    riderId: 1,
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
    distanceKm: 0.6,
    pin: { lat: 13.8216, lng: 100.51992 },
    deliveryFee: 20,
    createdAt: timeAt(7, 12, 0),
  },
];

const STEP_MINUTES = {
  paid: 0,
  accepted: 3,
  preparing: 6,
  delivering: 25,
  completed: 40,
  cancelled: 4,
};

const STEPS = ["paid", "accepted", "preparing", "delivering", "completed"];

const getLogBy = (order, status) => {
  if (status === "pending_payment") return "ลูกค้า";
  if (status === "paid") return "ระบบตรวจสลิป";
  if (status === "cancelled" && order.cancelReason.includes("10 นาที")) {
    return "ระบบ";
  }
  const isDelivery = ["delivering", "completed"].includes(status);
  if (isDelivery && order.riderId !== "shop") {
    const rider = mockRiders.find((r) => r.riderId === order.riderId);
    return `คนส่ง ${rider.riderName}`;
  }
  return "ร้าน";
};

mockOrders.forEach((order) => {
  const start = new Date(order.createdAt).getTime();
  const end =
    order.status === "cancelled" ? 1 : STEPS.indexOf(order.status) + 1;
  const steps = STEPS.slice(0, end);
  if (order.status === "cancelled") steps.push("cancelled");
  const logs = steps.map((status) => {
    const at = start + STEP_MINUTES[status] * 60000;
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
  if (order.riderId !== null) {
    const at = start + STEP_MINUTES.preparing * 60000;
    order.assignedAt = new Date(at).toISOString();
  }
  if (order.status === "completed" && !order.proof) {
    order.proof = { lat: order.pin.lat, lng: order.pin.lng + 0.0002 };
  }
});

export const mockTagRequests = [];

export const REGULAR_MIN_ORDERS = 3;

export const SHOP_RIDER = "shop";

export const isRiderJob = (order) => {
  return order.riderId !== null && order.riderId !== SHOP_RIDER;
};

export const getRiderName = (riderId) => {
  if (riderId === SHOP_RIDER) return "ร้านส่งเอง";
  const rider = mockRiders.find((r) => r.riderId === riderId);
  return rider ? rider.riderName : "";
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
    return o.customerId === customerId && o.status !== "cancelled" && isRecent;
  }).length;
  return count >= REGULAR_MIN_ORDERS;
};

export const addStatusLog = (order, status, by) => {
  order.status = status;
  order.statusLogs.push({ status, at: new Date().toISOString(), by });
};

export const fetchSaveShop = (payload) => {
  mockShop.isOpen = payload.isOpen;
  return { success: true };
};

export const fetchSaveOrder = (payload) => {
  const order = mockOrders.find((o) => o.orderId === payload.orderId);
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
  }
  if (payload.actionType === "delivered") {
    addStatusLog(order, "completed", payload.by);
    order.deliveryPhotoUrl = payload.photoUrl;
    order.proof = payload.proof;
  }
  if (payload.actionType === "rider") {
    order.riderId = payload.riderId;
    order.assignedAt = new Date().toISOString();
  }
  return { success: true };
};

export const fetchSaveMenu = (payload) => {
  const index = mockMenus.findIndex((m) => m.menuId === payload.menuId);
  if (payload.actionType === "A") {
    const newId = Math.max(...mockMenus.map((m) => m.menuId), 0) + 1;
    mockMenus.push({ ...payload.menu, menuId: newId });
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
