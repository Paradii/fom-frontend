import { Controller } from "react-hook-form";
import { Radio } from "antd";
import FormGroup from "./FormGroup";

const FormRadio = ({ control, name, label, required, options, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormGroup
          label={label}
          required={required}
          error={fieldState.error?.message}
        >
          <Radio.Group
            value={field.value}
            onChange={field.onChange}
            options={options}
            {...props}
          />
        </FormGroup>
      )}
    />
  );
};

export default FormRadio;
