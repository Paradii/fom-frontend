import { CheckOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { mockAccounts, mockMe } from "@/mock/mockData";

const SHOP_COLORS = [
  "bg-[#FFF6D6] text-brand-text",
  "bg-[#E7F4EE] text-[#0E6E5C]",
];

const CustomerAccount = ({ isSwitch, onSelect, onAddShop }) => {
  const shops = mockAccounts.filter((a) => a.accountType === "shop");

  const getShopNote = (shop) => {
    if (shop.status === "pending") return "รอผู้ดูแลระบบอนุมัติ";
    if (isSwitch) return "แตะเพื่อสลับไปหน้าร้านค้า";
    if (shop.newOrderCount > 0) return "คำสั่งซื้อใหม่";
    return shop.isOpen ? "เปิดรับคำสั่งซื้อ" : "ปิดรับคำสั่งซื้อ";
  };

  const cardClass = (isActive) => {
    if (isActive) {
      return "cursor-pointer border-2 border-brand bg-[#FFF6D6] px-[13px] py-[11px]";
    }
    return "cursor-pointer border border-line bg-white px-[14px] py-3";
  };

  const renderCard = ({
    key,
    name,
    letter,
    pill,
    note,
    color,
    badge,
    isActive,
  }) => {
    const noteText = <span className="text-[13px] text-ink-2">{note}</span>;
    return (
      <a
        key={key}
        onClick={() => !isActive && onSelect(key)}
        className={`flex items-center gap-3 rounded-[14px] border-solid ${cardClass(isActive)}`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-head text-lg font-semibold ${color}`}
        >
          {letter}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-base font-semibold">{name}</span>
            {isSwitch && pill}
          </span>
          {isSwitch ? (
            noteText
          ) : (
            <span className="flex items-center gap-1.5">
              {pill}
              {noteText}
            </span>
          )}
        </span>
        {badge > 0 && (
          <span className="rounded-full bg-[#B42318] px-2 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        {isActive && <CheckOutlined className="text-xl" />}
        {!isActive && <RightOutlined className="text-base text-ink-2" />}
      </a>
    );
  };

  const customerPill = (
    <span className="rounded-full bg-[#FFF1D6] px-2 text-xs font-semibold text-[#8A3A00]">
      ลูกค้า
    </span>
  );

  const shopPill = (
    <span className="shrink-0 rounded-full bg-[#FFF6D6] px-2 text-xs font-semibold text-brand-text">
      ร้านค้า
    </span>
  );

  return (
    <div className="flex flex-col gap-3">
      {renderCard({
        key: "customer",
        name: mockMe.displayName,
        letter: mockMe.displayName.charAt(0),
        pill: customerPill,
        note: isSwitch ? "ใช้งานอยู่ตอนนี้" : "สั่งอาหารจากร้านใกล้บ้าน",
        color: isSwitch
          ? "bg-[#FFE8A8] text-[#8A3A00]"
          : "bg-[#FFF1D6] text-[#8A3A00]",
        isActive: isSwitch,
      })}
      {shops.map((shop, index) => {
        return renderCard({
          key: shop.accountId,
          name: shop.accountName,
          letter: shop.accountName.charAt(0),
          pill: shopPill,
          note: getShopNote(shop),
          color: SHOP_COLORS[index % 2],
          badge: isSwitch ? 0 : shop.newOrderCount,
        });
      })}
      {onAddShop && (
        <a
          onClick={onAddShop}
          className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-brand-line bg-white px-[14px] py-3"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF6D6] text-lg text-brand-text">
            <PlusOutlined />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-base font-semibold">เพิ่มร้านค้า</span>
            <span className="text-[13px] text-ink-2">
              เปิดร้านใหม่ด้วยบัญชี LINE นี้
            </span>
          </span>
          <RightOutlined className="text-base text-ink-2" />
        </a>
      )}
    </div>
  );
};

export default CustomerAccount;
