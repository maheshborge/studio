# MaziSheti - MIDAS Platform

हे **MIDAS by MaziSheti** प्लॅटफॉर्मचे अधिकृत वेब अ‍ॅप आहे.

## सिंक एरर (Fatal Error) कसा सोडवायचा?

जर तुम्हाला **"fatal: couldn't find remote ref"** असा एरर आला, तर खालील स्टेप्स फॉलो करा:

१. स्क्रीनच्या खालच्या बाजूला असलेल्या **Terminal** वर क्लिक करा.
२. खालील कमांड्स क्रमाने टाका:
   - `git add .`
   - `git commit -m "Fix build and sync code"`
   - `git push origin main --force` (यामुळे तुमचा कोड रिफ्रेश होऊन पुन्हा पुश होईल)

३. यानंतर तुमच्या **Firebase Console** वर जा आणि तिथे **"Retry build"** वर क्लिक करा.

## मॅन्युअल अपलोड करताना महत्त्वाची सूचना:
- **`index.html` फाईल अपलोड करू नका.** यामुळे बिल्ड फेल होतो.
- फक्त `src`, `public`, `package.json`, `apphosting.yaml` आणि `.gitignore` अपलोड करा.

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
