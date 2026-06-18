"use client";

import EditableFieldCard from "../shared/EditableFieldCard";

interface SettingFieldCardProps {
  label: string;
  field: string;
  value?: string;
  onClick: () => void;
}

const SettingFieldCard = ({
  label,
  field,
  value,
  onClick,
}: SettingFieldCardProps) => (
  <EditableFieldCard
    label={label}
    field={field}
    value={value}
    onEdit={() => onClick()}
  />
);

export default SettingFieldCard;

