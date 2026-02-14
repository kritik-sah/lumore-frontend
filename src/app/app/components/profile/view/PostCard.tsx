"use client";

import Icon from "@/components/icon";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";

interface PostCardProps {
  post: any;
  isOwner: boolean;
  isDeleting: boolean;
  onDelete: (post: any) => void;
}

const PostCard = ({ post, isOwner, isDeleting, onDelete }: PostCardProps) => {
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
      <h3>{post?.content?.promptId?.text || ""}</h3>
      <p
        className={`text-ui-shade font-semibold text-lg mt-2 ${post?.visibility?.toUpperCase() !== "PUBLIC" ? "blur-sm" : ""}`}
      >
        {post?.content?.promptAnswer || ""}
      </p>
      <Image
        height="64"
        width="64"
        src="/assets/quote.svg"
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
      <p className="text-ui-shade whitespace-pre-wrap">{post?.content?.text || ""}</p>
      <Image
        height="64"
        width="64"
        src="/assets/quote.svg"
        alt="quote"
        className="absolute top-2 right-2 h-16 w-16 opacity-10"
      />
    </div>
  );
};

export default PostCard;
