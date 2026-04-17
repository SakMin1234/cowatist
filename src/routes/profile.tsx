import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { LogOut, Camera, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — COWATIST" },
      { name: "description", content: "Manage your profile and view your commissions" },
    ],
  }),
  component: ProfilePage,
});

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

interface OrderRow {
  id: string;
  commission_id: string;
  artist_id: string;
  commission_title: string;
  commission_image: string | null;
  price: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  paid_at: string;
  completed_at: string | null;
  delivery_url: string | null;
}

interface ReviewRow {
  order_id: string;
  rating: number;
}

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reviewedOrderIds, setReviewedOrderIds] = useState<Set<string>>(new Set());
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ data: profileData }, { data: ordersData }, { data: reviewsData }] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("user_id", user.id).maybeSingle(),
        supabase.from("orders").select("id, commission_id, artist_id, commission_title, commission_image, price, status, paid_at, completed_at, delivery_url").eq("user_id", user.id).order("paid_at", { ascending: false }),
        supabase.from("reviews").select("order_id, rating").eq("user_id", user.id),
      ]);
      if (cancelled) return;
      if (profileData) {
        setProfile(profileData);
        setDisplayName(profileData.display_name ?? "");
      }
      if (ordersData) setOrders(ordersData as OrderRow[]);
      if (reviewsData) setReviewedOrderIds(new Set((reviewsData as ReviewRow[]).map((r) => r.order_id)));
    })();
    return () => { cancelled = true; };
  }, [user, refreshKey]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const saveProfile = async () => {
    setSavingProfile(true);
    await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("user_id", user.id);
    setSavingProfile(false);
    setRefreshKey((k) => k + 1);
  };

  const uploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("user_id", user.id);
      setRefreshKey((k) => k + 1);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Demo helper: artist marks a commission as completed
  const markComplete = async (orderId: string) => {
    await supabase
      .from("orders")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", orderId);
    setRefreshKey((k) => k + 1);
  };

  const initial = (profile?.display_name || user.email || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <span className="page-label">Your Profile</span>

        {/* Profile card */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-muted ring-2 ring-border">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-foreground">
                    {initial}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 rounded-full bg-foreground p-1.5 text-background shadow ring-2 ring-card transition hover:bg-foreground/80 disabled:opacity-50"
                aria-label="Upload avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadAvatar(f);
                }}
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Display name</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  onClick={saveProfile}
                  disabled={savingProfile || displayName === (profile?.display_name ?? "")}
                  className="rounded-full border-2 border-foreground bg-card px-4 py-1.5 text-xs font-bold text-foreground transition hover:bg-foreground hover:text-background disabled:opacity-40"
                >
                  Save
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Email: {user.email}</p>
            </div>

            <button
              onClick={() => signOut().then(() => navigate({ to: "/" }))}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted/70"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Orders */}
        <h2 className="mt-10 font-display text-xl font-bold">My Commissions</h2>
        <p className="text-sm text-muted-foreground">Track work in progress and review completed pieces.</p>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">You haven't commissioned anything yet.</p>
            <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Browse artists →
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => {
              const isCompleted = order.status === "completed";
              const hasReviewed = reviewedOrderIds.has(order.id);
              return (
                <div key={order.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={order.commission_image ?? ""}
                      alt={order.commission_title}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-display font-semibold">{order.commission_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid {new Date(order.paid_at).toLocaleDateString()} · {order.price} Baht
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            <span className="text-success">Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">In progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-2 sm:items-end">
                      {!isCompleted && (
                        <button
                          onClick={() => markComplete(order.id)}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                          title="Demo: simulate the artist delivering this work"
                        >
                          Mark as delivered (demo)
                        </button>
                      )}
                      {isCompleted && !hasReviewed && (
                        <Link
                          to="/order/$orderId/review"
                          params={{ orderId: order.id }}
                          className="rounded-full bg-header px-4 py-1.5 text-center text-xs font-bold text-header-foreground"
                        >
                          Leave a review
                        </Link>
                      )}
                      {isCompleted && hasReviewed && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                          <StarRating rating={5} size={12} /> Reviewed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
