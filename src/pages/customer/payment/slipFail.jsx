import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty } from "antd";
import {
  ClockCircleOutlined,
  CloseOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  getOrder,
  getPaySecondsLeft,
  loadMyOrder,
  paidTotal,
} from "@/services/data";
import withLoad from "@/utils/withLoad";

import { formatCountdown } from "@/utils/format";
import PayHeader from "./payHeader";

const OTHER_REASONS = [
  "บัญชีผู้รับไม่ใช่พร้อมเพย์ของร้านนี้",
  "สลิปนี้เคยใช้แล้ว (เลขอ้างอิงซ้ำ)",
  "รูปไม่ชัด อ่าน QR บนสลิปไม่ได้",
];

const SlipFail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));
  const [seconds, setSeconds] = useState(order ? getPaySecondsLeft(order) : 0);

  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setSeconds(getPaySecondsLeft(order));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อนี้" />
      </CustomerLayout>
    );
  }

  const total = paidTotal(order);
  const slipAmount = Math.round(total / 10);

  const footer = (
    <>
      <Button
        type="primary"
        block
        icon={<UploadOutlined />}
        className="c-main"
        onClick={() => navigate(`/c/payment/${order.orderId}`)}
      >
        แนบสลิปใหม่
      </Button>
      <Button
        block
        className="c-outline"
        onClick={() => navigate(`/c/payment/${order.orderId}`)}
      >
        ดู QR อีกครั้ง
      </Button>
    </>
  );

  return (
    <CustomerLayout footer={footer}>
      <PayHeader order={order} />
      <main className="flex flex-col gap-[18px] px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#FDE7E7] text-[38px] text-[#B42318]">
            <WarningOutlined />
          </span>
          <h2 className="text-[22px] font-semibold">สลิปยังไม่ผ่านการตรวจ</h2>
          <p className="m-0 text-[15px] leading-[22.5px] text-ink-2">
            ไม่ต้องกังวล แนบสลิปใหม่ได้เลย
            <br />
            คำสั่งซื้อของคุณยังอยู่
          </p>
        </div>
        <section className="flex items-start gap-3.5 rounded-2xl border border-solid border-line bg-white p-[15px]">
          <span className="relative flex h-[94px] w-[66px] shrink-0 items-center justify-center rounded-lg border border-solid border-[#E3E1DC] bg-[#F3F2EF] text-[11px] text-ink-2">
            {order.slipUrl ? (
              <img
                src={order.slipUrl}
                alt="สลิป"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              "สลิป"
            )}
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B42318] text-xs text-white">
              <CloseOutlined />
            </span>
          </span>
          <div className="flex flex-col gap-1.5 text-sm leading-[21px]">
            <b className="text-[15px] font-semibold text-[#8A1C1C]">
              ยอดเงินไม่ตรงกับคำสั่งซื้อ
            </b>
            <span className="text-ink-2">
              ในสลิปโอน{" "}
              <b className="font-semibold text-ink">฿{slipAmount.toFixed(2)}</b>
              <br />
              ยอดที่ต้องชำระ{" "}
              <b className="font-semibold text-ink">฿{total.toFixed(2)}</b>
            </span>
          </div>
        </section>
        <div className="flex flex-col gap-1.5">
          <b className="text-sm font-semibold">เหตุผลอื่นที่อาจพบ</b>
          {OTHER_REASONS.map((reason) => (
            <span key={reason} className="text-[13px] text-ink-2">
              · {reason}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2.5 rounded-[14px] bg-[#FFF1D6] px-[14px] py-2.5 text-[#5C3D00]">
          <ClockCircleOutlined className="text-xl" />
          <span className="flex-1 text-sm">เหลือเวลาแนบสลิป</span>
          <span className="font-head text-xl font-bold">
            {formatCountdown(seconds)}
          </span>
        </div>
      </main>
    </CustomerLayout>
  );
};

export default withLoad(SlipFail, ({ orderId }) => loadMyOrder(Number(orderId)));
