"use client";

import DateField from "@/app/app/components/DateField";
import {
  MultisliderField,
  SelectField,
  SliderField,
  TextField,
} from "@/app/app/components/InputField";
import MultiSelectField from "@/app/app/components/MultiSelectField";
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
      <SelectField
        label={field.label}
        options={field.options || []}
        value={value as string}
        name={field.name}
        onChange={(option) => onChange(field.name, option)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "multiselect") {
    return (
      <MultiSelectField
        label={field.label}
        max={5}
        options={field.options || []}
        value={(value as string[]) || []}
        name={field.name}
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
    />
  );
};

export default OnboardingFieldRenderer;
