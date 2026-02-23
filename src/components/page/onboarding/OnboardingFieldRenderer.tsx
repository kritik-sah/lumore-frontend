"use client";

import DateField from "@/app/app/components/DateField";
import MultiSelectChipField from "@/app/app/components/MultiSelectChipField";
import {
  MultisliderField,
  SliderField,
  TextField,
} from "@/app/app/components/InputField";
import type { Field } from "./types";

interface OnboardingFieldRendererProps {
  field: Field;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

const OnboardingFieldRenderer = ({
  field,
  value,
  onChange,
}: OnboardingFieldRendererProps) => {
  if (field.type === "date") {
    return (
      <DateField
        label={field.label}
        value={value as string}
        onChange={(date) => onChange(field.name, date)}
        placeholder={(value as string) || field.helperText}
      />
    );
  }

  if (field.type === "select") {
    return (
      <MultiSelectChipField
        label={field.label}
        options={field.options || []}
        value={(value as string) || ""}
        name={field.name}
        multiple={false}
        onChange={(option) => onChange(field.name, option)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "multiselect") {
    return (
      <MultiSelectChipField
        label={field.label}
        max={field.max || 5}
        options={field.options || []}
        value={(value as string[]) || []}
        name={field.name}
        multiple
        onChange={(options) => onChange(field.name, options)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "range") {
    return (
      <MultisliderField
        unit={field.unit || ""}
        name={field.name}
        label={field.label}
        value={(value as number[]) || [field.min, field.max]}
        onChange={(range) => onChange(field.name, range)}
        min={field.min}
        max={field.max}
      />
    );
  }

  if (field.type === "slider") {
    return (
      <SliderField
        unit={field.unit || ""}
        name={field.name}
        label={field.label}
        value={[(value as number) || (field.min as number)]}
        onChange={(nextValue) => onChange(field.name, nextValue)}
        min={field.min}
        max={field.max}
      />
    );
  }

  return (
    <TextField
      label={field.label}
      value={(value as string) || ""}
      name={field.name}
      onChange={(e) => onChange(field.name, e.target.value)}
      placeholder={field.placeholder}
      type={
        field.type === "email"
          ? "email"
          : field.type === "password"
            ? "password"
            : field.type === "number" && field.name === "phoneNumber"
              ? "tel"
              : "text"
      }
    />
  );
};

export default OnboardingFieldRenderer;
