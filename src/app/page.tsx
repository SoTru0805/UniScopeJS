import Link from "next/link";
import { ReviewCard } from "@/components/review-card";
import { Input } from "@/components/ui/input";
import { getReviews, getBookmarkedReviews } from "@/app/actions";
import type { Review } from "@/types/review";

export default async function LandingPage() {
  const trendingReviews: Review[] = await getReviews();
  const bookmarkedReviews: Review[] = await getBookmarkedReviews();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-background">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">UniScope</h1>
          </div>
        <Input
          type="text"
          placeholder="search for a unit"
          className="w-full"
        />
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Trending now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
              />
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Reviews Bookmarked</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

