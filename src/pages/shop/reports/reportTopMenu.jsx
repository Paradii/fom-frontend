import { Card } from "@/components";

const ReportTopMenu = ({ topMenus }) => {
  const maxQuantity = topMenus.length > 0 ? topMenus[0].quantity : 1;

  return (
    <Card title="เมนูขายดี">
      {topMenus.length === 0 && (
        <div className="py-6 text-center text-ink-2">ยังไม่มีข้อมูล</div>
      )}
      {topMenus.map((menu, index) => (
        <div key={menu.menuName} className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-2">
            <span>
              <b className="mr-2 text-brand-text">{index + 1}</b>
              {menu.menuName}
            </span>
            <span className="text-ink-2">{menu.quantity} จาน</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#F3F2EE]">
            <div
              className="h-full rounded-full bg-brand-strong"
              style={{ width: `${(menu.quantity / maxQuantity) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </Card>
  );
};

export default ReportTopMenu;
