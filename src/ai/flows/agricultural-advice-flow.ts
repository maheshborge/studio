
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgriculturalAdviceInputSchema = z.object({
  content: z.string().describe('Agricultural content to analyze.'),
});

const AgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('Professional summary of advice.'),
  keyPoints: z.array(z.string()).describe('Actionable steps for the farmer.'),
});

export async function getAgriculturalAdvice(input: z.infer<typeof AgriculturalAdviceInputSchema>) {
  return agriculturalAdviceFlow(input);
}

const agriculturalAdvicePrompt = ai.definePrompt({
  name: 'agriculturalAdvicePrompt',
  input: { schema: AgriculturalAdviceInputSchema },
  output: { schema: AgriculturalAdviceOutputSchema },
  prompt: `You are an expert Agricultural Consultant for MIDAS by MaziSheti.
  Analyze the content and provide professional, actionable advice in Marathi.
  Content: {{{content}}}`,
});

const agriculturalAdviceFlow = ai.defineFlow(
  {
    name: 'agriculturalAdviceFlow',
    inputSchema: AgriculturalAdviceInputSchema,
    outputSchema: AgriculturalAdviceOutputSchema,
  },
  async input => {
    const { output } = await agriculturalAdvicePrompt(input);
    return output!;
  }
);
