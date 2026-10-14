import {
  Card,
  FormDropdown,
  FormInput,
  ButtonClear,
  ButtonSearch,
} from "@/components";

const CustomerSearch = ({ control, onSearchForm, onClear, isEmpty }) => {
  return (
    <Card>
      <div className="grid items-end gap-3 md:grid-cols-[2fr_1fr_auto]">
        <FormInput
          control={control}
          name="keyword"
          label="ชื่อหรือเบอร์โทร"
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
          <ButtonSearch disabled={isEmpty} onClick={() => onSearchForm()} />
          <ButtonClear onClick={onClear} />
        </div>
      </div>
    </Card>
  );
};

export default CustomerSearch;
