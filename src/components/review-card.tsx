"use client";

import type { Review } from "@/types/review";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

function RatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-primary">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className="w-4 h-4" />
      ))}
      {halfStar && <StarHalf key="half" fill="currentColor" className="w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4" />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}


export function ReviewCard({ review }: ReviewCardProps) {
    const formattedDate = review.createdAt
    ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true })
    : 'Date unavailable';

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
             {/* Display only unitCode as title now */}
             <CardTitle className="text-lg font-semibold">{review.unitCode}</CardTitle>
             <RatingDisplay rating={review.rating} />
        </div>
         <CardDescription className="text-xs text-muted-foreground">
           Posted {formattedDate}
         </CardDescription>

      </CardHeader>
      <CardContent>
        <p className="text-foreground">{review.reviewText}</p>
        {/* Add more details if needed */}
      </CardContent>
    </Card>
  );
}
