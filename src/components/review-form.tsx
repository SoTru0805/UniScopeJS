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

interface ReviewFormProps {
  unitCode: string;
}

export function ReviewForm({ unitCode }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
