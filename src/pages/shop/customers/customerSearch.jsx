import {
  Card,
  FormDropdown,
  FormInput,
  ButtonClear,
  ButtonSearch,
} from "@/components";

const CustomerSearch = ({ control, onSearchForm, onClear, isEmpty }) => {
  return (
    <Card className="!p-4 md:!p-5">
      <div className="grid items-end gap-3 md:grid-cols-[2fr_1fr_auto]">
        <FormInput
          control={control}
          name="keyword"
          label="ชื่อลูกค้า"
          placeholder="มายด์"
          allowClear
          onPressEnter={() => onSearchForm()}
        />
        <FormDropdown
          control={control}
          name="minOrders"
          label="จำนวนครั้งที่สั่ง"
          dataType="customerMinOrders"
          placeholder="ทั้งหมด"
          showSearch={false}
        />
        <div className="flex gap-2">
          <ButtonSearch
            className="flex-1 md:flex-none"
            disabled={isEmpty}
            onClick={() => onSearchForm()}
          />
          <ButtonClear className="flex-1 md:flex-none" onClick={onClear} />
        </div>
      </div>
    </Card>
  );
};

export default CustomerSearch;
