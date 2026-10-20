import CustomerHeader from "@/layouts/CustomerHeader";
import { getShop } from "@/services/data";

const PayHeader = ({ order }) => {
  const shop = getShop(order.shopId);

  return (
    <CustomerHeader
      title="ชำระเงิน"
      subtitle={`คำสั่งซื้อ #${order.orderId} · ${shop.shopName}`}
      extra={
        <span className="shrink-0 rounded-full bg-[#FFF1D6] px-3 py-1 text-[13px] font-semibold text-[#8A3A00]">
          รอชำระเงิน
        </span>
      }
    />
  );
};

export default PayHeader;
