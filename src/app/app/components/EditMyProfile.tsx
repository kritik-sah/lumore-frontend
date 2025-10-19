"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateFieldVisibility, uploadProfilePicture } from "@/lib/apis";
import allLanguages from "@/lib/languages.json";
import {
  bloodTypeOptions,
  dietOptions,
  drinkingOptions,
  genderOptions,
  interestOptions,
  languageOptions,
  maritalStatusOptions,
  personalityTypeOptions,
  petOptions,
  religionOptions,
  smokingOptions,
  zodiacOptions,
} from "@/lib/options";
import { queryClient } from "@/service/query-client";
import { languageDisplay } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import * as z from "zod";
import { useUser } from "../hooks/useUser";
import DateField from "./DateField";
import { SelectField, TextAreaField, TextField } from "./InputField";
import MultiSelectField from "./MultiSelectField";
import VisibilityToggle from "./VisibilityToggle";

// Form validation schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  nickname: z.string().min(1, "Nickname must be at least 1 characters"),
  realName: z.string().min(2, "Real name must be at least 2 characters"),
  interests: z.array(z.string()).max(5),
  languages: z.array(z.string()).max(5),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  dob: z.string(),
  height: z.string().regex(/^\d{2,3}$/, "Height must be a valid number in cm"),
  work: z.string().optional(),
  institution: z.string().optional(),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message:
        "Invalid phone number format. Please enter a valid international phone number.",
    })
    .optional(),
  bloodGroup: z.enum(bloodTypeOptions.map((option) => option.value)),
  gender: z.enum(genderOptions.map((option) => option.value)),

  hometown: z.string(),
  diet: z.enum(dietOptions.map((option) => option.value)),
  zodiacSign: z.enum(zodiacOptions.map((option) => option.value)),
  lifestyle: z.object({
    drinking: z.enum(drinkingOptions.map((option) => option.value)),
    smoking: z.enum(smokingOptions.map((option) => option.value)),
    pets: z.enum(petOptions.map((option) => option.value)),
  }),

  maritalStatus: z.enum(maritalStatusOptions.map((option) => option.value)),

  personalityType: z.enum(personalityTypeOptions.map((option) => option.value)),
  religion: z.enum(religionOptions.map((option) => option.value)),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditMyProfile = ({ user: initialUser }: { user: any }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState("");

  const { user, isLoading, updateField, updateVisibility, isUpdating } =
    useUser(initialUser._id);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
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

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const response = await uploadProfilePicture(file);
      console.log("Upload success:", response);
      queryClient.invalidateQueries({ queryKey: ["user", user?.userId] });
    } catch (error) {
      console.error(
        "Upload error:",
        error instanceof Error ? error.message : error
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          isLoading={isUpdating}
          form={form}
        />
        <div
          className="flex items-center justify-start gap-3 cursor-pointer"
          onClick={handleClick}
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
            onChange={handleChange}
            className="hidden"
          />
        </div>

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
        <Field
          label="Bio"
          field="bio"
          value={user.bio}
          onEdit={handleEditField}
        />
        <Field
          label="Gender"
          field="gender"
          value={user.gender}
          onEdit={handleEditField}
        />
        <Field
          label="Birthday"
          field="dob"
          value={user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
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
                <>
                  <p className="flex items-center gap-2">
                    <Icon name="FaGlassMartiniAlt" /> {user.lifestyle.drinking}
                  </p>
                </>
              ) : null}
              {user.lifestyle?.smoking ? (
                <>
                  <p className="flex items-center gap-2">
                    <Icon name="FaSmoking" /> {user.lifestyle.smoking}
                  </p>
                </>
              ) : null}
              {user.lifestyle?.pets ? (
                <>
                  <p className="flex items-center gap-2">
                    <Icon name="FaPaw" /> {user.lifestyle.pets}
                  </p>
                </>
              ) : null}
            </>
          }
          onEdit={handleEditField}
          visibility={user.fieldVisibility?.lifestyle}
          onVisibilityChange={handleVisibilityChange}
        />
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
          label="Maritial Status"
          field="maritalStatus"
          value={user.maritalStatus}
          onEdit={handleEditField}
          visibility={user.fieldVisibility?.maritalStatus}
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
        <Field
          label="Religion"
          field="religion"
          value={user.religion}
          onEdit={handleEditField}
          visibility={user.fieldVisibility?.religion}
          onVisibilityChange={handleVisibilityChange}
        />
      </div>
    </div>
  );
};

export default EditMyProfile;

const FieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
  isLoading,
  form,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: string;
  onUpdate: (field: string, value: any) => Promise<void>;
  currentValue: any;
  isLoading: boolean;
  form: any;
}) => {
  const [value, setValue] = useState(currentValue);

  // Update value when currentValue changes
  React.useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  // Helper function to get the schema for a nested field
  const getFieldSchema = (schema: any, fieldPath: string) => {
    return fieldPath.split(".").reduce((acc, key) => acc?.shape?.[key], schema);
  };

  const handleSubmit = async () => {
    try {
      // Validate the field using Zod
      const fieldSchema = getFieldSchema(profileSchema, fieldType);
      if (!fieldSchema) {
        throw new Error(`No schema found for field: ${fieldType}`);
      }
      // Trigger form validation for the specific field
      await form.trigger(fieldType);
      // Validate using Zod
      fieldSchema.parse(value);
      // Call the onUpdate function
      await onUpdate(fieldType, value);

      setIsOpen(false);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleCancel = () => {
    // Reset value to currentValue when canceling
    setValue(currentValue);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="hidden">
          <SheetTitle>Edit {fieldType}</SheetTitle>
        </SheetHeader>
        <header className="flex items-center justify-between p-3 gap-4 shadow-sm">
          <div className="flex items-center justify-start gap-2">
            <div onClick={handleCancel} className="">
              <Icon
                name="MdOutlineClose"
                className="text-xl h-6 w-6 text-ui-shade"
              />
            </div>
            <div className="capitalize text-lg font-semibold">
              Edit {fieldType}
            </div>
          </div>
          <div onClick={handleSubmit} className="">
            <Icon
              name="HiOutlineCheck"
              className="text-xl h-6 w-6 text-ui-highlight"
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {fieldType === "username" ? (
              <TextField
                label="Username"
                value={value || ""}
                name={fieldType}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter unique username"
              />
            ) : null}
            {fieldType === "nickname" ? (
              <TextField
                label="Nickname"
                value={value || ""}
                name={fieldType}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your nickname"
              />
            ) : null}
            {fieldType === "realName" ? (
              <TextField
                label="Real Name"
                value={value || ""}
                name={fieldType}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your real name"
              />
            ) : null}
            {fieldType === "phoneNumber" ? (
              <TextField
                label="Phone Number"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  // Remove any spaces from the input
                  const formattedValue = e.target.value.replace(/\s+/g, "");
                  setValue(formattedValue);
                }}
                placeholder="Enter your phone number (e.g., +917021245436)"
              />
            ) : null}
            {fieldType === "bloodGroup" ? (
              <SelectField
                label="Blood Group"
                options={bloodTypeOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your blood group"
              />
            ) : null}
            {fieldType === "interests" ? (
              <>
                <MultiSelectField
                  label="Interests"
                  max={5}
                  options={interestOptions}
                  value={value || []}
                  name="interests"
                  onChange={setValue}
                  placeholder="What excites you the most?"
                />
              </>
            ) : null}
            {fieldType === "bio" ? (
              <TextAreaField
                label="Bio"
                value={value || ""}
                name={fieldType}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your bio"
              />
            ) : null}
            {fieldType === "gender" ? (
              <SelectField
                label="Gender"
                options={genderOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your gender"
              />
            ) : null}
            {fieldType === "dob" ? (
              <DateField
                label="Date of Birth"
                value={value}
                onChange={setValue}
                placeholder={value || "Select your date of birth"}
              />
            ) : null}

            {fieldType === "height" ? (
              <TextField
                label="Height in cm."
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e.target.value)}
                type="number"
                min={100}
                max={250}
              />
            ) : null}

            {fieldType === "diet" ? (
              <SelectField
                label="Diet"
                options={dietOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your diet"
              />
            ) : null}
            {fieldType === "zodiacSign" ? (
              <SelectField
                label="Zodiac Sign"
                options={zodiacOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your zodiac sign"
              />
            ) : null}
            {fieldType === "lifestyle" ? (
              <>
                <SelectField
                  label="Drinking Habit"
                  options={drinkingOptions}
                  value={value?.drinking}
                  name={"lifestyle.drinking"}
                  onChange={(e) => setValue({ ...value, drinking: e })}
                  placeholder="How often do you drink?"
                />
                <SelectField
                  label="Smoking Habit"
                  options={smokingOptions}
                  value={value?.smoking}
                  name={"lifestyle.smoking"}
                  onChange={(e) => setValue({ ...value, smoking: e })}
                  placeholder="How often do you smoke?"
                />
                <SelectField
                  label="Pets"
                  options={petOptions}
                  value={value?.pets}
                  name={"lifestyle.pets"}
                  onChange={(e) => setValue({ ...value, pets: e })}
                  placeholder="Do you have a pet?"
                />
              </>
            ) : null}

            {fieldType === "work" ? (
              <>
                <TextField
                  label="Work"
                  value={value}
                  name={"work"}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="What do you do?"
                />
              </>
            ) : null}

            {fieldType === "institution" ? (
              <>
                <TextField
                  label="Institution"
                  value={value}
                  name={"institution"}
                  onChange={(e) => setValue(e?.target?.value)}
                  placeholder="Where did you study?"
                />
              </>
            ) : null}

            {fieldType === "maritalStatus" ? (
              <SelectField
                label="Marital Status"
                options={maritalStatusOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="What is your marital status?"
              />
            ) : null}
            {fieldType === "languages" ? (
              <MultiSelectField
                label="Languages"
                options={languageOptions}
                value={value}
                name={fieldType}
                max={5}
                onChange={(selectedValues) => setValue(selectedValues)}
                placeholder="What languages do you speak?"
              />
            ) : null}
            {fieldType === "personalityType" ? (
              <SelectField
                label="Personality Type"
                options={personalityTypeOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="What is your personality type?"
              />
            ) : null}
            {fieldType === "religion" ? (
              <SelectField
                label="Religion"
                options={religionOptions}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="What is your religion?"
              />
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Field = ({
  label,
  field,
  value,
  onEdit,
  visibility,
  onVisibilityChange,
  children, // for custom display blocks like lifestyle or interests
}: any) => (
  <div
    onClick={() => onEdit(field)}
    className="border border-ui-shade/10 rounded-xl p-3 mt-3"
  >
    <div className="flex justify-between items-center">
      <div className="text-lg">
        <h3 className="text-base text-ui-shade/60">{label}</h3>
        {children || value || "Not set"}
      </div>
      {visibility !== undefined && (
        <VisibilityToggle
          field={field}
          currentVisibility={visibility}
          onVisibilityChange={onVisibilityChange}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  </div>
);
