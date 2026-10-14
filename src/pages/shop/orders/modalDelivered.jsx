import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { UseModal } from "@/components";

const ModalDelivered = ({ modal, setModal, onSave }) => {
  const data = modal.data;

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { photo: null },
  });

  const photo = watch("photo");

  useEffect(() => {
    if (modal.open) reset({ photo: null });
  }, [modal.open]);

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onSubmitForm = (values) => {
    onSave(data, values.photo);
    onClose();
  };

  const onTakePhoto = (file, field) => {
    field.onChange({ file, url: URL.createObjectURL(file) });
    return false;
  };

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title={`ยืนยันส่งสำเร็จ #${data?.orderId}`}
      size="small"
      saveText="ยืนยันส่งสำเร็จ"
      saveDisabled={!photo}
      onSave={handleSubmit(onSubmitForm)}
    >
      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-medium">
              รูปหลักฐานการส่ง <span className="text-danger">*</span>
            </span>
            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <Upload
                  accept="image/*"
                  capture="environment"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={(file) => onTakePhoto(file, field)}
                  className="block"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-line bg-[#F3F2EE] text-ink-3 md:h-[104px] md:w-[104px]">
                      {photo ? (
                        <img
                          src={photo.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <CameraOutlined className="text-2xl" />
                          <span className="text-sm">ถ่ายรูป</span>
                        </>
                      )}
                    </div>
                    <Button type="primary" block className="md:hidden">
                      {photo ? "ถ่ายรูปใหม่" : "เปิดกล้องถ่ายรูป"}
                    </Button>
                  </div>
                </Upload>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 text-ink-2">
            <span>
              · เปิดกล้องถ่ายเท่านั้น ถ่ายอาหารหรือหน้าประตู ไม่ถ่ายหน้าคน
            </span>
            <span>
              · ระบบบันทึกเวลาและตำแหน่งตอนกดยืนยัน
              ร้านที่ส่งเองจึงควรกดจากมือถือตอนถึงที่ส่ง
            </span>
          </div>
          <div className="rounded-xl bg-brand-soft p-3 text-brand-text">
            รูปนี้ใช้เป็นหลักฐานของร้าน ถ้าลูกค้าแจ้งว่ายังไม่ได้รับของ
          </div>
          {!photo && (
            <span className="text-[#B4370F]">
              ต้องถ่ายรูปก่อน จึงกดยืนยันส่งสำเร็จได้
            </span>
          )}
        </div>
      )}
    </UseModal>
  );
};

export default ModalDelivered;
