import { formatPrice } from "@/utils/format";

const GREEN = "text-[#0E6E5C]";
const RED = "text-[#8A1C1C]";
const GRAY = "text-ink-3";

const ReportSummary = ({ summary, prevText }) => {
  const totalPercent =
    summary.hasPrev && summary.prevTotal > 0
      ? Math.round(
          ((summary.total - summary.prevTotal) / summary.prevTotal) * 100,
        )
      : null;
  const countDiff = summary.orderCount - summary.prevOrderCount;
  const averageDiff = summary.average - summary.prevAverage;
  const averageSign = averageDiff >= 0 ? "+" : "−";
  const averageText = `${averageSign}${formatPrice(Math.abs(averageDiff))}`;

  const getColor = (value) => {
    return value >= 0 ? GREEN : RED;
  };

  const items = [
    {
      label: "ยอดขาย",
      value: formatPrice(summary.total),
      note:
        totalPercent === null
          ? `ยังไม่มีข้อมูล${prevText}`
          : `${totalPercent >= 0 ? "+" : ""}${totalPercent}% จาก${prevText}`,
      color: totalPercent === null ? GRAY : getColor(totalPercent),
    },
    {
      label: "คำสั่งซื้อ",
      value: summary.orderCount,
      note: summary.hasPrev
        ? `${countDiff >= 0 ? "+" : ""}${countDiff} จาก${prevText}`
        : `ยังไม่มีข้อมูล${prevText}`,
      color: summary.hasPrev ? getColor(countDiff) : GRAY,
    },
    {
      label: "เฉลี่ยต่อบิล",
      value: formatPrice(summary.average),
      note: summary.hasPrev ? averageText : `ยังไม่มีข้อมูล${prevText}`,
      color: summary.hasPrev ? getColor(averageDiff) : GRAY,
    },
    {
      label: "ยกเลิก",
      value: summary.cancelled,
      note: `${summary.cancelRate.toFixed(1)}% ของคำสั่งซื้อ`,
      color: RED,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-card border border-solid border-line bg-white p-5"
        >
          <div className="text-sm text-ink-2">{item.label}</div>
          <div className="mt-1 font-head text-[30px] font-semibold md:text-[32px]">
            {item.value}
          </div>
          <div className={`text-[13px] ${item.color}`}>{item.note}</div>
        </div>
      ))}
    </div>
  );
};

export default ReportSummary;
