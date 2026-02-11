
'use server';

/**
 * @fileOverview Expert AI agent for providing actionable agricultural advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgriculturalAdviceInputSchema = z.object({
  content: z.string().describe('Agricultural content to analyze.'),
});
export type AgriculturalAdviceInput = z.infer<typeof AgriculturalAdviceInputSchema>;

const AgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('Professional summary of advice.'),
  keyPoints: z.array(z.string()).describe('Actionable steps for the farmer.'),
  language: z.string().describe('Language of the response.'),
});
export type AgriculturalAdviceOutput = z.infer<typeof AgriculturalAdviceOutputSchema>;

export async function getAgriculturalAdvice(input: AgriculturalAdviceInput): Promise<AgriculturalAdviceOutput> {
  return agriculturalAdviceFlow(input);
}

const agriculturalAdvicePrompt = ai.definePrompt({
  name: 'agriculturalAdvicePrompt',
  input: {schema: AgriculturalAdviceInputSchema},
  output: {schema: AgriculturalAdviceOutputSchema},
  prompt: `You are an expert Agricultural Consultant (Krushi Sallaagar) for MIDAS by MaziSheti.
  
  Analyze the content and provide professional, actionable advice.
  - If content is in Marathi, respond in Marathi.
  - Provide a clear summary and 3-5 specific steps.
  - Keep tone encouraging and practical.

  Content: {{{content}}}`,
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
