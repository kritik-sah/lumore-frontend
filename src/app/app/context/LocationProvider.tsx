"use client";

import { updateUserData } from "@/lib/apis";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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

  const mutation = useMutation({
    mutationFn: (locationData: { location: [number, number] }) =>
      updateUserData(locationData),
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
      handleError
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Automatically update user data when location changes
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      mutation.mutate({ location: [latitude, longitude] });
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
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
