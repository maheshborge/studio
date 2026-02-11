
'use server';

import { getAgriculturalAdvice } from '@/ai/flows/agricultural-advice-flow';

export async function getExpertAdvice(content: string) {
  try {
    const result = await getAgriculturalAdvice({ content });
    return { success: true, advice: result.advice, keyPoints: result.keyPoints };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'AI सल्ला मिळवता आला नाही.' };
  }
}

export async function getLatestAgriNews() {
  // Static data for demonstration
  return {
    success: true,
    news: [
      {
        id: "1",
        title: "कापसाच्या दरात सुधारणा",
        excerpt: "बाजार समित्यांमध्ये कापसाचे भाव वधारले आहेत...",
        fullContent: "कापसाच्या मागणीत वाढ झाल्यामुळे दरात सुधारणा पाहायला मिळत आहे.",
        imageUrl: "https://picsum.photos/seed/cotton/800/400",
        category: "बाजारपेठ",
        date: "आज",
        type: "article"
      }
    ]
  };
}
