import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  MutedOutlined,
  QrcodeOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import useDataChange from "@/hooks/useDataChange";
import {
  fetchSaveBatch,
  fetchSaveOrder,
  mockBatches,
  mockOrders,
  paidTotal,
} from "@/services/data";
import { formatDay, formatPrice } from "@/utils/format";
import { playNewOrderSound } from "@/services/sound";
import OrderNew from "./orderNew";
import OrderGroup from "./orderGroup";
import OrderCard from "./orderCard";
import OrderReadyCard from "./orderReadyCard";
import OrderBatch from "./orderBatch";
import ModalQr from "./modalQr";
import ModalReject from "./modalReject";
import OrderCancelled from "./orderCancelled";
import ModalRefund from "./modalRefund";

const WORKING_STATUS = ["paid", "preparing", "ready", "delivering"];

const Order = () => {
  const navigate = useNavigate();
  const { success, warning, error, confirm } = useNotify();
  const [orders, setOrders] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [refundModal, setRefundModal] = useState({
    open: false,
    data: null,
  });
  const [modal, setModal] = useState({
    open: false,
    data: null,
  });
  const [qrModal, setQrModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    onSearchForm();
  }, []);

  // ShopLayout ดึงคำสั่งซื้อจาก backend เป็นระยะ โหลดเสร็จเมื่อไหร่ให้หน้านี้อ่านใหม่
  useDataChange(() => onSearchForm());

  const onToggleSound = () => {
    if (!isSoundOn) playNewOrderSound();
    setIsSoundOn(!isSoundOn);
  };

  const onSearchForm = () => {
    const today = new Date().toDateString();
    const result = mockOrders.filter((o) => {
      const isToday = new Date(o.createdAt).toDateString() === today;
      const isWorking = WORKING_STATUS.includes(o.status);
      return isToday || isWorking || o.refundStatus === "pending";
    });
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setOrders([...result]);
    setBatches(mockBatches.filter((b) => b.status === "active"));
  };

  const onSubmitForm = async ({ formValue, actionType }) => {
    const payload = {
      actionType: actionType,
      orderId: formValue.orderId,
      status: formValue.status,
      reason: formValue.reason,
      isRefund: formValue.isRefund,
      slipUrl: formValue.slipUrl,
      by: formValue.by || "ร้าน",
    };
    const resp = await fetchSaveOrder(payload);
    if (resp.success) {
      onSearchForm();
    } else {
      error(resp.message);
    }
    return resp;
  };

  const onAccept = async (order) => {
    const resp = await onSubmitForm({
      formValue: { orderId: order.orderId },
      actionType: "accept",
    });
    if (resp.success) success("รับคำสั่งซื้อแล้ว เริ่มทำได้เลย");
  };

  const onReady = async (order) => {
    const resp = await onSubmitForm({
      formValue: { orderId: order.orderId, status: "ready" },
      actionType: "status",
    });
    if (resp.success) success(`#${order.orderId} พร้อมส่งแล้ว`);
  };

  const onSelect = (order) => {
    if (selectedIds.includes(order.orderId)) {
      setSelectedIds(selectedIds.filter((id) => id !== order.orderId));
    } else {
      setSelectedIds([...selectedIds, order.orderId]);
    }
  };

  const onSelectAll = (e) => {
    e.stopPropagation();
    if (selectedOrders.length === readyOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(readyOrders.map((o) => o.orderId));
    }
  };

  const onSaveBatch = async (orderIds) => {
    const resp = await fetchSaveBatch({ actionType: "A", orderIds: orderIds });
    if (resp.success) {
      setSelectedIds([]);
      onSearchForm();
      setQrModal({ open: true, data: resp.batch });
    } else {
      error(resp.message);
    }
  };

  const onCancelBatch = (batch) => {
    confirm({
      title: `ยกเลิก QR รอบส่ง ${batch.batchCode}?`,
      content: "ลิงก์นี้จะใช้ไม่ได้ ออเดอร์จะกลับไปอยู่ในช่องพร้อมส่ง",
      okText: "ยกเลิก QR",
      danger: true,
      onOk: async () => {
        const resp = await fetchSaveBatch({
          actionType: "cancel",
          batchId: batch.batchId,
        });
        if (resp.success) {
          setQrModal({ open: false, data: null });
          onSearchForm();
          success("ยกเลิก QR แล้ว");
        } else if (resp.status === 403) {
          error("ตอนนี้ยกเลิก QR ได้เฉพาะผู้ดูแลระบบ (backend ยังไม่เปิดให้ร้านยกเลิก)");
        } else {
          error(resp.message || "คนส่งสแกนรอบนี้ไปแล้ว ยกเลิก QR ไม่ได้");
        }
      },
    });
  };

  const onReject = (order) => {
    setModal({ open: true, data: order });
  };

  const onSaveReject = async (order, reason, isRefund) => {
    const resp = await onSubmitForm({
      formValue: {
        orderId: order.orderId,
        reason: reason,
        isRefund: isRefund,
      },
      actionType: "cancel",
    });
    if (resp.success) success(`ยกเลิกแล้ว แจ้งลูกค้าว่า "${reason}"`);
  };

  const onTimeout = async (order) => {
    const resp = await onSubmitForm({
      formValue: {
        orderId: order.orderId,
        reason: "ร้านไม่รับภายใน 15 นาที",
        isRefund: true,
        by: "ระบบ",
      },
      actionType: "cancel",
    });
    if (resp.success) warning(`คำสั่งซื้อ #${order.orderId} ถูกยกเลิกอัตโนมัติ`);
  };

  const onRefund = (order) => {
    setRefundModal({ open: true, data: order });
  };

  const onSaveRefund = async (order, slip) => {
    const resp = await onSubmitForm({
      formValue: { orderId: order.orderId, slipUrl: slip.url },
      actionType: "refund",
    });
    if (resp.success) success("บันทึกการโอนคืนแล้ว แจ้งลูกค้าทาง LINE แล้ว");
  };

  const onView = (order) => {
    navigate(`/shop/orders/${order.orderId}`);
  };

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => {
    return new Date(o.createdAt).toDateString() === today;
  });
  const newOrders = orders.filter((o) => o.status === "paid");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => {
    return o.status === "ready" && !o.batchId;
  });
  const completedOrders = orders.filter((o) => o.status === "completed");
  const selectedOrders = readyOrders.filter((o) => {
    return selectedIds.includes(o.orderId);
  });
  let selectedTotal = 0;
  selectedOrders.forEach((o) => {
    selectedTotal += paidTotal(o);
  });
  let batchCount = 0;
  batches.forEach((b) => {
    batchCount += b.orderIds.length;
  });
  const getBatchOrders = (batch) => {
    return mockOrders.filter((o) => batch.orderIds.includes(o.orderId));
  };
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
          <div className="flex h-[41px] items-center gap-1 rounded-xl border border-solid border-line bg-white px-[15px] text-sm">
            ทั้งหมด <b>{todayOrders.length}</b>
          </div>
          <div className="flex h-[41px] items-center gap-1 rounded-xl border border-solid border-line bg-white px-[15px] text-sm">
            ยอดวันนี้ <b>{formatPrice(todayTotal)}</b>
          </div>
          {refundCount > 0 && (
            <Button
              danger
              className="head-chip order-last md:order-none"
              onClick={onGoCancelled}
            >
              รอโอนคืน <b>{refundCount}</b>
            </Button>
          )}
          <Button
            icon={isSoundOn ? <SoundOutlined /> : <MutedOutlined />}
            onClick={onToggleSound}
            className={`head-chip font-normal ${
              isSoundOn
                ? "border-line bg-white text-ink md:border-brand-line md:bg-brand-soft md:text-brand-text"
                : "border-ink bg-ink text-white"
            }`}
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
          onAccept={() => onAccept(o)}
          onReject={() => onReject(o)}
          onTimeout={() => onTimeout(o)}
          onView={() => onView(o)}
        />
      ))}

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 min-[1440px]:grid-cols-[1fr_1.4fr_1.1fr_0.9fr]">
        <OrderGroup status="preparing" count={preparingOrders.length}>
          {preparingOrders.map((o) => (
            <OrderCard
              key={o.orderId}
              order={o}
              onReady={onReady}
              onView={onView}
            />
          ))}
        </OrderGroup>
        <OrderGroup
          status="ready"
          count={readyOrders.length}
          extra={
            readyOrders.length > 0 && (
              <a
                className="whitespace-nowrap text-sm font-semibold text-brand-text underline"
                onClick={onSelectAll}
              >
                {selectedOrders.length === readyOrders.length
                  ? "ยกเลิกเลือก"
                  : "เลือกทั้งหมด"}
              </a>
            )
          }
        >
          {readyOrders.map((o) => (
            <OrderReadyCard
              key={o.orderId}
              order={o}
              isSelected={selectedIds.includes(o.orderId)}
              onSelect={onSelect}
              onQr={() => onSaveBatch([o.orderId])}
            />
          ))}
          {selectedOrders.length > 0 && (
            <div className="fixed inset-x-0 bottom-[84px] z-10 flex flex-col gap-2.5 bg-[#1E1C17] p-3 text-white lg:static lg:rounded-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#D9D4C5]">
                  เลือกแล้ว{" "}
                  <b className="font-head text-[17px] text-white">
                    {selectedOrders.length}
                  </b>{" "}
                  ออเดอร์
                </span>
                <b className="font-head text-[17px]">
                  {formatPrice(selectedTotal)}
                </b>
              </div>
              <Button
                type="primary"
                size="large"
                className="font-head"
                icon={<QrcodeOutlined />}
                onClick={() =>
                  onSaveBatch(selectedOrders.map((o) => o.orderId))
                }
              >
                สร้าง QR รอบส่ง
              </Button>
            </div>
          )}
        </OrderGroup>
        <OrderGroup status="delivering" count={batchCount}>
          {batches.map((b) => (
            <OrderBatch
              key={b.batchId}
              batch={b}
              orders={getBatchOrders(b)}
              onQr={(batch) => setQrModal({ open: true, data: batch })}
              onView={onView}
            />
          ))}
        </OrderGroup>
        <OrderGroup status="completed" count={completedOrders.length}>
          {completedOrders.map((o) => (
            <OrderCard key={o.orderId} order={o} onView={onView} />
          ))}
        </OrderGroup>
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
      <ModalQr
        modal={qrModal}
        setModal={setQrModal}
        onCancelBatch={onCancelBatch}
      />
      {selectedOrders.length > 0 && <div className="h-28 lg:hidden" />}
    </PagePattern>
  );
};

export default Order;
