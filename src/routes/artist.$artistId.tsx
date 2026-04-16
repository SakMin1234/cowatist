import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { getArtist, getArtistCommissions } from "@/lib/data";

export const Route = createFileRoute("/artist/$artistId")({
  head: ({ params }) => {
    const artist = getArtist(params.artistId);
    return {
      meta: [
        { title: artist ? `${artist.name} — COWATIST` : "Artist — COWATIST" },
        { name: "description", content: artist?.bio ?? "View artist profile and commissions" },
        { property: "og:title", content: artist ? `${artist.name} — COWATIST` : "Artist — COWATIST" },
      ],
    };
  },
  component: ArtistPage,
});

function ArtistPage() {
  const { artistId } = Route.useParams();
  const artist = getArtist(artistId);
  const artistCommissions = getArtistCommissions(artistId);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center p-20">
          <p className="text-muted-foreground">Artist not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Artist profile */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="commission-card commission-card-blue overflow-visible p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative -mt-14 sm:-mt-10">
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-card-blue bg-card">
                <img src={artist.avatar} alt={artist.name} className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <h2 className="font-display text-2xl font-bold">{artist.name}</h2>
                <div className="flex items-center gap-1">
                  <StarRating rating={artist.rating} size={18} />
                  <span className="text-sm font-medium text-muted-foreground">{artist.rating}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {artist.age}↑ {artist.bio}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{artist.bioJp}</p>
            </div>
          </div>
        </div>

        {/* Commissions */}
        <div className="mt-8 space-y-6">
          {artistCommissions.map((c) => (
            <div key={c.id} className="commission-card commission-card-blue overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="aspect-square w-full overflow-hidden sm:w-64">
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-xl font-bold">{c.title}</h3>
                      <span className="price-badge price-badge-blue">{c.price} Baht</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.slots && <span className="tag-badge tag-green">{c.slots} slots available</span>}
                      {c.deliveryDays && <span className="tag-badge tag-blue">{c.deliveryDays} Days</span>}
                    </div>
                    {c.additionalInfo && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Additional Information</p>
                        <p className="text-sm text-muted-foreground">{c.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/commission/$commissionId/request"
                      params={{ commissionId: c.id }}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Create commission!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
