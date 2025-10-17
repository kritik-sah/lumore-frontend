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
import { queryClient } from "@/service/query-client";
import { getUser } from "@/service/storage";
import { languageDisplay } from "@/utils/helpers";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<
    keyof UserPreferences | ""
  >("");
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

  if (isLoading) {
    return <div>Loading...</div>;
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
              label="Interests"
              field="interests"
              value={preferences?.interests?.join(", ")}
              onEdit={handleEditField}
            />
            <Field
              label="Relationship Type"
              field="relationshipType"
              value={preferences?.relationshipType}
              onEdit={handleEditField}
            />
            <Field
              label="Preferred Languages"
              field="preferredLanguages"
              value={languageDisplay(
                preferences?.preferredLanguages || []
              )?.join(", ")}
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
              label="Diet Preferences"
              field="dietPreference"
              value={preferences?.dietPreference?.join(", ")}
              onEdit={handleEditField}
            />
          </div>
        </div>
      </SubPageLayout>
    </>
  );
};

interface FieldEditorProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: keyof UserPreferences | "";
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
  const getDefaultValue = (field: keyof UserPreferences | "") => {
    switch (field) {
      case "interests":
        return [];
      case "ageRange":
        return [18, 27];
      case "goal":
        return {
          primary: "",
          secondary: "",
          tertiary: "",
        };
      case "preferredLanguages":
      case "zodiacPreference":
      case "personalityTypePreference":
      case "dietPreference":
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

  const languageOptions = allLanguages.map(({ code, name, nativeName }) => ({
    label: `${name} (${nativeName})`,
    value: code,
  }));

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
                options={[
                  { label: "Men", value: "Men" },
                  { label: "Women", value: "Women" },
                  { label: "Non-Binary", value: "Non-Binary" },
                  { label: "Any", value: "Any" },
                ]}
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
            {fieldType === "goal" ? (
              <>
                <SelectField
                  name="goal.primary"
                  label="Primary Goal"
                  options={[
                    {
                      label: "Serious Relationship",
                      value: "Serious Relationship",
                    },
                    { label: "Casual Dating", value: "Casual Dating" },
                    { label: "Marriage", value: "Marriage" },
                    { label: "Friendship", value: "Friendship" },
                    { label: "Quick Sex", value: "Quick Sex" },
                    { label: "Undecided", value: "Undecided" },
                    { label: "Long-Term Dating", value: "Long-Term Dating" },
                    { label: "Open Relationship", value: "Open Relationship" },
                    { label: "Networking", value: "Networking" },
                    {
                      label: "Exploring Sexuality",
                      value: "Exploring Sexuality",
                    },
                    { label: "Travel Companion", value: "Travel Companion" },
                    {
                      label: "Polyamorous Relationship",
                      value: "Polyamorous Relationship",
                    },
                    { label: "Activity Partner", value: "Activity Partner" },
                    { label: "Sugar Dating", value: "Sugar Dating" },
                    {
                      label: "Spiritual Connection",
                      value: "Spiritual Connection",
                    },
                  ]}
                  value={value?.primary || "Undecided"}
                  onChange={(e) => setValue({ ...value, primary: e })}
                  placeholder="Select primary goal"
                />
                <SelectField
                  name="goal.secondary"
                  label="Secondary Goal"
                  options={[
                    {
                      label: "Serious Relationship",
                      value: "Serious Relationship",
                    },
                    { label: "Casual Dating", value: "Casual Dating" },
                    { label: "Marriage", value: "Marriage" },
                    { label: "Friendship", value: "Friendship" },
                    { label: "Quick Sex", value: "Quick Sex" },
                    { label: "Undecided", value: "Undecided" },
                    { label: "Long-Term Dating", value: "Long-Term Dating" },
                    { label: "Open Relationship", value: "Open Relationship" },
                    { label: "Networking", value: "Networking" },
                    {
                      label: "Exploring Sexuality",
                      value: "Exploring Sexuality",
                    },
                    { label: "Travel Companion", value: "Travel Companion" },
                    {
                      label: "Polyamorous Relationship",
                      value: "Polyamorous Relationship",
                    },
                    { label: "Activity Partner", value: "Activity Partner" },
                    { label: "Sugar Dating", value: "Sugar Dating" },
                    {
                      label: "Spiritual Connection",
                      value: "Spiritual Connection",
                    },
                  ]}
                  value={value?.secondary || "Undecided"}
                  onChange={(e) => setValue({ ...value, secondary: e })}
                  placeholder="Select secondary goal"
                />
                <SelectField
                  name="goal.tertiary"
                  label="Tertiary Goal"
                  options={[
                    {
                      label: "Serious Relationship",
                      value: "Serious Relationship",
                    },
                    { label: "Casual Dating", value: "Casual Dating" },
                    { label: "Marriage", value: "Marriage" },
                    { label: "Friendship", value: "Friendship" },
                    { label: "Quick Sex", value: "Quick Sex" },
                    { label: "Undecided", value: "Undecided" },
                    { label: "Long-Term Dating", value: "Long-Term Dating" },
                    { label: "Open Relationship", value: "Open Relationship" },
                    { label: "Networking", value: "Networking" },
                    {
                      label: "Exploring Sexuality",
                      value: "Exploring Sexuality",
                    },
                    { label: "Travel Companion", value: "Travel Companion" },
                    {
                      label: "Polyamorous Relationship",
                      value: "Polyamorous Relationship",
                    },
                    { label: "Activity Partner", value: "Activity Partner" },
                    { label: "Sugar Dating", value: "Sugar Dating" },
                    {
                      label: "Spiritual Connection",
                      value: "Spiritual Connection",
                    },
                  ]}
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
                    { label: "Reading", value: "Reading" },
                    { label: "Travel", value: "Travel" },
                    { label: "Music", value: "Music" },
                    { label: "Sports", value: "Sports" },
                    { label: "Cooking", value: "Cooking" },
                    { label: "Photography", value: "Photography" },
                    { label: "Gaming", value: "Gaming" },
                    { label: "Fitness", value: "Fitness" },
                  ]}
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
                options={[
                  { label: "Monogamy", value: "Monogamy" },
                  {
                    label: "Ethical Non-Monogamy",
                    value: "Ethical Non-Monogamy",
                  },
                  { label: "Polyamory", value: "Polyamory" },
                  { label: "Open to Exploring", value: "Open to Exploring" },
                  { label: "Not Specified", value: "Not Specified" },
                ]}
                value={value || "Not Specified"}
                onChange={setValue}
                placeholder="Select relationship type"
              />
            ) : null}
            {fieldType === "preferredLanguages" ? (
              <MultiSelectField
                name="preferredLanguages"
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
                  { label: "Any", value: "Any" },
                ]}
                value={value || ["Any"]}
                onChange={setValue}
                placeholder="Select zodiac preferences"
              />
            ) : null}
            {fieldType === "personalityTypePreference" ? (
              <MultiSelectField
                name="personalityTypePreference"
                label="Personality Type Preferences"
                max={5}
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
                  { label: "Any", value: "Any" },
                ]}
                value={value || ["Any"]}
                onChange={setValue}
                placeholder="Select personality type preferences"
              />
            ) : null}
            {fieldType === "dietPreference" ? (
              <MultiSelectField
                name="dietPreference"
                label="Diet Preferences"
                max={5}
                options={[
                  { label: "Vegetarian", value: "Vegetarian" },
                  { label: "Vegan", value: "Vegan" },
                  { label: "Jain", value: "Jain" },
                  { label: "Pescatarian", value: "Pescatarian" },
                  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
                  { label: "Gluten-Free", value: "Gluten-Free" },
                  { label: "Kosher", value: "Kosher" },
                  { label: "Halal", value: "Halal" },
                  { label: "Any", value: "Any" },
                ]}
                value={value || ["Any"]}
                onChange={setValue}
                placeholder="Select diet preferences"
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

export default EditPreferences;
