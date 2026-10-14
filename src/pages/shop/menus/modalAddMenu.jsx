import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { PictureOutlined, UploadOutlined } from "@ant-design/icons";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import {
  Card,
  FormDropdown,
  FormInput,
  FormInputNumber,
  FormSwitch,
  FormTextArea,
  ButtonAdd,
  ButtonCancel,
  ButtonDelete,
  ButtonEdit,
  ButtonSave,
} from "@/components";
import {
  fetchSaveMenu,
  fetchSaveTagRequest,
  mockMenus,
  mockTagRequests,
  mockTags,
} from "@/mock/mockData";
import { formatPrice } from "@/utils/format";
import ModalAddOption from "./modalAddOption";
import ModalRequestTag, { TYPE_OPTIONS } from "./modalRequestTag";
import { menuDefaultValues, menuSchema } from "./menuSchema";

const MAX_MB = 5;

const ImageCard = ({ control, onInvalid }) => {
  const onChooseImage = (e, field) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      onInvalid("รองรับเฉพาะไฟล์ JPG หรือ PNG");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onInvalid(`ไฟล์ต้องไม่เกิน ${MAX_MB} MB`);
      return;
    }
    field.onChange({ file, url: URL.createObjectURL(file) });
  };

  return (
    <Controller
      control={control}
      name="image"
      render={({ field }) => (
        <Card title="รูปเมนู">
          <label className="relative flex h-[180px] cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[14px] border-2 border-dashed border-[#FFD966] bg-[#FFFCF0] text-center text-sm text-brand-text">
            {field.value?.url ? (
              <>
                <img
                  src={field.value.url}
                  alt="รูปเมนู"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2.5 py-1 text-sm font-semibold">
                  เปลี่ยนรูป
                </span>
              </>
            ) : (
              <>
                <UploadOutlined className="text-[28px]" />
                <b>อัปโหลดรูป</b>
                <span className="text-sm text-ink-2">
                  JPG หรือ PNG ไม่เกิน {MAX_MB} MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => onChooseImage(e, field)}
              className="absolute h-px w-px opacity-0"
            />
          </label>
          {field.value?.url && (
            <button
              type="button"
              onClick={() => field.onChange(null)}
              className="cursor-pointer self-center border-0 bg-transparent font-body text-sm text-ink-2 underline"
            >
              ลบรูป
            </button>
          )}
        </Card>
      )}
    />
  );
};

const PreviewCard = ({ formValue }) => {
  const tasteNames = mockTags
    .filter((t) => (formValue.tasteIds || []).includes(t.tagId))
    .map((t) => t.tagName)
    .join(" · ");

  return (
    <Card title="ตัวอย่างที่ลูกค้าเห็น">
      <div className="flex gap-3 rounded-xl border border-solid border-line p-3">
        {formValue.image?.url ? (
          <img
            src={formValue.image.url}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FDE8DD] text-2xl text-brand-deco">
            <PictureOutlined />
          </div>
        )}
        <div className="min-w-0">
          <b>{formValue.menuName || "ชื่อเมนู"}</b>
          <div className="truncate text-sm text-ink-2">
            {formValue.description || "คำบรรยายเมนู"}
          </div>
          {tasteNames && (
            <div className="text-sm text-danger">{tasteNames}</div>
          )}
          <b className="text-brand-text">{formatPrice(formValue.price)}</b>
        </div>
      </div>
    </Card>
  );
};

