"use client";

import {
  getFormattedAddress,
  type LocationWritePayload,
  updateUserLocation,
} from "@/lib/apis";
import { hasSignificantLocationChange } from "@/lib/locationSync";
import { getUser } from "@/service/storage";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

type FullAddressPart =
  | "area"
  | "subregion"
  | "district"
  | "state"
  | "pin"
  | "country";

interface ParsedAddress {
  area?: string;
  subregion?: string;
  district?: string;
  state?: string;
  pin?: string;
  country?: string;
}

export function extractFullAddressParts(
  address: string,
  parts: FullAddressPart[] = [
    "area",
    "subregion",
    "district",
    "state",
    "pin",
    "country",
  ]
): ParsedAddress {
  const result: ParsedAddress = {};
  const segments = address.split(",").map((s) => s.trim());

  // Reverse for easy positional matching from end
  const reversed = [...segments].reverse();

  const country = reversed[0] || "";
  const pin = reversed[1] || "";
  const state = reversed[2] || "";
  const district = reversed[3] || "";
  const subregion = reversed[4] || "";
  const area = reversed[5] || "";

  if (parts.includes("country")) result.country = country;
  if (parts.includes("pin")) result.pin = pin;
  if (parts.includes("state")) result.state = state;
  if (parts.includes("district")) result.district = district;
  if (parts.includes("subregion")) result.subregion = subregion;
  if (parts.includes("area")) result.area = area;

  return result;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const userId = getUser()?._id || null;
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFix, setCurrentFix] = useState<LocationWritePayload | null>(null);
  const lastSentLocation = useRef<LocationWritePayload | null>(null);

  const locationMutation = useMutation({
    mutationFn: (locationData: LocationWritePayload) =>
      updateUserLocation(locationData),
  });

  useEffect(() => {
    if (!userId) {
      lastSentLocation.current = null;
      setLatitude(null);
      setLongitude(null);
      setCurrentFix(null);
      setError(null);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    let isUnmounted = false;
    setError(null);

    const syncLocation = async (nextLatitude: number, nextLongitude: number) => {
      let nextFormattedAddress: string | null = null;

      try {
        nextFormattedAddress = await getFormattedAddress(nextLatitude, nextLongitude);
      } catch (locationError) {
        console.error("Error fetching address:", locationError);
      }

      if (isUnmounted) return;

      setLatitude(nextLatitude);
      setLongitude(nextLongitude);
      setCurrentFix({
        latitude: nextLatitude,
        longitude: nextLongitude,
        formattedAddress: nextFormattedAddress,
      });
    };

    const handleSuccess = (position: GeolocationPosition) => {
      void syncLocation(position.coords.latitude, position.coords.longitude);
    };

    const handleError = (geoError: GeolocationPositionError) => {
      if (isUnmounted) return;
      setError(geoError.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 15000,
      }
    );

    return () => {
      isUnmounted = true;
      navigator.geolocation.clearWatch(watchId);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !currentFix) return;
    if (!hasSignificantLocationChange(lastSentLocation.current, currentFix)) return;

    lastSentLocation.current = currentFix;
    locationMutation.mutate(currentFix);
  }, [currentFix, locationMutation, userId]);

  return (
    <LocationContext.Provider value={{ latitude, longitude, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

