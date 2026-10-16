const ShopPills = ({ shop }) => {
  if (!shop.isOpen) {
    return (
      <div className="flex flex-wrap gap-1.5 text-[13px]">
        <span className="rounded-full bg-[#EFEEEB] px-2.5 py-0.5 text-ink-2">
          ปิดอยู่ · เปิด {shop.openTime}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5 text-[13px]">
      <span className="rounded-full bg-[#DDF5EE] px-2.5 py-0.5 font-semibold text-[#0E6E5C]">
        เปิดอยู่
      </span>
      <span className="rounded-full bg-[#FFF1D6] px-2.5 py-0.5 text-[#8A3A00]">
        ค่าส่ง ฿{shop.deliveryFee}
      </span>
      <span className="rounded-full bg-[#F3F2EF] px-2.5 py-0.5 text-ink-2">
        ขั้นต่ำ ฿{shop.minOrder}
      </span>
    </div>
  );
};

export default ShopPills;
