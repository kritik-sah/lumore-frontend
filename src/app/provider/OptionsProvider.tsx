"use client";

import { apiClient } from "@/service/api-client";
import React, { useCallback, useEffect, useRef } from "react";
import {
  DYNAMIC_OPTIONS_REFETCH_EVENT,
  DYNAMIC_OPTIONS_UPDATED_EVENT,
  DYNAMIC_OPTIONS_VERSION_KEY,
  DynamicOptionsPayload,
  applyDynamicOptions,
  getCachedOptionsVersion,
  loadDynamicOptionsFromCache,
  saveDynamicOptionsToCache,
  setCachedOptionsVersion,
} from "@/lib/options";

const OPTIONS_ENDPOINTS = ["/config/options", "/options", "/status/options"];
const OPTIONS_META_ENDPOINTS = [
  "/config/options/meta",
  "/options/meta",
  "/status/options-version",
];
const OPTIONS_META_POLL_INTERVAL = 60_000;

type GenericRecord = Record<string, any>;

const pickFirst = <T,>(...values: T[]) =>
  values.find((value) => value !== undefined && value !== null);

const extractPayload = (responseData: GenericRecord): DynamicOptionsPayload | null => {
  const container = pickFirst(
    responseData?.data?.options,
    responseData?.options,
    responseData?.data,
  );

  if (!container || typeof container !== "object") return null;

  const payload: DynamicOptionsPayload = {};
  Object.entries(container).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      (payload as GenericRecord)[key] = value;
    }
  });
  return payload;
};

const extractVersion = (responseData: GenericRecord): string | null => {
  const version = pickFirst(
    responseData?.data?.version,
    responseData?.version,
    responseData?.data?.optionsVersion,
    responseData?.optionsVersion,
    responseData?.data?.updatedAt,
    responseData?.updatedAt,
  );
  return typeof version === "string" && version.trim() ? version : null;
};

const requestFirstSuccess = async (endpoints: string[]) => {
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch {
      continue;
    }
  }
  return null;
};

export const OptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const optionsVersionRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchOptions = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const data = await requestFirstSuccess(OPTIONS_ENDPOINTS);
      if (!data) return;

      const payload = extractPayload(data);
      if (!payload) return;

      applyDynamicOptions(payload);
      const version = extractVersion(data) || optionsVersionRef.current || undefined;
      saveDynamicOptionsToCache(payload, version);

      if (version) {
        optionsVersionRef.current = version;
        setCachedOptionsVersion(version);
      }

      window.dispatchEvent(
        new CustomEvent(DYNAMIC_OPTIONS_UPDATED_EVENT, {
          detail: { version: optionsVersionRef.current },
        }),
      );
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const syncByMeta = useCallback(async () => {
    const metaData = await requestFirstSuccess(OPTIONS_META_ENDPOINTS);
    if (!metaData) {
      await fetchOptions();
      return;
    }

    const nextVersion = extractVersion(metaData);
    if (!nextVersion) {
      await fetchOptions();
      return;
    }

    if (optionsVersionRef.current !== nextVersion) {
      optionsVersionRef.current = nextVersion;
      await fetchOptions();
    }
  }, [fetchOptions]);

  useEffect(() => {
    loadDynamicOptionsFromCache();
    optionsVersionRef.current = getCachedOptionsVersion();
    void fetchOptions();

    const handleRefetch = () => {
      void fetchOptions();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === DYNAMIC_OPTIONS_VERSION_KEY) {
        const nextVersion = event.newValue;
        if (!nextVersion || nextVersion === optionsVersionRef.current) return;
        optionsVersionRef.current = nextVersion;
        loadDynamicOptionsFromCache();
        void fetchOptions();
      }
    };

    const intervalId = window.setInterval(() => {
      void syncByMeta();
    }, OPTIONS_META_POLL_INTERVAL);

    window.addEventListener(DYNAMIC_OPTIONS_REFETCH_EVENT, handleRefetch);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(DYNAMIC_OPTIONS_REFETCH_EVENT, handleRefetch);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchOptions, syncByMeta]);

  return <>{children}</>;
};
