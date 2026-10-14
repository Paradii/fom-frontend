import { Button } from "antd";
import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export const ButtonSearch = ({ text = "ค้นหา", ...props }) => {
  return (
    <Button type="primary" icon={<SearchOutlined />} {...props}>
      {text}
    </Button>
  );
};

export const ButtonClear = ({ text = "ล้าง", ...props }) => {
  return (
    <Button icon={<ClearOutlined />} {...props}>
      {text}
    </Button>
  );
};

export const ButtonAdd = ({ text = "เพิ่ม", ...props }) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} {...props}>
      {text}
    </Button>
  );
};

export const ButtonEdit = ({ text = "แก้ไข", ...props }) => {
  return (
    <Button icon={<EditOutlined />} {...props}>
      {text}
    </Button>
  );
};

export const ButtonDelete = ({ text = "ลบ", ...props }) => {
  return (
    <Button danger icon={<DeleteOutlined />} {...props}>
      {text}
    </Button>
  );
};

export const ButtonSave = ({ text = "บันทึก", ...props }) => {
  return (
    <Button type="primary" {...props}>
      {text}
    </Button>
  );
};

export const ButtonCancel = ({ text = "ยกเลิก", ...props }) => {
  return <Button {...props}>{text}</Button>;
};

export const ButtonClose = ({ text = "ปิด", ...props }) => {
  return <Button {...props}>{text}</Button>;
};
