import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Input } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  cartTotal,
  fetchSaveCart,
  fetchSaveMyOrder,
  getShop,
  itemTotal,
  mockAddresses,
  mockCart,
  mockMe,
  optionText,
} from "@/mock/mockData";
import { formatPrice, onlyDigits } from "@/utils/format";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([...mockCart.items]);
  const [refundPromptPay, setRefundPromptPay] = useState(
    mockMe.refundPromptPay,
  );
  const [isError, setIsError] = useState(false);
  const shop = mockCart.shopId ? getShop(mockCart.shopId) : null;
  const address = mockAddresses.find((a) => a.addressId === mockMe.addressId);

  if (!shop || items.length === 0) {
    return (
      <CustomerLayout>
        <CustomerHeader title="ตะกร้าของฉัน" backTo="/c/nearby" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <Empty description="ตะกร้ายังว่าง เลือกเมนูจากร้านใกล้คุณได้เลย" />
          <Button
            type="primary"
            className="c-main w-full"
            onClick={() => navigate("/c/nearby")}
          >
            ดูร้านใกล้คุณ
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  const foodTotal = cartTotal();
  const total = foodTotal + shop.deliveryFee;
  const isBelowMin = foodTotal < shop.minOrder;

  const onQuantity = (item, quantity) => {
    fetchSaveCart({ actionType: "qty", key: item.key, quantity: quantity });
    setItems([...mockCart.items]);
  };

  const onConfirm = () => {
    if (onlyDigits(refundPromptPay).length !== 10) {
      setIsError(true);
      return;
    }
    const resp = fetchSaveMyOrder({
      actionType: "A",
      refundPromptPay: refundPromptPay,
    });
    if (resp.success) navigate(`/c/payment/${resp.order.orderId}`);
  };

  const getItemNote = (item) => {
    const texts = [];
    if (optionText(item)) texts.push(optionText(item));
    if (item.note) texts.push(item.note);
    return texts.join(" · ");
  };

  const renderItem = (item) => {
    return (
      <div
        key={item.key}
        className="flex items-center gap-3 border-0 border-b border-solid border-[#F3F2EF] pb-[13px] pt-3"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{item.menuName}</span>
          {getItemNote(item) && (
            <span className="text-[13px] text-ink-2">{getItemNote(item)}</span>
          )}
          <span className="text-[15px] font-semibold text-brand-text">
            {formatPrice(itemTotal(item))}
          </span>
        </div>
        <div className="flex items-center gap-0.5 rounded-full bg-[#FFF6D6] p-[3px]">
          <a
            aria-label="ลดจำนวน"
            onClick={() => onQuantity(item, item.quantity - 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white"
          >
            <MinusOutlined />
          </a>
          <span className="min-w-[22px] px-1.5 text-center text-base font-semibold">
            {item.quantity}
          </span>
          <a
            aria-label="เพิ่มจำนวน"
            onClick={() => onQuantity(item, item.quantity + 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand"
          >
            <PlusOutlined />
          </a>
        </div>
      </div>
    );
  };

  const footer = (
    <>
      {isBelowMin && (
        <span className="text-center text-[13px] text-[#B42318]">
          ร้านนี้สั่งขั้นต่ำ {formatPrice(shop.minOrder)} (ค่าอาหาร) เพิ่มอีก{" "}
          {formatPrice(shop.minOrder - foodTotal)}
        </span>
      )}
      <Button
        type="primary"
        block
        className="c-main"
        disabled={isBelowMin || !address}
        onClick={onConfirm}
      >
        ยืนยันคำสั่งซื้อ · {formatPrice(total)}
      </Button>
    </>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader
        title="ตะกร้าของฉัน"
        subtitle={shop.shopName}
        backTo={`/c/shop/${shop.shopId}`}
      />
      <main className="flex flex-col gap-4 p-4">
        <section className="flex items-start gap-3 rounded-2xl border border-solid border-line bg-white p-[15px]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF6D6] text-[22px] text-brand-text">
            <EnvironmentOutlined />
          </span>
          {address ? (
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[13px] text-ink-2">ส่งที่</span>
              <span className="text-[15px] font-semibold">
                {address.label} · {mockMe.displayName}
              </span>
              <span className="text-sm leading-[20.3px] text-ink-2">
                {address.address}
                {address.note && ` · จุดสังเกต: ${address.note}`}
              </span>
              <span className="text-sm text-ink-2">โทร {address.phone}</span>
            </div>
          ) : (
            <span className="flex-1 pt-2 text-[15px] text-[#B42318]">
              ยังไม่มีที่อยู่จัดส่ง
            </span>
          )}
          <a
            onClick={() => navigate("/c/address/cart")}
            className="cursor-pointer py-1 text-sm font-semibold text-brand-text"
          >
            {address ? "เปลี่ยน" : "เพิ่มที่อยู่"}
          </a>
        </section>
        <section className="flex flex-col rounded-2xl border border-solid border-line bg-white px-[15px] py-[7px]">
          {items.map((item) => renderItem(item))}
          <a
            onClick={() => navigate(`/c/shop/${shop.shopId}`)}
            className="flex cursor-pointer items-center gap-1.5 py-3 text-sm font-semibold text-brand-text"
          >
            <PlusOutlined />
            เพิ่มเมนูอื่น
          </a>
        </section>
        <section className="flex flex-col gap-2 rounded-2xl border border-solid border-line bg-white p-[15px] text-[15px]">
          <div className="flex justify-between">
            <span className="text-ink-2">ค่าอาหาร</span>
            {formatPrice(foodTotal)}
          </div>
          <div className="flex justify-between">
            <span className="text-ink-2">ค่าจัดส่ง</span>
            {formatPrice(shop.deliveryFee)}
          </div>
          <div className="flex justify-between border-0 border-t border-dashed border-[#E3E1DC] pt-[9px] font-head text-lg font-semibold">
            ยอดรวม
            <span className="text-brand-text">{formatPrice(total)}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-bg px-3 py-2.5 text-sm">
            <span className="rounded-md bg-[#1D3A6E] px-2 py-0.5 text-xs font-semibold text-white">
              PromptPay
            </span>
            ชำระด้วยพร้อมเพย์ แล้วแนบสลิป
          </div>
          <label className="flex flex-col gap-1.5 rounded-xl bg-bg p-3">
            <span className="text-sm font-semibold">
              พร้อมเพย์สำหรับรับเงินคืน (กรอกครั้งแรกครั้งเดียว)
            </span>
            <Input
              value={refundPromptPay}
              inputMode="numeric"
              maxLength={12}
              status={isError ? "error" : ""}
              onChange={(e) => {
                setRefundPromptPay(e.target.value);
                setIsError(false);
              }}
              placeholder="089-111-2233"
              className="h-11 border-[1px] text-[15px]"
            />
            {isError && (
              <span role="alert" className="text-[13px] text-danger">
                กรอกเบอร์พร้อมเพย์ 10 หลัก
              </span>
            )}
            <span className="text-[13px] leading-normal text-ink-2">
              ใช้เมื่อร้านต้องโอนเงินคืน เช่น ร้านยกเลิกคำสั่งซื้อ
              แก้ได้ในหน้าบัญชี
            </span>
          </label>
        </section>
        <div className="flex gap-2 text-[13px] leading-[19.5px] text-ink-2">
          <ClockCircleOutlined className="mt-0.5 text-lg text-[#8A3A00]" />
          หลังยืนยัน กรุณาแนบสลิปภายใน 15 นาที
          ไม่เช่นนั้นคำสั่งซื้อจะถูกยกเลิกอัตโนมัติ
        </div>
      </main>
    </CustomerLayout>
  );
};

export default Cart;
