"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLogout } from "../hooks/useAuth";
import { SelectField, TextAreaField, TextField } from "./InputField";

// Form validation schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  visibleName: z.string().min(2, "Name must be at least 2 characters"),
  hiddenName: z.string().min(2, "Hidden name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  gender: z.enum(["Male", "Female", "Non-Binary", "Prefer Not to Say"]),
  dob: z.string(),
  sexualOrientation: z.enum([
    "Straight",
    "Gay",
    "Lesbian",
    "Bisexual",
    "Pansexual",
    "Asexual",
    "Queer",
    "Questioning",
    "Prefer Not to Say",
  ]),
  height: z.number().min(100).max(250),
  currentLocation: z.string(),
  diet: z.enum([
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Non-Vegetarian",
    "Gluten-Free",
    "Kosher",
    "Halal",
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
    alcohol: z.enum([
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
  work: z.object({
    title: z.string(),
    company: z.string(),
  }),
  education: z.object({
    degree: z.enum([
      "High School",
      "Associate's",
      "Bachelor's",
      "Master's",
      "Doctorate",
      "Professional Degree",
      "Other",
    ]),
    institution: z.string(),
  }),
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
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditMyProfile = ({ user }: { user: any }) => {
  const { logout } = useLogout();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username || "",
      visibleName: user.visibleName || "",
      hiddenName: user.hiddenName || "",
      bio: user.bio || "",
      gender: user.gender || "Prefer Not to Say",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      sexualOrientation: user.sexualOrientation || "Prefer Not to Say",
      height: user.height || 170,
      currentLocation: user.currentLocation || "",
      diet: user.diet || "No Specific Diet",
      zodiacSign: user.zodiacSign || "Aries",
      lifestyle: user.lifestyle || {
        alcohol: "Prefer Not to Say",
        smoking: "Prefer Not to Say",
        pets: "Prefer Not to Say",
      },
      work: user.work || { title: "", company: "" },
      education: user.education || { degree: "Other", institution: "" },
      maritalStatus: user.maritalStatus || "Prefer Not to Say",
      languages: user.languages || [],
      personalityType: user.personalityType || "Not Sure",
    },
  });

  const handleEditField = (field: string) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (field: string, value: any) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update field");
      }

      // Update form data
      form.setValue(field as any, value);
      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-ui-background/10 p-4">
      <div className="w-full max-w-3xl mx-auto pb-10">
        <h3 className="text-xl font-medium">Edit Profile</h3>
        <FieldEditor
          isOpen={isEditFieldOpen}
          setIsOpen={setIsEditFieldOpen}
          fieldType={editFieldType}
          onUpdate={handleFieldUpdate}
          currentValue={form.getValues(editFieldType as any)}
          isLoading={isLoading}
          form={form}
        />
        <div className="flex items-center justify-start gap-3 mt-3">
          <div className="h-20 w-20 bg-ui-highlight rounded-full"></div>
          Change Profile Picture
        </div>
        <div
          onClick={() => handleEditField("username")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Username</h3>
          kritik_sah
        </div>
        <div
          onClick={() => handleEditField("visibleName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Visible Name</h3>
          Rebel
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Real Name</h3>
          Kritik Sah
        </div>
        <div
          onClick={() => handleEditField("bio")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Bio</h3>
          Learner
        </div>
        <div
          onClick={() => handleEditField("gender")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Gender</h3>
          Male
        </div>
        <div
          onClick={() => handleEditField("dob")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">DOB</h3>
          09/09/2000
        </div>
        <div
          onClick={() => handleEditField("sexualOrientation")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Sexual orientation</h3>
          Straight
        </div>
        <div
          onClick={() => handleEditField("height")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Height</h3>
          {`5'9`}
        </div>
        <div
          onClick={() => handleEditField("currentLocation")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Current Location</h3>
          Janakpuri East
        </div>
        <div
          onClick={() => handleEditField("diet")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Diet</h3>
          Non Veg
        </div>
        <div
          onClick={() => handleEditField("zodiacSign")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Zodiac Sign</h3>
          Virgo
        </div>
        <div
          onClick={() => handleEditField("lifestyle.alcohol")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Alcohol</h3>
          Sometimes
        </div>
        <div
          onClick={() => handleEditField("lifestyle.smoking")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Smoking</h3>
          No
        </div>
        <div
          onClick={() => handleEditField("lifestyle.pets")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Pets</h3>
          Dog
        </div>
        <div
          onClick={() => handleEditField("work.title")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Work</h3>
          Web3 at Startup
        </div>
        <div
          onClick={() => handleEditField("work.company")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Company</h3>
          {user.work?.company || "N/A"}
        </div>
        <div
          onClick={() => handleEditField("education.degree")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Education</h3>
          {user.education?.degree || "N/A"}
        </div>
        <div
          onClick={() => handleEditField("education.institution")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Institution</h3>
          {user.education?.institution || "N/A"}
        </div>
        <div
          onClick={() => handleEditField("maritalStatus")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Maritial Status</h3>
          {user.maritalStatus || "N/A"}
        </div>
        <div
          onClick={() => handleEditField("languages")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Languages</h3>
          {user.languages?.join(", ") || "N/A"}
        </div>
        <div
          onClick={() => handleEditField("personalityType")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Personality Type</h3>
          {user.personalityType || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default EditMyProfile;

const genders = [
  { label: "Man", value: "man" },
  { label: "Woman", value: "woman" },
  { label: "Trans Man", value: "trans_man" },
  { label: "Trans Woman", value: "trans_woman" },
  { label: "Non-Binary", value: "non_binary" },
  { label: "Genderqueer", value: "genderqueer" },
  { label: "Genderfluid", value: "genderfluid" },
  { label: "Agender", value: "agender" },
  { label: "Bigender", value: "bigender" },
  { label: "Demiboy", value: "demiboy" },
  { label: "Demigirl", value: "demigirl" },
  { label: "Two-Spirit", value: "two_spirit" },
  { label: "Androgynous", value: "androgynous" },
  { label: "Neutrois", value: "neutrois" },
  { label: "Intersex", value: "intersex" },
  { label: "Third Gender", value: "third_gender" },
  { label: "Maverique", value: "maverique" },
  { label: "Polygender", value: "polygender" },
  { label: "Genderflux", value: "genderflux" },
  { label: "Xenogender", value: "xenogender" },
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

  const handleSubmit = async () => {
    try {
      // Validate the field using Zod
      const fieldSchema =
        profileSchema.shape[fieldType as keyof typeof profileSchema.shape];
      fieldSchema.parse(value);

      await onUpdate(fieldType, value);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize">Edit {fieldType}</SheetTitle>
        </SheetHeader>

        {fieldType === "username" ? (
          <TextField
            label="Username"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter unique username"
          />
        ) : null}
        {fieldType === "visibleName" ? (
          <TextField
            label="Visible Name"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a Visible Name"
          />
        ) : null}
        {fieldType === "hiddenName" ? (
          <TextField
            label="Real Name"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your real name"
          />
        ) : null}
        {fieldType === "bio" ? (
          <TextAreaField
            label="Bio"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your real name"
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
          <TextField
            label="Date of Birth"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            type="date"
          />
        ) : null}
        {fieldType === "sexualOrientation" ? (
          <SelectField
            label="Sexual Orientation"
            options={[
              { label: "Straight", value: "Straight" },
              { label: "Gay", value: "Gay" },
              { label: "Lesbian", value: "Lesbian" },
              { label: "Bisexual", value: "Bisexual" },
              { label: "Pansexual", value: "Pansexual" },
              { label: "Asexual", value: "Asexual" },
              { label: "Queer", value: "Queer" },
              { label: "Questioning", value: "Questioning" },
              { label: "Prefer Not to Say", value: "Prefer Not to Say" },
            ]}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your sexual orientation"
          />
        ) : null}
        {fieldType === "height" ? (
          <TextField
            label="Height"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            min={100}
            max={250}
          />
        ) : null}
        {fieldType === "currentLocation" ? (
          <TextField
            label="Current Location"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your current location"
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
        {fieldType === "lifestyle.alcohol" ? (
          <SelectField
            label="Alcohol Consumption"
            options={[
              { label: "Never", value: "Never" },
              { label: "Rarely", value: "Rarely" },
              { label: "Socially", value: "Socially" },
              { label: "Regular", value: "Regular" },
              { label: "Prefer Not to Say", value: "Prefer Not to Say" },
            ]}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your alcohol consumption"
          />
        ) : null}
        {fieldType === "lifestyle.smoking" ? (
          <SelectField
            label="Smoking Habit"
            options={[
              { label: "Never", value: "Never" },
              { label: "Occasionally", value: "Occasionally" },
              { label: "Regularly", value: "Regularly" },
              { label: "Trying to Quit", value: "Trying to Quit" },
              { label: "Prefer Not to Say", value: "Prefer Not to Say" },
            ]}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your smoking habit"
          />
        ) : null}
        {fieldType === "lifestyle.pets" ? (
          <SelectField
            label="Pets"
            options={[
              { label: "Have Pets", value: "Have Pets" },
              { label: "Love Pets", value: "Love Pets" },
              { label: "Allergic to Pets", value: "Allergic to Pets" },
              { label: "No Pets", value: "No Pets" },
              { label: "Prefer Not to Say", value: "Prefer Not to Say" },
            ]}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your pet preference"
          />
        ) : null}
        {fieldType === "work.title" ? (
          <TextField
            label="Work Title"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your work title"
          />
        ) : null}
        {fieldType === "work.company" ? (
          <TextField
            label="Company"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your company"
          />
        ) : null}
        {fieldType === "education.degree" ? (
          <SelectField
            label="Education Degree"
            options={[
              { label: "High School", value: "High School" },
              { label: "Associate's", value: "Associate's" },
              { label: "Bachelor's", value: "Bachelor's" },
              { label: "Master's", value: "Master's" },
              { label: "Doctorate", value: "Doctorate" },
              { label: "Professional Degree", value: "Professional Degree" },
              { label: "Other", value: "Other" },
            ]}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your education degree"
          />
        ) : null}
        {fieldType === "education.institution" ? (
          <TextField
            label="Institution"
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your institution"
          />
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
            placeholder="Select your marital status"
          />
        ) : null}
        {fieldType === "languages" ? (
          <SelectField
            label="Languages"
            options={genders}
            value={value}
            name={fieldType}
            onChange={(e) => setValue(e)}
            placeholder="Select your languages"
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
            placeholder="Select your personality type"
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
