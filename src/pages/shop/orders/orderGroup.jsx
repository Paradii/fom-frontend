import { useState } from "react";
import { Button } from "antd";
import { DownOutlined, ShoppingOutlined, UpOutlined } from "@ant-design/icons";
import { StatusBadge } from "@/components";

const OrderGroup = ({ status, count, extra, children }) => {
  const [isOpen, setIsOpen] = useState(status !== "completed");

  return (
    <div className="flex flex-col gap-2.5 rounded-card bg-[#F5F4F1] p-3">
      <div
        className="flex cursor-pointer items-center gap-2 px-1 py-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <StatusBadge
          status={status}
          icon={status === "ready" && <ShoppingOutlined />}
        />
        <span className="whitespace-nowrap text-sm text-ink-2">
          {count} รายการ
        </span>
        <div className="ml-auto" />
        {isOpen && extra}
        <Button
          size="small"
          className="h-[30px] w-[30px] shrink-0 rounded-lg"
          icon={isOpen ? <UpOutlined /> : <DownOutlined />}
        />
      </div>
      {isOpen && children}
      {!isOpen && (
        <div className="pl-1 text-[13px] text-ink-3">
          พับไว้ · แตะหัวข้อเพื่อดูรายการ
        </div>
      )}
      {isOpen && count === 0 && (
        <div className="py-6 text-center text-sm text-ink-2">
          ยังไม่มีคำสั่งซื้อ
        </div>
      )}
    </div>
  );
};

export default OrderGroup;
