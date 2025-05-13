"use client";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import getLastActive from "@/utils/getLastActive";
import { calculateAge, convertHeight } from "@/utils/helpers";
import Cookies from "js-cookie";
import Link from "next/link";
import React from "react";
import { extractFullAddressParts } from "../context/LocationProvider";
import { useLogout } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import Image from "next/image";

const MyProfile = ({ user }: { user: any }) => {
  let userId = "";
  try {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      userId = parsedUser?._id || "";
    }
  } catch (error) {
    console.error("[ChatScreen] Error parsing user cookie:", error);
  }

  const traits = [
    user?.dob && {
      icon: "HiOutlineCake",
      value: calculateAge(user.dob),
    },
    user?.gender && {
      icon: "HiOutlineUser",
      value: user.gender,
    },
    user?.orientation && {
      icon: "IoMagnet",
      value: user.orientation,
    },
    user?.height && {
      icon: "FaRuler",
      value: convertHeight(user.height),
    },
    user?.location?.formattedAddress && {
      icon: "MdOutlineLocationOn",
      value: extractFullAddressParts(user.location.formattedAddress, ["district"]).district,
    },
    user?.diet && {
      icon: "MdOutlineFastfood",
      value: user.diet,
    },
    user?.zodiac && {
      icon: "TbZodiacVirgo",
      value: user.zodiac,
    },
    user?.lifestyle?.drinking && {
      icon: "FaGlassMartiniAlt",
      value: user.lifestyle.drinking,
    },
    user?.lifestyle?.smoking && {
      icon: "FaSmoking",
      value: user.lifestyle.smoking,
    },
    user?.lifestyle?.pet && {
      icon: "FaPaw",
      value: user.lifestyle.pet,
    },
    user?.bloodGroup && {
      icon: "MdOutlineBloodtype",
      value: user.bloodGroup,
    },
  ].filter(Boolean); // remove falsy entries

  console.log("user", user)

  return (
    <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        <div className="my-3">
          <div className="flex items-center justify-start gap-4">

            {user?.profilePicture ? (
              <div className="relative h-20 w-20 aspect-square rounded-full overflow-hidden border border-ui-shade/10">
                <img
                  src={user.profilePicture}
                  alt="Profile picture"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="h-20 w-20 bg-ui-background border border-ui-shade/10 aspect-square rounded-full" />
            )}
            <div className="space-y-1">
              <h3 className="text-xl font-medium flex items-center justify-start gap-1">
                {user?.nickname ? user?.nickname : user?.username}{" "}
                {user?.isVerified ? (
                  <Icon name="MdVerified" className="text-ui-accent" />
                ) : (
                  <Icon name="MdOutlineVerified" className="text-ui-shade/10" />
                )}
                {/* <Badge
                  variant={"outline"}
                  className={`${user?.isActive
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
                </Badge> */}
              </h3>
              <div className="flex items-center justify-start gap-2">
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
          </div>
          <div className="my-3">
            <p className="text-lg">Tired of swiping... & no results...</p>
          </div>
          {userId === user?._id ? (
            <Link href="/app/profile/edit">
              <Button variant={"outline"} className="w-full items-center">Edit Profile <Icon name="FaUserPen" /></Button>
            </Link>
          ) : null}

        </div>

        <div className="bg-ui-background/10 border border-ui-shade/10 rounded-xl p-4 pb-0 mt-3 shadow-sm">
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
            <div className="flex items-center justify-start gap-3 w-full ps-2">
              {traits.map((trait, index) => (
                <InfoItem key={index} icon={trait.icon} value={trait.value} />
              ))}
            </div>
          </div>

          {user?.work ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon
                    name="MdOutlineWorkOutline"
                    className="text-xl flex-shrink-0"
                  />
                </div>
                {user?.work?.title} at {user?.work?.company}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.education ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon
                    name="LuGraduationCap"
                    className="text-xl flex-shrink-0"
                  />
                </div>
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
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon
                    name="HiOutlineBookOpen"
                    className="text-xl flex-shrink-0"
                  />
                </div>
                {user?.religion}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.homeTown ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon name="HiOutlineHome" className="text-xl flex-shrink-0" />
                </div>
                {user?.homeTown}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.maritalStatus ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon name="GiRingBox" className="text-xl flex-shrink-0" />
                </div>
                {user?.maritalStatus}
              </div>
              <Separator />
            </>
          ) : null}

          {user?.languages?.length > 0 ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon
                    name="HiOutlineLanguage"
                    className="text-xl flex-shrink-0"
                  />
                </div>
                {user?.languages?.join(", ")}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.personalityType ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">

                  <Icon name="LuVenetianMask" className="text-xl flex-shrink-0" />
                </div>
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


const InfoItem = ({ icon, value }: { icon: string; value: string | number }) => (
  <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
    <div className="h-8 w-8 flex items-center justify-center flex-shrink-0 aspect-square">
      <Icon name={icon} className="text-xl flex-shrink-0" />
    </div>
    <p className="w-full flex-shrink-0 text-sm">{value}</p>
  </div>
);
