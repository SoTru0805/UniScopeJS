'use server';
/**
 * @fileOverview Summarizes university unit reviews using AI.
 *
 * - summarizeReviews - A function that summarizes reviews for a specific unit.
 * - SummarizeReviewsInput - The input type for the summarizeReviews function.
 * - SummarizeReviewsOutput - The return type for the summarizeReviews function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeReviewsInputSchema = z.object({
  unitCode: z.string().describe('The code of the university unit to summarize reviews for.'),
  reviews: z.array(z.string()).describe('An array of review texts for the unit.'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the reviews.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  return summarizeReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {
    schema: z.object({
      unitCode: z.string().describe('The code of the university unit.'),
      reviews: z.array(z.string()).describe('An array of review texts.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the reviews.'),
    }),
  },
  prompt: `You are an AI assistant tasked with summarizing university unit reviews for students.

  Summarize the following reviews for unit code {{{unitCode}}}. Focus on the key points, overall sentiment, and common feedback mentioned in the reviews.

  Reviews:
  {{#each reviews}}
  - {{{this}}}
  {{/each}}
  `,
});

const summarizeReviewsFlow = ai.defineFlow<
  typeof SummarizeReviewsInputSchema,
  typeof SummarizeReviewsOutputSchema
>({
  name: 'summarizeReviewsFlow',
  inputSchema: SummarizeReviewsInputSchema,
  outputSchema: SummarizeReviewsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
