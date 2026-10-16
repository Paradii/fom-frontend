import { Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import { formatTime } from "@/utils/format";

const ROW_STATUS = {
  ready: { label: "รอสแกน", className: "bg-brand-soft text-brand-text" },
  delivering: { label: "กำลังส่ง", className: "bg-[#DFF3FA] text-[#0B6A8F]" },
  completed: { label: "ส่งแล้ว", className: "bg-[#DDF5EE] text-[#0E6E5C]" },
};

const OrderBatch = ({ batch, orders, onQr, onView }) => {
  const doneCount = orders.filter((o) => o.status === "completed").length;
  const timeText = batch.scannedAt
    ? `ออก ${formatTime(batch.scannedAt)}`
    : "รอคนส่งสแกน";

  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-solid border-line bg-white p-3">
      <div className="flex items-center justify-between gap-1">
        <b className="whitespace-nowrap text-sm">
          รอบส่ง {batch.batchCode} · {timeText}
        </b>
        <span className="whitespace-nowrap text-[13px] text-ink-2">
          {doneCount}/{orders.length} ส่งแล้ว
        </span>
      </div>
      {orders.map((o) => (
        <div
          key={o.orderId}
          className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg bg-[#F5F4F1] px-2 py-1.5 ${
            o.status === "completed" ? "opacity-60" : ""
          }`}
          onClick={() => onView(o)}
        >
          <span className="text-sm">#{o.orderId}</span>
          <span
            className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[13px] font-semibold ${
              ROW_STATUS[o.status].className
            }`}
          >
            {ROW_STATUS[o.status].label}
          </span>
        </div>
      ))}
      <Button
        icon={<QrcodeOutlined />}
        className="card-button"
        onClick={() => onQr(batch)}
      >
        ดู QR รอบนี้
      </Button>
    </div>
  );
};

export default OrderBatch;
