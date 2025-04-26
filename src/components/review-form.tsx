"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Star, Loader2 } from "lucide-react"; // Added Loader2

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
  rating: z.number().min(1, { message: "Please select a rating between 1 and 5."}).max(5, { message: "Rating cannot exceed 5."}), // Updated message
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
  const [currentRating, setCurrentRating] = React.useState(0); // Use form's value for source of truth

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitCode: "",
      rating: 0, // Start with 0, validation handles the requirement
      reviewText: "",
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  // Update currentRating when form value changes (e.g., on reset)
  React.useEffect(() => {
    setCurrentRating(form.getValues("rating"));
  }, [form.watch("rating"), form]);


  const handleFormSubmit = async (data: ReviewFormValues) => {
     // Redundant check as validation should handle this, but good safeguard
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
      // setCurrentRating(0); // Reset visual rating - Now handled by useEffect
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
    form.setValue("rating", ratingValue, { shouldValidate: true }); // Update form state and trigger validation
  };

  return (
    <Form {...form}>
      {/* Removed extra padding from form, parent Card provides it */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
          name="rating"
          render={({ field }) => (
            <FormItem>
               {/* Use flex to align label and stars */}
              <div className="flex items-center justify-between">
                <FormLabel className={form.formState.errors.rating ? 'text-destructive' : ''}>Rating</FormLabel>
                 <FormControl>
                    <div
                        className="flex space-x-1"
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label="Rate this unit"
                    >
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                        <button
                            type="button" // Prevent form submission
                            key={ratingValue}
                            onMouseEnter={() => !isSubmitting && setHoverRating(ratingValue)}
                            onClick={() => !isSubmitting && handleRatingClick(ratingValue)}
                            className={`p-1 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                            disabled={isSubmitting}
                            aria-label={`${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
                        >
                            <Star
                                className={`h-6 w-6 transition-colors duration-150 ${
                                ratingValue <= (hoverRating || currentRating)
                                    ? 'text-primary fill-current'
                                    : 'text-muted-foreground/50' // Make unselected stars less prominent
                                }`}
                            />
                        </button>
                        );
                    })}
                    </div>
                </FormControl>
               </div>
               {/* Hidden input is no longer strictly needed as form.setValue updates the value */}
               {/* <input type="hidden" {...field} /> */}
               <FormMessage className="text-center md:text-left" /> {/* Align message */}
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
                  placeholder="Share your experience with the unit... What did you like? What could be improved?" // More engaging placeholder
                  className="resize-y min-h-[120px]" // Increased min-height
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="flex justify-end"> {/* Align button to the right */}
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200">
                 {isSubmitting ? (
                    <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                ) : 'Submit Review'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
