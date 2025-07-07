import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

// This is a re-export for consistency with your usage request
export type { Hook, DateOption };

export type DatePickerProps = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  hint?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  name,
  value,
  onInput,
  error,
  hint,
}: DatePickerProps) {
  useEffect(() => {
    const isTimeMode = mode === "time";
    const dateFormat = isTimeMode ? "H:i" : "d-m-Y";
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat,
      enableTime: isTimeMode,
      noCalendar: isTimeMode,
      time_24hr: isTimeMode ? true : undefined,
      defaultDate,
      onChange,
    });
    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          name={name}
          value={value}
          onInput={onInput}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800 ${error ? 'border-red-500' : ''}`}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
      {hint && <p className="text-red-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}