const ModalAddMenu = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const actionCode = menuId === "new" ? "A" : "U";
  const { success, error, confirm } = useNotify();
  const [optionGroups, setOptionGroups] = useState([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagRequests, setTagRequests] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    data: null,
    index: null,
    actionCode: null,
  });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: menuDefaultValues,
    resolver: yupResolver(menuSchema),
  });

  const formValue = watch();

  useEffect(() => {
    if (actionCode === "U") {
      const menu = mockMenus.find((m) => m.menuId === Number(menuId));
      if (!menu) {
        error("ไม่พบเมนูนี้ อาจถูกลบไปแล้ว");
        backToList();
        return;
      }
      reset({
        menuName: menu.menuName,
        price: menu.price,
        categoryId: menu.categoryId,
        description: menu.description,
        tasteIds: filterTag(menu.tagIds, "taste"),
        ingredientIds: filterTag(menu.tagIds, "ingredient"),
        cookingIds: filterTag(menu.tagIds, "cooking_method"),
        image: menu.imageUrl ? { url: menu.imageUrl } : null,
        isAvailable: menu.isAvailable,
      });
      setOptionGroups(menu.optionGroups);
      setTagRequests(mockTagRequests.filter((r) => r.menuId === menu.menuId));
    }
  }, [menuId]);

  const filterTag = (tagIds, tagType) => {
    return tagIds.filter((id) => {
      const tag = mockTags.find((t) => t.tagId === id);
      return tag && tag.tagType === tagType;
    });
  };

  const backToList = () => {
    navigate("/shop/menus");
  };

  const onSubmitForm = (formValue) => {
    const payload = {
      menuName: formValue.menuName,
      price: formValue.price,
      categoryId: formValue.categoryId,
      description: formValue.description,
      tagIds: [
        ...formValue.tasteIds,
        ...formValue.ingredientIds,
        ...formValue.cookingIds,
      ],
      optionGroups: optionGroups,
      imageUrl: formValue.image?.url || "",
      isAvailable: formValue.isAvailable,
    };
    const resp = fetchSaveMenu({
      actionType: actionCode,
      menuId: Number(menuId),
      menu: payload,
    });
    if (resp.success) {
      success("บันทึกเมนูเรียบร้อย");
      backToList();
    }
  };

  const onDelete = () => {
    confirm({
      title: "ลบเมนูนี้?",
      content: "ลบแล้วลูกค้าจะไม่เห็นเมนูนี้อีก",
      okText: "ลบเมนู",
      danger: true,
      onOk: () => {
        const resp = fetchSaveMenu({
          actionType: "D",
          menuId: Number(menuId),
        });
        if (resp.success) {
          success("ลบเมนูเรียบร้อย");
        } else {
          error("ไม่พบเมนูนี้ อาจถูกลบไปแล้ว");
        }
        backToList();
      },
    });
  };

  const onSaveGroup = (group, index) => {
    if (index === null) {
      setOptionGroups([...optionGroups, group]);
    } else {
      setOptionGroups(optionGroups.map((g, i) => (i === index ? group : g)));
    }
  };

  const onDeleteGroup = (index) => {
    setOptionGroups(optionGroups.filter((g, i) => i !== index));
  };

  const onSaveTagRequest = (formValue) => {
    const request = { ...formValue, menuId: Number(menuId) || null };
    const resp = fetchSaveTagRequest(request);
    if (resp.success) {
      setTagRequests([...tagRequests, request]);
      success("ส่งคำขอแท็กใหม่แล้ว รอผู้ดูแลระบบตรวจ");
    }
  };

  const getTypeLabel = (tagType) => {
    return TYPE_OPTIONS.find((t) => t.value === tagType)?.label;
  };

  return (
    <PagePattern
      title={actionCode === "A" ? "เพิ่มเมนู" : "แก้ไขเมนู"}
      onBack={backToList}
    >
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-4">
          <Card title="ข้อมูลเมนู">
            <div className="grid gap-3 md:grid-cols-3">
              <FormInput
                control={control}
                name="menuName"
                label="ชื่อเมนู"
                placeholder="ข้าวกะเพราหมูสับ"
                required
              />
              <FormInputNumber
                control={control}
                name="price"
                label="ราคา (บาท)"
                placeholder="55"
                required
                min={0}
              />
              <FormDropdown
                control={control}
                name="categoryId"
                label="หมวดหมู่"
                placeholder="ข้าว"
                required
                dataType="menuCategory"
                hint="ร้านตั้งชื่อเองได้ ใช้จัดหน้าร้านเท่านั้น ไม่ใช้เทรน AI"
              />
            </div>
            <FormTextArea
              control={control}
              name="description"
              label="คำบรรยาย"
              placeholder="ใบกะเพราสด ผัดไฟแรง หอมพริกกระเทียม"
              maxLength={300}
            />
          </Card>

          <Card
            title="คุณลักษณะสำหรับระบบแนะนำเมนู"
            subtitle="เลือกให้ตรงกับเมนู ระบบจะใช้แนะนำเมนูให้ลูกค้าที่ชอบแนวเดียวกัน"
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <FormDropdown
                control={control}
                name="tasteIds"
                label="รสชาติ"
                placeholder="เผ็ด, เค็ม"
                labelNote="เลือกได้หลายอย่าง"
                required
                dataType="tagTaste"
                mode="multiple"
              />
              <FormDropdown
                control={control}
                name="ingredientIds"
                label="วัตถุดิบหลัก"
                placeholder="หมู, ไข่"
                labelNote="เลือกได้หลายอย่าง"
                required
                dataType="tagIngredient"
                mode="multiple"
              />
              <FormDropdown
                control={control}
                name="cookingIds"
                label="วิธีปรุง"
                placeholder="ผัด"
                labelNote="เลือกได้หลายอย่าง"
                required
                dataType="tagCooking"
                mode="multiple"
              />
            </div>
            <ButtonAdd
              type="link"
              text="ไม่มีแท็กที่ต้องการ? ขอเพิ่มแท็กใหม่"
              className="self-start px-0"
              onClick={() => setIsTagModalOpen(true)}
            />
            {tagRequests.map((request) => (
              <div
                key={`${request.tagType}-${request.tagName}`}
                className="rounded-xl border border-solid border-[#F5DFA0] bg-brand-soft p-3 text-sm text-brand-text"
              >
                <b>คำขอแท็กใหม่</b> "{request.tagName}" (
                {getTypeLabel(request.tagType)}) · รอผู้ดูแลระบบตรวจ
                ระหว่างนี้เมนูยังใช้แท็กที่เลือกไว้ตามปกติ
              </div>
            ))}
          </Card>

          <Card
            title="กลุ่มตัวเลือก"
            extra={
              <ButtonAdd
                type="default"
                text="เพิ่มกลุ่ม"
                onClick={() =>
                  setModal({
                    open: true,
                    data: null,
                    index: null,
                    actionCode: "A",
                  })
                }
              />
            }
          >
            {optionGroups.length === 0 && (
              <p className="m-0 text-sm text-ink-3">ยังไม่มีกลุ่มตัวเลือก</p>
            )}
            {optionGroups.map((group, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-xl bg-[#F7F6F3] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <b>{group.groupName}</b>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ink-2">
                      {group.isRequired
                        ? `ต้องเลือก · สูงสุด ${group.maxSelect}`
                        : "ไม่บังคับ"}
                    </span>
                    <ButtonEdit
                      size="small"
                      onClick={() =>
                        setModal({
                          open: true,
                          data: group,
                          index: index,
                          actionCode: "U",
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <span
                      key={option.optionName}
                      className="rounded-lg border border-solid border-line bg-white px-3 py-1"
                    >
                      {option.optionName} +{formatPrice(option.extraPrice)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          <ImageCard control={control} onInvalid={error} />
          <PreviewCard formValue={formValue} />
          <Card>
            <div className="flex items-center justify-between font-medium">
              เปิดขายเมนูนี้
              <FormSwitch control={control} name="isAvailable" />
            </div>
          </Card>
          <div className="flex gap-2">
            <ButtonCancel className="h-12 flex-1" onClick={backToList} />
            <ButtonSave
              text="บันทึกเมนู"
              className="h-12 flex-[2]"
              onClick={handleSubmit(onSubmitForm)}
            />
          </div>
          {actionCode === "U" && (
            <ButtonDelete
              text="ลบเมนูนี้"
              className="h-11"
              onClick={onDelete}
            />
          )}
        </div>
      </div>

      <ModalAddOption
        modal={modal}
        setModal={setModal}
        onSave={onSaveGroup}
        onDelete={onDeleteGroup}
      />
      <ModalRequestTag
        open={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSave={onSaveTagRequest}
      />
    </PagePattern>
  );
};

export default ModalAddMenu;
