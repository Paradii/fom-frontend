import { Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import {
  getRiderName,
  isRiderJob,
  itemText,
  mockCustomers,
  paidTotal,
} from "@/mock/mockData";
import { formatPrice, formatTime } from "@/utils/format";

const NEXT_STEP = {
  accepted: {
    status: "preparing",
    text: "เริ่มทำ",
    message: "เริ่มทำแล้ว",
  },
  preparing: {
    status: "delivering",
    text: "ส่งให้คนส่ง",
    message: "ส่งให้คนส่งแล้ว",
  },
  delivering: {
    status: "completed",
    text: "ส่งสำเร็จ",
    message: "ส่งสำเร็จแล้ว",
  },
};

const WAIT_TEXT = {
  preparing: "รอคนส่งมารับ",
  delivering: "คนส่งกำลังไปส่ง",
};

const OrderCard = ({ order, onChangeStatus, onView }) => {
  const next = NEXT_STEP[order.status];
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });
  const isDeliveryStep = ["preparing", "delivering"].includes(order.status);
  const noRider = order.status === "preparing" && order.riderId === null;
  const waitRider = isDeliveryStep && isRiderJob(order);

  const renderButton = () => {
    if (!next) {
      return (
        <Button
          className="border-0 bg-[#F3F2EE] font-semibold"
          onClick={() => onView(order)}
        >
          ดูรายละเอียด
        </Button>
      );
    }
    if (noRider) {
      return <Button onClick={() => onView(order)}>เลือกคนส่ง</Button>;
    }
    if (waitRider) {
      return <span className="text-ink-2">{WAIT_TEXT[order.status]}</span>;
    }
    return (
      <Button
        type={order.status === "delivering" ? "default" : "primary"}
        className={
          order.status === "delivering"
            ? "border-0 bg-brand-soft font-semibold text-brand-text"
            : ""
        }
        onClick={() => onChangeStatus(order, next.status, next.message)}
      >
        {next.text}
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-solid border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <b className="text-lg">#{order.orderId}</b>
        <span className="text-ink-2">{formatTime(order.createdAt)}</span>
      </div>
      <div>{itemText(order)}</div>
      <div className="flex items-start gap-2 text-ink-2">
        <EnvironmentOutlined className="mt-1" />
        <span>
          {customer?.displayName} · {order.distanceKm} กม.
        </span>
      </div>
      {isDeliveryStep && order.riderId !== null && (
        <div className="text-ink-2">คนส่ง: {getRiderName(order.riderId)}</div>
      )}
      <div className="mt-1 flex items-center justify-between border-0 border-t border-dashed border-line pt-3">
        <b className="text-lg">{formatPrice(paidTotal(order))}</b>
        {renderButton()}
      </div>
    </div>
  );
};

export default OrderCard;
