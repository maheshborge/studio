'use server';

import { summarizeAggregatedContent } from '@/ai/flows/summarize-aggregated-content';
import { getAgriculturalAdvice } from '@/ai/flows/agricultural-advice-flow';

export async function getAiSummary(content: string) {
  try {
    const result = await summarizeAggregatedContent({ content });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'Failed to generate summary' };
  }
}

export async function getExpertAdvice(content: string) {
  try {
    const result = await getAgriculturalAdvice({ content });
    return { success: true, advice: result.advice, keyPoints: result.keyPoints };
  } catch (error) {
    console.error('Error getting expert advice:', error);
    return { success: false, error: 'Failed to get expert advice' };
  }
}
