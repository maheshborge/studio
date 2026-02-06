'use server';

/**
 * @fileOverview This file contains a Genkit flow for summarizing aggregated content from mazisheti.org.
 *
 * The flow takes content as input and returns a short summary.  It exports the summarizeAggregatedContent function, as well
 * as the input and output types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAggregatedContentInputSchema = z.object({
  content: z
    .string()
    .describe('The content to be summarized, such as an article or video transcript.'),
});
export type SummarizeAggregatedContentInput = z.infer<
  typeof SummarizeAggregatedContentInputSchema
>;

const SummarizeAggregatedContentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the aggregated content.'),
  progress: z
    .string()
    .describe('A short, one-sentence summary of what has been generated.'),
});
export type SummarizeAggregatedContentOutput = z.infer<
  typeof SummarizeAggregatedContentOutputSchema
>;

export async function summarizeAggregatedContent(
  input: SummarizeAggregatedContentInput
): Promise<SummarizeAggregatedContentOutput> {
  return summarizeAggregatedContentFlow(input);
}

const summarizeAggregatedContentPrompt = ai.definePrompt({
  name: 'summarizeAggregatedContentPrompt',
  input: {schema: SummarizeAggregatedContentInputSchema},
  output: {schema: SummarizeAggregatedContentOutputSchema},
  prompt: `Summarize the following content in a concise paragraph:

  {{content}}
  `,
});

const summarizeAggregatedContentFlow = ai.defineFlow(
  {
    name: 'summarizeAggregatedContentFlow',
    inputSchema: SummarizeAggregatedContentInputSchema,
    outputSchema: SummarizeAggregatedContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeAggregatedContentPrompt(input);
    return {
      ...output!,
      progress: 'Generated a concise summary of the provided content.',
    };
  }
);
