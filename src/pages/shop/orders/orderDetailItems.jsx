import { Card } from "@/components";
import { itemTotal, optionText, paidTotal } from "@/services/data";
import { formatPrice } from "@/utils/format";

const OrderDetailItems = ({ order }) => {
  return (
    <Card title="รายการอาหาร">
      {order.items.map((item, index) => (
        <div
          key={`${item.menuId}-${index}`}
          className="flex gap-3 border-0 border-b border-solid border-[#F3F2EF] pb-3"
        >
          <b className="w-8 font-head text-lg text-brand-text">
            {item.quantity}×
          </b>
          <div className="flex flex-1 flex-col">
            <b className="text-[15px]">{item.menuName}</b>
            <span className="text-sm text-ink-2">
              {optionText(item) || "ไม่มีตัวเลือก"}
            </span>
            {item.note && (
              <span className="text-sm text-brand-text">
                หมายเหตุ: {item.note}
              </span>
            )}
          </div>
          <b className="text-[15px]">{formatPrice(itemTotal(item))}</b>
        </div>
      ))}
      <div className="flex justify-between text-[15px] text-ink-2">
        <span>ค่าจัดส่ง</span>
        <span>{formatPrice(order.deliveryFee)}</span>
      </div>
      <div className="flex justify-between font-head text-xl font-semibold">
        <span>ยอดรวม</span>
        <span className="text-brand-text">{formatPrice(paidTotal(order))}</span>
      </div>
    </Card>
  );
};

export default OrderDetailItems;
