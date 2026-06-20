"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trackAnalytic } from "@/service/analytics";
import Link from "next/link";

type SecondaryAction = {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
};

interface SecondaryActionsSheetProps {
  title?: string;
  actions: SecondaryAction[];
}

const SecondaryActionsSheet = ({
  title = "More Actions",
  actions,
}: SecondaryActionsSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant="ghost" className="rounded-full">
          <Icon name="HiMiniEllipsisVertical" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 min-h-[30vh]">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          {actions.map((action) => {
            const content = (
              <>
                <span>{action.label}</span>
                {action.icon ? <Icon name={action.icon} /> : null}
              </>
            );

            const handleActionClick = () => {
              trackAnalytic({
                activity: "secondary_action_opened",
                label: action.label,
                category: "ui-simplification",
              });
              action.onClick?.();
            };

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={handleActionClick}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between border border-ui-shade/10"
                  >
                    {content}
                  </Button>
                </Link>
              );
            }

            return (
              <Button
                key={action.label}
                variant="ghost"
                onClick={handleActionClick}
                className="w-full justify-between border border-ui-shade/10"
              >
                {content}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SecondaryActionsSheet;

