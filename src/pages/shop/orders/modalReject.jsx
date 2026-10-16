import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput, FormRadio, UseModal } from "@/components";
import { paidTotal } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const REASONS = [
  { value: "menu_out", label: "เมนูหมด" },
  { value: "out_of_area", label: "นอกพื้นที่จัดส่ง" },
  { value: "slip_invalid", label: "สลิปไม่ถูกต้อง" },
  { value: "other", label: "อื่น ๆ" },
];

const schema = yup.object({
  reason: yup.string().nullable().required("เลือกเหตุผลก่อนยกเลิก"),
  otherReason: yup.string().when("reason", {
    is: "other",
    then: (rule) => rule.trim().required("พิมพ์เหตุผลให้ลูกค้าทราบ"),
  }),
});

const ModalReject = ({ modal, setModal, onSave }) => {
  const data = modal.data;

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { reason: null, otherReason: "" },
    resolver: yupResolver(schema),
  });

  const reasonValue = watch("reason");
  const isManualSlip = data?.slipCheck === "manual";
  const reasons = REASONS.filter((r) => {
    return r.value !== "slip_invalid" || isManualSlip;
  });
  const isRefund = reasonValue !== "slip_invalid";

  useEffect(() => {
    if (modal.open) reset({ reason: null, otherReason: "" });
  }, [modal.open]);

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onSubmitForm = (values) => {
    const reason = REASONS.find((r) => r.value === values.reason);
    if (values.reason === "other") {
      onSave(data, values.otherReason.trim(), true);
    } else {
      onSave(data, reason.label, values.reason !== "slip_invalid");
    }
    onClose();
  };

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title={`ยกเลิกคำสั่งซื้อ #${data?.orderId}`}
      size="small"
      saveText="ยืนยันยกเลิก"
      danger
      onSave={handleSubmit(onSubmitForm)}
    >
      {data && (
        <div className="flex flex-col gap-4">
          <FormRadio
            control={control}
            name="reason"
            label="เหตุผลที่ยกเลิก"
            required
            options={reasons}
            className="flex flex-col gap-[22px] pt-2"
          />
          {reasonValue === "other" && (
            <FormInput
              control={control}
              name="otherReason"
              label="ระบุเหตุผล"
              required
              placeholder="ร้านปิดก่อนเวลา แก๊สหมด"
              maxLength={100}
            />
          )}
          {isRefund ? (
            <div className="rounded-xl bg-brand-soft p-3 text-brand-text">
              ลูกค้าชำระแล้ว {formatPrice(paidTotal(data))}{" "}
              ร้านต้องโอนคืนให้ลูกค้าเอง
            </div>
          ) : (
            <div className="rounded-xl bg-[#F3F2EE] p-3">
              สลิปไม่ถูกต้อง ร้านยังไม่ได้รับเงิน จึงไม่ต้องโอนคืน
            </div>
          )}
          {isManualSlip && (
            <span className="text-[13px] text-ink-3">
              ตัวเลือก "สลิปไม่ถูกต้อง" มีเฉพาะออเดอร์ที่ระบบตรวจสลิปไม่ได้
            </span>
          )}
        </div>
      )}
    </UseModal>
  );
};

export default ModalReject;
