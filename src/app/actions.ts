
'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { z } from 'zod';
import { db, auth } from '@/lib/firebase'; // Import auth
import type { Review } from '@/types/review';
import type { UnitSummary } from '@/types/unit-summary';
import type { Unit } from '@/types/unit';
import type { UserProfile } from '@/types/user'; // Import UserProfile type
import { use } from 'react';

// --- Sample Data ---
const sampleUnits: Unit[] = [
  { unitId: 'FIT2001', code: 'FIT2001', name: 'Systems development', level: 'Undergraduate', creditPoints: 6, description: "<p>The unit introduces you to systems analysis and design as a problem solving activity, within the framework of a selected methodology. It will focus on contemporary industry practice; investigating understanding and documenting system requirements; a range of design and implementation activities; and professional skills required for systems development.</p>" },
  { unitId: 'FIT2002', code: 'FIT2002', name: 'IT project management', level: 'Undergraduate', creditPoints: 6, description: "<p>This unit introduces you to the many concepts, tools and techniques for managing information technology projects. Exploring traditional and agile approaches for managing projects, topics include project lifecycles, project planning, project scheduling, team building, risk management, time and quality management. A case study approach will be used to provide learning opportunities, with an emphasis on the unique aspects of information technology projects.</p>" },
  { unitId: 'FIT2004', code: 'FIT2004', name: 'Algorithms and data structures', level: 'Undergraduate', creditPoints: 6, description: "<p>This unit introduces you to problem solving concepts and techniques fundamental to the science of programming. In doing this it covers problem specification, algorithmic design, analysis and implementation. Detailed topics include analysis of best, average and worst-case time and space complexity; introduction to numerical algorithms; recursion; advanced data structures such as heaps and B-trees; hashing; sorting algorithms; searching algorithms; graph algorithms; and numerical computing.</p>" },
  // Add more units if needed, e.g., from a CSV import in a real scenario
];



// --- New Data Functions ---

export async function getUserReviews(userId: string) {
    console.log('fetching reviews of user: ', userId)
    //for now return dummy data
    const reviews: Review[] = [
        { id: '1', unitCode: 'FIT2004', rating: 1, reviewText: "This unit was incredibly challenging. The content was dense, and the pace was very fast. I struggled to keep up.", createdAt: new Date().toISOString(), userId: userId },
    { id: '2', unitCode: 'FIT2004', rating: 4, reviewText: "I really enjoyed the practical aspects of this unit. The hands-on labs were very helpful in understanding the concepts.", createdAt: new Date().toISOString(), userId: userId },
];
    return reviews

}

export async function getUserDetails(userId: string) {
    console.log('fetching user details of : ', userId)
    //for now return dummy data
    return {
        name: 'Tung Tung Tung Tung Sahur',
        userName: 'tungsahur01',
        description: 'Bachelor of Engineering - Specialised in Software Engineering',
    };

}


export async function getBookmarkedReviews() {
    console.log('fetching bookmarked reviews')
     const reviews: Review[] = [
        { id: '1', unitCode: 'FIT3077', rating: 4, reviewText: "The group project was a highlight. It was a great experience to work with others on a real-world problem.", createdAt: new Date('2024-01-15').toISOString(), userId: "1" },
        { id: '2', unitCode: 'MAT1830', rating: 3, reviewText: "The lectures were sometimes hard to follow, but the tutorials made up for it. More examples would be nice.", createdAt: new Date('2024-01-10').toISOString(), userId: "2" },
    ];
    return reviews
}

export async function getReviews(): Promise<Review[]> {
    console.log('fetching trending reviews')
    const reviews: Review[] = [
        { id: '1', unitCode: 'FIT2004', rating: 1, reviewText: "The workload was immense, and the lectures were very theoretical. Not much hands-on experience.", createdAt: new Date('2024-01-20').toISOString(), userId: "1" },
        { id: '2', unitCode: 'FIT2001', rating: 5, reviewText: "This unit completely changed my perspective on systems development. It's very well structured and engaging.", createdAt: new Date('2024-01-19').toISOString(), userId: "2" },
        { id: '3', unitCode: 'FIT2002', rating: 3, reviewText: "The project management unit was okay. The content was relevant, but the assessment tasks were somewhat tedious.", createdAt: new Date('2024-01-18').toISOString(), userId: "3" },
        { id: '4', unitCode: 'FIT2099', rating: 4, reviewText: "Object-Oriented Design was challenging but rewarding. The assignments really tested my understanding.", createdAt: new Date('2024-01-17').toISOString(), userId: "4" },
        { id: '5', unitCode: 'FIT3077', rating: 2, reviewText: "The content was interesting, but the organization of the unit could have been better.", createdAt: new Date('2024-01-16').toISOString(), userId: "5" },
        { id: '6', unitCode: 'MAT1830', rating: 3, reviewText: "The math unit was crucial for my understanding of algorithms, but it was quite dry at times.", createdAt: new Date('2024-01-15').toISOString(), userId: "6" },
    ];
    return reviews
}
// --- Review Schemas and Actions ---

