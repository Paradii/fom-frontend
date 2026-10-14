import { Table } from "antd";

const UseTable = ({
  dataSource,
  columns,
  loading,
  rowKey,
  pagination,
  onChange,
  scroll = { x: "max-content" },
  onRow,
}) => {
  const onChangePage = (page, pageSize) => {
    onChange({ ...pagination, page: page, pageSize: pageSize });
  };

  return (
    <Table
      rowKey={rowKey}
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      scroll={scroll}
      onRow={onRow}
      locale={{ emptyText: "ไม่พบข้อมูล" }}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        hideOnSinglePage: true,
        showTotal: (total) => `ทั้งหมด ${total} รายการ`,
        onChange: onChangePage,
      }}
    />
  );
};

export default UseTable;
