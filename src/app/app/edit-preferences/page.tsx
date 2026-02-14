"use client";

import { SettingsPageLoader } from "@/components/page-loaders";
import { updateUserPreferences } from "@/lib/apis";
import { queryClient } from "@/service/query-client";
import { getUser } from "@/service/storage";
import { languageDisplay } from "@/utils/helpers";
import { useEffect, useMemo, useState } from "react";
import Field from "../components/profile/edit/Field";
import Section from "../components/profile/edit/Section";
import PreferenceFieldEditor from "../components/preferences/edit/PreferenceFieldEditor";
import { calculatePreferencesCompletion } from "../components/preferences/edit/completion";
import SubPageLayout from "../components/layout/SubPageLayout";
import { UserPreferences, useUserPrefrence } from "../hooks/useUserPrefrence";

const EditPreferences = () => {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<keyof UserPreferences>();
  const [preferences, setPreferences] = useState<UserPreferences>();

  let userId = "";
  try {
    const user = getUser();
    if (user) userId = user?._id || "";
  } catch (error) {
    console.error("[EditPreferences] Error parsing user cookie:", error);
  }

  const { userPrefrence, isLoading } = useUserPrefrence(userId);

  useEffect(() => {
    if (userPrefrence) {
      setPreferences(userPrefrence);
    }
  }, [userPrefrence]);

  const handleEditField = (field: string) => {
    setEditFieldType(field as keyof UserPreferences);
    setIsEditFieldOpen(true);
  };

  const handleFieldUpdate = async (
    field: keyof UserPreferences,
    value: any,
  ) => {
    try {
      setPreferences((prev) => {
        const current = (prev || {}) as UserPreferences;
        return { ...current, [field]: value };
      });

      await updateUserPreferences({ [field]: value });
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      setIsEditFieldOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const { completionPercent, missingCount } = useMemo(
    () => calculatePreferencesCompletion(preferences),
    [preferences],
  );

  if (isLoading) {
    return <SettingsPageLoader />;
  }

  return (
    <SubPageLayout title="Edit Preferences">
      <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto pb-10">
          <PreferenceFieldEditor
            isOpen={isEditFieldOpen}
            setIsOpen={setIsEditFieldOpen}
            fieldType={editFieldType}
            onUpdate={handleFieldUpdate}
            currentValue={
              editFieldType && preferences ? preferences[editFieldType] : null
            }
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
              {missingCount > 0 ? ` - ${missingCount} left` : ""}
            </p>
          </div>

          <Section title="Core" description="The basics that shape your matches.">
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
              value={preferences?.distance ? `${preferences?.distance} km` : null}
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
                preferences?.goal ? Object.values(preferences?.goal).join(", ") : null
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

          <Section title="Lifestyle" description="Day-to-day habits and preferences.">
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

          <Section title="Compatibility" description="Match on values and personality.">
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
  );
};

export default EditPreferences;
