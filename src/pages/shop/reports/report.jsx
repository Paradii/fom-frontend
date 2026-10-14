import { useEffect, useState } from "react";
import { Button, Segmented } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import PagePattern from "@/layouts/PagePattern";
import { mockOrders, paidTotal } from "@/mock/mockData";
import ReportSummary from "./reportSummary";
import ReportChart from "./reportChart";
import ReportTopMenu from "./reportTopMenu";
import ModalDateRange from "./modalDateRange";

const PERIODS = [
  { label: "รายวัน", value: "day", text: "วันนี้", prevText: "เมื่อวาน" },
  {
    label: "รายสัปดาห์",
    value: "week",
    text: "สัปดาห์นี้",
    prevText: "สัปดาห์ก่อน",
  },
  {
    label: "รายเดือน",
    value: "month",
    text: "เดือนนี้",
    prevText: "เดือนก่อน",
  },
];

const DAY_MS = 24 * 60 * 60000;

const startOfDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const addDays = (date, days) => {
  const day = new Date(date);
  day.setDate(day.getDate() + days);
  return day;
};

const getRange = (period) => {
  const today = startOfDay(new Date());
  if (period === "day") {
    return { from: today, to: today };
  }
  if (period === "week") {
    const monday = addDays(today, -((today.getDay() + 6) % 7));
    return { from: monday, to: addDays(monday, 6) };
  }
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { from: first, to: last };
};

const getPrevRange = (period, range) => {
  if (period === "month") {
    const from = new Date(range.from.getFullYear(), range.from.getMonth() - 1);
    const to = new Date(range.from.getFullYear(), range.from.getMonth(), 0);
    return { from, to };
  }
  const length = Math.round((range.to - range.from) / DAY_MS) + 1;
  return {
    from: addDays(range.from, -length),
    to: addDays(range.from, -1),
  };
};

const inRange = (order, range) => {
  const day = startOfDay(order.createdAt);
  return day >= range.from && day <= range.to;
};

const sumTotal = (orders) => {
  let total = 0;
  orders.forEach((o) => {
    total += paidTotal(o);
  });
  return total;
};

const formatRange = (range) => {
  const toText = range.to.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (range.from.getTime() === range.to.getTime()) return toText;
  const sameMonth =
    range.from.getMonth() === range.to.getMonth() &&
    range.from.getFullYear() === range.to.getFullYear();
  const fromText = sameMonth
    ? range.from.getDate()
    : range.from.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  return `${fromText}–${toText}`;
};

const Report = () => {
  const [period, setPeriod] = useState("week");
  const [range, setRange] = useState(getRange("week"));
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topMenus, setTopMenus] = useState([]);
  const [modal, setModal] = useState({ open: false, data: null });

  useEffect(() => {
    onSearchForm();
  }, [range]);

  const onChangePeriod = (value) => {
    setPeriod(value);
    setRange(getRange(value));
  };

  const onSaveRange = (from, to) => {
    setPeriod(null);
    setRange({ from: startOfDay(from), to: startOfDay(to) });
  };

  const onSearchForm = () => {
    const prevRange = getPrevRange(period, range);
    const current = mockOrders.filter((o) => inRange(o, range));
    const previous = mockOrders.filter((o) => inRange(o, prevRange));

    const done = current.filter((o) => o.status === "completed");
    const prevDone = previous.filter((o) => o.status === "completed");
    const cancelled = current.filter((o) => o.status === "cancelled");
    const total = sumTotal(done);
    const prevTotal = sumTotal(prevDone);
    const closedCount = done.length + cancelled.length;

    setSummary({
      total: total,
      prevTotal: prevTotal,
      orderCount: done.length,
      prevOrderCount: prevDone.length,
      hasPrev: previous.length > 0,
      average: done.length > 0 ? Math.round(total / done.length) : 0,
      prevAverage:
        prevDone.length > 0 ? Math.round(prevTotal / prevDone.length) : 0,
      cancelled: cancelled.length,
      cancelRate: closedCount > 0 ? (cancelled.length / closedCount) * 100 : 0,
    });

    const length = Math.round((range.to - range.from) / DAY_MS) + 1;
    const chart = [];
    for (let i = 0; i < length; i++) {
      const day = addDays(range.from, i);
      const dayOrders = done.filter((o) => {
        return startOfDay(o.createdAt).getTime() === day.getTime();
      });
      chart.push({
        key: day.toISOString(),
        label:
          length <= 7
            ? day.toLocaleDateString("th-TH", { weekday: "short" })
            : String(day.getDate()),
        total: sumTotal(dayOrders),
      });
    }
    setChartData(chart);

    const menuCount = {};
    done.forEach((o) => {
      o.items.forEach((item) => {
        const count = menuCount[item.menuName] || 0;
        menuCount[item.menuName] = count + item.quantity;
      });
    });
    const menus = Object.keys(menuCount).map((menuName) => {
      return { menuName: menuName, quantity: menuCount[menuName] };
    });
    menus.sort((a, b) => b.quantity - a.quantity);
    setTopMenus(menus.slice(0, 5));
  };

  const periodItem = PERIODS.find((p) => p.value === period);
  const periodText = periodItem ? periodItem.text : "ช่วงที่เลือก";
  const subtitle = `${periodText} ${formatRange(range)}`;

  return (
    <PagePattern
      title="สรุปยอดขาย"
      subtitle={`${subtitle} · นับเฉพาะคำสั่งซื้อที่จัดส่งสำเร็จ`}
      extra={
        <div className="flex flex-wrap gap-2">
          <Segmented
            size="large"
            options={PERIODS}
            value={period}
            onChange={onChangePeriod}
          />
          <Button
            icon={<CalendarOutlined />}
            onClick={() => setModal({ open: true, data: range })}
          >
            {period ? "เลือกช่วงวันที่" : formatRange(range)}
          </Button>
        </div>
      }
    >
      {summary && (
        <ReportSummary
          summary={summary}
          prevText={periodItem ? periodItem.prevText : "ช่วงก่อน"}
        />
      )}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <ReportChart chartData={chartData} />
        <ReportTopMenu topMenus={topMenus} />
      </div>

      <ModalDateRange modal={modal} setModal={setModal} onSave={onSaveRange} />
    </PagePattern>
  );
};

export default Report;
