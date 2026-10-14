const Logo = ({ size = 40, radius = 12 }) => {
  return (
    <span
      className="flex shrink-0 items-center justify-center bg-brand text-ink"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11h18a9 9 0 0 1-18 0z" />
        <path d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5" />
      </svg>
    </span>
  );
};

export default Logo;
