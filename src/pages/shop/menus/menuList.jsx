import { Button, Switch } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { Card, UsePagination, UseTable } from "@/components";
import { mockTags } from "@/mock/mockData";
import { formatPrice } from "@/utils/format";

const TAG_ORDER = ["ingredient", "cooking_method", "taste"];

const MenuList = ({
  dataTable,
  isLoading,
  gridCriteria,
  setGridCriteria,
  categoryOptions,
  onEdit,
  onToggleAvailable,
}) => {
  const getCategoryName = (categoryId) => {
    return categoryOptions.find((c) => c.value === categoryId)?.label || "-";
  };

  const getTagText = (tagIds) => {
    const tags = mockTags.filter((t) => tagIds.includes(t.tagId));
    const names = [];
    TAG_ORDER.forEach((type) => {
      const tag = tags.find((t) => t.tagType === type);
      if (tag) names.push(tag.tagName);
    });
    return names.join(" · ");
  };

  const menuCell = (record) => {
    return (
      <div className="flex items-center gap-3">
        {record.imageUrl ? (
          <img
            src={record.imageUrl}
            alt={record.menuName}
            className="h-12 w-12 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDE8DD] text-2xl text-brand-deco">
            <PictureOutlined />
          </div>
        )}
        <b>{record.menuName}</b>
      </div>
    );
  };

  const switchCell = (record) => {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={record.isAvailable}
          onChange={(checked) => onToggleAvailable(record, checked)}
        />
        <span className={record.isAvailable ? "text-[#15803D]" : "text-ink-3"}>
          {record.isAvailable ? "เปิด" : "หมด"}
        </span>
      </div>
    );
  };

  const onCellButton = (values) => {
    return (
      <div className="flex">
        <Button
          type="text"
          className="font-semibold"
          onClick={() => onEdit(values)}
        >
          แก้ไข
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: "เมนู",
      dataIndex: "menuName",
      key: "menuName",
      align: "left",
      width: 250,
      render: (_, record) => {
        return menuCell(record);
      },
    },
    {
      title: "หมวด",
      dataIndex: "categoryId",
      key: "categoryId",
      align: "left",
      width: 120,
      render: (_, record) => {
        return (
          <span className="text-ink-2">
            {getCategoryName(record.categoryId)}
          </span>
        );
      },
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      align: "left",
      width: 90,
      render: (_, record) => {
        return <b>{formatPrice(record.price)}</b>;
      },
    },
    {
      title: "แท็ก (ใช้แนะนำเมนู)",
      dataIndex: "tagIds",
      key: "tagIds",
      align: "left",
      width: 180,
      render: (_, record) => {
        return <span className="text-ink-2">{getTagText(record.tagIds)}</span>;
      },
    },
    {
      title: "เปิดขาย",
      dataIndex: "isAvailable",
      key: "isAvailable",
      align: "left",
      width: 110,
      render: (_, record) => {
        return switchCell(record);
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      align: "left",
      width: 140,
      render: (_, record) => {
        return onCellButton(record);
      },
    },
  ];

  return (
    <Card className="!p-0 xl:!p-5">
      <div className="hidden xl:block">
        <UseTable
          rowKey="menuId"
          dataSource={dataTable}
          columns={columns}
          loading={isLoading}
          pagination={gridCriteria}
          onChange={setGridCriteria}
        />
      </div>
      <div className="xl:hidden">
        <div className="grid md:grid-cols-2">
          {dataTable.map((record) => (
            <div
              key={record.menuId}
              className="flex flex-col gap-2 border-0 border-b border-solid border-line p-4 md:odd:border-r"
            >
              {menuCell(record)}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="text-ink-2">
                  {getCategoryName(record.categoryId)}
                </span>
                <b>{formatPrice(record.price)}</b>
                <span className="text-ink-2">{getTagText(record.tagIds)}</span>
                {switchCell(record)}
                <div className="ml-auto">{onCellButton(record)}</div>
              </div>
            </div>
          ))}
        </div>
        <UsePagination pagination={gridCriteria} onChange={setGridCriteria} />
      </div>
    </Card>
  );
};

export default MenuList;
