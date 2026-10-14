import { Controller } from "react-hook-form";
import { Select } from "antd";
import useDropdown from "@/hooks/useDropdown";
import FormGroup from "./FormGroup";

const FormDropdown = ({
  control,
  name,
  label,
  labelNote,
  required,
  hint,
  dataType,
  ...props
}) => {
  const { options } = useDropdown(dataType);

  const onChangeValue = (field, value) => {
    field.onChange(value === undefined ? null : value);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormGroup
          label={label}
          labelNote={labelNote}
          required={required}
          hint={hint}
          error={fieldState.error?.message}
        >
          <Select
            value={field.value}
            onChange={(value) => onChangeValue(field, value)}
            onBlur={field.onBlur}
            options={options}
            placeholder="เลือก"
            allowClear
            showSearch
            optionFilterProp="label"
            status={fieldState.error ? "error" : ""}
            {...props}
          />
        </FormGroup>
      )}
    />
  );
};

export default FormDropdown;
