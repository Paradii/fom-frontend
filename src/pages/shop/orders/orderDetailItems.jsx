import { Card } from "@/components";
import { itemTotal, optionText, paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const OrderDetailItems = ({ order }) => {
  return (
    <Card title="รายการอาหาร">
      {order.items.map((item, index) => (
        <div
          key={`${item.menuId}-${index}`}
          className="flex gap-3 border-0 border-b border-solid border-line pb-3"
        >
          <b className="w-8 text-brand-text">{item.quantity}×</b>
          <div className="flex-1">
            <b>{item.menuName}</b>
            <div className="text-sm text-ink-2">
              {optionText(item) || "ไม่มีตัวเลือก"}
            </div>
            {item.note && (
              <div className="text-sm text-brand-text">
                หมายเหตุ: {item.note}
              </div>
            )}
          </div>
          <b>{formatPrice(itemTotal(item))}</b>
        </div>
      ))}
      <div className="flex justify-between text-ink-2">
        <span>ค่าจัดส่ง</span>
        <span>{formatPrice(order.deliveryFee)}</span>
      </div>
      <div className="flex justify-between text-xl font-semibold">
        <span>ยอดรวม</span>
        <span className="text-brand-text">{formatPrice(paidTotal(order))}</span>
      </div>
    </Card>
  );
};

export default OrderDetailItems;
