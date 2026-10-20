import { useEffect, useRef } from "react";
import { onDataChange } from "@/services/data";

// เรียก callback ทุกครั้งที่ชั้นข้อมูลโหลดหรือบันทึกเสร็จ ใช้กับหน้าที่คัดลอก store มาเก็บใน state
const useDataChange = (callback) => {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => onDataChange(() => ref.current()), []);
};

export default useDataChange;
