import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Image } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { STATUS } from "@/components/StatusBadge";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveCart,
  getLog,
  getOrder,
  getShop,
  itemTotal,
  loadMyOrder,
  paidTotal,
} from "@/services/data";
import withLoad from "@/utils/withLoad";

import { formatPrice, formatThaiDate, formatTime } from "@/utils/format";

const HistoryDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = getOrder(Number(orderId));

  if (!order) {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบคำสั่งซื้อนี้" />
      </CustomerLayout>
    );
  }

  const shop = getShop(order.shopId);
  const s = STATUS[order.status];
  const paidLog = getLog(order, "paid");
  const doneLog = getLog(order, "completed");

  const onReorder = () => {
    const resp = fetchSaveCart({ actionType: "reorder", order: order });
    if (resp.success) navigate("/c/cart");
  };

  const getOptionText = (item) => {
    const texts = (item.options || []).map((o) => {
      if (o.extraPrice > 0) return `${o.optionName} (+฿${o.extraPrice})`;
      return o.optionName;
    });
    if (item.note) texts.push(`หมายเหตุ: ${item.note}`);
    return texts.join(" · ");
  };

  const getAddressText = () => {
    const texts = [order.addressLabel, order.deliveryAddress];
    if (order.addressNote) texts.push(order.addressNote);
    return texts.join(" · ");
  };

  const renderItem = (item, index) => {
    return (
      <div key={index} className="flex flex-col gap-0.5">
        <div className="flex justify-between gap-3 text-[15px]">
          <span>
            {item.quantity} × {item.menuName}
          </span>
          <span>{formatPrice(itemTotal(item))}</span>
        </div>
        {getOptionText(item) && (
          <span className="text-[13px] text-ink-2">{getOptionText(item)}</span>
        )}
      </div>
    );
  };

  const footer = (
    <div className="grid grid-cols-[1fr_2fr] gap-2.5">
      <Button
        href={`tel:${shop.phone}`}
        className="flex h-[52px] items-center justify-center rounded-xl border-[#E3E1DC] text-[15px] font-semibold"
      >
        ติดต่อร้าน
      </Button>
      <Button type="primary" className="c-main" onClick={onReorder}>
        สั่งซ้ำ
      </Button>
    </div>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader
        title={`คำสั่งซื้อ #${order.orderId}`}
        subtitle={`${shop.shopName} · ${formatThaiDate(order.createdAt)} ${formatTime(order.createdAt)}`}
        backTo="/c/history"
        extra={
          <span
            className="shrink-0 rounded-full px-2.5 py-[3px] text-xs font-semibold"
            style={{ background: s.bg, color: s.fg }}
          >
            {s.label}
          </span>
        }
      />
      <main className="flex flex-col gap-3 px-4 py-3.5">
        <section className="flex flex-col gap-2 rounded-2xl border border-solid border-line bg-white px-[15px] py-[13px]">
          {order.items.map((item, index) => renderItem(item, index))}
          <div className="flex justify-between border-0 border-t border-dashed border-[#E3E1DC] pt-[9px] text-sm text-ink-2">
            <span>ค่าจัดส่ง</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-head text-[17px] font-semibold">
            <span>ยอดรวม</span>
            <span className="text-brand-text">
              {formatPrice(paidTotal(order))}
            </span>
          </div>
        </section>
        {paidLog && (
          <section className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-white px-[15px] py-[13px] text-sm">
            <b className="font-semibold">การชำระเงิน</b>
            <span className="flex items-center gap-1.5 text-[#0E6E5C]">
              <CheckOutlined />
              พร้อมเพย์ · สลิปผ่านการตรวจ {formatTime(paidLog.at)} น.
            </span>
            <span className="text-ink-2">เลขอ้างอิง {order.transRef}</span>
          </section>
        )}
        <section className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-white px-[15px] py-[13px] text-sm">
          <b className="font-semibold">จัดส่งถึง</b>
          <span className="leading-[21px] text-ink-2">{getAddressText()}</span>
        </section>
        {doneLog && (
          <section className="flex items-center gap-3 rounded-2xl border border-solid border-line bg-white px-[15px] py-[13px] text-sm">
            <Image
              src={order.deliveryPhotoUrl}
              alt="รูปยืนยันการส่ง"
              width={72}
              height={72}
              className="rounded-xl object-cover"
            />
            <div className="flex flex-col gap-0.5">
              <b className="font-semibold">
                ส่งถึงแล้ว {formatTime(doneLog.at)} น.
              </b>
              <span className="text-ink-2">แตะเพื่อดูรูปเต็ม</span>
              {order.deliveryNote && (
                <span className="text-ink-2">
                  หมายเหตุคนส่ง: {order.deliveryNote}
                </span>
              )}
            </div>
          </section>
        )}
      </main>
    </CustomerLayout>
  );
};

export default withLoad(HistoryDetail, ({ orderId }) => loadMyOrder(Number(orderId)));
