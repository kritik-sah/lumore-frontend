"use client";

import { updateUserData } from "@/lib/apis";
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

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
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
        },
      }),
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, maximumAge: 1000000 } // Reduce frequency
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
        Math.abs(lastSentLocation.current.latitude - latitude) > 0.0001 ||
        Math.abs(lastSentLocation.current.longitude - longitude) > 0.0001;

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
