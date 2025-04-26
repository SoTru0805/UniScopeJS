"use client"; // Keep as client component if filtering/sorting/summarization trigger client-side state changes

import * as React from 'react';
import type { Review } from "@/types/review";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { summarizeReviews } from '@/ai/flows/summarize-reviews'; // Import the Genkit flow
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageSquareText } from 'lucide-react'; // Removed ThumbsUp/Down as they aren't used
import { Separator } from '@/components/ui/separator';

interface ReviewListProps {
  reviews: Review[];
  unitCode: string; // Pass the unit code for context
}

export function ReviewList({ reviews: initialReviews, unitCode }: ReviewListProps) {
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [sortOrder, setSortOrder] = React.useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summarizeError, setSummarizeError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let filtered = initialReviews.filter(review => {
      const ratingMatch = filterRating === null || review.rating === filterRating;
      const termMatch = searchTerm === '' ||
                        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        review.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
                        // Removed unitName from search filter: || review.unitName.toLowerCase().includes(searchTerm.toLowerCase());
      return ratingMatch && termMatch;
    });

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        case 'oldest':
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setReviews(filtered);
    // Reset summary when filters/sorting change
    setSummary(null);
    setSummarizeError(null);
  }, [initialReviews, sortOrder, filterRating, searchTerm]);

  const handleSummarize = async () => {
    // Filter reviews based on the *currently* selected unit code for summarization
    const reviewsForUnit = reviews.filter(r => r.unitCode.toLowerCase() === unitCode.toLowerCase());

    if (reviewsForUnit.length === 0) {
        setSummarizeError(`No reviews available to summarize for ${unitCode}.`);
        setSummary(null); // Clear any previous summary
        return;
    }
    setIsSummarizing(true);
    setSummary(null);
    setSummarizeError(null);
    try {
      const reviewTexts = reviewsForUnit.map(r => r.reviewText);
      const result = await summarizeReviews({ unitCode, reviews: reviewTexts });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing reviews:", error);
      setSummarizeError("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <Input
          placeholder="Search reviews (unit code, text)..." // Updated placeholder
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <div className="flex gap-4">
           <Select onValueChange={(value) => setFilterRating(value === 'all' ? null : parseInt(value))} defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Filter by Rating" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    {[5, 4, 3, 2, 1].map(rating => (
                     <SelectItem key={rating} value={String(rating)}>
                        {rating} Star{rating > 1 ? 's' : ''}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSortOrder(value as any)} defaultValue="newest">
                <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
            </Select>
        </div>

      </div>

       {/* AI Summary Section */}
       <div className="p-4 border rounded-lg bg-card shadow-sm space-y-3">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-primary" />
                AI Review Summary for {unitCode}
            </h3>
             <Button onClick={handleSummarize} disabled={isSummarizing || reviews.length === 0} variant="outline" size="sm">
                {isSummarizing ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    </>
                ) : (
                    'Generate Summary'
                )}
            </Button>
          </div>

        {isSummarizing && (
             <div className="flex items-center justify-center p-4 text-muted-foreground">
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 <span>Thinking...</span>
             </div>
         )}
         {summarizeError && (
           <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{summarizeError}</AlertDescription>
           </Alert>
         )}
         {summary && !isSummarizing && (
           <Alert className="bg-accent/50 border-primary/30">
             <AlertTitle className="font-medium text-primary">Summary for {unitCode}</AlertTitle>
             <AlertDescription className="text-foreground">{summary}</AlertDescription>
           </Alert>
         )}
        {!summary && !isSummarizing && !summarizeError && (
             <p className="text-sm text-muted-foreground italic">Click "Generate Summary" to get an AI-powered overview of the reviews displayed below for unit {unitCode}.</p>
        )}
       </div>

       <Separator />


      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No reviews found matching your criteria.
        </div>
      )}
    </div>
  );
}
