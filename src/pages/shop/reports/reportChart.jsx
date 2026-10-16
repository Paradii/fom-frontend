import { Card } from "@/components";

const ReportChart = ({ chartData }) => {
  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);
  const isLong = chartData.length > 7;

  const showLabel = (index) => {
    if (!isLong) return true;
    return index === 0 || (index + 1) % 5 === 0;
  };

  return (
    <Card
      title="ยอดขายรายวัน"
      extra={<span className="text-[13px] text-ink-2">บาท</span>}
    >
      <div
        className={`flex h-[320px] items-end ${isLong ? "gap-0.5" : "gap-2 sm:gap-4"}`}
      >
        {chartData.map((d, index) => (
          <div
            key={d.key}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
          >
            {!isLong && (
              <span className="text-xs text-ink-2 sm:text-base">
                {d.total.toLocaleString("th-TH")}
              </span>
            )}
            <div
              className={`w-full max-w-[56px] rounded-t-lg ${
                d.total === maxTotal ? "bg-brand-strong" : "bg-[#FFDF8A]"
              }`}
              style={{ height: `${(d.total / maxTotal) * 78}%` }}
            />
            <div className="h-px w-full bg-line" />
            <span className="h-6 text-[13px] text-ink-2 sm:text-base">
              {showLabel(index) ? d.label : ""}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReportChart;
