"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  unitCode: z.string().min(3, { message: "Unit code must be at least 3 characters." }).max(10),
  unitName: z.string().min(5, { message: "Unit name must be at least 5 characters." }).max(100),
  rating: z.number().min(1, { message: "Rating must be at least 1."}).max(5, { message: "Rating cannot exceed 5."}),
  reviewText: z.string().min(10, { message: "Review must be at least 10 characters." }).max(1000),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  // Accept the server action directly
  onSubmit: (data: ReviewFormValues) => Promise<any>;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Internal state for submitting
  const [hoverRating, setHoverRating] = React.useState(0);
  const [currentRating, setCurrentRating] = React.useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitCode: "",
      unitName: "",
      rating: 0,
      reviewText: "",
    },
  });

  const handleFormSubmit = async (data: ReviewFormValues) => {
     if (data.rating === 0) {
       form.setError("rating", { type: "manual", message: "Please select a rating." });
       return;
     }
    setIsSubmitting(true); // Set submitting state to true
    try {
      await onSubmit(data); // Call the passed server action
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      form.reset(); // Reset form after successful submission
      setCurrentRating(0); // Reset visual rating
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Submission Failed",
        description: `Could not submit your review. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Set submitting state back to false
    }
  };

  const handleRatingClick = (ratingValue: number) => {
    setCurrentRating(ratingValue);
    form.setValue("rating", ratingValue, { shouldValidate: true }); // Update form state and trigger validation
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="unitCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unit Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., COMP101" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="unitName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unit Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Introduction to Computing" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                 <div
                  className="flex space-x-1"
                  onMouseLeave={() => setHoverRating(0)}
                 >
                   {[...Array(5)].map((_, index) => {
                     const ratingValue = index + 1;
                     return (
                       <Star
                         key={ratingValue}
                         className={`h-6 w-6 cursor-pointer transition-colors duration-150 ${
                           ratingValue <= (hoverRating || currentRating)
                             ? 'text-primary fill-current'
                             : 'text-muted-foreground'
                         }`}
                         onMouseEnter={() => setHoverRating(ratingValue)}
                         onClick={() => handleRatingClick(ratingValue)}
                       />
                     );
                   })}
                 </div>
              </FormControl>
               {/* Hidden input to hold the actual rating value for the form */}
               <input type="hidden" {...field} />
               <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="reviewText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with the unit..."
                  className="resize-y min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
}
