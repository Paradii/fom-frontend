import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import { FormInput } from "@/components";
import useNotify from "@/hooks/useNotify";
import LoginLayout from "@/layouts/LoginLayout";
import { fetchSaveShop } from "@/mock/mockData";
import { newShopSchema } from "./newShopSchema";

const EMPTY_FORM = {
  shopName: "",
  phone: "",
  promptPayId: "",
};

const NewShop = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const { control, handleSubmit } = useForm({
    defaultValues: EMPTY_FORM,
    resolver: yupResolver(newShopSchema),
  });

  const onSave = (values) => {
    const resp = fetchSaveShop({ actionType: "add", shop: values });
    if (resp.success) {
      navigate("/shop/orders");
      notify.success(`สร้างร้าน ${values.shopName} แล้ว`);
    }
  };

  return (
    <LoginLayout>
      <div>
        <h2 className="m-0 font-head text-2xl font-semibold">เพิ่มร้านค้า</h2>
        <p className="m-0 mt-2 text-sm text-ink-2">
          กรอกข้อมูลร้านเบื้องต้นเพื่อเริ่มรับคำสั่งซื้อ
          <br />
          เมนูและเวลาเปิดร้านตั้งค่าเพิ่มได้ภายหลัง
        </p>
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
      <Button
        type="primary"
        size="large"
        className="h-12 font-semibold"
        onClick={handleSubmit(onSave)}
      >
        สร้างร้านและเริ่มใช้งาน
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
