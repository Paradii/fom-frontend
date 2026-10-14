import { Select } from "antd";
import { Card } from "@/components";
import { SHOP_RIDER, mockRiders } from "@/mock/mockData";
import { formatTime } from "@/utils/format";

const OrderDetailRider = ({ order, onChangeRider }) => {
  const riderOptions = mockRiders.map((r) => ({
    value: r.riderId,
    label: r.riderName,
  }));
  const options = [{ value: SHOP_RIDER, label: "ร้านส่งเอง" }, ...riderOptions];
  const isLocked = ["delivering", "completed"].includes(order.status);
  const pickupLog = order.statusLogs.find((l) => {
    return l.status === "delivering";
  });

  return (
    <Card title="คนส่งของร้าน">
      <div className="flex flex-col gap-1.5">
        <span className="font-medium">พนักงาน</span>
        <Select
          value={order.riderId}
          onChange={onChangeRider}
          options={options}
          placeholder="เลือกพนักงานจัดส่ง"
          disabled={isLocked}
        />
        <span className="text-sm text-ink-2">
          {order.riderId === SHOP_RIDER
            ? "ร้านกดเปลี่ยนสถานะจัดส่งเอง"
            : "คนส่งกดรับอาหาร และถ่ายรูปตอนส่งสำเร็จในแอปคนส่ง"}
        </span>
        {order.assignedAt && (
          <span className="text-sm text-ink-2">
            เลือกคนส่งเมื่อ {formatTime(order.assignedAt)} น.
            {pickupLog && ` · รับอาหาร ${formatTime(pickupLog.at)} น.`}
          </span>
        )}
      </div>
    </Card>
  );
};

export default OrderDetailRider;
