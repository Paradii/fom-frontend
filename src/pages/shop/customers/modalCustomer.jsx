import { Descriptions, Tag } from "antd";
import { UseModal } from "@/components";
import { formatDate, formatPrice } from "@/utils/format";

const ModalCustomer = ({ modal, setModal }) => {
  const data = modal.data;

  const onClose = () => {
    setModal({ ...modal, open: false });
  };

  return (
    <UseModal
      open={modal.open}
      onHandleCancel={onClose}
      title="ข้อมูลลูกค้า"
      size="small"
      readOnly
    >
      {data && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ชื่อ LINE">
            {data.displayName}
          </Descriptions.Item>
          <Descriptions.Item label="เบอร์โทร">{data.phone}</Descriptions.Item>
          <Descriptions.Item label="ที่อยู่ล่าสุด">
            {data.address}
          </Descriptions.Item>
          <Descriptions.Item label="สั่งแล้ว">
            {data.orderCount} ครั้ง
          </Descriptions.Item>
          <Descriptions.Item label="ยอดรวม">
            {formatPrice(data.totalSpent)}
          </Descriptions.Item>
          <Descriptions.Item label="สั่งล่าสุด">
            {formatDate(data.lastOrderAt)}
          </Descriptions.Item>
          <Descriptions.Item label="เมนูที่สั่งบ่อย">
            {data.favoriteMenus.map((m) => (
              <Tag key={m} className="mb-1 px-3 py-1 text-base">
                {m}
              </Tag>
            ))}
          </Descriptions.Item>
        </Descriptions>
      )}
    </UseModal>
  );
};

export default ModalCustomer;
