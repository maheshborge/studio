# MaziSheti - MIDAS Platform

हे **MIDAS by MaziSheti** प्लॅटफॉर्मचे अधिकृत वेब अ‍ॅप आहे. हे Next.js, Firebase आणि Genkit AI वापरून तयार केले आहे.

## GitHub वर पुश आणि लाईव्ह होस्टिंग (Deployment)

तुमचा कोड **maheshborge/firebase-midas** रिपॉजिटरीमध्ये पुश करण्यासाठी खालील कमांड्स वापरा:

```bash
# १. Git इनिशियलाइज करा (पहिल्यांदा करत असाल तर)
git init

# २. तुमची रिपॉजिटरी लिंक करा
git remote add origin https://github.com/maheshborge/firebase-midas.git

# ३. सर्व बदल अ‍ॅड करा
git add .

# ४. कमिट मेसेज द्या
git commit -m "Production ready deployment"

# ५. कोड पुश करा
git push -u origin main
```

## Firebase App Hosting सेटअप (महत्त्वाचे)

१. **Create Backend:** Firebase Console मध्ये 'Create Backend' वर क्लिक करा.
२. **GitHub Connection:** 'Reuse existing installation' निवडा आणि `maheshborge` खाते कन्फर्म करा.
३. **Select Repo:** `firebase-midas` रिपॉजिटरी निवडा.
४. **Region निवड:** 'Primary Region' म्हणून **asia-southeast1 (Singapore)** निवडा.
५. **Environment Variables:** 'Deployment Settings' मध्ये `GOOGLE_GENAI_API_KEY` जोडा.
६. **Finish:** सेटअप पूर्ण झाल्यावर तुमचे अ‍ॅप काही मिनिटांत लाईव्ह होईल!

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
