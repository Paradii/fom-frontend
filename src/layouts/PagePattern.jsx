import { useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";

const PagePattern = ({
  title,
  titleExtra,
  subtitle,
  onBack,
  extra,
  children,
}) => {
  useEffect(() => {
    document.title = `${title} · FOM`;
  }, [title]);

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="ย้อนกลับ"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-solid border-line bg-white text-xl text-ink hover:border-brand-line"
            >
              <LeftOutlined />
            </button>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="m-0 font-head text-[28px] font-semibold">
                {title}
              </h1>
              {titleExtra}
            </div>
            {subtitle && <div className="text-ink-2">{subtitle}</div>}
          </div>
        </div>
        {extra && <div className="flex gap-2">{extra}</div>}
      </div>
      {children}
    </div>
  );
};

export default PagePattern;
