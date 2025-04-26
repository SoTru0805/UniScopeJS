"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "@/components/review-form";
import { ReviewCard } from "@/components/review-card";
import { getReviews } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Review } from "@/types/review";
import unitInfo from "../../../data/unit_info.json";



interface UnitDetailPageProps {
  params: {
    unitCode: string;
  };
}

async function getUnitDetails(unitCode: string) {
  // This simulates what you might normally fetch from a backend
  return {
    name: unitCode, // Just show the code as the name for now
    description: "This is a sample description for the unit.",
    averageScore: 7.2, // Hardcoded score for now
  };
}

export default function UnitDetailPage({ params }: UnitDetailPageProps) {
  const [open, setOpen] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitDescription, setUnitDescription] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { unitCode } = params;

  useEffect(() => {
    const fetchUnitInfo = async () => {
      setLoading(true);
      const unit = await getUnitDetails(unitCode);
      const allReviews = await getReviews();
      const unitReviews = allReviews.filter((review) => review.unitCode === unitCode);
  
      setUnitName(unit?.name || unitCode);
      setUnitDescription(unit?.description || "No description available.");
      setAverageScore(unit?.averageScore || 0);
      setReviews(unitReviews || []);
      setLoading(false);
    };
  
    fetchUnitInfo();
  }, [unitCode]);

  function getUnitDetails(unitCode: string) {
    const unit = unitInfo.find((u) => u.unit_code === unitCode);
    return unit
      ? {
          name: unit.unit_title,
          description: unit.description.replace(/<\/?p>/g, ""), // Remove <p> tags for cleaner text
          averageScore: parseFloat(unit.score),
        }
      : {
          name: unitCode,
          description: "No description available.",
          averageScore: 0,
        };
  }
  

  return (
    <main className="flex flex-col min-h-screen items-center p-6 md:p-12 lg:p-20 bg-background">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-7xl font-bold">{unitName}</h1>

          <div className="flex items-center gap-6">
          <div className="text-6xl font-extrabold text-primary">{averageScore.toFixed(1)}/10</div>
          <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  fill={index < Math.round(averageScore / 2) ? "#FACC15" : "#E5E7EB"}
                >
                  <path d="M12 .587l3.668 7.571 8.332 1.151-6.064 5.977 1.451 8.305L12 18.896l-7.387 4.695 1.451-8.305-6.064-5.977 8.332-1.151z" />
                </svg>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground">{unitDescription}</p>

          {/* Your original ReviewForm */}
          <ReviewForm unitCode={unitCode} open={open} setOpen={setOpen} />
            
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet for this unit.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((review) => (
                <ReviewCard review={review} key={review.reviewId} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
