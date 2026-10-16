import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox } from "antd";
import { RightOutlined, ShopOutlined } from "@ant-design/icons";
import { FoodIcon } from "@/components";
import LoginLayout from "@/layouts/LoginLayout";
import ShopAccount from "@/layouts/ShopAccount";
import { fetchSaveShop, mockAccounts, mockMe } from "@/mock/mockData";
import ModalPolicy from "@/pages/customer/modalPolicy";

const ROLES = [
  {
    key: "customer",
    name: "สั่งอาหาร",
    pill: "ลูกค้า",
    pillClass: "bg-[#FFF1D6] text-[#8A3A00]",
    note: "สั่งอาหารจากร้านใกล้บ้าน",
    icon: <FoodIcon size={26} color="#8A3A00" />,
    iconClass: "bg-[#FFF1D6]",
  },
  {
    key: "shop",
    name: "เปิดร้านค้า",
    pill: "ร้านค้า",
    pillClass: "bg-[#FFF6D6] text-brand-text",
    note: "รับคำสั่งซื้อ ดูยอดขาย",
    icon: <ShopOutlined className="text-[26px] text-brand-text" />,
    iconClass: "bg-[#FFF6D6]",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("line");
  const [isAccept, setIsAccept] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const isDesktop = window.innerWidth >= 1024;

  const goCustomer = () => {
    if (mockMe.consentAt) {
      navigate("/c/nearby");
      return;
    }
    navigate("/c/location");
  };

  const goShop = (accountId) => {
    const resp = fetchSaveShop({ actionType: "switch", accountId: accountId });
    if (resp.success) navigate("/shop/orders");
  };

  const onAccept = (checked) => {
    setIsAccept(checked);
    setIsError(false);
  };

  const onLogin = () => {
    if (!isAccept) {
      setIsError(true);
      return;
    }
    const shops = mockAccounts.filter((a) => a.accountType === "shop");
    if (mockMe.isNew) {
      setStep("role");
      return;
    }
    if (shops.length > 0 || isDesktop) {
      setStep("account");
      return;
    }
    goCustomer();
  };

  const onSelectRole = (key) => {
    if (key === "shop") {
      onAddShop();
      return;
    }
    if (!isRoleLocked(key)) navigate("/c/location");
  };

  const isRoleLocked = (key) => {
    return key === "customer" && isDesktop;
  };

  const getRoleClass = (key) => {
    if (isRoleLocked(key)) {
      return "cursor-not-allowed bg-bg opacity-60";
    }
    return "cursor-pointer bg-white hover:border-brand-line";
  };

  const getRoleNote = (role) => {
    if (isRoleLocked(role.key)) {
      return "ใช้ได้ในแอป LINE บนโทรศัพท์";
    }
    return role.note;
  };

  const onAddShop = () => {
    const resp = fetchSaveShop({ actionType: "add" });
    if (resp.success) navigate("/shop/settings");
  };

  const onSwitch = (account) => {
    if (account.accountType === "customer") {
      goCustomer();
      return;
    }
    goShop(account.accountId);
  };

  const renderLine = () => {
    return (
      <>
        <h2 className="m-0 font-head text-[28px] font-semibold">เข้าสู่ระบบ</h2>
        <p className="m-0 text-sm text-ink-2">
          ใช้ได้ทั้งลูกค้าและเจ้าของร้าน
          <br />
          เข้าสู่ระบบแล้วระบบจะพาไปหน้าตามบทบาทของคุณ
        </p>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border border-solid p-4 ${
            isError ? "border-danger bg-[#FFF5F5]" : "border-line bg-bg"
          }`}
        >
          <Checkbox
            checked={isAccept}
            onChange={(e) => onAccept(e.target.checked)}
          />
          <span className="text-sm leading-[21px]">
            ยอมรับ{" "}
            <a
              className="text-brand-text"
              onClick={(e) => {
                e.preventDefault();
                setIsPolicyOpen(true);
              }}
            >
              นโยบายความเป็นส่วนตัว
            </a>{" "}
            (เฉพาะผู้ใช้ใหม่)
          </span>
        </label>
        {isError && (
          <span role="alert" className="-mt-2 text-sm text-danger">
            กรุณายอมรับนโยบายความเป็นส่วนตัวก่อนเข้าสู่ระบบ
          </span>
        )}
        <Button
          size="large"
          className="line-button h-[52px] text-lg"
          onClick={onLogin}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[11px] font-bold text-[#06C755]">
            LINE
          </span>
          เข้าสู่ระบบด้วย LINE
        </Button>
        <span className="text-center text-[13px] text-ink-2">
          ไม่ต้องสมัครสมาชิกหรือจำรหัสผ่าน
        </span>
      </>
    );
  };

  const renderRole = () => {
    return (
      <>
        <h2 className="m-0 font-head text-2xl font-semibold">
          ครั้งแรกที่ใช้ FOM
          <br />
          จะใช้ทำอะไร
        </h2>
        <p className="m-0 text-sm text-ink-2">
          เลือกครั้งเดียวตอนเริ่มใช้
          <br />
          ภายหลังเพิ่มอีกแบบได้ที่หน้าบัญชีของฉัน
        </p>
        {ROLES.map((role) => (
          <a
            key={role.key}
            onClick={() => onSelectRole(role.key)}
            aria-disabled={isRoleLocked(role.key)}
            className={`flex items-center gap-3 rounded-[14px] border border-solid border-line px-[14px] py-3 ${getRoleClass(role.key)}`}
          >
            <span
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${role.iconClass}`}
            >
              {role.icon}
            </span>
            <span className="flex flex-1 flex-col items-start gap-1">
              <span className="text-lg font-semibold">{role.name}</span>
              <span
                className={`rounded-full px-2 text-xs font-semibold ${role.pillClass}`}
              >
                {role.pill}
              </span>
              <span className="text-[13px] text-ink-2">
                {getRoleNote(role)}
              </span>
            </span>
            {!isRoleLocked(role.key) && (
              <RightOutlined className="text-xl text-ink-2" />
            )}
          </a>
        ))}
        <p className="m-0 text-center text-[13px] text-ink-2">
          หน้านี้ขึ้นเฉพาะครั้งแรกที่บัญชี LINE นี้เข้าใช้ FOM
        </p>
      </>
    );
  };

  const renderAccount = () => {
    return (
      <ShopAccount
        title="เลือกบัญชีที่จะใช้งาน"
        subtitle={
          <>
            บัญชี LINE นี้มีทั้งร้านค้าและบัญชีลูกค้า
            <br />
            เลือกได้ทีละบัญชี
            <br />
            เปลี่ยนภายหลังได้ที่ชื่อร้านหรือโปรไฟล์
          </>
        }
        onSwitch={onSwitch}
        onAddShop={onAddShop}
      />
    );
  };

  return (
    <LoginLayout>
      {step === "line" && renderLine()}
      {step === "role" && renderRole()}
      {step === "account" && renderAccount()}
      <ModalPolicy
        open={isPolicyOpen}
        onHandleCancel={() => setIsPolicyOpen(false)}
        wrapClassName="sheet-modal"
      />
    </LoginLayout>
  );
};

export default Login;
