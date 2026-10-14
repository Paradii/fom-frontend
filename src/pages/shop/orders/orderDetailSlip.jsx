import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card } from "@/components";
import { paidTotal } from "@/mock/mockData";
import { formatPrice, formatTime } from "@/utils/format";

const OrderDetailSlip = ({ order }) => {
  const isInvalid = order.cancelReason === "สลิปไม่ถูกต้อง";
  const isManualSlip = order.slipCheck === "manual";
  const checks = [
    `ยอดเงินตรง ${formatPrice(paidTotal(order))}`,
    "บัญชีผู้รับเป็นพร้อมเพย์ของร้าน",
    "เลขอ้างอิงไม่ซ้ำ",
  ];

  return (
    <Card title="สลิปโอนเงิน">
      <div className="flex h-56 items-center justify-center rounded-xl border border-solid border-line bg-[#F3F2EE] text-ink-3">
        รูปสลิป
      </div>
      {isInvalid && (
        <div className="text-danger">
          <CloseOutlined className="mr-2" />
          ร้านแจ้งว่าสลิปไม่ถูกต้อง
        </div>
      )}
      {isManualSlip && !isInvalid && (
        <div className="rounded-xl bg-brand-soft p-3 text-brand-text">
          <ExclamationCircleOutlined className="mr-2" />
          ระบบตรวจสลิปไม่ได้ ร้านต้องดูยอดเงิน ชื่อบัญชีร้าน และวันเวลาโอนเอง
        </div>
      )}
      {!isManualSlip && !isInvalid && (
        <div className="flex flex-col gap-1 text-[#15803D]">
          {checks.map((text) => (
            <span key={text}>
              <CheckOutlined className="mr-2" />
              {text}
            </span>
          ))}
        </div>
      )}
      <div className="text-sm text-ink-2">เลขอ้างอิง {order.transRef}</div>
      {!isManualSlip && (
        <div className="text-sm text-ink-2">
          ตรวจโดย RDCW Slip API · {formatTime(order.createdAt)} น.
        </div>
      )}
    </Card>
  );
};

export default OrderDetailSlip;
