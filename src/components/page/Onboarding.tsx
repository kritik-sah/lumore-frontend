"use client";
import DateField from "@/app/app/components/DateField";
import {
  MultisliderField,
  SelectField,
  SliderField,
  TextField,
} from "@/app/app/components/InputField";
import MultiSelectField from "@/app/app/components/MultiSelectField";
import { useUser } from "@/app/app/hooks/useUser";
import { useUserPrefrence } from "@/app/app/hooks/useUserPrefrence";
import { Button } from "@/components/ui/button";
import {
  setNewPassword,
  updateUserData,
  updateUserPreferences,
} from "@/lib/apis";
import {
  genderOptions,
  goalOptions,
  intrestedInOptions,
  languageOptions,
  religionOptions,
  SelectOption,
} from "@/lib/options";
import { getUser, setIsOnboarded } from "@/service/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define types for the fields
type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "select"
  | "multiselect"
  | "range"
  | "slider";

interface Field {
  type: FieldType;
  place: "user" | "prefrence" | "password";
  name: string;
  label: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // e.g. "yrs", "kg", "%"
  defaultValue?: number | number[];
  placeholder?: string;
  helperText?: string;
  errorText?: string;
}

interface Screen {
  title: string;
  fields: Field[];
}

// Example onboarding config
const onboardingScreens: Screen[] = [
  {
    title: "Oh hey! Let's start with an intro.",
    fields: [
      {
        type: "text",
        place: "user",
        name: "nickname",
        label: "Nick name",
        placeholder: "Batman",
        helperText: "This will be your display name in the app.",
        errorText: "You need a nickname to use this app",
      },
      {
        type: "text",
        place: "user",
        name: "realName",
        label: "Real name",
        placeholder: "Bruce Wayne",
        helperText: "Shown only to your close friends.",
        errorText: "You need a name to use this app",
      },
      {
        type: "date",
        place: "user",
        name: "dob",
        label: "Your Birthday",
        min: 18,
        max: 50,
        helperText: "It's never too early to count down",
        errorText: "You need to enter your birthday",
      },
    ],
  },
  {
    title: "Tell us more about you...",
    fields: [
      {
        type: "number",
        place: "user",
        name: "phoneNumber",
        label: "Phone Number",
        placeholder: "+918080808080",
        helperText: "We'll never share your phone number.",
        errorText: "Please enter a valid phone number",
      },
      {
        type: "select",
        place: "user",
        name: "religion",
        label: "Religion",
        options: religionOptions,
        placeholder: "What's your religion?",
        helperText: "Please choose your religion? we may verify it later",
        errorText: "you must select a religion to continue.",
      },
      // {
      //   type: "password",
      //   place: "password",
      //   name: "password",
      //   label: "Password",
      //   placeholder: "********",
      //   helperText: "Please choose a strong password.",
      //   errorText:
      //     "Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.",
      // },
    ],
  },
  {
    title: "Define yourself, so we can find the best matches for you.",
    fields: [
      {
        type: "select",
        place: "user",
        name: "gender",
        label: "Gender",
        options: genderOptions,
        placeholder: "Select your gender.",
        helperText: "Which gender best describes you?",
        errorText: "Please pick a gender to continue",
      },
      {
        type: "select",
        place: "prefrence",
        name: "interestedIn",
        label: "Looking for",
        options: intrestedInOptions,
        placeholder: "Select a gender.",
        helperText: "Who would you like to meet?",
        errorText: "Please pick a gender to continue",
      },
      {
        type: "multiselect",
        place: "user",
        name: "languages",
        label: "Languages",
        options: languageOptions as SelectOption[],
        placeholder: "Select known languages",
        helperText:
          "You can select multiple languages you are comfortable with.",
        errorText: "Please pick at least one language to continue",
      },
    ],
  },
  {
    title: "Let's tune your soulmate frequency💖",
    fields: [
      {
        type: "range",
        place: "prefrence",
        name: "ageRange",
        label: "Preferred Age Range",
        min: 18,
        max: 50,
        step: 1,
        unit: "yrs",
        defaultValue: [18, 30],
        helperText: "Select the age range you are interested in.",
      },
      {
        type: "slider",
        place: "prefrence",
        name: "distance",
        label: "Preferred Distance",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        unit: "km",
        helperText: "Set the maximum distance for potential matches.",
      },
    ],
  },
  {
    title: "Set Your Intentions, So We Can Find Your Vibe.",
    fields: [
      {
        type: "select",
        place: "prefrence",
        name: "primary-goal",
        label: "What's Your Primary Goal?",
        options: goalOptions,
        placeholder: "My goal is...",
        helperText:
          "This helps us match you with like-minded people. (And won't be shown on your profile)",
        errorText: "Please select a goal to continue",
      },
      {
        type: "select",
        place: "prefrence",
        name: "secondary-goal",
        label: "What's your next priority?",
        options: goalOptions,
        placeholder: "My backup is...",
        helperText:
          "If not your primary goal, what else matters to you? (Also won't be shown on your profile)",
        errorText: "Please select a goal to continue",
      },
      {
        type: "select",
        place: "prefrence",
        name: "tertiary-goal",
        label: "Any other goals or intentions?",
        options: goalOptions,
        placeholder: "My backup of backup is...",
        helperText:
          "What's another reason you're here? (Also won't be shown on your profile)",
        errorText: "Please select a goal to continue",
      },
    ],
  },
];

