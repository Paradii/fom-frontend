import { Modal } from "antd";
import { ButtonCancel, ButtonClose, ButtonSave } from "../Button";

const UseModal = ({
  open,
  onHandleCancel,
  title,
  size = "medium",
  onSave,
  loading,
  saveDisabled,
  saveText = "บันทึก",
  readOnly,
  footerLeft,
  danger,
  children,
}) => {
  const width = size === "small" ? 600 : 800;

  const footer = (
    <div className="flex items-center justify-end gap-2">
      {footerLeft && <div className="mr-auto">{footerLeft}</div>}
      {readOnly ? (
        <ButtonClose onClick={onHandleCancel} />
      ) : (
        <>
          <ButtonCancel onClick={onHandleCancel} disabled={loading} />
          <ButtonSave
            text={saveText}
            onClick={onSave}
            loading={loading}
            disabled={saveDisabled}
            danger={danger}
          />
        </>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onHandleCancel}
      title={title}
      width={width}
      footer={footer}
      destroyOnClose
      centered
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};

export default UseModal;
