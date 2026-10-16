import { Tag } from "antd";

export const STATUS = {
  pending_payment: { label: "รอชำระเงิน", bg: "#FFF1D6", fg: "#8A3A00" },
  paid: { label: "ชำระเงินแล้ว", bg: "#E6EEFF", fg: "#1D4ED8" },
  accepted: { label: "ร้านรับคำสั่งซื้อ", bg: "#EEEAFF", fg: "#5B3CC4" },
  preparing: { label: "กำลังทำ", bg: "#FFE8DE", fg: "#B4370F" },
  ready: { label: "พร้อมส่ง", bg: "#FFC529", fg: "#1C1B19" },
  delivering: { label: "กำลังจัดส่ง", bg: "#DFF3FA", fg: "#0B6A8F" },
  completed: { label: "จัดส่งสำเร็จ", bg: "#DDF5EE", fg: "#0E6E5C" },
  cancelled: { label: "ยกเลิก", bg: "#FEE4E2", fg: "#B42318" },
};

const SIZE_CLASS = {
  small: "px-2.5 py-0.5 text-xs",
  medium: "px-3 py-[3px] text-[13px]",
  large: "px-3 py-[3px] text-sm",
};

const StatusBadge = ({ status, icon, isDashed, size = "medium" }) => {
  const s = STATUS[status] || STATUS.pending_payment;
  const dashedStyle = {
    background: "#FFF6D6",
    color: s.fg,
    border: "1px dashed #E0A800",
  };
  return (
    <Tag
      bordered={false}
      icon={icon}
      className={`m-0 rounded-full font-semibold leading-normal ${SIZE_CLASS[size]}`}
      style={isDashed ? dashedStyle : { background: s.bg, color: s.fg }}
    >
      {s.label}
    </Tag>
  );
};

export default StatusBadge;
