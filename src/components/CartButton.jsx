import { RiShoppingBag4Fill } from "react-icons/ri";

export default function CartButton({
  onClick,
  totalCartItems = 0,
  bgColor = "bg-black/20",
  iconColor = "text-white",
  badgeColor = "bg-primary",
  badgeTextColor = "text-white",
}) {
  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        className={`p-3 rounded-full shadow-lg transition cursor-pointer ${bgColor}`}
      >
        <RiShoppingBag4Fill
          className={`${iconColor} font-extrabold text-2xl md:text-3xl`}
        />
      </button>

      {totalCartItems > 0 && (
        <span
          className={`absolute -top-2 -right-3 ${badgeColor} rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold ${badgeTextColor}`}
        >
          {totalCartItems}
        </span>
      )}
    </div>
  );
}
