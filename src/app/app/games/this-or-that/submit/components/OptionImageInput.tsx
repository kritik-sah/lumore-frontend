"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, RefObject } from "react";

interface OptionImageInputProps {
  label: string;
  preview: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onPick: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const OptionImageInput = ({
  label,
  preview,
  inputRef,
  onPick,
  onChange,
}: OptionImageInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-ui-shade">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-16 w-16 rounded-md bg-ui-shade/10 overflow-hidden border border-ui-shade/10">
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <Button type="button" variant="outline" onClick={onPick}>
          {preview ? "Change image" : "Upload image"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default OptionImageInput;
