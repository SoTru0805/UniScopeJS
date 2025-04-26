'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import type { Review } from '@/types/review';

// Zod schema for form validation on the server-side
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
