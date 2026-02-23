const parseFlag = (value: string | undefined) => {
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true";
};

export const UI_SIMPLIFICATION_ENABLED = parseFlag(
  process.env.NEXT_PUBLIC_UI_SIMPLIFICATION_V1,
);

export const isUiSimplificationEnabled = () => UI_SIMPLIFICATION_ENABLED;


