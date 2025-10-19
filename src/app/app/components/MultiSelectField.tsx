import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

interface MultiSelectFieldProps {
  label: string;
  options: { label: string; value: string }[];
  value: string[]; // Array of selected language codes
  name: string;
  onChange: (value: string[]) => void;
  placeholder?: string;
  max?: number;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  value,
  name,
  onChange,
  placeholder = "Select options",
  max,
}) => {
  const animatedComponents = makeAnimated();
  return (
    <div className="relative w-full border border-ui-shade/10 rounded-xl p-2">
      <Label className=" text-ui-shade/80">{label}</Label>
      <Select
        className="mt-2 border-0 bg-transparent"
        isMulti
        isSearchable
        components={animatedComponents}
        options={options}
        onChange={(selected) => {
          if (max && selected.length <= max) {
            onChange(selected.map((opt) => opt.value));
          }
        }}
        placeholder
        value={options.filter((opt) => value.includes(opt.value)) || []}
      />
    </div>
  );
};

export default MultiSelectField;
