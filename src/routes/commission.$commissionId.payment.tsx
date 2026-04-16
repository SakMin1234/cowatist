import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import { getCommission } from "@/lib/data";
import { Smartphone, CreditCard } from "lucide-react";

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
  const commission = getCommission(commissionId);
  const [method, setMethod] = useState<"mobile" | "card" | null>(null);

  if (!commission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Commission not found.</p>
      </div>
    );
  }

  const handlePay = () => {
    navigate({
      to: "/commission/$commissionId/success",
      params: { commissionId },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <span className="page-label">Payment</span>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Payment methods */}
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
                <span className="text-base font-medium">Credit card/ Debit card</span>
              </button>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handlePay}
                disabled={!method}
                className="rounded-full bg-header px-10 py-3 text-sm font-bold text-header-foreground transition-opacity disabled:opacity-40"
              >
                Pay
              </button>
            </div>
          </div>

          {/* Order summary */}
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
