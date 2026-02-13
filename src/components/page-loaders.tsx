import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`rounded-xl border border-ui-shade/10 bg-white p-4 ${className}`}
  >
    <Skeleton className="h-4 w-28" />
    <Skeleton className="mt-3 h-10 w-full" />
  </div>
);

export const AppRouteLoader = () => (
  <div className="min-h-svh bg-ui-background/10 p-4">
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton className="h-28" />
      <CardSkeleton className="h-28" />
    </div>
  </div>
);

export const ProfilePageLoader = () => (
  <div className="bg-ui-background/10 p-4 h-full overflow-y-auto">
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton className="h-24" />
    </div>
  </div>
);

export const SettingsPageLoader = () => (
  <div className="bg-ui-background/10 p-4">
    <div className="mx-auto w-full max-w-3xl space-y-3">
      <Skeleton className="h-7 w-40" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <Skeleton className="mt-4 h-11 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  </div>
);

export const ChatInboxLoader = () => (
  <div className="h-full w-full max-w-md mx-auto p-4">
    <Skeleton className="mb-4 h-8 w-32" />
    <Skeleton className="mb-4 h-10 w-full rounded-xl" />
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`chat-row-${index}`}
          className="flex items-center gap-3 border-b border-ui-shade/10 pb-3"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  </div>
);

export const ChatRoomLoader = () => (
  <div className="flex h-full flex-col p-3">
    <div className="flex items-center gap-3 border-b border-ui-shade/10 pb-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <div className="flex-1 space-y-3 py-4">
      <Skeleton className="h-12 w-2/3 rounded-xl" />
      <Skeleton className="ml-auto h-12 w-1/2 rounded-xl" />
      <Skeleton className="h-12 w-3/4 rounded-xl" />
      <Skeleton className="ml-auto h-12 w-2/5 rounded-xl" />
    </div>
    <div className="border-t border-ui-shade/10 pt-3">
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="min-h-svh p-4 md:p-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-48 w-full rounded-3xl" />
    </div>
  </div>
);

export const BlogListLoader = () => (
  <div className="container mx-auto min-h-svh px-4 py-6 lg:py-10">
    <div className="mx-auto max-w-[1170px] space-y-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-full max-w-2xl" />
      <Skeleton className="h-80 w-full rounded-3xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={`blog-card-${index}`}
            className="h-72 w-full rounded-2xl"
          />
        ))}
      </div>
    </div>
  </div>
);

export const BlogPostLoader = () => (
  <div className="container mx-auto min-h-svh max-w-4xl px-4 py-8 md:py-12 space-y-6">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-10 w-4/5" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-[360px] w-full rounded-2xl" />
    <div className="space-y-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  </div>
);
