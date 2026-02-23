"use client";

import type { SelectOption } from "@/lib/options";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "select"
  | "multiselect"
  | "range"
  | "slider";

export interface Field {
  type: FieldType;
  place: "user" | "prefrence" | "password";
  name: string;
  label: string;
  required?: boolean;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number | number[];
  placeholder?: string;
  helperText?: string;
  errorText?: string;
}

export interface Screen {
  title: string;
  fields: Field[];
}
