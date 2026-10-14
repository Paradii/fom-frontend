import { Controller } from "react-hook-form";
import { Upload } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import FormGroup from "./FormGroup";

const FormUpload = ({ control, name, label, required, hint }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => (
        <FormGroup
          label={label}
          required={required}
          hint={hint}
          error={fieldState.error?.message}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => {
              onChange({ file, url: URL.createObjectURL(file) });
              return false;
            }}
          >
            {value?.url ? (
              <img
                src={value.url}
                alt=""
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="grid place-items-center gap-1 text-ink-3">
                <PictureOutlined className="text-2xl" />
                <span className="text-sm">เลือกรูป</span>
              </div>
            )}
          </Upload>
        </FormGroup>
      )}
    />
  );
};

export default FormUpload;
