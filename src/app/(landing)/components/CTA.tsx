"use client";
import { fetchAppStatus } from "@/lib/apis";
import { formatNumber } from "@/utils/helpers";
// components/CTA.tsx
import { PopupButton } from "@typeform/embed-react";
import { useEffect, useState } from "react";

export default function CTA() {
  interface APP_STATUS {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    genderDistribution: { women: number; men: number; others: number };
  }
  const [appStatus, setappStatus] = useState<APP_STATUS | null>(null);
  useEffect(() => {
    const _fetchAppStatus = async () => {
      const appStatus = await fetchAppStatus();
      if (appStatus.success) {
        setappStatus(appStatus.data);
      }
    };

    _fetchAppStatus();
  }, []);
  return (
    <section className=" px-4 lg:px-0">
      <div className="relative bg-ui-primary/10 text-ui-shade/90 p-6 rounded-2xl max-w-7xl mx-auto border border-1 border-ui-shade/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="">
            <h3 className="text-2xl font-semibold">
              Let&apos;s make things happen.
            </h3>
            <p className="mt-2 max-w-lg">
              Help us tailor Lumore to your needs. 💙
            </p>
          </div>
          <div className="">
            <PopupButton id="ITzseckk" className="mt-4">
              <div className="relative rounded-full border border-ui-shade px-3 py-2 bg-ui-primary text-ui-shade">
                Feedback
                <span className="absolute -top-1 -right-1 flex size-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-accent opacity-75"></span>
                  <span className="relative inline-flex size-4 rounded-full bg-ui-accent"></span>
                </span>
              </div>
            </PopupButton>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="">
            <p className="text-3xl">
              {formatNumber(appStatus?.totalUsers || 0)}
            </p>
            <h4 className="text-lg font-medium">Total Users</h4>
            <p className="text-sm text-gray-600">Everyone who's joined us</p>
          </div>
          <div className="">
            <p className="text-3xl">
              {formatNumber(appStatus?.activeUsers || 0)}
            </p>
            <h4 className="text-lg font-medium">Active Users</h4>
            <p className="text-sm text-gray-600">Connecting right now</p>
          </div>
          <div className="">
            <p className="text-3xl">
              {formatNumber(appStatus?.genderDistribution?.women || 0)}
            </p>
            <h4 className="text-lg font-medium">Women</h4>
            <p className="text-sm text-gray-600">Female community members</p>
          </div>
          <div className="">
            <p className="text-3xl">
              {formatNumber(
                (appStatus?.genderDistribution?.men || 0) +
                  (appStatus?.genderDistribution?.others || 0)
              )}
            </p>
            <h4 className="text-lg font-medium">Men</h4>
            <p className="text-sm text-gray-600">Male community members</p>
          </div>
        </div>
      </div>
    </section>
  );
}
