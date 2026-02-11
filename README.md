# MaziSheti - MIDAS Platform (Troubleshooting Guide)

जर तुमचे अ‍ॅप "Rollout" होत नसेल किंवा "fatal: couldn't find remote ref" असा एरर येत असेल, तर खालील स्टेप्स फॉलो करा:

## १. 'fatal: couldn't find remote ref' एरर कसा सोडवावा?
हा एरर येतो कारण फायरबेसला तुमच्या जुन्या कोडचा पत्ता लागत नाही. हे सोडवण्यासाठी नवीन कोड 'Push' करणे आवश्यक आहे.
टर्मिनलमध्ये खालील कमांड्स एकामागून एक टाईप करा:
- `git add .`
- `git commit -m "Fix: New rollout trigger"`
- `git push origin main`

## २. मॅन्युअल अपलोड करत असाल तर सावधान!
जर तुम्ही GitHub वर फाईल्स ड्रॅग-अँड-ड्रॉप करून अपलोड करत असाल:
- **`index.html` फाईल कधीही अपलोड करू नका.** Next.js मध्ये याची गरज नसते आणि यामुळे बिल्ड फेल होतो.
- खात्री करा की `package.json` आणि `apphosting.yaml` फाईल्स मुख्य (Root) फोल्डरमध्ये आहेत.

## ३. फायरबेस कन्सोलवर 'Start Rollout' करा
- [Firebase Console](https://console.firebase.google.com/) वर जा.
- **'App Hosting'** विभाग उघडा.
- तुमच्या बॅकएंडवर क्लिक करा आणि **'Start Rollout'** बटण दाबा.

## ४. पीसीवर कोड घेण्यासाठी:
- `git clone https://github.com/maheshborge/firebase-midas.git`

कोणत्याही मदतीसाठी संपर्क साधा.