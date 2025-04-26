"use client";
import { ReviewCard } from "@/components/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Review } from "@/types/review";

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

const UserProfilePage = ({ params }: UserProfilePageProps) => {
  const { userId } = params;
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Fetch user data and reviews based on userId
    const fetchUserData = async () => {
      try {
        // Simulate fetching data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setName("Tung Tung Tung Tung Sahur");
        setUsername("tungsahur01");
        setUnits(["FIT1008", "FIT2004", "FIT2099", "FIT3077", "FIT3175"]);
        setReviews([
          {
            id: "1",
            userId: "user1",
            unitCode: "FIT2004",
            rating: 1,
            reviewText:
              "I never wore my seatbelt while driving to school because I want to die before making to this unit's class.",
            createdAt: new Date(),
          },
          {
            id: "2",
            userId: "user1",
            unitCode: "FIT2004",
            rating: 3,
            reviewText:
              "I never wore my seatbelt while driving to school because I want to die before making to this unit's class.",
            createdAt: new Date(),
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <>
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="flex items-center justify-between mt-8">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-8 w-1/4 mt-8" />
          <div className="grid grid-cols-1 gap-4 mt-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-gray-500">@{username}</p>
          </div>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-semibold">Units I'm doing/done</h2>
            <Button>Add Unit</Button>
          </div>
          <Input
            type="text"
            placeholder="search for a unit"
            className="mt-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {units.map((unit) => (
              <div
                key={unit}
                className="border p-4 rounded-md shadow-sm flex items-center justify-center"
              >
                {unit}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold mt-8">Reviews Given</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;