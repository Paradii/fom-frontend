import { Empty } from "antd";

const Screen = ({ title, children }) => {
  return (
    <div className="p-5">
      <h1 className="mb-4 text-[22px]">{title}</h1>
      {children || (
        <div className="rounded-card border border-solid border-line bg-white p-6">
          <Empty description="ยังไม่ได้ทำหน้านี้ ดูแบบในไฟล์ Figma" />
        </div>
      )}
    </div>
  );
};

export default Screen;
