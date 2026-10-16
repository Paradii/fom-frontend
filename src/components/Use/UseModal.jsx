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
  footer,
  danger,
  wrapClassName = "sheet-modal",
  children,
}) => {
  const width = size === "small" ? 600 : 800;

  const defaultFooter = (
    <div className="flex items-center justify-end gap-2">
      {footerLeft && <div className="mr-auto">{footerLeft}</div>}
      {readOnly ? (
        <ButtonClose className="flex-1 md:flex-none" onClick={onHandleCancel} />
      ) : (
        <>
          <ButtonCancel
            className={footerLeft ? "" : "w-[110px] md:w-auto"}
            onClick={onHandleCancel}
            disabled={loading}
          />
          <ButtonSave
            className="flex-1 md:flex-none"
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
      footer={footer || defaultFooter}
      destroyOnClose
      centered
      wrapClassName={wrapClassName}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};

export default UseModal;
