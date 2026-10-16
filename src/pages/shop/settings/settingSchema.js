import * as yup from "yup";

export const settingSchema = yup.object({
  shopName: yup
    .string()
    .trim()
    .required("กรุณาระบุชื่อร้าน")
    .max(100, "ชื่อร้านยาวได้ไม่เกิน 100 ตัวอักษร"),
  description: yup.string().max(300, "คำอธิบายยาวได้ไม่เกิน 300 ตัวอักษร"),
  deliveryFee: yup
    .number()
    .nullable()
    .typeError("กรุณาระบุค่าจัดส่ง")
    .required("กรุณาระบุค่าจัดส่ง"),
  minOrder: yup
    .number()
    .nullable()
    .typeError("กรุณาระบุยอดขั้นต่ำ")
    .required("กรุณาระบุยอดขั้นต่ำ"),
  promptPayId: yup
    .string()
    .required("กรุณาระบุหมายเลขพร้อมเพย์")
    .test("promptpay", "ใส่เบอร์โทร 10 หลัก หรือเลขบัตร 13 หลัก", (value) => {
      const digits = String(value || "").replace(/\D/g, "");
      return digits.length === 10 || digits.length === 13;
    }),
  accountName: yup.string().trim().required("กรุณาระบุชื่อบัญชี"),
});
