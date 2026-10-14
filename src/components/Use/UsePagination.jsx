import { Pagination } from "antd";

const UsePagination = ({ pagination, onChange }) => {
  const onChangePage = (page) => {
    onChange({ ...pagination, page: page });
  };

  return (
    <div className="flex justify-center p-4">
      <Pagination
        current={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        hideOnSinglePage
        onChange={onChangePage}
      />
    </div>
  );
};

export default UsePagination;
