"use client";

import Icon from "@/components/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import React, { useState } from "react";
import * as z from "zod";
import DateField from "../../DateField";
import { TextAreaField, TextField } from "../../InputField";
import MultiSelectChipField from "../../MultiSelectChipField";
import { createProfileSchema } from "./profileSchema";

interface FieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: string;
  onUpdate: (field: string, value: any) => Promise<void>;
  currentValue: any;
  form: any;
  currentUsername?: string;
}

const FieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
  form,
  currentUsername,
}: FieldEditorProps) => {
  const [value, setValue] = useState(currentValue);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    setValue(currentValue);
    setErrorMessage("");
  }, [currentValue]);

  const getFieldSchema = (schema: any, fieldPath: string) => {
    return fieldPath.split(".").reduce((acc, key) => acc?.shape?.[key], schema);
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      const profileSchema = createProfileSchema(currentUsername);
      const fieldSchema = getFieldSchema(profileSchema, fieldType);
      if (!fieldSchema) {
        throw new Error(`No schema found for field: ${fieldType}`);
      }

      await form.trigger(fieldType);
      await fieldSchema.parseAsync(value);
      await onUpdate(fieldType, value);
      setIsOpen(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues[0]?.message || "Invalid value");
        return;
      }
      console.error("Validation error:", error);
      setErrorMessage("Unable to update this field. Please try again.");
    }
  };

  const handleCancel = () => {
    setValue(currentValue);
    setErrorMessage("");
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
            <div onClick={handleCancel}>
              <Icon
                name="MdOutlineClose"
                className="text-xl h-6 w-6 text-ui-shade"
              />
            </div>
            <div className="capitalize text-lg font-semibold">Edit {fieldType}</div>
          </div>
          <div onClick={handleSubmit}>
            <Icon name="HiOutlineCheck" className="text-xl h-6 w-6 text-ui-highlight" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {fieldType === "username" ? (
              <TextField
                label="Username"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                placeholder="Enter unique username"
              />
            ) : null}
            {fieldType === "nickname" ? (
              <TextField
                label="Nickname"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                placeholder="Enter your nickname"
              />
            ) : null}
            {fieldType === "realName" ? (
              <TextField
                label="Real Name"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                placeholder="Enter your real name"
              />
            ) : null}
            {fieldType === "phoneNumber" ? (
              <TextField
                label="Phone Number"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value.replace(/\s+/g, ""));
                }}
                placeholder="Enter your phone number (e.g., +917021245436)"
              />
            ) : null}
            {fieldType === "bloodGroup" ? (
              <MultiSelectChipField
                label="Blood Group"
                options={bloodTypeOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="Select your blood group"
              />
            ) : null}
            {fieldType === "interests" ? (
              <MultiSelectChipField
                label="Interests"
                max={5}
                options={interestOptions}
                value={value || []}
                name="interests"
                multiple
                onChange={(newValue) => {
                  setErrorMessage("");
                  setValue(newValue);
                }}
                placeholder="What excites you the most?"
              />
            ) : null}
            {fieldType === "bio" ? (
              <TextAreaField
                label="Bio"
                value={value || ""}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                placeholder="Enter your bio"
              />
            ) : null}
            {fieldType === "gender" ? (
              <MultiSelectChipField
                label="Gender"
                options={genderOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="Select your gender"
              />
            ) : null}
            {fieldType === "dob" ? (
              <DateField
                label="Date of Birth"
                value={value}
                onChange={(newValue) => {
                  setErrorMessage("");
                  setValue(newValue);
                }}
                placeholder={value || "Select your date of birth"}
              />
            ) : null}
            {fieldType === "height" ? (
              <TextField
                label="Height in cm."
                value={value}
                name={fieldType}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                type="number"
                min={100}
                max={250}
              />
            ) : null}
            {fieldType === "diet" ? (
              <MultiSelectChipField
                label="Diet"
                options={dietOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="Select your diet"
              />
            ) : null}
            {fieldType === "zodiacSign" ? (
              <MultiSelectChipField
                label="Zodiac Sign"
                options={zodiacOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="Select your zodiac sign"
              />
            ) : null}
            {fieldType === "lifestyle" ? (
              <>
                <MultiSelectChipField
                  label="Drinking Habit"
                  options={drinkingOptions}
                  value={value?.drinking}
                  name="lifestyle.drinking"
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, drinking: e });
                  }}
                  placeholder="How often do you drink?"
                />
                <MultiSelectChipField
                  label="Smoking Habit"
                  options={smokingOptions}
                  value={value?.smoking}
                  name="lifestyle.smoking"
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, smoking: e });
                  }}
                  placeholder="How often do you smoke?"
                />
                <MultiSelectChipField
                  label="Pets"
                  options={petOptions}
                  value={value?.pets}
                  name="lifestyle.pets"
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, pets: e });
                  }}
                  placeholder="Do you have a pet?"
                />
              </>
            ) : null}
            {fieldType === "work" ? (
              <TextField
                label="Work"
                value={value}
                name="work"
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e.target.value);
                }}
                placeholder="What do you do?"
              />
            ) : null}
            {fieldType === "institution" ? (
              <TextField
                label="Institution"
                value={value}
                name="institution"
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e?.target?.value);
                }}
                placeholder="Where did you study?"
              />
            ) : null}
            {fieldType === "maritalStatus" ? (
              <MultiSelectChipField
                label="Marital Status"
                options={maritalStatusOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="What is your marital status?"
              />
            ) : null}
            {fieldType === "languages" ? (
              <MultiSelectChipField
                label="Languages"
                options={languageOptions}
                value={value}
                name={fieldType}
                max={5}
                multiple
                onChange={(selectedValues) => {
                  setErrorMessage("");
                  setValue(selectedValues);
                }}
                placeholder="What languages do you speak?"
              />
            ) : null}
            {fieldType === "personalityType" ? (
              <MultiSelectChipField
                label="Personality Type"
                options={personalityTypeOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="What is your personality type?"
              />
            ) : null}
            {fieldType === "religion" ? (
              <MultiSelectChipField
                label="Religion"
                options={religionOptions}
                value={value}
                name={fieldType}
                multiple={false}
                onChange={(e) => {
                  setErrorMessage("");
                  setValue(e);
                }}
                placeholder="What is your religion?"
              />
            ) : null}
            {errorMessage ? (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FieldEditor;
