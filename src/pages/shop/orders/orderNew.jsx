import { useEffect, useState } from "react";
import { Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { itemText, paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const LIMIT_MINUTES = 10;

const getSecondsLeft = (createdAt) => {
  const end = new Date(createdAt).getTime() + LIMIT_MINUTES * 60000;
  const left = Math.round((end - Date.now()) / 1000);
  return left > 0 ? left : 0;
};

const OrderNew = ({ order, onAccept, onReject, onTimeout, onView }) => {
  const [seconds, setSeconds] = useState(getSecondsLeft(order.createdAt));

  useEffect(() => {
    const timer = setInterval(() => {
      const left = getSecondsLeft(order.createdAt);
      setSeconds(left);
      if (left === 0) {
        clearInterval(timer);
        onTimeout();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isManualSlip = order.slipCheck === "manual";
  const minute = String(Math.floor(seconds / 60)).padStart(2, "0");
  const second = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-4 rounded-card bg-ink p-5 text-white lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand text-[28px] text-ink">
          <BellOutlined />
        </div>
        <div>
          <div className="text-lg font-semibold">
            คำสั่งซื้อใหม่ #{order.orderId} · {formatPrice(paidTotal(order))}
          </div>
          {isManualSlip ? (
            <div className="font-semibold text-brand">
              ระบบตรวจสลิปไม่ได้ ดูสลิปให้ถูกต้องก่อนรับ
            </div>
          ) : (
            <div className="text-white/80">สลิปผ่านการตรวจแล้ว</div>
          )}
          <div className="text-white/80">
            {itemText(order)} · ส่ง {order.distanceKm} กม.
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm text-white/70">ยกเลิกอัตโนมัติใน</div>
        <div className="font-head text-2xl font-semibold text-brand">
          {minute}:{second}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {isManualSlip && (
          <Button ghost onClick={onView}>
            ดูสลิป
          </Button>
        )}
        <Button ghost onClick={onReject}>
          ปฏิเสธ
        </Button>
        <Button type="primary" onClick={onAccept}>
          รับคำสั่งซื้อ
        </Button>
      </div>
    </div>
  );
};

export default OrderNew;
