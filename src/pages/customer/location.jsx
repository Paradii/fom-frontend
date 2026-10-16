import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Logo } from "@/components";
import { fetchSaveMe, mockMe } from "@/mock/mockData";
import ModalPolicy from "./modalPolicy";

const Location = () => {
  const navigate = useNavigate();
  const [isAccept, setIsAccept] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const onAllow = () => {
    const resp = fetchSaveMe({ actionType: "consent", isLocationOn: true });
    if (resp.success) navigate("/c/nearby");
  };

  const onManual = () => {
    const resp = fetchSaveMe({ actionType: "consent", isLocationOn: false });
    if (resp.success) navigate("/c/address/login");
  };

  return (
    <div className="min-h-screen bg-[#EFEEEA] font-body text-ink">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-brand">
        <div className="flex flex-col items-center gap-4 px-6 pb-5 pt-[72px] text-center">
          <Logo size={88} radius={24} className="bg-white text-brand-deco" />
          <span className="font-head text-[40px] font-bold leading-none">
            FOM
          </span>
          <h1 className="text-2xl font-semibold leading-[32.4px]">
            หิวเมื่อไหร่ สั่งร้านใกล้บ้าน
            <br />
            ได้ในไลน์เลย
          </h1>
          <p className="m-0 text-[15px] leading-[22px] opacity-95">
            ไม่ต้องโหลดแอปเพิ่ม จ่ายด้วยพร้อมเพย์ ติดตามได้ทุกขั้นตอน
          </p>
          <span className="flex items-center gap-2 rounded-full bg-white/60 py-1.5 pl-1.5 pr-3.5 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF1D6] text-[13px] font-semibold text-[#8A3A00]">
              {mockMe.displayName.charAt(0)}
            </span>
            เข้าสู่ระบบด้วย LINE แล้ว · {mockMe.displayName}
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-4 rounded-t-3xl bg-white px-5 pb-8 pt-3 shadow-[0_-8px_12px_rgba(28,27,25,0.12)]">
          <span className="mx-auto h-1 w-10 rounded bg-[#E3E1DC]" />
          <div className="flex items-start gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF6D6] text-2xl text-brand-text">
              <EnvironmentOutlined />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">ขอใช้ตำแหน่งของคุณ</h2>
              <p className="m-0 text-[15px] leading-[22.5px] text-ink-2">
                เพื่อแสดงร้านที่ส่งถึงบ้านคุณ
                เราใช้ตำแหน่งเพื่อค้นหาร้านและจัดส่งเท่านั้น
                ไม่เปิดเผยให้บุคคลอื่น
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-[14px] border border-solid border-line bg-bg p-[15px]">
            <Checkbox
              className="c-check"
              checked={isAccept}
              onChange={(e) => setIsAccept(e.target.checked)}
            />
            <span className="text-sm leading-[21px]">
              ฉันยินยอมให้เก็บและใช้ตำแหน่งตาม{" "}
              <a
                className="text-brand-text underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPolicyOpen(true);
                }}
              >
                นโยบายความเป็นส่วนตัว
              </a>{" "}
              (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
            </span>
          </label>
          <Button
            type="primary"
            block
            className="c-main"
            disabled={!isAccept}
            onClick={onAllow}
          >
            อนุญาตและค้นหาร้าน
          </Button>
          <Button
            type="text"
            block
            className="h-11 text-[15px] font-medium text-ink-2"
            onClick={onManual}
          >
            ไม่อนุญาต ขอกรอกที่อยู่เอง
          </Button>
        </div>
      </div>
      <ModalPolicy
        open={isPolicyOpen}
        onHandleCancel={() => setIsPolicyOpen(false)}
      />
    </div>
  );
};

export default Location;
