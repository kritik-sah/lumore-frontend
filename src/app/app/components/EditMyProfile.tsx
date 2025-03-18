"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { ChangeEvent, useState } from "react";
import { useLogout } from "../hooks/useAuth";
import { SelectField, TextAreaField, TextField } from "./InputField";

const EditMyProfile = ({ user }: { user: any }) => {
  const { logout } = useLogout();
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState("");

  const handleEditField = (field: string) => {
    setEditFieldType(field);
    setIsEditFieldOpen(true);
  };
  return (
    <div className="bg-ui-background/10 p-4">
      <div className="w-full max-w-3xl mx-auto pb-10">
        <h3 className="text-xl font-medium">Edit Profile</h3>
        <FeildEditor
          isOpen={isEditFieldOpen}
          setIsOpen={setIsEditFieldOpen}
          fieldType={editFieldType}
        />
        <div className="flex items-center justify-start gap-3 mt-3">
          <div className="h-20 w-20 bg-ui-highlight rounded-full"></div>
          Change Profile Picture
        </div>
        <div
          onClick={() => handleEditField("username")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Username</h3>
          kritik_sah
        </div>
        <div
          onClick={() => handleEditField("visibleName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Visible Name</h3>
          Rebel
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Real Name</h3>
          Kritik Sah
        </div>
        <div
          onClick={() => handleEditField("bio")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Bio</h3>
          Learner
        </div>
        <div
          onClick={() => handleEditField("gender")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Gender</h3>
          Male
        </div>
        <div
          onClick={() => handleEditField("dob")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">DOB</h3>
          09/09/2000
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Sexual orientation</h3>
          Straight
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Height</h3>
          {`5'9`}
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Current Location</h3>
          Janakpuri East
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Diet</h3>
          Non Veg
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Zodiac Sign</h3>
          Virgo
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Alcohol</h3>
          Sometimes
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Smoking</h3>
          No
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Pets</h3>
          Dog
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Work</h3>
          Web3 at Startup
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">College/ University</h3>
          University of Mumbai
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Maritial Status</h3>
          Single
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Languages</h3>
          English, Hindi, Marathi, Punjabi, Japanese
        </div>
        <div
          onClick={() => handleEditField("hiddenName")}
          className="border border-ui-shade/10 rounded-xl p-2 mt-3"
        >
          <h3 className="text-sm text-ui-shade/60">Personality Type</h3>
          INTJ
        </div>
      </div>
    </div>
  );
};

export default EditMyProfile;

const genders = [
  { label: "Man", value: "man" },
  { label: "Woman", value: "woman" },
  { label: "Trans Man", value: "trans_man" },
  { label: "Trans Woman", value: "trans_woman" },
  { label: "Non-Binary", value: "non_binary" },
  { label: "Genderqueer", value: "genderqueer" },
  { label: "Genderfluid", value: "genderfluid" },
  { label: "Agender", value: "agender" },
  { label: "Bigender", value: "bigender" },
  { label: "Demiboy", value: "demiboy" },
  { label: "Demigirl", value: "demigirl" },
  { label: "Two-Spirit", value: "two_spirit" },
  { label: "Androgynous", value: "androgynous" },
  { label: "Neutrois", value: "neutrois" },
  { label: "Intersex", value: "intersex" },
  { label: "Third Gender", value: "third_gender" },
  { label: "Maverique", value: "maverique" },
  { label: "Polygender", value: "polygender" },
  { label: "Genderflux", value: "genderflux" },
  { label: "Xenogender", value: "xenogender" },
];

const FeildEditor = ({
  isOpen,
  setIsOpen,
  fieldType,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fieldType: string;
}) => {
  const [userData, setUserData] = useState<any>({});

  const handleValueChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    // perform change function
    console.log("e", e);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize">Edit {fieldType}</SheetTitle>
        </SheetHeader>

        {fieldType === "username" ? (
          <TextField
            label="Username"
            value={userData?.username}
            name={fieldType}
            onChange={handleValueChange}
            placeholder="Enter unique username"
          />
        ) : null}
        {fieldType === "visibleName" ? (
          <TextField
            label="Visible Name"
            value={userData?.visibleName}
            name={fieldType}
            onChange={handleValueChange}
            placeholder="Enter a Visible Name"
          />
        ) : null}
        {fieldType === "hiddenName" ? (
          <TextField
            label="Real Name"
            value={userData?.hiddenName}
            name={fieldType}
            onChange={handleValueChange}
            placeholder="Enter your real name"
          />
        ) : null}
        {fieldType === "bio" ? (
          <TextAreaField
            label="Bio"
            value={userData?.bio}
            name={fieldType}
            onChange={handleValueChange}
            placeholder="Enter your real name"
          />
        ) : null}
        {fieldType === "gender" ? (
          <SelectField
            label="Gender"
            options={genders}
            value={userData?.bio}
            name={fieldType}
            onChange={(e) => console.log(e)}
            placeholder="Select your gender"
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
