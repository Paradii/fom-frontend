import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput, FormRadio, UseModal } from "@/components";

export const TYPE_OPTIONS = [
  { value: "taste", label: "รสชาติ" },
  { value: "ingredient", label: "วัตถุดิบหลัก" },
  { value: "cooking_method", label: "วิธีปรุง" },
];

const tagRequestSchema = yup.object({
  tagName: yup
    .string()
    .trim()
    .required("กรุณาระบุชื่อแท็ก")
    .max(50, "ยาวได้ไม่เกิน 50 ตัวอักษร"),
  tagType: yup.string().required("กรุณาเลือกประเภท"),
});

const ModalRequestTag = ({ open, onClose, onSave }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { tagName: "", tagType: "ingredient" },
    resolver: yupResolver(tagRequestSchema),
  });

  useEffect(() => {
    if (open) reset({ tagName: "", tagType: "ingredient" });
  }, [open]);

  const onSubmitForm = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <UseModal
      open={open}
      onHandleCancel={onClose}
      title="ขอเพิ่มแท็กใหม่"
      size="small"
      onSave={handleSubmit(onSubmitForm)}
      saveText="ส่งคำขอ"
    >
      <div className="grid gap-4">
        <p className="m-0 text-ink-2">
          ผู้ดูแลระบบจะตรวจแล้วเพิ่มให้ ระหว่างนี้บันทึกเมนูได้เลยไม่ต้องรอ
        </p>
        <FormInput
          control={control}
          name="tagName"
          label="ชื่อแท็ก"
          required
          placeholder="รมควัน"
        />
        <FormRadio
          control={control}
          name="tagType"
          label="ประเภท"
          required
          options={TYPE_OPTIONS}
        />
      </div>
    </UseModal>
  );
};

export default ModalRequestTag;
