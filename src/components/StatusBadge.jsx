import { Tag } from "antd";

export const STATUS = {
  pending_payment: { label: "รอชำระเงิน", bg: "#FFF1D6", fg: "#8A3A00" },
  paid: { label: "ชำระเงินแล้ว", bg: "#E6EEFF", fg: "#1D4ED8" },
  accepted: { label: "ร้านรับคำสั่งซื้อ", bg: "#EEEAFF", fg: "#5B3CC4" },
  preparing: { label: "กำลังทำ", bg: "#FFE8DE", fg: "#B4370F" },
  delivering: { label: "กำลังจัดส่ง", bg: "#DFF3FA", fg: "#0B6A8F" },
  completed: { label: "จัดส่งสำเร็จ", bg: "#DDF5EE", fg: "#0E6E5C" },
  cancelled: { label: "ยกเลิก", bg: "#FDE7E7", fg: "#8A1C1C" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending_payment;
  return (
    <Tag
      bordered={false}
      className="m-0 rounded-full px-3 py-0.5 text-base font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </Tag>
  );
};

export default StatusBadge;
