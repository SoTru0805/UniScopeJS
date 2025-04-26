
export interface Unit {
  unitId: string; // Unique identifier for the unit
  code: string; // e.g., FIT2001
  name: string; // e.g., Systems development
  level: 'Undergraduate' | 'Postgraduate'; // Or other relevant levels
  creditPoints: number; // e.g., 6
  description: string; // HTML or markdown string
  // Add other fields as needed: faculty, prerequisites, etc.
  // faculty?: string;
  // prerequisites?: string[];
}
