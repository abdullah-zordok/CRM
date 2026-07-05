import Link from "next/link";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  Facebook,
  Instagram,
  LineChart,
  Linkedin,
  Megaphone,
  PhoneCall,
  PlayCircle,
  Send,
  Target,
  Trophy,
  Twitter,
  UserCheck,
  Users,
} from "lucide-react";

const trustPoints = ["تجربة مجانية 14 يوم", "لا تحتاج بطاقة ائتمانية", "إلغاء في أي وقت"];

const stats = [
  { value: "+1,000", label: "عميل نشط", icon: Users, tone: "violet" },
  { value: "+20", label: "مندوب مبيعات", icon: UserCheck, tone: "green" },
  { value: "+95%", label: "تحسين في المتابعة", icon: LineChart, tone: "orange" },
  { value: "+35%", label: "زيادة في المبيعات", icon: Trophy, tone: "blue" },
] as const;

const features = [
  ["إدارة العملاء المحتملين", "استقبل الليدز من جميع المصادر ونظمها في مكان واحد.", Users, "violet"],
  ["توزيع الليدز على المناديب", "وزّع العملاء المحتملين على فريق المبيعات بسهولة ووضوح.", UserCheck, "green"],
  ["متابعة المكالمات والزيارات", "سجّل كل مكالمة أو زيارة وتابع حالة كل عميل.", PhoneCall, "orange"],
  ["تقارير وتحليلات", "اعرف أداء المبيعات والمناديب من خلال تقارير واضحة.", BarChart3, "blue"],
  ["إدارة العملاء", "احتفظ ببيانات العملاء وتاريخ التعامل معهم في مكان واحد.", Users, "pink"],
  ["تنبيهات المتابعة", "لا تفوّت أي متابعة مهمة مع العملاء.", Bell, "purple"],
] as const;

const steps = [
  ["استقبال العملاء المحتملين", "من نماذج الموقع، الإعلانات، أو الإدخال اليدوي.", Megaphone],
  ["توزيعها على المناديب", "يتم توزيع الليدز تلقائيًا أو يدويًا على فريق المبيعات.", UserCheck],
  ["متابعة كل خطوة", "تابع المكالمات، الزيارات، المهام، وحالة العميل لحظة بلحظة.", ClipboardList],
  ["إغلاق الصفقات", "حوّل العملاء المحتملين إلى عملاء فعليين وراقب قيمة الصفقات.", Trophy],
] as const;

const kpis = [
  ["إجمالي العملاء المحتملين", "1,240", "+9% هذا الشهر"],
  ["الصفقات النشطة", "320", "+6% هذا الشهر"],
  ["إجمالي المبيعات", "SAR 285,430", "+15% هذا الشهر"],
  ["المناديب النشطين", "28", "+2% هذا الشهر"],
] as const;

