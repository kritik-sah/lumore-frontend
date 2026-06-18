"use client";

import type { ReactNode } from "react";
import EditableFieldCard from "../../shared/EditableFieldCard";

interface FieldProps {
  label: string;
  field: string;
  value?: ReactNode;
  onEdit: (field: string) => void;
  visibility?: string;
  onVisibilityChange?: (field: string, visibility: string) => void;
  children?: ReactNode;
}

const Field = ({
  label,
  field,
  value,
  onEdit,
  visibility,
  onVisibilityChange,
  children,
}: FieldProps) => (
  <EditableFieldCard
    label={label}
    field={field}
    value={value}
    onEdit={onEdit}
    visibility={visibility}
    onVisibilityChange={onVisibilityChange}
    children={children}
  />
);

export default Field;

