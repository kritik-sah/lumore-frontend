"use client";

import {
  genderOptions,
  goalOptions,
  interestedInOptions,
  languageOptions,
} from "@/lib/options";
import type { Screen } from "./types";

export const onboardingScreens: Screen[] = [
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
    title: "Let's keep your account secure.",
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
        type: "email",
        place: "user",
        name: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        helperText: "Please provide a valid email address.",
        errorText: "Please enter a valid email address to continue",
      },
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
        options: interestedInOptions,
        placeholder: "Select a gender.",
        helperText: "Who would you like to meet?",
        errorText: "Please pick a gender to continue",
      },
      {
        type: "multiselect",
        place: "user",
        name: "languages",
        label: "Languages",
        options: languageOptions,
        placeholder: "Select known languages",
        helperText: "You can select multiple languages you are comfortable with.",
        errorText: "Please pick at least one language to continue",
      },
    ],
  },
  {
    title: "Let's tune your soulmate frequency",
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
