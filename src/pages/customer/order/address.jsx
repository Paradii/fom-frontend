import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox } from "antd";
import { AimOutlined, EnvironmentFilled } from "@ant-design/icons";
import { FormInput } from "@/components";
import useNotify from "@/hooks/useNotify";
import CustomerHeader from "@/layouts/CustomerHeader";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveAddress,
  fetchSaveMe,
  mockAddresses,
  mockMe,
} from "@/mock/mockData";
import { addressSchema } from "./addressSchema";

const BACK_PATH = {
  cart: "/c/cart",
  nearby: "/c/nearby",
  login: "/c/nearby",
  account: "/c/account",
};

const EMPTY_FORM = {
  label: "",
  phone: "",
  address: "",
  note: "",
  isMain: false,
};

const LABEL_CLASS = "text-[13px] font-medium text-ink-2";

const Address = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { from } = useParams();
  const backTo = BACK_PATH[from] || "/c/nearby";
  const [addresses, setAddresses] = useState([...mockAddresses]);
  const [selectedId, setSelectedId] = useState(mockMe.addressId);
  const [editId, setEditId] = useState(null);
  const [isLocationOn, setIsLocationOn] = useState(mockMe.isLocationOn);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: EMPTY_FORM,
    resolver: yupResolver(addressSchema),
  });

  const onEdit = (address) => {
    setEditId(address.addressId);
    reset({
      label: address.label,
      phone: address.phone,
      address: address.address,
      note: address.note,
      isMain: address.isMain,
    });
  };

  const onLocation = () => {
    const resp = fetchSaveMe({ actionType: "location", isLocationOn: true });
    if (resp.success) {
      setIsLocationOn(true);
      notify.success("บันทึกตำแหน่งปัจจุบันแล้ว");
    }
  };

  const onSave = (values) => {
    const resp = fetchSaveAddress({
      actionType: editId ? "U" : "A",
      addressId: editId,
      address: values,
    });
    if (resp.success) navigate(backTo);
  };

  const onUse = () => {
    const values = getValues();
    const isTyping = values.label || values.phone || values.address;
    if (editId || isTyping) {
      handleSubmit(onSave)();
      return;
    }
    if (!selectedId) {
      notify.warning("กรุณาเลือกหรือเพิ่มที่อยู่จัดส่ง");
      return;
    }
    const resp = fetchSaveAddress({
      actionType: "select",
      addressId: selectedId,
    });
    if (resp.success) navigate(backTo);
  };

  const onDelete = () => {
    notify.confirm({
      title: "ลบที่อยู่นี้?",
      content: "ลบแล้วต้องเพิ่มใหม่ถ้าจะใช้อีก",
      okText: "ลบที่อยู่",
      danger: true,
      onOk: () => {
        const resp = fetchSaveAddress({ actionType: "D", addressId: editId });
        if (resp.success) {
          setAddresses([...mockAddresses]);
          setSelectedId(mockMe.addressId);
          setEditId(null);
          reset(EMPTY_FORM);
        }
      },
    });
  };

  const renderAddress = (address) => {
    const isPicked = address.addressId === selectedId;
    return (
      <div
        key={address.addressId}
        onClick={() => setSelectedId(address.addressId)}
        className={`flex cursor-pointer items-start gap-3 rounded-[14px] border border-solid bg-white p-[13px] ${
          isPicked ? "border-brand-line" : "border-line"
        }`}
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-solid ${
            isPicked ? "border-ink" : "border-[#767676]"
          }`}
        >
          {isPicked && <span className="h-3 w-3 rounded-full bg-ink" />}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <b className="text-[15px] font-semibold">{address.label}</b>
            {address.isMain && (
              <span className="rounded-full bg-[#FFF1D6] px-2 py-px text-xs font-semibold text-[#8A3A00]">
                ที่อยู่หลัก
              </span>
            )}
          </span>
          <span className="text-sm text-ink-2">
            {address.address}
            {address.note && ` · ${address.note}`}
          </span>
        </span>
        <a
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="cursor-pointer text-sm font-semibold text-brand-text"
        >
          แก้ไข
        </a>
      </div>
    );
  };

  const footer = (
    <Button type="primary" block className="c-main" onClick={onUse}>
      ใช้ที่อยู่นี้
    </Button>
  );

  return (
    <CustomerLayout footer={footer}>
      <CustomerHeader title="ที่อยู่จัดส่ง" backTo={backTo} />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2.5 rounded-xl border border-solid border-line bg-white px-[14px] py-3">
          <EnvironmentFilled className="text-xl text-brand-deco" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[15px] font-semibold">ตำแหน่งจัดส่ง</span>
            <span className="text-[13px] text-ink-2">
              {isLocationOn
                ? "บันทึกจาก GPS มือถือแล้ว · ห่างร้าน 1.1 กม."
                : "ยังไม่ได้ใช้ตำแหน่ง ร้านจะดูจากที่อยู่ที่กรอก"}
            </span>
          </span>
          <a
            onClick={onLocation}
            className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-brand-text shadow-[0_2px_4px_rgba(28,27,25,0.12)]"
          >
            <AimOutlined />
            ใช้ตำแหน่งปัจจุบัน
          </a>
        </div>
        {addresses.length > 0 && (
          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-2 p-0 text-base font-semibold">
              ที่อยู่ที่บันทึกไว้
            </legend>
            {addresses.map((address) => renderAddress(address))}
          </fieldset>
        )}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">
            {editId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </span>
          {editId && (
            <a
              onClick={() => {
                setEditId(null);
                reset(EMPTY_FORM);
              }}
              className="cursor-pointer text-sm font-semibold text-brand-text"
            >
              เพิ่มที่อยู่ใหม่แทน
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <FormInput
            control={control}
            name="label"
            label="ชื่อเรียก"
            labelClassName={LABEL_CLASS}
            placeholder="หอพัก"
            className="h-11 border-[1px] text-[15px]"
          />
          <FormInput
            control={control}
            name="phone"
            label="เบอร์โทร"
            labelClassName={LABEL_CLASS}
            placeholder="089-111-2233"
            inputMode="numeric"
            maxLength={12}
            className="h-11 border-[1px] text-[15px]"
          />
        </div>
        <FormInput
          control={control}
          name="address"
          label="บ้านเลขที่ / ซอย / ถนน"
          labelClassName={LABEL_CLASS}
          placeholder="99/1 ซอยพุทธบูชา 44"
          className="h-11 border-[1px] text-[15px]"
        />
        <FormInput
          control={control}
          name="note"
          label="จุดสังเกต (ช่วยให้ส่งไม่ผิด)"
          labelClassName={LABEL_CLASS}
          placeholder="ตรงข้ามร้านซักผ้า"
          className="h-11 border-[1px] text-[15px]"
        />
        <div className="flex items-center justify-between">
          <Controller
            control={control}
            name="isMain"
            render={({ field }) => (
              <Checkbox
                className="c-check text-sm"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                ตั้งเป็นที่อยู่หลัก
              </Checkbox>
            )}
          />
          {editId && (
            <a
              onClick={onDelete}
              className="cursor-pointer py-2 text-sm font-semibold text-[#8A1C1C]"
            >
              ลบที่อยู่นี้
            </a>
          )}
        </div>
      </main>
    </CustomerLayout>
  );
};

export default Address;
