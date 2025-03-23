// Helper function to convert height from cm to feet/inches
export const convertHeight = (cm?: number) => {
  if (!cm) return "N/A";
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainderInches = inches % 12;
  return `${feet}'${remainderInches}"`;
};

// Helper function to calculate age from DOB
export const calculateAge = (dob?: string) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
