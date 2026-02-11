"use client";
import { fetchAppStatus } from "@/lib/apis";
import { formatNumber } from "@/utils/helpers";
import { PopupButton } from "@typeform/embed-react";
import { useEffect, useState } from "react";

export default function CTA() {
  interface APP_STATUS {
    totalUsers: number;
    activeUsers: number;
    isMatching: number;
    inactiveUsers: number;
    genderDistribution: { woman: number; man: number; others: number };
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
    <section className="px-4 lg:px-0">
      <div className="relative bg-ui-primary/10 text-ui-shade/90 p-6 rounded-2xl max-w-7xl mx-auto border border-1 border-ui-shade/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">
              Let&apos;s make things happen.
            </h3>
            <p className="mt-2 max-w-lg">
              Help us tailor Lumore to your needs.
            </p>
          </div>
          <div>
            <PopupButton id="ITzseckk" className="mt-0">
              <div className="relative rounded-full border border-ui-shade px-4 py-2 bg-ui-primary text-ui-shade font-semibold">
                Feedback
                <span className="absolute -top-1 -right-1 flex size-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-accent opacity-75"></span>
                  <span className="relative inline-flex size-4 rounded-full bg-ui-accent"></span>
                </span>
              </div>
            </PopupButton>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-ui-shade/10" />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-ui-shade/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.totalUsers || 0)}
            </p>
            <h4 className="text-lg font-medium">Total Users</h4>
            <p className="text-sm text-gray-600">
              Everyone who&apos;s joined us
            </p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.activeUsers || 0)}
            </p>
            <h4 className="text-lg font-medium">Online Users</h4>
            <p className="text-sm text-gray-600">Online right now</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.isMatching || 0)}
            </p>
            <h4 className="text-lg font-medium">Available Users</h4>
            <p className="text-sm text-gray-600">Looking for match</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.genderDistribution?.woman || 0)}
            </p>
            <h4 className="text-lg font-medium">woman</h4>
            <p className="text-sm text-gray-600">Female community members</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(
                (appStatus?.genderDistribution?.man || 0) +
                  (appStatus?.genderDistribution?.others || 0),
              )}
            </p>
            <h4 className="text-lg font-medium">Man</h4>
            <p className="text-sm text-gray-600">Male community members</p>
          </div>
        </div>
      </div>
    </section>
  );
}
