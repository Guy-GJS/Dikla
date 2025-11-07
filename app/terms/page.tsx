import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              תנאי שימוש
            </h1>
            <p className="text-gray-600 text-lg">
              תנאי השימוש של פלטפורמת Pritti למכירת וקניית מוצרי יד שנייה
            </p>
            <p className="text-gray-500 text-sm mt-2">
              עדכון אחרון: {new Date().toLocaleDateString('he-IL')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none" dir="rtl">
            
            {/* 1. כללי */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. כללי</h2>
              <div className="bg-gray-50 border-r-4 border-blue-500 p-6 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  ברוכים הבאים לפריטי (להלן: "הפלטפורמה", "האתר" או "השירות"). תנאי שימוש אלה מהווים הסכם משפטי מחייב בינך לבין פריטי. השימוש באתר מהווה הסכמה מלאה לתנאים אלה. אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                הפלטפורמה מאפשרת למשתמשים פרטיים למכור ולקנות מוצרי יד שנייה. אנו משמשים כמתווכים בלבד ואיננו צד לעסקאות בין המשתמשים.
              </p>
            </section>

            {/* 2. הגדרות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. הגדרות</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>"משתמש"</strong> - כל אדם או גוף המשתמש בשירותי האתר, בין כמוכר ובין כקונה.</li>
                <li><strong>"מוכר"</strong> - משתמש המעלה מודעה למכירת פריט באתר.</li>
                <li><strong>"קונה"</strong> - משתמש הרוכש או המעוניין לרכוש פריט המוצע באתר.</li>
                <li><strong>"פריט"</strong> - מוצר יד שנייה המוצע למכירה באתר.</li>
                <li><strong>"עמלת פריטי"</strong> - דמי שירות המחושבים כאחוז ממחיר המוצר (8% או ₪5 לפי הגבוה מביניהם).</li>
                <li><strong>"משלוח"</strong> - שירות משלוח שעלותו ₪35 (בתוספת לעלות הפריט ועמלת פריטי).</li>
                <li><strong>"איסוף עצמי"</strong> - העברת הפריט באמצעות תיאום ישיר בין הקונה למוכר.</li>
              </ul>
            </section>

            {/* 3. רישום והתחייבויות משתמש */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. רישום והתחייבויות משתמש</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 כשירות משפטית</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                השימוש באתר מותר למשתמשים בני 18 ומעלה בלבד. בעת שימוש באתר, אתה מצהיר כי:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>הנך בן 18 לפחות וכשיר לבצע פעולות משפטיות</li>
                <li>המידע שמסרת הינו נכון, מדויק ומעודכן</li>
                <li>אינך משתמש באתר למטרות בלתי חוקיות או אסורות</li>
                <li>תשמור על סודיות פרטי הכניסה שלך</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 שימוש אסור</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אסור לך לעשות שימוש באתר למטרות הבאות:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700">
                <li>מכירת פריטים גנובים, מזויפים, או בעלי זכויות יוצרים מוגנות</li>
                <li>פרסום תוכן פוגעני, גזעני, או מטעה</li>
                <li>הטרדת משתמשים אחרים או שליחת ספאם</li>
                <li>ניסיון לפרוץ לחשבונות אחרים או לפגוע באבטחת האתר</li>
                <li>שימוש בבוטים או כלים אוטומטיים ללא אישור מפורש</li>
                <li>מכירת פריטים חדשים (האתר מיועד למוצרי יד שנייה בלבד)</li>
                <li>פעילות עסקית מסחרית ללא אישור</li>
              </ul>
            </section>

            {/* 4. העלאת פריטים למכירה */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. העלאת פריטים למכירה</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 תהליך פרסום מודעה</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                על מנת למכור פריט באתר, על המוכר:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>למלא טופס פירוט מלא של הפריט הנמכר</li>
                <li>להעלות תמונות איכותיות של הפריט (עד 8 תמונות)</li>
                <li>לספק תיאור מדויק ומפורט של מצב הפריט</li>
                <li>לציין מחיר הוגן ומדויק</li>
                <li>לציין את מיקום הפריט (עיר ושכונה)</li>
                <li>לספק פרטי קשר תקינים (שם, אימייל, טלפון)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 אישור מודעות</h3>
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>חשוב:</strong> כל מודעה עוברת בדיקה ואישור על ידי צוות האתר לפני פרסומה. אנו שומרים לעצמנו את הזכות לדחות או להסיר מודעות שאינן עומדות בתנאי השימוש.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 התחייבויות המוכר</h3>
              <p className="text-gray-700 leading-relaxed mb-4">המוכר מתחייב:</p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>לספק מידע נכון ומדויק על הפריט</li>
                <li>לא להסתיר ליקויים או פגמים בפריט</li>
                <li>להיות זמין לתקשורת עם קונים פוטנציאליים</li>
                <li>לכבד את ההתחייבות למכירה במקרה של הצעה מתאימה</li>
                <li>לעדכן את סטטוס הפריט במידה והוא נמכר</li>
                <li>לארוז ולשלוח את הפריט במידת הצורך (במקרה של משלוח)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 פריטים אסורים למכירה</h3>
              <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>אסור בהחלט למכור את הפריטים הבאים:</strong>
                </p>
                <ul className="list-disc mr-6 space-y-2 text-gray-700">
                  <li>נשק, תחמושת, חומרי נפץ או כל מוצר מסוכן</li>
                  <li>סמים, תרופות מרשם, או חומרים אסורים</li>
                  <li>מוצרים מזויפים או עותקים לא חוקיים</li>
                  <li>מוצרים גנובים או שמקורם אינו חוקי</li>
                  <li>חיות חיות (חיות מחמד)</li>
                  <li>תוכן פורנוגרפי או בעל אופי מיני</li>
                  <li>מוצרי טבק, סיגריות אלקטרוניות ואלכוהול</li>
                  <li>מוצרים שפג תוקפם או מזון שאינו בטוח</li>
                  <li>מוצרים המפרים זכויות יוצרים או סימני מסחר</li>
                  <li>שירותים, תוכן דיגיטלי או קבצים להורדה</li>
                </ul>
              </div>
            </section>

            {/* 5. רכישת פריטים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. רכישת פריטים</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 שני אופני רכישה</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                הפלטפורמה מציעה שני אופני רכישה:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">🚚 רכישה עם משלוח</h4>
                  <ul className="list-disc mr-6 space-y-2 text-gray-700 text-sm">
                    <li>תשלום בטוח באמצעות Stripe</li>
                    <li>עלות משלוח: ₪35</li>
                    <li>תשלום מלא מראש</li>
                    <li>המוצר נשלח לכתובת שמסרת</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">🏪 רכישה עם איסוף עצמי</h4>
                  <ul className="list-disc mr-6 space-y-2 text-gray-700 text-sm">
                    <li>תיאום ישיר עם המוכר דרך WhatsApp</li>
                    <li>ללא עלות משלוח</li>
                    <li>תשלום במזומן או העברה בעת האיסוף</li>
                    <li>אפשרות לבדוק את המוצר לפני הקנייה</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 התחייבויות הקונה</h3>
              <p className="text-gray-700 leading-relaxed mb-4">הקונה מתחייב:</p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>לשלם את המחיר המלא של הפריט בתוספת עמלת פריטי ועלות משלוח (במידת הצורך)</li>
                <li>לספק כתובת משלוח מדויקת ונגישה</li>
                <li>להיות זמין לקבלת המוצר או לתאם איסוף</li>
                <li>לבדוק את המוצר מיד עם קבלתו</li>
                <li>ליצור קשר עם המוכר בדרך מכובדת ומנומסת</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 בקשת פריטים שאינם זמינים</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                במידה ואינך מוצא את הפריט המבוקש באתר, תוכל להשתמש בטופס "רוצה לקנות" כדי להשאיר פרטים. נעדכן אותך כאשר פריט מתאים יהיה זמין.
              </p>
            </section>

            {/* 6. מחירים ותשלומים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. מחירים ותשלומים</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 מבנה תמחור</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-lg mb-4">
                <p className="text-gray-800 font-semibold mb-3">חישוב המחיר הסופי:</p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>מחיר הפריט:</strong> המחיר שקבע המוכר</p>
                  <p><strong>+ עמלת פריטי:</strong> 8% ממחיר הפריט (מינימום ₪5)</p>
                  <p className="text-sm text-gray-600 mr-4">נוסחה: MAX(מחיר × 8%, ₪5)</p>
                  <p><strong>+ דמי משלוח:</strong> ₪35 (רק במידה ובחרת באופן משלוח)</p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <p className="font-bold text-lg text-gray-900">= מחיר סופי לתשלום</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 תשלום</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                כל התשלומים מעובדים באמצעות Stripe, פלטפורמת תשלומים בטוחה ומוכרת. אנו לא שומרים פרטי כרטיס אשראי שלך.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 החזרים וביטולים</h3>
              <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>חשוב לדעת:</strong> אנו שואפים לספק חוויית קנייה הוגנת, אך בשל אופי העסקאות (יד שנייה), מדיניות ההחזרות תלויה בנסיבות הספציפיות:
                </p>
                <ul className="list-disc mr-6 space-y-2 text-gray-700">
                  <li><strong>איסוף עצמי:</strong> תשלום ישיר למוכר - תיאום החזר ביניכם</li>
                  <li><strong>משלוח:</strong> ניתן לבקש החזר במקרים של אי התאמה משמעותית או פגם שלא דווח</li>
                  <li>יש לפנות לשירות הלקוחות תוך 48 שעות מקבלת המוצר</li>
                  <li>החזרים יאושרו על פי שיקול דעתנו ובכפוף לבדיקת התיעוד</li>
                </ul>
              </div>
            </section>

            {/* 7. אחריות והגבלת אחריות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. אחריות והגבלת אחריות</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 תפקיד הפלטפורמה</h3>
              <div className="bg-gray-50 border-r-4 border-gray-400 p-5 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>פריטי משמשת כפלטפורמה מתווכת בלבד.</strong> אנו מספקים את התשתית הטכנולוגית לחיבור בין קונים למוכרים, אך אין אנו צד לעסקאות המתבצעות בין המשתמשים. העסקה היא ישירות בין המוכר לקונה.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 אחריות על תוכן ואיכות</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו לא נושאים באחריות ל:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>איכות, מצב, או תיאור של פריטים הנמכרים באתר</li>
                <li>נכונות, דיוק, או שלמות המידע שמספקים המשתמשים</li>
                <li>יכולתם של מוכרים למסור את הפריטים או של קונים לשלם</li>
                <li>מעשים או מחדלים של משתמשים באתר</li>
                <li>סכסוכים בין קונים למוכרים</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 אחריות על מוצרי יד שנייה</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                יש לזכור כי מדובר במוצרי יד שנייה, ולכן:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700">
                <li>אין אחריות של היצרן על הפריטים</li>
                <li>הפריטים נמכרים "כמות שהם" (AS-IS)</li>
                <li>על הקונה לבדוק את הפריט ולוודא התאמתו לצרכיו</li>
                <li>אנו ממליצים לבדוק את הפריט לפני הרכישה (באיסוף עצמי)</li>
              </ul>
            </section>

            {/* 8. קניין רוחני */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. קניין רוחני</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                כל התוכן, העיצוב, הלוגואים, הטקסטים, הגרפיקה, הקוד והממשק של הפלטפורמה הם רכושה הבלעדי של פריטי ומוגנים בזכויות יוצרים. אסור להעתיק, לשכפל, להפיץ או לעשות כל שימוש מסחרי בהם ללא אישור בכתב.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>תוכן שהועלה על ידי משתמשים:</strong> כאשר אתה מעלה תמונות או תוכן אחר לאתר, אתה מעניק לנו רישיון לא בלעדי, חינמי, וכלל עולמי להשתמש בתוכן זה לצורכי הצגתו באתר, שיווק השירות, וקידום הפלטפורמה.
              </p>
            </section>

            {/* 9. פרטיות ומידע אישי */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. פרטיות ומידע אישי</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                השימוש במידע האישי שלך כפוף למדיניות הפרטיות שלנו. אנו מתחייבים לשמור על פרטיותך ולא למכור או לחלוק את המידע שלך עם צדדים שלישיים, למעט במקרים הנדרשים על פי חוק או לצורך מתן השירות (כגון עיבוד תשלומים דרך Stripe).
              </p>
              <p className="text-gray-700 leading-relaxed">
                על ידי שימוש באתר, אתה מסכים לאיסוף, שימוש ואחסון של המידע שלך בהתאם למדיניות הפרטיות.
              </p>
            </section>

            {/* 10. תקשורת ומסרים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. תקשורת ומסרים</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                על ידי שימוש באתר, אתה מסכים לקבל הודעות אלקטרוניות מאיתנו, כולל:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>הודעות על סטטוס המודעות שלך</li>
                <li>עדכונים על עסקאות ורכישות</li>
                <li>מידע על שינויים בתנאי השימוש</li>
                <li>ניוזלטר ועדכונים שיווקיים (ניתן לבטל בכל עת)</li>
              </ul>
            </section>

            {/* 11. יישוב סכסוכים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. יישוב סכסוכים</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 סכסוכים בין משתמשים</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                במקרה של סכסוך בין קונה למוכר, מומלץ לנסות לפתור את הבעיה בתקשורת ישירה ובמעורבות שירות הלקוחות שלנו. אנו נעשה מאמץ לסייע בפתרון סכסוכים, אך אין אנו מחויבים לעשות זאת ואין אנו נושאים באחריות לתוצאה.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 הליכים משפטיים</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                כל סכסוך משפטי הנובע משימוש באתר יהיה כפוף לחוקי מדינת ישראל, ולסמכות השיפוט הבלעדית של בתי המשפט המוסמכים בישראל.
              </p>
            </section>

            {/* 12. הפסקת חשבון וחסימת משתמשים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. הפסקת חשבון וחסימת משתמשים</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו שומרים לעצמנו את הזכות להשעות, להגביל או לחסום משתמשים ולהסיר תוכן בכל עת וללא הודעה מוקדמת, במקרים הבאים:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>הפרה של תנאי השימוש</li>
                <li>פעילות בלתי חוקית או מפרה</li>
                <li>ניסיון לרמאות או להונות משתמשים אחרים</li>
                <li>התנהגות פוגענית או מטרידה</li>
                <li>פעילות החשודה כפוגעת באבטחת האתר</li>
                <li>תלונות חוזרות ממשתמשים אחרים</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                במקרה של חסימה, לא תהיה זכאי להחזר כספי על עמלות ששולמו.
              </p>
            </section>

            {/* 13. שינויים בתנאי השימוש */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. שינויים בתנאי השימוש</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו שומרים לעצמנו את הזכות לעדכן ולשנות את תנאי השימוש מעת לעת. כל שינוי מהותי יפורסם באתר עם ציון תאריך העדכון. המשך שימוש באתר לאחר השינוי מהווה הסכמה לתנאים המעודכנים.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  <strong>אחריות המשתמש:</strong> עליך לעיין בתנאי השימוש מעת לעת כדי להתעדכן בשינויים. אנו נשלח הודעה במידת האפשר על שינויים משמעותיים.
                </p>
              </div>
            </section>

            {/* 14. שונות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. שונות</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.1 תנאים ניתקים</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אם יקבע כי איזה מתנאי השימוש אינו תקף או בלתי ניתן לאכיפה, התנאי הנותר יישאר בתוקפו המלא.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.2 ויתור</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אי אכיפה של זכות או תנאי כלשהו מתנאי השימוש לא תהווה ויתור על אותה זכות או תנאי.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">14.3 העברת זכויות</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אינך רשאי להעביר או להמחות את זכויותיך או התחייבויותיך מכוח תנאי שימוש אלה. אנו רשאים להעביר את זכויותינו לכל גוף או אדם אחר.
              </p>
            </section>

            {/* 15. יצירת קשר */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. יצירת קשר</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  במידה ויש לך שאלות, הערות או בקשות בנוגע לתנאי השימוש, אנא צור איתנו קשר:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>📧 אימייל:</strong> support@pritti.co.il</p>
                  <p><strong>📞 טלפון:</strong> 03-1234567</p>
                  <p><strong>🌐 אתר:</strong> <a href="/" className="text-blue-600 hover:underline">www.pritti.co.il</a></p>
                </div>
              </div>
            </section>

            {/* הצהרת סיום */}
            <section className="mb-10">
              <div className="bg-gray-800 text-white p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-4">תודה שבחרת בפריטי!</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  אנו מחויבים לספק לך חוויית קנייה ומכירה בטוחה, פשוטה ומהנה. 
                  תנאי השימוש נועדו להגן עליך ועל כלל המשתמשים שלנו.
                </p>
                <p className="text-gray-400 text-sm">
                  בעל רישיון לתפעול הפלטפורמה: Pritti Ltd. | ע.מ. 123456789
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

