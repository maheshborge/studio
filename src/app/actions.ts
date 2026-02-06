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

// Articles data for simulation
const AGRI_NEWS_DATABASE = [
  {
    id: "news-1",
    title: "पावसाचा अंदाज: महाराष्ट्रात पुढील ५ दिवस पावसाची शक्यता",
    excerpt: "हवामान विभागाने दिलेल्या माहितीनुसार, विदर्भ आणि मराठवाड्यात जोरदार पावसाची शक्यता वर्तवण्यात आली आहे...",
    fullContent: `हवामान विभागाने (IMD) वर्तवलेल्या अंदाजानुसार, अरबी समुद्रात निर्माण झालेल्या कमी दाबाच्या पट्ट्यामुळे महाराष्ट्रात पुढील पाच दिवस पावसाचे वातावरण राहील. विशेषतः विदर्भ आणि मराठवाड्यातील काही जिल्ह्यांमध्ये 'यलो अलर्ट' जारी करण्यात आला आहे. 

    शेतकऱ्यांनी काढणीला आलेली पिके सुरक्षित ठिकाणी हलवावीत. बागायती पिकांना सध्या पाणी देणे टाळावे आणि साचलेल्या पाण्याचा निचरा करण्यासाठी चर काढावेत. सातारा, सांगली आणि कोल्हापूर भागात हलक्या सरींची शक्यता आहे.`,
    imageUrl: "https://picsum.photos/seed/news1/1200/600",
    category: "हवामान अंदाज",
    categoryKey: "weather",
    date: "आज",
    type: "article",
    author: "हवामान तज्ज्ञ",
    sourceUrl: "https://www.mazisheti.org/weather-update"
  },
  {
    id: "news-2",
    title: "कापसाच्या दरात मोठी सुधारणा, शेतकऱ्यांना दिलासा",
    excerpt: "बाजार समित्यांमध्ये कापसाचे भाव प्रति क्विंटल ८५०० रुपयांच्या पार गेले आहेत. जागतिक बाजारपेठेतील मागणीमुळे ही वाढ...",
    fullContent: `गेल्या काही दिवसांपासून कापसाच्या दरात सातत्याने वाढ होत आहे. आज अनेक बाजार समित्यांमध्ये कापसाचा दर प्रति क्विंटल ८ हजार ५०० रुपयांच्या वर पोहोचला आहे. जागतिक बाजारपेठेत रुईची टंचाई आणि वाढती मागणी यामुळे भारतीय कापसाला मोठी मागणी मिळत आहे.

    तज्ज्ञांच्या मते, येत्या काळात दर आणखी वाढण्याची शक्यता आहे. शेतकऱ्यांनी आपला माल टप्प्याटप्प्याने विक्रीस काढावा. साठवणूक करताना कापसाला ओलावा लागणार नाही याची काळजी घ्यावी.`,
    imageUrl: "https://picsum.photos/seed/news2/1200/600",
    category: "बाजारपेठ",
    categoryKey: "market",
    date: "१ तास आधी",
    type: "article",
    author: "बाजार विश्लेषक",
    sourceUrl: "https://www.mazisheti.org/cotton-market"
  },
  {
    id: "news-3",
    title: "नवीन नमो शेतकरी सन्मान निधी हप्ता लवकरच जमा होणार",
    excerpt: "राज्य शासनाकडून नमो शेतकरी योजनेचा पुढील हप्ता वितरीत करण्याची प्रक्रिया सुरू झाली असून, लवकरच खात्यावर पैसे जमा होतील...",
    fullContent: `महाराष्ट्र राज्य शासनाची महत्त्वाकांक्षी योजना 'नमो शेतकरी महासन्मान निधी' चा चौथा हप्ता लवकरच शेतकऱ्यांच्या बँक खात्यावर थेट जमा केला जाणार आहे. यासाठी कृषी विभागाने लाभार्थ्यांची यादी अंतिम केली आहे.

    ज्या शेतकऱ्यांचे ई-केवायसी (e-KYC) अपूर्ण आहे, त्यांनी ते तातडीने पूर्ण करावे. आधार लिंक असलेल्या बँक खात्यावरच हे पैसे जमा होतील. या हप्त्यामुळे राज्यातील लाखो शेतकऱ्यांना खते आणि बियाणे खरेदीसाठी मदत होणार आहे.`,
    imageUrl: "https://picsum.photos/seed/news3/1200/600",
    category: "शासकीय योजना",
    categoryKey: "schemes",
    date: "२ तास आधी",
    type: "article",
    author: "शासकीय प्रतिनिधी",
    sourceUrl: "https://www.mazisheti.org/namo-shetkari"
  },
  {
    id: "news-4",
    title: "सेंद्रिय शेतीसाठी नवीन अनुदान योजना जाहीर",
    excerpt: "केंद्र सरकारने सेंद्रिय शेतीला प्रोत्साहन देण्यासाठी नवीन पॅकेज जाहीर केले आहे. यामध्ये खते आणि प्रशिक्षणासाठी मदत मिळेल...",
    fullContent: `केंद्र सरकारने 'परंपरागत कृषी विकास योजना' अंतर्गत सेंद्रिय शेती करणाऱ्या गटांना प्रति हेक्टर ५० हजार रुपयांपर्यंतचे अनुदान जाहीर केले आहे. हे अनुदान तीन वर्षांच्या कालावधीसाठी दिले जाईल.

    यामध्ये सेंद्रिय खतांचे उत्पादन, पॅकेजिंग आणि ब्रँडिंगसाठी विशेष तरतूद करण्यात आली आहे. इच्छुक शेतकऱ्यांनी आपल्या जवळच्या तालुका कृषी कार्यालयात संपर्क साधावा. सेंद्रिय मालाला सध्या शहरांमध्ये मोठी मागणी असून शेतकऱ्यांना यामुळे दुप्पट फायदा मिळू शकतो.`,
    imageUrl: "https://picsum.photos/seed/news4/1200/600",
    category: "शेती सल्ला",
    categoryKey: "advice",
    date: "३ तास आधी",
    type: "article",
    author: "कृषी तज्ज्ञ",
    sourceUrl: "https://www.mazisheti.org/organic-farming"
  }
];

export async function getLatestAgriNews() {
  // Simulating a dynamic fetch
  return { success: true, news: AGRI_NEWS_DATABASE };
}

export async function getArticleById(id: string) {
  const article = AGRI_NEWS_DATABASE.find(a => a.id === id);
  if (article) {
    return { success: true, article };
  }
  return { success: false, error: "Article not found" };
}
