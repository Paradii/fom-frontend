import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { CheckCircleFilled, EnvironmentOutlined } from "@ant-design/icons";
import { FormInput, FormInputNumber, FormTextArea } from "@/components";
import useNotify from "@/hooks/useNotify";
import LoginLayout from "@/layouts/LoginLayout";
import { fetchSaveShop, mockShop } from "@/mock/mockData";
import { onlyDigits } from "@/utils/format";
import { newShopSchema } from "./newShopSchema";

const EMPTY_FORM = {
  shopName: "",
  phone: "",
  address: "",
  promptPayId: "",
  accountName: "",
  deliveryFee: null,
};

const NewShop = () => {
  const navigate = useNavigate();
  const { success } = useNotify();
  const [isPinned, setIsPinned] = useState(false);
  const [isPinError, setIsPinError] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: EMPTY_FORM,
    resolver: yupResolver(newShopSchema),
  });

  const onPin = () => {
    setIsPinned(true);
    setIsPinError(false);
  };

  const onSave = (values) => {
    if (!isPinned) {
      setIsPinError(true);
      return;
    }
    const resp = fetchSaveShop({
      actionType: "request",
      shop: { ...values, isPinned: true },
    });
    if (resp.success) {
      success("ส่งคำขอเปิดร้านแล้ว รอผู้ดูแลระบบอนุมัติ");
      navigate("/shop/menus");
    }
  };

  const onInvalid = () => {
    if (!isPinned) setIsPinError(true);
  };

  return (
    <LoginLayout>
      <div>
        <h2 className="m-0 font-head text-2xl font-semibold">เพิ่มร้านค้า</h2>
        <p className="m-0 mt-2 text-sm leading-[22px] text-ink-2">
          กรอกข้อมูลร้านให้ครบ แล้วส่งให้ผู้ดูแลระบบตรวจสอบ
          ร้านจะเปิดรับคำสั่งซื้อได้หลังอนุมัติ
        </p>
      </div>
      <div className="flex flex-col gap-0.5 rounded-xl bg-bg p-3">
        <span className="text-sm text-ink-2">เจ้าของร้าน</span>
        <b>{mockShop.ownerName} (LINE)</b>
      </div>
      <FormInput
        control={control}
        name="shopName"
        label="ชื่อร้าน"
        required
        placeholder="ครัวป้าแดง สาขา 3"
        className="h-12"
      />
      <FormInput
        control={control}
        name="phone"
        label="เบอร์โทรร้าน"
        required
        placeholder="0812345678"
        inputMode="numeric"
        maxLength={12}
        className="h-12"
      />
      <FormTextArea
        control={control}
        name="address"
        label="ที่อยู่ร้าน"
        required
        placeholder="12/3 ซอยประชาอุทิศ 5 ต.บางมด อ.ทุ่งครุ กรุงเทพฯ"
      />
      <div className="flex flex-col gap-1.5">
        {isPinned ? (
          <div className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#E7F4EF] font-semibold text-[#0E6E5C]">
            <CheckCircleFilled />
            บันทึกตำแหน่งแล้ว
          </div>
        ) : (
          <Button
            size="large"
            icon={<EnvironmentOutlined />}
            className="h-12 font-semibold"
            danger={isPinError}
            onClick={onPin}
          >
            ปักหมุดตำแหน่งร้าน
          </Button>
        )}
        {isPinError && (
          <span className="text-sm text-[#B42318]">
            กรุณาปักหมุดตำแหน่งร้าน
          </span>
        )}
      </div>
      <FormInput
        control={control}
        name="promptPayId"
        label="พร้อมเพย์สำหรับรับเงิน"
        required
        placeholder="0812345678"
        inputMode="numeric"
        maxLength={17}
        className="h-12"
      />
      <FormInput
        control={control}
        name="accountName"
        label="ชื่อบัญชีพร้อมเพย์ (ใช้ตรวจสลิป)"
        required
        placeholder="นางแดง ใจดี"
        className="h-12"
      />
      <FormInputNumber
        control={control}
        name="deliveryFee"
        label="ค่าส่งต่อคำสั่งซื้อ (บาท)"
        required
        placeholder="15"
        min={0}
        precision={0}
        formatter={onlyDigits}
        parser={onlyDigits}
      />
      <Button
        type="primary"
        size="large"
        className="h-12 font-semibold"
        onClick={handleSubmit(onSave, onInvalid)}
      >
        ส่งคำขอเปิดร้าน
      </Button>
      <Button
        size="large"
        className="h-12 font-semibold"
        onClick={() => navigate(-1)}
      >
        ยกเลิก
      </Button>
    </LoginLayout>
  );
};

export default NewShop;
