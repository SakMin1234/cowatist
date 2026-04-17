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
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-14 w-14 text-success" />
        </div>
        <p className="mt-6 text-center text-lg text-foreground">
          Your commission has been requested successfully.
        </p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Track its status from your profile.
        </p>

        <div className="mt-10 flex gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-full bg-header px-8 py-2.5 text-sm font-bold text-header-foreground"
          >
            Go to profile
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-2.5 text-sm font-semibold text-foreground"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
