# MaziSheti - MIDAS (Live Rebuild)

हा प्रोजेक्ट आता `midas.mazisheti.org` वर लाईव्ह जाण्यासाठी तयार आहे. सर्व अनावश्यक कोड आणि एरर्स काढून टाकण्यात आले आहेत.

## १. प्रोजेक्ट सिंक आणि लाईव्ह कसा करावा?
टर्मिनलमध्ये खालील कमांड्स एकामागून एक टाका:
- `git add .`
- `git commit -m "Live rebuild for production"`
- `git push origin main`

## २. रोलआऊट फेल झाल्यास (Fixing fatal error)
जर रोलआऊटमध्ये `fatal: couldn't find remote ref` असा एरर आला, तर गिटहब आणि फायरबेसचे कनेक्शन रिफ्रेश करण्यासाठी ही कमांड वापरा:
- `git push origin main --force`

## ३. सपोर्ट
कोणत्याही मदतीसाठी संपर्क: **9975740444**