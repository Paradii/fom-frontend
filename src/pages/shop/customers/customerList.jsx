import { Avatar, Tag } from "antd";
import { Card, UsePagination, UseTable } from "@/components";
import { formatLastDate, formatPrice } from "@/utils/format";

const AVATAR_COLORS = [
  "bg-[#FEE4E2] text-[#B42318]",
  "bg-brand-soft text-brand-text",
  "bg-[#E0EAFF] text-[#3538CD]",
  "bg-[#EBE9FE] text-[#5925DC]",
];

const CustomerList = ({
  dataTable,
  isLoading,
  gridCriteria,
  setGridCriteria,
  setModal,
}) => {
  const onView = (record) => {
    setModal({ open: true, data: record });
  };

  const customerCell = (record) => {
    const color = AVATAR_COLORS[record.customerId % 4];
    return (
      <div className="flex items-center gap-3">
        <Avatar size={44} className={`shrink-0 ${color}`}>
          {record.displayName[0]}
        </Avatar>
        <div>
          <b>{record.displayName}</b>
          {record.isRegular && (
            <Tag
              bordered={false}
              className="ml-2 rounded-full bg-brand-soft text-brand-text"
            >
              ประจำ
            </Tag>
          )}
          <div className="text-sm text-ink-2">
            {record.address} · {record.distanceKm} กม.
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "ลูกค้า",
      dataIndex: "displayName",
      key: "displayName",
      align: "left",
      width: 260,
      render: (_, record) => {
        return customerCell(record);
      },
    },
    {
      title: "สั่งทั้งหมด",
      dataIndex: "orderCount",
      key: "orderCount",
      align: "center",
      width: 100,
      render: (_, record) => {
        return `${record.orderCount} ครั้ง`;
      },
    },
    {
      title: "ยอดรวม",
      dataIndex: "totalSpent",
      key: "totalSpent",
      align: "right",
      width: 100,
      render: (_, record) => {
        return <b>{formatPrice(record.totalSpent)}</b>;
      },
    },
    {
      title: "สั่งล่าสุด",
      dataIndex: "lastOrderAt",
      key: "lastOrderAt",
      align: "left",
      width: 120,
      render: (_, record) => {
        return (
          <span className="text-ink-2">
            {formatLastDate(record.lastOrderAt)}
          </span>
        );
      },
    },
    {
      title: "เมนูที่สั่งบ่อย",
      dataIndex: "favoriteMenus",
      key: "favoriteMenus",
      align: "left",
      width: 150,
      render: (_, record) => {
        return <span className="text-ink-2">{record.favoriteMenus[0]}</span>;
      },
    },
    {
      title: "ติดต่อ",
      dataIndex: "phone",
      key: "phone",
      align: "left",
      width: 130,
      render: (_, record) => {
        return <b className="whitespace-nowrap">{record.phone}</b>;
      },
    },
  ];

  return (
    <Card className="!p-0 lg:!p-5">
      <div className="hidden lg:block">
        <UseTable
          rowKey="customerId"
          dataSource={dataTable}
          columns={columns}
          loading={isLoading}
          pagination={gridCriteria}
          onChange={setGridCriteria}
          scroll={{}}
          onRow={(record) => ({
            className: "cursor-pointer",
            onClick: () => onView(record),
          })}
        />
      </div>
      <div className="lg:hidden">
        {dataTable.map((record) => (
          <div
            key={record.customerId}
            onClick={() => onView(record)}
            className="flex cursor-pointer flex-col gap-2 border-0 border-b border-solid border-line p-4 last:border-b-0"
          >
            {customerCell(record)}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>{record.orderCount} ครั้ง</span>
              <b>{formatPrice(record.totalSpent)}</b>
              <span className="text-ink-2">
                {formatLastDate(record.lastOrderAt)}
              </span>
              <span className="text-ink-2">{record.favoriteMenus[0]}</span>
            </div>
            <b className="text-right">{record.phone}</b>
          </div>
        ))}
        <UsePagination pagination={gridCriteria} onChange={setGridCriteria} />
      </div>
    </Card>
  );
};

export default CustomerList;
