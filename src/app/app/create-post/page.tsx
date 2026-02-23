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
            description="Answer fun prompts to show your personality."
            className="border-ui-highlight bg-ui-highlight/5 text-ui-highlight"
            onClick={() => router.push("/app/create-post/prompts")}
          />

          {/* IMAGE */}
          <PostTypeCard
            title="Image"
            description="Share photos that express your vibe."
            className="border-ui-accent bg-ui-accent/5 text-ui-accent"
            onClick={() => router.push("/app/create-post/image")}
          />

          {/* FREE TEXT */}
          <PostTypeCard
            title="Free Text"
            description="Write anything you want people to know about you."
            className="border-cyan-700 bg-cyan-700/5 text-cyan-700"
            onClick={() => router.push("/app/create-post/free-text")}
          />
        </div>
      </div>
    </GeneralLayout>
  );
};

export default CreatePost;

