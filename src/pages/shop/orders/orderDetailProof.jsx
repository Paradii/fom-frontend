import { useState } from "react";
import { Image } from "antd";
import { Card } from "@/components";
import { getBatch } from "@/services/data";
import { formatDate, formatTime } from "@/utils/format";

const TIME_SOURCE = {
  camera: "ถ่ายจากกล้อง",
  exif: "เวลาที่ถ่ายจากข้อมูลในรูป",
  upload: "เวลาที่อัปโหลด",
};

const OrderDetailProof = ({ order }) => {
  const [isPreview, setIsPreview] = useState(false);
  const batch = getBatch(order.batchId);
  const at = order.proofTakenAt;
  const isToday = new Date(at).toDateString() === new Date().toDateString();
  const dayText = isToday ? "วันนี้" : formatDate(at);

  const rows = [
    {
      label: "รอบส่ง",
      value: `${batch?.batchCode} · ออกส่ง ${formatTime(batch?.scannedAt)}`,
    },
    {
      label: "เวลาในรูป",
      value: `${dayText} ${formatTime(at)} น. (${TIME_SOURCE[order.proofTimeSource]})`,
    },
  ];
  if (order.deliveryNote) {
    rows.push({ label: "หมายเหตุ", value: order.deliveryNote });
  }

  return (
    <Card
      title="หลักฐานการส่ง"
      extra={
        <span className="rounded-full bg-[#E3F6EF] px-2.5 py-[3px] text-[13px] font-semibold text-[#0E6E5C]">
          มีรูปยืนยัน
        </span>
      }
    >
      <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-xl bg-[#DCCBB3] text-[#6B5B45]">
        {order.deliveryPhotoUrl ? (
          <img
            src={order.deliveryPhotoUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span>รูปตอนส่งถึงลูกค้า</span>
        )}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <span className="w-[76px] shrink-0 text-ink-2">{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
      <a
        className="self-start text-sm font-semibold text-brand-text"
        onClick={() => setIsPreview(true)}
      >
        ดูรูปขนาดเต็ม
      </a>
      <Image
        className="hidden"
        src={order.deliveryPhotoUrl}
        preview={{
          visible: isPreview,
          onVisibleChange: (visible) => setIsPreview(visible),
        }}
      />
      <div className="text-[13px] text-ink-2">
        เก็บรูป 30 วันหลังส่งสำเร็จ ใช้ตอบลูกค้าที่แจ้งว่ายังไม่ได้รับของ
      </div>
    </Card>
  );
};

export default OrderDetailProof;
