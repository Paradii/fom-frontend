import { Card, FormInputNumber } from "@/components";
import { onlyDigits } from "@/utils/format";

const SettingDelivery = ({ control }) => {
  return (
    <Card title="การจัดส่ง">
      <div className="grid grid-cols-2 items-end gap-3">
        <FormInputNumber
          control={control}
          name="deliveryFee"
          label="ค่าจัดส่ง (บาท)"
          placeholder="20"
          min={0}
          precision={0}
          formatter={onlyDigits}
          parser={onlyDigits}
        />
        <FormInputNumber
          control={control}
          name="minOrder"
          label="สั่งขั้นต่ำ (บาท)"
          placeholder="60"
          min={0}
          precision={0}
          formatter={onlyDigits}
          parser={onlyDigits}
        />
      </div>
    </Card>
  );
};

export default SettingDelivery;
