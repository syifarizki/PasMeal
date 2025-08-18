const InputText = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  readOnly = false, 
  errorMessage = "",
}) => {
  const hasError = errorMessage.length > 0;

  return (
    <div className="relative mb-1" data-twe-input-wrapper-init>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          peer block w-full min-h-[auto] rounded-lg border border-gray-300 px-3 py-[0.50rem]
          outline-none transition-all duration-200 ease-linear
          focus:placeholder:opacity-100 peer-focus:text-revamp-neutral-10
          data-[twe-input-state-active]:placeholder:opacity-100
          motion-reduce:transition-none
          [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0
          ${readOnly ? " text-black" : ""}
        `}
        readOnly={readOnly} 
      />

      <label
        className={`
          pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] 
          origin-[0_0] truncate text-neutral-500 transition-all duration-200 ease-out
          motion-reduce:transition-none text-revamp-neutral-10
          ${
            value
              ? "bg-white h-fit -translate-y-[0.9rem] scale-[0.9]"
              : "peer-focus:bg-white mt-[0.57rem] peer-focus:mt-0 peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.9] peer-focus:text-revamp-neutral-10"
          }
          peer-data-[twe-input-state-active]:-translate-y-[0.9rem]
          peer-data-[twe-input-state-active]:scale-[0.9]
        `}
      >
        {label}
      </label>

      {hasError && (
        <div className="flex text-xs text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputText;
