import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ShopLayout from "@/layouts/ShopLayout";
import { routes } from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shop/orders" />} />
        {routes
          .filter((r) => r.layout !== "shop")
          .map((r) => (
            <Route key={r.code} path={r.path} element={r.element} />
          ))}

        <Route element={<ShopLayout />}>
          {routes
            .filter((r) => r.layout === "shop")
            .map((r) => (
              <Route key={r.code} path={r.path} element={r.element} />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
