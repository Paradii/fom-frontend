import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingOutlined } from "@ant-design/icons";
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

  const rows = [
    { label: "ลูกค้า", value: customer?.displayName },
    { label: "พร้อมเพย์", value: customer?.phone },
    {
      label: "ชื่อบัญชีผู้รับ",
      value: data?.payerName,
      note: "จากสลิปที่ลูกค้าโอนมาตอนสั่ง",
    },
    {
      label: "ยอดที่ต้องโอนคืน",
      value: formatPrice(amount),
      className: "text-[#C0392B]",
    },
    { label: "เหตุผล", value: data?.cancelReason || "ร้านยกเลิก" },
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
          <div className="overflow-hidden rounded-xl border border-solid border-line">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-0.5 border-0 border-b border-solid border-line px-3.5 py-2.5 last:border-b-0 md:flex-row md:gap-4"
              >
                <span className="text-sm text-[#57554F] md:w-36 md:shrink-0">
                  {row.label}
                </span>
                <div className="flex flex-col">
                  <b className={row.className}>{row.value}</b>
                  {row.note && (
                    <span className="text-[13px] text-ink-3">{row.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[#FFF6D6] p-3 text-[15px] leading-normal text-[#7A5200]">
            ก่อนกดโอนในแอปธนาคาร ดูให้ชื่อบัญชีตรงกับ {data.payerName}
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
            <div className="flex flex-col gap-1 text-[15px] text-[#15803D]">
              {checks.map((text) => (
                <span key={text}>✓ {text}</span>
              ))}
              <span className="text-sm text-ink-2">
                จำลองการตรวจสลิป (ยังไม่ได้ต่อ RDCW)
              </span>
            </div>
          )}
        </div>
      )}
    </UseModal>
  );
};

export default ModalRefund;
