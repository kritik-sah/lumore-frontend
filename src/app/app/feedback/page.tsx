"use client";

import { fetchReceivedFeedbacks } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import NavLayout from "../components/layout/NavLayout";

const FeedbackPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedbacks,
  });

  return (
    <NavLayout>
      <div className="h-full w-full max-w-md mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Received Feedback</h1>
          <p className="text-sm text-ui-shade/70">
            Feedback shared by users after chat.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl border border-ui-shade/10 bg-ui-highlight/5 animate-pulse"
              />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="text-sm text-red-500">
            Could not load feedback right now.
          </p>
        ) : null}

        {!isLoading && !isError && (!data || data.length === 0) ? (
          <p className="text-sm text-ui-shade/70">No feedback received yet.</p>
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <ul className="space-y-3">
            {data.map((item) => (
              <li
                key={item._id}
                className="rounded-xl border border-ui-shade/15 p-3 bg-ui-light"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-medium">
                    {item.user?.nickname || item.user?.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-ui-shade/70">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {typeof item.rating === "number" ? (
                  <p className="text-xs text-ui-shade/80 mb-2">
                    Rating: {item.rating}/10
                  </p>
                ) : null}

                <p className="text-sm whitespace-pre-wrap break-words">
                  {item.feedback || "No feedback text provided."}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </NavLayout>
  );
};

export default FeedbackPage;
