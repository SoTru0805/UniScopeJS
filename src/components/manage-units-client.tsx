
'use client';

import * as React from 'react';
import { auth } from '@/lib/firebase'; // Client-side auth
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserUnits, addUserUnit, removeUserUnit } from '@/app/actions';
import type { Unit } from '@/types/unit';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Search, PlusCircle, MinusCircle, LogIn, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ManageUnitsClientProps {
  allUnits: Unit[]; // All available units passed from server
}

export function ManageUnitsClient({ allUnits }: ManageUnitsClientProps) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = React.useState(false);
  const [userUnits, setUserUnits] = React.useState<string[]>([]);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
      if (user) {
        setIsLoadingUnits(true);
        setFetchError(null);
        try {
          const units = await getUserUnits(user.uid);
          setUserUnits(units);
        } catch (error) {
          console.error("Error fetching user units:", error);
          setFetchError("Could not load your enrolled units. Please try refreshing.");
          setUserUnits([]);
        } finally {
          setIsLoadingUnits(false);
        }
      } else {
        setUserUnits([]); // Clear units if user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUnitToggle = async (unitCode: string, isEnrolled: boolean) => {
    if (!currentUser) return; // Should not happen if button is enabled

    // Optimistic UI update
    const originalUnits = [...userUnits];
    if (isEnrolled) {
      setUserUnits(prev => prev.filter(code => code !== unitCode));
    } else {
      setUserUnits(prev => [...prev, unitCode]);
    }

    try {
      if (isEnrolled) {
        await removeUserUnit(currentUser.uid, unitCode);
        toast({ title: "Unit Removed", description: `${unitCode} removed from your list.` });
      } else {
        await addUserUnit(currentUser.uid, unitCode);
        toast({ title: "Unit Added", description: `${unitCode} added to your list.` });
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setUserUnits(originalUnits);
      toast({
        title: `Error ${isEnrolled ? 'Removing' : 'Adding'} Unit`,
        description: error.message || `Failed to update ${unitCode}.`,
        variant: "destructive",
      });
    }
  };

  const filteredUnits = React.useMemo(() => {
    return allUnits.filter(unit =>
      unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUnits, searchTerm]);

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading authentication...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
       <Alert variant="destructive" className="flex items-center gap-3">
            <LogIn className="h-6 w-6"/>
            <div>
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
                You need to be logged in to manage your units.
                <Button variant="link" asChild className="p-0 h-auto ml-1">
                <Link href="/login">Log in here.</Link>
                </Button>
            </AlertDescription>
            </div>
        </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
         <Input
            placeholder="Search units by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
         />
      </div>

      {isLoadingUnits ? (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading your units...</span>
        </div>
      ) : fetchError ? (
        <Alert variant="destructive" className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6"/>
            <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
            </div>
        </Alert>
      ) : filteredUnits.length === 0 && searchTerm ? (
         <Alert className="border-dashed border-border flex items-center gap-3 text-sm">
             <Info className="h-5 w-5 text-muted-foreground"/>
            <AlertDescription className="text-muted-foreground">
                No units found matching your search term "{searchTerm}".
            </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 border rounded-md p-4 bg-muted/20">
          {filteredUnits.map((unit) => {
            const isEnrolled = userUnits.includes(unit.code);
            return (
              <div key={unit.unitId} className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm hover:bg-accent/50 transition-colors duration-150">
                <div className="flex items-center space-x-3">
                   <Checkbox
                    id={`unit-${unit.code}`}
                    checked={isEnrolled}
                    onCheckedChange={() => handleUnitToggle(unit.code, isEnrolled)}
                    aria-label={`Select ${unit.code}`}
                  />
                  <Label htmlFor={`unit-${unit.code}`} className="cursor-pointer">
                    <span className="font-medium text-primary">{unit.code}</span>
                    <span className="text-muted-foreground ml-2">{unit.name}</span>
                  </Label>
                </div>
                 <Button
                    variant={isEnrolled ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleUnitToggle(unit.code, isEnrolled)}
                    className={`w-24 transition-all duration-150 ${isEnrolled ? 'border-destructive text-destructive hover:bg-destructive/10' : 'bg-primary hover:bg-primary/90'}`}
                    aria-label={isEnrolled ? `Remove ${unit.code}` : `Add ${unit.code}`}
                 >
                    {isEnrolled ? (
                        <> <MinusCircle className="mr-1 h-4 w-4"/> Remove</>
                    ) : (
                        <> <PlusCircle className="mr-1 h-4 w-4"/> Add</>
                    )}
                 </Button>
              </div>
            );
          })}
           {filteredUnits.length === 0 && !searchTerm && (
                 <Alert className="border-dashed border-border flex items-center gap-3 text-sm">
                    <Info className="h-5 w-5 text-muted-foreground"/>
                    <AlertDescription className="text-muted-foreground">
                        The list of available units is currently empty or couldn't be loaded.
                    </AlertDescription>
                </Alert>
            )}
        </div>
      )}
       <div className="text-sm text-muted-foreground mt-4 text-center px-4">
        Adding units you've taken helps establish credibility for your reviews.
      </div>
    </div>
  );
}
