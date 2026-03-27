import type { LocationWritePayload } from "./apis";

const EARTH_RADIUS_METERS = 6371000;
const MIN_SIGNIFICANT_MOVEMENT_METERS = 100;

const normalizeAddress = (formattedAddress?: string | null) =>
  String(formattedAddress || "").trim();

export const calculateDistanceMeters = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const hasSignificantLocationChange = (
  previousLocation: LocationWritePayload | null,
  nextLocation: LocationWritePayload,
) => {
  if (!previousLocation) return true;

  if (
    normalizeAddress(previousLocation.formattedAddress) !==
    normalizeAddress(nextLocation.formattedAddress)
  ) {
    return true;
  }

  return (
    calculateDistanceMeters(
      previousLocation.latitude,
      previousLocation.longitude,
      nextLocation.latitude,
      nextLocation.longitude,
    ) >= MIN_SIGNIFICANT_MOVEMENT_METERS
  );
};
