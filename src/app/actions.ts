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

export async function getLatestAgriNews() {
  // Simulating a fetch from a news aggregator like Google News
  // In a real production app, this would call a News API or parse an RSS feed
  const news = [
    {
      id: "news-1",
      title: "पावसाचा अंदाज: महाराष्ट्रात पुढील ५ दिवस पावसाची शक्यता",
      excerpt: "हवामान विभागाने दिलेल्या माहितीनुसार, विदर्भ आणि मराठवाड्यात जोरदार पावसाची शक्यता वर्तवण्यात आली आहे...",
      imageUrl: "https://picsum.photos/seed/news1/600/400",
      category: "हवामान अंदाज",
      categoryKey: "weather",
      date: "आज",
      type: "article"
    },
    {
      id: "news-2",
      title: "कापसाच्या दरात मोठी सुधारणा, शेतकऱ्यांना दिलासा",
      excerpt: "बाजार समित्यांमध्ये कापसाचे भाव प्रति क्विंटल ८५०० रुपयांच्या पार गेले आहेत. जागतिक बाजारपेठेतील मागणीमुळे ही वाढ...",
      imageUrl: "https://picsum.photos/seed/news2/600/400",
      category: "बाजारपेठ",
      categoryKey: "market",
      date: "१ तास आधी",
      type: "article"
    },
    {
      id: "news-3",
      title: "नवीन नमो शेतकरी सन्मान निधी हप्ता लवकरच जमा होणार",
      excerpt: "राज्य शासनाकडून नमो शेतकरी योजनेचा पुढील हप्ता वितरीत करण्याची प्रक्रिया सुरू झाली असून, लवकरच खात्यावर पैसे जमा होतील...",
      imageUrl: "https://picsum.photos/seed/news3/600/400",
      category: "शासकीय योजना",
      categoryKey: "schemes",
      date: "२ तास आधी",
      type: "article"
    },
    {
      id: "news-4",
      title: "सेंद्रिय शेतीसाठी नवीन अनुदान योजना जाहीर",
      excerpt: "केंद्र सरकारने सेंद्रिय शेतीला प्रोत्साहन देण्यासाठी नवीन पॅकेज जाहीर केले आहे. यामध्ये खते आणि प्रशिक्षणासाठी मदत मिळेल...",
      imageUrl: "https://picsum.photos/seed/news4/600/400",
      category: "शेती सल्ला",
      categoryKey: "advice",
      date: "३ तास आधी",
      type: "article"
    },
    {
      id: "news-5",
      title: "सोयाबीनवरील पिवळा मोझॅक रोगाचे नियंत्रण कसे करावे?",
      excerpt: "सततच्या पावसामुळे सोयाबीनवर रोगाचा प्रादुर्भाव वाढत आहे. कृषी तज्ज्ञांनी दिलेले हे महत्त्वाचे उपाय पहा...",
      imageUrl: "https://picsum.photos/seed/news5/600/400",
      category: "शेती सल्ला",
      categoryKey: "advice",
      date: "४ तास आधी",
      type: "article"
    }
  ];

  return { success: true, news };
}