const Onboarding = ({ screens = onboardingScreens }) => {
  const _user = getUser();
  const userId = _user?._id;
  const { user } = useUser(userId);
  const { userPrefrence } = useUserPrefrence(userId);
  const [screenIndex, setScreenIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const currentScreen = screens[screenIndex];
  const totalScreens = screens.length;
  const progress = ((screenIndex + 1) / totalScreens) * 100;

  useEffect(() => {
    currentScreen.fields.forEach((field) => {
      if (field.place === "user" && user) {
        setFormValues((prev) => ({
          ...prev,
          [field.name]: user[field.name],
        }));
      } else if (field.place === "prefrence" && userPrefrence) {
        if (field.name === "primary-goal") {
          setFormValues((prev) => ({
            ...prev,
            [field.name]: userPrefrence?.goal?.primary,
          }));
        } else if (field.name === "secondary-goal") {
          setFormValues((prev) => ({
            ...prev,
            [field.name]: userPrefrence?.goal?.secondary,
          }));
        } else if (field.name === "tertiary-goal") {
          setFormValues((prev) => ({
            ...prev,
            [field.name]: userPrefrence?.goal?.tertiary,
          }));
        } else {
          setFormValues((prev) => ({
            ...prev,
            [field.name]: userPrefrence[field.name],
          }));
        }
      }
    });
  }, [user, userPrefrence, currentScreen]);

  const handleInputChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateScreen = (screen: Screen, values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    screen.fields.forEach((field) => {
      const value = values[field.name];

      // Basic validation (you can expand this logic as needed)
      if (
        (field.type === "text" ||
          field.type === "select" ||
          field.type === "date") &&
        (!value || value === "")
      ) {
        errors[field.name] = field.errorText || "This field is required.";
      }

      if (field.type === "multiselect" && (value as string[])?.length === 0) {
        errors[field.name] =
          field.errorText || "Please select at least one option.";
      }

      if (field.type === "number" && (value === undefined || value === "")) {
        errors[field.name] = field.errorText || "Please enter a number.";
      }
      if (field.type === "password") {
        const password = value as string;

        if (!password || password.trim() === "") {
          errors[field.name] = field.errorText || "Please enter a password.";
        } else {
          // Regex: At least 8 chars, one uppercase, one lowercase, one number, one special char
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]{8,25}$/;
          if (!passwordRegex.test(password)) {
            errors[field.name] =
              "Password must be at least 8 max 25 characters long, contain uppercase, lowercase, a number, and a special character.";
          }
        }
      }
    });

    return errors;
  };

  const submitOnboardingData = async () => {
    const userData: any = {};
    const userPrefrence: any = {};
    let password: string = "";
    currentScreen.fields.forEach((field) => {
      const value = formValues[field.name];
      if (field.place === "user") {
        userData[field.name] = value;
        if (field.name === "languages") {
          userPrefrence[field.name] = value;
        }
      }
      if (field.place === "prefrence") {
        if (
          ["primary-goal", "secondary-goal", "tertiary-goal"].includes(
            field.name
          )
        ) {
          userPrefrence.goal ??= {}; // create goal object if undefined
          const key = field.name.split("-")[0]; // "primary", "secondary", "tertiary"
          userPrefrence.goal[key] = value;
        } else {
          userPrefrence[field.name] = value;
        }
      }
      if (field.place === "password") {
        password = value as string;
      }
    });
    if (Object.keys(userData).length) {
      updateUserData(userData);
    }
    if (Object.keys(userPrefrence).length) {
      updateUserPreferences(userPrefrence);
    }
    if (password) {
      setNewPassword({ newPassword: password });
    }
  };

  const handleNext = async () => {
    const currentErrors = validateScreen(currentScreen, formValues);

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return; // Stop navigation until fields are valid
    }

    setErrors({}); // Clear previous errors

    if (screenIndex < totalScreens - 1) {
      await submitOnboardingData();
      setScreenIndex((prev) => prev + 1);
      setFormValues({});
    } else {
      await submitOnboardingData();
      setIsOnboarded(userId, true);
      router.replace("/app/profile");
    }
  };

  return (
    <div className="p-4 h-[100vh]">
      {/* Progress bar */}
      <div className="w-full rounded-full border border-ui-highlight/20 overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="rounded-full h-2 bg-ui-highlight"
        ></div>
      </div>

      <div className="flex h-full flex-col justify-between items-center pt-4 w-full">
        <div className="w-full">
          <div className="my-6">
            <p className="text-3xl font-bold text-ui-dark mb-2">
              {currentScreen.title}
            </p>
          </div>

          <div className="space-y-4">
            {currentScreen.fields.map((field) => {
              if (field.type === "date") {
                return (
                  <div key={field.name} className="w-full">
                    <DateField
                      label={field.label}
                      value={formValues[field.name] as string}
                      onChange={(date) => handleInputChange(field.name, date)}
                      placeholder={
                        (formValues[field.name] as string) || field.helperText
                      }
                    />
                  </div>
                ); // Placeholder for date picker component
              }

              if (field.type === "select") {
                return (
                  <div key={field.name} className="w-full">
                    <SelectField
                      label={field.label}
                      options={field.options as any}
                      value={formValues[field.name] as string}
                      name={field.name}
                      onChange={(option) =>
                        handleInputChange(field.name, option)
                      }
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }

              if (field.type === "multiselect") {
                return (
                  <div key={field.name} className="w-full">
                    <MultiSelectField
                      label={field.label}
                      max={5}
                      options={field.options as any}
                      value={(formValues[field.name] as string[]) || []}
                      name={field.name}
                      onChange={(options) =>
                        handleInputChange(field.name, options)
                      }
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }

              if (field.type === "range") {
                return (
                  <div key={field.name} className="w-full">
                    <MultisliderField
                      unit={field.unit as string}
                      name={field.name}
                      label={field.label}
                      value={
                        (formValues[field.name] as number[]) || [
                          field.min,
                          field.max,
                        ]
                      }
                      onChange={(range) => handleInputChange(field.name, range)}
                      min={field.min}
                      max={field.max}
                    />
                  </div>
                );
              }

              if (field.type === "slider") {
                return (
                  <div key={field.name} className="w-full">
                    <SliderField
                      unit={field.unit as string}
                      name={field.name}
                      label={field.label}
                      value={[
                        (formValues[field.name] as number) ||
                          (field.min as number),
                      ]}
                      onChange={(range) => handleInputChange(field.name, range)}
                      min={field.min}
                      max={field.max}
                    />
                  </div>
                );
              }

              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  value={(formValues[field.name] as string) || ""}
                  name={field.name}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full mt-6">
          <Button className="w-full p-6" onClick={handleNext}>
            {screenIndex === totalScreens - 1 ? "Let's Go..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
