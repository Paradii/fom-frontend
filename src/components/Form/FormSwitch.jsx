import { Controller } from "react-hook-form";
import { Switch } from "antd";

const FormSwitch = ({ control, name, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch checked={field.value} onChange={field.onChange} {...props} />
      )}
    />
  );
};

export default FormSwitch;
