import { mockCategories, mockTags } from "@/services/data";

export const DROPDOWNS = {
  menuCategory: {
    load: () =>
      mockCategories.map((c) => ({
        value: c.categoryId,
        label: c.categoryName,
      })),
  },
  tagTaste: {
    load: () =>
      mockTags
        .filter((t) => t.tagType === "taste")
        .map((t) => ({ value: t.tagId, label: t.tagName })),
  },
  tagIngredient: {
    load: () =>
      mockTags
        .filter((t) => t.tagType === "ingredient")
        .map((t) => ({ value: t.tagId, label: t.tagName })),
  },
  tagCooking: {
    load: () =>
      mockTags
        .filter((t) => t.tagType === "cooking_method")
        .map((t) => ({ value: t.tagId, label: t.tagName })),
  },
  menuStatus: {
    options: [
      { value: true, label: "เปิดขาย" },
      { value: false, label: "หมด" },
    ],
  },
  customerMinOrders: {
    options: [3, 5, 10].map((n) => ({ value: n, label: `${n} ครั้งขึ้นไป` })),
  },
};

export const getDropdown = (dataType) => {
  const dropdown = DROPDOWNS[dataType];
  if (!dropdown) return [];
  if (dropdown.options) return dropdown.options;
  return dropdown.load();
};
