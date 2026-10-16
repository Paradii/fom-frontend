import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, QRCode } from "antd";
import {
  ClockCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useNotify from "@/hooks/useNotify";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveMyOrder,
  getOrder,
  getPaySecondsLeft,
  getShop,
  paidTotal,
} from "@/mock/mockData";
import { formatCountdown, maskPromptPay } from "@/utils/format";
import PayHeader from "./payHeader";

const STEPS = [
  "บันทึก QR แล้วสแกนจากแอปธนาคาร",
  "โอนให้ตรงยอด แล้วแนบสลิปด้านล่าง",
  "ระบบตรวจสลิปให้อัตโนมัติ และส่งคำสั่งซื้อให้ร้าน",
];

const Payment = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));
  const [slipUrl, setSlipUrl] = useState("");
  const [slipName, setSlipName] = useState("");
  const [seconds, setSeconds] = useState(order ? getPaySecondsLeft(order) : 0);

  useEffect(() => {
    if (!order) return;
    if (order.status === "cancelled") {
      navigate(`/c/cancelled/${order.orderId}`);
      return;
    }
    if (order.status !== "pending_payment") {
      navigate(`/c/tracking/${order.orderId}`);
      return;
    }
    const timer = setInterval(() => {
      setSeconds(getPaySecondsLeft(order));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!order || order.status !== "pending_payment" || seconds > 0) return;
    const resp = fetchSaveMyOrder({
      actionType: "cancel",
      orderId: order.orderId,
      reason: "ไม่ได้แนบสลิปภายใน 15 นาที",
      by: "ระบบ",
    });
    if (resp.success) navigate(`/c/cancelled/${order.orderId}`);
  }, [seconds]);

  if (!order) {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อนี้" />
      </CustomerLayout>
    );
  }

  const shop = getShop(order.shopId);
  const total = paidTotal(order);
  const promptPayId = shop.promptPayId || shop.phone;

  const onPickSlip = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSlipUrl(reader.result);
      setSlipName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const onSaveQr = () => {
    const canvas = document.querySelector("#pay-qr canvas");
    const link = document.createElement("a");
    link.download = `FOM-QR-${order.orderId}.png`;
    link.href = canvas.toDataURL();
    link.click();
    notify.success("บันทึก QR ลงเครื่องแล้ว");
  };

  const onSend = () => {
    const resp = fetchSaveMyOrder({
      actionType: "slip",
      orderId: order.orderId,
      slipUrl: slipUrl,
    });
    if (resp.success) navigate(`/c/verifying/${order.orderId}`);
  };

  const onCancel = () => {
    notify.confirm({
      title: "ยกเลิกคำสั่งซื้อนี้?",
      content: "ยังไม่ได้ชำระเงิน ยกเลิกได้ทันที",
      okText: "ยกเลิกคำสั่งซื้อ",
      danger: true,
      onOk: () => {
        const resp = fetchSaveMyOrder({
          actionType: "cancel",
          orderId: order.orderId,
          reason: "ลูกค้ายกเลิกก่อนชำระเงิน",
        });
        if (resp.success) navigate(`/c/shop/${order.shopId}`);
      },
    });
  };

  const footer = (
    <>
      <Button
        type="primary"
        block
        className="c-main"
        disabled={!slipUrl}
        onClick={onSend}
      >
        ส่งสลิปให้ตรวจ
      </Button>
      <Button
        type="text"
        block
        className="h-9 text-sm font-normal text-ink-2"
        onClick={onCancel}
      >
        ยกเลิกคำสั่งซื้อ
      </Button>
    </>
  );

  return (
    <CustomerLayout footer={footer}>
      <PayHeader order={order} />
      <main className="flex flex-col gap-3 px-4 pb-6 pt-3.5">
        <div className="flex items-center gap-2.5 rounded-[14px] bg-[#FFF1D6] px-[14px] py-2.5 text-[#5C3D00]">
          <ClockCircleOutlined className="text-[22px]" />
          <span className="flex-1 text-sm">แนบสลิปภายใน</span>
          <span className="font-head text-[22px] font-bold">
            {formatCountdown(seconds)}
          </span>
        </div>
        <section className="flex flex-col items-center overflow-hidden rounded-2xl border border-solid border-line bg-white pb-3.5">
          <div className="flex h-10 w-full items-center justify-center bg-[#1D3A6E] text-[15px] font-semibold tracking-[0.5px] text-white">
            PromptPay · พร้อมเพย์
          </div>
          <div
            id="pay-qr"
            className="mt-3.5 rounded-xl border border-solid border-line bg-white p-1"
          >
            <QRCode
              value={`promptpay:${promptPayId}:${total}`}
              size={158}
              bordered={false}
              type="canvas"
            />
          </div>
          <span className="mt-2.5 font-head text-[28px] font-bold text-brand-text">
            ฿{total.toFixed(2)}
          </span>
          <span className="text-sm text-ink-2">
            ผู้รับ: {shop.shopName} · พร้อมเพย์ {maskPromptPay(promptPayId)}
          </span>
          <Button
            icon={<DownloadOutlined />}
            className="mt-2 h-10 rounded-xl border-brand-line px-4 text-sm font-semibold text-brand-text"
            onClick={onSaveQr}
          >
            บันทึก QR ลงเครื่อง
          </Button>
        </section>
        <ol className="m-0 flex flex-col pl-5 text-sm leading-[22.4px] text-ink-2">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border-2 border-dashed border-[#FFD966] bg-[#FFFCF0] p-4">
          {slipUrl ? (
            <img
              src={slipUrl}
              alt="สลิปที่แนบ"
              className="h-11 w-11 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF6D6] text-[22px] text-brand-text">
              <UploadOutlined />
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <b className="text-[15px] font-semibold">
              {slipUrl ? "แนบสลิปแล้ว" : "แนบสลิปโอนเงิน"}
            </b>
            <span className="truncate text-[13px] text-ink-2">
              {slipUrl
                ? `${slipName} · แตะเพื่อเปลี่ยนรูป`
                : "เลือกรูปจากอัลบั้ม (JPG, PNG)"}
            </span>
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={onPickSlip}
          />
        </label>
      </main>
    </CustomerLayout>
  );
};

export default Payment;
