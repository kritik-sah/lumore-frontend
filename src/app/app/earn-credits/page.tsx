"use client";

import Icon from "@/components/icon";
import NavLayout from "../components/layout/NavLayout";
import SubPageLayout from "../components/layout/SubPageLayout";

const earnWays = [
  {
    title: "Daily activity",
    amount: "+1 / +3",
    description:
      "Claim once per UTC day. Unverified users get +1, verified users get +3.",
  },
  {
    title: "Signup bonus",
    amount: "+10",
    description: "Granted once for new users.",
  },
  {
    title: "This-or-That approvals",
    amount: "+5",
    description:
      "Awarded when your submitted question is approved. Each question is rewarded once.",
  },
  {
    title: "Referral rewards",
    amount: "+10",
    description:
      "Given to the referrer when the referred user gets verified. Referrer must also be verified.",
  },
];

const creditUses = [
  "Use credits to unlock and power premium in-app actions.",
  "Credits support matchmaking and conversation-related actions.",
  "Credits can be used in future Lumore features and game mechanics.",
];

export default function EarnCreditsPage() {
  return (
    <NavLayout>
      <SubPageLayout title="Earn Credits">
        <div className="h-full">
          <div className="w-full max-w-2xl overflow-auto max-h-[80vh] mx-auto p-4 space-y-4">
            <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4">
              <p className="text-sm text-ui-shade/70">How credits are earned</p>
              <h1 className="text-2xl font-bold mt-1">
                Ways to earn on Lumore
              </h1>
              <div className="mt-4 space-y-2">
                {earnWays.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-ui-shade/10 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm font-semibold text-ui-highlight">
                        {item.amount}
                      </p>
                    </div>
                    <p className="text-sm text-ui-shade/70 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4">
              <div className="flex items-center justify-start gap-2">
                <Icon name="FaCoins" className="text-ui-highlight" />
                <h2 className="text-lg font-semibold">
                  How credits are distributed
                </h2>
              </div>
              <p className="text-sm text-ui-shade/70 mt-2">
                Credit distribution is based on completed actions and approved
                contributions. Rewards are awarded only when each condition is
                fully satisfied and are protected against duplicate payouts
                where applicable.
              </p>
              <div className="mt-3 space-y-2 text-sm text-ui-shade/80">
                <p>- Daily reward can be claimed once per UTC day.</p>
                <p>
                  - Referral bonus is paid only after the referred user is
                  verified.
                </p>
                <p>
                  - Referral code cannot be self-applied and should come from a
                  user who joined before you.
                </p>
                <p>
                  - This-or-That reward is paid only on admin approval of your
                  question.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4">
              <h2 className="text-lg font-semibold">
                What credits are used for
              </h2>
              <div className="mt-3 space-y-2">
                {creditUses.map((item) => (
                  <p key={item} className="text-sm text-ui-shade/80">
                    - {item}
                  </p>
                ))}
                <p className="text-sm text-ui-shade/80">
                  - Starting a new matched conversation currently costs 1 credit
                  per participant.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4">
              <h2 className="text-lg font-semibold">
                Future plan: Lumore Token
              </h2>
              <p className="text-sm text-ui-shade/80 mt-2">
                We plan to launch a Lumore token in the future. The target model
                is 1 credit = 1 Lumore token, designed to be tradable on the
                open market after launch.
              </p>
              <p className="text-xs text-ui-shade/60 mt-2">
                Note: Token launch, conversion, and market availability are
                future plans and are not live yet.
              </p>
            </div>
          </div>
        </div>
      </SubPageLayout>
    </NavLayout>
  );
}
