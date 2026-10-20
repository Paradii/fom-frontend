import { useEffect, useState } from "react";
import { Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { itemText, paidTotal } from "@/services/data";
import { formatPrice } from "@/utils/format";

const LIMIT_MINUTES = 15;

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
    <div className="flex flex-col gap-4 rounded-[18px] bg-ink px-5 py-4 text-white lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-strong text-[26px] text-ink">
          <BellOutlined />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-head text-lg font-bold">
            คำสั่งซื้อใหม่{" "}
            <span className="whitespace-nowrap">
              #{order.orderId} · {formatPrice(paidTotal(order))}
            </span>
          </div>
          <div className="text-sm text-[#EEEDEA]">
            {isManualSlip ? (
              <b className="text-brand">
                ระบบตรวจสลิปไม่ได้ ดูสลิปให้ถูกต้องก่อนรับ
              </b>
            ) : (
              "สลิปผ่านการตรวจแล้ว"
            )}{" "}
            · {itemText(order)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 lg:items-end">
        <div className="text-xs text-[#EEEDEA]">ยกเลิกอัตโนมัติใน</div>
        <div className="font-head text-[22px] font-bold leading-tight text-brand-strong">
          {minute}:{second}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {isManualSlip && (
          <Button ghost className="new-ghost" onClick={onView}>
            ดูสลิป
          </Button>
        )}
        <Button ghost className="new-ghost" onClick={onReject}>
          ปฏิเสธ
        </Button>
        <Button type="primary" className="new-accept" onClick={onAccept}>
          รับคำสั่งซื้อ
        </Button>
      </div>
    </div>
  );
};

export default OrderNew;
