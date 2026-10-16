import { Controller } from "react-hook-form";
import { Input } from "antd";
import FormGroup from "./FormGroup";

const FormTextArea = ({ control, name, label, required, hint, ...props }) => {
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
          <Input.TextArea
            {...field}
            value={field.value || ""}
            rows={2}
            status={fieldState.error ? "error" : ""}
            {...props}
          />
        </FormGroup>
      )}
    />
  );
};

export default FormTextArea;
