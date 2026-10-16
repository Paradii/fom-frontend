import { Controller } from "react-hook-form";
import { Switch, TimePicker } from "antd";
import dayjs from "dayjs";
import { Card } from "@/components";

const SettingHours = ({ control, openHours }) => {
  return (
    <Card title="เวลาเปิด–ปิด">
      <div className="flex flex-col">
        {openHours.map((item, index) => (
          <Controller
            key={item.day}
            control={control}
            name={`openHours.${index}`}
            render={({ field }) => (
              <div className="flex h-9 items-center gap-3">
                <span className="w-[72px] shrink-0">{field.value.day}</span>
                <Switch
                  checked={field.value.isOpen}
                  onChange={(checked) => {
                    field.onChange({ ...field.value, isOpen: checked });
                  }}
                />
                {field.value.isOpen ? (
                  <TimePicker.RangePicker
                    variant="borderless"
                    format="HH:mm"
                    minuteStep={15}
                    allowClear={false}
                    suffixIcon={null}
                    separator="–"
                    inputReadOnly
                    needConfirm={false}
                    className="hours-picker"
                    value={[
                      dayjs(field.value.openTime, "HH:mm"),
                      dayjs(field.value.closeTime, "HH:mm"),
                    ]}
                    onChange={(times) => {
                      field.onChange({
                        ...field.value,
                        openTime: times[0].format("HH:mm"),
                        closeTime: times[1].format("HH:mm"),
                      });
                    }}
                  />
                ) : (
                  <span className="text-ink-3">ปิดร้าน</span>
                )}
              </div>
            )}
          />
        ))}
      </div>
    </Card>
  );
};

export default SettingHours;
