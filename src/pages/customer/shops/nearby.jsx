import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Input } from "antd";
import {
  CarOutlined,
  DownOutlined,
  EnvironmentOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FoodIcon } from "@/components";
import CustomerLayout from "@/layouts/CustomerLayout";
import { STATUS } from "@/components/StatusBadge";
import {
  SHOP_CHIPS,
  getActiveOrder,
  getShop,
  getShopMenus,
  loadAddresses,
  loadMyOrders,
  loadNearbyShops,
  mockAddresses,
  mockMe,
  mockNearbyShops,
} from "@/services/data";
import withLoad, { loadAll } from "@/utils/withLoad";

import ShopPills from "./shopPills";

const Nearby = () => {
  const navigate = useNavigate();
  const [chip, setChip] = useState("ทั้งหมด");
  const [keyword, setKeyword] = useState("");
  const activeOrder = getActiveOrder();
  const address = mockAddresses.find((a) => a.addressId === mockMe.addressId);

  const isMatch = (shop) => {
    const text = keyword.trim();
    if (!text) return true;
    if (shop.shopName.includes(text)) return true;
    return getShopMenus(shop.shopId).some((m) => m.menuName.includes(text));
  };

  const shops = mockNearbyShops
    .map((s) => getShop(s.shopId))
    .filter((s) => chip === "ทั้งหมด" || s.chip === chip)
    .filter((s) => isMatch(s));

  const renderShop = (shop) => {
    return (
      <a
        key={shop.shopId}
        onClick={() => shop.isOpen && navigate(`/c/shop/${shop.shopId}`)}
        className={`flex gap-3 rounded-2xl border border-solid border-line bg-white p-[13px] shadow-[0_2px_4px_rgba(28,27,25,0.06)] ${
          shop.isOpen ? "cursor-pointer" : "cursor-default opacity-60"
        }`}
      >
        <span
          className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-xl"
          style={{ background: shop.color }}
        >
          <FoodIcon size={34} color={shop.iconColor} />
        </span>
        <span className="flex min-w-0 flex-col justify-center gap-1">
          <span className="font-head text-[17px] font-semibold">
            {shop.shopName}
          </span>
          <span className="text-sm text-ink-2">
            {shop.categoryName}
            {shop.distance != null && ` · ${shop.distance} กม.`}
          </span>
          <ShopPills shop={shop} />
        </span>
      </a>
    );
  };

  return (
    <CustomerLayout nav="home">
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-0 border-b border-solid border-line bg-white px-4 pb-[13px] pt-4">
        <a
          onClick={() => navigate("/c/address/nearby")}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF6D6] text-lg text-brand-text">
            <EnvironmentOutlined />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xs text-ink-2">ส่งที่</span>
            <span className="flex items-center gap-1 text-[15px] font-semibold">
              <span className="truncate">
                {address
                  ? `${address.label} · ${address.address}`
                  : "เพิ่มที่อยู่จัดส่ง"}
              </span>
              <DownOutlined className="text-xs" />
            </span>
          </span>
        </a>
        <Input
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix={<SearchOutlined className="mr-1 text-xl text-ink-2" />}
          placeholder="ค้นหาร้านหรือเมนู"
          className="c-search"
        />
      </header>
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {SHOP_CHIPS.map((item) => {
            const isActive = item === chip;
            return (
              <a
                key={item}
                onClick={() => setChip(item)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-2 text-sm ${
                  isActive
                    ? "border-ink bg-ink text-white"
                    : "border-[#E3E1DC] bg-white"
                }`}
              >
                {item}
              </a>
            );
          })}
        </div>
        {activeOrder && (
          <a
            onClick={() => navigate(`/c/tracking/${activeOrder.orderId}`)}
            className="flex cursor-pointer items-center gap-2.5 rounded-[14px] bg-[#DFF3FA] px-[14px] py-3 text-[#0B4F6B]"
          >
            <CarOutlined className="text-[22px]" />
            <span className="flex flex-1 flex-col text-sm">
              <span className="font-semibold">
                คำสั่งซื้อ #{activeOrder.orderId}{" "}
                {STATUS[activeOrder.status].label}
              </span>
              แตะเพื่อดูสถานะ
            </span>
            <RightOutlined className="text-lg" />
          </a>
        )}
        <h1 className="text-xl font-semibold">ร้านใกล้คุณ</h1>
        <div className="flex flex-col gap-3">
          {shops.map((shop) => renderShop(shop))}
          {shops.length === 0 && (
            <Empty description="ไม่พบร้านหรือเมนูที่ค้นหา" />
          )}
        </div>
      </main>
    </CustomerLayout>
  );
};

export default withLoad(Nearby, () => loadAll(loadNearbyShops(), loadAddresses(), loadMyOrders()));
