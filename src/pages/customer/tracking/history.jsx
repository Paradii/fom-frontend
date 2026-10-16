import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { STATUS } from "@/components/StatusBadge";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveCart,
  getMyOrders,
  getShop,
  itemText,
  paidTotal,
} from "@/mock/mockData";
import { formatDateTime, formatPrice } from "@/utils/format";

const TABS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "completed", label: "สำเร็จ" },
  { key: "cancelled", label: "ยกเลิก" },
];

const History = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const orders = getMyOrders().filter((o) => {
    return tab === "all" || o.status === tab;
  });

  const onOpen = (order) => {
    if (order.status === "completed") {
      navigate(`/c/order/${order.orderId}`);
      return;
    }
    if (order.status === "cancelled") {
      navigate(`/c/cancelled/${order.orderId}`);
      return;
    }
    if (order.status === "pending_payment") {
      navigate(`/c/payment/${order.orderId}`);
      return;
    }
    navigate(`/c/tracking/${order.orderId}`);
  };

  const onReorder = (e, order) => {
    e.stopPropagation();
    const resp = fetchSaveCart({ actionType: "reorder", order: order });
    if (resp.success) navigate("/c/cart");
  };

  const renderBadge = (order) => {
    if (order.status === "cancelled") {
      return (
        <span className="flex shrink-0 gap-1.5">
          <span className="rounded-full bg-[#FDE7E7] px-2.5 py-[3px] text-xs font-semibold text-[#8A1C1C]">
            ยกเลิก
          </span>
          {order.refundStatus === "pending" && (
            <span className="rounded-full bg-[#FFF1D6] px-2.5 py-[3px] text-xs font-semibold text-[#8A3A00]">
              รอโอนคืน
            </span>
          )}
          {order.refundStatus === "refunded" && (
            <span className="rounded-full bg-[#E3F6EF] px-2.5 py-[3px] text-xs font-semibold text-[#0E6E5C]">
              โอนคืนแล้ว
            </span>
          )}
        </span>
      );
    }
    const s = STATUS[order.status];
    return (
      <span
        className="shrink-0 rounded-full px-2.5 py-[3px] text-xs font-semibold"
        style={{ background: s.bg, color: s.fg }}
      >
        {s.label}
      </span>
    );
  };

  const renderOrder = (order) => {
    const shop = getShop(order.shopId);
    return (
      <article
        key={order.orderId}
        onClick={() => onOpen(order)}
        className="flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-solid border-line bg-white p-[15px]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-head text-base font-semibold">
              {shop.shopName} ›
            </span>
            <span className="text-[13px] text-ink-2">
              {formatDateTime(order.createdAt)} · #{order.orderId}
            </span>
          </div>
          {renderBadge(order)}
        </div>
        <span className="text-sm text-ink-2">{itemText(order)}</span>
        <div className="flex items-center justify-between">
          <b className="text-base font-semibold">
            {formatPrice(paidTotal(order))}
          </b>
          <Button
            icon={<ReloadOutlined />}
            onClick={(e) => onReorder(e, order)}
            className="h-10 rounded-xl border-[#FFF1D6] bg-[#FFF1D6] px-4 text-sm font-semibold text-[#5C3D00]"
          >
            สั่งซ้ำ
          </Button>
        </div>
      </article>
    );
  };

  return (
    <CustomerLayout nav="history">
      <header className="sticky top-0 z-10 flex flex-col gap-2 border-0 border-b border-solid border-line bg-white px-4 pt-4">
        <h1 className="font-head text-[22px] font-semibold">
          ประวัติการสั่งซื้อ
        </h1>
        <div className="flex gap-5">
          {TABS.map((item) => {
            const isActive = item.key === tab;
            return (
              <a
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`cursor-pointer border-0 border-solid pt-2.5 text-[15px] ${
                  isActive
                    ? "border-b-[3px] border-brand-line pb-[13px] font-semibold text-brand-text"
                    : "pb-4 text-ink-2"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </header>
      <main className="flex flex-col gap-3 px-4 pb-6 pt-4">
        {orders.map((order) => renderOrder(order))}
        {orders.length === 0 && (
          <Empty className="mt-10" description="ยังไม่มีคำสั่งซื้อ" />
        )}
      </main>
    </CustomerLayout>
  );
};

export default History;
