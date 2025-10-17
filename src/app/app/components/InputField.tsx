"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSlider } from "@/components/ui/MultiSlider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";

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
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <Label className="text-ui-shade/80">{label}</Label>
      <div className="my-2">
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
      </div>
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
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <Label className=" text-ui-shade/80">{label}</Label>
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-2 focus-visible:outline-none focus-visible:ring-0 border-0 shadow-none resize-none my-2"
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
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <Label className=" text-ui-shade/80">{label}</Label>
      <div className="my-3">
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
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

interface MultisliderFieldProps {
  unit: string;
  label: string;
  value: number[];
  name: string;
  onChange: (e: any) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  min?: number;
  max?: number;
}

export const MultisliderField: React.FC<MultisliderFieldProps> = ({
  unit,
  label,
  value,
  onChange,
  error,
  min,
  max,
}) => {
  return (
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <div className="flex items-center justify-between">
        <Label className="text-ui-shade/80">{label}</Label>
        <span>{`${value[0]}${unit} - ${value[1]}${unit}`}</span>
      </div>
      <div className="my-3">
        <MultiSlider
          value={value || [min, max]}
          onValueChange={onChange}
          min={min}
          max={max}
          step={1}
        />
        <div className="flex items-center justify-between text-xs mt-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
export const SliderField: React.FC<MultisliderFieldProps> = ({
  unit,
  label,
  value,
  onChange,
  error,
  min,
  max,
}) => {
  return (
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <div className="flex items-center justify-between">
        <Label className="text-ui-shade/80">{label}</Label>
        <span>{`${value}${unit}`}</span>
      </div>
      <div className="my-3">
        <Slider
          value={value || [10]}
          onValueChange={(e) => onChange(e[0])}
          min={min}
          max={max}
          step={1}
        />
        <div className="flex items-center justify-between text-xs mt-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
