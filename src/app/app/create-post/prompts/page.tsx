"use client";

import Icon from "@/components/icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createPromptPost,
  fetchPromptCategories,
  fetchPromptsByCategories,
} from "@/lib/apis";
import { queryClient } from "@/service/query-client";
import { getUser } from "@/service/storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TextAreaField } from "../../components/InputField";
import GeneralLayout from "../../components/layout/general";
import VisibilityToggle from "../../components/VisibilityToggle";

const CATEGORIES = [
  {
    _id: "deep",
    count: 20,
  },
  {
    _id: "dislikes",
    count: 15,
  },
  {
    _id: "flirty",
    count: 20,
  },
  {
    _id: "fun",
    count: 20,
  },
  {
    _id: "pov",
    count: 20,
  },
  {
    _id: "quirky",
    count: 20,
  },
  {
    _id: "thoughtful",
    count: 20,
  },
  {
    _id: "values",
    count: 20,
  },
];

function PromptSelectPage() {
  const [active, setActive] = useState("fun");
  // Fetch categories from API fetchPromptCategories()
  const { data: categoriesData = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: () => fetchPromptCategories(),
  });

  return (
    <GeneralLayout>
      <div className="p-3 h-full overflow-y-scroll">
        {/* TABS */}
        <div className="w-full overflow-scroll flex gap-2 py-4">
          {(categoriesData || CATEGORIES).map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActive(cat._id)}
              className={`px-3 py-1 rounded-full capitalize transition
                ${
                  active === cat._id
                    ? "bg-ui-highlight text-white"
                    : "bg-ui-highlight/5 text-ui-hilight border border-ui-highlight/20"
                }`}
            >
              {cat._id}
            </button>
          ))}
        </div>

        {/* PROMPT LIST */}

        <PromptList key={active} category={active} />
      </div>
    </GeneralLayout>
  );
}

export default PromptSelectPage;

const PromptList = ({ category }: { category: string }) => {
  const router = useRouter();
  const { data: promptsData = [] } = useQuery<any[]>({
    queryKey: ["categories", category],
    queryFn: () => fetchPromptsByCategories([category]),
  });
  const [isEditPromptOpen, setIsEditPromptOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState<any>(null);

  const handlePromptEdit = (prompt: any) => {
    setEditPrompt(prompt);
    setIsEditPromptOpen(true);
  };

  const handlePromptSubmit = async (data: any) => {
    try {
      await createPromptPost(data);
      setIsEditPromptOpen(false);
      setEditPrompt(null);
      const currentUser = getUser();
      if (currentUser?._id) {
        await queryClient.invalidateQueries({
          queryKey: ["user posts", currentUser._id],
        });
      }
      router.push("/app/profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-2 my-3">
      {promptsData.map((prompt) => (
        <div
          key={prompt._id}
          onClick={() => handlePromptEdit(prompt)}
          className="bg-ui-highlight/5 border border-ui-highlight/30 p-3 rounded-lg"
        >
          {prompt.text}
        </div>
      ))}
      <PromptEditor
        key={editPrompt?._id}
        isOpen={isEditPromptOpen}
        setIsOpen={setIsEditPromptOpen}
        prompt={editPrompt}
        onUpdate={handlePromptSubmit}
        currentValue=""
        preferences={{}}
      />
    </div>
  );
};

const PromptEditor = ({
  isOpen,
  setIsOpen,
  prompt,
  onUpdate,
  currentValue,
  initialVisibility = "",
}: any) => {
  const getDefaultValue = (field: string) => {
    switch (field) {
      case "interests":
        return [];
      case "ageRange":
        return [18, 27];
      case "goal":
        return {
          primary: "",
          secondary: "",
          tertiary: "",
        };
      case "languages":
      case "zodiacPreference":
      case "personalityTypePreference":
      case "dietPreference":
        return [];
      default:
        return "";
    }
  };

  const [value, setValue] = useState(currentValue);
  const [visibility, setVisibility] = useState(initialVisibility);

  useEffect(() => {
    setValue(currentValue);
    setVisibility(initialVisibility);
  }, [currentValue, prompt?._id, initialVisibility]);

  const handleSubmit = async () => {
    try {
      await onUpdate({
        type: "PROMPT",
        content: {
          promptId: prompt._id,
          promptAnswer: value,
        },
        visibility,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleCancel = () => {
    setValue(currentValue || getDefaultValue(prompt?._id));
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="hidden">
          <SheetTitle>Prompt</SheetTitle>
        </SheetHeader>
        <header className="flex items-center justify-between p-3 gap-4 shadow-sm">
          <div className="flex items-center justify-start gap-2">
            <div onClick={handleCancel} className="">
              <Icon
                name="MdOutlineClose"
                className="text-xl h-6 w-6 text-ui-shade"
              />
            </div>
            <div className="capitalize text-lg font-semibold">
              Answer Prompt
            </div>
          </div>
          <div onClick={handleSubmit} className="">
            <Icon
              name="HiOutlineCheck"
              className="text-xl h-6 w-6 text-ui-highlight"
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="">
            <TextAreaField
              labelStyles="text-ui-highlight font-medium text-lg"
              className="bg-ui-highlight/5 border-ui-highlight/30 text-ui-shade text-base"
              label={prompt?.text}
              placeholder="Write your answer here..."
              name="promptAnswer"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
            />
            <div className="border border-ui-shade/10 rounded-lg p-3 mt-3">
              <p className="text-ui-shade/80 text-sm">Visiblity Options</p>
              <div className="mt-2 flex flex-col gap-2">
                <VisibilityToggle
                  field={prompt?._id}
                  currentVisibility={visibility}
                  onVisibilityChange={(_, vis) => setVisibility(vis)}
                  width="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
