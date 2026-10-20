import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Spin } from "antd";
import ShopLayout from "@/layouts/ShopLayout";
import { initLine, isLoggedIn, loadSession } from "@/services/data";
import { routes } from "./routes";

// หน้าที่เปิดได้โดยไม่ต้องเข้าสู่ระบบ: หน้าเข้าสู่ระบบ และลิงก์ของคนส่งจาก QR
const isPublic = (path) => path === "/login" || path.startsWith("/rider/");

const RequireLogin = ({ path, children }) => {
  const location = useLocation();
  if (isPublic(path) || isLoggedIn()) return children;
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initLine()
      .then(loadSession)
      .finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <Spin size="large" />
      </div>
    );
  }

  const renderRoute = (r) => (
    <Route
      key={r.code}
      path={r.path}
      element={<RequireLogin path={r.path}>{r.element}</RequireLogin>}
    />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {routes.filter((r) => r.layout !== "shop").map(renderRoute)}

        <Route
          element={
            <RequireLogin path="/shop">
              <ShopLayout />
            </RequireLogin>
          }
        >
          {routes.filter((r) => r.layout === "shop").map(renderRoute)}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
