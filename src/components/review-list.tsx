"use client"; // Keep as client component if filtering/sorting/summarization trigger client-side state changes

import * as React from 'react';
import type { Review } from "@/types/review";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { summarizeReviews } from '@/ai/flows/summarize-reviews'; // Import the Genkit flow
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageSquareText, Search, ListFilter, Info, AlertTriangle } from 'lucide-react'; // Added icons
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components
import { parseISO } from 'date-fns'; // Import parseISO

interface ReviewListProps {
  reviews: Review[];
  unitCode: string; // Pass the unit code for context
}

export function ReviewList({ reviews: initialReviews, unitCode: initialUnitCode }: ReviewListProps) {
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [sortOrder, setSortOrder] = React.useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentUnitCode, setCurrentUnitCode] = React.useState(initialUnitCode); // State for the unit being summarized/displayed
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summarizeError, setSummarizeError] = React.useState<string | null>(null);

  // Get unique unit codes from the initial list for potential filtering/selection later
  const uniqueUnitCodes = React.useMemo(() => {
    const codes = new Set(initialReviews.map(r => r.unitCode));
    return Array.from(codes).sort();
  }, [initialReviews]);

  React.useEffect(() => {
    let filtered = initialReviews.filter(review => {
      const ratingMatch = filterRating === null || review.rating === filterRating;
      const termMatch = searchTerm === '' ||
                        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        review.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
      // Optionally filter by currentUnitCode if needed, or keep showing all filtered reviews
      // const unitMatch = review.unitCode.toLowerCase() === currentUnitCode.toLowerCase();
      return ratingMatch && termMatch; // && unitMatch; // Uncomment unitMatch if you want to filter list by selected unit too
    });

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime();
        case 'oldest':
          return parseISO(a.createdAt).getTime() - parseISO(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setReviews(filtered);
    // Reset summary when filters/sorting change, or if the relevant reviews change
    setSummary(null);
    setSummarizeError(null);
  }, [initialReviews, sortOrder, filterRating, searchTerm, currentUnitCode]); // Added currentUnitCode dependency

  const handleSummarize = async () => {
     // Filter reviews based on the *currently* selected unit code for summarization
    const reviewsForUnit = initialReviews.filter(r => r.unitCode.toLowerCase() === currentUnitCode.toLowerCase());

    if (reviewsForUnit.length < 3) { // Require minimum reviews for a useful summary
        setSummarizeError(`Need at least 3 reviews for ${currentUnitCode} to generate a summary.`);
        setSummary(null); // Clear any previous summary
        setIsSummarizing(false);
        return;
    }
    setIsSummarizing(true);
    setSummary(null);
    setSummarizeError(null);
    try {
      const reviewTexts = reviewsForUnit.map(r => r.reviewText);
      const result = await summarizeReviews({ unitCode: currentUnitCode, reviews: reviewTexts });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing reviews:", error);
      setSummarizeError(`Failed to generate summary for ${currentUnitCode}. Please try again.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Update the unit code for summarization when the select dropdown changes
  const handleUnitChange = (newUnitCode: string) => {
    if (newUnitCode !== currentUnitCode) {
      setCurrentUnitCode(newUnitCode);
      setSummary(null); // Reset summary when unit changes
      setSummarizeError(null);
    }
  };

  return (
    <div className="space-y-6">
        {/* Filtering and Sorting Controls Card */}
         <Card className="bg-muted/30 border-border/50">
            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg flex items-center gap-2">
                     <ListFilter className="w-5 h-5 text-primary" /> Filter & Sort Reviews
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                     <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search unit code or review text..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full" // Padding left for icon
                        />
                    </div>
                    <div className="flex gap-4 flex-shrink-0">
                        <Select onValueChange={(value) => setFilterRating(value === 'all' ? null : parseInt(value))} defaultValue="all">
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Filter Rating" />
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
            </CardContent>
         </Card>


       {/* AI Summary Section Card */}
        <Card className="shadow-sm border-primary/20">
             <CardHeader className="pb-3 pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquareText className="w-5 h-5 text-primary" />
                         AI Review Summary
                    </CardTitle>
                     {/* Unit Selector for Summary */}
                    <Select onValueChange={handleUnitChange} value={currentUnitCode} disabled={isSummarizing}>
                         <SelectTrigger className="w-full sm:w-[180px]">
                             <SelectValue placeholder="Select Unit for Summary" />
                         </SelectTrigger>
                         <SelectContent>
                             {uniqueUnitCodes.length > 0 ? (
                                uniqueUnitCodes.map(code => (
                                <SelectItem key={code} value={code}>{code}</SelectItem>
                                ))
                            ) : (
                                <SelectItem value="N/A" disabled>No Units Found</SelectItem>
                            )}
                         </SelectContent>
                     </Select>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button
                    onClick={handleSummarize}
                    disabled={isSummarizing || currentUnitCode === "N/A" || initialReviews.filter(r => r.unitCode === currentUnitCode).length < 3} // Disable if summarizing, no unit, or too few reviews
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                >
                    {isSummarizing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating for {currentUnitCode}...
                        </>
                    ) : (
                        `Generate Summary for ${currentUnitCode}`
                    )}
                </Button>

                {isSummarizing && (
                    <div className="flex items-center justify-center p-4 text-muted-foreground text-sm gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Generating AI summary for {currentUnitCode}...</span>
                    </div>
                )}
                {summarizeError && !isSummarizing && (
                    <Alert variant="destructive" className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                            <AlertTitle>Summary Error</AlertTitle>
                            <AlertDescription>{summarizeError}</AlertDescription>
                        </div>
                    </Alert>
                )}
                {summary && !isSummarizing && (
                    <Alert className="bg-accent/50 border-primary/30">
                        <AlertTitle className="font-medium text-primary mb-1">Summary for {currentUnitCode}</AlertTitle>
                        <AlertDescription className="text-foreground leading-relaxed">{summary}</AlertDescription>
                    </Alert>
                )}
                {!summary && !isSummarizing && !summarizeError && (
                     <Alert className="border-dashed border-border flex items-center gap-3 text-sm">
                         <Info className="h-5 w-5 text-muted-foreground"/>
                        <AlertDescription className="text-muted-foreground">
                            {initialReviews.filter(r => r.unitCode === currentUnitCode).length < 3 && currentUnitCode !== "N/A"
                                ? `Select a unit and ensure it has at least 3 reviews to generate a summary.`
                                : `Click "Generate Summary" for an AI overview of ${currentUnitCode} reviews.`
                            }
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

       <Separator />


      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use columns for reviews */}
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground italic flex flex-col items-center gap-2">
           <Search className="w-8 h-8 text-muted-foreground/50" />
          No reviews found matching your current filters. Try adjusting your search.
        </div>
      )}
    </div>
  );
}
