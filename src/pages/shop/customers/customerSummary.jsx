const CustomerSummary = ({ summary }) => {
  const items = [
    { label: "ลูกค้าทั้งหมด", value: summary.total },
    { label: "ลูกค้าประจำ (3 ครั้งขึ้นไปใน 30 วัน)", value: summary.regular },
    { label: "ลูกค้าใหม่เดือนนี้", value: summary.newThisMonth },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-card border border-solid border-line bg-white p-5"
        >
          <div className="text-sm text-ink-2">{item.label}</div>
          <div className="mt-1 font-head text-[30px] font-semibold md:text-[32px]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerSummary;
