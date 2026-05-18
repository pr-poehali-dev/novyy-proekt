import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ── Smooth scroll helper ──────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Progress Bar ──────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setPct((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: "transparent" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--pc-accent), var(--pc-accent-light))", transition: "width 0.1s linear", borderRadius: "0 2px 2px 0" }} />
    </div>
  );
}

// ── Demo Modal ────────────────────────────────────────
function DemoModal({ onClose, title }: { onClose: () => void; title: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,10,20,0.85)", backdropFilter: "blur(8px)" }} />
      <div style={{ background: "var(--pc-surface)", border: "1px solid rgba(37,99,235,0.35)", borderRadius: 14, padding: "36px 32px", width: "100%", maxWidth: 480, position: "relative", zIndex: 1, boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--pc-text-muted)" }}>
          <Icon name="X" size={20} />
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,200,100,0.12)", border: "2px solid rgba(0,200,100,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="CheckCircle" size={30} style={{ color: "#00c864" }} />
            </div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--pc-text)", marginBottom: 10 }}>Заявка отправлена!</h3>
            <p style={{ fontSize: 14, color: "var(--pc-text-muted)", lineHeight: 1.7 }}>
              Мы свяжемся с вами в течение 1 рабочего дня на <strong style={{ color: "var(--pc-text)" }}>{email}</strong>
            </p>
            <button className="pc-btn-primary" onClick={onClose} style={{ marginTop: 24, padding: "10px 28px" }}>Закрыть</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="ShieldCheck" size={20} style={{ color: "var(--pc-accent)" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--pc-text)" }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--pc-text-muted)" }}>Ответим в течение 1 рабочего дня</div>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Ваше имя *", val: name, set: setName, ph: "Иванов Иван Иванович", type: "text" },
                { label: "Email *", val: email, set: setEmail, ph: "ivan@company.ru", type: "email" },
                { label: "Компания / ИП", val: company, set: setCompany, ph: "ООО «Ромашка»", type: "text" },
                { label: "Телефон", val: phone, set: setPhone, ph: "+7 (___) ___-__-__", type: "tel" },
              ].map(({ label, val, set, ph, type }) => (
                <div key={label}>
                  <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
                  <input
                    type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} required={label.includes("*")}
                    style={{ width: "100%", background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 6, padding: "10px 14px", color: "var(--pc-text)", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'IBM Plex Sans', sans-serif", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(37,99,235,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--pc-border)")}
                  />
                </div>
              ))}
              <button type="submit" className="pc-btn-primary" disabled={loading} style={{ marginTop: 6, padding: "12px 0", opacity: loading ? 0.7 : 1, width: "100%" }}>
                {loading ? "Отправляю..." : "Отправить заявку"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const inc = target / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 1800 / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString("ru")}{suffix}</span>;
}

// ── Accordion Item ─────────────────────────────────────
function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--pc-border)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
        <span style={{ fontSize: 15, color: "var(--pc-text)", fontWeight: 500, lineHeight: 1.4 }}>{q}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: "var(--pc-accent)", flexShrink: 0 }} />
      </button>
      {open && <div style={{ paddingBottom: 18, fontSize: 14, color: "var(--pc-text-muted)", lineHeight: 1.75 }}>{a}</div>}
    </div>
  );
}

