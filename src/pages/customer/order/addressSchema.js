import * as yup from "yup";

export const addressSchema = yup.object({
  label: yup
    .string()
    .trim()
    .required("กรุณาตั้งชื่อเรียก")
    .max(30, "ชื่อเรียกยาวได้ไม่เกิน 30 ตัวอักษร"),
  phone: yup
    .string()
    .required("กรุณาระบุเบอร์โทร")
    .test("phone", "ใส่เบอร์โทร 10 หลัก", (value) => {
      return String(value || "").replace(/\D/g, "").length === 10;
    }),
  address: yup
    .string()
    .trim()
    .required("กรุณาระบุบ้านเลขที่ ซอย ถนน")
    .max(200, "ที่อยู่ยาวได้ไม่เกิน 200 ตัวอักษร"),
  note: yup.string().max(100, "จุดสังเกตยาวได้ไม่เกิน 100 ตัวอักษร"),
  isMain: yup.boolean(),
});
