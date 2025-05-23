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
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLogout } from "../hooks/useAuth";
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
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message:
        "Invalid phone number format. Please enter a valid international phone number.",
    })
    .optional(),
  bloodGroup: z.enum([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Prefer Not to Say",
  ]),
  interests: z.object({
    professional: z.array(z.string()),
    hobbies: z.array(z.string()),
  }),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  gender: z.enum(["Man", "Woman", "Gay", "Lesbian", "Non-Binary", "Prefer Not to Say"]),
  dob: z.string(),
  height: z.string().regex(/^\d{2,3}$/, "Height must be a valid number in cm"),
  currentLocation: z.string(),
  diet: z.enum([
    "Vegetarian",
    "Vegan",
    "Jain",
    "Non-Vegetarian",
    "No Specific Diet",
  ]),
  zodiacSign: z.enum([
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]),
  lifestyle: z.object({
    drinking: z.enum([
      "Never",
      "Rarely",
      "Socially",
      "Regular",
      "Prefer Not to Say",
    ]),
    smoking: z.enum([
      "Never",
      "Occasionally",
      "Regularly",
      "Trying to Quit",
      "Prefer Not to Say",
    ]),
    pets: z.enum([
      "Have Pets",
      "Love Pets",
      "Allergic to Pets",
      "No Pets",
      "Prefer Not to Say",
    ]),
  }),
  work: z
    .object({
      title: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),

  institution: z.string().optional(),
  maritalStatus: z.enum([
    "Single",
    "Divorced",
    "Separated",
    "Widowed",
    "Married",
    "Prefer Not to Say",
  ]),
  languages: z.array(z.string()),
  personalityType: z.enum([
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
    "Not Sure",
  ]),
  religion: z.enum([
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Judaism",
    "Sikhism",
    "Atheism",
    "Agnostic",
    "Spiritual",
    "Other",
    "Prefer Not to Say",
  ]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditMyProfile = ({ user: initialUser }: { user: any }) => {
  const { logout } = useLogout();
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
      username: user?.username || "",
      nickname: user?.nickname || "",
      realName: user?.realName || "",
      phoneNumber: user?.phoneNumber || "",
      bloodGroup: user?.bloodGroup || "Prefer Not to Say",
      interests: user?.interests || { professional: [], hobbies: [] },
      bio: user?.bio || "",
      gender: user?.gender || "Prefer Not to Say",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      height: user?.height || "170",
      currentLocation: user?.currentLocation || "",
      diet: user?.diet || "No Specific Diet",
      zodiacSign: user?.zodiacSign || "Aries",
      lifestyle: user?.lifestyle || {
        drinking: "Prefer Not to Say",
        smoking: "Prefer Not to Say",
        pets: "Prefer Not to Say",
      },
      work: user?.work || { title: "", company: "" },
      institution: user?.institution || "",
      maritalStatus: user?.maritalStatus || "Prefer Not to Say",
      languages: user?.languages || [],
      personalityType: user?.personalityType || "Not Sure",
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
    } catch (error) {
      console.error("Upload error:", error instanceof Error ? error.message : error);
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
        <h3 className="text-xl font-medium">Edit Profile</h3>
        <FieldEditor
          isOpen={isEditFieldOpen}
          setIsOpen={setIsEditFieldOpen}
          fieldType={editFieldType}
          onUpdate={handleFieldUpdate}
          currentValue={form.getValues(editFieldType as any)}
          isLoading={isUpdating}
          form={form}
        />
        <div className="flex items-center justify-start gap-3 mt-3 cursor-pointer" onClick={handleClick}>
          <div className="h-20 w-20 bg-ui-highlight rounded-full overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-300 rounded-full" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">Change Profile Picture</span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>
        <div
          onClick={() => handleEditField("username")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Username</h3>
              {user.username}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleEditField("nickname")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Nickname</h3>
              {user.nickname || "Not set"}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleEditField("realName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Real Name</h3>
              {user.realName || "Not set"}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleEditField("phoneNumber")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Phone Number</h3>
              {user.phoneNumber || "Not set"}
            </div>
          </div>
        </div>

        <div
          onClick={() => handleEditField("bio")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Bio</h3>
              {user.bio}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleEditField("gender")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Gender</h3>
              {user.gender}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleEditField("dob")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">DOB</h3>
              {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
            </div>
          </div>
        </div>

        <div
          onClick={() => handleEditField("interests")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Interests</h3>
              <div className="mt-1">
                {user.interests?.professional?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Professional:</span>{" "}
                    {user.interests.professional.join(", ")}
                  </div>
                )}
                {user.interests?.hobbies?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Hobbies:</span>{" "}
                    {user.interests.hobbies.join(", ")}
                  </div>
                )}
              </div>
            </div>
            <VisibilityToggle
              field="interests"
              currentVisibility={user.fieldVisibility?.interests || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("bloodGroup")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Blood Group</h3>
              {user.bloodGroup || "Not set"}
            </div>
            <VisibilityToggle
              field="bloodGroup"
              currentVisibility={user.fieldVisibility?.bloodGroup || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("height")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Height</h3>
              {user.height ? `${user.height}cm` : "Not set"}
            </div>
            <VisibilityToggle
              field="height"
              currentVisibility={user.fieldVisibility?.height || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() => handleEditField("diet")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Diet</h3>
              {user.diet}
            </div>
            <VisibilityToggle
              field="diet"
              currentVisibility={user.fieldVisibility?.diet || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("zodiacSign")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Zodiac Sign</h3>
              {user.zodiacSign}
            </div>
            <VisibilityToggle
              field="zodiacSign"
              currentVisibility={user.fieldVisibility?.zodiacSign || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("lifestyle")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Lifestyle</h3>
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
            </div>
            <VisibilityToggle
              field="lifestyle"
              currentVisibility={user.fieldVisibility?.lifestyle || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() => handleEditField("work")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Work</h3>
              {user.work?.title} at {user.work?.company}
            </div>
            <VisibilityToggle
              field="work"
              currentVisibility={user.fieldVisibility?.work || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() => handleEditField("institution")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Education</h3>

              {user?.institution}
            </div>
            <VisibilityToggle
              field="institution"
              currentVisibility={
                user.fieldVisibility?.institution || "public"
              }
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div
          onClick={() => handleEditField("maritalStatus")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Maritial Status</h3>
              {user.maritalStatus || "N/A"}
            </div>
            <VisibilityToggle
              field="maritalStatus"
              currentVisibility={
                user.fieldVisibility?.maritalStatus || "public"
              }
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("languages")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Languages</h3>
              {user.languages?.join(", ") || "N/A"}
            </div>
            <VisibilityToggle
              field="languages"
              currentVisibility={user.fieldVisibility?.languages || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("personalityType")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Personality Type</h3>
              {user.personalityType || "N/A"}
            </div>
            <VisibilityToggle
              field="personalityType"
              currentVisibility={
                user.fieldVisibility?.personalityType || "public"
              }
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          onClick={() => handleEditField("religion")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-ui-shade/60">Religion</h3>
              {user.religion || "N/A"}
            </div>
            <VisibilityToggle
              field="religion"
              currentVisibility={user.fieldVisibility?.religion || "public"}
              onVisibilityChange={handleVisibilityChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMyProfile;

const genders = [
  { label: "Man", value: "Man" },
  { label: "Woman", value: "Woman" },
  { label: "Non-Binary", value: "Non-Binary" },
  { label: "Prefer Not to Say", value: "Prefer Not to Say" },
];

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
  const languageOptions = allLanguages.map(({ code, name, nativeName }) => ({
    label: `${name} (${nativeName})`,
    value: name,
  }));

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
      console.log("handleSubmit triggered");

      // Log fieldType and value
      console.log("Field Type:", fieldType);
      console.log("Value:", value);

      // Validate the field using Zod
      const fieldSchema = getFieldSchema(profileSchema, fieldType);
      console.log("Retrieved field schema:", fieldSchema);

      if (!fieldSchema) {
        throw new Error(`No schema found for field: ${fieldType}`);
      }

      // Trigger form validation for the specific field
      console.log("Triggering form validation for:", fieldType);
      await form.trigger(fieldType);

      // Validate using Zod
      console.log("Validating value with Zod...");
      fieldSchema.parse(value);
      console.log("Validation successful!");

      // Call the onUpdate function
      console.log("Calling onUpdate with:", fieldType, value);
      await onUpdate(fieldType, value);

      // Clear the input value after successful submission
      setValue(
        fieldType === "interests" ? { professional: [], hobbies: [] } : ""
      );

      console.log("handleSubmit completed successfully.");
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
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">Edit {fieldType}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
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
                options={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                  { label: "Prefer Not to Say", value: "Prefer Not to Say" },
                ]}
                value={value || "Prefer Not to Say"}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your blood group"
              />
            ) : null}
            {fieldType === "interests" ? (
              <>
                <MultiSelectField
                  label="Professional Interests"
                  options={[
                    { label: "Technology", value: "Technology" },
                    { label: "Healthcare", value: "Healthcare" },
                    { label: "Finance", value: "Finance" },
                    { label: "Education", value: "Education" },
                    { label: "Arts", value: "Arts" },
                    { label: "Science", value: "Science" },
                    { label: "Engineering", value: "Engineering" },
                    { label: "Business", value: "Business" },
                    { label: "Law", value: "Law" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={value?.professional || []}
                  name="interests.professional"
                  onChange={(selectedValues) =>
                    setValue({ ...value, professional: selectedValues })
                  }
                  placeholder="Select your professional interests"
                />
                <MultiSelectField
                  label="Hobbies"
                  options={[
                    { label: "Reading", value: "Reading" },
                    { label: "Travel", value: "Travel" },
                    { label: "Music", value: "Music" },
                    { label: "Sports", value: "Sports" },
                    { label: "Cooking", value: "Cooking" },
                    { label: "Photography", value: "Photography" },
                    { label: "Art", value: "Art" },
                    { label: "Gaming", value: "Gaming" },
                    { label: "Fitness", value: "Fitness" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={value?.hobbies || []}
                  name="interests.hobbies"
                  onChange={(selectedValues) =>
                    setValue({ ...value, hobbies: selectedValues })
                  }
                  placeholder="Select your hobbies"
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
                options={genders}
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
                options={[
                  { label: "Vegetarian", value: "Vegetarian" },
                  { label: "Vegan", value: "Vegan" },
                  { label: "Pescatarian", value: "Pescatarian" },
                  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
                  { label: "Gluten-Free", value: "Gluten-Free" },
                  { label: "Kosher", value: "Kosher" },
                  { label: "Halal", value: "Halal" },
                  { label: "No Specific Diet", value: "No Specific Diet" },
                ]}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="Select your diet"
              />
            ) : null}
            {fieldType === "zodiacSign" ? (
              <SelectField
                label="Zodiac Sign"
                options={[
                  { label: "Aries", value: "Aries" },
                  { label: "Taurus", value: "Taurus" },
                  { label: "Gemini", value: "Gemini" },
                  { label: "Cancer", value: "Cancer" },
                  { label: "Leo", value: "Leo" },
                  { label: "Virgo", value: "Virgo" },
                  { label: "Libra", value: "Libra" },
                  { label: "Scorpio", value: "Scorpio" },
                  { label: "Sagittarius", value: "Sagittarius" },
                  { label: "Capricorn", value: "Capricorn" },
                  { label: "Aquarius", value: "Aquarius" },
                  { label: "Pisces", value: "Pisces" },
                ]}
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
                  options={[
                    { label: "Never", value: "Never" },
                    { label: "Rarely", value: "Rarely" },
                    { label: "Socially", value: "Socially" },
                    { label: "Regular", value: "Regular" },
                    { label: "Prefer Not to Say", value: "Prefer Not to Say" },
                  ]}
                  value={value?.drinking}
                  name={"lifestyle.drinking"}
                  onChange={(e) => setValue({ ...value, drinking: e })}
                  placeholder="How often do you drink?"
                />
                <SelectField
                  label="Smoking Habit"
                  options={[
                    { label: "Never", value: "Never" },
                    { label: "Occasionally", value: "Occasionally" },
                    { label: "Regularly", value: "Regularly" },
                    { label: "Trying to Quit", value: "Trying to Quit" },
                    { label: "Prefer Not to Say", value: "Prefer Not to Say" },
                  ]}
                  value={value?.smoking}
                  name={"lifestyle.smoking"}
                  onChange={(e) => setValue({ ...value, smoking: e })}
                  placeholder="How often do you smoke?"
                />
                <SelectField
                  label="Pets"
                  options={[
                    { label: "Have Pets", value: "Have Pets" },
                    { label: "Love Pets", value: "Love Pets" },
                    { label: "Allergic to Pets", value: "Allergic to Pets" },
                    { label: "No Pets", value: "No Pets" },
                    { label: "Prefer Not to Say", value: "Prefer Not to Say" },
                  ]}
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
                  label="Title"
                  value={value?.title}
                  name={"work.title"}
                  onChange={(e) =>
                    setValue({ ...value, title: e.target.value })
                  }
                  placeholder="What do you do?"
                />
                <TextField
                  label="Company"
                  value={value?.company}
                  name={"work.company"}
                  onChange={(e) =>
                    setValue({ ...value, company: e.target.value })
                  }
                  placeholder="Where do you work?"
                />
              </>
            ) : null}

            {fieldType === "institution" ? (
              <>
                {/* <SelectField
                  label="Education Degree"
                  options={[
                    { label: "High School", value: "High School" },
                    { label: "Associate's", value: "Associate's" },
                    { label: "Bachelor's", value: "Bachelor's" },
                    { label: "Master's", value: "Master's" },
                    { label: "Doctorate", value: "Doctorate" },
                    {
                      label: "Professional Degree",
                      value: "Professional Degree",
                    },
                    { label: "Other", value: "Other" },
                  ]}
                  value={value?.degree}
                  name={"education.degree"}
                  onChange={(e) => setValue({ ...value, degree: e })}
                  placeholder="What is your highest education degree?"
                /> */}
                {/* <TextField
                  label="Field of Study"
                  value={value?.field}
                  name={"education.field"}
                  onChange={(e) =>
                    setValue({ ...value, field: e.target.value })
                  }
                  placeholder="What's your field of study?"
                /> */}
                <TextField
                  label="Institution"
                  value={value}
                  name={"institution"}
                  onChange={(e) =>
                    setValue(e?.target?.value)
                  }
                  placeholder="Where did you study?"
                />
              </>
            ) : null}

            {fieldType === "maritalStatus" ? (
              <SelectField
                label="Marital Status"
                options={[
                  { label: "Single", value: "Single" },
                  { label: "Divorced", value: "Divorced" },
                  { label: "Separated", value: "Separated" },
                  { label: "Widowed", value: "Widowed" },
                  { label: "Married", value: "Married" },
                  { label: "Prefer Not to Say", value: "Prefer Not to Say" },
                ]}
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
                value={value || []} // Ensure it's always an array
                name={fieldType}
                onChange={(selectedValues) => setValue(selectedValues)}
                placeholder="What languages do you speak?"
              />
            ) : null}
            {fieldType === "personalityType" ? (
              <SelectField
                label="Personality Type"
                options={[
                  { label: "INTJ", value: "INTJ" },
                  { label: "INTP", value: "INTP" },
                  { label: "ENTJ", value: "ENTJ" },
                  { label: "ENTP", value: "ENTP" },
                  { label: "INFJ", value: "INFJ" },
                  { label: "INFP", value: "INFP" },
                  { label: "ENFJ", value: "ENFJ" },
                  { label: "ENFP", value: "ENFP" },
                  { label: "ISTJ", value: "ISTJ" },
                  { label: "ISFJ", value: "ISFJ" },
                  { label: "ESTJ", value: "ESTJ" },
                  { label: "ESFJ", value: "ESFJ" },
                  { label: "ISTP", value: "ISTP" },
                  { label: "ISFP", value: "ISFP" },
                  { label: "ESTP", value: "ESTP" },
                  { label: "ESFP", value: "ESFP" },
                  { label: "Not Sure", value: "Not Sure" },
                ]}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="What is your personality type?"
              />
            ) : null}
            {fieldType === "religion" ? (
              <SelectField
                label="Religion"
                options={[
                  { label: "Christianity", value: "Christianity" },
                  { label: "Islam", value: "Islam" },
                  { label: "Hinduism", value: "Hinduism" },
                  { label: "Buddhism", value: "Buddhism" },
                  { label: "Judaism", value: "Judaism" },
                  { label: "Atheism", value: "Atheism" },
                  { label: "Other", value: "Other" },
                ]}
                value={value}
                name={fieldType}
                onChange={(e) => setValue(e)}
                placeholder="What is your religion?"
              />
            ) : null}
          </div>
        </div>
        <SheetFooter className="flex-shrink-0 mt-4">
          <div className="w-full flex flex-col gap-2">
            <Button type="submit" onClick={handleSubmit}>
              Save
            </Button>
            <Button
              variant="outline"
              className="hover:bg-ui-shade hover:text-ui-light"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
