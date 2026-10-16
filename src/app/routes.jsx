import Login from "@/pages/login/login";
import Location from "@/pages/customer/location";
import Nearby from "@/pages/customer/shops/nearby";
import Shop from "@/pages/customer/shops/shop";
import Cart from "@/pages/customer/order/cart";
import Address from "@/pages/customer/order/address";
import Payment from "@/pages/customer/payment/payment";
import Verifying from "@/pages/customer/payment/verifying";
import SlipFail from "@/pages/customer/payment/slipFail";
import Tracking from "@/pages/customer/tracking/tracking";
import Cancelled from "@/pages/customer/tracking/cancelled";
import History from "@/pages/customer/tracking/history";
import HistoryDetail from "@/pages/customer/tracking/historyDetail";
import Account from "@/pages/customer/account";
import Order from "@/pages/shop/orders/order";
import OrderDetail from "@/pages/shop/orders/orderDetail";
import Menu from "@/pages/shop/menus/menu";
import MenuForm from "@/pages/shop/menus/menuForm";
import Report from "@/pages/shop/reports/report";
import Customer from "@/pages/shop/customers/customer";
import Setting from "@/pages/shop/settings/setting";
import Jobs from "@/pages/rider/jobs";
import JobDetail from "@/pages/rider/jobDetail";
import Deliver from "@/pages/rider/deliver";

export const routes = [
  {
    code: "AUTH01",
    title: "เข้าสู่ระบบ",
    path: "/login",
    element: <Login />,
  },
  {
    code: "AUTH04",
    title: "ขอใช้ตำแหน่ง",
    path: "/c/location",
    element: <Location />,
  },
  {
    code: "SHP01",
    title: "ร้านใกล้ฉัน",
    path: "/c/nearby",
    element: <Nearby />,
  },
  {
    code: "SHP02",
    title: "หน้าร้าน",
    path: "/c/shop/:shopId",
    element: <Shop />,
  },
  {
    code: "ORD02",
    title: "ตะกร้า",
    path: "/c/cart",
    element: <Cart />,
  },
  {
    code: "ORD03",
    title: "ที่อยู่จัดส่ง",
    path: "/c/address/:from",
    element: <Address />,
  },
  {
    code: "PAY01",
    title: "ชำระเงิน",
    path: "/c/payment/:orderId",
    element: <Payment />,
  },
  {
    code: "PAY02",
    title: "กำลังตรวจสลิป",
    path: "/c/verifying/:orderId",
    element: <Verifying />,
  },
  {
    code: "PAY03",
    title: "สลิปไม่ผ่าน",
    path: "/c/slip-fail/:orderId",
    element: <SlipFail />,
  },
  {
    code: "TRK01",
    title: "ติดตามคำสั่งซื้อ",
    path: "/c/tracking/:orderId",
    element: <Tracking />,
  },
  {
    code: "TRK02",
    title: "คำสั่งซื้อถูกยกเลิก",
    path: "/c/cancelled/:orderId",
    element: <Cancelled />,
  },
  {
    code: "TRK03",
    title: "ประวัติคำสั่งซื้อ",
    path: "/c/history",
    element: <History />,
  },
  {
    code: "TRK04",
    title: "รายละเอียดคำสั่งซื้อ",
    path: "/c/order/:orderId",
    element: <HistoryDetail />,
  },
  {
    code: "ACC01",
    title: "บัญชีของฉัน",
    path: "/c/account",
    element: <Account />,
  },
  {
    code: "OMS01",
    layout: "shop",
    title: "คำสั่งซื้อวันนี้",
    path: "/shop/orders",
    element: <Order />,
  },
  {
    code: "OMS02",
    layout: "shop",
    title: "รายละเอียดคำสั่งซื้อ",
    path: "/shop/orders/:orderId",
    element: <OrderDetail />,
  },
  {
    code: "MNU01",
    layout: "shop",
    title: "จัดการเมนู",
    path: "/shop/menus",
    element: <Menu />,
  },
  {
    code: "MNU02",
    layout: "shop",
    title: "เพิ่ม/แก้ไขเมนู",
    path: "/shop/menus/:menuId",
    element: <MenuForm />,
  },
  {
    code: "RPT01",
    layout: "shop",
    title: "สรุปยอดขาย",
    path: "/shop/dashboard",
    element: <Report />,
  },
  {
    code: "CRM01",
    layout: "shop",
    title: "ลูกค้าประจำ",
    path: "/shop/customers",
    element: <Customer />,
  },
  {
    code: "SET01",
    layout: "shop",
    title: "ตั้งค่าร้าน",
    path: "/shop/settings",
    element: <Setting />,
  },
  {
    code: "DLV01",
    title: "งานจัดส่ง",
    path: "/rider/:token",
    element: <Jobs />,
  },
  {
    code: "DLV02",
    title: "รายละเอียดงาน",
    path: "/rider/:token/order/:orderId",
    element: <JobDetail />,
  },
  {
    code: "DLV03",
    title: "ยืนยันส่งสำเร็จ",
    path: "/rider/:token/deliver/:orderId",
    element: <Deliver />,
  },
];
