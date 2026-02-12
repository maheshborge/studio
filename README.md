# MaziSheti - MIDAS (Live Rebuild)

हा प्रोजेक्ट आता `midas.mazisheti.org` वर लाईव्ह जाण्यासाठी तयार आहे.

## ⚠️ Access Denied (Permissions) एरर कसा सोडवावा?

जर तुम्हाला रोलआऊटमध्ये `AccessDenied` असा एरर आला, तर खालील गोष्टी करा:

1. **Google Cloud Console** (IAM & Admin) मध्ये जा.
2. तुमच्या **Firebase App Hosting** च्या Service Account ला (ज्याला `app-hosting` असे नाव असेल) तपासा.
3. त्याला **'Storage Object Viewer'** ही Role द्या.
4. त्यानंतर पुन्हा **Retry Rollout** करा.

## १. प्रोजेक्ट सिंक आणि लाईव्ह कसा करावा?
टर्मिनलमध्ये खालील कमांड्स एकामागून एक टाका:
- `git add .`
- `git commit -m "Live rebuild with permission fix info"`
- `git push origin main`

## २. सपोर्ट
कोणत्याही मदतीसाठी संपर्क: **9975740444**
