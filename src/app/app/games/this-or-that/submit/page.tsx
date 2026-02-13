"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { submitThisOrThatQuestion } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import SubPageLayout from "../../../components/layout/SubPageLayout";

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

  const canSubmit = useMemo(() => {
    return (
      leftOption.trim().length >= 2 &&
      rightOption.trim().length >= 2 &&
      leftOption.trim().toLowerCase() !== rightOption.trim().toLowerCase() &&
      Boolean(leftImageFile) &&
      Boolean(rightImageFile)
    );
  }, [leftOption, leftImageFile, rightOption, rightImageFile]);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImage = async (src: string, pixelCrop: any) => {
    const image = await createImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Crop failed"));
          resolve(blob);
        },
        "image/jpeg",
        0.92,
      );
    });
  };

  const openCropper = (side: CropSide, file?: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCropTarget(side);
    setImageSrc(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onSelectImage = (side: CropSide, e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err) {
      console.error("Failed to crop image", err);
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
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to submit your question";
      setError(message);
    }
  };

  return (
    <SubPageLayout title="Submit This Or That">
      <div className="h-full overflow-y-auto bg-ui-background/10 p-4">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-ui-shade/10 bg-white p-5">
          <h1 className="text-xl font-semibold text-ui-shade">
            Submit a This Or That
          </h1>
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
            <div>
              <label className="text-sm font-medium text-ui-shade">
                Option A Image
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 rounded-md bg-ui-shade/10 overflow-hidden border border-ui-shade/10">
                  {leftPreview ? (
                    <img
                      src={leftPreview}
                      alt="Option A preview"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => leftInputRef.current?.click()}
                >
                  {leftPreview ? "Change image" : "Upload image"}
                </Button>
                <input
                  ref={leftInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => onSelectImage("left", e)}
                />
              </div>
            </div>

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
            <div>
              <label className="text-sm font-medium text-ui-shade">
                Option B Image
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 rounded-md bg-ui-shade/10 overflow-hidden border border-ui-shade/10">
                  {rightPreview ? (
                    <img
                      src={rightPreview}
                      alt="Option B preview"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => rightInputRef.current?.click()}
                >
                  {rightPreview ? "Change image" : "Upload image"}
                </Button>
                <input
                  ref={rightInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => onSelectImage("right", e)}
                />
              </div>
            </div>

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
      {imageSrc && cropTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-ui-light p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ui-shade">
                Crop {cropTarget === "left" ? "Option A" : "Option B"} Image
              </h3>
              <Button variant="ghost" size="icon" onClick={closeCropper}>
                <Icon name="MdOutlineClose" />
              </Button>
            </div>
            <div className="relative mt-4 h-72 w-full overflow-hidden rounded-lg bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
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
                onChange={(e) => setZoom(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" className="w-full" onClick={closeCropper}>
                Cancel
              </Button>
              <Button className="w-full" onClick={saveCroppedImage}>
                Save crop
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </SubPageLayout>
  );
};

export default SubmitThisOrThatPage;
