"use client";

import type { Review } from "@/types/review";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarHalf, CalendarDays } from "lucide-react"; // Added CalendarDays
import { formatDistanceToNow, parseISO } from 'date-fns'; // Import parseISO
import { Badge } from "@/components/ui/badge"; // Import Badge

interface ReviewCardProps {
  review: Review;
}

function RatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-primary" title={`${rating.toFixed(1)} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className="w-4 h-4" />
      ))}
      {halfStar && <StarHalf key="half" fill="currentColor" className="w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" /> // Muted empty stars
      ))}
       {/* Removed text rating for cleaner look */}
       {/* <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span> */}
    </div>
  );
}


export function ReviewCard({ review }: ReviewCardProps) {
    // Parse the ISO string back to a Date object before formatting
    const formattedDate = review.createdAt
    ? formatDistanceToNow(parseISO(review.createdAt), { addSuffix: true })
    : 'Date unavailable';

  return (
     // Added group class for hover effect targeting child
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border border-border/60 group">
      <CardHeader className="pb-3 pt-4 px-4"> {/* Adjust padding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
             <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{review.unitCode}</CardTitle>
             <RatingDisplay rating={review.rating} />
        </div>
         <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            Posted {formattedDate}
         </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0"> {/* Adjust padding */}
        <p className="text-foreground/90 leading-relaxed">{review.reviewText}</p> {/* Slightly muted text */}
      </CardContent>
       {/* Optional: Add Footer for Difficulty/Workload Badges if you add those fields */}
       {/* <CardFooter className="px-4 pb-3 pt-2 flex gap-2">
            <Badge variant="secondary">Difficulty: {review.difficulty || 'N/A'}</Badge>
            <Badge variant="secondary">Workload: {review.workload || 'N/A'} hrs/wk</Badge>
       </CardFooter> */}
    </Card>
  );
}
