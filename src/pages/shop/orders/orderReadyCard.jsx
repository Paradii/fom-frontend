import { Button } from "antd";
import { CheckOutlined, QrcodeOutlined } from "@ant-design/icons";
import { itemText, mockCustomers, paidTotal } from "@/services/data";
import { formatPrice, formatTime } from "@/utils/format";

const OrderReadyCard = ({ order, isSelected, onSelect, onQr }) => {
  const customer = mockCustomers.find((c) => {
    return c.customerId === order.customerId;
  });
  const readyLog = order.statusLogs.find((l) => l.status === "ready");

  const onClickQr = (e) => {
    e.stopPropagation();
    onQr(order);
  };

  return (
    <div
      className={`flex cursor-pointer flex-col gap-2 rounded-[14px] border-solid p-[13px] ${
        isSelected
          ? "border-2 border-brand bg-brand-soft"
          : "border border-line bg-white"
      }`}
      onClick={() => onSelect(order)}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 border-solid text-sm ${
            isSelected ? "border-brand bg-brand" : "border-[#CFC9B8] bg-white"
          }`}
        >
          {isSelected && <CheckOutlined />}
        </span>
        <b className="font-head text-base">#{order.orderId}</b>
        <span className="ml-auto whitespace-nowrap rounded-full bg-[#DDF3E7] px-2 py-0.5 text-[13px] font-semibold text-[#1E8E5A]">
          เสร็จ {formatTime(readyLog?.at)}
        </span>
      </div>
      <div className="pl-9 text-sm leading-[21px]">{itemText(order)}</div>
      <div className="pl-9 text-[13px] text-ink-2">
        {order.addressLabel} {customer?.displayName}
      </div>
      <div className="flex items-center justify-between border-0 border-t border-dashed border-[#E8E6E1] pt-[9px]">
        <b className="text-[15px] font-semibold">
          {formatPrice(paidTotal(order))}
        </b>
        {isSelected ? (
          <span className="flex h-[34px] items-center text-[13px] font-semibold text-brand-text">
            อยู่ในรอบนี้
          </span>
        ) : (
          <Button
            icon={<QrcodeOutlined />}
            className="card-button qr-button"
            onClick={onClickQr}
          >
            QR ออเดอร์นี้
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderReadyCard;
