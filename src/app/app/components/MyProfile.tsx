"use client";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { deletePost } from "@/lib/apis";
import { getUser } from "@/service/storage";
import getLastActive from "@/utils/getLastActive";
import {
  calculateAge,
  convertHeight,
  distanceDisplay,
  languageDisplay,
} from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { extractFullAddressParts } from "../context/LocationProvider";

const MyProfile = ({
  user,
  posts,
  preferences,
}: {
  user: any;
  posts: any;
  preferences?: any;
}) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  let userId = getUser()._id || "";

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
      value: extractFullAddressParts(user.location.formattedAddress, [
        "district",
      ]).district,
    },
    user?.diet && {
      icon: "MdOutlineFastfood",
      value: user.diet,
    },
    user?.zodiacSign && {
      icon: "TbZodiacVirgo",
      value: user.zodiacSign,
    },
    user?.lifestyle?.drinking && {
      icon: "FaGlassMartiniAlt",
      value: user.lifestyle.drinking,
    },
    user?.lifestyle?.smoking && {
      icon: "FaSmoking",
      value: user.lifestyle.smoking,
    },
    user?.lifestyle?.pets && {
      icon: "FaPaw",
      value: user.lifestyle.pets,
    },
    user?.bloodGroup && {
      icon: "MdOutlineBloodtype",
      value: user.bloodGroup,
    },
  ].filter(Boolean); // remove falsy entries

  const isOwner = userId === user?._id;

  // const handleEditPost = (post: any) => {

  const handleDeletePost = async (post: any) => {
    if (!post?._id) return;
    const confirmDelete = window.confirm(
      "Delete this post? This cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(post._id);
      await deletePost(post._id);
      await queryClient.invalidateQueries({
        queryKey: ["user posts", user?._id],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const { profileCompletion, preferenceCompletion } = (() => {
    const profileFields = [
      user?.profilePicture,
      user?.bio,
      user?.gender,
      user?.dob,
      user?.interests?.length ? user?.interests : null,
      user?.height,
      user?.diet,
      user?.zodiacSign,
      user?.lifestyle?.drinking,
      user?.lifestyle?.smoking,
      user?.lifestyle?.pets,
      user?.work,
      user?.institution,
      user?.languages?.length ? user?.languages : null,
      user?.personalityType,
      user?.religion,
      user?.homeTown,
    ];

    const profileFilled = profileFields.filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;

    const profilePercent = profileFields.length
      ? Math.round((profileFilled / profileFields.length) * 100)
      : 0;

    const preferenceFields = [
      preferences?.interestedIn,
      preferences?.ageRange?.length ? preferences.ageRange : null,
      preferences?.distance,
      preferences?.heightRange?.length ? preferences.heightRange : null,
      preferences?.goal,
      preferences?.relationshipType,
      preferences?.interests?.length ? preferences.interests : null,
      preferences?.languages?.length ? preferences.languages : null,
      preferences?.zodiacPreference?.length
        ? preferences.zodiacPreference
        : null,
      preferences?.personalityTypePreference?.length
        ? preferences.personalityTypePreference
        : null,
      preferences?.dietPreference?.length ? preferences.dietPreference : null,
      preferences?.religionPreference?.length
        ? preferences.religionPreference
        : null,
      preferences?.drinkingPreference?.length
        ? preferences.drinkingPreference
        : null,
      preferences?.smokingPreference?.length
        ? preferences.smokingPreference
        : null,
      preferences?.petPreference?.length ? preferences.petPreference : null,
    ];

    const preferenceFilled = preferenceFields.filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;

    const preferencePercent = preferenceFields.length
      ? Math.round((preferenceFilled / preferenceFields.length) * 100)
      : 0;

    return {
      profileCompletion: profilePercent,
      preferenceCompletion: preferencePercent,
    };
  })();

  return (
    <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        <div className="my-3">
          <div className="flex items-center justify-start gap-4">
            {user?.profilePicture ? (
              <div className="relative h-20 w-20 aspect-square rounded-full overflow-hidden border border-ui-shade/10">
                <picture>
                  <img
                    src={user.profilePicture}
                    alt="Profile picture"
                    className={`${user?.isViewerUnlockedByUser ? "" : "blur-xs"} object-cover w-full h-full`}
                  />
                </picture>
              </div>
            ) : (
              <div className="h-20 w-20 bg-ui-background border border-ui-shade/10 aspect-square rounded-full" />
            )}
            <div className="space-y-1">
              <h3 className="text-xl font-medium flex items-center justify-start gap-1">
                {user?.isViewerUnlockedByUser &&
                user?.realName &&
                user.nickname ? (
                  <>
                    <span>{user.realName}</span>
                    <span className="text-ui-shade/60"> ({user.nickname})</span>
                  </>
                ) : (
                  <span>{user.nickname ? user.nickname : user?.username}</span>
                )}{" "}
                {user?.isVerified ? (
                  <Icon name="MdVerified" className="text-ui-highlight" />
                ) : (
                  <Icon name="MdOutlineVerified" className="text-ui-shade/10" />
                )}
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
                  <p>{distanceDisplay(user?.distance || 0)}</p>
                </div>
              </div>
            </div>
          </div>
          {user?.bio ? <p className="text-lg my-2">{user?.bio}</p> : null}
          <div className="my-3">
            {userId === user?._id ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href="/app/profile/edit">
                  <Button variant={"outline"} className="w-full items-center">
                    Edit Profile <Icon name="FaUserPen" />
                  </Button>
                </Link>
                <Link href="/app/edit-preferences">
                  <Button variant={"outline"} className="w-full items-center">
                    Edit Preferences <Icon name="RiSettings3Line" />
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        {userId === user?._id ? (
          <div className="border border-ui-shade/10 rounded-xl p-4 bg-white shadow-sm mb-3">
            <p className="text-sm text-ui-shade/70">Profile health</p>
            <p className="text-xs text-ui-shade/60 mt-1">
              Stronger profiles get more matches.
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-ui-shade">
                <span>Profile completion</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-ui-shade/10">
                <div
                  className="h-2 rounded-full bg-ui-highlight"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-ui-shade">
                <span>Preference completion</span>
                <span>{preferenceCompletion}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-ui-shade/10">
                <div
                  className="h-2 rounded-full bg-ui-shade"
                  style={{ width: `${preferenceCompletion}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-ui-background/10 border border-ui-shade/10 rounded-xl px-4 pb-0 shadow-sm">
          <div className="w-full py-2 border-b border-ui-shade/10">
            <div className="flex items-center justify-start gap-2 w-full flex-wrap">
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
                {user?.work}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.institution ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">
                  <Icon
                    name="LuGraduationCap"
                    className="text-xl flex-shrink-0"
                  />
                </div>
                {user?.institution}
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
                  <Icon
                    name="HiOutlineHome"
                    className="text-xl flex-shrink-0"
                  />
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
                {languageDisplay(user.languages)?.join(", ")}
              </div>
              <Separator />
            </>
          ) : null}
          {user?.personalityType ? (
            <>
              <div className="flex items-center justify-start gap-2 py-2">
                <div className="h-6 w-6 flex items-center justify-center  flex-shrink-0 aspect-square">
                  <Icon
                    name="LuVenetianMask"
                    className="text-xl flex-shrink-0"
                  />
                </div>
                {user?.personalityType}
              </div>
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {posts?.length &&
            posts?.map((post: any) => (
              <PostCard
                key={post._id}
                post={post}
                isOwner={isOwner}
                isDeleting={deletingId === post._id}
                onDelete={handleDeletePost}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

const InfoItem = ({
  icon,
  value,
}: {
  icon: string;
  value: string | number;
}) => (
  <div className="px-6 py-2 rounded-full bg-ui-highlight/5 border border-ui-shade/5 flex items-center justify-center gap-1 flex-shrink-0">
    <div className="flex items-center justify-center flex-shrink-0 aspect-square">
      <Icon name={icon} className="text-xl flex-shrink-0" />
    </div>
    <p className="w-full flex-shrink-0 text-sm">{value}</p>
  </div>
);

const PostCard = ({
  post,
  isOwner,
  isDeleting,
  onDelete,
}: {
  post: any;
  isOwner: boolean;
  isDeleting: boolean;
  onDelete: (post: any) => void;
}) => {
  return (
    <div className="relative min-h-[200px] flex flex-col items-center justify-center bg-ui-highlight/5 border border-ui-highlight/10 rounded-xl pb-0 shadow-sm overflow-hidden">
      {isOwner ? (
        <div className="absolute top-2 right-2 z-10">
          <Menubar className="border-0 bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 rounded-md hover:bg-ui-highlight/10">
                <Icon name="HiMiniEllipsisVertical" className="text-xl" />
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem
                  className="!text-red-500 focus:text-red-500"
                  onClick={() => onDelete(post)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      ) : null}
      {post?.type === "PROMPT" ? <PromptPost post={post} /> : null}
      {post?.type === "IMAGE" ? <ImagePost post={post} /> : null}
      {post?.type === "TEXT" ? <TextPost post={post} /> : null}
    </div>
  );
};

const PromptPost = ({ post }: { post: any }) => {
  return (
    <div className="p-3">
      <h3 className="">{post?.content?.promptId?.text || ""}</h3>
      <p
        className={`text-ui-shade font-semibold text-lg mt-2 ${post?.visibility?.toUpperCase() !== "PUBLIC" ? "blur-sm" : ""}`}
      >
        {post?.content?.promptAnswer || ""}
      </p>
      <Image
        height="64"
        width="64"
        src={"/assets/quote.svg"}
        alt="quote"
        className="absolute top-2 right-2 h-16 w-16 opacity-10"
      />
    </div>
  );
};

const ImagePost = ({ post }: { post: any }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        {post?.content?.imageUrls ? (
          <picture>
            <img
              src={post.content.imageUrls}
              alt={post?.content?.caption || "Post image"}
              className={`w-full object-cover ${post?.visibility?.toUpperCase() !== "PUBLIC" ? "blur-2xl" : ""}`}
            />
          </picture>
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-ui-shade/60">
            Image unavailable
          </div>
        )}
      </div>
      {post?.content?.caption ? (
        <div className="p-3">
          <p className="text-ui-shade">{post.content.caption}</p>
        </div>
      ) : null}
    </div>
  );
};

const TextPost = ({ post }: { post: any }) => {
  return (
    <div className="p-4">
      <p className="text-ui-shade whitespace-pre-wrap">
        {post?.content?.text || ""}
      </p>
      <Image
        height="64"
        width="64"
        src={"/assets/quote.svg"}
        alt="quote"
        className="absolute top-2 right-2 h-16 w-16 opacity-10"
      />
    </div>
  );
};
