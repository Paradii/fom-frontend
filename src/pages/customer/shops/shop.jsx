import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty } from "antd";
import { BulbOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { FoodIcon } from "@/components";
import useNotify from "@/hooks/useNotify";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  cartCount,
  cartTotal,
  fetchSaveCart,
  getRecommendMenus,
  getShop,
  getShopMenus,
  mockCart,
} from "@/mock/mockData";
import { formatPrice } from "@/utils/format";
import ModalMenuOption from "./modalMenuOption";
import ShopPills from "./shopPills";

const Shop = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const { shopId } = useParams();
  const shop = getShop(Number(shopId));
  const menus = shop ? getShopMenus(shop.shopId) : [];
  const recommends = shop ? getRecommendMenus(shop.shopId) : [];
  const categories = [];
  menus.forEach((menu) => {
    if (!categories.includes(menu.categoryName)) {
      categories.push(menu.categoryName);
    }
  });
  const [category, setCategory] = useState(categories[0]);
  const [modal, setModal] = useState({ open: false, data: null });
  const [cart, setCart] = useState({ count: cartCount(), total: cartTotal() });

  if (!shop) {
    return (
      <CustomerLayout className="justify-center">
        <Empty description="ไม่พบร้านนี้" />
      </CustomerLayout>
    );
  }

  const isMyCart = mockCart.shopId === shop.shopId && cart.count > 0;

  const onOpenMenu = (menu) => {
    if (!menu.isAvailable || !shop.isOpen) return;
    setModal({ open: true, data: menu });
  };

  const addToCart = (item) => {
    fetchSaveCart({ actionType: "add", shopId: shop.shopId, item: item });
    setCart({ count: cartCount(), total: cartTotal() });
    setModal({ ...modal, open: false });
    notify.success(`ใส่ ${item.menuName} ลงตะกร้าแล้ว`);
  };

  const onAdd = (item) => {
    const isOtherShop = mockCart.shopId && mockCart.shopId !== shop.shopId;
    if (isOtherShop && mockCart.items.length > 0) {
      notify.confirm({
        title: "เริ่มตะกร้าใหม่?",
        content: `ตะกร้ามีเมนูจาก ${getShop(mockCart.shopId).shopName} อยู่ ถ้าใส่เมนูนี้ เมนูเดิมจะถูกลบ`,
        okText: "เริ่มตะกร้าใหม่",
        onOk: () => addToCart(item),
      });
      return;
    }
    addToCart(item);
  };

  const renderRecommend = (menu) => {
    return (
      <a
        key={menu.menuId}
        onClick={() => onOpenMenu(menu)}
        className="relative flex w-[142px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[14px] border border-solid border-[#FFE1A8] bg-[#FFFBEB]"
      >
        <span className="flex h-[84px] items-center justify-center bg-[#FFF1D6]">
          <FoodIcon size={30} color={shop.iconColor} />
        </span>
        <span className="flex flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
          <span className="truncate text-sm font-semibold">
            {menu.menuName}
          </span>
          <span className="text-[15px] font-semibold text-brand-text">
            {formatPrice(menu.price)}
          </span>
        </span>
        <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm">
          <PlusOutlined />
        </span>
      </a>
    );
  };

  const renderMenu = (menu) => {
    return (
      <a
        key={menu.menuId}
        onClick={() => onOpenMenu(menu)}
        className={`flex items-center gap-3 border-0 border-b border-solid border-[#F3F2EF] py-3 ${
          menu.isAvailable ? "cursor-pointer" : "cursor-default opacity-55"
        }`}
      >
        <span
          className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl"
          style={{ background: shop.color }}
        >
          <FoodIcon size={30} color={shop.iconColor} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-semibold">{menu.menuName}</span>
          {menu.description && (
            <span className="text-[13px] text-ink-2">{menu.description}</span>
          )}
          {menu.isAvailable ? (
            <span className="text-[15px] font-semibold text-brand-text">
              {formatPrice(menu.price)}
            </span>
          ) : (
            <span className="text-[13px] font-semibold text-ink-2">
              หมดวันนี้
            </span>
          )}
        </span>
        {menu.isAvailable && shop.isOpen && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-base">
            <PlusOutlined />
          </span>
        )}
      </a>
    );
  };

  const footer = isMyCart && (
    <Button
      type="primary"
      block
      className="c-main flex items-center px-4"
      onClick={() => navigate("/c/cart")}
    >
      <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-white px-2 text-sm text-brand-text">
        {cart.count}
      </span>
      <span className="flex-1 text-base">ดูตะกร้า</span>
      <span className="text-base">{formatPrice(cart.total)}</span>
    </Button>
  );

  return (
    <CustomerLayout footer={footer}>
      <div
        className="relative flex h-[168px] shrink-0 items-center justify-center"
        style={{ background: shop.color }}
      >
        <FoodIcon size={72} color={shop.iconColor} />
        <a
          aria-label="กลับ"
          onClick={() => navigate("/c/nearby")}
          className="absolute left-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg shadow-[0_2px_6px_rgba(28,27,25,0.15)]"
        >
          <LeftOutlined />
        </a>
        <span className="absolute bottom-8 right-4 text-xs text-[#6B4500]">
          รูปปกร้าน
        </span>
      </div>
      <div className="relative z-[1] mx-4 -mt-7 flex flex-col gap-1.5 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(28,27,25,0.08)]">
        <h1 className="text-[22px] font-semibold">{shop.shopName}</h1>
        <span className="text-sm text-ink-2">
          {shop.categoryName} · เปิด {shop.openTime}–{shop.closeTime} ·{" "}
          {shop.distance} กม.
        </span>
        <ShopPills shop={shop} />
      </div>
      {recommends.length > 0 && (
        <section className="flex flex-col gap-3 px-4 pt-5">
          <div className="flex items-center gap-1.5">
            <BulbOutlined className="text-xl text-brand-deco" />
            <h2 className="flex-1 text-lg font-semibold">แนะนำสำหรับคุณ</h2>
            <span className="text-xs text-ink-2">จากเมนูที่คุณเคยสั่ง</span>
          </div>
          <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {recommends.map((menu) => renderRecommend(menu))}
          </div>
        </section>
      )}
      <div className="mt-4 flex gap-5 overflow-x-auto border-0 border-b border-solid border-line px-4">
        {categories.map((item) => {
          const isActive = item === category;
          return (
            <a
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 cursor-pointer whitespace-nowrap border-0 border-b-[3px] border-solid pb-[11px] pt-2.5 text-[15px] ${
                isActive
                  ? "border-brand-line font-semibold text-brand-text"
                  : "border-transparent text-ink-2"
              }`}
            >
              {item}
            </a>
          );
        })}
      </div>
      <main className="flex flex-col px-4 pb-6">
        {menus
          .filter((menu) => menu.categoryName === category)
          .map((menu) => renderMenu(menu))}
      </main>
      <ModalMenuOption
        modal={modal}
        setModal={setModal}
        shop={shop}
        onAdd={onAdd}
      />
    </CustomerLayout>
  );
};

export default Shop;
