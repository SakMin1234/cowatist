import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Commissions — COWATIST" },
      { name: "description", content: "Review your completed commissions" },
    ],
  }),
  component: FavoritesPage,
});

interface OrderRow {
  id: string;
  commission_title: string;
  commission_image: string | null;
  artist_id: string;
  status: string;
}

interface ReviewRow {
  order_id: string;
  rating: number;
}

function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reviews, setReviews] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ordersData }, { data: reviewsData }] = await Promise.all([
        supabase.from("orders").select("id, commission_title, commission_image, artist_id, status").eq("user_id", user.id).order("paid_at", { ascending: false }),
        supabase.from("reviews").select("order_id, rating").eq("user_id", user.id),
      ]);
      if (ordersData) setOrders(ordersData as OrderRow[]);
      if (reviewsData) {
        const map = new Map<string, number>();
        (reviewsData as ReviewRow[]).forEach((r) => map.set(r.order_id, r.rating));
        setReviews(map);
      }
    })();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <span className="page-label">Your Commissions</span>
        <p className="mt-3 text-sm text-muted-foreground">
          Pick a completed commission below to leave a review for the artist.
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">No commissions yet.</p>
            <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Browse artists →
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const isCompleted = order.status === "completed";
              const userRating = reviews.get(order.id);
              const card = (
                <div className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary">
                  <img
                    src={order.commission_image ?? ""}
                    alt={order.commission_title}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold">{order.commission_title}</p>
                    {isCompleted ? (
                      userRating ? (
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <StarRating rating={userRating} size={12} /> Your rating
                        </div>
                      ) : (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                          <CheckCircle2 className="h-3 w-3" /> Leave a review
                        </span>
                      )
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> In progress
                      </span>
                    )}
                  </div>
                </div>
              );
              return isCompleted && !userRating ? (
                <Link key={order.id} to="/order/$orderId/review" params={{ orderId: order.id }}>
                  {card}
                </Link>
              ) : (
                <div key={order.id}>{card}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
