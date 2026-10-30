import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import useDataChange from "@/hooks/useDataChange";
import { StatusBadge } from "@/components";
import { fetchSaveOrder, loadShopOrders, mockOrders } from "@/services/data";
import { formatTime } from "@/utils/format";
import OrderDetailItems from "./orderDetailItems";
import OrderDetailCustomer from "./orderDetailCustomer";
import OrderDetailHistory from "./orderDetailHistory";
import OrderDetailSlip from "./orderDetailSlip";
import OrderDetailRefund from "./orderDetailRefund";
import ModalReject from "./modalReject";
import ModalRefund from "./modalRefund";
import OrderDetailProof from "./orderDetailProof";

const NEXT_STEP = {
  paid: {
    actionType: "accept",
    text: "รับคำสั่งซื้อ",
    message: "รับคำสั่งซื้อแล้ว เริ่มทำได้เลย",
  },
  preparing: {
    actionType: "status",
    status: "ready",
    text: "ทำเสร็จ · พร้อมส่ง",
    message: "เปลี่ยนเป็นพร้อมส่งแล้ว",
  },
};

const CANCEL_STATUS = ["paid", "preparing", "ready"];

const findOrderIn = (orderId) => {
  return mockOrders.find((o) => o.orderId === Number(orderId));
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotify();
  const [isLoading, setIsLoading] = useState(!findOrderIn(orderId));
  const [order, setOrder] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    data: null,
  });
  const [refundModal, setRefundModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    onSearchForm();
    if (!findOrder()) loadShopOrders().finally(() => setIsLoading(false));
  }, [orderId]);

  useDataChange(() => onSearchForm());

  const findOrder = () => findOrderIn(orderId);

  const onSearchForm = () => {
    const result = findOrder();
    setOrder(result ? { ...result } : null);
  };

  const onSubmitForm = async ({ formValue, actionType }) => {
    const payload = {
      actionType: actionType,
      orderId: order.orderId,
      status: formValue.status,
      reason: formValue.reason,
      isRefund: formValue.isRefund,
      slipUrl: formValue.slipUrl,
      by: "ร้าน",
    };
    const resp = await fetchSaveOrder(payload);
    if (resp.success) {
      onSearchForm();
    } else {
      error(resp.message);
    }
    return resp;
  };

  const onNextStep = async (next) => {
    const resp = await onSubmitForm({
      formValue: { status: next.status },
      actionType: next.actionType,
    });
    if (resp.success) success(next.message);
  };

  const onSaveReject = async (data, reason, isRefund) => {
    const resp = await onSubmitForm({
      formValue: { reason: reason, isRefund: isRefund },
      actionType: "cancel",
    });
    if (resp.success) success(`ยกเลิกแล้ว แจ้งลูกค้าว่า "${reason}"`);
  };

  const onSaveRefund = async (data, slip) => {
    const resp = await onSubmitForm({
      formValue: { slipUrl: slip.url },
      actionType: "refund",
    });
    if (resp.success) success("บันทึกการโอนคืนแล้ว แจ้งลูกค้าทาง LINE แล้ว");
  };

  if (!order && isLoading) return <PagePattern title="กำลังโหลด..." />;

  if (!order) {
    return (
      <PagePattern
        title="ไม่พบคำสั่งซื้อ"
        onBack={() => navigate("/shop/orders")}
      />
    );
  }

  const next = NEXT_STEP[order.status];
  const canCancel = CANCEL_STATUS.includes(order.status) && !order.batchId;
  const isCancelled = order.status === "cancelled";
  const isCompleted = order.status === "completed";
  const acceptedLog = order.statusLogs.find((l) => l.status === "accepted");
  const completedLog = order.statusLogs.find((l) => {
    return l.status === "completed";
  });

  let timeText = `สั่งเมื่อ ${formatTime(order.createdAt)}`;
  if (acceptedLog && !completedLog) {
    timeText += ` · รับ ${formatTime(acceptedLog.at)}`;
  }
  if (completedLog) timeText += ` · ส่งถึง ${formatTime(completedLog.at)}`;

  return (
    <PagePattern
      title={`คำสั่งซื้อ #${order.orderId}`}
      titleExtra={
        <>
          <StatusBadge status={order.status} size="large" />
          <span className="hidden text-sm text-ink-2 md:inline">
            {timeText}
          </span>
        </>
      }
      subtitle={<span className="text-sm md:hidden">{timeText}</span>}
      onBack={() => navigate("/shop/orders")}
      extra={
        <div className="flex flex-col items-start gap-2 md:flex-row">
          {canCancel && (
            <Button
              className="danger-outline"
              onClick={() => setModal({ open: true, data: order })}
            >
              ยกเลิกคำสั่งซื้อ
            </Button>
          )}
          {next && (
            <Button type="primary" onClick={() => onNextStep(next)}>
              {next.text}
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="grid grid-cols-1 gap-4">
          <OrderDetailItems order={order} />
          <OrderDetailCustomer order={order} />
          <OrderDetailHistory order={order} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {isCancelled && (
            <OrderDetailRefund
              order={order}
              onRefund={() => setRefundModal({ open: true, data: order })}
            />
          )}
          <OrderDetailSlip order={order} />
          {isCompleted && <OrderDetailProof order={order} />}
        </div>
      </div>

      <ModalReject modal={modal} setModal={setModal} onSave={onSaveReject} />
      <ModalRefund
        modal={refundModal}
        setModal={setRefundModal}
        onSave={onSaveRefund}
      />
    </PagePattern>
  );
};

export default OrderDetail;
