"use client";

import type { ReactNode } from "react";
import VisibilityToggle from "../VisibilityToggle";

export interface EditableFieldConfig {
  label: string;
  field: string;
  value?: ReactNode;
  onEdit: (field: string) => void;
  visibility?: string;
  onVisibilityChange?: (field: string, visibility: string) => void;
  children?: ReactNode;
}

const EditableFieldCard = ({
  label,
  field,
  value,
  onEdit,
  visibility,
  onVisibilityChange,
  children,
}: EditableFieldConfig) => (
  <div
    onClick={() => onEdit(field)}
    className="border border-ui-shade/10 rounded-xl p-3 mt-3"
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm text-ui-shade/60">{label}</h3>
        {children || value || "Not set"}
      </div>
      {visibility !== undefined && onVisibilityChange ? (
        <VisibilityToggle
          field={field}
          currentVisibility={visibility}
          onVisibilityChange={onVisibilityChange}
          onClick={(event) => event.stopPropagation()}
        />
      ) : null}
    </div>
  </div>
);

export default EditableFieldCard;


