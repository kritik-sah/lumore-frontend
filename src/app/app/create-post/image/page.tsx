"use client";

import { Button } from "@/components/ui/button";
import { createImagePost } from "@/lib/apis";
import { imageCaptionSchema } from "@/lib/validation";
import { getUser } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { TextAreaField } from "../../components/InputField";
import GeneralLayout from "../../components/layout/general";
import VisibilityToggle from "../../components/VisibilityToggle";

const CreateImagePostPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    setFile(nextFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(nextFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image to continue.");
      return;
    }
    const captionResult = imageCaptionSchema.safeParse(caption);
    if (!captionResult.success) {
      toast.error(captionResult.error.issues[0]?.message || "Invalid caption.");
      return;
    }

    setIsSubmitting(true);

    try {
      file &&
        (await createImagePost({
          file,
          caption: captionResult.data,
          visibility,
        }));
      const currentUser = getUser();
      if (currentUser?._id) {
        await queryClient.invalidateQueries({
          queryKey: ["user posts", currentUser._id],
        });
      }
      router.push("/app/profile");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
      handleClear();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GeneralLayout>
      <div className="p-3 h-full overflow-y-auto">
        <div className="max-w-xl mx-auto flex flex-col gap-4 pb-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-shade/70">Create a new post</p>
              <h1 className="text-xl font-semibold text-ui-shade">
                Image Post
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              className="min-w-[96px]"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>

          <div className="border border-ui-shade/10 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ui-shade/70">Upload image</p>
              <div className="flex items-center gap-2">
                {file ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePick}
                  disabled={isSubmitting}
                >
                  Choose
                </Button>
              </div>
            </div>

            <div onClick={handlePick} className="mt-3">
              {preview ? (
                <img
                  src={preview}
                  alt="Selected upload"
                  className="w-full max-h-96 object-cover rounded-lg border border-ui-shade/10"
                />
              ) : (
                <div className="h-48 rounded-lg border border-dashed border-ui-shade/30 flex items-center justify-center text-sm text-ui-shade/60">
                  Tap Choose to select an image (max 5MB)
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <TextAreaField
            label="Caption"
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Say something about this photo..."
            rows={3}
          />

          <div className="border border-ui-shade/10 rounded-xl p-3">
            <p className="text-sm text-ui-shade/70">Visibility</p>
            <div className="mt-2">
              <VisibilityToggle
                field="imagePost"
                currentVisibility={visibility}
                onVisibilityChange={(_, vis) => setVisibility(vis)}
                width="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default CreateImagePostPage;
