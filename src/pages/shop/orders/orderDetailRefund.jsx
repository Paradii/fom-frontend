import { Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
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
      <div className="flex justify-between">
        <span className="text-ink-2">พร้อมเพย์</span>
        <b>{customer?.phone}</b>
      </div>
      <div className="flex justify-between">
        <span className="text-ink-2">ชื่อบัญชีผู้รับ</span>
        <b>{order.payerName}</b>
      </div>
      <div className="flex justify-between text-lg">
        <span>{isPending ? "ต้องโอนคืน" : "โอนคืนแล้ว"}</span>
        <b className={isPending ? "text-danger" : "text-[#15803D]"}>
          {formatPrice(paidTotal(order))}
        </b>
      </div>
      {isPending ? (
        <Button danger type="primary" block onClick={onRefund}>
          แนบสลิปโอนคืน
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          {order.refundSlipUrl ? (
            <img
              src={order.refundSlipUrl}
              alt=""
              className="h-56 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-xl border border-solid border-line bg-[#F3F2EE] text-ink-3">
              รูปสลิปโอนคืน
            </div>
          )}
          <span className="text-[#15803D]">
            <CheckCircleFilled className="mr-2" />
            ตรวจสลิปโอนคืนผ่าน แจ้งลูกค้าแล้ว
          </span>
        </div>
      )}
    </Card>
  );
};

export default OrderDetailRefund;
