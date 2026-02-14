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
import DateField from "../../DateField";
import { SelectField, TextAreaField, TextField } from "../../InputField";
import MultiSelectField from "../../MultiSelectField";
import { profileSchema } from "./profileSchema";

interface FieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: string;
  onUpdate: (field: string, value: any) => Promise<void>;
  currentValue: any;
  form: any;
}

const FieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
  form,
}: FieldEditorProps) => {
  const [value, setValue] = useState(currentValue);

  React.useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const getFieldSchema = (schema: any, fieldPath: string) => {
    return fieldPath.split(".").reduce((acc, key) => acc?.shape?.[key], schema);
  };

  const handleSubmit = async () => {
    try {
      const fieldSchema = getFieldSchema(profileSchema, fieldType);
      if (!fieldSchema) {
        throw new Error(`No schema found for field: ${fieldType}`);
      }

      await form.trigger(fieldType);
      fieldSchema.parse(value);
      await onUpdate(fieldType, value);
      setIsOpen(false);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleCancel = () => {
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
                onChange={(e) => setValue(e.target.value.replace(/\s+/g, ""))}
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
              <MultiSelectField
                label="Interests"
                max={5}
                options={interestOptions}
                value={value || []}
                name="interests"
                onChange={setValue}
                placeholder="What excites you the most?"
              />
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
                  name="lifestyle.drinking"
                  onChange={(e) => setValue({ ...value, drinking: e })}
                  placeholder="How often do you drink?"
                />
                <SelectField
                  label="Smoking Habit"
                  options={smokingOptions}
                  value={value?.smoking}
                  name="lifestyle.smoking"
                  onChange={(e) => setValue({ ...value, smoking: e })}
                  placeholder="How often do you smoke?"
                />
                <SelectField
                  label="Pets"
                  options={petOptions}
                  value={value?.pets}
                  name="lifestyle.pets"
                  onChange={(e) => setValue({ ...value, pets: e })}
                  placeholder="Do you have a pet?"
                />
              </>
            ) : null}
            {fieldType === "work" ? (
              <TextField
                label="Work"
                value={value}
                name="work"
                onChange={(e) => setValue(e.target.value)}
                placeholder="What do you do?"
              />
            ) : null}
            {fieldType === "institution" ? (
              <TextField
                label="Institution"
                value={value}
                name="institution"
                onChange={(e) => setValue(e?.target?.value)}
                placeholder="Where did you study?"
              />
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

export default FieldEditor;
