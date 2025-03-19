"use client";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import getLastActive from "@/utils/getLastActive";
import Link from "next/link";
import React from "react";
import { useLogout } from "../hooks/useAuth";

const MyProfile = ({ user }: { user: any }) => {
  const { logout } = useLogout();
  console.log("user", user);
  return (
    <div className="bg-ui-background/10 p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-ui-background border border-ui-shade/10 shadow-sm text-ui-shade rounded-xl w-full h-40 relative p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="">
              <h3 className="text-lg flex items-center justify-start gap-1">
                Rebel <Icon name="MdVerified" className="text-ui-accent" />{" "}
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
                <div className="flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="HiOutlineCake"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p>24</p>
                </div>
                <div className="flex items-center justify-center gap-1 flex-shrink-0">
                  <Icon
                    name="HiOutlineUser"
                    className="text-xl flex-shrink-0"
                  />{" "}
                  <p>Man</p>
                </div>
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
            Kritik Sah <Icon name="MdVerified" className="text-ui-accent" />
          </h3>
          <div className="w-full py-2 border-t border-b border-ui-shade/10 overflow-x-scroll mt-2">
            <div className="flex items-center justify-start gap-1">
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="HiOutlineCake" className="text-xl flex-shrink-0" />{" "}
                <p>24</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="HiOutlineUser" className="text-xl flex-shrink-0" />{" "}
                <p>Man</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="IoMagnet" className="text-xl flex-shrink-0" />{" "}
                <p>Straight</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="FaRuler" className="text-xl flex-shrink-0" />{" "}
                <p>5&apos;9</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon
                  name="MdOutlineLocationOn"
                  className="text-xl flex-shrink-0"
                />{" "}
                <p className="w-full flex-shrink-0">Janakpuri East</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon
                  name="MdOutlineFastfood"
                  className="text-xl flex-shrink-0"
                />{" "}
                <p className="w-full flex-shrink-0">Non Veg.</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="TbZodiacVirgo" className="text-xl flex-shrink-0" />{" "}
                <p className="w-full flex-shrink-0">Virgo</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon
                  name="FaGlassMartiniAlt"
                  className="text-xl flex-shrink-0"
                />{" "}
                <p className="w-full flex-shrink-0">Sometimes</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="FaSmoking" className="text-xl flex-shrink-0" />{" "}
                <p className="w-full flex-shrink-0">No</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="FaJoint" className="text-xl flex-shrink-0" />{" "}
                <p className="w-full flex-shrink-0">No</p>
              </div>
              <div className="p-2 border-r border-dashed border-ui-shade/10 flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="FaPaw" className="text-xl flex-shrink-0" />{" "}
                <p className="w-full flex-shrink-0">Dog</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon
              name="MdOutlineWorkOutline"
              className="text-xl flex-shrink-0"
            />
            Web3 Startup
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="LuGraduationCap" className="text-xl flex-shrink-0" />
            University of Mumbai
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="HiOutlineBookOpen" className="text-xl flex-shrink-0" />
            Hindu
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="HiOutlineHome" className="text-xl flex-shrink-0" />
            Mumbai
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="GiRingBox" className="text-xl flex-shrink-0" />
            Single
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="HiOutlineLanguage" className="text-xl flex-shrink-0" />
            English, Hindi, Marathi, Punjabi, Japanese
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-2 py-2">
            <Icon name="LuVenetianMask" className="text-xl flex-shrink-0" />
            INTJ
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
