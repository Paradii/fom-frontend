import { Logo } from "@/components";

const LoginLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-bg font-body text-ink lg:flex-row">
      <div className="flex flex-col justify-center gap-5 bg-brand px-14 py-16 lg:w-[48%] lg:px-14">
        <Logo size={72} radius={18} className="bg-white text-brand-deco" />
        <h1 className="m-0 font-head text-[44px] font-bold leading-tight">
          FOM
        </h1>
        <p className="m-0 max-w-[460px] text-lg">
          สั่งอาหารจากร้านใกล้บ้าน
          <br />
          หรือรับคำสั่งซื้อของร้านคุณ ใช้บัญชี LINE เดียวกัน ไม่ต้องสมัครสมาชิก
        </p>
      </div>
      <div className="flex flex-1 items-start justify-center px-6 py-12 lg:items-center">
        <div className="flex w-full max-w-[424px] flex-col gap-4 rounded-[20px] border border-solid border-line bg-white p-8 shadow-[0_8px_24px_rgba(28,27,25,0.06)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
