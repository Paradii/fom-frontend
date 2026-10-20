import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty } from "antd";
import { CheckOutlined, RightOutlined } from "@ant-design/icons";
import { STATUS } from "@/components/StatusBadge";
import useNotify from "@/hooks/useNotify";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveMyOrder,
  getLog,
  getOrder,
  getShop,
  loadMyOrder,
  paidTotal,
} from "@/services/data";
import withLoad from "@/utils/withLoad";

import { formatPrice, formatTime } from "@/utils/format";

const HERO = {
  paid: {
    title: "รอร้านรับคำสั่งซื้อ",
    text: "ร้านกดรับแล้วจะเริ่มทำอาหารทันที",
  },
  preparing: {
    title: "ร้านกำลังทำอาหาร",
    text: "ทำเสร็จแล้วร้านจะส่งให้คนส่งทันที",
  },
  ready: {
    title: "อาหารพร้อมส่งแล้ว",
    text: "รอคนส่งของร้านมารับอาหาร",
  },
  delivering: {
    title: "กำลังไปส่งให้คุณ",
    text: "คนส่งของร้านกำลังเดินทางไปที่อยู่ของคุณ",
  },
  completed: {
    title: "ส่งถึงแล้ว",
    text: "ขอบคุณที่สั่งอาหารกับเรา",
  },
};

const STEPS = [
  {
    key: "paid",
    log: "paid",
    label: "ชำระเงินแล้ว",
    doneText: "ระบบตรวจสลิปผ่าน",
  },
  {
    key: "accepted",
    log: "accepted",
    label: "ร้านรับคำสั่งซื้อ",
    doneText: "ร้านกดรับแล้ว",
    waitText: "รอร้านกดรับ",
  },
  {
    key: "preparing",
    log: "accepted",
    label: "กำลังทำ",
    doneText: "ร้านเริ่มทำอาหาร",
  },
  {
    key: "ready",
    log: "ready",
    label: "พร้อมส่ง",
    doneText: "อาหารพร้อมส่ง",
  },
  {
    key: "delivering",
    log: "delivering",
    label: "กำลังจัดส่ง",
    doneText: "คนส่งออกจากร้านแล้ว",
  },
  {
    key: "completed",
    log: "completed",
    label: "จัดส่งสำเร็จ",
    doneText: "ส่งถึงแล้ว",
  },
];

const Tracking = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));
  const [status, setStatus] = useState(order?.status);

  useEffect(() => {
    if (!order) return;
    if (order.status === "pending_payment") {
      navigate(`/c/payment/${order.orderId}`);
      return;
    }
    if (order.status === "cancelled") {
      navigate(`/c/cancelled/${order.orderId}`);
      return;
    }
    setStatus(order.status);
    const timer = setInterval(() => {
      const newOrder = getOrder(Number(orderId));
      if (newOrder.status === "cancelled") {
        navigate(`/c/cancelled/${newOrder.orderId}`);
        return;
      }
      setStatus(newOrder.status);
    }, 2000);
    return () => clearInterval(timer);
  }, [orderId]);

  if (!order) {
    return (
      <CustomerLayout nav="order" className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อนี้" />
      </CustomerLayout>
    );
  }

  const shop = getShop(order.shopId);
  const hero = HERO[status] || HERO.paid;
  const color = STATUS[status] || STATUS.paid;
  const doneSteps = STEPS.filter((step) => getLog(order, step.log));
  const isLive = status !== "completed";

  const onCancel = () => {
    notify.confirm({
      title: "ยกเลิกคำสั่งซื้อนี้?",
      content: "ร้านจะโอนเงินคืนเข้าพร้อมเพย์ของคุณโดยตรง",
      okText: "ยกเลิกคำสั่งซื้อ",
      danger: true,
      onOk: async () => {
        const resp = await fetchSaveMyOrder({
          actionType: "cancel",
          orderId: order.orderId,
          reason: "ลูกค้ายกเลิกก่อนร้านรับคำสั่งซื้อ",
        });
        if (resp.success) navigate(`/c/cancelled/${order.orderId}`);
        else notify.error(resp.message);
      },
    });
  };

  const renderStep = (step, index) => {
    const log = getLog(order, step.log);
    const isLast = index === STEPS.length - 1;
    const isNext = index === doneSteps.length;
    let subText = "รอดำเนินการ";
    if (log) subText = `${formatTime(log.at)} น. · ${step.doneText}`;
    if (!log && isNext && step.waitText) subText = step.waitText;
    return (
      <div key={step.key} className="flex gap-3.5">
        <div className="flex w-6 shrink-0 flex-col items-center">
          {log ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1D4ED8] text-sm text-white">
              <CheckOutlined />
            </span>
          ) : (
            <span className="box-border h-6 w-6 rounded-full border-2 border-solid border-[#E3E1DC] bg-white" />
          )}
          {!isLast && (
            <span
              className={`min-h-[22px] w-0.5 flex-1 ${
                log ? "bg-[#D6D4CF]" : "bg-line"
              }`}
            />
          )}
        </div>
        <div className="flex flex-col gap-px pb-3.5">
          <span className={`text-[15px] ${log ? "text-ink" : "text-ink-3"}`}>
            {step.label}
          </span>
          <span className="text-[13px] text-ink-2">{subText}</span>
        </div>
      </div>
    );
  };

  return (
    <CustomerLayout nav="order">
      <CustomerHeader
        title={`คำสั่งซื้อ #${order.orderId}`}
        subtitle={`${shop.shopName} · ${order.items.length} รายการ · ${formatPrice(paidTotal(order))}`}
        extra={
          isLive && (
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#0E6E5C]">
              <span className="h-2 w-2 rounded-full bg-[#12A37F]" />
              อัปเดตสด
            </span>
          )
        }
      />
      <main className="flex flex-col gap-3.5 px-4 pb-6 pt-4">
        <section
          className="flex flex-col items-start gap-2 rounded-[18px] p-[18px]"
          style={{ background: color.bg, color: color.fg }}
        >
          <span className="rounded-full bg-white px-3 py-[3px] text-[13px] font-semibold">
            {color.label}
          </span>
          <h2 className="font-head text-[22px] font-semibold leading-[28.6px]">
            {hero.title}
          </h2>
          <span className="text-sm">{hero.text}</span>
        </section>
        <section className="flex flex-col rounded-2xl border border-solid border-line bg-white p-[17px] pb-[3px]">
          {STEPS.map((step, index) => renderStep(step, index))}
        </section>
        {status === "paid" && (
          <div className="flex flex-col items-center gap-1.5">
            <Button
              className="h-[46px] rounded-xl border-[#E3E1DC] px-5 text-[15px] font-semibold text-[#8A1C1C]"
              onClick={onCancel}
            >
              ยกเลิกคำสั่งซื้อ
            </Button>
            <span className="text-center text-xs text-ink-2">
              ยกเลิกได้ก่อนร้านรับคำสั่งซื้อ ร้านจะโอนเงินคืนให้คุณโดยตรง
            </span>
          </div>
        )}
        {status === "completed" && (
          <a
            onClick={() => navigate(`/c/order/${order.orderId}`)}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-solid border-line bg-white px-4 py-3.5 text-[15px] font-semibold"
          >
            ดูรายละเอียดและรูปยืนยันการส่ง
            <RightOutlined className="text-ink-2" />
          </a>
        )}
      </main>
    </CustomerLayout>
  );
};

export default withLoad(Tracking, ({ orderId }) => loadMyOrder(Number(orderId)));
