# MaziSheti - MIDAS Platform

हे **MIDAS by MaziSheti** प्लॅटफॉर्मचे अधिकृत वेब अ‍ॅप आहे.

## GitHub शी कोड सिंक कसा करायचा? (How to Sync with GitHub)

फायरबेस स्टुडिओमध्ये थेट 'Sync' बटण नाही, त्यामुळे तुम्हाला खालील **Terminal** वापरून कोड पुश करावा लागेल:

१. स्क्रीनच्या खालच्या बाजूला असलेल्या **Terminal** वर क्लिक करा.
२. खालील कमांड्स एकेक करून टाईप करा आणि 'Enter' दाबा:
   - `git add .`
   - `git commit -m "Update from Firebase Studio"`
   - `git push origin main`

यानंतर तुमचा सर्व कोड तुमच्या GitHub रिपॉजिटरीमध्ये जमा होईल.

## तुमच्या PC वर कोड कसा घ्यायचा? (How to get code on your PC)

१. तुमच्या पीसीवर नवीन फोल्डर बनवा.
२. तिथे कमांड प्रॉम्ट (CMD) उघडा आणि खालील कमांड टाका:
   - `git clone https://github.com/maheshborge/firebase-midas.git`

## मॅन्युअल अपलोड करताना सूचना:
जर तुम्ही GitHub वेबसाईटवरून फाईल्स 'Upload' करणार असाल, तर:
- **`index.html` फाईल अपलोड करू नका.** यामुळे बिल्ड एरर येतो.
- फक्त `src`, `public`, `package.json`, `apphosting.yaml` आणि इतर कॉन्फिग फाईल्स निवडा.

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
