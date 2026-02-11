# MaziSheti - MIDAS Platform (Troubleshooting Guide)

जर तुमचे अ‍ॅप "Rollout" होत नसेल किंवा "fatal: couldn't find remote ref" असा एरर येत असेल, तर खालील स्टेप्स फॉलो करा:

## १. टर्मिनलवरून नवीन अपडेट पुश करा (सर्वात महत्त्वाचे)
टर्मिनलमध्ये खालील कमांड्स एकामागून एक टाईप करा:
- `git add .`
- `git commit -m "Fix: Build configuration update"`
- `git push origin main`

## २. मॅन्युअल अपलोड करत असाल तर:
जर तुम्ही GitHub वर फाईल्स ड्रॅग-अँड-ड्रॉप (Drag & Drop) करून अपलोड करत असाल, तर:
- **`index.html` फाईल कधीही अपलोड करू नका.**
- खात्री करा की `package.json` आणि `apphosting.yaml` या फाईल्स मुख्य (Root) फोल्डरमध्ये आहेत.

## ३. फायरबेस कन्सोलवर जाऊन 'Retry' करा
- [Firebase Console](https://console.firebase.google.com/) वर जा.
- तुमच्या प्रोजेक्टमधील **'App Hosting'** विभाग उघडा.
- तिथे तुमच्या बॅकएंडवर क्लिक करा आणि **'Start Rollout'** किंवा **'Retry'** बटण दाबा.

## ४. पीसीवर कोड घेण्यासाठी:
- `git clone https://github.com/maheshborge/firebase-midas.git`

कोणत्याही मदतीसाठी संपर्क साधा.