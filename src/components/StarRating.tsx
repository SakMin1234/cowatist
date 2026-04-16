import { Star } from "lucide-react";
import { useState } from "react";

interface Props {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onChange,
  size = 20,
}: Props) {
  const [hover, setHover] = useState(0);
  const display = interactive && hover > 0 ? hover : rating;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => interactive && setHover(0)}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.floor(display);
        const partial = !filled && value - 1 < display && display < value;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(value)}
            onMouseEnter={() => interactive && setHover(value)}
            className={`transition-transform ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
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
