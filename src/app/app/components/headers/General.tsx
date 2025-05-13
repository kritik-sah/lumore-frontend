"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Icon from "@/components/icon";

const General = ({ userSetting }: { userSetting?: boolean }) => {
  return (
    <header className="z-50 w-full bg-ui-light max-h-16">
      <div className="container mx-auto px-2 md:px-0 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/app" className="mr-6 flex items-center space-x-2">
            <Image src={"/assets/lumore-hr.svg"} alt="Lumore" height={60} width={100} />
            <span className="sr-only font-bold">Lumore</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <div className="flex items-center space-x-2 text-lg">
            <Link href="/app/edit-preferences">
              <Icon name="IoOptionsOutline" className="h-7 w-7" />
            </Link>
            {userSetting ? <Link href="/app/user-settings">
              <Icon name="IoSettingsOutline" className="h-7 w-7" />
            </Link> : null}

          </div>
        </div>
      </div>
    </header>
  );
};

export default General;
