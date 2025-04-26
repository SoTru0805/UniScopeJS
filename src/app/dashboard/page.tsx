import * as React from 'react';
import { getUnitsWithAverageRatings } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, BarChart2, Info } from 'lucide-react'; // Added icons
import type { UnitSummary } from '@/types/unit-summary';

// Helper function to render star ratings visually
function RatingDisplay({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5; // Use 0.5 threshold for half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-0.5 text-primary" title={`${rating.toFixed(1)} out of 5 stars`}>
        {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} fill="currentColor" className="w-4 h-4" />
        ))}
        {halfStar && <Star key="half" fill="currentColor" className="w-4 h-4" />} {/* Simplified half star logic */}
        {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
        ))}
        <span className="ml-1.5 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
    );
}


export default async function DashboardPage() {
  let units: UnitSummary[] = [];
  let fetchError = null;

  try {
    units = await getUnitsWithAverageRatings();
  } catch (error) {
    console.error("Error fetching unit summaries for dashboard:", error);
    fetchError = "Could not load unit summaries at this time. Please try again later.";
    units = []; // Ensure units is an empty array on error
  }

  return (
    <main className="flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-gradient-to-br from-background to-muted/30 min-h-[calc(100vh-theme(spacing.14))]">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <BarChart2 className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-3xl font-bold text-primary">Unit Dashboard</CardTitle>
            <CardDescription>Overview of all reviewed units and their average ratings.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError ? (
              <Alert variant="destructive">
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            ) : units.length === 0 ? (
               <Alert className="border-primary/30 bg-accent/50 flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary"/>
                    <div>
                        <AlertTitle className="text-primary">No Unit Data Yet</AlertTitle>
                        <AlertDescription>No reviews have been submitted yet. Once reviews are added, unit summaries will appear here.</AlertDescription>
                    </div>
                 </Alert>
            ) : (
              <Table>
                <TableCaption>A list of units based on submitted reviews.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Unit Code</TableHead>
                    <TableHead>Average Rating</TableHead>
                    <TableHead className="text-right">Number of Reviews</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.unitCode}>
                      <TableCell className="font-medium">{unit.unitCode}</TableCell>
                      <TableCell>
                        <RatingDisplay rating={unit.averageRating} />
                      </TableCell>
                      <TableCell className="text-right">{unit.reviewCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
