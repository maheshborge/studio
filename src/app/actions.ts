
'use server';

import { summarizeAggregatedContent } from '@/ai/flows/summarize-aggregated-content';

export async function getAiSummary(content: string) {
  try {
    const result = await summarizeAggregatedContent({ content });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'Failed to generate summary' };
  }
}
