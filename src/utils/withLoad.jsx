import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Result, Spin } from "antd";

// รวมผลจากหลาย load...() ถ้ามีตัวไหนไม่สำเร็จ คืนตัวแรกที่ไม่สำเร็จ
export const loadAll = async (...loaders) => {
  const results = await Promise.all(loaders);
  return results.find((r) => r && r.success === false) || { success: true };
};

// ห่อหน้าจอให้โหลดข้อมูลจาก backend เสร็จก่อนค่อยแสดง
// getLoader(params) คืน Promise ของ { success, message } จาก services/data.js
// หน้าจอเดิมจึงอ่าน store แบบ sync ได้เหมือนตอนใช้ข้อมูลจำลอง
const withLoad = (Page, getLoader) => {
  const Wrapped = () => {
    const params = useParams();
    const key = JSON.stringify(params);
    const [state, setState] = useState({ key: null, error: null });
    const [retry, setRetry] = useState(0);

    useEffect(() => {
      let isAlive = true;
      setState({ key: null, error: null });
      Promise.resolve(getLoader(params)).then((resp) => {
        if (!isAlive) return;
        const error = resp && resp.success === false ? resp.message : null;
        setState({ key, error });
      });
      return () => {
        isAlive = false;
      };
    }, [key, retry]);

    if (state.key !== key) {
      return (
        <div className="grid min-h-screen place-items-center bg-bg">
          <Spin size="large" />
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-bg px-6">
          <Result
            status="warning"
            title="โหลดข้อมูลไม่สำเร็จ"
            subTitle={state.error}
            extra={
              <Button type="primary" onClick={() => setRetry(retry + 1)}>
                ลองใหม่
              </Button>
            }
          />
        </div>
      );
    }

    return <Page key={key} />;
  };
  return Wrapped;
};

export default withLoad;
