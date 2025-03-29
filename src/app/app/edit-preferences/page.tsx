"use client";
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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectField, TextField } from "../components/InputField";
import MultiSelectField from "../components/MultiSelectField";
import General from "../components/headers/General";
import GeneralLayout from "../components/layout/general";
import { useUser } from "../hooks/useUser";

interface UserPreferences {
  interestedIn: string;
  ageRange: { min: number; max: number };
  distance: number;
  goal: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  interests: {
    professional: string[];
    hobbies: string[];
  };
  relationshipType: string;
  preferredLanguages: string[];
  zodiacPreference: string[];
  education: {
    institutions: string[];
    minimumDegreeLevel: string;
  };
  personalityTypePreference: string[];
  dietPreference: string[];
  locationPreferences: {
    homeTown: string[];
    currentLocation: string[];
  };
}

const EditPreferences = () => {
  const router = useRouter();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<
    keyof UserPreferences | ""
  >("");
  const [preferences, setPreferences] = useState<UserPreferences>({
    interestedIn: "Men",
    ageRange: { min: 18, max: 27 },
    distance: 10,
    goal: {
      primary: "Undecided",
      secondary: "Undecided",
      tertiary: "Undecided",
    },
    interests: {
      professional: [],
      hobbies: [],
    },
    relationshipType: "Not Specified",
    preferredLanguages: [],
    zodiacPreference: ["Any"],
    education: {
      institutions: [],
      minimumDegreeLevel: "No Preference",
    },
    personalityTypePreference: ["Any"],
    dietPreference: ["Any"],
    locationPreferences: {
      homeTown: [],
      currentLocation: [],
    },
  });

  // Get user data from cookies
  let userId = "";
  try {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      userId = parsedUser?._id || "";
    }
  } catch (error) {
    console.error("[EditPreferences] Error parsing user cookie:", error);
  }

  const { user, isLoading } = useUser(userId);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

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
      <GeneralLayout>
        <div className="bg-ui-background/10 p-4">
          <div className="w-full max-w-3xl mx-auto pb-10">
            <h3 className="text-xl font-medium">Edit Preferences</h3>
            <FieldEditor
              isOpen={isEditFieldOpen}
              setIsOpen={setIsEditFieldOpen}
              fieldType={editFieldType}
              onUpdate={handleFieldUpdate}
              currentValue={editFieldType ? preferences[editFieldType] : null}
              preferences={preferences}
            />
            <div
              onClick={() => handleEditField("interestedIn")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">Interested In</h3>
                  {preferences.interestedIn}
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("ageRange")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">Age Range</h3>
                  {preferences.ageRange.min} - {preferences.ageRange.max} years
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("distance")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">Maximum Distance</h3>
                  {preferences.distance} km
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("goal")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">Goals</h3>
                  <div>Primary: {preferences.goal.primary}</div>
                  <div>Secondary: {preferences.goal.secondary}</div>
                  <div>Tertiary: {preferences.goal.tertiary}</div>
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
                    {preferences.interests.professional.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">
                          Professional:
                        </span>{" "}
                        {preferences.interests.professional.join(", ")}
                      </div>
                    )}
                    {preferences.interests.hobbies.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Hobbies:</span>{" "}
                        {preferences.interests.hobbies.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("relationshipType")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">
                    Relationship Type
                  </h3>
                  {preferences.relationshipType}
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("preferredLanguages")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">
                    Preferred Languages
                  </h3>
                  {preferences.preferredLanguages.join(", ") || "Not set"}
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("zodiacPreference")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">
                    Zodiac Preferences
                  </h3>
                  {preferences.zodiacPreference.join(", ")}
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("education")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">
                    Education Preferences
                  </h3>
                  <div>
                    Minimum Degree: {preferences.education.minimumDegreeLevel}
                  </div>
                  <div>
                    Institutions:{" "}
                    {preferences.education.institutions.join(", ") || "Not set"}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("personalityTypePreference")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">
                    Personality Type Preferences
                  </h3>
                  {preferences.personalityTypePreference.join(", ")}
                </div>
              </div>
            </div>
            <div
              onClick={() => handleEditField("dietPreference")}
              className="border border-ui-shade/10 rounded-xl p-2 mt-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-ui-shade/60">Diet Preferences</h3>
                  {preferences.dietPreference.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GeneralLayout>
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
        return { professional: [], hobbies: [] };
      case "ageRange":
        return { min: 18, max: 27 };
      case "goal":
        return {
          primary: "Undecided",
          secondary: "Undecided",
          tertiary: "Undecided",
        };
      case "education":
        return { institutions: [], minimumDegreeLevel: "No Preference" };
      case "locationPreferences":
        return { homeTown: [], currentLocation: [] };
      case "preferredLanguages":
      case "zodiacPreference":
      case "personalityTypePreference":
      case "dietPreference":
        return [];
      default:
        return null;
    }
  };

  const [value, setValue] = useState(
    currentValue || getDefaultValue(fieldType)
  );

  useEffect(() => {
    setValue(currentValue || getDefaultValue(fieldType));
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
    value: name,
  }));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">Edit {fieldType}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
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
                value={value || "Men"}
                onChange={setValue}
                placeholder="Select gender preferences"
              />
            ) : null}
            {fieldType === "ageRange" ? (
              <>
                <TextField
                  name="ageRange.min"
                  label="Minimum Age"
                  type="number"
                  value={value?.min || 18}
                  onChange={(e) =>
                    setValue({ ...value, min: parseInt(e.target.value) })
                  }
                  min={18}
                  max={100}
                />
                <TextField
                  name="ageRange.max"
                  label="Maximum Age"
                  type="number"
                  value={value?.max || 27}
                  onChange={(e) =>
                    setValue({ ...value, max: parseInt(e.target.value) })
                  }
                  min={18}
                  max={100}
                />
              </>
            ) : null}
            {fieldType === "distance" ? (
              <TextField
                name="distance"
                label="Maximum Distance (km)"
                type="number"
                value={value || 10}
                onChange={(e) => setValue(parseInt(e.target.value))}
                min={1}
                max={1000}
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
                  name="interests.professional"
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
                  onChange={(selectedValues) =>
                    setValue({ ...value, professional: selectedValues })
                  }
                  placeholder="Select professional interests"
                />
                <MultiSelectField
                  name="interests.hobbies"
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
                  onChange={(selectedValues) =>
                    setValue({ ...value, hobbies: selectedValues })
                  }
                  placeholder="Select hobbies"
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
            {fieldType === "education" ? (
              <>
                <SelectField
                  name="education.minimumDegreeLevel"
                  label="Minimum Degree Level"
                  options={[
                    { label: "High School", value: "High School" },
                    { label: "Bachelor's", value: "Bachelor's" },
                    { label: "Master's", value: "Master's" },
                    { label: "Doctorate", value: "Doctorate" },
                    { label: "No Preference", value: "No Preference" },
                  ]}
                  value={value?.minimumDegreeLevel || "No Preference"}
                  onChange={(e) =>
                    setValue({ ...value, minimumDegreeLevel: e })
                  }
                  placeholder="Select minimum degree level"
                />
                <MultiSelectField
                  name="education.institutions"
                  label="Preferred Institutions"
                  options={[
                    { label: "Harvard", value: "Harvard" },
                    { label: "MIT", value: "MIT" },
                    { label: "Stanford", value: "Stanford" },
                    { label: "Oxford", value: "Oxford" },
                    { label: "Cambridge", value: "Cambridge" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={value?.institutions || []}
                  onChange={(selectedValues) =>
                    setValue({ ...value, institutions: selectedValues })
                  }
                  placeholder="Select preferred institutions"
                />
              </>
            ) : null}
            {fieldType === "personalityTypePreference" ? (
              <MultiSelectField
                name="personalityTypePreference"
                label="Personality Type Preferences"
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

export default EditPreferences;
