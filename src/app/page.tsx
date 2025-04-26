import * as React from 'react';
import { getReviews, submitReview } from '@/app/actions';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GraduationCap } from 'lucide-react';

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
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24 bg-background">
       <div className="w-full max-w-4xl space-y-8">
          <header className="text-center space-y-2">
            <GraduationCap className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">UniReview</h1>
            <p className="text-muted-foreground">Share and discover university unit reviews.</p>
          </header>

         {/* Review Submission Form */}
         <section>
             <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Submit a Review</h2>
              {/*
                Pass the server action `submitReview` directly to the client component.
                The ReviewForm component will manage its own submitting state.
              */}
             <ReviewForm onSubmit={submitReview} />
         </section>


        {/* Review Display List */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Recent Reviews</h2>
           {fetchError ? (
                <Alert variant="destructive">
                    <AlertTitle>Error Loading Reviews</AlertTitle>
                    <AlertDescription>{fetchError}</AlertDescription>
                </Alert>
            ) : reviews.length === 0 ? (
             <Alert>
               <AlertTitle>No Reviews Yet</AlertTitle>
               <AlertDescription>Be the first to submit a review!</AlertDescription>
             </Alert>
           ) : (
             // Pass fetched reviews and default unit code
             <ReviewList reviews={reviews} unitCode={defaultUnitCode} />
           )}
         </section>
      </div>
    </main>
  );
}

// Make sure Review type is imported or defined if not globally available
import type { Review } from '@/types/review';
