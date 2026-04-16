import { Link } from "@tanstack/react-router";
import type { Commission } from "@/lib/data";
import { getArtist } from "@/lib/data";

interface Props {
  commission: Commission;
}

const borderMap = {
  blue: "commission-card-blue",
  purple: "commission-card-purple",
  orange: "commission-card-orange",
  gray: "commission-card-gray",
};

const priceMap = {
  blue: "price-badge-blue",
  orange: "price-badge-orange",
};

export default function CommissionCard({ commission }: Props) {
  const artist = getArtist(commission.artistId);
  if (!artist) return null;

  return (
    <Link
      to="/artist/$artistId"
      params={{ artistId: commission.artistId }}
      className={`commission-card ${borderMap[commission.borderColor]} block`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={commission.image}
          alt={commission.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-display text-base font-semibold">{commission.title}</h3>
        <div className="mt-1.5 flex items-center justify-end">
          <span className={`price-badge ${priceMap[commission.priceColor]}`}>
            {commission.priceLabel}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <div className="artist-pill">
            <img
              src={artist.avatar}
              alt={artist.name}
              loading="lazy"
              className="h-6 w-6 rounded-full object-cover"
            />
            <span>Commission {artist.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
