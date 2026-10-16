import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Image } from "antd";
import { PhoneOutlined, ShoppingOutlined } from "@ant-design/icons";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import { getLog, getOrder, getShop, mockMe, paidTotal } from "@/mock/mockData";
import { formatPrice, formatTime } from "@/utils/format";

const BY_TEXT = {
  ระบบ: "ยกเลิกโดยระบบ",
  ลูกค้า: "ยกเลิกโดยคุณ",
};

const Cancelled = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));

  if (!order || order.status !== "cancelled") {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อที่ถูกยกเลิก" />
      </CustomerLayout>
    );
  }

  const shop = getShop(order.shopId);
  const total = paidTotal(order);
  const log = getLog(order, "cancelled");
  const isRefunded = order.refundStatus === "refunded";
  const refundAt = order.refundAt || log.at;

  const getReasonText = () => {
    if (log.by === "ระบบ") {
      if (order.cancelReason.includes("15 นาที")) {
        return "ไม่ได้แนบสลิปภายใน 15 นาที ระบบจึงยกเลิกให้อัตโนมัติ";
      }
      return "ร้านไม่ได้กดรับคำสั่งซื้อภายใน 15 นาที ระบบจึงยกเลิกให้อัตโนมัติ";
    }
    if (log.by === "ลูกค้า") return "คุณยกเลิกคำสั่งซื้อนี้แล้ว";
    return `ร้านยกเลิกคำสั่งซื้อ เพราะ${order.cancelReason}`;
  };

  const footer = (
    <>
      <Button
        type="primary"
        block
        className="c-main"
        onClick={() => navigate("/c/nearby")}
      >
        เลือกร้านอื่น
      </Button>
      <Button
        block
        className="c-outline"
        onClick={() => navigate(`/c/shop/${order.shopId}`)}
      >
        สั่งร้านเดิมอีกครั้ง
      </Button>
    </>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader
        title={`คำสั่งซื้อ #${order.orderId}`}
        subtitle={`${shop.shopName} · ${formatPrice(total)}`}
        extra={
          <span className="shrink-0 rounded-full bg-[#FDE7E7] px-3 py-1 text-[13px] font-semibold text-[#8A1C1C]">
            ยกเลิก
          </span>
        }
      />
      <main className="flex flex-col gap-5 px-5 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#FDE7E7] text-[40px] text-[#8A1C1C]">
            <ShoppingOutlined />
          </span>
          <h2 className="font-head text-[22px] font-semibold">
            คำสั่งซื้อถูกยกเลิก
          </h2>
          <p className="m-0 text-[15px] leading-[23.25px] text-ink-2">
            {getReasonText()}
          </p>
          <span className="rounded-full bg-[#F3F2EF] px-3 py-1 text-[13px] text-ink-2">
            {BY_TEXT[log.by] || "ยกเลิกโดยร้าน"} · {formatTime(log.at)} น.
          </span>
        </div>
        {order.refundStatus !== "none" && (
          <section className="flex flex-col gap-3 rounded-2xl border border-solid border-line bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#1D3A6E] px-2 py-0.5 text-xs font-semibold text-white">
                PromptPay
              </span>
              <b className="flex-1 text-base font-semibold">
                การคืนเงิน {formatPrice(total)}
              </b>
              {isRefunded ? (
                <span className="rounded-full bg-[#E3F6EF] px-2.5 py-[3px] text-[13px] font-semibold text-[#0E6E5C]">
                  โอนคืนแล้ว
                </span>
              ) : (
                <span className="rounded-full bg-[#FFF1D6] px-2.5 py-[3px] text-[13px] font-semibold text-[#8A3A00]">
                  รอร้านโอนคืน
                </span>
              )}
            </div>
            {isRefunded ? (
              <div className="flex items-center gap-3">
                {order.refundSlipUrl ? (
                  <Image
                    src={order.refundSlipUrl}
                    alt="สลิปโอนคืน"
                    width={64}
                    height={80}
                    className="rounded-[10px] object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-16 shrink-0 items-center justify-center rounded-[10px] bg-[#F0EFEC] text-xs text-ink-2">
                    สลิป
                  </span>
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <b className="text-sm font-semibold">
                    ร้านโอนคืนเข้าพร้อมเพย์ {mockMe.refundPromptPay}
                  </b>
                  <span className="text-[13px] text-ink-2">
                    {formatTime(refundAt)} น. · แตะสลิปเพื่อดูรูปเต็ม
                  </span>
                  <span className="text-[13px] text-[#0E6E5C]">
                    ✓ ตรวจสลิปโอนคืนโดย RDCW Slip API
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p className="m-0 text-sm leading-[1.6] text-ink-2">
                  ร้านต้องโอนเงินคืนเข้าพร้อมเพย์ของคุณ
                  เมื่อโอนแล้วจะเห็นสลิปที่นี่ และได้รับแจ้งทาง LINE
                </p>
                <div className="flex gap-2 text-sm">
                  <span className="text-ink-2">รับเงินคืนที่</span>
                  <b className="font-semibold">
                    พร้อมเพย์ {mockMe.refundPromptPay}
                  </b>
                </div>
              </>
            )}
            <Button
              block
              icon={<PhoneOutlined />}
              href={`tel:${shop.phone}`}
              className="c-soft flex items-center justify-center"
            >
              โทรหาร้าน
            </Button>
          </section>
        )}
      </main>
    </CustomerLayout>
  );
};

export default Cancelled;
