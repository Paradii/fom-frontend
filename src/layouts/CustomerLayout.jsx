import { useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getActiveOrder, getMyOrders } from "@/services/data";

const CustomerLayout = ({ nav, footer, className = "", children }) => {
  const navigate = useNavigate();
  const lastOrder = getActiveOrder() || getMyOrders()[0];

  const menus = [
    {
      key: "home",
      label: "หน้าหลัก",
      icon: <HomeOutlined />,
      path: "/c/nearby",
    },
    {
      key: "order",
      label: "คำสั่งซื้อ",
      icon: <FileTextOutlined />,
      path: lastOrder ? `/c/tracking/${lastOrder.orderId}` : "/c/history",
    },
    {
      key: "history",
      label: "ประวัติ",
      icon: <ClockCircleOutlined />,
      path: "/c/history",
    },
    {
      key: "account",
      label: "บัญชี",
      icon: <UserOutlined />,
      path: "/c/account",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EFEEEA] font-body text-ink">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-bg">
        <div className={`flex flex-1 flex-col ${className}`}>{children}</div>
        {footer && (
          <div className="sticky bottom-0 z-10 flex flex-col gap-2.5 border-0 border-t border-solid border-line bg-white px-4 pb-7 pt-[13px]">
            {footer}
          </div>
        )}
        {nav && (
          <nav className="sticky bottom-0 z-10 flex h-[84px] border-0 border-t border-solid border-line bg-white px-2 pb-5 pt-2">
            {menus.map((menu) => {
              const isActive = menu.key === nav;
              return (
                <a
                  key={menu.key}
                  onClick={() => navigate(menu.path)}
                  className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-xs ${
                    isActive ? "font-semibold text-brand-text" : "text-ink-2"
                  }`}
                >
                  <span className="text-2xl leading-none">{menu.icon}</span>
                  {menu.label}
                </a>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export default CustomerLayout;
