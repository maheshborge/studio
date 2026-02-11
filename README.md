# MaziSheti - MIDAS Platform

हे **MIDAS by MaziSheti** प्लॅटफॉर्मचे अधिकृत वेब अ‍ॅप आहे.

## टर्मिनल कुठे आहे? (Where is the Terminal?)
तुमच्या स्क्रीनच्या **सर्वात खालच्या बाजूला (Bottom Bar)** पहा. तिथे तुम्हाला **"Terminal"** लिहिलेले दिसेल किंवा **`>_`** असा आयकॉन असेल. त्यावर क्लिक केल्यावर कमांड टाईप करण्यासाठी जागा मिळेल.

## GitHub शी कोड सिंक कसा करायचा? (How to Sync with GitHub)

१. स्क्रीनच्या खालच्या बाजूला असलेल्या **Terminal** वर क्लिक करा.
२. खालील कमांड्स एकेक करून तिथे टाईप करा आणि प्रत्येक कमांड नंतर 'Enter' दाबा:
   - `git add .`
   - `git commit -m "Fix: Trigger new build for Cloud Build error"`
   - `git push origin main`

यानंतर फायरबेस आपोआप नवीन 'Build' सुरू करेल.

## "Git Source Fetch" एरर येत असल्यास काय करावे? (Troubleshooting Build Errors)
जर तुम्हाला `fatal: couldn't find remote ref` असा एरर येत असेल, तर:
- वरील तीन कमांड्स (add, commit, push) पुन्हा चालवा. यामुळे नवीन 'Commit ID' तयार होतो आणि फायरबेस त्याला ओळखू शकतो.
- तुमच्या GitHub वर **'main'** नावाची ब्रांच अस्तित्वात असल्याची खात्री करा.

## तुमच्या PC वर कोड कसा घ्यायचा? (How to get code on your PC)

१. तुमच्या पीसीवर नवीन फोल्डर बनवा.
२. तिथे कमांड प्रॉम्ट (CMD) उघडा आणि खालील कमांड टाका:
   - `git clone https://github.com/maheshborge/firebase-midas.git`

## मॅन्युअल अपलोड करताना महत्त्वाची सूचना:
जर तुम्ही GitHub वेबसाईटवरून फाईल्स 'Upload' करणार असाल, तर:
- **`index.html` फाईल अपलोड करू नका.** यामुळे बिल्ड एरर येतो. Next.js मध्ये याची गरज नसते.

## संपर्क
कोणत्याही मदतीसाठी MaziSheti टीमशी संपर्क साधा.
