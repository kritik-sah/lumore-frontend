"use client";

import type { ReactNode } from "react";
import VisibilityToggle from "../../VisibilityToggle";

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
  <div
    onClick={() => onEdit(field)}
    className="border border-ui-shade/10 rounded-xl p-3 mt-3"
  >
    <div className="flex justify-between items-center">
      <div className="text-lg">
        <h3 className="text-base text-ui-shade/60">{label}</h3>
        {children || value || "Not set"}
      </div>
      {visibility !== undefined && onVisibilityChange ? (
        <VisibilityToggle
          field={field}
          currentVisibility={visibility}
          onVisibilityChange={onVisibilityChange}
          onClick={(e) => e.stopPropagation()}
        />
      ) : null}
    </div>
  </div>
);

export default Field;
