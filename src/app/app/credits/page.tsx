"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NavLayout from "../components/layout/NavLayout";
import { useCreditsBalance, useCreditsHistory } from "../hooks/useCredits";

const TYPE_LABELS: Record<string, string> = {
  signup_bonus: "Signup bonus",
  daily_active: "Daily active reward",
  conversation_start: "Conversation start",
  this_or_that_approved: "This-or-That approved",
  admin_adjustment: "Admin adjustment",
};

export default function CreditsPage() {
  const [page, setPage] = useState(1);
  const { data: balanceRes, claimDaily, isClaiming } = useCreditsBalance();
  const { data: historyRes, isLoading } = useCreditsHistory(page, 20);

  const balance = balanceRes?.data?.credits ?? 0;
  const rewardGrantedToday = !!balanceRes?.data?.rewardGrantedToday;
  const items = historyRes?.items || [];
  const pagination = historyRes?.pagination;

  return (
    <NavLayout>
      <div className="h-full w-full max-w-2xl mx-auto p-4 space-y-4">
        <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
          <p className="text-sm text-ui-shade/70">Available credits</p>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-3xl font-bold">{balance}</h1>
            <Icon name="FaCoins" className="text-2xl text-ui-highlight" />
          </div>
          <div className="mt-4">
            <Button
              disabled={rewardGrantedToday || isClaiming}
              onClick={() => claimDaily()}
              className="w-full"
            >
              {rewardGrantedToday ? "Daily reward already claimed" : "Claim daily +3"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
          <h2 className="text-lg font-semibold">Credit history</h2>
          <div className="mt-3 space-y-2">
            {isLoading ? <p>Loading...</p> : null}
            {!isLoading && items.length === 0 ? (
              <p className="text-sm text-ui-shade/70">No credit activity yet.</p>
            ) : null}
            {items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between border border-ui-shade/10 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{TYPE_LABELS[item.type] || item.type}</p>
                  <p className="text-xs text-ui-shade/60">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={item.amount >= 0 ? "text-green-600" : "text-red-600"}>
                    {item.amount >= 0 ? `+${item.amount}` : item.amount}
                  </p>
                  <p className="text-xs text-ui-shade/60">Balance: {item.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              disabled={!pagination || page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-ui-shade/70">Page {pagination?.page || 1}</span>
            <Button
              variant="outline"
              disabled={!pagination?.hasMore}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </NavLayout>
  );
}
