"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ReviewCard } from "@/components/review-card";
import { Input } from "@/components/ui/input";
import { getReviews, getBookmarkedReviews } from "@/app/actions";
import type { Review } from "@/types/review";

export default function LandingPage() {
  const [trendingReviews, setTrendingReviews] = useState<Review[]>([]);
  const [bookmarkedReviews, setBookmarkedReviews] = useState<Review[]>([]);
  const [loadingTrendingReviews, setLoadingTrendingReviews] =
    useState<boolean>(true);
  const [loadingBookmarkedReviews, setLoadingBookmarkedReviews] =
    useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTrendingReviews(true);
      setLoadingBookmarkedReviews(true);
      const reviews = await getReviews();
      const bookmarked = await getBookmarkedReviews();
      setTrendingReviews(reviews);
      setBookmarkedReviews(bookmarked);
      setLoadingTrendingReviews(false);
      setLoadingBookmarkedReviews(false);
    };
    fetchData();
  }, []);
    const filteredTrendingReviews = trendingReviews.filter((review) =>
      review.unitCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Trending now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(searchTerm === ""
                ? trendingReviews
                : filteredTrendingReviews
              ).map((review) => (
                <Link key={review.reviewId} href={`/unit/${review.unitCode}`}>
                  <ReviewCard review={review} />
                </Link>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Reviews Bookmarked</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedReviews.map((review) => (
                <Link key={review.reviewId} href={`/unit/${review.unitCode}`}>
                  <ReviewCard review={review} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
}
