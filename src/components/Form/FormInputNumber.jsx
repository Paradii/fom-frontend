import { Controller } from "react-hook-form";
import { InputNumber } from "antd";
import FormGroup from "./FormGroup";

const FormInputNumber = ({
  control,
  name,
  label,
  required,
  hint,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormGroup
          label={label}
          required={required}
          hint={hint}
          error={fieldState.error?.message}
        >
          <InputNumber
            {...field}
            className="w-full"
            status={fieldState.error ? "error" : ""}
            {...props}
          />
        </FormGroup>
      )}
    />
  );
};

export default FormInputNumber;
