
'use server';

/**
 * @fileOverview This file contains Server Actions that bridge the frontend logic 
 * with our AI flows and data retrieval services.
 */

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

// Simulated news database for MaziSheti
const AGRI_NEWS_DATABASE = [
  {
    id: "news-1",
    title: "पावसाचा अंदाज: महाराष्ट्रात पुढील ५ दिवस पावसाची शक्यता",
    excerpt: "हवामान विभागाने दिलेल्या माहितीनुसार, विदर्भ आणि मराठवाड्यात जोरदार पावसाची शक्यता वर्तवण्यात आली आहे...",
    fullContent: `हवामान विभागाने (IMD) वर्तवलेल्या अंदाजानुसार, अरबी समुद्रात निर्माण झालेल्या कमी दाबाच्या पट्ट्यामुळे महाराष्ट्रात पुढील पाच दिवस पावसाचे वातावरण राहील. विशेषतः विदर्भ आणि मराठवाड्यातील काही जिल्ह्यांमध्ये 'यलो अलर्ट' जारी करण्यात आली आहे.`,
    imageUrl: "https://picsum.photos/seed/weather1/1200/600",
    category: "हवामान अंदाज",
    categoryKey: "weather",
    date: "आज",
    type: "article",
    author: "हवामान तज्ज्ञ",
    sourceUrl: "https://www.mazisheti.org"
  },
  {
    id: "news-2",
    title: "कापसाच्या दरात मोठी सुधारणा, शेतकऱ्यांना दिलासा",
    excerpt: "बाजार समित्यांमध्ये कापसाचे भाव प्रति क्विंटल ८५०० रुपयांच्या पार गेले आहेत.",
    fullContent: `गेल्या काही दिवसांपासून कापसाच्या दरात सातत्याने वाढ होत आहे. आज अनेक बाजार समित्यांमध्ये कापसाचा दर प्रति क्विंटल ८ हजार ५०० रुपयांच्या वर पोहोचला आहे.`,
    imageUrl: "https://picsum.photos/seed/market1/1200/600",
    category: "बाजारपेठ",
    categoryKey: "market",
    date: "१ तास आधी",
    type: "article",
    author: "बाजार विश्लेषक",
    sourceUrl: "https://www.mazisheti.org"
  }
];

export async function getLatestAgriNews() {
  return { success: true, news: AGRI_NEWS_DATABASE };
}

export async function getArticleById(id: string) {
  const article = AGRI_NEWS_DATABASE.find(a => a.id === id);
  if (article) {
    return { success: true, article };
  }
  return { success: false, error: "Article not found" };
}
