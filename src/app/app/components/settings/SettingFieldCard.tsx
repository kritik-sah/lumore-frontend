"use client";

interface SettingFieldCardProps {
  label: string;
  value?: string;
  onClick: () => void;
}

const SettingFieldCard = ({ label, value, onClick }: SettingFieldCardProps) => (
  <div onClick={onClick} className="border border-ui-shade/10 rounded-xl p-2 mt-3">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm text-ui-shade/60">{label}</h3>
        {value || "Not set"}
      </div>
    </div>
  </div>
);

export default SettingFieldCard;
