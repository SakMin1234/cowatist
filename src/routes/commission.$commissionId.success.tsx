import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/commission/$commissionId/success")({
  head: () => ({
    meta: [
      { title: "Commission Requested — COWATIST" },
      { name: "description", content: "Your commission has been requested successfully" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <CheckCircle className="h-14 w-14 text-muted-foreground" />
        </div>
        <p className="mt-6 text-center text-lg text-muted-foreground">
          Your commission had been request successfully.
        </p>
        <p className="mt-1 text-center text-lg text-muted-foreground">+ 5 points</p>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-header px-8 py-2.5 text-sm font-bold text-header-foreground"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
