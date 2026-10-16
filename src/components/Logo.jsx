import FoodIcon from "./FoodIcon";

const Logo = ({ size = 40, radius = 12, className = "bg-brand text-ink" }) => {
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <FoodIcon size={Math.round(size * 0.55)} />
    </span>
  );
};

export default Logo;
