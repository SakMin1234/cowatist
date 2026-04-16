import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import { getCommission, getArtist } from "@/lib/data";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/commission/$commissionId/request")({
  head: () => ({
    meta: [
      { title: "Request Details — COWATIST" },
      { name: "description", content: "Submit your commission request details" },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  const { commissionId } = Route.useParams();
  const navigate = useNavigate();
  const commission = getCommission(commissionId);
  const artist = commission ? getArtist(commission.artistId) : null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    commercial: false,
  });

  if (!commission || !artist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Commission not found.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/commission/$commissionId/payment",
      params: { commissionId },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <span className="page-label">Request details</span>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full rounded-xl border border-border bg-card p-4 lg:w-60">
            <div className="flex items-center gap-3">
              <img src={commission.image} alt={commission.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-display font-semibold">{commission.title}</p>
                <p className="text-sm text-muted-foreground">Est. Price: {commission.price} Baht</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 rounded-xl border border-border bg-card p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="Name/Nickname"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-xs text-destructive">Required</p>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-xs text-destructive">Required</p>
              </div>
            </div>

            {commission.restrictions && commission.restrictions.length > 0 && (
              <div className="mt-4 rounded-xl bg-muted px-4 py-3">
                <p className="text-sm font-semibold">Artist will not accept request with:</p>
                <p className="text-sm text-muted-foreground">{commission.restrictions.join(", ")}</p>
              </div>
            )}

            <div className="mt-4">
              <textarea
                placeholder="Describe your commission"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-destructive">Required</p>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm text-muted-foreground">Extra Details</legend>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex-1 rounded-xl border-2 border-dashed border-border p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Drag and drop your reference image here</p>
                  <button type="button" className="mt-2 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background">
                    Add Image
                  </button>
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.commercial}
                    onChange={(e) => setForm({ ...form, commercial: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-border"
                  />
                  <span className="text-muted-foreground">Is this commission for commercial use?</span>
                </label>
              </div>
            </fieldset>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Link
                to="/artist/$artistId"
                params={{ artistId: commission.artistId }}
                className="inline-flex items-center justify-center rounded-full bg-muted px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border-2 border-foreground bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
