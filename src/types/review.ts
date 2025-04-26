
export interface Review {
  id: string;
  unitCode: string;
  rating: number; // e.g., 1-5 stars
  reviewText: string;
  createdAt: string; // Changed from Timestamp to string (ISO format)
  userId?: string; // Optional: ID of the user who submitted the review
  // Add other relevant fields like reviewer name (if using auth), difficulty, workload, etc.
  // reviewerId?: string;
  // difficulty?: number; // 1-5
  // workload?: number; // 1-5 (hours/week or subjective rating)
}
