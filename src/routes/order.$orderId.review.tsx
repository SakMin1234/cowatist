import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order/$orderId/review")({
  head: () => ({
    meta: [
      { title: "Review — COWATIST" },
      { name: "description", content: "Rate and review your completed commission" },
    ],
  }),
  component: OrderReviewPage,
});

interface OrderRow {
  id: string;
  user_id: string;
  commission_id: string;
  artist_id: string;
  commission_title: string;
  commission_image: string | null;
  price: number;
  status: string;
}

function OrderReviewPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, user_id, commission_id, artist_id, commission_title, commission_image, price, status")
        .eq("id", orderId)
        .maybeSingle();
      setOrder(data as OrderRow | null);
      setLoading(false);
    })();
  }, [user, orderId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  if (order.status !== "completed") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="text-lg font-semibold">This commission isn't completed yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            You can leave a review once the artist marks it as delivered.
          </p>
          <Link to="/profile" className="mt-6 inline-block rounded-full bg-header px-6 py-2 text-sm font-bold text-header-foreground">
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!user || rating < 1) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: insErr } = await supabase.from("reviews").insert({
        order_id: order.id,
        user_id: user.id,
        commission_id: order.commission_id,
        artist_id: order.artist_id,
        rating,
        comment: comment.trim() || null,
      });
      if (insErr) throw insErr;
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-semibold">Thanks for your review!</p>
          <p className="mt-1 text-sm text-muted-foreground">You rated this commission</p>
          <div className="mt-2"><StarRating rating={rating} size={28} /></div>
          <Link to="/profile" className="mt-6 rounded-full bg-header px-6 py-2 text-sm font-bold text-header-foreground">
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <span className="page-label">Review</span>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="w-full rounded-xl border border-border bg-card p-4 lg:w-60">
            <div className="flex items-center gap-3">
              <img
                src={order.commission_image ?? ""}
                alt={order.commission_title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-display font-semibold">{order.commission_title}</p>
                <p className="text-sm text-muted-foreground">Price: {order.price} Baht</p>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">Rating:</span>
              <StarRating rating={rating} interactive onChange={setRating} size={28} />
              <span className="ml-1 text-sm text-muted-foreground">{rating}/5</span>
            </div>

            <textarea
              placeholder="Type your comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={8}
              maxLength={1000}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-full bg-muted px-6 py-2.5 text-sm font-semibold text-muted-foreground"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className="inline-flex items-center justify-center rounded-full border-2 border-foreground bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
