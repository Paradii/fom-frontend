import { Button } from "antd";
import { Card } from "@/components";
import { mockCustomers, paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const OrderDetailRefund = ({ order, onRefund }) => {
  const isPending = order.refundStatus === "pending";
  const isNoRefund = order.refundStatus === "none";
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });

  if (isNoRefund) {
    return (
      <Card title="โอนเงินคืนลูกค้า">
        <span className="text-ink-2">
          ไม่ต้องโอนคืน เพราะสลิปไม่ถูกต้อง ร้านยังไม่ได้รับเงิน
        </span>
      </Card>
    );
  }

  return (
    <Card title="โอนเงินคืนลูกค้า">
      <div className="flex justify-between text-[15px]">
        <span className="text-ink-2">พร้อมเพย์</span>
        <b>{customer?.phone}</b>
      </div>
      <div className="flex justify-between text-[15px]">
        <span className="text-ink-2">ชื่อบัญชีผู้รับ</span>
        <b>{order.payerName}</b>
      </div>
      <div className="flex items-center justify-between text-lg">
        <span>{isPending ? "ต้องโอนคืน" : "โอนคืนแล้ว"}</span>
        <b
          className={`font-head text-xl ${
            isPending ? "text-[#D92D20]" : "text-[#0E6E5C]"
          }`}
        >
          {formatPrice(paidTotal(order))}
        </b>
      </div>
      {isPending ? (
        <Button block className="refund-button" onClick={onRefund}>
          แนบสลิปโอนคืน
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          {order.refundSlipUrl ? (
            <img
              src={order.refundSlipUrl}
              alt=""
              className="h-[220px] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-[220px] items-center justify-center rounded-xl bg-[#F3F2EF] text-sm text-ink-2">
              รูปสลิปโอนคืน
            </div>
          )}
          <span className="text-sm text-[#0E6E5C]">
            ✓ ตรวจสลิปโอนคืนผ่าน แจ้งลูกค้าแล้ว
          </span>
        </div>
      )}
    </Card>
  );
};

export default OrderDetailRefund;
