"use client";

import { StarRating } from "./star-rating";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { submitReview } from "@/app/actions"; // Import your submitReview function
import { auth } from "@/app/firebase/config";
import { useParams } from "next/navigation"; // Import useParams for Next.js

interface ReviewFormProps {
  unitCode: string;
}

export function ReviewForm({ unitCode }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log(rating, reviewText);
      // TODO: connect to your backend API here
      setIsOpen(false); // close dialog after submitting
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
=======
  const [error, setError] = useState(""); // State variable for error messages

  // Monitor authentication state
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("User is logged in:", user);
  //     } else {
  //       console.log("No user is logged in.");
  //     }
  //   });

  //   return () => unsubscribe(); // Cleanup subscription on unmount
  // }, []);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.error("No user is logged in.");
        alert("You must be logged in to submit a review.");
        return;
      }
  
      // Frontend validation
      if (rating < 1 || rating > 5) {
        setError("Rating must be between 1 and 5.");
        return;
      }
  
      if (reviewText.trim().length < 10) {
        setError("Review text must be at least 10 characters long.");
        return;
      }
  
      console.log("Logged-in user:", user);

  
      // Prepare the form data
      const formData = {
        unitCode,
        rating,
        reviewText,
        userId: user.uid,
      };
  
      // Call the submitReview function
      const result = await submitReview(formData);
  
      if (result.success) {
        alert("Review submitted successfully!");
        setIsOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
>>>>>>> bd08a88 (feat (submit review): Add fully functional review form)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Review this unit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{unitCode}</DialogTitle>
          <DialogDescription>
            Do not mention any specific person.
          </DialogDescription>
        </DialogHeader>
<<<<<<< HEAD

        <div className="space-y-4">
          <StarRating rating={rating} setRating={setRating} />

          <Textarea
            placeholder={`Write your review for ${unitCode} here...`}
            className="resize-y min-h-[140px]"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <div className="text-sm text-muted-foreground space-y-1">
            <p>You can say:</p>
            <ul className="list-disc list-inside ml-2">
              <li>How hard was the content?</li>
              <li>How good was the teaching team?</li>
              <li>Is there anything you dislike about the unit?</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
=======
        <StarRating rating={rating} setRating={setRating} />
        <Textarea
          placeholder="Write your review for FIT2004 here..."
          className="resize-y min-h-[120px] my-4"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-muted-foreground">
          You can say:
          <ul>
            <li>How hard was the content?</li>
            <li>How good was the teaching team?</li>
            <li>Is there anything you dislike about the unit?</li>
          </ul>
        </p>
        <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} type="button">Submit</Button>
>>>>>>> bd08a88 (feat (submit review): Add fully functional review form)
        </div>
      </DialogContent>
    </Dialog>
  );
}
