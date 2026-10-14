import { useState } from "react";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { StatusBadge } from "@/components";
import OrderCard from "./orderCard";

const OrderGroup = ({ status, orders, onChangeStatus, onView }) => {
  const [isOpen, setIsOpen] = useState(status !== "completed");

  return (
    <div className="flex flex-col gap-3 rounded-card bg-[#F3F2EE] p-3">
      <div
        className="flex cursor-pointer items-center gap-1.5 pl-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <StatusBadge status={status} />
        <span className="ml-auto whitespace-nowrap text-ink-2">
          {orders.length} รายการ
        </span>
        <Button
          size="small"
          className="h-9 w-9 shrink-0"
          icon={isOpen ? <UpOutlined /> : <DownOutlined />}
        />
      </div>
      {isOpen &&
        orders.map((o) => (
          <OrderCard
            key={o.orderId}
            order={o}
            onChangeStatus={onChangeStatus}
            onView={onView}
          />
        ))}
      {!isOpen && (
        <div className="pl-1 text-sm text-ink-2">
          พับไว้ · แตะหัวข้อเพื่อดูรายการ
        </div>
      )}
      {isOpen && orders.length === 0 && (
        <div className="py-6 text-center text-ink-2">ยังไม่มีคำสั่งซื้อ</div>
      )}
    </div>
  );
};

export default OrderGroup;
