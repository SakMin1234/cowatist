import { Star } from "lucide-react";

interface Props {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, maxStars = 5, interactive = false, onChange, size = 20 }: Props) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${i + 1} star`}
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-star text-star"
                  : partial
                    ? "fill-star/50 text-star"
                    : "fill-none text-muted-foreground/40"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
