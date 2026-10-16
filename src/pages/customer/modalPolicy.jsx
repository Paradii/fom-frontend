import { UseModal } from "@/components";

const ModalPolicy = ({ open, onHandleCancel, wrapClassName = "c-sheet" }) => {
  return (
    <UseModal
      open={open}
      onHandleCancel={onHandleCancel}
      title="นโยบายความเป็นส่วนตัว"
      size="small"
      wrapClassName={wrapClassName}
      readOnly
    >
      <div className="flex flex-col gap-2 text-base leading-[26px] text-ink-2">
        <p className="m-0">
          ระบบเก็บชื่อและรูปโปรไฟล์ LINE ที่อยู่จัดส่ง ตำแหน่ง
          และประวัติการสั่งซื้อ เพื่อค้นหาร้านใกล้คุณ ส่งอาหาร
          และแนะนำเมนูที่คุณน่าจะชอบ
        </p>
        <p className="m-0">
          ระบบไม่ส่งต่อข้อมูลให้ผู้อื่น ปิดการใช้ตำแหน่ง
          หรือขอลบข้อมูลได้ทุกเมื่อที่หน้าบัญชีของฉัน
        </p>
      </div>
    </UseModal>
  );
};

export default ModalPolicy;
