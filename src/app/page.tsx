import * as React from 'react';
import { getReviews, submitReview } from '@/app/actions';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { GraduationCap, AlertTriangle, Info } from 'lucide-react'; // Added icons
import type { Review } from '@/types/review'; // Import Review type

export default async function Home() {
  // Fetch initial reviews on the server
  let reviews: Review[] = [];
  let fetchError = null;
  try {
    reviews = await getReviews();
  } catch (error) {
     console.error("Error fetching reviews on page load:", error);
     fetchError = "Could not load reviews at this time. Please try again later.";
     // Assign an empty array if fetching fails to prevent further errors
     reviews = [];
  }


  // Determine a representative unit code for the summary
  // Safely access unit code only if reviews exist
  const defaultUnitCode = reviews.length > 0 ? reviews[0].unitCode : "N/A";


  return (
    // Reduced vertical padding on main to avoid double padding with footer/header
    <main className="flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-background">
       <div className="w-full max-w-5xl space-y-8"> {/* Increased max-width */}
          <header className="text-center space-y-2 mb-8">
            <GraduationCap className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">UniScope</h1> {/* Changed from UniReview */}
            <p className="text-lg text-muted-foreground">Share and discover university unit reviews.</p> {/* Slightly larger description */}
          </header>

         {/* Review Submission Form */}
         <Card className="shadow-md"> {/* Wrap form in a Card */}
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center md:text-left">Submit a Review</CardTitle>
                 <CardDescription className="text-center md:text-left">Help others by sharing your experience.</CardDescription>
            </CardHeader>
            <CardContent>
                {/*
                    Pass the server action `submitReview` directly to the client component.
                    The ReviewForm component will manage its own submitting state.
                */}
                <ReviewForm onSubmit={submitReview} />
            </CardContent>
         </Card>


        {/* Review Display List and Summary Section */}
        <Card className="shadow-md"> {/* Wrap review list/summary in a Card */}
             <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center md:text-left">Recent Reviews &amp; Summary</CardTitle>
                 <CardDescription className="text-center md:text-left">Filter, sort, and summarize recent reviews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fetchError ? (
                    <Alert variant="destructive" className="flex items-center gap-3">
                         <AlertTriangle className="h-6 w-6"/>
                         <div>
                            <AlertTitle>Error Loading Reviews</AlertTitle>
                            <AlertDescription>{fetchError}</AlertDescription>
                        </div>
                    </Alert>
                ) : reviews.length === 0 ? (
                 <Alert className="border-primary/30 bg-accent/50 flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary"/>
                    <div>
                        <AlertTitle className="text-primary">No Reviews Yet</AlertTitle>
                        <AlertDescription>Be the first to submit a review using the form above!</AlertDescription>
                    </div>
                 </Alert>
               ) : (
                 // Pass fetched reviews and default unit code
                 <ReviewList reviews={reviews} unitCode={defaultUnitCode} />
               )}
             </CardContent>
        </Card>
      </div>
    </main>
  );
}
