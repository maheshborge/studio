# MaziSheti - MIDAS Platform

हे **MIDAS by MaziSheti** प्लॅटफॉर्मचे अधिकृत वेब अ‍ॅप आहे. हे Next.js, Firebase आणि Genkit AI वापरून तयार केले आहे.

## GitHub वर पुश आणि लाईव्ह होस्टिंग (Deployment)

तुमचा कोड **maheshborge/firebase-midas** रिपॉजिटरीमध्ये पुश करण्यासाठी खालील कमांड्स वापरा:

```bash
# १. Git इनिशियलाइज करा (पहिल्यांदाच करत असाल तर)
git init

# २. तुमची रिपॉजिटरी लिंक करा
git remote add origin https://github.com/maheshborge/firebase-midas.git

# ३. सर्व बदल अ‍ॅड करा
git add .

# ४. कमिट मेसेज द्या
git commit -m "Production deployment with layout cleanup"

# ५. कोड पुश करा
git push -u origin main
```

## Firebase App Hosting सेटअप (अंतिम टप्पा)

१. **Deployment Status:** तुम्ही आता Firebase Console मध्ये 'Release in progress' पाहत आहात. हे पूर्ण होईपर्यंत वाट पहा.
२. **Success:** एकदा स्टेटस हिरवा (Green Checkmark) झाला की, तिथे दिलेल्या `...hosted.app` लिंकवर क्लिक करून तुमचे अ‍ॅप लाईव्ह पाहू शकता.
३. **Environment Variables:** 'App Hosting' सेटिंग्समध्ये `GOOGLE_GENAI_API_KEY` जोडल्याची खात्री करा, जेणेकरून AI फीचर्स चालतील.

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
