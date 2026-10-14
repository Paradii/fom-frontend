import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, InputNumber } from "antd";
import {
  FormInput,
  FormInputNumber,
  FormSwitch,
  ButtonAdd,
  ButtonDelete,
  UseModal,
} from "@/components";
import { optionGroupDefaultValues, optionGroupSchema } from "./menuSchema";

const ModalAddOption = ({ modal, setModal, onSave, onDelete }) => {
  const [options, setOptions] = useState([]);
  const [optionError, setOptionError] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: optionGroupDefaultValues,
    resolver: yupResolver(optionGroupSchema),
  });

  useEffect(() => {
    if (modal.open) {
      if (modal.actionCode === "U") {
        reset(modal.data);
        setOptions(modal.data.options);
      } else {
        reset(optionGroupDefaultValues);
        setOptions([{ optionName: "", extraPrice: 0 }]);
      }
      setOptionError("");
    }
  }, [modal.open]);

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onChangeOption = (index, key, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
  };

  const onAddOption = () => {
    setOptions([...options, { optionName: "", extraPrice: 0 }]);
  };

  const onRemoveOption = (index) => {
    setOptions(options.filter((o, i) => i !== index));
  };

  const onSubmitForm = (formValue) => {
    const hasEmptyName = options.some((o) => !o.optionName.trim());
    if (hasEmptyName) {
      setOptionError("กรุณาระบุชื่อตัวเลือกให้ครบ");
      return;
    }
    if (formValue.maxSelect > options.length) {
      setOptionError("เลือกได้สูงสุดต้องไม่เกินจำนวนตัวเลือก");
      return;
    }
    onSave({ ...formValue, options: options }, modal.index);
    onClose();
  };

  const onClickDelete = () => {
    onDelete(modal.index);
    onClose();
  };

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title={
        modal.actionCode === "A" ? "เพิ่มกลุ่มตัวเลือก" : "แก้ไขกลุ่มตัวเลือก"
      }
      size="small"
      saveText="ตกลง"
      onSave={handleSubmit(onSubmitForm)}
      footerLeft={
        modal.actionCode === "U" && (
          <ButtonDelete type="text" text="ลบกลุ่ม" onClick={onClickDelete} />
        )
      }
    >
      <div className="grid gap-4 pt-2">
        <FormInput
          control={control}
          name="groupName"
          label="ชื่อกลุ่ม"
          required
          placeholder="เนื้อสัตว์"
        />
        <div className="grid grid-cols-2 items-end gap-3">
          <div className="flex h-[46px] items-center justify-between">
            <span className="text-base font-medium">ลูกค้าต้องเลือก</span>
            <FormSwitch control={control} name="isRequired" />
          </div>
          <FormInputNumber
            control={control}
            name="maxSelect"
            label="เลือกได้สูงสุด"
            placeholder="1"
            min={1}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-base font-medium">
            ตัวเลือก<span className="text-danger"> *</span>
          </span>
          {options.map((option, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_40px] gap-2">
              <Input
                value={option.optionName}
                placeholder="หมูกรอบ"
                onChange={(e) =>
                  onChangeOption(index, "optionName", e.target.value)
                }
              />
              <InputNumber
                value={option.extraPrice}
                min={0}
                placeholder="10"
                addonAfter="บาท"
                onChange={(value) => onChangeOption(index, "extraPrice", value)}
              />
              <ButtonDelete
                type="text"
                text=""
                disabled={options.length === 1}
                onClick={() => onRemoveOption(index)}
              />
            </div>
          ))}
          {optionError && (
            <span className="text-sm text-danger">{optionError}</span>
          )}
          <ButtonAdd type="dashed" text="เพิ่มตัวเลือก" onClick={onAddOption} />
        </div>
      </div>
    </UseModal>
  );
};

export default ModalAddOption;
