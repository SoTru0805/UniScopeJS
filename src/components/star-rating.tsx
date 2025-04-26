"use client";

import { useState } from "react";
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
    if (hoverRating !== rating) {
        setRating(hoverRating);
    }
  };
  
  const handleMouseLeave = () => {
    
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFull = i <= Math.floor(rating);
    const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;

    stars.push(
      <span
        key={i}
        onClick={() => handleClick(isHalf ? i : isFull ? i - 0.5 : i)}
        onMouseEnter={() => handleMouseEnter(isHalf? i : isFull ? i - 0.5 : i)}
        onMouseLeave={handleMouseLeave}
      >
        <Star type={isFull ? "full" : isHalf ? "half" : "empty"} />
      </span>
    );
  }

  return <div>{stars}</div>;
}