const reviewSchema = z.object({
  unitCode: z.string().min(3).max(10),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10).max(1000),
});

export async function submitReview(formData: z.infer<typeof reviewSchema>) {
   // Validate form data on the server
   const validatedData = reviewSchema.safeParse(formData);

   if (!validatedData.success) {
       console.error("Server-side validation failed:", validatedData.error.errors);
       // Flatten errors for better client-side handling if needed
       const errors = validatedData.error.flatten().fieldErrors;
       throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
   }

   const { unitCode, rating, reviewText } = validatedData.data;

  try {
    // Add check for user authentication before submitting
    const user = auth.currentUser;
    if (!user) {
        throw new Error('You must be logged in to submit a review.');
    }

    const docRef = await addDoc(collection(db, 'reviews'), {
      unitCode: unitCode.toUpperCase(), // Standardize unit code
      rating,
      reviewText,
      createdAt: serverTimestamp(), // Use server timestamp
      userId: user.uid, // Associate review with the logged-in user
    });
    console.log('Review submitted with ID: ', docRef.id);
    revalidatePath('/'); // Revalidate the homepage to show the new review
    revalidatePath('/dashboard'); // Revalidate the dashboard page
    revalidatePath(`/account/my-units`); // Revalidate potentially linked pages
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
     if (error instanceof Error && error.message.includes('logged in')) {
        throw error; // Rethrow auth error
    }
    throw new Error('Failed to submit review to database.'); // Throw specific error
  }
}

// --- Unit Data Actions ---

// New function to return sample units (replace with DB fetch later)
export async function getAllUnits(): Promise<Unit[]> {
  // Simulate network delay for demonstration
  await new Promise(resolve => setTimeout(resolve, 50));
  return sampleUnits;
}


export async function getUnitsWithAverageRatings(): Promise<UnitSummary[]> {
  try {
    const reviewsCol = collection(db, 'reviews');
    const reviewSnapshot = await getDocs(reviewsCol);

    if (reviewSnapshot.empty) {
      return [];
    }

    const unitRatings: Record<string, { totalRating: number; count: number }> = {};

    // Aggregate ratings per unit code
    reviewSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const unitCode = data.unitCode as string;
      const rating = data.rating as number;

      if (unitCode && typeof rating === 'number') {
        if (!unitRatings[unitCode]) {
          unitRatings[unitCode] = { totalRating: 0, count: 0 };
        }
        unitRatings[unitCode].totalRating += rating;
        unitRatings[unitCode].count += 1;
      }
    });

    // Calculate average and format output
    const unitsSummary: UnitSummary[] = Object.entries(unitRatings).map(([unitCode, data]) => ({
      unitCode,
      averageRating: data.count > 0 ? parseFloat((data.totalRating / data.count).toFixed(1)) : 0,
      reviewCount: data.count,
    }));

    // Sort units alphabetically by code
    unitsSummary.sort((a, b) => a.unitCode.localeCompare(b.unitCode));

    return unitsSummary;
  } catch (error) {
    console.error('Error fetching unit summaries: ', error);
    // In a real app, you might want to log this error and return an empty array
    // or throw a custom error to be handled by an error boundary.
    return [];
  }
}



// --- Authentication Schemas and Actions ---

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});


