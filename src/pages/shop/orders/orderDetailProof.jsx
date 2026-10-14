import { Tag } from "antd";
import { Card } from "@/components";
import { getRiderName } from "@/mock/mockData";
import { formatDate, formatTime } from "@/utils/format";
import { PIN_LIMIT_METERS, getDistanceMeters } from "@/utils/geo";

const OrderDetailProof = ({ order }) => {
  const completedLog = order.statusLogs.find((l) => {
    return l.status === "completed";
  });
  const at = completedLog.at;
  const isToday = new Date(at).toDateString() === new Date().toDateString();
  const dayText = isToday ? "วันนี้" : formatDate(at);
  const meters = order.proof ? getDistanceMeters(order.pin, order.proof) : null;
  const isFar = meters !== null && meters > PIN_LIMIT_METERS;

  const getDistanceText = () => {
    if (meters === null) return "ไม่มีพิกัดตอนส่ง";
    return `ห่างหมุดลูกค้า ${meters} ม.`;
  };

  const badge = isFar ? (
    <Tag color="error" bordered={false} className="m-0 rounded-full">
      ตำแหน่งไม่ตรงหมุด
    </Tag>
  ) : (
    <Tag color="success" bordered={false} className="m-0 rounded-full">
      มีรูปยืนยัน
    </Tag>
  );

  const rows = [
    { label: "พนักงาน", value: getRiderName(order.riderId) },
    { label: "ส่งถึง", value: `${dayText} ${formatTime(at)} น.` },
    { label: "ตำแหน่ง", value: getDistanceText(), isDanger: isFar },
  ];
  if (order.deliveryNote) {
    rows.push({ label: "หมายเหตุ", value: order.deliveryNote });
  }

  return (
    <Card title="หลักฐานการส่ง" extra={badge}>
      <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-xl bg-[#DCCBB3] text-[#6B5B45]">
        {order.deliveryPhotoUrl ? (
          <img
            src={order.deliveryPhotoUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span>รูปตอนส่งถึงลูกค้า</span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm">
          {formatTime(at)} น. · {getDistanceText()}
        </span>
      </div>
      {isFar && (
        <div className="text-danger">
          ห่างเกิน {PIN_LIMIT_METERS} ม. ระบบขึ้นป้ายนี้ให้ร้านเห็น
          ควรโทรถามพนักงานส่งก่อนตอบลูกค้า
        </div>
      )}
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-4">
            <span className="w-20 shrink-0 text-ink-2">{row.label}</span>
            <span className={row.isDanger ? "font-semibold text-danger" : ""}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {order.deliveryPhotoUrl && (
        <a
          href={order.deliveryPhotoUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-text"
        >
          ดูรูปขนาดเต็ม
        </a>
      )}
      <div className="text-sm text-ink-2">
        เก็บรูปและพิกัด 30 วันหลังส่งสำเร็จ
        ใช้ตอบลูกค้าที่แจ้งว่ายังไม่ได้รับของ
      </div>
    </Card>
  );
};

export default OrderDetailProof;
