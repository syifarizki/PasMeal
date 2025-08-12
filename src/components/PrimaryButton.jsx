import React from "react";

const PrimaryButton = ({
  text,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-2.5 px-4 rounded-lg font-semibold transition 
        ${
          disabled
            ? "bg-[#C4C3C5] text-white cursor-not-allowed"
            : "bg-secondary text-white shadow-lg cursor-pointer"
        } 
        ${className}`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
