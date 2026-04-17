import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import Header from "@/components/Header";
import { getCommission, getArtist } from "@/lib/data";
import { Upload, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { detectProhibitedContent } from "@/lib/moderation";

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
  const { user } = useAuth();
  const commission = getCommission(commissionId);
  const artist = commission ? getArtist(commission.artistId) : null;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    commercial: false,
  });
  const [refFile, setRefFile] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!commission || !artist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="p-20 text-center text-muted-foreground">Commission not found.</p>
      </div>
    );
  }

  const onPickFile = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setRefFile(file);
    setRefPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      navigate({ to: "/auth" });
      return;
    }

    // Content moderation
    const blocked = detectProhibitedContent(`${form.description} ${form.name}`);
    if (blocked.length > 0) {
      setError(`Your description contains prohibited content: ${blocked.join(", ")}`);
      return;
    }

    // Artist's own restriction list
    if (commission.restrictions && commission.restrictions.length > 0) {
      const lower = form.description.toLowerCase();
      const hit = commission.restrictions.find((r) => lower.includes(r.toLowerCase()));
      if (hit) {
        setError(`This artist does not accept requests with: ${hit}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      let referenceUrl: string | null = null;
      if (refFile) {
        const ext = refFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${commissionId}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("commission-references")
          .upload(path, refFile);
        if (upErr) throw upErr;
        referenceUrl = supabase.storage.from("commission-references").getPublicUrl(path).data.publicUrl;
      }

      // Stash request in sessionStorage to carry to payment step
      sessionStorage.setItem(
        `pending-commission-${commissionId}`,
        JSON.stringify({
          ...form,
          referenceUrl,
        }),
      );

      navigate({
        to: "/commission/$commissionId/payment",
        params: { commissionId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <span className="page-label">Request details</span>

        {!user && (
          <div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm">
            You'll need to{" "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              sign in
            </Link>{" "}
            to submit a commission.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="w-full rounded-xl border border-border bg-card p-4 lg:w-60">
            <div className="flex items-center gap-3">
              <img src={commission.image} alt={commission.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-display font-semibold">{commission.title}</p>
                <p className="text-sm text-muted-foreground">Est. Price: {commission.price} Baht</p>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-card p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="Name/Nickname"
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  maxLength={120}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
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
                maxLength={1000}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <p className="text-right text-xs text-muted-foreground">{form.description.length}/1000</p>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm text-muted-foreground">Extra Details</legend>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex-1 rounded-xl border-2 border-dashed border-border p-6 text-center">
                  {refPreview ? (
                    <div className="relative">
                      <img src={refPreview} alt="reference" className="mx-auto max-h-32 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setRefFile(null);
                          setRefPreview(null);
                        }}
                        className="absolute right-0 top-0 rounded-full bg-foreground p-1 text-background"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">Add a reference image (optional)</p>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="mt-2 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background"
                      >
                        Choose Image
                      </button>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />
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

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

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
                disabled={submitting || !user}
                className="inline-flex items-center justify-center rounded-full border-2 border-foreground bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Continue to payment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
