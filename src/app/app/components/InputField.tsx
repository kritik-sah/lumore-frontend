"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface TextFieldProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  min?: number;
  max?: number;
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}

interface SelectFieldProps {
  label: string;
  value: string;
  name: string;
  onChange: (value: string) => void; // Select returns only the selected value, not an event
  placeholder?: string;
  error?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  name,
  onChange,
  placeholder = "",
  error,
  type,
  min,
  max,
}) => {
  return (
    <div className="border border-ui-shade/10 rounded-xl p-2 mt-3">
      <Label className="text-sm text-ui-shade/60">{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={`p-2 focus-visible:outline-none focus-visible:ring-0 border-0 shadow-none`}
        type={type}
        min={min}
        max={max}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  name,
  onChange,
  placeholder = "",
  error,
  rows = 4,
}) => {
  return (
    <div className="border border-ui-shade/10 rounded-xl p-2 mt-3">
      <Label className="text-sm text-ui-shade/60">{label}</Label>
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-2 focus-visible:outline-none focus-visible:ring-0 border-0 shadow-none resize-none"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  name,
  onChange,
  placeholder = "Select an option",
  error,
  options,
  defaultValue,
}) => {
  return (
    <div className="border border-ui-shade/10 rounded-xl p-2 mt-3">
      <Label className="text-sm text-ui-shade/60">{label}</Label>
      <Select
        onValueChange={onChange}
        value={value}
        defaultValue={defaultValue}
        name={name}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-96">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
