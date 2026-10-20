import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import { fetchSaveShop, mockShop } from "@/services/data";
import { settingSchema } from "./settingSchema";
import SettingShop from "./settingShop";
import SettingHours from "./settingHours";
import SettingDelivery from "./settingDelivery";
import SettingPayment from "./settingPayment";

const Setting = () => {
  const { success, error } = useNotify();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      openHours: mockShop.openHours,
    },
    resolver: yupResolver(settingSchema),
  });

  useEffect(() => {
    onSearchForm();
  }, []);

  const onSearchForm = () => {
    reset({
      shopName: mockShop.shopName,
      description: mockShop.description,
      openHours: mockShop.openHours.map((item) => ({ ...item })),
      deliveryFee: mockShop.deliveryFee,
      minOrder: mockShop.minOrder,
      promptPayId: mockShop.promptPayId,
      accountName: mockShop.accountName,
    });
  };

  const onSubmitForm = async (formValue) => {
    setIsSaving(true);
    const resp = await fetchSaveShop({
      actionType: "U",
      shop: {
        shopName: formValue.shopName.trim(),
        description: formValue.description,
        openHours: formValue.openHours,
        deliveryFee: formValue.deliveryFee,
        minOrder: formValue.minOrder,
        promptPayId: formValue.promptPayId,
        accountName: formValue.accountName.trim(),
      },
    });
    setIsSaving(false);
    if (resp.success) {
      success("บันทึกการตั้งค่าร้านเรียบร้อย");
      onSearchForm();
    } else {
      error(resp.message);
    }
  };

  return (
    <PagePattern
      title="ตั้งค่าร้าน"
      extra={
        <Button
          type="primary"
          loading={isSaving}
          onClick={handleSubmit(onSubmitForm)}
        >
          บันทึกการเปลี่ยนแปลง
        </Button>
      }
    >
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <SettingShop control={control} />
        <SettingHours control={control} openHours={mockShop.openHours} />
        <SettingDelivery control={control} />
        <SettingPayment control={control} />
      </div>
    </PagePattern>
  );
};

export default Setting;
