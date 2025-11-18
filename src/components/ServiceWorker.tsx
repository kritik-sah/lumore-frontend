"use client";
import React, { useEffect } from "react";

const ServiceWorker = () => {
  useEffect(() => {
    console.log("registring");
    if ("serviceWorker" in navigator) {
      console.log("in navigator");
      window.addEventListener("load", async function () {
        console.log("window load");
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        console.log("sw registred");
      });
    }
  }, []);

  return <></>;
};

export default ServiceWorker;
