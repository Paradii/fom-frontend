import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, App as AntApp } from "antd";
import thTH from "antd/locale/th_TH";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import App from "./app/App";
import { theme } from "./app/theme";
import "./styles/index.css";

dayjs.extend(buddhistEra);
thTH.DatePicker.lang.yearFormat = "BBBB";
thTH.DatePicker.lang.cellYearFormat = "BBBB";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={theme} locale={thTH}>
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
