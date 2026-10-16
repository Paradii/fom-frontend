import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const CustomerHeader = ({ title, subtitle, backTo, extra }) => {
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-10 flex h-[61px] shrink-0 items-center gap-1 border-0 border-b border-solid border-line bg-white pr-4 ${
        backTo ? "pl-2" : "pl-4"
      }`}
    >
      {backTo && (
        <a
          aria-label="กลับ"
          onClick={() => navigate(backTo)}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-[22px]"
        >
          <LeftOutlined />
        </a>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-lg font-semibold">{title}</h1>
        {subtitle && (
          <span className="truncate text-[13px] text-ink-2">{subtitle}</span>
        )}
      </div>
      {extra}
    </header>
  );
};

export default CustomerHeader;
