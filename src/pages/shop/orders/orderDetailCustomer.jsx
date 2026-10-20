import { Card } from "@/components";
import { isRegularCustomer, mockCustomers } from "@/services/data";

const OrderDetailCustomer = ({ order }) => {
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });

  let addressText = `${order.addressLabel} · ${order.deliveryAddress}`;
  if (order.addressNote) {
    addressText += ` · จุดสังเกต: ${order.addressNote}`;
  }

  return (
    <Card title="ลูกค้าและที่อยู่">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[15px]">
        <div className="flex flex-wrap items-center gap-2">
          <b>{customer?.displayName}</b>
          {isRegularCustomer(order.customerId) && (
            <span className="rounded-full bg-[#FFF1D6] px-2.5 py-0.5 text-xs font-semibold text-[#8A3A00]">
              ลูกค้าประจำ
            </span>
          )}
        </div>
        <b>{customer?.phone}</b>
      </div>
      <div className="text-[15px] text-ink-2">{addressText}</div>
    </Card>
  );
};

export default OrderDetailCustomer;
