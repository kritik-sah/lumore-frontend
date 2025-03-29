"use client";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import getLastActive from "@/utils/getLastActive";
import { calculateAge, convertHeight } from "@/utils/helpers";
import Link from "next/link";
import React from "react";
import { useLogout } from "../hooks/useAuth";

const MyProfile = ({ user }: { user: any }) => {
  const { logout } = useLogout();

  return (
    <div className="bg-ui-background/10 p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-ui-background border border-ui-shade/10 shadow-sm text-ui-shade rounded-xl w-full h-40 relative p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="">
              <h3 className="text-lg flex items-center justify-start gap-1">
                {user?.nickname ? user?.nickname : user?.username}{" "}
                {user?.isVerified ? (
                  <Icon name="MdVerified" className="text-ui-accent" />
                ) : (
                  <Icon name="MdOutlineVerified" className="text-ui-shade/10" />
                )}
                <Badge
                  variant={"outline"}
                  className={`${
                    user?.isActive
                      ? "border-green-500 text-green-500 "
                      : "border-ui-shade text-ui-shade"
                  } relative`}
                >
                  {user?.isActive ? (
                    <span className="absolute -top-1 -right-1">
                      <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                      </span>
                    </span>
                  ) : null}
                  Active{" "}
                  {!user?.isActive ? getLastActive(user?.lastActive) : null}
                </Badge>
              </h3>
              <div className="flex items-center justify-start gap-2 mt-2">
                {user?.dob ? (
                  <div className="flex items-center justify-center gap-1 flex-shrink-0">
                    <Icon
                      name="HiOutlineCake"
                      className="text-xl flex-shrink-0"
                    />{" "}
                    <p>{calculateAge(user?.dob)}</p>
                  </div>
                ) : null}

                {user?.gender ? (
                  <div className="flex items-center justify-center gap-1 flex-shrink-0">
                    <Icon
                      name="HiOutlineUser"
                      className="text-xl flex-shrink-0"
                    />{" "}
                    <p>{user?.gender}</p>
                  </div>
                ) : null}
                <div className="flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="RiPinDistanceLine"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p>{user?.distance.toFixed(2)}km</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link href="/app/profile/edit">
                <Icon name="FaUserPen" />
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ui-foreground outline outline-ui-accent outline-offset-4 rounded-full h-24 w-24 flex-shrink-0 aspect-square"></div>
        </div>

        <div className="bg-ui-background/10 border border-ui-shade/10 rounded-xl p-4 pb-0 mt-16 shadow-sm">
          <h3 className="text-lg flex items-center justify-start gap-1">
            {user?.realName
              ? user?.realName
              : user?.nickname
              ? user?.nickname
              : user?.username}{" "}
            {user?.isVerified ? (
              <Icon name="MdVerified" className="text-ui-accent" />
            ) : (
              <Icon name="MdOutlineVerified" className="text-ui-shade/10" />
            )}
          </h3>
          <div className="w-full py-2 border-t border-b border-ui-shade/10 overflow-x-scroll mt-2">
            <div className="flex items-center justify-start gap-1">
              {user?.dob ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="HiOutlineCake"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p>{calculateAge(user?.dob)}</p>
                </div>
              ) : null}
              {user?.gender ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="HiOutlineUser"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p>{user?.gender}</p>
                </div>
              ) : null}
              {user?.orientation ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon name="IoMagnet" className="text-xl flex-shrink-0" />{" "}
                  <p>{user?.orientation}</p>
                </div>
              ) : null}
              {user?.height ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon name="FaRuler" className="text-xl flex-shrink-0" />{" "}
                  <p>{convertHeight(user?.height)}</p>
                </div>
              ) : null}
              {user?.currentLocation ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="MdOutlineLocationOn"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p className="w-full flex-shrink-0">
                    {user?.currentLocation}
                  </p>
                </div>
              ) : null}
              {user?.diet ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="MdOutlineFastfood"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p className="w-full flex-shrink-0">{user?.diet}</p>
                </div>
              ) : null}
              {user?.zodiac ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="TbZodiacVirgo"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p className="w-full flex-shrink-0">{user?.zodiac}</p>
                </div>
              ) : null}
              {user?.lifestyle?.drinking ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="FaGlassMartiniAlt"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p className="w-full flex-shrink-0">
                    {user?.lifestyle?.drinking}
                  </p>
                </div>
              ) : null}
              {user?.lifestyle?.smoking ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon name="FaSmoking" className="text-xl flex-shrink-0" />{" "}
                  <p className="w-full flex-shrink-0">
                    {user?.lifestyle?.smoking}
                  </p>
                </div>
              ) : null}

              {user?.lifestyle?.pet ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon name="FaPaw" className="text-xl flex-shrink-0" />{" "}
                  <p className="w-full flex-shrink-0">{user?.lifestyle?.pet}</p>
                </div>
              ) : null}
              {user?.bloodGroup ? (
                <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="MdOutlineBloodtype"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p className="w-full flex-shrink-0">{user?.bloodGroup}</p>
                </div>
              ) : null}
            </div>
          </div>
          {user?.work ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon
                  name="MdOutlineWorkOutline"
                  className="text-xl flex-shrink-0"
                />
                {user?.work?.title} at {user?.work?.company}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.education ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon
                  name="LuGraduationCap"
                  className="text-xl flex-shrink-0"
                />
                {user?.education?.degree}{" "}
                {user?.education?.field ? `(${user?.education?.field})` : null}{" "}
                from {user?.education?.institution}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.religion ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon
                  name="HiOutlineBookOpen"
                  className="text-xl flex-shrink-0"
                />
                {user?.religion}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.homeTown ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon name="HiOutlineHome" className="text-xl flex-shrink-0" />
                {user?.homeTown}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.maritalStatus ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon name="GiRingBox" className="text-xl flex-shrink-0" />
                {user?.maritalStatus}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.languages?.length > 0 ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon
                  name="HiOutlineLanguage"
                  className="text-xl flex-shrink-0"
                />
                {user?.languages?.join(", ")}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.personalityType ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <Icon name="LuVenetianMask" className="text-xl flex-shrink-0" />
                {user?.personalityType}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
