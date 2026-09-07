import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const AnimatedDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex w-full items-center justify-between
          rounded-lg border border-slate-200
          bg-white px-3 py-2.5
          text-sm
          transition-all duration-200
          outline-none

          ${
            open
              ? "border-blue-500 ring-4 ring-blue-500/10"
              : "hover:border-slate-300"
          }
        `}
      >
        <span
          className={
            selectedOption
              ? "text-slate-700"
              : "text-slate-400"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`
            text-slate-400
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}

      <div
        className={`
          absolute left-0 right-0 top-full z-50 mt-2
          origin-top
          overflow-hidden
          rounded-xl
          border border-slate-200
          bg-white
          shadow-xl shadow-slate-900/10

          transition-all duration-200

          ${
            open
              ? "visible scale-100 opacity-100"
              : "invisible scale-95 opacity-0"
          }
        `}
      >
        <div className="p-1.5">
          {options.map((option) => {
            const isSelected =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  flex w-full items-center
                  justify-between
                  rounded-lg
                  px-3 py-2.5
                  text-left
                  text-sm
                  transition-colors duration-150

                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check
                    size={16}
                    className="text-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedDropdown;