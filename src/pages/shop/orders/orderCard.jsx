import { Button } from "antd";
import { itemText, mockCustomers, paidTotal } from "@/services/data";
import { formatPrice, formatTime } from "@/utils/format";

const OrderCard = ({ order, onReady, onView }) => {
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });

  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-solid border-line bg-white p-[13px]">
      <div className="flex items-baseline justify-between">
        <b className="font-head text-base">#{order.orderId}</b>
        <span className="text-[13px] text-ink-2">
          {formatTime(order.createdAt)}
        </span>
      </div>
      <div className="text-sm leading-[21px]">{itemText(order)}</div>
      <div className="text-[13px] text-ink-2">
        {order.addressLabel} {customer?.displayName}
      </div>
      <div className="flex items-center justify-between border-0 border-t border-dashed border-[#E8E6E1] pt-[9px]">
        <b className="text-[15px] font-semibold">
          {formatPrice(paidTotal(order))}
        </b>
        {order.status === "preparing" ? (
          <Button
            type="primary"
            className="card-button"
            onClick={() => onReady(order)}
          >
            ทำเสร็จ
          </Button>
        ) : (
          <Button
            className="card-button border-0 bg-[#F3F2EE]"
            onClick={() => onView(order)}
          >
            ดูรายละเอียด
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
