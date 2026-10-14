import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Switch } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Logo from "@/components/Logo";
import useNotify from "@/hooks/useNotify";
import { fetchSaveShop, mockOrders, mockShop } from "@/mock/mockData";

const MENU_LIST = [
  {
    path: "/shop/orders",
    label: "คำสั่งซื้อ",
    shortLabel: "คำสั่งซื้อ",
    icon: <FileTextOutlined />,
  },
  {
    path: "/shop/menus",
    label: "จัดการเมนู",
    shortLabel: "เมนู",
    icon: <AppstoreOutlined />,
  },
  {
    path: "/shop/dashboard",
    label: "ยอดขาย",
    shortLabel: "ยอดขาย",
    icon: <BarChartOutlined />,
  },
  {
    path: "/shop/customers",
    label: "ลูกค้าประจำ",
    shortLabel: "ลูกค้า",
    icon: <TeamOutlined />,
  },
  {
    path: "/shop/settings",
    label: "ตั้งค่าร้าน",
    shortLabel: "ตั้งค่า",
    icon: <SettingOutlined />,
  },
];

const ShopLayout = () => {
  const [isOpen, setIsOpen] = useState(mockShop.isOpen);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  useEffect(() => {
    onRefreshCount();
    const timer = setInterval(onRefreshCount, 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefreshCount = () => {
    const result = mockOrders.filter((o) => o.status === "paid");
    setNewOrderCount(result.length);
  };

  const { success, confirm } = useNotify();
  const openText = isOpen ? "เปิดรับคำสั่งซื้อ" : "ปิดรับคำสั่งซื้อ";
  const openClass = isOpen ? "text-[#15803D]" : "text-ink-3";

  const onSubmitForm = (formValue) => {
    const resp = fetchSaveShop({ isOpen: formValue.isOpen });
    if (resp.success) {
      setIsOpen(formValue.isOpen);
    }
  };

  const onToggleOpen = (checked) => {
    if (checked) {
      onSubmitForm({ isOpen: true });
      success("เปิดรับคำสั่งซื้อแล้ว");
      return;
    }
    confirm({
      title: "ปิดรับคำสั่งซื้อ?",
      content: "ลูกค้าจะสั่งอาหารจากร้านไม่ได้ จนกว่าร้านจะเปิดอีกครั้ง",
      okText: "ปิดรับ",
      danger: true,
      onOk: () => {
        onSubmitForm({ isOpen: false });
        success("ปิดรับคำสั่งซื้อแล้ว");
      },
    });
  };

  const sidebarClass = (isActive) => {
    let className = "relative flex items-center rounded-xl text-ink";
    className += isCollapsed
      ? " mx-auto h-14 w-14 justify-center"
      : " h-12 gap-3 px-3 text-base";
    className += isActive ? " bg-brand-soft font-semibold" : " hover:bg-bg";
    return className;
  };

  const bottomClass = (isActive) => {
    let className = "relative flex flex-col items-center gap-1 text-sm";
    className += isActive ? " font-semibold text-ink" : " text-ink-2";
    return className;
  };

  return (
    <div className="min-h-screen bg-bg text-ink lg:flex">
      <aside
        className={`hidden shrink-0 border-0 border-r border-solid border-line bg-white lg:block ${isCollapsed ? "w-[92px]" : "w-[260px]"}`}
      >
        <nav className="sticky top-0 box-border flex h-screen flex-col gap-5 px-4 py-6">
          <div
            className={`flex items-center gap-2.5 ${isCollapsed ? "flex-col" : ""}`}
          >
            <Logo />
            {!isCollapsed && (
              <div className="flex flex-1 flex-col">
                <b className="font-head text-xl">FOM</b>
                <span className="text-sm text-ink-2">สำหรับร้านค้า</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-xl text-ink-2"
            >
              {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col gap-2 rounded-[14px] border border-solid border-line bg-bg p-3">
              <b>{mockShop.shopName}</b>
              <div className="flex items-center justify-between text-base">
                <span className={`flex items-center gap-2 ${openClass}`}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {openText}
                </span>
                <Switch checked={isOpen} onChange={onToggleOpen} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {MENU_LIST.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) => sidebarClass(isActive)}
              >
                <span className={isCollapsed ? "text-2xl" : "text-xl"}>
                  {menu.icon}
                </span>
                {!isCollapsed && <span className="flex-1">{menu.label}</span>}
                {menu.path === "/shop/orders" && newOrderCount > 0 && (
                  <span
                    className={`rounded-full bg-brand px-2 text-sm font-semibold ${isCollapsed ? "absolute right-0 top-0" : ""}`}
                  >
                    {newOrderCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {!isCollapsed && (
            <div className="mt-auto flex gap-2 rounded-[14px] bg-[#FFF1D6] p-3 text-sm text-[#5C3D00]">
              <BellOutlined className="text-lg" />
              เปิดหน้านี้ค้างไว้เพื่อรับเสียงแจ้งเตือนคำสั่งซื้อใหม่
            </div>
          )}
          <div
            className={`flex items-center gap-2.5 ${isCollapsed ? "mt-auto justify-center" : "px-2"}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-text">
              {mockShop.ownerName[0]}
            </span>
            {!isCollapsed && (
              <div className="flex flex-col text-sm">
                <b>{mockShop.ownerName}</b>
                <span className="text-ink-2">เข้าสู่ระบบด้วย LINE</span>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <header className="sticky top-0 z-10 flex h-[60px] items-center gap-2.5 border-0 border-b border-solid border-line bg-white px-4 lg:hidden">
        <Logo size={36} />
        <div className="flex flex-1 flex-col">
          <b>{mockShop.shopName}</b>
          <span className={`text-sm ${openClass}`}>{openText}</span>
        </div>
        <Switch checked={isOpen} onChange={onToggleOpen} />
      </header>

      <main className="box-border min-w-0 flex-1 p-4 pb-[116px] lg:p-8">
        <div className={isCollapsed ? "max-w-[1400px]" : "max-w-[1136px]"}>
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 grid h-[84px] grid-cols-5 border-0 border-t border-solid border-line bg-white pt-2 lg:hidden">
        {MENU_LIST.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) => bottomClass(isActive)}
          >
            <span className="relative text-2xl">
              {menu.icon}
              {menu.path === "/shop/orders" && newOrderCount > 0 && (
                <span className="absolute -right-3 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-danger px-1 text-sm font-semibold text-white">
                  {newOrderCount}
                </span>
              )}
            </span>
            {menu.shortLabel}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default ShopLayout;
