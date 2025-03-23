import React, { useState } from "react";

interface MultiSelectFieldProps {
  label: string;
  options: { label: string; value: string }[];
  value: string[]; // Array of selected language codes
  name: string;
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  value,
  name,
  onChange,
  placeholder = "Select options",
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelection = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue)); // Remove if already selected
    } else {
      onChange([...value, selectedValue]); // Add if not selected
    }
  };

  return (
    <div className="relative w-full">
      <label className="text-sm text-ui-shade/60">{label}</label>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-left"
        onClick={() => setOpen(!open)}
      >
        {value.length > 0
          ? value
              .map((v) => options.find((o) => o.value === v)?.label)
              .join(", ")
          : placeholder}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSelection(option.value)}
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggleSelection(option.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectField;
