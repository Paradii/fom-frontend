import { useEffect, useState } from "react";
import { FormGroup, UseModal } from "@/components";

const toInputValue = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const INPUT_CLASS =
  "h-[46px] w-full rounded-xl border border-solid border-[#E3E1DC] px-3 text-base";

const ModalDateRange = ({ modal, setModal, onSave }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const today = toInputValue(new Date());

  useEffect(() => {
    if (modal.open) {
      setFrom(toInputValue(modal.data.from));
      setTo(
        toInputValue(modal.data.to > new Date() ? new Date() : modal.data.to),
      );
      setError("");
    }
  }, [modal.open]);

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onSubmit = () => {
    if (!from || !to) {
      setError("เลือกวันที่ให้ครบทั้ง 2 ช่อง");
      return;
    }
    if (from > to) {
      setError("วันเริ่มต้องไม่เกินวันสิ้นสุด");
      return;
    }
    onSave(new Date(`${from}T00:00:00`), new Date(`${to}T00:00:00`));
    onClose();
  };

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title="เลือกช่วงวันที่"
      size="small"
      saveText="ดูยอดขาย"
      onSave={onSubmit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormGroup label="ตั้งแต่วันที่" htmlFor="report-from">
          <input
            id="report-from"
            type="date"
            value={from}
            max={today}
            onChange={(e) => setFrom(e.target.value)}
            className={INPUT_CLASS}
          />
        </FormGroup>
        <FormGroup label="ถึงวันที่" htmlFor="report-to">
          <input
            id="report-to"
            type="date"
            value={to}
            max={today}
            onChange={(e) => setTo(e.target.value)}
            className={INPUT_CLASS}
          />
        </FormGroup>
      </div>
      {error && <div className="mt-3 text-danger">{error}</div>}
    </UseModal>
  );
};

export default ModalDateRange;
