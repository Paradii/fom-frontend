import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Empty } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import CustomerLayout from "@/layouts/CustomerLayout";
import { fetchSaveMyOrder, getOrder, paidTotal } from "@/mock/mockData";
import PayHeader from "./payHeader";

const Verifying = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));
  const [step, setStep] = useState(0);

  const steps = [
    "อ่าน QR บนสลิป",
    "ตรวจบัญชีผู้รับเป็นพร้อมเพย์ของร้าน",
    `ตรวจยอดเงิน ฿${order ? paidTotal(order).toFixed(2) : ""}`,
    "ตรวจว่าสลิปไม่เคยถูกใช้",
  ];

  useEffect(() => {
    if (!order) return;
    if (!order.slipUrl || order.status !== "pending_payment") {
      navigate(`/c/payment/${order.orderId}`);
      return;
    }
    const timer = setInterval(() => {
      setStep((current) => current + 1);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step < steps.length) return;
    const resp = fetchSaveMyOrder({
      actionType: "paid",
      orderId: order.orderId,
    });
    if (resp.success) navigate(`/c/tracking/${order.orderId}`);
  }, [step]);

  if (!order) {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อนี้" />
      </CustomerLayout>
    );
  }

  const renderStep = (text, index) => {
    if (index < step) {
      return (
        <li key={text} className="flex items-center gap-2.5 text-[15px]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0E6E5C] text-sm text-white">
            <CheckOutlined />
          </span>
          {text}
        </li>
      );
    }
    if (index === step) {
      return (
        <li
          key={text}
          className="flex items-center gap-2.5 text-[15px] font-semibold"
        >
          <span className="h-6 w-6 shrink-0 animate-spin rounded-full border-[3px] border-solid border-[#FFE8A8] border-t-[#F5B400]" />
          {text}
        </li>
      );
    }
    return (
      <li
        key={text}
        className="flex items-center gap-2.5 text-[15px] text-ink-3"
      >
        <span className="h-6 w-6 shrink-0 rounded-full border-2 border-solid border-[#E3E1DC]" />
        {text}
      </li>
    );
  };

  return (
    <CustomerLayout>
      <PayHeader order={order} />
      <main className="flex flex-col items-center gap-[22px] px-6 py-10">
        <a
          onClick={() => navigate(`/c/slip-fail/${order.orderId}`)}
          className="relative flex h-[198px] w-[142px] cursor-pointer items-center justify-center rounded-[14px] border border-solid border-[#E3E1DC] bg-white shadow-[0_4px_8px_rgba(28,27,25,0.08)]"
        >
          {order.slipUrl ? (
            <img
              src={order.slipUrl}
              alt="รูปสลิปที่แนบ"
              className="h-full w-full rounded-[14px] object-cover"
            />
          ) : (
            <span className="text-[13px] text-ink-2">รูปสลิปที่แนบ</span>
          )}
          <span className="absolute -bottom-3.5 -right-3.5 h-11 w-11 animate-spin rounded-full border-4 border-solid border-[#FFF1D6] border-t-[#F5B400] bg-white" />
        </a>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-[22px] font-semibold">กำลังตรวจสลิป</h2>
          <p className="m-0 text-[15px] text-ink-2">
            ใช้เวลาไม่กี่วินาที อย่าเพิ่งปิดหน้านี้
          </p>
        </div>
        <ul className="m-0 flex w-full list-none flex-col gap-3 rounded-2xl border border-solid border-line bg-white p-4">
          {steps.map((text, index) => renderStep(text, index))}
        </ul>
        <span className="text-[13px] text-ink-2">
          ผ่านแล้วจะไปหน้าติดตามสถานะอัตโนมัติ
        </span>
      </main>
    </CustomerLayout>
  );
};

export default Verifying;
