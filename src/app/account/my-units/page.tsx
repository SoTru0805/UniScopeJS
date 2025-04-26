
import * as React from 'react';
import { auth } from '@/lib/firebase'; // Client-side auth
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserUnits, getAllUnits } from '@/app/actions';
import { ManageUnitsClient } from '@/components/manage-units-client'; // Import the client component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, BookMarked, LogIn } from 'lucide-react';
import type { Unit } from '@/types/unit';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button'; // Import Button

// Server Component to fetch initial data and handle auth state server-side initially
export default async function MyUnitsPage() {
  // Get all available units (can be cached or optimized later)
  const allUnitsPromise = getAllUnits();

  // We need to handle auth state fetching carefully.
  // Option 1: Get user ID on the server (if session management allows) - Preferred for RSC
  // Option 2: Pass fetching logic to a Client Component that uses onAuthStateChanged

  // For this example, let's fetch all units server-side and pass them down.
  // Auth and user-specific units will be handled in the client component.
  let allUnits: Unit[] = [];
  let fetchError: string | null = null;

  try {
    allUnits = await allUnitsPromise;
  } catch (error) {
    console.error("Error fetching all units:", error);
    fetchError = "Could not load the list of available units. Please try again later.";
  }

  return (
    <main className="flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-gradient-to-br from-background to-muted/30 min-h-[calc(100vh-theme(spacing.14))]">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <BookMarked className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle className="text-3xl font-bold text-primary">My Enrolled Units</CardTitle>
            <CardDescription>Manage the units you are currently studying or have completed.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError ? (
              <Alert variant="destructive">
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            ) : (
              // Use the Client Component to handle auth state and interactions
              <ManageUnitsClient allUnits={allUnits} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
