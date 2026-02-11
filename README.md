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

तुम्हाला Firebase Console मध्ये 'Create Backend' बटण दिसत असेल, तर या पायऱ्या फॉलो करा:

१. **Create Backend** बटणावर क्लिक करा.
२. **GitHub कनेक्ट करा:** तुमचे खाते निवडा आणि `maheshborge/firebase-midas` रिपॉजिटरी सिलेक्ट करा.
३. **Region निवड:** 'Primary Region' म्हणून **asia-southeast1 (Singapore)** किंवा उपलब्ध असल्यास **asia-south1 (Mumbai)** निवडा. यामुळे महाराष्ट्रातील युजर्ससाठी अ‍ॅप वेगाने चालेल.
४. **Environment Variables:** 'Deployment Settings' मध्ये `GOOGLE_GENAI_API_KEY` जोडा जेणेकरून AI फीचर्स काम करतील.
५. **Finish:** एकदा सेटअप पूर्ण झाला की, तुमचे अ‍ॅप काही मिनिटांत लाईव्ह होईल!

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
