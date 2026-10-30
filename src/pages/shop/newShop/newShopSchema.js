import * as yup from "yup";

export const newShopSchema = yup.object({
  shopName: yup
    .string()
    .trim()
    .required("กรุณาระบุชื่อร้าน")
    .max(100, "ชื่อร้านยาวได้ไม่เกิน 100 ตัวอักษร"),
  phone: yup
    .string()
    .required("กรุณาระบุเบอร์โทรร้าน")
    .test("phone", "ใส่เบอร์โทร 10 หลัก", (value) => {
      return String(value || "").replace(/\D/g, "").length === 10;
    }),
  address: yup
    .string()
    .trim()
    .required("กรุณาระบุที่อยู่ร้าน")
    .max(300, "ที่อยู่ยาวได้ไม่เกิน 300 ตัวอักษร"),
  promptPayId: yup
    .string()
    .required("กรุณาระบุหมายเลขพร้อมเพย์")
    .test("promptpay", "ใส่เบอร์โทร 10 หลัก หรือเลขบัตร 13 หลัก", (value) => {
      const digits = String(value || "").replace(/\D/g, "");
      return digits.length === 10 || digits.length === 13;
    }),
  accountName: yup.string().trim().required("กรุณาระบุชื่อบัญชี"),
  deliveryFee: yup
    .number()
    .nullable()
    .typeError("กรุณาระบุค่าส่ง")
    .required("กรุณาระบุค่าส่ง"),
});
