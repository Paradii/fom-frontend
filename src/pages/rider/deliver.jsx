import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Input } from "antd";
import {
  CameraOutlined,
  CheckOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useNotify from "@/hooks/useNotify";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveDelivery,
  getBatchByToken,
  loadBatch,
  mockOrders,
} from "@/services/data";
import withLoad from "@/utils/withLoad";

import { formatThaiDate, formatTime } from "@/utils/format";

const SOURCE_TEXT = {
  camera: "กดถ่ายจากกล้อง",
  exif: "จากข้อมูลในรูป",
};

const Deliver = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { token, orderId } = useParams();
  const batch = getBatchByToken(token);
  const order = mockOrders.find((o) => o.orderId === Number(orderId));
  const [photoUrl, setPhotoUrl] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [timeSource, setTimeSource] = useState("");
  const [note, setNote] = useState("");

  const isInBatch = batch && batch.orderIds.includes(Number(orderId));
  if (!order || !isInBatch || order.status !== "delivering") {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="งานนี้ส่งแล้วหรือไม่อยู่ในรอบส่ง" />
      </CustomerLayout>
    );
  }

  const onPickPhoto = (e, source) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
      setTimeSource(source);
      if (source === "camera") {
        setTakenAt(new Date().toISOString());
      } else {
        setTakenAt(new Date(file.lastModified).toISOString());
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onConfirm = async () => {
    const resp = await fetchSaveDelivery({
      actionType: "deliver",
      token: token,
      orderId: order.orderId,
      photoUrl: photoUrl,
      takenAt: takenAt,
      timeSource: timeSource,
      note: note,
    });
    if (resp.success) {
      notify.success(`ส่ง #${order.orderId} สำเร็จแล้ว`);
      navigate(`/rider/${token}`);
    } else {
      notify.error(resp.message);
    }
  };

  const footer = (
    <>
      {!photoUrl && (
        <span className="text-center text-[13px] text-ink-2">
          ต้องแนบรูปก่อน จึงกดยืนยันส่งสำเร็จได้
        </span>
      )}
      <Button
        type="primary"
        block
        icon={<CheckOutlined />}
        className="c-main"
        disabled={!photoUrl}
        onClick={onConfirm}
      >
        ยืนยันส่งสำเร็จ
      </Button>
    </>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader
        title={`ยืนยันส่งสำเร็จ #${order.orderId}`}
        backTo={`/rider/${token}/order/${order.orderId}`}
      />
      <main className="flex flex-col gap-4 px-4 pb-6 pt-5">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="รูปยืนยันการส่ง"
            className="h-[340px] w-full rounded-[14px] object-cover"
          />
        ) : (
          <div className="relative flex h-[340px] flex-col items-center justify-center gap-2 rounded-[18px] bg-[#E6E4E0] text-ink-2">
            <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs text-ink">
              ยังไม่ได้แนบรูป
            </span>
            <CameraOutlined className="text-5xl" />
            <span className="text-sm">รูปที่แนบแล้วแสดงตรงนี้</span>
          </div>
        )}
        {photoUrl && (
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              เวลาในรูป: {formatThaiDate(takenAt)} {formatTime(takenAt)} น. (
              {SOURCE_TEXT[timeSource]})
            </span>
            <span className="text-[13px] text-ink-2">
              ถ้าอัปโหลดรูป ระบบใช้เวลาที่ถ่ายจากข้อมูลในรูป
            </span>
          </div>
        )}
        <label
          className={`flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-solid text-[15px] font-semibold text-brand-text ${
            photoUrl ? "border-brand-line bg-white" : "border-brand bg-brand"
          }`}
        >
          <CameraOutlined />
          {photoUrl ? "ถ่ายใหม่" : "เปิดกล้องถ่ายรูป"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onPickPhoto(e, "camera")}
          />
        </label>
        <label className="flex h-[50px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-solid border-brand-line bg-white text-[15px] font-semibold text-brand-text">
          <UploadOutlined />
          {photoUrl ? "อัปโหลดรูปอื่น" : "อัปโหลดรูป"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickPhoto(e, "exif")}
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">หมายเหตุ (ถ้ามี)</span>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="วางไว้หน้าประตูตามที่ลูกค้าแจ้ง"
            className="h-[46px] rounded-xl text-[15px]"
          />
        </div>
      </main>
    </CustomerLayout>
  );
};

export default withLoad(Deliver, ({ token }) => loadBatch(token));