export async function signUpUser(formData: z.infer<typeof signUpSchema>) {
    const validatedData = signUpSchema.safeParse(formData);

    if (!validatedData.success) {
        const errors = validatedData.error.flatten().fieldErrors;
        console.error("Server-side validation failed (signUpUser):", errors);
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const { email, password } = validatedData.data;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        console.log('User signed up:', userId);

        // Create a corresponding user document in Firestore
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            email: email,
            createdAt: serverTimestamp(),
            enrolledUnits: [], // Initialize empty array for units
        });
        console.log('User document created in Firestore for:', userId);


        revalidatePath('/'); // Revalidate relevant paths after sign up
        revalidatePath('/dashboard');
        revalidatePath('/account/my-units');
        return { success: true, userId: userId };
    } catch (error: any) {
        console.error('Error signing up user:', error.code, error.message);
        // Provide more specific error messages based on Firebase error codes
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        } else if (error.code === 'auth/weak-password') {
             throw new Error('The password is too weak.');
        } else if (error.code === 'auth/invalid-api-key') {
             console.error("Firebase API Key is invalid. Check your .env file and Firebase project settings.");
             throw new Error('Server configuration error. Please try again later.');
        }
        throw new Error(`Sign up failed: ${error.message}`);
    }
}

export async function signInUser(formData: z.infer<typeof signInSchema>) {
    const validatedData = signInSchema.safeParse(formData);

    if (!validatedData.success) {
        const errors = validatedData.error.flatten().fieldErrors;
         console.error("Server-side validation failed (signInUser):", errors);
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const { email, password } = validatedData.data;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user.uid);
        revalidatePath('/'); // Revalidate relevant paths after sign in
        revalidatePath('/dashboard');
        revalidatePath('/account/my-units');
        return { success: true, userId: userCredential.user.uid };
    } catch (error: any) {
        console.error('Error signing in user:', error.code, error.message);
         // Provide more specific error messages
         if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password.');
        } else if (error.code === 'auth/invalid-api-key') {
             console.error("Firebase API Key is invalid. Check your .env file and Firebase project settings.");
             throw new Error('Server configuration error. Please try again later.');
        }
        throw new Error(`Sign in failed: ${error.message}`);
    }
}


export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out');
        revalidatePath('/'); // Revalidate relevant paths after sign out
        revalidatePath('/dashboard');
        revalidatePath('/account/my-units');
        return { success: true };
    } catch (error: any) {
        console.error('Error signing out user:', error.message);
        throw new Error(`Sign out failed: ${error.message}`);
    }
}


// --- User Unit Management Actions ---

// Assumes the user is already authenticated when these are called.
// You might add explicit auth checks within each function if needed,
// although the UI should ideally prevent unauthenticated access.

/**
 * Fetches the list of enrolled units for the currently authenticated user.
 * @param userId - The ID of the authenticated user.
 * @returns A promise that resolves to an array of unit codes.
 */
export async function getUserUnits(userId: string): Promise<string[]> {
    if (!userId) {
        throw new Error("User ID is required.");
    }
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
        console.warn(`User document not found for userId: ${userId}. Returning empty array.`);
        // Optionally, create the document here if it should always exist for logged-in users
        // await setDoc(userRef, { email: auth.currentUser?.email || '', createdAt: serverTimestamp(), enrolledUnits: [] });
        return [];
        }

        const userData = userSnap.data() as UserProfile; // Cast to UserProfile
        return userData.enrolledUnits || []; // Return enrolledUnits or empty array if field is missing
    } catch (error) {
        console.error('Error fetching user units:', error);
        throw new Error('Failed to fetch user units.');
    }
}

/**
 * Adds a unit to the user's list of enrolled units.
 * @param userId - The ID of the authenticated user.
 * @param unitCode - The code of the unit to add.
 */
export async function addUserUnit(userId: string, unitCode: string) {
    if (!userId || !unitCode) {
        throw new Error("User ID and Unit Code are required.");
    }
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
        enrolledUnits: arrayUnion(unitCode.toUpperCase()) // Add unit code (standardized)
        });
        console.log(`Unit ${unitCode} added for user ${userId}`);
        revalidatePath('/account/my-units'); // Revalidate the page showing the units
        return { success: true };
    } catch (error) {
        console.error('Error adding user unit:', error);
        throw new Error('Failed to add unit.');
    }
}


/**
 * Removes a unit from the user's list of enrolled units.
 * @param userId - The ID of the authenticated user.
 * @param unitCode - The code of the unit to remove.
 */
export async function removeUserUnit(userId: string, unitCode: string) {
     if (!userId || !unitCode) {
        throw new Error("User ID and Unit Code are required.");
    }
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            enrolledUnits: arrayRemove(unitCode.toUpperCase()) // Remove unit code (standardized)
        });
        console.log(`Unit ${unitCode} removed for user ${userId}`);
        revalidatePath('/account/my-units'); // Revalidate the page showing the units
        return { success: true };
    } catch (error) {
        console.error('Error removing user unit:', error);
        throw new Error('Failed to remove unit.');
    }
}
