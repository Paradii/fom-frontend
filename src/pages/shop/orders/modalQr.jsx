import { Button, QRCode } from "antd";
import { UseModal } from "@/components";
import { mockCustomers, mockOrders, paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const ModalQr = ({ modal, setModal, onCancelBatch }) => {
  const batch = modal.data;
  const orders = mockOrders.filter((o) => batch?.orderIds.includes(o.orderId));
  const origin = import.meta.env.VITE_LAN_ORIGIN || window.location.origin;
  const link = `${origin}/rider/${batch?.token}`;

  let total = 0;
  orders.forEach((o) => {
    total += paidTotal(o);
  });

  const getCustomerName = (customerId) => {
    return mockCustomers.find((c) => c.customerId === customerId)?.displayName;
  };

  const getOrderText = (order) => {
    const name = getCustomerName(order.customerId);
    return `#${order.orderId} · ${order.addressLabel} ${name}`;
  };

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const footer = (
    <div className="flex gap-3">
      {!batch?.scannedAt && (
        <Button
          size="large"
          className="danger-outline flex-1"
          onClick={() => onCancelBatch(batch)}
        >
          ยกเลิก QR
        </Button>
      )}
      <Button type="primary" size="large" className="flex-1" onClick={onClose}>
        ปิด
      </Button>
    </div>
  );

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      size="small"
      footer={footer}
    >
      {batch && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <div className="font-head text-2xl font-semibold">
              QR รอบส่ง {batch.batchCode}
            </div>
            <div className="text-ink-2">
              {orders.length} ออเดอร์ · {formatPrice(total)}
            </div>
          </div>
          <QRCode value={link} size={206} bordered />
          <div className="text-center">
            <div>
              ให้คนส่งสแกนด้วยกล้องมือถือ เปิดลิงก์ได้เลย{" "}
              <span className="whitespace-nowrap">ไม่ต้องล็อกอิน</span>
            </div>
            <div className="text-sm text-ink-2">
              ลิงก์ใช้ได้จนส่งครบทุกออเดอร์ในรอบ หรือจนกดยกเลิก QR
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            {orders.map((o) => (
              <div
                key={o.orderId}
                className="flex justify-between gap-2 rounded-[10px] bg-[#F3F2EE] px-3 py-2.5 text-sm"
              >
                <span>{getOrderText(o)}</span>
                <b>{formatPrice(paidTotal(o))}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </UseModal>
  );
};

export default ModalQr;
