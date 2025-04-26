
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, Loader2, User, Settings, Star, List, BookMarked } from 'lucide-react'; // Added BookMarked icon
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { useToast } from '@/hooks/use-toast';
import { signOutUser } from '@/app/actions';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'; // Import onAuthStateChanged

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
      router.push('/'); // Redirect to homepage after sign out
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

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Helper to get initials from email
  const getInitials = (email?: string | null) => {
    if (!email) return 'U'; // Default to 'U' for User
    const parts = email.split('@')[0];
    const nameParts = parts.split(/[._-]/); // Split by common separators
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };


  if (isLoading) {
    // Show a loading state while checking auth status
    return (
      <Button variant="ghost" size="icon" disabled className="rounded-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
           <Avatar className="h-8 w-8">
            {/* Add AvatarImage if you store profile picture URLs */}
            {/* <AvatarImage src={currentUser?.photoURL || undefined} alt={currentUser?.displayName || currentUser?.email || 'User'} /> */}
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {currentUser ? getInitials(currentUser.email) : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">User Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {currentUser ? (
          <>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                    {currentUser.email}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             {/* Navigation Items */}
            <DropdownMenuItem onClick={() => handleNavigate('/account/my-units')}>
                <BookMarked className="mr-2 h-4 w-4" />
                <span>My Units</span>
            </DropdownMenuItem>
            {/* Placeholder Items - Add functionality later */}
            {/* <DropdownMenuItem onClick={() => handleNavigate('/my-reviews')} disabled>
                <Star className="mr-2 h-4 w-4" />
                <span>My Reviews</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/subscriptions')} disabled>
                <List className="mr-2 h-4 w-4" />
                <span>Subscriptions</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleNavigate('/settings')} disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Guest</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleNavigate('/signup')}>
                <User className="mr-2 h-4 w-4" />
                <span>Create Account</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
