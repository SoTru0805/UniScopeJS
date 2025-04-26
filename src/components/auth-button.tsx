'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, Loader2, User } from 'lucide-react'; // Added User icon
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signOutUser } from '@/app/actions';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'; // Import onAuthStateChanged

// Removed isSignedIn prop from interface
interface AuthButtonProps {}

export function AuthButton({}: AuthButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true); // Add loading state

  React.useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false); // Set loading to false once auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUser();
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      // router.push('/'); // Redirect is handled by state change now potentially
      router.refresh(); // Refresh to reflect the signed-out state across the app
    } catch (error) {
      console.error('Sign out failed:', error);
      toast({ title: 'Sign Out Failed', description: 'Could not sign you out. Please try again.', variant: 'destructive' });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

   if (isLoading) {
    // Show a loading state while checking auth status
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (currentUser) {
    // User is signed in
    return (
      <div className="flex items-center gap-2">
         {/* Optionally display user info */}
         {/* <span className="text-sm text-muted-foreground hidden sm:inline">
           {currentUser.email}
         </span> */}
         <Button onClick={handleSignOut} variant="outline" size="sm" disabled={isSigningOut}>
           {isSigningOut ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Out...
             </>
           ) : (
             <>
               <LogOut className="mr-2 h-4 w-4" /> Sign Out
             </>
           )}
         </Button>
      </div>
    );
  }

  // User is signed out
  return (
    <Button onClick={handleSignIn} variant="outline" size="sm">
      <LogIn className="mr-2 h-4 w-4" /> Sign In
    </Button>
  );
}
