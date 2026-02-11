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

GitHub ला Firebase शी कनेक्ट करण्यासाठी या पायऱ्या फॉलो करा:

१. [Firebase Console](https://console.firebase.google.com/) वर जा.
२. **firebase-midas** प्रोजेक्ट निवडा.
३. डाव्या बाजूला **App Hosting** वर क्लिक करा.
४. 'Get Started' बटण दाबा.
५. 'Connect to GitHub' निवडा आणि तुमची `maheshborge/firebase-midas` रिपॉजिटरी सिलेक्ट करा.
६. 'Deployment Settings' मध्ये `Environment Variables` मध्ये `GOOGLE_GENAI_API_KEY` जोडा.
७. 'Finish' करा. इथून पुढे तुम्ही जेव्हा GitHub वर कोड पुश कराल, तेव्हा अ‍ॅप आपोआप अपडेट होईल!

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
