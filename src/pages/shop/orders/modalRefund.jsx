import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Descriptions } from "antd";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { FormUpload, UseModal } from "@/components";
import { mockCustomers, paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const schema = yup.object({
  slip: yup.mixed().nullable().required("แนบสลิปโอนคืนก่อนบันทึก"),
});

const ModalRefund = ({ modal, setModal, onSave }) => {
  const data = modal.data;
  const [check, setCheck] = useState("");

  const customer = mockCustomers.find((c) => {
    return c.customerId === data?.customerId;
  });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { slip: null },
    resolver: yupResolver(schema),
  });

  const slip = watch("slip");

  useEffect(() => {
    if (modal.open) {
      reset({ slip: null });
      setCheck("");
    }
  }, [modal.open]);

  useEffect(() => {
    if (!slip) return;
    setCheck("checking");
    const timer = setTimeout(() => setCheck("pass"), 1200);
    return () => clearTimeout(timer);
  }, [slip]);

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onSubmitForm = (values) => {
    if (check !== "pass") return;
    onSave(data, values.slip);
    onClose();
  };

  const amount = data ? paidTotal(data) : 0;

  const checks = [
    `ยอดโอนคืนตรง ${formatPrice(amount)}`,
    `ชื่อผู้รับตรงกับ ${data?.payerName}`,
    "เลขอ้างอิงไม่ซ้ำ",
  ];

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title={`โอนเงินคืน #${data?.orderId}`}
      size="small"
      saveText="ยืนยันโอนคืนแล้ว"
      loading={check === "checking"}
      onSave={handleSubmit(onSubmitForm)}
    >
      {data && (
        <div className="flex flex-col gap-4">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ลูกค้า">
              {customer?.displayName}
            </Descriptions.Item>
            <Descriptions.Item label="พร้อมเพย์">
              <b>{customer?.phone}</b>
            </Descriptions.Item>
            <Descriptions.Item label="ชื่อบัญชีผู้รับ">
              <b>{data.payerName}</b>
              <div className="text-sm text-ink-2">
                จากสลิปที่ลูกค้าโอนมาตอนสั่ง
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="ยอดที่ต้องโอนคืน">
              <b className="text-danger">{formatPrice(amount)}</b>
            </Descriptions.Item>
            <Descriptions.Item label="เหตุผล">
              {data.cancelReason || "ร้านยกเลิก"}
            </Descriptions.Item>
          </Descriptions>
          <div className="rounded-xl bg-brand-soft p-3 text-brand-text">
            ก่อนกดโอนในแอปธนาคาร ดูให้ชื่อบัญชีตรงกับ <b>{data.payerName}</b>
          </div>
          <FormUpload
            control={control}
            name="slip"
            label="สลิปโอนคืน"
            required
            hint="ลูกค้าจะได้รับแจ้งทาง LINE และดูสลิปได้ในหน้าคำสั่งซื้อ"
          />
          {check === "checking" && (
            <div className="text-ink-2">
              <LoadingOutlined className="mr-2" />
              จำลองการตรวจสลิป (ยังไม่ได้ต่อ RDCW)
            </div>
          )}
          {check === "pass" && (
            <div className="flex flex-col gap-1 text-[#15803D]">
              {checks.map((text) => (
                <span key={text}>
                  <CheckOutlined className="mr-2" />
                  {text}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </UseModal>
  );
};

export default ModalRefund;
