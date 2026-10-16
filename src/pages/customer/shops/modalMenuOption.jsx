import { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { FoodIcon } from "@/components";
import { formatPrice } from "@/utils/format";

const ModalMenuOption = ({ modal, setModal, shop, onAdd }) => {
  const menu = modal.data;
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!menu) return;
    const first = {};
    menu.optionGroups.forEach((group) => {
      first[group.id] = group.isRequired ? [group.options[0].optionName] : [];
    });
    setSelected(first);
    setQuantity(1);
    setNote("");
  }, [menu]);

  if (!menu) return null;

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  const onPick = (group, option) => {
    const current = selected[group.id] || [];
    const isPicked = current.includes(option.optionName);
    let next = current;
    if (group.maxSelect === 1) {
      next = [option.optionName];
      if (isPicked && !group.isRequired) next = [];
    } else if (isPicked) {
      next = current.filter((name) => name !== option.optionName);
    } else if (current.length < group.maxSelect) {
      next = [...current, option.optionName];
    }
    setSelected({ ...selected, [group.id]: next });
  };

  const options = [];
  menu.optionGroups.forEach((group) => {
    group.options.forEach((option) => {
      if (selected[group.id]?.includes(option.optionName)) {
        options.push(option);
      }
    });
  });

  let unitPrice = menu.price;
  options.forEach((option) => {
    unitPrice += option.extraPrice;
  });

  const onSubmit = () => {
    onAdd({
      menuId: menu.menuId,
      menuName: menu.menuName,
      price: menu.price,
      quantity: quantity,
      options: options,
      note: note.trim(),
    });
  };

  const renderMark = (group, isPicked) => {
    if (group.maxSelect === 1) {
      return (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-solid bg-white ${
            isPicked ? "border-ink" : "border-[#767676]"
          }`}
        >
          {isPicked && <span className="h-3 w-3 rounded-full bg-ink" />}
        </span>
      );
    }
    return (
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[2.5px] border border-solid text-xs text-white ${
          isPicked ? "border-ink bg-ink" : "border-[#767676] bg-white"
        }`}
      >
        {isPicked && <CheckOutlined />}
      </span>
    );
  };

  const renderGroup = (group) => {
    return (
      <fieldset key={group.id} className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 flex items-center gap-2 p-0">
          <span className="text-base font-semibold">{group.groupName}</span>
          {group.isRequired ? (
            <span className="rounded-full bg-[#FFF6D6] px-2 py-px text-xs font-semibold text-[#B4370F]">
              ต้องเลือก · สูงสุด {group.maxSelect}
            </span>
          ) : (
            <span className="rounded-full bg-[#F3F2EF] px-2 py-px text-xs font-semibold text-ink-2">
              ไม่บังคับ
            </span>
          )}
        </legend>
        {group.options.map((option) => {
          const isPicked = selected[group.id]?.includes(option.optionName);
          return (
            <a
              key={option.optionName}
              onClick={() => onPick(group, option)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border border-solid px-[13px] py-[11px] text-[15px] ${
                isPicked ? "border-brand-line bg-[#FFFCF0]" : "border-line"
              }`}
            >
              {renderMark(group, isPicked)}
              <span className="flex-1">{option.optionName}</span>
              <span className="text-ink-2">+฿{option.extraPrice}</span>
            </a>
          );
        })}
      </fieldset>
    );
  };

  return (
    <Modal
      open={modal.open}
      onCancel={onClose}
      footer={null}
      closable={false}
      destroyOnClose
      wrapClassName="menu-sheet"
    >
      <div
        className="relative flex h-[140px] shrink-0 items-center justify-center"
        style={{ background: shop.color }}
      >
        <FoodIcon size={64} color={shop.iconColor} />
        <a
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-xl"
        >
          <CloseOutlined />
        </a>
      </div>
      <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-5 pb-5 pt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3 font-head font-semibold">
            <h2 className="text-[22px] font-semibold">{menu.menuName}</h2>
            <span className="text-xl text-brand-text">
              {formatPrice(menu.price)}
            </span>
          </div>
          {menu.description && (
            <span className="text-sm text-ink-2">{menu.description}</span>
          )}
        </div>
        {menu.optionGroups.map((group) => renderGroup(group))}
        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold">หมายเหตุถึงร้าน</span>
          <Input
            value={note}
            maxLength={100}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ไม่ใส่ถั่วฝักยาว"
            className="h-[46px] border-[1px] text-[15px]"
          />
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-0 border-t border-solid border-line px-5 pb-7 pt-[13px]">
        <div className="flex items-center gap-1 rounded-full bg-[#FFF6D6] p-1">
          <a
            aria-label="ลดจำนวน"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg"
          >
            <MinusOutlined />
          </a>
          <span className="min-w-[24px] px-1.5 text-center text-[17px] font-semibold">
            {quantity}
          </span>
          <a
            aria-label="เพิ่มจำนวน"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand text-lg"
          >
            <PlusOutlined />
          </a>
        </div>
        <Button
          type="primary"
          className="c-main flex-1"
          disabled={!shop.isOpen}
          onClick={onSubmit}
        >
          ใส่ตะกร้า · {formatPrice(unitPrice * quantity)}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalMenuOption;
