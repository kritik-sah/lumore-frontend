"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { referralCodeSchema } from "@/lib/validation";
import {
  getAccessToken,
  getPendingReferralCode,
  getUser,
  removePendingReferralCode,
  setPendingReferralCode,
} from "@/service/storage";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NavLayout from "../components/layout/NavLayout";
import { useApplyReferralCode, useReferralSummary } from "../hooks/useReferral";

export default function ReferralPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const applyMutation = useApplyReferralCode();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data, isLoading } = useReferralSummary(Boolean(isAuthenticated));

  const summary = data?.data;
  const canAccess = Boolean(summary?.canAccess);
  const referredBy = summary?.referredBy;

  useEffect(() => {
    const normalizedInitialCode = initialCode.trim();
    if (normalizedInitialCode) {
      setPendingReferralCode(normalizedInitialCode);
      setCode((prev) => prev || normalizedInitialCode);
    }

    const token = getAccessToken();
    const user = getUser();
    const loggedIn = Boolean(token && user?._id);
    setIsAuthenticated(loggedIn);

    if (!loggedIn) {
      const ua = navigator.userAgent || "";
      const isAndroid = /android/i.test(ua);
      const isIOS =
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      const playstoreUrl =
        process.env.NEXT_PUBLIC_PLAYSTORE_URL ||
        "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa";
      const appstoreUrl = process.env.NEXT_PUBLIC_APPSTORE_URL || playstoreUrl;

      const redirectUrl = isIOS ? appstoreUrl : isAndroid ? playstoreUrl : playstoreUrl;
      window.location.replace(redirectUrl);
      return;
    }

    const storedCode = getPendingReferralCode();
    if (!normalizedInitialCode && storedCode) {
      setCode((prev) => prev || storedCode);
    }
  }, [initialCode]);

  const canApply = useMemo(
    () => canAccess && !!code.trim() && !referredBy && !applyMutation.isPending,
    [canAccess, code, referredBy, applyMutation.isPending],
  );

  const handleCopyCode = async () => {
    if (!canAccess || !summary?.referralCode) return;
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    if (!canAccess || !summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    if (!canApply) return;
    const parsed = referralCodeSchema.safeParse(code);
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message || "Invalid referral code.");
      return;
    }
    setCodeError("");
    try {
      await applyMutation.mutateAsync(parsed.data);
      removePendingReferralCode();
    } catch (error: any) {
      setCodeError(error?.response?.data?.message || "Could not apply referral code");
    }
  };

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <NavLayout>
      <div className="h-full w-full max-w-2xl mx-auto p-4 space-y-4">
        <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
          <p className="text-sm text-ui-shade/70">Your referral code</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold break-all">
              {isLoading ? "Loading..." : summary?.referralCode || "-"}
            </h1>
            <Icon name="FaCoins" className="text-2xl text-ui-highlight" />
          </div>
          <p className="mt-2 text-sm text-ui-shade/70">
            Earn +{summary?.referralRewardCredits ?? 10} credits when a referred
            user completes profile verification.
          </p>

          {!canAccess ? (
            <p className="mt-3 rounded-lg bg-ui-shade/10 px-3 py-2 text-sm text-ui-shade">
              Referral is only available to verified users.
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button disabled={!canAccess} onClick={handleCopyCode}>
              Copy code
            </Button>
            <Button
              variant="outline"
              disabled={!canAccess}
              onClick={handleCopyLink}
            >
              Copy link
            </Button>
          </div>
          {copied ? (
            <p className="mt-2 text-xs text-green-600">Copied</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
          <h2 className="text-lg font-semibold">Apply referral code</h2>
          <div className="mt-3 space-y-2">
            <Input
              placeholder="Enter username referral code"
              value={code}
              onChange={(e) => {
                const nextCode = e.target.value;
                setCode(nextCode);
                setCodeError("");
                const normalized = nextCode.trim();
                if (normalized) {
                  setPendingReferralCode(normalized);
                } else {
                  removePendingReferralCode();
                }
              }}
              disabled={!!referredBy}
            />
            {referredBy ? (
              <p className="text-sm text-ui-shade/70">
                Already applied: {referredBy}
              </p>
            ) : null}
            {codeError ? <p className="text-sm text-red-500">{codeError}</p> : null}
            <Button className="w-full" onClick={handleApply}>
              {applyMutation.isPending ? "Applying..." : "Apply code"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
          <h2 className="text-lg font-semibold">Referral stats</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-ui-shade/10 p-3">
              <p className="text-xs text-ui-shade/70">Referred</p>
              <p className="text-xl font-semibold">
                {summary?.stats?.referredTotal ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-ui-shade/10 p-3">
              <p className="text-xs text-ui-shade/70">Verified</p>
              <p className="text-xl font-semibold">
                {summary?.stats?.referredVerified ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-ui-shade/10 p-3">
              <p className="text-xs text-ui-shade/70">Rewards</p>
              <p className="text-xl font-semibold">
                {summary?.stats?.rewardsEarned ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavLayout>
  );
}
