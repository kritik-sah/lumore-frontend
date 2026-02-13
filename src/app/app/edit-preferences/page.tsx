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
import { updateUserPreferences } from "@/lib/apis";
import allLanguages from "@/lib/languages.json";
import { SettingsPageLoader } from "@/components/page-loaders";
import {
  drinkingOptions,
  dietOptions,
  goalOptions,
  interestedInOptions,
  interestOptions,
  languageOptions,
  petOptions,
  personalityTypeOptions,
  religionOptions,
  relationshipTypeOptions,
  smokingOptions,
  zodiacOptions,
} from "@/lib/options";
import { queryClient } from "@/service/query-client";
import { getUser } from "@/service/storage";
import { languageDisplay } from "@/utils/helpers";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  MultisliderField,
  SelectField,
  SliderField,
  TextField,
} from "../components/InputField";
import SubPageLayout from "../components/layout/SubPageLayout";
import MultiSelectField from "../components/MultiSelectField";
import { UserPreferences, useUserPrefrence } from "../hooks/useUserPrefrence";

const EditPreferences = () => {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<keyof UserPreferences>();
  const [preferences, setPreferences] = useState<UserPreferences>();

  // Get user data from cookies
  let userId = "";
  try {
    const user = getUser();
    if (user) {
      userId = user?._id || "";
    }
  } catch (error) {
    console.error("[EditPreferences] Error parsing user cookie:", error);
  }

  const { userPrefrence, isLoading } = useUserPrefrence(userId);

  useEffect(() => {
    if (userPrefrence) {
      setPreferences(userPrefrence);
    }
  }, [userPrefrence]);

  const handleEditField = (field: keyof UserPreferences) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (
    field: keyof UserPreferences,
    value: any
  ) => {
    try {
      // Update the preferences state
      setPreferences((prev) => {
        const newPrefs = { ...prev } as UserPreferences;
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentKey = parent as keyof UserPreferences;
          const parentValue = newPrefs[parentKey] as Record<string, any>;
          // @ts-ignore
          newPrefs[parentKey] = {
            ...parentValue,
            [child]: value,
          } as typeof parentValue;
        } else {
          // @ts-ignore
          newPrefs[field] = value as (typeof newPrefs)[typeof field];
        }
        return newPrefs;
      });

      // Create an object with only the updated field
      const updateData = field.includes(".")
        ? { [field.split(".")[0]]: { [field.split(".")[1]]: value } }
        : { [field]: value };

      // Update preferences in the backend
      await updateUserPreferences(updateData);
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const { completionPercent, missingCount } = useMemo(() => {
    if (!preferences) return { completionPercent: 0, missingCount: 0 };
    const fields = [
      preferences?.interestedIn,
      preferences?.ageRange?.length ? preferences.ageRange : null,
      preferences?.distance,
      preferences?.heightRange?.length ? preferences.heightRange : null,
      preferences?.goal,
      preferences?.relationshipType,
      preferences?.interests?.length ? preferences.interests : null,
      preferences?.languages?.length ? preferences.languages : null,
      preferences?.zodiacPreference?.length
        ? preferences.zodiacPreference
        : null,
      preferences?.personalityTypePreference?.length
        ? preferences.personalityTypePreference
        : null,
      preferences?.dietPreference?.length ? preferences.dietPreference : null,
      preferences?.religionPreference?.length
        ? preferences.religionPreference
        : null,
      preferences?.drinkingPreference?.length
        ? preferences.drinkingPreference
        : null,
      preferences?.smokingPreference?.length
        ? preferences.smokingPreference
        : null,
      preferences?.petPreference?.length ? preferences.petPreference : null,
    ];
    const filledCount = fields.filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;
    const total = fields.length;
    const percent = total ? Math.round((filledCount / total) * 100) : 0;
    return { completionPercent: percent, missingCount: total - filledCount };
  }, [preferences]);

  if (isLoading) {
    return <SettingsPageLoader />;
  }

  return (
    <>
      <SubPageLayout title="Edit Preferences">
        <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto pb-10">
            <FieldEditor
              isOpen={isEditFieldOpen}
              setIsOpen={setIsEditFieldOpen}
              fieldType={editFieldType}
              onUpdate={handleFieldUpdate}
              currentValue={
                editFieldType && preferences ? preferences[editFieldType] : null
              }
              preferences={preferences as UserPreferences}
            />
            <div className="rounded-2xl border border-ui-shade/10 bg-white p-4">
              <p className="text-sm text-ui-shade/70">Match preferences</p>
              <p className="text-xs text-ui-shade/60 mt-1">
                These help us tailor who you see.
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-ui-shade/10">
                <div
                  className="h-2 rounded-full bg-ui-highlight"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="text-xs text-ui-shade mt-2">
                {completionPercent}% complete
                {missingCount > 0 ? ` · ${missingCount} left` : ""}
              </p>
            </div>

            <Section
              title="Core"
              description="The basics that shape your matches."
            >
              <Field
                label="Interested In"
                field="interestedIn"
                value={preferences?.interestedIn}
                onEdit={handleEditField}
              />
              <Field
                label="Age Range"
                field="ageRange"
                value={
                  preferences?.ageRange?.length
                    ? `${preferences?.ageRange[0]}y - ${preferences?.ageRange[1]}y`
                    : null
                }
                onEdit={handleEditField}
              />
              <Field
                label="Maximum Distance"
                field="distance"
                value={
                  preferences?.distance ? `${preferences?.distance} km` : null
                }
                onEdit={handleEditField}
              />
              <Field
                label="Height Range"
                field="heightRange"
                value={
                  preferences?.heightRange?.length
                    ? `${preferences?.heightRange[0]}cm - ${preferences?.heightRange[1]}cm`
                    : null
                }
                onEdit={handleEditField}
              />
            </Section>

            <Section title="Intent" description="Your relationship goals.">
              <Field
                label="Goals"
                field="goal"
                value={
                  preferences?.goal
                    ? Object.values(preferences?.goal).join(", ")
                    : null
                }
                onEdit={handleEditField}
              />
              <Field
                label="Relationship Type"
                field="relationshipType"
                value={preferences?.relationshipType}
                onEdit={handleEditField}
              />
            </Section>

            <Section
              title="Lifestyle"
              description="Day-to-day habits and preferences."
            >
              <Field
                label="Diet Preferences"
                field="dietPreference"
                value={preferences?.dietPreference?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Drinking Preferences"
                field="drinkingPreference"
                value={preferences?.drinkingPreference?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Smoking Preferences"
                field="smokingPreference"
                value={preferences?.smokingPreference?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Pet Preferences"
                field="petPreference"
                value={preferences?.petPreference?.join(", ")}
                onEdit={handleEditField}
              />
            </Section>

            <Section
              title="Compatibility"
              description="Match on values and personality."
            >
              <Field
                label="Interests"
                field="interests"
                value={preferences?.interests?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Preferred Languages"
                field="languages"
                value={languageDisplay(preferences?.languages || [])?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Zodiac Preferences"
                field="zodiacPreference"
                value={preferences?.zodiacPreference?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Personality Type Preferences"
                field="personalityTypePreference"
                value={preferences?.personalityTypePreference?.join(", ")}
                onEdit={handleEditField}
              />
              <Field
                label="Religion Preferences"
                field="religionPreference"
                value={preferences?.religionPreference?.join(", ")}
                onEdit={handleEditField}
              />
            </Section>
          </div>
        </div>
      </SubPageLayout>
    </>
  );
};

interface FieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType?: keyof UserPreferences | "";
  onUpdate: (field: keyof UserPreferences, value: any) => Promise<void>;
  currentValue: any;
  preferences: UserPreferences;
}

const FieldEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
  onUpdate,
  currentValue,
  preferences,
}: FieldEditorProps) => {
  const getDefaultValue = (field?: keyof UserPreferences | "") => {
    switch (field) {
      case "interests":
        return [];
      case "ageRange":
        return [18, 27];
      case "heightRange":
        return [150, 200];
      case "goal":
        return {
          primary: "",
          secondary: "",
          tertiary: "",
        };
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

  const [value, setValue] = useState(currentValue);

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
              <>
                <MultiSelectField
                  name="interests"
                  label="Interests"
                  max={5}
                  options={interestOptions}
                  value={value || []}
                  onChange={setValue}
                  placeholder="What vibes are you looking for?"
                />
              </>
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

const Field = ({ label, field, value, onEdit, children }: any) => (
  <div
    onClick={() => onEdit(field)}
    className="border border-ui-shade/10 rounded-xl p-3 mt-3"
  >
    <div className="flex justify-between items-center">
      <div className="text-lg">
        <h3 className="text-base text-ui-shade/60">{label}</h3>
        {children || value || "Not set"}
      </div>
    </div>
  </div>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mt-6">
    <p className="text-xs uppercase text-ui-shade/70">{title}</p>
    <p className="text-xs text-ui-shade/60 mt-1">{description}</p>
    {children}
  </div>
);

export default EditPreferences;