export default function HomePage() {
  return (
    <div className="landing-page" lang="ar" dir="rtl">
      <a className="skip-link" href="#main-content">
        تخطي إلى المحتوى
      </a>
      <header className="landing-nav">
        <Link className="landing-brand" href="/" aria-label="SalesCRM الصفحة الرئيسية">
          <span className="landing-brand__icon" aria-hidden="true">
            <BarChart3 size={22} />
          </span>
          <span>
            Sales<span>CRM</span>
          </span>
        </Link>
        <nav className="landing-nav__links" aria-label="روابط الصفحة">
          <a href="#features">المميزات</a>
          <a href="#how-it-works">كيف يعمل</a>
          <a href="#pricing">الأسعار</a>
          <a href="#about">من نحن</a>
        </nav>
        <div className="landing-nav__actions">
          <Link className="landing-button landing-button--ghost" href="/login">
            تسجيل الدخول
          </Link>
          <Link className="landing-button landing-button--primary" href="/register">
            ابدأ الآن
          </Link>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-hero" id="about">
          <div className="landing-hero__copy">
            <p className="landing-pill">
              <Target size={16} aria-hidden="true" />
              نظام CRM متكامل لإدارة المبيعات
            </p>
            <h1>نظّم مبيعاتك، تابع عملاءك، وراقب أداء فريقك من مكان واحد</h1>
            <p className="landing-hero__lead">
              منصة CRM تساعدك على إدارة العملاء المحتملين، توزيع المهام على المناديب،
              متابعة حالات البيع، وتحليل أداء الفريق بسهولة ووضوح.
            </p>
            <div className="landing-hero__actions">
              <Link className="landing-button landing-button--primary landing-button--large" href="/register">
                ابدأ الآن مجانًا
                <Send size={18} aria-hidden="true" />
              </Link>
              <a className="landing-button landing-button--secondary landing-button--large" href="#how-it-works">
                شاهد كيف يعمل
                <PlayCircle size={18} aria-hidden="true" />
              </a>
            </div>
            <ul className="landing-trust" aria-label="مزايا الاشتراك">
              {trustPoints.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <DashboardMockup />
        </section>

        <section className="landing-stats" aria-label="أرقام المنصة">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article className="landing-stat" key={stat.label}>
                <span className={`landing-icon landing-icon--${stat.tone}`}>
                  <Icon size={28} aria-hidden="true" />
                </span>
                <div>
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="landing-section" id="features">
          <div className="landing-section__heading">
            <h2>مميزات قوية تساعدك على النجاح</h2>
          </div>
          <div className="landing-features">
            {features.map(([title, description, Icon, tone]) => (
              <article className="landing-feature-card" key={title}>
                <span className={`landing-icon landing-icon--${tone}`}>
                  <Icon size={30} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="how-it-works">
          <div className="landing-section__heading">
            <h2>كيف يعمل النظام؟</h2>
          </div>
          <ol className="landing-steps">
            {steps.map(([title, description, Icon], index) => (
              <li className="landing-step" key={title}>
                <span className="landing-step__icon">
                  <Icon size={31} aria-hidden="true" />
                  <b>{index + 1}</b>
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-final-cta" id="pricing">
          <div className="landing-final-cta__visual" aria-hidden="true">
            <div className="landing-donut" />
            <div className="landing-mini-card">
              <span>مبيعات هذا الشهر</span>
              <strong>SAR 285,430</strong>
              <small>+15% عن الشهر الماضي</small>
            </div>
          </div>
          <div className="landing-final-cta__copy">
            <h2>جاهز تنقل إدارة المبيعات لمستوى أفضل؟</h2>
            <p>انضم إلى الشركات التي تعتمد على نظامنا لإدارة مبيعاتها وزيادة أرباحها.</p>
            <div className="landing-final-cta__actions">
              <Link className="landing-button landing-button--light" href="/register">
                أنشئ حسابك الآن
              </Link>
              <Link className="landing-button landing-button--outline-light" href="/contact">
                تواصل معنا
              </Link>
            </div>
            <ul className="landing-trust landing-trust--light" aria-label="مزايا الاشتراك">
              {trustPoints.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <Link className="landing-brand" href="/" aria-label="SalesCRM الصفحة الرئيسية">
            <span className="landing-brand__icon" aria-hidden="true">
              <BarChart3 size={22} />
            </span>
            <span>
              Sales<span>CRM</span>
            </span>
          </Link>
          <p>منصة CRM عربية تساعد فرق المبيعات على إدارة العملاء والفرص والمتابعة من مكان واحد.</p>
        </div>
        <nav className="landing-footer__links" aria-label="روابط التذييل">
          <a href="#about">من نحن</a>
          <a href="#pricing">الأسعار</a>
          <a href="#features">المدونة</a>
          <a href="#pricing">الشروط والأحكام</a>
          <a href="#pricing">سياسة الخصوصية</a>
        </nav>
        <div className="landing-social" aria-label="روابط التواصل الاجتماعي">
          <a href="#about" aria-label="LinkedIn">
            <Linkedin size={19} />
          </a>
          <a href="#about" aria-label="Facebook">
            <Facebook size={19} />
          </a>
          <a href="#about" aria-label="Twitter">
            <Twitter size={19} />
          </a>
          <a href="#about" aria-label="Instagram">
            <Instagram size={19} />
          </a>
        </div>
      </footer>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="landing-dashboard" aria-label="معاينة لوحة التحكم">
      <aside className="landing-dashboard__sidebar" aria-hidden="true">
        <div className="landing-dashboard__logo">
          <BarChart3 size={18} />
          <span>SalesCRM</span>
        </div>
        {["الرئيسية", "العملاء المحتملين", "العملاء", "المهام", "التقارير"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </aside>
      <div className="landing-dashboard__main">
        <div className="landing-dashboard__topbar">
          <div className="landing-search">ابحث عن عميل أو ليد...</div>
          <div className="landing-user">
            <span>أحمد محمد</span>
            <b>مدير المبيعات</b>
          </div>
        </div>
        <div className="landing-kpis">
          {kpis.map(([label, value, change]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{change}</small>
            </article>
          ))}
        </div>
        <div className="landing-dashboard__bottom">
          <section className="landing-chart-card" aria-label="أداء المبيعات">
            <div>
              <h2>أداء المبيعات</h2>
              <span>آخر 6 أشهر</span>
            </div>
            <div className="landing-chart" aria-hidden="true">
              {["38%", "62%", "51%", "74%", "58%", "83%"].map((height) => (
                <span key={height} style={{ blockSize: height }} />
              ))}
            </div>
          </section>
          <section className="landing-task-card" aria-label="مهام اليوم">
            <h2>مهام اليوم</h2>
            <ul>
              {["اتصال مع عميل", "متابعة عرض سعر", "زيارة عميل", "إرسال عرض"].map((task) => (
                <li key={task}>
                  <span />
                  {task}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
