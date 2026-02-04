"use client";

import { Button } from "@/components/ui/button";
import { createTextPost } from "@/lib/apis";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TextAreaField } from "../../components/InputField";
import GeneralLayout from "../../components/layout/general";
import VisibilityToggle from "../../components/VisibilityToggle";

const CreateFreeTextPostPage = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please write something before posting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await createTextPost({
        text,
        visibility,
      });
      router.push("/app/create-post");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Post failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GeneralLayout>
      <div className="p-3 h-full overflow-y-auto">
        <div className="max-w-xl mx-auto flex flex-col gap-4 pb-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ui-shade/70">Create a new post</p>
              <h1 className="text-xl font-semibold text-ui-shade">
                Free Text
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[96px]"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>

          <TextAreaField
            label="Your words"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your shayari or quote here..."
            rows={8}
            className="bg-ui-highlight/5 border-ui-highlight/30"
          />

          <div className="border border-ui-shade/10 rounded-xl p-3">
            <p className="text-sm text-ui-shade/70">Visibility</p>
            <div className="mt-2">
              <VisibilityToggle
                field="textPost"
                currentVisibility={visibility}
                onVisibilityChange={(_, vis) => setVisibility(vis)}
                width="w-full"
              />
            </div>
          </div>

          {error ? <p className="text-red-500 text-sm">{error}</p> : null}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default CreateFreeTextPostPage;
