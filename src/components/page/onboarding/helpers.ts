"use client";

import type { Screen } from "./types";

const GOAL_FIELD_MAP: Record<string, "primary" | "secondary" | "tertiary"> = {
  "primary-goal": "primary",
  "secondary-goal": "secondary",
  "tertiary-goal": "tertiary",
};

export function getInitialValuesForScreen(
  screen: Screen,
  user: Record<string, any> | undefined,
  userPreference: Record<string, any> | undefined,
) {
  const initialValues: Record<string, unknown> = {};

  screen.fields.forEach((field) => {
    if (field.place === "user" && user) {
      initialValues[field.name] = user[field.name];
      return;
    }

    if (field.place === "prefrence" && userPreference) {
      if (GOAL_FIELD_MAP[field.name]) {
        initialValues[field.name] = userPreference?.goal?.[GOAL_FIELD_MAP[field.name]];
      } else {
        initialValues[field.name] = userPreference[field.name];
      }
    }
  });

  return initialValues;
}

export function validateScreen(screen: Screen, values: Record<string, unknown>) {
  const errors: Record<string, string> = {};

  screen.fields.forEach((field) => {
    const value = values[field.name];

    if (
      (field.type === "text" ||
        field.type === "email" ||
        field.type === "select" ||
        field.type === "date") &&
      (!value || value === "")
    ) {
      errors[field.name] = field.errorText || "This field is required.";
    }

    if (field.type === "multiselect" && (value as string[])?.length === 0) {
      errors[field.name] = field.errorText || "Please select at least one option.";
    }

    if (field.type === "number" && (value === undefined || value === "")) {
      errors[field.name] = field.errorText || "Please enter a number.";
    }

    if (field.type === "password") {
      const password = value as string;
      if (!password || password.trim() === "") {
        errors[field.name] = field.errorText || "Please enter a password.";
      } else {
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
}

export function buildOnboardingPayload(
  screen: Screen,
  formValues: Record<string, unknown>,
) {
  const userData: Record<string, unknown> = {};
  const userPreferenceData: Record<string, any> = {};
  let password = "";

  screen.fields.forEach((field) => {
    const value = formValues[field.name];

    if (field.place === "user") {
      userData[field.name] = value;
      if (field.name === "languages") {
        userPreferenceData[field.name] = value;
      }
    }

    if (field.place === "prefrence") {
      if (GOAL_FIELD_MAP[field.name]) {
        userPreferenceData.goal ??= {};
        userPreferenceData.goal[GOAL_FIELD_MAP[field.name]] = value;
      } else {
        userPreferenceData[field.name] = value;
      }
    }

    if (field.place === "password") {
      password = value as string;
    }
  });

  return { userData, userPreferenceData, password };
}
