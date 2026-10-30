import { Card, StatusBadge } from "@/components";
import { getBatch } from "@/services/data";
import { formatTime } from "@/utils/format";

const STEP_TEXT = {
  pending_payment: "สร้างคำสั่งซื้อ",
  paid: "ตรวจสลิปผ่าน",
  accepted: "กดรับคำสั่งซื้อ",
  ready: "กดทำเสร็จ",
  completed: "แนบรูปยืนยันการส่ง",
};

const OrderDetailHistory = ({ order }) => {
  const getStepText = (status) => {
    if (status === "cancelled") return "ยกเลิกคำสั่งซื้อ";
    if (status === "paid" && order.slipCheck === "manual") {
      return "ระบบตรวจสลิปไม่ได้ ร้านตรวจเอง";
    }
    if (status === "delivering") {
      return `สแกน QR รอบส่ง ${getBatch(order.batchId)?.batchCode}`;
    }
    return STEP_TEXT[status];
  };

  const getByText = (log) => {
    if (log.status === "cancelled") return `${log.by} · ${order.cancelReason}`;
    return log.by;
  };

  return (
    <Card title="ประวัติสถานะ">
      {order.statusLogs.map((log) => (
        <div key={log.status} className="flex items-start gap-4">
          <span className="w-[52px] shrink-0 text-sm text-ink-2">
            {formatTime(log.at)}
          </span>
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-36">
              <StatusBadge
                status={log.status}
                isDashed={log.status === "ready"}
                size="small"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-ink-2">
                {getStepText(log.status)}
              </span>
              <span className="text-[13px] text-ink-2">
                โดย {getByText(log)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default OrderDetailHistory;
