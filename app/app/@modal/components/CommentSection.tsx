"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import InfiniteScroll from "react-infinite-scroll-component";

type CommentRow = {
  id: string;
  comment: string;
  date: string;
};

// type PostProps = {
//   supabase: SupabaseClient;
//   post_id: string;
// };

type PostProps = {
  post_id: string;
};

// How many comments to fetch per scroll page.
const PAGE_SIZE = 8;

// export default function CommentSection({ supabase, post_id }: PostProps) {
export default function CommentSection({post_id}: PostProps) {
  // The current comments loaded so far.
  const [comments, setComments] = useState<CommentRow[]>([]);
  // Which page number we are currently on.
  const [page, setPage] = useState(0);
  // Whether there is more data to fetch.
  const [hasMore, setHasMore] = useState(true);
  // Loading the first page.
  const [loading, setLoading] = useState(true);
  // Loading a later page after the first one.
  const [loadingMore, setLoadingMore] = useState(false);
  // Any error message from Supabase.
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() =>createBrowserSupabaseClient(),[]);

  const fetchComments = useCallback(
    async (nextPage: number) => {
      if (!supabase || !post_id) return;

      // Reset any previous error before fetching.
      setError(null);
      if (nextPage === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Calculate the row range for the Supabase paginated query.
      const from = nextPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError } = await supabase
        .from("comments")
        .select("id, comment, date")
        .eq("post_id", post_id)
        .order("date", { ascending: true })
        .range(from, to);

      if (fetchError) {
        setError(fetchError.message);
      }

      if (data) {
        // Merge new batch with existing comments and remove duplicates by id.
        // This prevents duplicate keys when the same comment appears in multiple pages
        // (e.g. due to ordering changes or concurrent updates).
        setComments((prev) => {
          const combined = nextPage === 0 ? data : [...prev, ...data];
          const seen = new Set<string>();
          const deduped: CommentRow[] = [];
          for (const c of combined) {
            if (!seen.has(c.id)) {
              seen.add(c.id);
              deduped.push(c);
            }
          }
          return deduped;
        });
        // If we got a full page, there might still be more.
        setHasMore(data.length === PAGE_SIZE);
        setPage(nextPage + 1);
      }

      setLoading(false);
      setLoadingMore(false);
    },
    [post_id, supabase]
    // []
  );

  useEffect(() => {
    // Reset state whenever post_id or supabase changes,
    // then fetch the first page of comments.
    setComments([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchComments(0);
  }, [fetchComments]);
//   }, []);

  const loadMoreComments = async () => {
    if (!hasMore || loadingMore) return;
    await fetchComments(page);
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-400">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-400">
        Error loading comments: {error}
      </div>
    );
  }

  return (
    <div id="comment-scrollable" className="h-full overflow-y-auto pr-1">
      <InfiniteScroll
        dataLength={comments.length}
        next={loadMoreComments}
        hasMore={hasMore}
        loader={
          <div className="py-4 text-center text-sm text-slate-400">
            Loading more comments...
          </div>
        }
        endMessage={
          <p className="py-4 text-center text-sm text-slate-500">
            No more comments.
          </p>
        }
        // Use the wrapper div as the scrollable container.
        scrollableTarget="comment-scrollable"
        style={{ overflow: "hidden" }}
      >
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {new Date(comment.date).toLocaleString()}
              </div>
              <p className="mt-2 text-base text-slate-100">{comment.comment}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
