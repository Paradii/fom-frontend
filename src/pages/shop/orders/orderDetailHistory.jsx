import { Card, StatusBadge } from "@/components";
import { formatTime } from "@/utils/format";

const STEP_TEXT = {
  pending_payment: "สร้างคำสั่งซื้อ",
  paid: "ตรวจสลิปผ่าน",
  accepted: "กดรับคำสั่งซื้อ",
  preparing: "เริ่มทำอาหาร",
  delivering: "รับอาหารไปส่ง",
  completed: "ถ่ายรูปยืนยันการส่ง",
};

const OrderDetailHistory = ({ order }) => {
  const getStepText = (status) => {
    if (status === "cancelled") return order.cancelReason;
    if (status === "paid" && order.slipCheck === "manual") {
      return "ระบบตรวจสลิปไม่ได้ ร้านตรวจเอง";
    }
    return STEP_TEXT[status];
  };

  return (
    <Card title="ประวัติสถานะ">
      {order.statusLogs.map((log) => (
        <div key={log.status} className="flex items-start gap-4">
          <span className="w-12 shrink-0 pt-0.5 text-ink-2">
            {formatTime(log.at)}
          </span>
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-36">
              <StatusBadge status={log.status} />
            </div>
            <div className="flex flex-col">
              <span>{getStepText(log.status)}</span>
              <span className="text-sm text-ink-2">โดย {log.by}</span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default OrderDetailHistory;
