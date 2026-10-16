import {
  CheckOutlined,
  LoginOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { mockAccounts, mockShop } from "@/mock/mockData";

const TYPE_TEXT = {
  shop: "ร้านค้า",
  customer: "ลูกค้า",
};

const ShopAccount = ({
  title,
  subtitle,
  className = "",
  accountId,
  isOpen,
  onSwitch,
  onAddShop,
  onLogout,
}) => {
  const isDesktop = window.innerWidth >= 1024;

  const getNote = (account) => {
    if (account.accountType === "customer" && isDesktop) {
      return "ใช้ได้ในแอป LINE บนโทรศัพท์";
    }
    if (account.accountType === "customer") return "เปิดในแอป LINE";
    if (account.newOrderCount > 0 && account.accountId !== accountId) {
      return "คำสั่งซื้อใหม่";
    }
    if (account.accountId === accountId) {
      return isOpen ? "เปิดรับคำสั่งซื้อ" : "ปิดรับคำสั่งซื้อ";
    }
    return account.isOpen ? "เปิดรับคำสั่งซื้อ" : "ปิดรับคำสั่งซื้อ";
  };

  const getCardClass = (isCurrent, isLocked) => {
    if (isCurrent) return "cursor-pointer border-2 border-brand bg-brand-soft";
    if (isLocked)
      return "cursor-not-allowed border border-line bg-bg opacity-60";
    return "cursor-pointer border border-line bg-white hover:border-brand-line";
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div>
        <b className={`font-head ${subtitle ? "text-2xl" : "text-xl"}`}>
          {title}
        </b>
        <div className="mt-2 text-sm text-ink-2">
          {subtitle || `บัญชี LINE: ${mockShop.ownerName}`}
        </div>
      </div>
      {mockAccounts.map((account) => {
        const isCurrent = account.accountId === accountId;
        const isShop = account.accountType === "shop";
        const isLastShop = account.accountId === mockShop.accountId;
        const isLocked = !isShop && isDesktop;
        return (
          <div
            key={account.accountId}
            aria-disabled={isLocked}
            className={`flex items-center gap-3 rounded-xl border-solid p-3 ${getCardClass(isCurrent, isLocked)}`}
            onClick={() => !isLocked && onSwitch(account)}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                isShop && !isLastShop
                  ? "bg-[#E7F4EF] text-[#0E6E5C]"
                  : "bg-[#FFE7B3] text-brand-text"
              }`}
            >
              {account.accountName[0]}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <b className="break-words">{account.accountName}</b>
              <span className="flex items-center gap-2 text-sm text-ink-2">
                <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 font-semibold text-brand-text">
                  {TYPE_TEXT[account.accountType]}
                </span>
                <span className="whitespace-nowrap text-[13px]">
                  {getNote(account)}
                </span>
              </span>
            </div>
            {!isCurrent && account.newOrderCount > 0 && (
              <span className="grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[#B42318] px-1 text-xs font-semibold text-white">
                {account.newOrderCount}
              </span>
            )}
            {isCurrent && <CheckOutlined />}
            {!isCurrent && !isLocked && <RightOutlined />}
          </div>
        );
      })}
      {onAddShop && (
        <div
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand-line bg-white p-3 hover:border-brand"
          onClick={onAddShop}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg text-brand-text">
            <PlusOutlined />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <b>เพิ่มร้านค้า</b>
            <span className="text-[13px] text-ink-2">
              เปิดร้านใหม่ด้วยบัญชี LINE นี้
            </span>
          </div>
          <RightOutlined />
        </div>
      )}
      {onLogout && (
        <div className="md:border-0 md:border-t md:border-solid md:border-line md:pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-3 py-2 text-[15px] font-semibold text-[#B42318] hover:bg-[#FDE7E7]"
          >
            <LoginOutlined />
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopAccount;
