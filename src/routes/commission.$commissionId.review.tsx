import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { getCommission } from "@/lib/data";

export const Route = createFileRoute("/commission/$commissionId/review")({
  head: () => ({
    meta: [
      { title: "Review — COWATIST" },
      { name: "description", content: "Rate and review your completed commission" },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { commissionId } = Route.useParams();
  const commission = getCommission(commissionId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!commission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Commission not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <p className="text-lg font-semibold">Thank you for your review!</p>
          <Link to="/" className="mt-4 rounded-full bg-header px-6 py-2 text-sm font-bold text-header-foreground">
            Back to Home
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
          {/* Commission info */}
          <div className="w-full rounded-xl border border-border bg-card p-4 lg:w-60">
            <div className="flex items-center gap-3">
              <img src={commission.image} alt={commission.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-display font-semibold">{commission.title}</p>
                <p className="text-sm text-muted-foreground">Est. Price: {commission.price} Baht</p>
              </div>
            </div>
          </div>

          {/* Review form */}
          <div className="flex-1 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">Rating:</span>
              <StarRating rating={rating} interactive onChange={setRating} size={28} />
            </div>

            <textarea
              placeholder="Type your Comment (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={8}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />

            <div className="mt-6 flex items-center justify-end gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-muted px-6 py-2.5 text-sm font-semibold text-muted-foreground"
              >
                Cancel
              </Link>
              <button
                onClick={() => setSubmitted(true)}
                disabled={rating === 0}
                className="inline-flex items-center justify-center rounded-full border-2 border-foreground bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
