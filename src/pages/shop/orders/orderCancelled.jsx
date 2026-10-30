import { useState } from "react";
import { Button, Tag } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { StatusBadge } from "@/components";
import { itemText, mockCustomers, paidTotal } from "@/services/data";
import { formatPrice, formatTime } from "@/utils/format";

const REFUND_TEXT = {
  pending: "ต้องโอนคืน",
  refunded: "โอนคืนแล้ว",
  none: "ไม่ต้องโอนคืน",
};

const REFUND_COLOR = {
  pending: "text-[#D92D20]",
  refunded: "text-[#15803D]",
  none: "text-ink-2",
};

const OrderCancelled = ({ orders, onRefund, onView }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pendingCount = orders.filter((o) => {
    return o.refundStatus === "pending";
  }).length;

  return (
    <div
      id="cancelled"
      className="flex scroll-mt-24 flex-col gap-2.5 rounded-card bg-[#F4F3F0] p-3"
    >
      <div
        className="flex cursor-pointer items-center gap-2 px-1 py-0.5 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <StatusBadge status="cancelled" />
        <span className="text-ink-2">
          {orders.length} รายการ
          {pendingCount > 0 && (
            <>
              <span className="text-[#B42318] md:hidden">
                {" "}
                · รอโอนคืน {pendingCount}
              </span>
              <span className="hidden text-[#B42318] md:inline">
                {" "}
                · รอโอนเงินคืน {pendingCount} รายการ
              </span>
            </>
          )}
        </span>
        <div className="ml-auto" />
        <Button
          size="small"
          className="h-[30px] w-[30px] shrink-0 rounded-lg"
          icon={isOpen ? <UpOutlined /> : <DownOutlined />}
        />
      </div>
      {!isOpen && (
        <div className="pl-1 text-[13px] text-ink-3">
          พับไว้ · แตะหัวข้อเพื่อดูรายการ
        </div>
      )}
      {isOpen && orders.length === 0 && (
        <div className="py-6 text-center text-ink-2">
          ไม่มีคำสั่งซื้อที่ยกเลิก
        </div>
      )}
      {isOpen && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(auto-fill,minmax(280px,300px))]">
          {orders.map((order) => {
            const customer = mockCustomers.find((c) => {
              return c.customerId === order.customerId;
            });
            const isPending = order.refundStatus === "pending";
            return (
              <div
                key={order.orderId}
                className={`flex flex-col gap-2 rounded-[14px] border-solid bg-white p-[13px] ${
                  isPending
                    ? "border-[1.5px] border-[#F04438]"
                    : "border border-line"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <b className="font-head text-base">#{order.orderId}</b>
                  <span className="text-[13px] text-ink-2">
                    {formatTime(order.createdAt)}
                  </span>
                </div>
                <div className="text-sm leading-[21px]">{itemText(order)}</div>
                <div>
                  <Tag
                    bordered={false}
                    className="m-0 rounded-full bg-[#EFEEEA] px-2.5 text-[13px] font-medium text-ink-2"
                  >
                    {order.cancelReason || "ร้านยกเลิก"}
                  </Tag>
                </div>
                <div className="text-[13px] text-ink-2">
                  {customer?.displayName} · พร้อมเพย์{" "}
                  <span className="whitespace-nowrap">{customer?.phone}</span>
                </div>
                <div className="flex items-center justify-between border-0 border-t border-dashed border-[#E8E6E1] pt-[9px]">
                  <div className={REFUND_COLOR[order.refundStatus]}>
                    <div className="text-xs">
                      {REFUND_TEXT[order.refundStatus]}
                    </div>
                    <b className="text-[15px] font-semibold">
                      {formatPrice(paidTotal(order))}
                    </b>
                  </div>
                  {isPending ? (
                    <Button
                      className="card-button refund-card-button"
                      onClick={() => onRefund(order)}
                    >
                      แนบสลิปโอนคืน
                    </Button>
                  ) : (
                    <Button
                      className="card-button border-0 bg-[#F3F2EE]"
                      onClick={() => onView(order)}
                    >
                      ดูรายละเอียด
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderCancelled;
