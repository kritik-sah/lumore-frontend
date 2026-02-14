"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";

interface CropImageModalProps {
  imageSrc: string | null;
  label: string;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (_: any, croppedPixels: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CropImageModal = ({
  imageSrc,
  label,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onSave,
}: CropImageModalProps) => {
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-ui-light p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ui-shade">Crop {label} Image</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <Icon name="MdOutlineClose" />
          </Button>
        </div>
        <div className="relative mt-4 h-72 w-full overflow-hidden rounded-lg bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4">
          <label className="text-sm text-ui-shade/70">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="w-full" onClick={onSave}>
            Save crop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropImageModal;
