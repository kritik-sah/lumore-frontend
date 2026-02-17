"use client";

import { Button } from "@/components/ui/button";
import { submitThisOrThatQuestion } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import SubPageLayout from "../../../components/layout/SubPageLayout";
import CropImageModal from "./components/CropImageModal";
import { getCroppedImage } from "./components/imageCrop";
import OptionImageInput from "./components/OptionImageInput";

type CropSide = "left" | "right";

const SubmitThisOrThatPage = () => {
  const router = useRouter();
  const [leftOption, setLeftOption] = useState("");
  const [rightOption, setRightOption] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [leftImageFile, setLeftImageFile] = useState<File | null>(null);
  const [rightImageFile, setRightImageFile] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string | null>(null);
  const [rightPreview, setRightPreview] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<CropSide | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const leftInputRef = useRef<HTMLInputElement | null>(null);
  const rightInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: submitThisOrThatQuestion,
  });

  const canSubmit = useMemo(
    () =>
      leftOption.trim().length >= 2 &&
      rightOption.trim().length >= 2 &&
      leftOption.trim().toLowerCase() !== rightOption.trim().toLowerCase() &&
      Boolean(leftImageFile) &&
      Boolean(rightImageFile),
    [leftImageFile, leftOption, rightImageFile, rightOption],
  );

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const openCropper = (side: CropSide, file?: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCropTarget(side);
    setImageSrc(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onSelectImage = (side: CropSide, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openCropper(side, file);
  };

  const closeCropper = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCropTarget(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const saveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !cropTarget) return;
    try {
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const fileName =
        cropTarget === "left" ? "this-or-that-left.jpg" : "this-or-that-right.jpg";
      const croppedFile = new File([croppedBlob], fileName, {
        type: croppedBlob.type || "image/jpeg",
      });
      const preview = URL.createObjectURL(croppedBlob);

      if (cropTarget === "left") {
        if (leftPreview) URL.revokeObjectURL(leftPreview);
        setLeftImageFile(croppedFile);
        setLeftPreview(preview);
      } else {
        if (rightPreview) URL.revokeObjectURL(rightPreview);
        setRightImageFile(croppedFile);
        setRightPreview(preview);
      }
      closeCropper();
    } catch (cropError) {
      console.error("Failed to crop image", cropError);
      setError("Could not process image. Please try another one.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Provide two different options and upload both images.");
      return;
    }

    try {
      await mutateAsync({
        leftOption: leftOption.trim(),
        leftImage: leftImageFile as File,
        rightOption: rightOption.trim(),
        rightImage: rightImageFile as File,
        category: category.trim() || "general",
      });
      router.push("/app/games/this-or-that");
    } catch (submitError: any) {
      const message =
        submitError?.response?.data?.message ||
        (submitError instanceof Error ? submitError.message : null) ||
        "Failed to submit your question";
      setError(message);
    }
  };

  return (
    <SubPageLayout title="Submit This Or That">
      <div className="h-full overflow-y-auto bg-ui-background/10 p-4">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-ui-shade/10 bg-white p-5">
          <h1 className="text-xl font-semibold text-ui-shade">Submit a This Or That</h1>
          <p className="mt-1 text-sm text-ui-shade/70">
            Your question will be reviewed before it appears for everyone.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-ui-shade">Option A</label>
              <input
                value={leftOption}
                onChange={(e) => setLeftOption(e.target.value)}
                maxLength={120}
                placeholder="e.g. Road trip"
                className="mt-2 h-11 w-full rounded-lg border border-ui-shade/20 px-3 outline-none focus:border-ui-highlight"
              />
            </div>

            <OptionImageInput
              label="Option A Image"
              preview={leftPreview}
              inputRef={leftInputRef}
              onPick={() => leftInputRef.current?.click()}
              onChange={(e) => onSelectImage("left", e)}
            />

            <div>
              <label className="text-sm font-medium text-ui-shade">Option B</label>
              <input
                value={rightOption}
                onChange={(e) => setRightOption(e.target.value)}
                maxLength={120}
                placeholder="e.g. Staycation"
                className="mt-2 h-11 w-full rounded-lg border border-ui-shade/20 px-3 outline-none focus:border-ui-highlight"
              />
            </div>

            <OptionImageInput
              label="Option B Image"
              preview={rightPreview}
              inputRef={rightInputRef}
              onPick={() => rightInputRef.current?.click()}
              onChange={(e) => onSelectImage("right", e)}
            />

            <div>
              <label className="text-sm font-medium text-ui-shade">
                Category (optional)
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={60}
                placeholder="e.g. travel, food, lifestyle"
                className="mt-2 h-11 w-full rounded-lg border border-ui-shade/20 px-3 outline-none focus:border-ui-highlight"
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/app/games/this-or-that")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit || isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <CropImageModal
        imageSrc={imageSrc}
        label={cropTarget === "left" ? "Option A" : "Option B"}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onCancel={closeCropper}
        onSave={saveCroppedImage}
      />
    </SubPageLayout>
  );
};

export default SubmitThisOrThatPage;
