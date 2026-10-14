import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import { STATUS, StatusBadge } from "@/components";
import {
  SHOP_RIDER,
  fetchSaveOrder,
  isRiderJob,
  mockOrders,
} from "@/mock/mockData";
import { formatTime } from "@/utils/format";
import { getPosition } from "@/utils/geo";
import OrderDetailItems from "./orderDetailItems";
import OrderDetailCustomer from "./orderDetailCustomer";
import OrderDetailHistory from "./orderDetailHistory";
import OrderDetailSlip from "./orderDetailSlip";
import OrderDetailRider from "./orderDetailRider";
import OrderDetailRefund from "./orderDetailRefund";
import ModalReject from "./modalReject";
import ModalRefund from "./modalRefund";
import ModalDelivered from "./modalDelivered";
import OrderDetailProof from "./orderDetailProof";

const NEXT_STATUS = {
  paid: "accepted",
  accepted: "preparing",
  preparing: "delivering",
  delivering: "completed",
};

const CANCEL_STATUS = ["paid", "accepted", "preparing"];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { success } = useNotify();
  const [order, setOrder] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    data: null,
  });
  const [refundModal, setRefundModal] = useState({
    open: false,
    data: null,
  });
  const [deliveredModal, setDeliveredModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    onSearchForm();
  }, [orderId]);

  const findOrder = () => {
    return mockOrders.find((o) => o.orderId === Number(orderId));
  };

  const onSearchForm = () => {
    const result = findOrder();
    setOrder(result ? { ...result } : null);
  };

  const onSubmitForm = ({ formValue, actionType }) => {
    const payload = {
      actionType: actionType,
      orderId: order.orderId,
      status: formValue.status,
      reason: formValue.reason,
      isRefund: formValue.isRefund,
      slipUrl: formValue.slipUrl,
      photoUrl: formValue.photoUrl,
      proof: formValue.proof,
      riderId: formValue.riderId,
      by: "ร้าน",
    };
    const resp = fetchSaveOrder(payload);
    if (resp.success) {
      onSearchForm();
    }
  };

  const onChangeStatus = (status) => {
    if (status === "completed") {
      setDeliveredModal({ open: true, data: order });
      return;
    }
    onSubmitForm({
      formValue: { status: status },
      actionType: "status",
    });
    success(`เปลี่ยนเป็น ${STATUS[status].label} แล้ว`);
  };

  const onSaveDelivered = (data, photo) => {
    getPosition((position) => {
      onSubmitForm({
        formValue: { photoUrl: photo.url, proof: position },
        actionType: "delivered",
      });
      success("บันทึกส่งสำเร็จพร้อมรูปหลักฐานแล้ว");
    });
  };

  const onSaveReject = (data, reason, isRefund) => {
    onSubmitForm({
      formValue: { reason: reason, isRefund: isRefund },
      actionType: "cancel",
    });
    success(`ยกเลิกแล้ว แจ้งลูกค้าว่า "${reason}"`);
  };

  const onSaveRefund = (data, slip) => {
    onSubmitForm({
      formValue: { slipUrl: slip.url },
      actionType: "refund",
    });
    success("บันทึกการโอนคืนแล้ว แจ้งลูกค้าทาง LINE แล้ว");
  };

  const onChangeRider = (riderId) => {
    onSubmitForm({
      formValue: { riderId: riderId },
      actionType: "rider",
    });
    if (riderId === SHOP_RIDER) {
      success("ตั้งเป็นร้านส่งเองแล้ว");
    } else {
      success("มอบหมายพนักงานจัดส่งแล้ว");
    }
  };

  if (!order) {
    return (
      <PagePattern
        title="ไม่พบคำสั่งซื้อ"
        onBack={() => navigate("/shop/orders")}
      />
    );
  }

  const next = NEXT_STATUS[order.status];
  const isDeliveryStep = ["delivering", "completed"].includes(next);
  const noRider = next === "delivering" && order.riderId === null;
  const waitRider = isDeliveryStep && isRiderJob(order);
  const canCancel = CANCEL_STATUS.includes(order.status);
  const isCancelled = order.status === "cancelled";
  const isCompleted = order.status === "completed";
  const acceptedLog = order.statusLogs.find((l) => l.status === "accepted");
  const completedLog = order.statusLogs.find((l) => {
    return l.status === "completed";
  });

  return (
    <PagePattern
      title={`คำสั่งซื้อ #${order.orderId}`}
      titleExtra={
        <>
          <StatusBadge status={order.status} />
          <span className="text-ink-2">
            สั่งเมื่อ {formatTime(order.createdAt)}
            {acceptedLog &&
              !completedLog &&
              ` · รับ ${formatTime(acceptedLog.at)}`}
            {completedLog && ` · ส่งถึง ${formatTime(completedLog.at)}`}
          </span>
        </>
      }
      onBack={() => navigate("/shop/orders")}
      extra={
        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <Button
              danger
              onClick={() => setModal({ open: true, data: order })}
            >
              ยกเลิกคำสั่งซื้อ
            </Button>
          )}
          {next && !waitRider && (
            <Button
              type="primary"
              disabled={noRider}
              onClick={() => onChangeStatus(next)}
            >
              {noRider ? "เลือกคนส่งก่อน" : `เปลี่ยนเป็น ${STATUS[next].label}`}
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
          {!isCancelled && !isCompleted && (
            <OrderDetailRider order={order} onChangeRider={onChangeRider} />
          )}
        </div>
      </div>

      <ModalReject modal={modal} setModal={setModal} onSave={onSaveReject} />
      <ModalRefund
        modal={refundModal}
        setModal={setRefundModal}
        onSave={onSaveRefund}
      />
      <ModalDelivered
        modal={deliveredModal}
        setModal={setDeliveredModal}
        onSave={onSaveDelivered}
      />
    </PagePattern>
  );
};

export default OrderDetail;
