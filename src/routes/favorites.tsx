import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import { commissions, getArtist } from "@/lib/data";
import { Star } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Commissions — COWATIST" },
      { name: "description", content: "Review your completed commissions" },
      { property: "og:title", content: "Your Commissions — COWATIST" },
      { property: "og:description", content: "Leave a review for the artists you've worked with." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <span className="page-label">Your Commissions</span>
        <p className="mt-3 text-sm text-muted-foreground">
          Pick a commission below to leave a review for the artist.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commissions.map((c) => {
            const artist = getArtist(c.artistId);
            return (
              <Link
                key={c.id}
                to="/commission/$commissionId/review"
                params={{ commissionId: c.id }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    by {artist?.name ?? "Unknown"}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                    <Star className="h-3 w-3" /> Leave a review
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
