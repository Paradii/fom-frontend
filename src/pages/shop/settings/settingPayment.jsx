import { Card, FormInput } from "@/components";

const SettingPayment = ({ control }) => {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          รับเงิน
          <span className="rounded-md bg-[#1E3A6E] px-2 py-0.5 font-body text-sm text-white">
            PromptPay
          </span>
        </span>
      }
    >
      <FormInput
        control={control}
        name="promptPayId"
        label="หมายเลขพร้อมเพย์ (เบอร์โทรหรือเลขบัตรประชาชน)"
        placeholder="0812345678"
        inputMode="numeric"
      />
      <FormInput
        control={control}
        name="accountName"
        label="ชื่อบัญชี (ใช้ตรวจสลิป)"
        placeholder="นางแดง ใจดี"
      />
      <div className="rounded-xl bg-[#FFF1D6] p-3 text-sm text-[#5C3D00]">
        เงินโอนเข้าบัญชีร้านโดยตรง ระบบไม่ได้ถือเงินแทนร้าน หากต้องคืนเงิน
        ร้านโอนคืนลูกค้าเอง
      </div>
    </Card>
  );
};

export default SettingPayment;
