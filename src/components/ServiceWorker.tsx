"use client";
import React, { useEffect } from "react";

const ServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async function () {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
      });
    }
  }, []);

  return <></>;
};

export default ServiceWorker;
