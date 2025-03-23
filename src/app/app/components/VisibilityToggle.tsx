import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface VisibilityToggleProps {
  field: string;
  currentVisibility: string;
  onVisibilityChange: (field: string, visibility: string) => void;
}

const VisibilityToggle = ({
  field,
  currentVisibility,
  onVisibilityChange,
}: VisibilityToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentVisibility}
        onValueChange={(value) => onVisibilityChange(field, value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="unlocked">Unlocked</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VisibilityToggle;
