import { Controller } from "react-hook-form";
import { Input } from "antd";
import FormGroup from "./FormGroup";

const FormInput = ({ control, name, label, required, hint, ...props }) => {
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
          <Input
            {...field}
            value={field.value || ""}
            status={fieldState.error ? "error" : ""}
            {...props}
          />
        </FormGroup>
      )}
    />
  );
};

export default FormInput;
