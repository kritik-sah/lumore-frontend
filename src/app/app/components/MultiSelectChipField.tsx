import { Label } from "@/components/ui/label";
import React from "react";

interface MultiSelectChipFieldProps {
  label: string;
  options: { label: string; value: string }[];
  name: string;
  placeholder?: string;
  max?: number;
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const CHIP_PALETTES = [
  {
    idle: "bg-rose-50 border-rose-200 text-rose-700",
    active: "bg-rose-200 border-rose-300 text-rose-900",
  },
  {
    idle: "bg-amber-50 border-amber-200 text-amber-700",
    active: "bg-amber-200 border-amber-300 text-amber-900",
  },
  {
    idle: "bg-lime-50 border-lime-200 text-lime-700",
    active: "bg-lime-200 border-lime-300 text-lime-900",
  },
  {
    idle: "bg-emerald-50 border-emerald-200 text-emerald-700",
    active: "bg-emerald-200 border-emerald-300 text-emerald-900",
  },
  {
    idle: "bg-cyan-50 border-cyan-200 text-cyan-700",
    active: "bg-cyan-200 border-cyan-300 text-cyan-900",
  },
  {
    idle: "bg-sky-50 border-sky-200 text-sky-700",
    active: "bg-sky-200 border-sky-300 text-sky-900",
  },
  {
    idle: "bg-violet-50 border-violet-200 text-violet-700",
    active: "bg-violet-200 border-violet-300 text-violet-900",
  },
  {
    idle: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
    active: "bg-fuchsia-200 border-fuchsia-300 text-fuchsia-900",
  },
];

const hashText = (text: string) => {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getPaletteForText = (text: string) =>
  CHIP_PALETTES[hashText(text) % CHIP_PALETTES.length];

const MultiSelectChipField: React.FC<MultiSelectChipFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  max,
  multiple = false,
}) => {
  const selectedValues: string[] = multiple
    ? Array.isArray(value)
      ? value
      : []
    : typeof value === "string" && value
      ? [value]
      : [];
  const maxReached = Boolean(multiple && max && selectedValues.length >= max);

  const toggleOption = (optionValue: string) => {
    const isSelected = selectedValues.includes(optionValue);

    if (multiple && isSelected) {
      onChange(selectedValues.filter((item: string) => item !== optionValue));
      return;
    }

    if (multiple) {
      if (maxReached) return;
      onChange([...selectedValues, optionValue]);
      return;
    }

    onChange(optionValue);
  };

  return (
    <div className="relative w-full border border-ui-shade/10 rounded-xl p-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-ui-shade/80">{label}</Label>
        {multiple && max ? (
          <span className="text-xs text-ui-shade/60">
            {selectedValues.length}/{max}
          </span>
        ) : null}
      </div>

      <div
        className={`mt-3 flex flex-wrap gap-2 ${
          multiple ? "max-h-[200px] overflow-y-auto pr-1" : ""
        }`}
      >
        {options.length ? (
          options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const isDisabled = Boolean(multiple && !isSelected && maxReached);
            const palette = getPaletteForText(option.label || option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                disabled={isDisabled}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  isSelected ? palette.active : palette.idle
                } ${isSelected ? "border-ui-shade/30" : ""} ${
                  isDisabled ? "opacity-45 cursor-not-allowed" : ""
                }`}
              >
                {option.label}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-ui-shade/60">{placeholder}</p>
        )}
      </div>
    </div>
  );
};

export default MultiSelectChipField;
