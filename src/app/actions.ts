'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { z } from 'zod';
import { db, auth } from '@/lib/firebase'; // Import auth
import type { Review } from '@/types/review';
import type { UnitSummary } from '@/types/unit-summary'; // Import UnitSummary type
import type { Unit } from '@/types/unit'; // Import Unit type

// --- Sample Data ---
const sampleUnits: Unit[] = [
  { unitId: 'FIT2001', code: 'FIT2001', name: 'Systems development', level: 'Undergraduate', creditPoints: 6, description: "<p>The unit introduces you to systems analysis and design as a problem solving activity, within the framework of a selected methodology. It will focus on contemporary industry practice; investigating understanding and documenting system requirements; a range of design and implementation activities; and professional skills required for systems development.</p>" },
  { unitId: 'FIT2002', code: 'FIT2002', name: 'IT project management', level: 'Undergraduate', creditPoints: 6, description: "<p>This unit introduces you to the many concepts, tools and techniques for managing information technology projects. Exploring traditional and agile approaches for managing projects, topics include project lifecycles, project planning, project scheduling, team building, risk management, time and quality management. A case study approach will be used to provide learning opportunities, with an emphasis on the unique aspects of information technology projects.</p>" },
  { unitId: 'FIT2004', code: 'FIT2004', name: 'Algorithms and data structures', level: 'Undergraduate', creditPoints: 6, description: "<p>This unit introduces you to problem solving concepts and techniques fundamental to the science of programming. In doing this it covers problem specification, algorithmic design, analysis and implementation. Detailed topics include analysis of best, average and worst-case time and space complexity; introduction to numerical algorithms; recursion; advanced data structures such as heaps and B-trees; hashing; sorting algorithms; searching algorithms; graph algorithms; and numerical computing.</p>" },
  // Add more units if needed, e.g., from a CSV import in a real scenario
];


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
    const docRef = await addDoc(collection(db, 'reviews'), {
      unitCode: unitCode.toUpperCase(), // Standardize unit code
      rating,
      reviewText,
      createdAt: serverTimestamp(), // Use server timestamp
    });
    console.log('Review submitted with ID: ', docRef.id);
    revalidatePath('/'); // Revalidate the homepage to show the new review
    revalidatePath('/dashboard'); // Revalidate the dashboard page
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Failed to submit review to database.'); // Throw specific error
  }
}

export async function getReviews(): Promise<Review[]> {
  try {
    const reviewsCol = collection(db, 'reviews');
    // Order by creation date descending by default
    const q = query(reviewsCol, orderBy('createdAt', 'desc'));
    const reviewSnapshot = await getDocs(q);
    const reviewList = reviewSnapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure createdAt is a Firestore Timestamp before converting
        const createdAtTimestamp = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
        // Convert Timestamp to ISO string for serialization
        const createdAtISO = createdAtTimestamp.toDate().toISOString();

        return {
            id: doc.id,
            unitCode: data.unitCode,
            rating: data.rating,
            reviewText: data.reviewText,
            createdAt: createdAtISO, // Pass ISO string instead of Timestamp
        } as Review;
    });
    return reviewList;
  } catch (error) {
    console.error('Error fetching reviews: ', error);
    // In a real app, you might want to log this error and return an empty array
    // or throw a custom error to be handled by an error boundary.
    return [];
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
        console.log('User signed up:', userCredential.user.uid);
        revalidatePath('/'); // Revalidate relevant paths after sign up
        revalidatePath('/dashboard');
        return { success: true, userId: userCredential.user.uid };
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
        return { success: true };
    } catch (error: any) {
        console.error('Error signing out user:', error.message);
        throw new Error(`Sign out failed: ${error.message}`);
    }
}
