"use client";

import { Button } from "@/components/ui/button";
import { createTextPost, getPostById, updatePost } from "@/lib/apis";
import { getUser } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TextAreaField } from "../../components/InputField";
import GeneralLayout from "../../components/layout/general";
import VisibilityToggle from "../../components/VisibilityToggle";

const CreateFreeTextPostPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const isEditing = Boolean(postId);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;
    let isMounted = true;

    const loadPost = async () => {
      setIsLoading(true);
      try {
        const post = await getPostById(postId);
        if (!isMounted) return;
        if (post?.type !== "TEXT") {
          setError("This post cannot be edited here.");
          return;
        }
        setText(post?.content?.text || "");
        setVisibility(post?.visibility || "public");
      } catch (err) {
        if (isMounted) setError("Unable to load post.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please write something before posting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && postId) {
        await updatePost(postId, {
          content: { text },
          visibility,
        });
        const currentUser = getUser();
        if (currentUser?._id) {
          await queryClient.invalidateQueries({
            queryKey: ["user posts", currentUser._id],
          });
        }
        router.back();
      } else {
        await createTextPost({
          text,
          visibility,
        });
        const currentUser = getUser();
        if (currentUser?._id) {
          await queryClient.invalidateQueries({
            queryKey: ["user posts", currentUser._id],
          });
        }
        router.push("/app/create-post");
      }
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
                {isEditing ? "Edit Free Text" : "Free Text"}
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              className="min-w-[96px]"
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Posting...") : isEditing ? "Update" : "Post"}
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
