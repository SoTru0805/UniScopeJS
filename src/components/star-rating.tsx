"use client";

import { Star } from "./star";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

export function StarRating({ rating, setRating }: StarRatingProps) {
  const handleClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleMouseEnter = (hoverRating: number) => {
    // Optional: live preview hover, but we're not changing state here
  };

  const handleMouseLeave = () => {
    // Optional: reset hover effects if you want later
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFull = i <= Math.floor(rating);
    const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;

    stars.push(
      <span
        key={i}
        onClick={() => handleClick(isHalf ? i : isFull ? i - 0.5 : i)}
        className="cursor-pointer transform transition-transform hover:scale-110"
      >
        <Star
          type={isFull ? "full" : isHalf ? "half" : "empty"}
          size={28}
          color="gold"
        />
      </span>
    );
  }

  return (
    <div className="flex space-x-2 items-center justify-center">
      {stars}
    </div>
  );
}
