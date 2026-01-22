"use client";

import { useRouter } from "next/navigation";
import React from "react";
import PostTypeCard from "../components/create-post/PostTypeCard";
import GeneralLayout from "../components/layout/general";

const CreatePost = () => {
  const router = useRouter();

  return (
    <GeneralLayout>
      <div className="h-full pt-3">
        <div className="flex flex-col items-center justify-center px-3 gap-3">
          {/* PROMPTS */}
          <PostTypeCard
            title="Prompts"
            description="Answer simple prompts that describe you well."
            className="border-ui-highlight bg-ui-highlight/5 text-ui-highlight"
            onClick={() => router.push("/app/create-post/prompts")}
          />

          {/* IMAGE */}
          <PostTypeCard
            title="Image"
            description="Drop your coolest images here."
            className="border-ui-accent bg-ui-accent/5 text-ui-accent"
            onClick={() => router.push("/app/create-post/image")}
          />

          {/* FREE TEXT */}
          <PostTypeCard
            title="Free Text"
            description="You're free to express yourself."
            className="border-cyan-700 bg-cyan-700/5 text-cyan-700"
            onClick={() => router.push("/app/create-post/text")}
          />
        </div>
      </div>
    </GeneralLayout>
  );
};

export default CreatePost;
