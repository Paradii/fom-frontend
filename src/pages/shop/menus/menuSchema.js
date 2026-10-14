import * as yup from "yup";

export const menuDefaultValues = {
  menuName: "",
  price: null,
  categoryId: undefined,
  description: "",
  tasteIds: [],
  ingredientIds: [],
  cookingIds: [],
  image: null,
  isAvailable: true,
};

export const menuSchema = yup.object({
  menuName: yup
    .string()
    .trim()
    .required("กรุณาระบุชื่อเมนู")
    .max(100, "ชื่อเมนูยาวได้ไม่เกิน 100 ตัวอักษร"),
  price: yup
    .number()
    .nullable()
    .typeError("กรุณาระบุราคา")
    .required("กรุณาระบุราคา")
    .positive("ราคาต้องมากกว่า 0"),
  categoryId: yup.number().nullable().required("กรุณาเลือกหมวดหมู่"),
  description: yup.string().max(300, "คำบรรยายยาวได้ไม่เกิน 300 ตัวอักษร"),
  tasteIds: yup.array().min(1, "เลือกรสชาติอย่างน้อย 1 อย่าง"),
  ingredientIds: yup.array().min(1, "เลือกวัตถุดิบหลักอย่างน้อย 1 อย่าง"),
  cookingIds: yup.array().min(1, "เลือกวิธีปรุงอย่างน้อย 1 อย่าง"),
});

export const optionGroupDefaultValues = {
  groupName: "",
  isRequired: true,
  maxSelect: 1,
};

export const optionGroupSchema = yup.object({
  groupName: yup.string().trim().required("กรุณาระบุชื่อกลุ่ม"),
  maxSelect: yup
    .number()
    .typeError("กรุณาระบุจำนวน")
    .required("กรุณาระบุจำนวน")
    .min(1, "อย่างน้อย 1"),
});
