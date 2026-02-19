"use client";

import Icon from "@/components/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  dietOptions,
  drinkingOptions,
  goalOptions,
  interestedInOptions,
  interestOptions,
  languageOptions,
  personalityTypeOptions,
  petOptions,
  relationshipTypeOptions,
  religionOptions,
  smokingOptions,
  zodiacOptions,
} from "@/lib/options";
import { useEffect, useState } from "react";
import * as z from "zod";
import { MultisliderField, SliderField } from "../../InputField";
import MultiSelectChipField from "../../MultiSelectChipField";
import type { UserPreferences } from "../../../hooks/useUserPrefrence";
import { preferenceSchema } from "./preferenceSchema";

interface PreferenceFieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType?: keyof UserPreferences | "";
  onUpdate: (field: keyof UserPreferences, value: any) => Promise<void>;
  currentValue: any;
}

const PreferenceFieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
}: PreferenceFieldEditorProps) => {
  const [value, setValue] = useState(currentValue);
  const [errorMessage, setErrorMessage] = useState("");

  const getFieldSchema = (schema: any, fieldPath: string) => {
    return fieldPath.split(".").reduce((acc, key) => acc?.shape?.[key], schema);
  };

  const getDefaultValue = (field?: keyof UserPreferences | "") => {
    switch (field) {
      case "interests":
        return [];
      case "ageRange":
        return [18, 27];
      case "heightRange":
        return [150, 200];
      case "goal":
        return { primary: "", secondary: "", tertiary: "" };
      case "languages":
      case "zodiacPreference":
      case "personalityTypePreference":
      case "dietPreference":
      case "religionPreference":
      case "drinkingPreference":
      case "smokingPreference":
      case "petPreference":
        return [];
      default:
        return "";
    }
  };

  useEffect(() => {
    setValue(currentValue);
    setErrorMessage("");
  }, [currentValue, fieldType]);

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      const fieldSchema = getFieldSchema(preferenceSchema, fieldType || "");
      if (!fieldSchema) {
        throw new Error(`No schema found for field: ${fieldType}`);
      }
      await fieldSchema.parseAsync(value);
      await onUpdate(fieldType as keyof UserPreferences, value);
      setIsOpen(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.issues[0]?.message || "Invalid value");
        return;
      }
      console.error("Error updating field:", error);
      setErrorMessage("Unable to update this field. Please try again.");
    }
  };

  const handleCancel = () => {
    setValue(currentValue || getDefaultValue(fieldType));
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
        <div className="flex-1 overflow-y-auto px-2">
          <div className="flex flex-col gap-2">
            {fieldType === "interestedIn" ? (
              <MultiSelectChipField
                name="interestedIn"
                label="Interested In"
                options={interestedInOptions}
                value={value}
                multiple={false}
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select gender preferences"
              />
            ) : null}
            {fieldType === "ageRange" ? (
              <MultisliderField
                unit="y"
                name="ageRange"
                label="Age Range"
                value={value}
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                min={18}
                max={50}
              />
            ) : null}
            {fieldType === "distance" ? (
              <SliderField
                unit="km"
                name="distance"
                label="Maximum Distance (km)"
                value={[value || 10]}
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                min={1}
                max={100}
              />
            ) : null}
            {fieldType === "heightRange" ? (
              <MultisliderField
                unit="cm"
                name="heightRange"
                label="Height Range"
                value={value}
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                min={140}
                max={220}
              />
            ) : null}
            {fieldType === "goal" ? (
              <>
                <MultiSelectChipField
                  name="goal.primary"
                  label="Primary Goal"
                  options={goalOptions}
                  value={value?.primary || "Undecided"}
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, primary: e });
                  }}
                  placeholder="Select primary goal"
                />
                <MultiSelectChipField
                  name="goal.secondary"
                  label="Secondary Goal"
                  options={goalOptions}
                  value={value?.secondary || "Undecided"}
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, secondary: e });
                  }}
                  placeholder="Select secondary goal"
                />
                <MultiSelectChipField
                  name="goal.tertiary"
                  label="Tertiary Goal"
                  options={goalOptions}
                  value={value?.tertiary || "Undecided"}
                  multiple={false}
                  onChange={(e) => {
                    setErrorMessage("");
                    setValue({ ...value, tertiary: e });
                  }}
                  placeholder="Select tertiary goal"
                />
              </>
            ) : null}
            {fieldType === "interests" ? (
              <MultiSelectChipField
                name="interests"
                label="Interests"
                max={5}
                options={interestOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="What vibes are you looking for?"
              />
            ) : null}
            {fieldType === "relationshipType" ? (
              <MultiSelectChipField
                name="relationshipType"
                label="Relationship Type"
                options={relationshipTypeOptions}
                value={value || "Not Specified"}
                multiple={false}
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select relationship type"
              />
            ) : null}
            {fieldType === "languages" ? (
              <MultiSelectChipField
                name="languages"
                label="Preferred Languages"
                max={5}
                options={languageOptions}
                value={value || []}
                multiple
                onChange={(selectedValues) => {
                  setErrorMessage("");
                  setValue(selectedValues);
                }}
                placeholder="What languages do you prefer to speak?"
              />
            ) : null}
            {fieldType === "zodiacPreference" ? (
              <MultiSelectChipField
                name="zodiacPreference"
                label="Zodiac Preferences"
                max={5}
                options={zodiacOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select zodiac preferences"
              />
            ) : null}
            {fieldType === "personalityTypePreference" ? (
              <MultiSelectChipField
                name="personalityTypePreference"
                label="Personality Type Preferences"
                max={5}
                options={personalityTypeOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select personality type preferences"
              />
            ) : null}
            {fieldType === "dietPreference" ? (
              <MultiSelectChipField
                name="dietPreference"
                label="Diet Preferences"
                max={5}
                options={dietOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select diet preferences"
              />
            ) : null}
            {fieldType === "religionPreference" ? (
              <MultiSelectChipField
                name="religionPreference"
                label="Religion Preferences"
                max={5}
                options={religionOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select religion preferences"
              />
            ) : null}
            {fieldType === "drinkingPreference" ? (
              <MultiSelectChipField
                name="drinkingPreference"
                label="Drinking Preferences"
                max={5}
                options={drinkingOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select drinking preferences"
              />
            ) : null}
            {fieldType === "smokingPreference" ? (
              <MultiSelectChipField
                name="smokingPreference"
                label="Smoking Preferences"
                max={5}
                options={smokingOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select smoking preferences"
              />
            ) : null}
            {fieldType === "petPreference" ? (
              <MultiSelectChipField
                name="petPreference"
                label="Pet Preferences"
                max={5}
                options={petOptions}
                value={value || []}
                multiple
                onChange={(nextValue) => {
                  setErrorMessage("");
                  setValue(nextValue);
                }}
                placeholder="Select pet preferences"
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

export default PreferenceFieldEditor;
