import { App } from "antd";

const useNotify = () => {
  const { modal, message } = App.useApp();
  const success = (content = "บันทึกข้อมูลเรียบร้อย") =>
    message.success(content);
  const error = (content = "เกิดข้อผิดพลาด กรุณาลองใหม่") =>
    modal.error({
      title: "ไม่สำเร็จ",
      content,
      okText: "ตกลง",
      centered: true,
    });
  const warning = (content) => message.warning(content);
  const confirm = ({ title, content, onOk, okText = "ยืนยัน", danger }) =>
    modal.confirm({
      title,
      content,
      onOk,
      okText,
      cancelText: "ยกเลิก",
      okButtonProps: { danger },
      centered: true,
    });
  return { success, error, warning, confirm };
};

export default useNotify;
