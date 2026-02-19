"use client";

import { ProfilePageLoader } from "@/components/page-loaders";
import { uploadProfilePicture } from "@/lib/apis";
import { queryClient } from "@/service/query-client";
import { languageDisplay } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import Field from "./profile/edit/Field";
import FieldEditor from "./profile/edit/FieldEditor";
import { calculateProfileCompletion } from "./profile/edit/profileCompletion";
import ProfileImageCropModal from "./profile/edit/ProfileImageCropModal";
import { createProfileSchema, ProfileFormValues } from "./profile/edit/profileSchema";
import Section from "./profile/edit/Section";

const EditMyProfile = ({ user: initialUser }: { user: any }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState("");

  const { user, isLoading, updateField, updateVisibility } = useUser(
    initialUser._id,
  );
  const formSchema = useMemo(
    () => createProfileSchema(initialUser?.username),
    [initialUser?.username],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username,
      nickname: user?.nickname,
      realName: user?.realName,
      phoneNumber: user?.phoneNumber,
      bloodGroup: user?.bloodGroup,
      interests: user?.interests,
      bio: user?.bio,
      gender: user?.gender,
      religion: user?.religion,
      dob: user?.dob
        ? new Date(user.dob).toISOString().split("T")[0]
        : undefined,
      height: user?.height,
      hometown: user?.hometown,
      diet: user?.diet,
      zodiacSign: user?.zodiacSign,
      lifestyle: user?.lifestyle,
      work: user?.work,
      institution: user?.institution,
      maritalStatus: user?.maritalStatus,
      languages: user?.languages,
      personalityType: user?.personalityType,
    },
  });

  const handleEditField = (field: string) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (field: string, value: any) => {
    try {
      await updateField({ field, value });
      form.setValue(field as any, value);
      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleVisibilityChange = async (field: string, visibility: string) => {
    try {
      await updateVisibility({ field, visibility });
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setImageSrc(objectUrl);
    setIsCropOpen(true);
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
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

  const resetCropState = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setSelectedFile(null);
    setIsCropOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const croppedFile = new File(
        [croppedBlob],
        selectedFile?.name || "profile.jpg",
        { type: croppedBlob.type || "image/jpeg" },
      );
      const response = await uploadProfilePicture(croppedFile);
      setPreview(response?.profilePicture || null);
      queryClient.invalidateQueries({ queryKey: ["user", user?.userId] });
      resetCropState();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : null) ||
        "Image upload failed. Please try again.";

      toast.error(message);
      setPreview(null);
      resetCropState();
      console.error("Upload error:", message);
    } finally {
      setIsUploading(false);
    }
  };

  const { completionPercent, missingCount } = useMemo(
    () => calculateProfileCompletion(user),
    [user],
  );

  if (isLoading) {
    return <ProfilePageLoader />;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto pb-10">
        <FieldEditor
          isOpen={isEditFieldOpen}
          setIsOpen={setIsEditFieldOpen}
          fieldType={editFieldType}
          onUpdate={handleFieldUpdate}
          currentValue={form.getValues(editFieldType as any)}
          form={form}
          currentUsername={user?.username}
        />

        <div
          className="flex items-center justify-start gap-3 cursor-pointer"
          onClick={handleAvatarClick}
        >
          <div className="h-20 w-20 bg-ui-highlight rounded-full overflow-hidden">
            {preview || user?.profilePicture ? (
              <picture>
                <img
                  src={preview || user?.profilePicture}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </picture>
            ) : (
              <div className="h-full w-full bg-gray-300 rounded-full" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">
            Change Profile Picture
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <ProfileImageCropModal
          isOpen={isCropOpen}
          imageSrc={imageSrc}
          crop={crop}
          zoom={zoom}
          isUploading={isUploading}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          onCancel={resetCropState}
          onSave={handleCropSave}
        />

        <div className="mt-4 rounded-2xl border border-ui-shade/10 bg-white p-4">
          <p className="text-sm text-ui-shade/70">Profile completeness</p>
          <div className="mt-2 h-2 w-full rounded-full bg-ui-shade/10">
            <div
              className="h-2 rounded-full bg-ui-highlight"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-ui-shade mt-2">
            {completionPercent}% complete
            {missingCount > 0 ? ` - ${missingCount} left` : ""}
          </p>
        </div>

        <Section
          title="Basics"
          description="Help people recognize you quickly."
        >
          <Field
            label="Username"
            field="username"
            value={user.username}
            onEdit={handleEditField}
          />
          <Field
            label="Nickname"
            field="nickname"
            value={user.nickname}
            onEdit={handleEditField}
          />
          <Field
            label="Real Name"
            field="realName"
            value={user.realName}
            onEdit={handleEditField}
          />
        </Section>

        <Section title="About" description="Share a little about yourself.">
          <Field
            label="Bio"
            field="bio"
            value={user.bio}
            onEdit={handleEditField}
          />
          <Field
            label="Interests"
            field="interests"
            value={user.interests.join(", ")}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.interests}
            onVisibilityChange={handleVisibilityChange}
          />
        </Section>

        <Section
          title="Details"
          description="Personal details you can control visibility for."
        >
          <Field
            label="Gender"
            field="gender"
            value={user.gender}
            onEdit={handleEditField}
          />
          <Field
            label="Birthday"
            field="dob"
            value={
              user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"
            }
            onEdit={handleEditField}
          />
          <Field
            label="Blood Group"
            field="bloodGroup"
            value={user.bloodGroup}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.bloodGroup}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Height"
            field="height"
            value={user.height ? `${user.height}cm` : "Not set"}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.height}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Religion"
            field="religion"
            value={user.religion}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.religion}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Marital Status"
            field="maritalStatus"
            value={user.maritalStatus}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.maritalStatus}
            onVisibilityChange={handleVisibilityChange}
          />
        </Section>

        <Section title="Lifestyle" description="Lifestyle helps build matches.">
          <Field
            label="Diet"
            field="diet"
            value={user.diet}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.diet}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Zodiac Sign"
            field="zodiacSign"
            value={user.zodiacSign}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.zodiacSign}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Lifestyle"
            field="lifestyle"
            value={
              <>
                {user.lifestyle?.drinking ? (
                  <p>{user.lifestyle.drinking}</p>
                ) : null}
                {user.lifestyle?.smoking ? (
                  <p>{user.lifestyle.smoking}</p>
                ) : null}
                {user.lifestyle?.pets ? <p>{user.lifestyle.pets}</p> : null}
              </>
            }
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.lifestyle}
            onVisibilityChange={handleVisibilityChange}
          />
        </Section>

        <Section title="Background" description="Education and work.">
          <Field
            label="Work"
            field="work"
            value={user.work}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.work}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="University"
            field="institution"
            value={user.institution}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.institution}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Languages"
            field="languages"
            value={languageDisplay(user.languages)?.join(", ")}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.languages}
            onVisibilityChange={handleVisibilityChange}
          />
          <Field
            label="Personality Type"
            field="personalityType"
            value={user.personalityType}
            onEdit={handleEditField}
            visibility={user.fieldVisibility?.personalityType}
            onVisibilityChange={handleVisibilityChange}
          />
        </Section>
      </div>
    </div>
  );
};

export default EditMyProfile;
