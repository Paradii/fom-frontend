const Card = ({ title, subtitle, extra, children, className = "" }) => {
  return (
    <section
      className={`flex min-w-0 flex-col gap-3.5 rounded-card border border-solid border-line bg-white p-5 ${className}`}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between gap-3">
          <div>
            {title && (
              <h2 className="m-0 font-head text-xl font-semibold">{title}</h2>
            )}
            {subtitle && <div className="text-base text-ink-2">{subtitle}</div>}
          </div>
          {extra}
        </div>
      )}
      {children}
    </section>
  );
};

export default Card;
