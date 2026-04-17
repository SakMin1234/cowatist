import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import { getCommission } from "@/lib/data";
import { Smartphone, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/commission/$commissionId/payment")({
  head: () => ({
    meta: [
      { title: "Payment — COWATIST" },
      { name: "description", content: "Complete your commission payment" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { commissionId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const commission = getCommission(commissionId);
  const [method, setMethod] = useState<"mobile" | "card" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!commission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Commission not found.</p>
      </div>
    );
  }

  const handlePay = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const stash = sessionStorage.getItem(`pending-commission-${commissionId}`);
      const details = stash ? JSON.parse(stash) : { name: user.email, email: user.email, description: "", referenceUrl: null, commercial: false };

      const { error: insErr } = await supabase.from("orders").insert({
        user_id: user.id,
        commission_id: commission.id,
        artist_id: commission.artistId,
        commission_title: commission.title,
        commission_image: commission.image,
        price: commission.price,
        customer_name: details.name || user.email || "",
        customer_email: details.email || user.email || "",
        description: details.description || "",
        reference_image_url: details.referenceUrl ?? null,
        is_commercial: !!details.commercial,
        status: "in_progress",
      });
      if (insErr) throw insErr;

      sessionStorage.removeItem(`pending-commission-${commissionId}`);
      navigate({ to: "/commission/$commissionId/success", params: { commissionId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <span className="page-label">Payment</span>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <button
                onClick={() => setMethod("mobile")}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                  method === "mobile" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <Smartphone className="h-10 w-10 text-muted-foreground" />
                <span className="text-base font-medium">Mobile Banking</span>
              </button>

              <button
                onClick={() => setMethod("card")}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                  method === "card" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <CreditCard className="h-10 w-10 text-muted-foreground" />
                <span className="text-base font-medium">Credit card / Debit card</span>
              </button>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handlePay}
                disabled={!method || busy}
                className="rounded-full bg-header px-10 py-3 text-sm font-bold text-header-foreground transition-opacity disabled:opacity-40"
              >
                {busy ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>

          <div className="w-full rounded-xl border border-border bg-card p-4 lg:w-64">
            <div className="flex items-center gap-3">
              <img src={commission.image} alt={commission.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-display font-semibold">{commission.title}</p>
                <p className="text-sm text-muted-foreground">Est. Price: {commission.price} Baht</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
