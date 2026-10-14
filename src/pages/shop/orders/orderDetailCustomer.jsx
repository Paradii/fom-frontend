import { Tag } from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import { Card } from "@/components";
import { isRegularCustomer, mockCustomers } from "@/mock/mockData";

const OrderDetailCustomer = ({ order }) => {
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });

  return (
    <Card title="ลูกค้าและที่อยู่">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <b>{customer?.displayName}</b>
          {isRegularCustomer(order.customerId) && (
            <Tag
              bordered={false}
              className="ml-2 rounded-full bg-brand-soft text-brand-text"
            >
              ลูกค้าประจำ
            </Tag>
          )}
        </div>
        <b>{customer?.phone}</b>
      </div>
      <div className="text-ink-2">
        {order.deliveryAddress} · {order.distanceKm} กม.
      </div>
      <div className="flex h-36 items-center justify-center rounded-xl bg-[#F3F2EE] text-4xl text-brand-deco">
        <EnvironmentFilled />
      </div>
    </Card>
  );
};

export default OrderDetailCustomer;
