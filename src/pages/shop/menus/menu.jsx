import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ButtonAdd } from "@/components";
import PagePattern from "@/layouts/PagePattern";
import useNotify from "@/hooks/useNotify";
import useDropdown from "@/hooks/useDropdown";
import useSearch from "@/hooks/useSearch";
import { criteria } from "@/utils/pagination";
import { fetchSaveMenu, loadMenus, mockMenus } from "@/services/data";
import MenuSearch from "./menuSearch";
import MenuList from "./menuList";

const Menu = () => {
  const navigate = useNavigate();
  const { success, error } = useNotify();
  const [gridCriteria, setGridCriteria] = useState(criteria({ pageSize: 20 }));
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { options: categoryOptions } = useDropdown("menuCategory");

  const { control, getValues, reset } = useForm({
    defaultValues: {
      keyword: "",
      categoryId: null,
      isAvailable: null,
    },
  });

  useEffect(() => {
    onSearchForm(gridCriteria.page);
  }, [gridCriteria.page, gridCriteria.pageSize]);

  useEffect(() => {
    setIsLoading(true);
    loadMenus().then((resp) => {
      if (!resp.success) error(resp.message);
      onSearchForm(1);
    });
  }, []);

  const onSearchForm = (page = 1) => {
    const formValue = getValues();
    const pageSize = gridCriteria.pageSize;
    setIsLoading(true);
    const result = mockMenus.filter((m) => {
      const matchName =
        !formValue.keyword?.trim() ||
        m.menuName.includes(formValue.keyword.trim());
      const matchCategory =
        formValue.categoryId === null || m.categoryId === formValue.categoryId;
      const matchStatus =
        formValue.isAvailable === null ||
        m.isAvailable === formValue.isAvailable;
      return matchName && matchCategory && matchStatus;
    });
    setDataTable(result.slice((page - 1) * pageSize, page * pageSize));
    setGridCriteria({ ...gridCriteria, page, total: result.length });
    setIsLoading(false);
  };

  const { isEmpty } = useSearch(control, onSearchForm);

  const onToggleAvailable = async (record, checked) => {
    const payload = {
      actionType: "available",
      menuId: record.menuId,
      isAvailable: checked,
    };
    const resp = await fetchSaveMenu(payload);
    if (resp.success) {
      success(checked ? "เปิดขายแล้ว" : "ตั้งเป็นหมดแล้ว");
      onSearchForm(gridCriteria.page);
    } else {
      error(resp.message);
    }
  };

  const openCount = mockMenus.filter((m) => m.isAvailable).length;
  const closeCount = mockMenus.length - openCount;
  const subtitle = `${mockMenus.length} เมนู · เปิดขาย ${openCount} · หมด ${closeCount}`;

  return (
    <PagePattern
      title="จัดการเมนู"
      subtitle={subtitle}
      extra={
        <ButtonAdd
          text="เพิ่มเมนู"
          onClick={() => navigate("/shop/menus/new")}
        />
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <MenuSearch
          control={control}
          onSearchForm={onSearchForm}
          onClear={() => reset()}
          isEmpty={isEmpty}
        />
        <MenuList
          dataTable={dataTable}
          isLoading={isLoading}
          gridCriteria={gridCriteria}
          setGridCriteria={setGridCriteria}
          categoryOptions={categoryOptions}
          onEdit={(record) => navigate(`/shop/menus/${record.menuId}`)}
          onToggleAvailable={onToggleAvailable}
        />
      </div>
    </PagePattern>
  );
};

export default Menu;
