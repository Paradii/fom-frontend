import { Button, Tag } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { StatusBadge } from "@/components";
import { mockCustomers, paidTotal } from "@/mock/mockData";
import { formatPrice, formatTime } from "@/utils/format";

const REFUND_TEXT = {
  pending: "ต้องโอนคืน",
  refunded: "โอนคืนแล้ว",
  none: "ไม่ต้องโอนคืน",
};

const OrderCancelled = ({ orders, onRefund, onView }) => {
  const pendingCount = orders.filter((o) => {
    return o.refundStatus === "pending";
  }).length;

  return (
    <div
      id="cancelled"
      className="flex scroll-mt-24 flex-col gap-3 rounded-card bg-[#F3F2EE] p-3"
    >
      <div className="flex flex-wrap items-center gap-2 pl-1">
        <StatusBadge status="cancelled" />
        <span className="text-ink-2">{orders.length} รายการ</span>
        {pendingCount > 0 && (
          <span className="text-danger">
            · รอโอนเงินคืน {pendingCount} รายการ
          </span>
        )}
      </div>
      {orders.length === 0 && (
        <div className="py-6 text-center text-ink-2">
          ไม่มีคำสั่งซื้อที่ยกเลิก
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {orders.map((order) => {
          const customer = mockCustomers.find((c) => {
            return c.customerId === order.customerId;
          });
          const isPending = order.refundStatus === "pending";
          return (
            <div
              key={order.orderId}
              className={`flex flex-col gap-2 rounded-xl border border-solid bg-white p-4 ${
                isPending ? "border-danger" : "border-line"
              }`}
            >
              <div className="flex items-center justify-between">
                <b className="text-lg">#{order.orderId}</b>
                <span className="text-ink-2">
                  {formatTime(order.createdAt)}
                </span>
              </div>
              <div>
                <Tag bordered={false} className="rounded-full">
                  {order.cancelReason || "ร้านยกเลิก"}
                </Tag>
              </div>
              <div className="text-ink-2">
                {customer?.displayName} · พร้อมเพย์{" "}
                <span className="whitespace-nowrap">{customer?.phone}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-0 border-t border-dashed border-line pt-3">
                <div>
                  <div className="text-sm text-ink-2">
                    {REFUND_TEXT[order.refundStatus]}
                  </div>
                  <b className={`text-lg ${isPending ? "text-danger" : ""}`}>
                    {formatPrice(paidTotal(order))}
                  </b>
                </div>
                {isPending ? (
                  <Button danger type="primary" onClick={() => onRefund(order)}>
                    แนบสลิปโอนคืน
                  </Button>
                ) : (
                  <Button
                    className="border-0 bg-[#F3F2EE] font-semibold"
                    icon={
                      order.refundStatus === "refunded" && (
                        <CheckCircleFilled className="text-[#15803D]" />
                      )
                    }
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
    </div>
  );
};

export default OrderCancelled;
