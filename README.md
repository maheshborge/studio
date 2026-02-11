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
git commit -m "Deploying to Firebase App Hosting"

# ५. कोड पुश करा
git push -u origin main
```

## Firebase App Hosting सेटअप

१. [Firebase Console](https://console.firebase.google.com/) वर जा.
२. **firebase-midas** प्रोजेक्ट निवडा.
३. **App Hosting** वर क्लिक करा.
४. GitHub कनेक्ट करा आणि तुमची `maheshborge/firebase-midas` रिपॉजिटरी निवडा.
५. `Environment Variables` मध्ये तुमची `GOOGLE_GENAI_API_KEY` अ‍ॅड करा.
६. 'Finish' करा. तुमचे अ‍ॅप काही मिनिटांत लाईव्ह होईल!

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
