import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Modal, Switch } from "antd";
import { RightOutlined, SwapOutlined } from "@ant-design/icons";
import { UseModal } from "@/components";
import useNotify from "@/hooks/useNotify";
import CustomerAccount from "@/layouts/CustomerAccount";
import CustomerLayout from "@/layouts/CustomerLayout";
import {
  fetchSaveMe,
  fetchSaveShop,
  loadAddresses,
  loadMyOrders,
  mockAddresses,
  mockMe,
} from "@/services/data";
import withLoad, { loadAll } from "@/utils/withLoad";

import { formatThaiDate, onlyDigits } from "@/utils/format";
import ModalPolicy from "./modalPolicy";

const Account = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [isLocationOn, setIsLocationOn] = useState(mockMe.isLocationOn);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [refundPromptPay, setRefundPromptPay] = useState(
    mockMe.refundPromptPay,
  );
  const [isError, setIsError] = useState(false);
  const mainAddress = mockAddresses.find((a) => a.isMain);

  const getAddressText = () => {
    if (mockAddresses.length === 0) return "ยังไม่มีที่อยู่";
    const text = `${mockAddresses.length} ที่อยู่`;
    if (!mainAddress) return text;
    return `${text} · ที่อยู่หลัก: ${mainAddress.label}`;
  };

  const getConsentText = () => {
    if (!isLocationOn) return "ปิดอยู่ · เปิดเพื่อหาร้านใกล้คุณ";
    return `ยินยอมเมื่อ ${formatThaiDate(mockMe.consentAt)} · ปิดได้ทุกเมื่อ`;
  };

  const onSelectAccount = async (key) => {
    const resp = await fetchSaveShop({ actionType: "switch", accountId: key });
    if (resp.success) navigate("/shop/orders");
    else notify.error(resp.message);
  };

  const onAddShop = () => {
    navigate("/shop/new");
  };

  const onLocation = async (checked) => {
    const resp = await fetchSaveMe({ actionType: "location", isLocationOn: checked });
    if (resp.success) setIsLocationOn(checked);
  };

  const onOpenRefund = () => {
    setRefundPromptPay(mockMe.refundPromptPay);
    setIsError(false);
    setIsRefundOpen(true);
  };

  const onSaveRefund = async () => {
    if (onlyDigits(refundPromptPay).length !== 10) {
      setIsError(true);
      return;
    }
    const resp = await fetchSaveMe({
      actionType: "refund",
      refundPromptPay: refundPromptPay,
    });
    if (resp.success) {
      setIsRefundOpen(false);
      notify.success();
    } else {
      notify.error(resp.message);
    }
  };

  const onDelete = async () => {
    const resp = await fetchSaveMe({ actionType: "delete" });
    if (!resp.success) {
      notify.error(
        resp.status
          ? resp.message
          : "ยังมีคำสั่งซื้อที่กำลังดำเนินการ รอให้เสร็จก่อนจึงลบได้",
      );
      return;
    }
    navigate("/login");
  };

  const getTitleClass = (isDanger, isDark) => {
    if (isDanger) return "font-semibold text-[#8A1C1C]";
    if (isDark) return "font-medium";
    return "font-medium text-ink-2";
  };

  const renderRow = ({ title, text, onClick, isDanger, isDark, extra }) => {
    return (
      <a
        onClick={onClick}
        className="flex min-h-[57px] cursor-pointer items-center gap-3 border-0 border-b border-solid border-[#F3F2EF] px-4 py-[14px] last:border-b-0"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <b className={`text-[15px] ${getTitleClass(isDanger, isDark)}`}>
            {title}
          </b>
          {text && <span className="text-[13px] text-ink-2">{text}</span>}
        </span>
        {extra || (
          <RightOutlined
            className={`text-lg ${isDanger ? "text-[#8A1C1C]" : "text-ink-2"}`}
          />
        )}
      </a>
    );
  };

  return (
    <CustomerLayout nav="account">
      <header className="flex items-center gap-3.5 border-0 border-b border-solid border-line bg-white px-4 pb-[21px] pt-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFF1D6] font-head text-[26px] font-semibold text-[#8A3A00]">
          {mockMe.displayName.charAt(0)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className="truncate font-head text-xl font-semibold">
            {mockMe.displayName}
          </h1>
          <span className="text-[13px] text-ink-2">เข้าสู่ระบบด้วย LINE</span>
        </div>
        <Button
          icon={<SwapOutlined />}
          onClick={() => setIsSwitchOpen(true)}
          className="h-9 shrink-0 rounded-full border-[1.5px] border-brand px-3 text-sm font-semibold"
        >
          สลับบัญชี
        </Button>
      </header>
      <main className="flex flex-col gap-4 px-4 pb-6 pt-4">
        <section className="flex flex-col rounded-2xl border border-solid border-line bg-white">
          {renderRow({
            title: "ที่อยู่จัดส่ง",
            text: getAddressText(),
            onClick: () => navigate("/c/address/account"),
          })}
          {renderRow({
            title: "พร้อมเพย์รับเงินคืน",
            text: `${mockMe.refundPromptPay || "ยังไม่ได้กรอก"} · ใช้เมื่อร้านต้องโอนเงินคืน`,
            onClick: onOpenRefund,
          })}
          {renderRow({
            title: "ประวัติการสั่งซื้อ",
            text: "ดูและสั่งซ้ำ",
            onClick: () => navigate("/c/history"),
          })}
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="px-1 font-head text-base font-semibold">
            ความเป็นส่วนตัว (PDPA)
          </h2>
          <div className="flex flex-col rounded-2xl border border-solid border-line bg-white">
            {renderRow({
              title: "ใช้ตำแหน่งเพื่อค้นหาร้าน",
              text: getConsentText(),
              onClick: () => onLocation(!isLocationOn),
              isDark: true,
              extra: (
                <Switch
                  className="c-switch"
                  checked={isLocationOn}
                  aria-label="ใช้ตำแหน่งเพื่อค้นหาร้าน"
                />
              ),
            })}
            {renderRow({
              title: "นโยบายความเป็นส่วนตัว",
              onClick: () => setIsPolicyOpen(true),
            })}
            {renderRow({
              title: "ขอลบข้อมูลของฉัน",
              text: "ลบชื่อ ที่อยู่ ตำแหน่ง และประวัติการสั่งซื้อ",
              onClick: () => setIsDeleteOpen(!isDeleteOpen),
              isDanger: true,
            })}
          </div>
        </section>
        {isDeleteOpen && (
          <section className="flex flex-col gap-2 rounded-2xl border border-solid border-[#F3B5B5] bg-white p-4">
            <b className="font-head text-base font-bold">
              ยืนยันลบข้อมูลทั้งหมด?
            </b>
            <span className="text-[13px] leading-[19.5px] text-ink-2">
              หลังลบ คุณต้องเข้าสู่ระบบและให้ความยินยอมใหม่
              คำสั่งซื้อที่กำลังดำเนินการต้องเสร็จก่อน
            </span>
            <div className="mt-1 grid grid-cols-2 gap-2.5">
              <Button
                className="h-11 rounded-xl border-[#E3E1DC] text-[15px] font-semibold"
                onClick={() => setIsDeleteOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                type="primary"
                danger
                className="h-11 rounded-xl bg-[#B42318] text-[15px] font-semibold"
                onClick={onDelete}
              >
                ลบข้อมูล
              </Button>
            </div>
          </section>
        )}
        <Button
          type="text"
          className="h-[34px] self-center text-[15px] font-semibold text-ink-2"
          onClick={() => navigate("/login")}
        >
          ออกจากระบบ
        </Button>
      </main>
      <Modal
        open={isSwitchOpen}
        onCancel={() => setIsSwitchOpen(false)}
        title="สลับบัญชีที่ใช้งาน"
        footer={null}
        wrapClassName="c-sheet"
        destroyOnClose
      >
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm leading-[22px] text-ink-2">
            บัญชี LINE นี้ใช้ได้ทั้งเป็นลูกค้าและเจ้าของร้าน
            ข้อมูลแต่ละบัญชีแยกกัน
          </p>
          <CustomerAccount
            isSwitch
            onSelect={onSelectAccount}
            onAddShop={onAddShop}
          />
          <Button
            block
            className="h-12 rounded-xl border-[#E3E1DC] text-[15px] font-semibold"
            onClick={() => setIsSwitchOpen(false)}
          >
            ปิด
          </Button>
        </div>
      </Modal>
      <UseModal
        open={isRefundOpen}
        onHandleCancel={() => setIsRefundOpen(false)}
        title="พร้อมเพย์รับเงินคืน"
        size="small"
        wrapClassName="c-sheet"
        onSave={onSaveRefund}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-2">เบอร์พร้อมเพย์</span>
          <Input
            value={refundPromptPay}
            inputMode="numeric"
            maxLength={12}
            status={isError ? "error" : ""}
            onChange={(e) => {
              setRefundPromptPay(e.target.value);
              setIsError(false);
            }}
            placeholder="089-111-2233"
            className="h-11 text-[15px]"
          />
          {isError && (
            <span role="alert" className="text-[13px] text-danger">
              กรอกเบอร์พร้อมเพย์ 10 หลัก
            </span>
          )}
          <span className="text-[13px] text-ink-2">
            ร้านจะโอนเงินคืนเข้าเบอร์นี้เมื่อคำสั่งซื้อถูกยกเลิกหลังชำระเงิน
          </span>
        </div>
      </UseModal>
      <ModalPolicy
        open={isPolicyOpen}
        onHandleCancel={() => setIsPolicyOpen(false)}
      />
    </CustomerLayout>
  );
};

export default withLoad(Account, () => loadAll(loadAddresses(), loadMyOrders()));