export default function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<string | null>(null);

  const openModal = (title: string) => setModal(title);
  const closeModal = () => setModal(null);

  const services = [
    { icon: "ShieldCheck", label: "Проверка контрагентов", desc: "Автоматическая проверка по национальным и международным базам данных" },
    { icon: "FileText", label: "Авто-отчётность", desc: "Формирование и подача отчётов в ФНС, МЧС, ФССП с электронной подписью" },
    { icon: "Globe", label: "Международная защита ИС", desc: "Интеграция с ВОИС — регистрация товарных знаков и патентов за рубежом" },
    { icon: "Brain", label: "ИИ-анализ рисков", desc: "Прогнозирование правовых угроз и персональные рекомендации по снижению рисков" },
    { icon: "Building2", label: "Взаимодействие с госорганами", desc: "Прямые каналы с МЧС, ФНС, ФССП, Росреестром, Интерполом, Европолом" },
    { icon: "Lock", label: "Информационная безопасность", desc: "AES-256, TLS 1.3, OAuth 2.0 + 2FA, GDPR, ФЗ-152, ISO 27001, PCI DSS" },
  ];

  const govOrgs = [
    { name: "ФНС", full: "Федеральная налоговая служба", icon: "Receipt" },
    { name: "МЧС", full: "Министерство чрезвычайных ситуаций", icon: "Flame" },
    { name: "ФССП", full: "Служба судебных приставов", icon: "Scale" },
    { name: "Росреестр", full: "Росреестр", icon: "MapPin" },
    { name: "Интерпол", full: "Международная полиция", icon: "Globe" },
    { name: "Европол", full: "Европейское полицейское ведомство", icon: "Globe2" },
    { name: "ВОИС", full: "Всемирная организация интеллектуальной собственности", icon: "BookMarked" },
    { name: "ВТО", full: "Всемирная торговая организация", icon: "Landmark" },
  ];

  const plans = [
    {
      name: "Старт",
      sub: "Для ИП",
      price: "2 900",
      period: "₽/мес",
      features: ["До 3 пользователей", "Проверка контрагентов (50/мес)", "Автоотчётность в ФНС", "ИИ-анализ рисков (базовый)", "Email-поддержка"],
      cta: "Начать бесплатно",
      highlight: false,
    },
    {
      name: "Бизнес",
      sub: "Для МСП",
      price: "9 900",
      period: "₽/мес",
      features: ["До 25 пользователей", "Проверка контрагентов (безлимит)", "Все госорганы РФ", "Международная защита ИС (ВОИС)", "ИИ-анализ рисков (полный)", "Приоритетная поддержка 24/7"],
      cta: "Попробовать 14 дней",
      highlight: true,
    },
    {
      name: "Корпорат",
      sub: "Для крупного бизнеса",
      price: "По запросу",
      period: "",
      features: ["Неограниченные пользователи", "API-интеграция", "Интерпол / Европол", "Кастомные интеграции", "Выделенный менеджер", "SLA 99.9%, ISO 27001"],
      cta: "Связаться",
      highlight: false,
    },
  ];

  const results = [
    { year: "Год 1", users: "10 000", revenue: "15 млн ₽", lawyers: "−20%", reports: "−30%" },
    { year: "Год 2", users: "50 000", revenue: "60 млн ₽", lawyers: "−35%", reports: "−50%" },
    { year: "Год 3", users: "200 000", revenue: "115 млн ₽", lawyers: "−50%", reports: "−70%" },
  ];

  const faqs = [
    { q: "Как платформа интегрируется с ФНС и другими госорганами?", a: "Через официальные API государственных информационных систем (ГИС). Все запросы подписываются квалифицированной электронной подписью (КЭП) и передаются по защищённым каналам TLS 1.3." },
    { q: "Соответствует ли платформа требованиям ФЗ-152 о персональных данных?", a: "Да. Данные хранятся на серверах в РФ, обработка соответствует ФЗ-152, GDPR и ISO 27001. Весь аудит действий фиксируется в защищённом журнале." },
    { q: "Как работает ИИ-анализ правовых рисков?", a: "Модель обучена на нормативной базе РФ и международных стандартах. Анализирует контрагентов, историю нарушений, судебные дела и даёт персональный рейтинг риска с рекомендациями." },
    { q: "Можно ли подавать заявки на товарный знак через ВОИС?", a: "Да, тариф «Бизнес» и выше включает прямую интеграцию с ВОИС (Madrid System). Платформа формирует и подаёт документы автоматически." },
    { q: "Как быстро можно подключить платформу?", a: "Базовое подключение — от 1 рабочего дня. Корпоративная интеграция с кастомными системами — от 5 дней. Технический онбординг включён во все тарифы." },
  ];

  return (
    <div style={{ background: "var(--pc-bg)", color: "var(--pc-text)", minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <ScrollProgress />
      {modal && <DemoModal title={modal} onClose={closeModal} />}

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid var(--pc-border)", background: "rgba(5,10,20,0.96)", backdropFilter: "blur(16px)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--pc-accent), var(--pc-accent-2))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="ShieldCheck" size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.05em", lineHeight: 1.1 }}>
                PLANET<span style={{ color: "var(--pc-accent)" }}>CARE</span> AI
              </div>
              <div style={{ fontSize: 10, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em" }}>БЕЗОПАСНОСТЬ БИЗНЕСА</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[["Решения", "services"], ["Интеграции", "integrations"], ["Тарифы", "pricing"], ["О платформе", "about"]].map(([label, id]) => (
              <button key={label} onClick={() => scrollTo(id)} style={{ fontSize: 14, color: "var(--pc-text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pc-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pc-text-muted)")}
              >{label}</button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="pc-btn-outline hidden md:block" style={{ padding: "9px 22px", fontSize: 13 }} onClick={() => openModal("Войти в платформу")}>Войти</button>
            <button className="pc-btn-primary" style={{ padding: "9px 22px", fontSize: 13 }} onClick={() => openModal("Попробовать бесплатно — 14 дней")}>Попробовать бесплатно</button>
            <button className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pc-text-muted)" }} onClick={() => setMobileOpen(!mobileOpen)}>
              <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)", padding: "16px 24px" }}>
            {[["Решения", "services"], ["Интеграции", "integrations"], ["Тарифы", "pricing"], ["О платформе", "about"]].map(([label, id]) => (
              <button key={label} onClick={() => { scrollTo(id); setMobileOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", fontSize: 15, color: "var(--pc-text-muted)", background: "none", border: "none", borderBottom: "1px solid var(--pc-border)", cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pc-grid-bg" style={{ paddingTop: 150, paddingBottom: 100 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 65%)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--pc-accent), transparent)" }}/>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="animate-fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 4, padding: "6px 14px", marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--pc-accent)", display: "inline-block" }}/>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-accent)", letterSpacing: "0.06em" }}>ЦИФРОВАЯ ПЛАТФОРМА · 2026 · НИКОЛАЕВ В.В.</span>
              </div>

              <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 5.5vw, 62px)", lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 24 }}>
                БЕЗОПАСНОСТЬ<br/>
                <span style={{ color: "var(--pc-accent)" }}>И ПРАВОВАЯ</span><br/>
                ЗАЩИТА БИЗНЕСА
              </h1>

              <p className="animate-fade-in-up delay-200" style={{ color: "var(--pc-text-muted)", fontSize: 16, lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
                Единая платформа для ИП и МСП: автоматическая проверка контрагентов, подача отчётности в госорганы, защита интеллектуальной собственности через ВОИС и ИИ-анализ правовых рисков.
              </p>

              <div className="animate-fade-in-up delay-300 flex gap-4 flex-wrap">
                <button className="pc-btn-primary" style={{ padding: "13px 32px", fontSize: 15 }} onClick={() => openModal("Попробовать бесплатно — 14 дней")}>Попробовать 14 дней бесплатно</button>
                <button className="pc-btn-outline" style={{ padding: "13px 32px", fontSize: 15 }} onClick={() => openModal("Запросить демо платформы")}>Смотреть демо</button>
              </div>

              <div className="animate-fade-in-up delay-400 flex gap-8 mt-10 flex-wrap">
                {[
                  { v: 200000, s: "+", l: "ИП и МСП (прогноз 3 года)" },
                  { v: 50, s: "%", l: "экономия на юристах" },
                  { v: 70, s: "%", l: "быстрее отчётность" },
                ].map(({ v, s, l }) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--pc-accent)", lineHeight: 1 }}>
                      <AnimatedCounter target={v} suffix={s} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginTop: 4, maxWidth: 130 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Shield panel ── */}
            <div className="animate-fade-in-up delay-200 hidden md:block">
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 12, padding: 28, boxShadow: "0 0 60px rgba(37,99,235,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--pc-border)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="ShieldCheck" size={24} style={{ color: "var(--pc-accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "0.04em" }}>СТАТУС ЗАЩИТЫ</div>
                    <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginTop: 2 }}>ООО «ТехноПром» · обновлено только что</div>
                  </div>
                  <div style={{ marginLeft: "auto", padding: "4px 10px", background: "rgba(0,200,100,0.12)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: 4, fontSize: 12, color: "#00c864", fontFamily: "'IBM Plex Mono', monospace" }}>ЗАЩИЩЁН</div>
                </div>

                {[
                  { label: "Контрагенты проверены", val: "47 / 47", ok: true, icon: "UserCheck" },
                  { label: "Отчётность ФНС", val: "Актуальна", ok: true, icon: "Receipt" },
                  { label: "Товарный знак ВОИС", val: "Зарегистрирован", ok: true, icon: "BookMarked" },
                  { label: "ИИ-оценка риска", val: "Низкий · 12%", ok: true, icon: "Brain" },
                  { label: "SSL / Шифрование", val: "AES-256 · TLS 1.3", ok: true, icon: "Lock" },
                  { label: "Аудит-журнал", val: "1 203 записи", ok: true, icon: "ClipboardList" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--pc-border)" }}>
                    <Icon name={row.icon} size={15} style={{ color: row.ok ? "var(--pc-accent)" : "var(--pc-red)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--pc-text-muted)", flex: 1 }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color: row.ok ? "#00c864" : "var(--pc-red)" }}>{row.val}</span>
                  </div>
                ))}

                <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginBottom: 6 }}>Следующая автопроверка через</div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--pc-accent)" }}>23:47:12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ padding: "72px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-red)", letterSpacing: "0.12em", marginBottom: 12 }}>// ПРОБЛЕМА</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, marginBottom: 20, color: "var(--pc-text)" }}>С ЧЕМ СТАЛКИВАЕТСЯ <span style={{ color: "var(--pc-red)" }}>МАЛЫЙ БИЗНЕС</span></h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Незнание международных стандартов безопасности",
                  "Сложности с проверкой иностранных контрагентов",
                  "Ручной сбор и отправка отчётности в госорганы",
                  "Трудности с соблюдением международных договоров",
                  "Проблемы с трансграничной защитой ИС",
                  "Высокие затраты на юристов и консультантов",
                ].map((p) => (
                  <div key={p} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "rgba(255,68,85,0.04)", border: "1px solid rgba(255,68,85,0.12)", borderRadius: 6 }}>
                    <Icon name="AlertTriangle" size={14} style={{ color: "var(--pc-red)", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, color: "var(--pc-text-muted)" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// РЕШЕНИЕ</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, marginBottom: 20, color: "var(--pc-text)" }}>КАК РЕШАЕТ <span style={{ color: "var(--pc-accent)" }}>PLANETCARE AI</span></h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Автоматическая проверка контрагентов по 50+ базам",
                  "Прямые каналы с ФНС, МЧС, ФССП — без бумаг",
                  "ИИ-прогнозирование правовых рисков заранее",
                  "Интеграция с ВОИС — защита ИС за рубежом",
                  "Единая точка входа: все органы в одном окне",
                  "Снижение затрат на юристов до 50% за 3 года",
                ].map((s) => (
                  <div key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 6 }}>
                    <Icon name="CheckCircle" size={14} style={{ color: "var(--pc-accent)", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, color: "var(--pc-text-muted)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "80px 0", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// КЛЮЧЕВЫЕ МОДУЛИ</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
              6 МОДУЛЕЙ <span style={{ color: "var(--pc-accent)" }}>КОМПЛЕКСНОЙ ЗАЩИТЫ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both", background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, padding: 24, transition: "border-color 0.3s, box-shadow 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.35)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,235,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--pc-border)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={s.icon} size={20} style={{ color: "var(--pc-accent)" }} />
                </div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "0.03em", marginBottom: 10, color: "var(--pc-text)" }}>{s.label}</h3>
                <p style={{ fontSize: 14, color: "var(--pc-text-muted)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={{ padding: "80px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// ИНТЕГРАЦИИ</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700 }}>
              ПРЯМЫЕ КАНАЛЫ С <span style={{ color: "var(--pc-accent)" }}>ГОСОРГАНАМИ</span>
            </h2>
            <p style={{ color: "var(--pc-text-muted)", fontSize: 15, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>
              Российские ведомства и международные институты — без посредников и бумажных заявок
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {govOrgs.map((org) => (
              <div key={org.name} style={{ background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 8, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "border-color 0.2s", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(37,99,235,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pc-border)")}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={org.icon} size={20} style={{ color: "var(--pc-accent)" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--pc-text)" }}>{org.name}</div>
                  <div style={{ fontSize: 11, color: "var(--pc-text-dim)", lineHeight: 1.4, marginTop: 2 }}>{org.full}</div>
                </div>
                <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", background: "rgba(37,99,235,0.08)", padding: "2px 8px", borderRadius: 3 }}>ПОДКЛЮЧЕНО</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS TABLE ── */}
      <section id="about" style={{ padding: "80px 0", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// ПРОГНОЗ РЕЗУЛЬТАТОВ</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, marginBottom: 28, lineHeight: 1.1 }}>
                ИЗМЕРИМЫЙ <span style={{ color: "var(--pc-accent)" }}>ЭФФЕКТ</span><br/>ЗА 3 ГОДА
              </h2>
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "var(--pc-surface-2)", borderBottom: "1px solid var(--pc-border)" }}>
                  {["Период", "Пользователи", "Выручка", "Экономия"].map((h) => (
                    <div key={h} style={{ padding: "10px 14px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-dim)", letterSpacing: "0.06em" }}>{h}</div>
                  ))}
                </div>
                {results.map((r, i) => (
                  <div key={r.year} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: i < results.length - 1 ? "1px solid var(--pc-border)" : "none", transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ padding: "14px 14px", fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 700, color: "var(--pc-accent)" }}>{r.year}</div>
                    <div style={{ padding: "14px 14px", fontSize: 14, color: "var(--pc-text)" }}>{r.users}</div>
                    <div style={{ padding: "14px 14px", fontSize: 14, color: "var(--pc-text)" }}>{r.revenue}</div>
                    <div style={{ padding: "14px 14px", fontSize: 14, color: "#00c864" }}>{r.lawyers} юристов</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)", borderRadius: 8, display: "flex", gap: 12, alignItems: "center" }}>
                <Icon name="TrendingUp" size={18} style={{ color: "var(--pc-accent)", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "var(--pc-text-muted)" }}>Точка безубыточности — <strong style={{ color: "var(--pc-text)" }}>18 месяцев</strong> после запуска</span>
              </div>
            </div>

            {/* Review */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-dim)", letterSpacing: "0.12em", marginBottom: 4 }}>// ОТЗЫВ КЛИЕНТА</div>
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, padding: 28, position: "relative" }}>
                <div style={{ position: "absolute", top: 20, right: 24, fontSize: 48, color: "rgba(37,99,235,0.15)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 15, color: "var(--pc-text-muted)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
                  Платформа «PlanetCare AI» кардинально изменила подход к безопасности нашего бизнеса. Раньше мы тратили десятки часов на проверку контрагентов и подготовку отчётов для госорганов. Теперь всё делается автоматически, с учётом международных стандартов. Особенно ценно — интеграция с ВОИС: подача заявок на регистрацию товарных знаков стала в разы проще.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="User" size={18} style={{ color: "var(--pc-accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--pc-text)" }}>Иванов А.С.</div>
                    <div style={{ fontSize: 12, color: "var(--pc-text-muted)" }}>Директор ООО «ТехноПром»</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                    {[1,2,3,4,5].map((s) => <Icon key={s} name="Star" size={14} style={{ color: "#fbbf24" }} />)}
                  </div>
                </div>
              </div>

              {/* Compliance badges */}
              <div>
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-dim)", letterSpacing: "0.1em", marginBottom: 14 }}>СООТВЕТСТВИЕ СТАНДАРТАМ</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["GDPR", "ФЗ-152", "ISO 27001", "PCI DSS", "OAuth 2.0", "TLS 1.3", "AES-256", "RBAC"].map((badge) => (
                    <div key={badge} style={{ padding: "5px 12px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 4, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)" }}>{badge}</div>
                  ))}
                </div>
              </div>

              {/* Target audience */}
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-dim)", letterSpacing: "0.1em", marginBottom: 14 }}>КОМУ ПОДОЙДЁТ</div>
                {[
                  { icon: "User", label: "Индивидуальные предприниматели (ИП)" },
                  { icon: "Building2", label: "Малые и средние предприятия (МСП)" },
                  { icon: "Globe", label: "Международные организации с РФ-партнёрами" },
                  { icon: "Handshake", label: "Зарубежные партнёры российских компаний" },
                ].map((t) => (
                  <div key={t.label} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--pc-border)" }}>
                    <Icon name={t.icon} size={14} style={{ color: "var(--pc-accent)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--pc-text-muted)" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "80px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// ТАРИФЫ</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
              ВЫБЕРИТЕ <span style={{ color: "var(--pc-accent)" }}>СВОЙ ТАРИФ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={plan.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both", background: plan.highlight ? "var(--pc-surface-2)" : "var(--pc-surface)", border: `1px solid ${plan.highlight ? "rgba(37,99,235,0.45)" : "var(--pc-border)"}`, borderRadius: 10, padding: 28, position: "relative", boxShadow: plan.highlight ? "0 0 40px rgba(37,99,235,0.1)" : "none" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--pc-accent)", color: "#fff", fontSize: 11, fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>ПОПУЛЯРНЫЙ</div>
                )}
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--pc-text)", marginBottom: 2 }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginBottom: 16 }}>{plan.sub}</div>
                <div style={{ marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 34, fontWeight: 700, color: plan.highlight ? "var(--pc-accent)" : "var(--pc-text)" }}>{plan.price}</span>
                  <span style={{ color: "var(--pc-text-muted)", fontSize: 14 }}>{plan.period}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--pc-border)", paddingTop: 20, marginBottom: 24 }}>
                  {plan.features.map((feat) => (
                    <div key={feat} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <Icon name="Check" size={13} style={{ color: "var(--pc-accent)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "var(--pc-text-muted)" }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button className={plan.highlight ? "pc-btn-primary" : "pc-btn-outline"} style={{ width: "100%", textAlign: "center", background: plan.highlight ? "var(--pc-accent)" : undefined, borderColor: plan.highlight ? undefined : "var(--pc-accent)", color: plan.highlight ? "#fff" : "var(--pc-accent)" }}
                  onClick={() => openModal(`Тариф «${plan.name}» — ${plan.cta}`)}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// ВОПРОСЫ И ОТВЕТЫ</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700 }}>
              ЧАСТО ЗАДАВАЕМЫЕ <span style={{ color: "var(--pc-accent)" }}>ВОПРОСЫ</span>
            </h2>
          </div>
          <div style={{ borderTop: "1px solid var(--pc-border)" }}>
            {faqs.map((f) => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div className="pc-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }}/>
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 16 }}>// НАЧАТЬ РАБОТУ</div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
            ЗАЩИТИТЕ БИЗНЕС<br/><span style={{ color: "var(--pc-accent)" }}>УЖЕ СЕГОДНЯ</span>
          </h2>
          <p style={{ color: "var(--pc-text-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            14 дней бесплатного доступа. Подключение за 1 день. Полное соответствие ФЗ-152 и GDPR.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="pc-btn-primary" style={{ padding: "14px 36px", fontSize: 15, background: "var(--pc-accent)" }} onClick={() => openModal("Начать бесплатно — 14 дней доступа")}>Начать бесплатно</button>
            <button className="pc-btn-outline" style={{ padding: "14px 36px", fontSize: 15, borderColor: "var(--pc-accent)", color: "var(--pc-accent)" }} onClick={() => openModal("Запросить демо платформы")}>Запросить демо</button>
          </div>
          <div style={{ marginTop: 32, fontSize: 13, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>
            Автор проекта: Николаев Владимир Владимирович · 2026
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* CTA text */}
            <div>
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", letterSpacing: "0.12em", marginBottom: 12 }}>// КОНТАКТЫ</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
                ХОТИТЕ АВТОМАТИЗИРОВАТЬ<br/>
                <span style={{ color: "var(--pc-accent)" }}>БЕЗОПАСНОСТЬ БИЗНЕСА?</span>
              </h2>
              <p style={{ color: "var(--pc-text-muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                Свяжитесь с нами для обсуждения деталей внедрения платформы «PlanetCare AI» в вашем бизнесе. Архитектура полностью спроектирована и готова к реализации.
              </p>

              {/* Audience list */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 14, letterSpacing: "0.08em" }}>КОМУ ПОДОЙДЁТ ПЛАТФОРМА</div>
                {[
                  "ИП и МСП, стремящимся снизить затраты на безопасность",
                  "Компаниям, планирующим международную экспансию",
                  "Организациям, работающим с госорганами и требующим строгого соблюдения норм",
                  "Международным организациям с российскими партнёрами",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <Icon name="ChevronRight" size={14} style={{ color: "var(--pc-accent)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "var(--pc-text-muted)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Delivery format */}
              <div style={{ padding: "16px 20px", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)", borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 10, letterSpacing: "0.08em" }}>ФОРМАТ ПОСТАВКИ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: "FileText", text: "PDF-документация 30–40 страниц" },
                    { icon: "FolderArchive", text: "Архив с исходниками (схемы Visio/Miro, скриншоты, графики)" },
                    { icon: "Code2", text: "Полный исходный код платформы" },
                    { icon: "CheckSquare", text: "Чек-листы и инструкции по развёртыванию" },
                  ].map((f) => (
                    <div key={f.text} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <Icon name={f.icon} size={14} style={{ color: "var(--pc-accent)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "var(--pc-text-muted)" }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Author card */}
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 12, padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--pc-border)" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(29,78,216,0.15))", border: "2px solid rgba(37,99,235,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="User" size={24} style={{ color: "var(--pc-accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--pc-text)", letterSpacing: "0.03em" }}>Николаев Владимир Владимирович</div>
                    <div style={{ fontSize: 13, color: "var(--pc-text-muted)", marginTop: 2 }}>Автор проекта · PlanetCare AI</div>
                    <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-accent)", marginTop: 4 }}>Год запуска: 2026</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: "Mail", label: "Email", value: "info@planetcare-ai.ru", href: "mailto:info@planetcare-ai.ru" },
                    { icon: "Phone", label: "Телефон", value: "+7 (XXX) XXX-XX-XX", href: "tel:+7XXXXXXXXXX" },
                    { icon: "Globe", label: "Сайт", value: "www.planetcare-ai.ru", href: "https://www.planetcare-ai.ru" },
                  ].map((c) => (
                    <a key={c.label} href={c.href} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 14px", background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 8, textDecoration: "none", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(37,99,235,0.35)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pc-border)")}>
                      <div style={{ width: 34, height: 34, borderRadius: 6, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name={c.icon} size={16} style={{ color: "var(--pc-accent)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 14, color: "var(--pc-text)", fontWeight: 500 }}>{c.value}</div>
                      </div>
                      <Icon name="ArrowUpRight" size={14} style={{ color: "var(--pc-text-dim)", marginLeft: "auto" }} />
                    </a>
                  ))}
                </div>

                <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                  <button className="pc-btn-primary" style={{ flex: 1, textAlign: "center", padding: "12px 0" }} onClick={() => openModal("Обсудить внедрение PlanetCare AI")}>Обсудить внедрение</button>
                  <button className="pc-btn-outline" style={{ flex: 1, textAlign: "center", padding: "12px 0" }} onClick={() => openModal("Запросить PDF-документацию")}>Запросить PDF</button>
                </div>
              </div>

              {/* Readiness badge */}
              <div style={{ background: "rgba(0,200,100,0.05)", border: "1px solid rgba(0,200,100,0.2)", borderRadius: 10, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(0,200,100,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="PackageCheck" size={20} style={{ color: "#00c864" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 700, color: "#00c864", letterSpacing: "0.06em", marginBottom: 6 }}>АРХИТЕКТУРА ГОТОВА К РЕАЛИЗАЦИИ</div>
                  <div style={{ fontSize: 13, color: "var(--pc-text-muted)", lineHeight: 1.6 }}>Все компоненты спроектированы: микросервисы, безопасность, интеграции с госорганами, локальные ИИ-модели, мониторинг и документация.</div>
                </div>
              </div>

              {/* Tech stack */}
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12, letterSpacing: "0.08em" }}>ТЕХНОЛОГИЧЕСКИЙ СТЕК</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {["React", "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS / Yandex Cloud", "Prometheus", "ELK Stack", "OAuth 2.0"].map((tech) => (
                    <span key={tech} style={{ padding: "4px 10px", background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 4, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-muted)" }}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--pc-border)", padding: "32px 0", background: "var(--pc-bg)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "var(--pc-accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="ShieldCheck" size={15} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em" }}>
              PLANET<span style={{ color: "var(--pc-accent)" }}>CARE</span> AI
            </span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {["Документация", "API", "Политика конфиденциальности", "Поддержка"].map((item) => (
              <a key={item} href="#" style={{ fontSize: 12, color: "var(--pc-text-dim)", textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pc-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pc-text-dim)")}>{item}</a>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <div style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>© 2026 PlanetCare AI</div>
            <div style={{ fontSize: 11, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>Николаев Владимир Владимирович</div>
          </div>
        </div>
      </footer>
    </div>
  );
}