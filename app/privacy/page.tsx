import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              מדיניות פרטיות
            </h1>
            <p className="text-gray-600 text-lg">
              מדיניות הפרטיות של פלטפורמת Pritti
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
              <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  פריטי (להלן: "אנחנו", "שלנו" או "הפלטפורמה") מחויבת להגן על פרטיותך ועל המידע האישי שלך. מדיניות פרטיות זו מסבירה איזה מידע אנו אוספים, כיצד אנו משתמשים בו, ומה הזכויות שלך.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                השימוש בשירותי הפלטפורמה מהווה הסכמה לאיסוף ושימוש במידע כמפורט במדיניות זו. אם אינך מסכים למדיניות זו, אנא הימנע משימוש באתר.
              </p>
            </section>

            {/* 2. מידע שאנו אוספים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. מידע שאנו אוספים</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 מידע שאתה מספק לנו</h3>
              <p className="text-gray-700 leading-relaxed mb-4">כאשר אתה משתמש בשירותינו, אתה עשוי לספק לנו:</p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li><strong>פרטי יצירת קשר:</strong> שם מלא, כתובת אימייל, מספר טלפון</li>
                <li><strong>פרטי מיקום:</strong> עיר, שכונה, כתובת למשלוח</li>
                <li><strong>פרטי פריטים למכירה:</strong> תיאור, תמונות, מחיר, מצב הפריט</li>
                <li><strong>פרטי תשלום:</strong> מועברים ומאוחסנים אצל Stripe (לא אצלנו)</li>
                <li><strong>תקשורת:</strong> הודעות, תלונות, פניות לשירות לקוחות</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 מידע שנאסף באופן אוטומטי</h3>
              <p className="text-gray-700 leading-relaxed mb-4">כאשר אתה משתמש באתר, אנו עשויים לאסוף אוטומטית:</p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, סוג מכשיר</li>
                <li><strong>נתוני שימוש:</strong> דפים שביקרת, זמן ביקור, קישורים שלחצת עליהם</li>
                <li><strong>Cookies:</strong> קבצי עוגיות לשיפור חוויית המשתמש (ראה סעיף 5)</li>
                <li><strong>נתוני ביצועים:</strong> מהירות טעינת דפים, שגיאות, ביצועי האתר</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 מידע מצדדים שלישיים</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו עשויים לקבל מידע מספקי שירות חיצוניים:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700">
                <li><strong>Stripe:</strong> אישור תשלומים וסטטוס עסקאות (ללא פרטי כרטיס אשראי)</li>
                <li><strong>Supabase:</strong> שירותי אחסון ובסיס נתונים</li>
                <li><strong>Vercel:</strong> שירותי אירוח ואנליטיקס</li>
              </ul>
            </section>

            {/* 3. כיצד אנו משתמשים במידע */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. כיצד אנו משתמשים במידע</h2>
              <p className="text-gray-700 leading-relaxed mb-4">אנו משתמשים במידע שנאסף למטרות הבאות:</p>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">✅ מתן השירות</h4>
                  <ul className="list-disc mr-6 space-y-1 text-gray-700 text-sm">
                    <li>פרסום ומודרציה של מודעות</li>
                    <li>עיבוד עסקאות ורכישות</li>
                    <li>תיאום משלוחים ואיסופים</li>
                    <li>מענה לפניות ותמיכה</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">📧 תקשורת</h4>
                  <ul className="list-disc mr-6 space-y-1 text-gray-700 text-sm">
                    <li>שליחת הודעות על סטטוס מודעות</li>
                    <li>עדכונים על עסקאות</li>
                    <li>ניוזלטר ועדכוני מוצרים חדשים</li>
                    <li>הודעות שירותיות וטכניות</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-2">🔒 אבטחה ומניעת הונאות</h4>
                  <ul className="list-disc mr-6 space-y-1 text-gray-700 text-sm">
                    <li>זיהוי וחסימת פעילות חשודה</li>
                    <li>מניעת שימוש בלתי מורשה</li>
                    <li>אכיפת תנאי השימוש</li>
                    <li>בדיקת מהימנות משתמשים</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-900 mb-2">📊 שיפור השירות</h4>
                  <ul className="list-disc mr-6 space-y-1 text-gray-700 text-sm">
                    <li>ניתוח דפוסי שימוש</li>
                    <li>שיפור חוויית המשתמש</li>
                    <li>פיתוח תכונות חדשות</li>
                    <li>אופטימיזציה של ביצועי האתר</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. שיתוף מידע עם צדדים שלישיים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              
              <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>חשוב:</strong> אנו לא מוכרים את המידע האישי שלך לצדדים שלישיים למטרות שיווק.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">אנו עשויים לשתף מידע במקרים הבאים:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 ספקי שירות</h3>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Stripe:</strong> עיבוד תשלומים בטוח</li>
                <li><strong>Supabase:</strong> אחסון נתונים ומערכת ניהול</li>
                <li><strong>Vercel:</strong> אירוח האתר ושירותי תשתית</li>
                <li><strong>שירותי משלוחים:</strong> במידה ונשתמש בחברות משלוחים חיצוניות</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 דרישות חוקיות</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                נחשוף מידע כאשר נדרש על פי חוק, צו בית משפט, או הליך משפטי, או כאשר יש לנו סיבה סבירה להאמין שהגילוי נחוץ כדי:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li>לציית לחוק או לדרישה חוקית</li>
                <li>להגן על זכויותינו או רכושנו</li>
                <li>למנוע פעילות בלתי חוקית</li>
                <li>להגן על בטיחות משתמשים או הציבור</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 העברה עסקית</h3>
              <p className="text-gray-700 leading-relaxed">
                במקרה של מיזוג, רכישה, או מכירת נכסים, המידע שלך עשוי להיות מועבר לגוף הרוכש כחלק מהעסקה.
              </p>
            </section>

            {/* 5. Cookies ועוגיות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies ועוגיות</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו משתמשים בקבצי Cookies (עוגיות) כדי לשפר את חוויית השימוש שלך באתר. Cookies הם קבצי טקסט קטנים הנשמרים במכשיר שלך.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">סוגי Cookies שבהם אנו משתמשים:</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">🔒 Cookies הכרחיים</p>
                  <p className="text-gray-600 text-sm">נדרשים לפעולת האתר הבסיסית (כניסה, סל קניות, אבטחה)</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">📊 Cookies אנליטיים</p>
                  <p className="text-gray-600 text-sm">עוזרים לנו להבין כיצד משתמשים מתקשרים עם האתר</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">🎯 Cookies פונקציונליים</p>
                  <p className="text-gray-600 text-sm">שומרים העדפות ומאפשרים תכונות מתקדמות</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>ניהול Cookies:</strong> רוב הדפדפנים מאפשרים לך לשלוט על Cookies דרך ההגדרות. שים לב שחסימת Cookies מסוימים עשויה להשפיע על פונקציונליות האתר.
              </p>
            </section>

            {/* 6. אבטחת מידע */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. אבטחת מידע</h2>
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  אנו נוקטים באמצעי אבטחה טכניים, ארגוניים ופיזיים כדי להגן על המידע שלך מפני גישה לא מורשית, אובדן, שינוי או גילוי.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">אמצעי האבטחה שלנו כוללים:</h3>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li><strong>הצפנת HTTPS:</strong> כל התקשורת עם האתר מוצפנת</li>
                <li><strong>אבטחת בסיס נתונים:</strong> Row Level Security (RLS) ב-Supabase</li>
                <li><strong>אימות מאובטח:</strong> הצפנת סיסמאות ואימות דו-שלבי (במידת הצורך)</li>
                <li><strong>גישה מוגבלת:</strong> רק אנשי צוות מורשים יכולים לגשת למידע רגיש</li>
                <li><strong>ניטור אבטחה:</strong> מעקב אחר פעילות חשודה</li>
                <li><strong>גיבויים:</strong> גיבויים קבועים למניעת אובדן מידע</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  <strong>חשוב לזכור:</strong> למרות אמצעי האבטחה שלנו, אף שיטת העברה או אחסון באינטרנט אינה בטוחה ב-100%. אנו עושים את מיטב המאמצים להגן על המידע שלך, אך לא ניתן להבטיח אבטחה מוחלטת.
                </p>
              </div>
            </section>

            {/* 7. זכויות המשתמש */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. זכויות המשתמש</h2>
              <p className="text-gray-700 leading-relaxed mb-4">בהתאם לחוק הגנת הפרטיות, יש לך את הזכויות הבאות:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">👁️ זכות עיון</h4>
                  <p className="text-gray-700 text-sm">לדעת איזה מידע אנו מחזיקים עליך</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-2">✏️ זכות תיקון</h4>
                  <p className="text-gray-700 text-sm">לעדכן או לתקן מידע שגוי</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-bold text-red-900 mb-2">🗑️ זכות מחיקה</h4>
                  <p className="text-gray-700 text-sm">לבקש מחיקת המידע שלך</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">📦 זכות להעברה</h4>
                  <p className="text-gray-700 text-sm">לקבל את המידע שלך בפורמט נפוץ</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-900 mb-2">🚫 זכות התנגדות</h4>
                  <p className="text-gray-700 text-sm">להתנגד לשימושים מסוימים במידע שלך</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">⚙️ זכות הגבלה</h4>
                  <p className="text-gray-700 text-sm">לבקש הגבלת עיבוד המידע</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg mt-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>כיצד להפעיל את זכויותיך:</strong> לממש את הזכויות שלך, צור איתנו קשר בכתובת support@pritti.co.il. נטפל בבקשתך תוך 30 יום.
                </p>
              </div>
            </section>

            {/* 8. שמירת מידע */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. תקופת שמירת מידע</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו שומרים את המידע האישי שלך כל עוד הוא נחוץ למטרות שלשמן נאסף, או כפי שנדרש על פי חוק:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700 mb-4">
                <li><strong>פרטי חשבון:</strong> כל עוד החשבון פעיל + תקופת שמירה סטטוטורית</li>
                <li><strong>נתוני עסקאות:</strong> 7 שנים (דרישות מס ורגולציה)</li>
                <li><strong>נתוני שימוש:</strong> עד 24 חודשים</li>
                <li><strong>Cookies:</strong> עד 12 חודשים (בהתאם לסוג)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                לאחר תקופה זו, נמחק או נאנונים את המידע, אלא אם נדרשים לשמור אותו על פי חוק.
              </p>
            </section>

            {/* 9. קטינים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. פרטיות קטינים</h2>
              <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>חשוב:</strong> השירות שלנו מיועד למשתמשים בני 18 ומעלה בלבד.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  אנו לא אוספים מידע ביודעין מקטינים מתחת לגיל 18. אם גילית שקטין סיפק לנו מידע אישי, אנא צור איתנו קשר ונמחק אותו מיד.
                </p>
              </div>
            </section>

            {/* 10. קישורים לאתרים אחרים */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. קישורים לאתרים חיצוניים</h2>
              <p className="text-gray-700 leading-relaxed">
                האתר שלנו עשוי להכיל קישורים לאתרים חיצוניים (כמו WhatsApp, Stripe וכו'). אנו לא אחראים על מדיניות הפרטיות או התוכן של אתרים אלה. אנו ממליצים לקרוא את מדיניות הפרטיות של כל אתר שלישי שאתה מבקר בו.
              </p>
            </section>

            {/* 11. העברת מידע בינלאומית */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. העברת מידע בינלאומית</h2>
              <p className="text-gray-700 leading-relaxed">
                המידע שלך עשוי להיות מאוחסן ומעובד בשרתים הממוקמים מחוץ לישראל, כולל בארצות הברית ובאיחוד האירופי (דרך ספקי השירות שלנו - Supabase, Vercel, Stripe). אנו מוודאים שכל העברה כזו נעשית בהתאם לסטנדרטים הגבוהים ביותר של אבטחת מידע.
              </p>
            </section>

            {/* 12. שינויים במדיניות הפרטיות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. שינויים במדיניות הפרטיות</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                אנו שומרים לעצמנו את הזכות לעדכן את מדיניות הפרטיות מעת לעת. כל שינוי מהותי יפורסם באתר עם ציון תאריך העדכון. נשלח הודעה במידת האפשר על שינויים משמעותיים.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  <strong>המלצה:</strong> אנא בדוק דף זה מעת לעת כדי להישאר מעודכן. המשך שימוש באתר לאחר עדכון מהווה הסכמה למדיניות המעודכנת.
                </p>
              </div>
            </section>

            {/* 13. יצירת קשר ופניות */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. יצירת קשר</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  במידה ויש לך שאלות, הערות או בקשות בנוגע למדיניות הפרטיות או הזכויות שלך:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>📧 אימייל:</strong> support@pritti.co.il</p>
                  <p><strong>📞 טלפון:</strong> 03-1234567</p>
                  <p><strong>🏢 כתובת:</strong> רח' ראשית 123, תל אביב, ישראל</p>
                  <p className="mt-4 pt-4 border-t border-blue-300">
                    <strong>רשות הגנת הפרטיות:</strong> יש לך גם את הזכות להגיש תלונה לרשות הגנת הפרטיות בישראל
                  </p>
                </div>
              </div>
            </section>

            {/* הצהרת סיום */}
            <section className="mb-10">
              <div className="bg-gray-800 text-white p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-4">הפרטיות שלך חשובה לנו</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  אנו מחויבים להגן על הפרטיות שלך ולשמור על המידע שלך מאובטח. 
                  תודה שאתה סומך עלינו.
                </p>
                <p className="text-gray-400 text-sm">
                  Pritti Ltd. | ע.מ. 123456789 | רשום בישראל
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

