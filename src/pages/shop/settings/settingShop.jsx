import { Card, FormInput, FormTextArea } from "@/components";

const SettingShop = ({ control }) => {
  return (
    <Card title="ข้อมูลร้าน">
      <FormInput
        control={control}
        name="shopName"
        label="ชื่อร้าน"
        placeholder="ครัวป้าแดง"
      />
      <FormTextArea
        control={control}
        name="description"
        label="คำอธิบายร้าน"
        placeholder="อาหารตามสั่ง รสจัดจ้าน ทำสดทุกจาน"
      />
    </Card>
  );
};

export default SettingShop;
