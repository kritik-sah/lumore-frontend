"use client";
import { fetchAppStatusPublic } from "@/lib/publicApi";
import { useEffect, useState } from "react";

export default function AppStats() {
  interface APP_STATUS {
    totalUsers: number;
    activeUsers: number;
    isMatching: number;
    inactiveUsers: number;
    genderDistribution: { woman: number; man: number; others: number };
  }
  const [appStatus, setappStatus] = useState<APP_STATUS | null>(null);

  const formatNumber = (num: number): string => {
    if (num === 0) return "0";

    const units = [
      { value: 1e12, suffix: "T" },
      { value: 1e9, suffix: "B" },
      { value: 1e6, suffix: "M" },
      { value: 1e3, suffix: "K" },
    ];

    for (const unit of units) {
      if (num >= unit.value) {
        const rounded = Number((num / unit.value).toFixed(1));
        return rounded % 1 === 0
          ? `${Math.floor(rounded)}${unit.suffix}`
          : `${rounded}${unit.suffix}`;
      }
    }

    return num.toString();
  };

  useEffect(() => {
    const _fetchAppStatus = async () => {
      const status = await fetchAppStatusPublic();
      if (status) {
        setappStatus(status);
      }
    };

    _fetchAppStatus();
  }, []);
  return (
    <section className="my-6 px-4 lg:px-0">
      <div className="relative  text-ui-shade/90 p-6 rounded-2xl max-w-7xl mx-auto bg-gradient-to-b from-ui-highlight/10 to-ui-highlight/30  border border-ui-highlight/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              Let&apos;s make things happen.
            </h2>
            <p className="mt-2 max-w-lg">
              Help us tailor Lumore to your needs.
            </p>
          </div>
          <div>
            <a
              href="https://form.typeform.com/to/ITzseckk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0 relative inline-flex rounded-full px-4 py-2 bg-ui-highlight text-ui-light font-semibold"
            >
              Feedback
              <span className="absolute -top-0 -right-0 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-light opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-ui-accent"></span>
              </span>
            </a>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-ui-shade/10" />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.totalUsers || 0)}
            </p>
            <h3 className="text-lg font-medium">Total Users</h3>
            <p className="text-sm text-ui-shade/70">
              Everyone who&apos;s joined us
            </p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.activeUsers || 0)}
            </p>
            <h3 className="text-lg font-medium">Online Users</h3>
            <p className="text-sm text-ui-shade/70">Online right now</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.isMatching || 0)}
            </p>
            <h3 className="text-lg font-medium">Available Users</h3>
            <p className="text-sm text-ui-shade/70">Looking for match</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.genderDistribution?.woman || 0)}
            </p>
            <h3 className="text-lg font-medium">woman</h3>
            <p className="text-sm text-ui-shade/70">Female community members</p>
          </div>
          <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-3xl">
              {formatNumber(appStatus?.genderDistribution?.man || 0)}
            </p>
            <h3 className="text-lg font-medium">Man</h3>
            <p className="text-sm text-ui-shade/70">Male community members</p>
          </div>
        </div>
      </div>
    </section>
  );
}
