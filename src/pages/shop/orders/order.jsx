import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { MutedOutlined, SoundOutlined } from "@ant-design/icons";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import { fetchSaveOrder, mockOrders, paidTotal } from "@/mock/mockData";
import { formatDay, formatPrice } from "@/utils/format";
import { playNewOrderSound } from "@/services/sound";
import { getPosition } from "@/utils/geo";
import OrderNew from "./orderNew";
import OrderGroup from "./orderGroup";
import ModalReject from "./modalReject";
import OrderCancelled from "./orderCancelled";
import ModalRefund from "./modalRefund";
import ModalDelivered from "./modalDelivered";

const GROUPS = ["accepted", "preparing", "delivering", "completed"];

const Order = () => {
  const navigate = useNavigate();
  const { success, warning } = useNotify();
  const [orders, setOrders] = useState([]);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [refundModal, setRefundModal] = useState({
    open: false,
    data: null,
  });
  const [modal, setModal] = useState({
    open: false,
    data: null,
  });
  const [deliveredModal, setDeliveredModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    onSearchForm();
  }, []);

  const onToggleSound = () => {
    if (!isSoundOn) playNewOrderSound();
    setIsSoundOn(!isSoundOn);
  };

  const onSearchForm = () => {
    const today = new Date().toDateString();
    const result = mockOrders.filter((o) => {
      const isToday = new Date(o.createdAt).toDateString() === today;
      return isToday || o.refundStatus === "pending";
    });
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setOrders([...result]);
  };

  const onSubmitForm = ({ formValue, actionType }) => {
    const payload = {
      actionType: actionType,
      orderId: formValue.orderId,
      status: formValue.status,
      reason: formValue.reason,
      isRefund: formValue.isRefund,
      slipUrl: formValue.slipUrl,
      photoUrl: formValue.photoUrl,
      proof: formValue.proof,
      by: formValue.by || "ร้าน",
    };
    const resp = fetchSaveOrder(payload);
    if (resp.success) {
      onSearchForm();
    }
  };

  const onChangeStatus = (order, status, message) => {
    if (status === "completed") {
      setDeliveredModal({ open: true, data: order });
      return;
    }
    onSubmitForm({
      formValue: { orderId: order.orderId, status: status },
      actionType: "status",
    });
    success(message);
  };

  const onSaveDelivered = (order, photo) => {
    getPosition((position) => {
      onSubmitForm({
        formValue: {
          orderId: order.orderId,
          photoUrl: photo.url,
          proof: position,
        },
        actionType: "delivered",
      });
      success("บันทึกส่งสำเร็จพร้อมรูปหลักฐานแล้ว");
    });
  };

  const onReject = (order) => {
    setModal({ open: true, data: order });
  };

  const onSaveReject = (order, reason, isRefund) => {
    onSubmitForm({
      formValue: {
        orderId: order.orderId,
        reason: reason,
        isRefund: isRefund,
      },
      actionType: "cancel",
    });
    success(`ยกเลิกแล้ว แจ้งลูกค้าว่า "${reason}"`);
  };

  const onTimeout = (order) => {
    onSubmitForm({
      formValue: {
        orderId: order.orderId,
        reason: "ร้านไม่รับภายใน 10 นาที",
        isRefund: true,
        by: "ระบบ",
      },
      actionType: "cancel",
    });
    warning(`คำสั่งซื้อ #${order.orderId} ถูกยกเลิกอัตโนมัติ`);
  };

  const onRefund = (order) => {
    setRefundModal({ open: true, data: order });
  };

  const onSaveRefund = (order, slip) => {
    onSubmitForm({
      formValue: { orderId: order.orderId, slipUrl: slip.url },
      actionType: "refund",
    });
    success("บันทึกการโอนคืนแล้ว แจ้งลูกค้าทาง LINE แล้ว");
  };

  const onView = (order) => {
    navigate(`/shop/orders/${order.orderId}`);
  };

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => {
    return new Date(o.createdAt).toDateString() === today;
  });
  const newOrders = orders.filter((o) => o.status === "paid");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const refundCount = cancelledOrders.filter((o) => {
    return o.refundStatus === "pending";
  }).length;
  const onGoCancelled = () => {
    const section = document.getElementById("cancelled");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  let todayTotal = 0;
  todayOrders.forEach((o) => {
    if (o.status === "completed") todayTotal += paidTotal(o);
  });

  return (
    <PagePattern
      title="คำสั่งซื้อวันนี้"
      subtitle={`${formatDay(new Date())} · อัปเดตอัตโนมัติ`}
      extra={
        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-solid border-line bg-white px-4 py-2.5">
            ทั้งหมด <b>{todayOrders.length}</b>
          </div>
          <div className="rounded-xl border border-solid border-line bg-white px-4 py-2.5">
            ยอดวันนี้ <b>{formatPrice(todayTotal)}</b>
          </div>
          {refundCount > 0 && (
            <Button danger onClick={onGoCancelled}>
              รอโอนคืน <b>{refundCount}</b>
            </Button>
          )}
          <Button
            icon={isSoundOn ? <SoundOutlined /> : <MutedOutlined />}
            onClick={onToggleSound}
            className={
              isSoundOn
                ? "border-brand-line bg-brand-soft text-brand-text"
                : "border-ink bg-ink text-white"
            }
          >
            {isSoundOn ? "เสียงเปิดอยู่" : "เสียงปิดอยู่"}
          </Button>
        </div>
      }
    >
      {newOrders.map((o) => (
        <OrderNew
          key={o.orderId}
          order={o}
          onAccept={() => onChangeStatus(o, "accepted", "รับคำสั่งซื้อแล้ว")}
          onReject={() => onReject(o)}
          onTimeout={() => onTimeout(o)}
          onView={() => onView(o)}
        />
      ))}

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 min-[1440px]:grid-cols-4">
        {GROUPS.map((status) => (
          <OrderGroup
            key={status}
            status={status}
            orders={orders.filter((o) => o.status === status)}
            onChangeStatus={onChangeStatus}
            onView={onView}
          />
        ))}
      </div>
      <OrderCancelled
        orders={cancelledOrders}
        onRefund={onRefund}
        onView={onView}
      />

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

export default Order;
