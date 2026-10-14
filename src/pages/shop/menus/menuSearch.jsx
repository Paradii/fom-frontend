import {
  Card,
  FormDropdown,
  FormInput,
  ButtonClear,
  ButtonSearch,
} from "@/components";

const MenuSearch = ({ control, onSearchForm, onClear, isEmpty }) => {
  return (
    <Card>
      <div className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_auto]">
        <FormInput
          control={control}
          name="keyword"
          label="ชื่อเมนู"
          placeholder="ข้าวกะเพราหมูสับ"
          allowClear
          onPressEnter={() => onSearchForm()}
        />
        <FormDropdown
          control={control}
          name="categoryId"
          label="หมวดหมู่"
          dataType="menuCategory"
          placeholder="ทั้งหมด"
        />
        <FormDropdown
          control={control}
          name="isAvailable"
          label="สถานะ"
          dataType="menuStatus"
          placeholder="ทั้งหมด"
          showSearch={false}
        />
        <div className="flex gap-2">
          <ButtonSearch disabled={isEmpty} onClick={() => onSearchForm()} />
          <ButtonClear onClick={onClear} />
        </div>
      </div>
    </Card>
  );
};

export default MenuSearch;
