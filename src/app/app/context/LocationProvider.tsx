"use client";

import { getFormattedAddress, updateUserData } from "@/lib/apis";
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSentLocation = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (locationData: { latitude: number; longitude: number }) =>
      updateUserData({
        location: {
          type: "Point",
          coordinates: [locationData.longitude, locationData.latitude],
          formattedAddress: formattedAddress,
        },
      }),
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      try {
        const formatted = await getFormattedAddress(
          position.coords.latitude,
          position.coords.longitude
        );
        console.log(
          "Formatted Address:",
          extractFullAddressParts(formatted, [
            "area",
            "subregion",
            "district",
            "state",
            "pin",
            "country",
          ]),
          formatted
        );
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setFormattedAddress(formatted);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, maximumAge: 1000000000 } // Reduce frequency
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      // Avoid unnecessary API calls if location hasn't changed significantly
      const hasSignificantChange =
        !lastSentLocation.current ||
        Math.abs(lastSentLocation.current.latitude - latitude) > 1 ||
        Math.abs(lastSentLocation.current.longitude - longitude) > 1;

      if (hasSignificantChange) {
        lastSentLocation.current = { latitude, longitude };
        mutation.mutate({ latitude, longitude });
      }
    }
  }, [latitude, longitude]);

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
