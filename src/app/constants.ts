import type { Review } from '@/types/review';
import { z } from 'zod';

// --- Review Schemas and Actions ---

export const reviewSchema = z.object({
    unitCode: z.string().min(1, "Unit code is required."),
    rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
    reviewText: z.string().min(10, "Review text must be at least 10 characters long."),
    userId: z.string().min(1, "User ID is required."),
  });