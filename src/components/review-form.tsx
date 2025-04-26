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

  const handleSubmit = () => {
    console.log(rating, reviewText);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Review this unit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{unitCode}</DialogTitle>
          <p className="text-sm text-muted-foreground">Do not mention any specific person.</p>
        </DialogHeader>
        <StarRating rating={rating} setRating={setRating} />
        <Textarea
          placeholder="Write your review for FIT2004 here..."
          className="resize-y min-h-[120px] my-4"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
