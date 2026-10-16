import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty } from "antd";
import {
  CameraOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { STATUS } from "@/components/StatusBadge";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  getBatchByToken,
  getLog,
  mockCustomers,
  mockOrders,
  mockShop,
} from "@/mock/mockData";
import { formatTime } from "@/utils/format";

const JobDetail = () => {
  const navigate = useNavigate();
  const { token, orderId } = useParams();
  const batch = getBatchByToken(token);
  const order = mockOrders.find((o) => o.orderId === Number(orderId));
  const isInBatch = batch && batch.orderIds.includes(Number(orderId));

  if (!order || !isInBatch || batch.status === "cancelled") {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบงานนี้ในรอบส่ง" />
      </CustomerLayout>
    );
  }

  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });
  const s = STATUS[order.status];
  const doneLog = getLog(order, "completed");
  let itemCount = 0;
  order.items.forEach((item) => {
    itemCount += item.quantity;
  });

  const footer = doneLog ? (
    <span className="flex h-[52px] items-center justify-center gap-2 text-[15px] font-semibold text-[#0E6E5C]">
      <CheckCircleOutlined />
      ส่งสำเร็จแล้ว {formatTime(doneLog.at)} น.
    </span>
  ) : (
    <Button
      type="primary"
      block
      icon={<CameraOutlined />}
      className="c-main"
      onClick={() => navigate(`/rider/${token}/deliver/${order.orderId}`)}
    >
      ถึงแล้ว ถ่ายรูปยืนยัน
    </Button>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader
        title={`งาน #${order.orderId}`}
        backTo={`/rider/${token}`}
        extra={
          <span
            className="shrink-0 rounded-full px-2.5 py-[3px] text-xs font-semibold"
            style={{ background: s.bg, color: s.fg }}
          >
            {s.label}
          </span>
        }
      />
      <main className="flex flex-col gap-3 p-4">
        <section className="flex flex-col gap-2.5 rounded-2xl border border-solid border-line bg-white p-[15px]">
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <b className="text-base font-semibold">{customer?.displayName}</b>
              <span className="text-[13px] text-ink-2">
                จ่ายแล้วด้วยพร้อมเพย์
              </span>
            </div>
            <Button
              icon={<PhoneOutlined />}
              href={`tel:${customer?.phone}`}
              className="c-soft flex items-center px-4"
            >
              โทร
            </Button>
          </div>
          <div className="rounded-xl bg-bg px-3 py-2.5 text-sm leading-[21px]">
            <div>{order.deliveryAddress}</div>
            {order.addressNote && (
              <div>
                <b className="font-semibold">จุดสังเกต:</b> {order.addressNote}
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-white p-[15px]">
          <b className="text-sm font-semibold text-ink-2">
            รายการอาหาร ({itemCount})
          </b>
          {order.items.map((item, index) => (
            <span key={index} className="text-[15px]">
              {item.quantity} × {item.menuName}
            </span>
          ))}
        </section>
        <a
          href={`tel:${mockShop.phone}`}
          className="self-center p-2 text-sm font-semibold text-brand-text"
        >
          ติดต่อลูกค้าไม่ได้? โทรแจ้งร้าน
        </a>
      </main>
    </CustomerLayout>
  );
};

export default JobDetail;
