'use server';

/**
 * @fileOverview A specialized AI agent for providing expert agricultural advice.
 *
 * - getAgriculturalAdvice - A function that analyzes agricultural content and provides actionable tips.
 * - AgriculturalAdviceInput - The input type for the flow.
 * - AgriculturalAdviceOutput - The structured advice output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgriculturalAdviceInputSchema = z.object({
  content: z
    .string()
    .describe('The agricultural article content or user question to analyze.'),
});
export type AgriculturalAdviceInput = z.infer<typeof AgriculturalAdviceInputSchema>;

const AgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('A professional summary of the advice.'),
  keyPoints: z.array(z.string()).describe('List of clear, actionable steps for the farmer.'),
  language: z.string().describe('The primary language of the response (e.g., Marathi or English).'),
});
export type AgriculturalAdviceOutput = z.infer<typeof AgriculturalAdviceOutputSchema>;

export async function getAgriculturalAdvice(input: AgriculturalAdviceInput): Promise<AgriculturalAdviceOutput> {
  return agriculturalAdviceFlow(input);
}

const agriculturalAdvicePrompt = ai.definePrompt({
  name: 'agriculturalAdvicePrompt',
  input: {schema: AgriculturalAdviceInputSchema},
  output: {schema: AgriculturalAdviceOutputSchema},
  prompt: `You are an expert Agricultural Consultant (Krushi Sallaagar) for the MaziSheti platform.
  
  Your task is to analyze the provided content and provide professional, actionable advice to a farmer.
  - If the content is in Marathi, respond primarily in Marathi.
  - Provide a clear summary of the core advice.
  - List 3-5 very specific, actionable steps the farmer should take.
  - Keep the tone encouraging, expert, and practical.

  Article Content: 
  {{{content}}}`,
});

const agriculturalAdviceFlow = ai.defineFlow(
  {
    name: 'agriculturalAdviceFlow',
    inputSchema: AgriculturalAdviceInputSchema,
    outputSchema: AgriculturalAdviceOutputSchema,
  },
  async input => {
    const {output} = await agriculturalAdvicePrompt(input);
    return output!;
  }
);
