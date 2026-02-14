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
import {
  MultisliderField,
  SelectField,
  SliderField,
} from "../../InputField";
import MultiSelectField from "../../MultiSelectField";
import type { UserPreferences } from "../../../hooks/useUserPrefrence";

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
  }, [currentValue, fieldType]);

  const handleSubmit = async () => {
    try {
      await onUpdate(fieldType as keyof UserPreferences, value);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleCancel = () => {
    setValue(currentValue || getDefaultValue(fieldType));
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
              <SelectField
                name="interestedIn"
                label="Interested In"
                options={interestedInOptions}
                value={value}
                onChange={setValue}
                placeholder="Select gender preferences"
              />
            ) : null}
            {fieldType === "ageRange" ? (
              <MultisliderField
                unit="y"
                name="ageRange"
                label="Age Range"
                value={value}
                onChange={setValue}
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
                onChange={setValue}
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
                onChange={setValue}
                min={140}
                max={220}
              />
            ) : null}
            {fieldType === "goal" ? (
              <>
                <SelectField
                  name="goal.primary"
                  label="Primary Goal"
                  options={goalOptions}
                  value={value?.primary || "Undecided"}
                  onChange={(e) => setValue({ ...value, primary: e })}
                  placeholder="Select primary goal"
                />
                <SelectField
                  name="goal.secondary"
                  label="Secondary Goal"
                  options={goalOptions}
                  value={value?.secondary || "Undecided"}
                  onChange={(e) => setValue({ ...value, secondary: e })}
                  placeholder="Select secondary goal"
                />
                <SelectField
                  name="goal.tertiary"
                  label="Tertiary Goal"
                  options={goalOptions}
                  value={value?.tertiary || "Undecided"}
                  onChange={(e) => setValue({ ...value, tertiary: e })}
                  placeholder="Select tertiary goal"
                />
              </>
            ) : null}
            {fieldType === "interests" ? (
              <MultiSelectField
                name="interests"
                label="Interests"
                max={5}
                options={interestOptions}
                value={value || []}
                onChange={setValue}
                placeholder="What vibes are you looking for?"
              />
            ) : null}
            {fieldType === "relationshipType" ? (
              <SelectField
                name="relationshipType"
                label="Relationship Type"
                options={relationshipTypeOptions}
                value={value || "Not Specified"}
                onChange={setValue}
                placeholder="Select relationship type"
              />
            ) : null}
            {fieldType === "languages" ? (
              <MultiSelectField
                name="languages"
                label="Preferred Languages"
                max={5}
                options={languageOptions}
                value={value || []}
                onChange={(selectedValues) => setValue(selectedValues)}
                placeholder="What languages do you prefer to speak?"
              />
            ) : null}
            {fieldType === "zodiacPreference" ? (
              <MultiSelectField
                name="zodiacPreference"
                label="Zodiac Preferences"
                max={5}
                options={zodiacOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select zodiac preferences"
              />
            ) : null}
            {fieldType === "personalityTypePreference" ? (
              <MultiSelectField
                name="personalityTypePreference"
                label="Personality Type Preferences"
                max={5}
                options={personalityTypeOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select personality type preferences"
              />
            ) : null}
            {fieldType === "dietPreference" ? (
              <MultiSelectField
                name="dietPreference"
                label="Diet Preferences"
                max={5}
                options={dietOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select diet preferences"
              />
            ) : null}
            {fieldType === "religionPreference" ? (
              <MultiSelectField
                name="religionPreference"
                label="Religion Preferences"
                max={5}
                options={religionOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select religion preferences"
              />
            ) : null}
            {fieldType === "drinkingPreference" ? (
              <MultiSelectField
                name="drinkingPreference"
                label="Drinking Preferences"
                max={5}
                options={drinkingOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select drinking preferences"
              />
            ) : null}
            {fieldType === "smokingPreference" ? (
              <MultiSelectField
                name="smokingPreference"
                label="Smoking Preferences"
                max={5}
                options={smokingOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select smoking preferences"
              />
            ) : null}
            {fieldType === "petPreference" ? (
              <MultiSelectField
                name="petPreference"
                label="Pet Preferences"
                max={5}
                options={petOptions}
                value={value || []}
                onChange={setValue}
                placeholder="Select pet preferences"
              />
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PreferenceFieldEditor;
