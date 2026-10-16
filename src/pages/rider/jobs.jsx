import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty } from "antd";
import { STATUS } from "@/components/StatusBadge";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveDelivery,
  getBatchByToken,
  mockCustomers,
  mockOrders,
  mockShop,
} from "@/mock/mockData";
import { formatTime } from "@/utils/format";

const Jobs = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const batch = getBatchByToken(token);
  const [tab, setTab] = useState("pending");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!batch || batch.status === "cancelled") return;
    fetchSaveDelivery({ actionType: "scan", token: token });
    const list = mockOrders.filter((o) => batch.orderIds.includes(o.orderId));
    setOrders(list);
    const hasPending = list.some((o) => o.status !== "completed");
    if (!hasPending) setTab("done");
  }, [token]);

  if (!batch || batch.status === "cancelled") {
    return (
      <CustomerLayout className="justify-center px-6">
        <Empty
          description={
            batch
              ? "ร้านยกเลิกรอบส่งนี้แล้ว ติดต่อร้านเพื่อรับ QR ใหม่"
              : "ไม่พบรอบส่งนี้ ตรวจสอบ QR กับร้านอีกครั้ง"
          }
        />
      </CustomerLayout>
    );
  }

  const pendingOrders = orders.filter((o) => {
    return !["completed", "cancelled"].includes(o.status);
  });
  const doneOrders = orders.filter((o) => o.status === "completed");
  const showOrders = tab === "pending" ? pendingOrders : doneOrders;

  const tabs = [
    { key: "pending", label: `ยังไม่ส่ง ${pendingOrders.length}` },
    { key: "done", label: `ส่งแล้ว ${doneOrders.length}` },
  ];

  const getItemCount = (order) => {
    let count = 0;
    order.items.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  const renderOrder = (order) => {
    const customer = mockCustomers.find((c) => {
      return c.customerId === order.customerId;
    });
    const s = STATUS[order.status];
    return (
      <article
        key={order.orderId}
        className="flex flex-col gap-2.5 rounded-2xl border border-solid border-line bg-white p-[17px] shadow-[0_2px_4px_rgba(28,27,25,0.06)]"
      >
        <div className="flex items-center justify-between">
          <b className="font-head text-lg font-bold">#{order.orderId}</b>
          <span
            className="rounded-full px-2.5 py-[3px] text-xs font-semibold"
            style={{ background: s.bg, color: s.fg }}
          >
            {s.label}
          </span>
        </div>
        <div className="flex flex-col gap-px">
          <b className="text-[15px] font-semibold">{customer?.displayName}</b>
          <span className="text-sm leading-[20.3px] text-ink-2">
            {order.deliveryAddress}
            {order.addressNote && ` · จุดสังเกต: ${order.addressNote}`}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-[#F3F2EF] px-2.5 py-1 text-[13px] text-ink-2">
            {getItemCount(order)} รายการ
          </span>
          <span className="rounded-full bg-[#F3F2EF] px-2.5 py-1 text-[13px] text-ink-2">
            จ่ายแล้ว
          </span>
        </div>
        <Button
          block
          className="h-12 rounded-xl border-[#FFF1D6] bg-[#FFF1D6] font-head text-base font-semibold text-[#5C3D00]"
          onClick={() => navigate(`/rider/${token}/order/${order.orderId}`)}
        >
          ดูรายละเอียด
        </Button>
      </article>
    );
  };

  return (
    <CustomerLayout>
      <header className="sticky top-0 z-10 flex flex-col gap-2.5 border-0 border-b border-solid border-line bg-white px-4 pt-4">
        <div className="flex flex-col">
          <h1 className="font-head text-xl font-bold">
            รอบส่ง {batch.batchCode}
          </h1>
          <span className="text-[13px] text-ink-2">
            {mockShop.shopName}
            {batch.scannedAt && ` · ออกส่ง ${formatTime(batch.scannedAt)}`}
          </span>
        </div>
        <div className="flex gap-5">
          {tabs.map((item) => {
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
      <main className="flex flex-col gap-3 p-4">
        {showOrders.map((order) => renderOrder(order))}
        {showOrders.length === 0 && (
          <Empty
            className="mt-10"
            description={
              tab === "pending"
                ? "ส่งครบทุกคำสั่งซื้อแล้ว"
                : "ยังไม่มีงานที่ส่งแล้ว"
            }
          />
        )}
      </main>
    </CustomerLayout>
  );
};

export default Jobs;
