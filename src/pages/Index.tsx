import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ── Types ──────────────────────────────────────────────
interface ServiceStatus {
  name: string;
  alias: string;
  status: "online" | "offline" | "warn";
  latency: number;
  requests: number;
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  delta: string;
  positive: boolean;
  icon: string;
}

// ── Animated Counter ──────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("ru")}{suffix}</span>;
}

// ── Mini Sparkline ─────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.8"/>
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * h} r="2.5" fill={color}/>
    </svg>
  );
}

// ── Deploy Step ───────────────────────────────────────
function DeployStep({ step, title, desc, code, index }: { step: string; title: string; desc: string; code: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both", background: "var(--pc-bg)", border: `1px solid ${open ? "rgba(0,255,136,0.3)" : "var(--pc-border)"}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.2s" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, color: "rgba(0,255,136,0.25)", lineHeight: 1, flexShrink: 0, minWidth: 40 }}>{step}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "0.04em", color: "var(--pc-text)", marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 13, color: "var(--pc-text-muted)" }}>{desc}</div>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: "var(--pc-text-muted)", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ borderTop: "1px solid var(--pc-border)", background: "#050a0e", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span className="status-dot" style={{ background: "var(--pc-red)" }}/>
            <span className="status-dot" style={{ background: "var(--pc-amber)" }}/>
            <span className="status-dot" style={{ background: "var(--pc-green)" }}/>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--pc-text-dim)", marginLeft: 6 }}>bash</span>
          </div>
          <pre style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "var(--pc-green)", lineHeight: 1.8, whiteSpace: "pre-wrap", overflowX: "auto" }}>{code.split("\n").map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              <span style={{ color: "var(--pc-text-dim)", userSelect: "none" }}>$ </span>
              <span style={{ color: line.startsWith("#") ? "var(--pc-text-dim)" : "var(--pc-green)" }}>{line}</span>
            </span>
          ))}</pre>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function Index() {
  const [activeTab, setActiveTab] = useState<"overview" | "ai" | "storage" | "logs">("overview");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services: ServiceStatus[] = [
    { name: "Яндекс Алиса", alias: "yandex-alice", status: "online", latency: 142, requests: 2847 },
    { name: "Google Gemini", alias: "google-gemini", status: "online", latency: 89, requests: 5124 },
    { name: "Microsoft Copilot", alias: "ms-copilot", status: "warn", latency: 312, requests: 891 },
    { name: "Llama 3 (local)", alias: "local-llama3", status: "online", latency: 44, requests: 1203 },
    { name: "Dalan (local)", alias: "local-dalan", status: "online", latency: 38, requests: 674 },
    { name: "Alibaba Alime", alias: "alibaba-alime", status: "offline", latency: 0, requests: 0 },
  ];

  const metrics: MetricCard[] = [
    { label: "ИИ-запросы сегодня", value: "10849", unit: "запросов", delta: "+18%", positive: true, icon: "Brain" },
    { label: "Хранилище занято", value: "2", unit: "ТБ", delta: "+3.2%", positive: false, icon: "HardDrive" },
    { label: "Активных пользователей", value: "247", unit: "сейчас", delta: "+12", positive: true, icon: "Users" },
    { label: "Время отклика (avg)", value: "121", unit: "мс", delta: "-8%", positive: true, icon: "Zap" },
  ];

  const sparkData = [42, 58, 45, 72, 65, 89, 74, 95, 88, 102, 97, 115];

  const handleAiDemo = () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      setAiResult(`[Gemini] Ответ на запрос: "${aiInput}"\n\nАнализ завершён. Обнаружено 3 ключевых паттерна в данных. Рекомендуется использовать модель классификации с точностью 94.7%.\n\nТокены использовано: 312\nВремя ответа: 89мс\nМодель: gemini-1.5-pro`);
      setAiLoading(false);
    }, 1800);
  };

  const features = [
    { icon: "Brain", title: "ИИ-оркестратор", desc: "Единый шлюз ко всем ИИ-сервисам. Автоматическое переключение при сбоях, балансировка нагрузки, контроль квот.", accent: "var(--pc-green)" },
    { icon: "Database", title: "Облачное хранилище", desc: "MinIO S3-совместимое хранилище с дедупликацией. Квоты от 50 ГБ до 1 ТБ на пользователя. Автобэкап ежедневно.", accent: "var(--pc-blue)" },
    { icon: "BarChart3", title: "Мониторинг", desc: "Prometheus + Grafana в реальном времени. Алертинг в Telegram и email при критических событиях.", accent: "var(--pc-amber)" },
    { icon: "Shield", title: "Безопасность", desc: "SSL/TLS шифрование, фаервол UFW, LDAP/SSO интеграция, политики доступа по ролям.", accent: "var(--pc-red)" },
    { icon: "Layers", title: "Модульность", desc: "9 независимых модулей с чётким API. Подключайте новые ИИ-сервисы и хранилища без остановки системы.", accent: "var(--pc-green)" },
    { icon: "Terminal", title: "Локальные модели", desc: "Llama 3 и Dalan работают на вашем оборудовании. Данные не покидают контур. Скорость от 38 мс.", accent: "var(--pc-blue)" },
  ];

  const plans = [
    { name: "Community", price: "Бесплатно", period: "", features: ["До 10 пользователей", "2 ИИ-сервиса", "50 ГБ хранилища", "100 запросов/день", "Базовая поддержка"], cta: "Начать бесплатно", highlight: false },
    { name: "Enterprise", price: "50 000 ₽", period: "/мес", features: ["Неограниченные пользователи", "Все ИИ-сервисы", "1 ТБ хранилища", "Безлимитные запросы", "Приоритетная поддержка", "LDAP/SSO", "SLA 99.9%"], cta: "Подключить", highlight: true },
    { name: "On-Premise", price: "500 000 ₽", period: " разово", features: ["Деплой на вашем сервере", "Полный исходный код", "Локальные модели", "Кастомные интеграции", "Персональный менеджер"], cta: "Связаться", highlight: false },
  ];

  return (
    <div style={{ background: "var(--pc-bg)", color: "var(--pc-text)", minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid var(--pc-border)", background: "rgba(8,13,18,0.95)", backdropFilter: "blur(12px)" }} className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 60 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 32, height: 32, background: "var(--pc-green)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Globe" size={18} style={{ color: "#080d12" }} />
            </div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.06em" }}>
              PLANET<span style={{ color: "var(--pc-green)" }}>CARE</span> AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Платформа", "ИИ-сервисы", "Тарифы", "Документация"].map((item) => (
              <a key={item} href="#" className="pc-nav-link">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="pc-btn-outline hidden md:block" style={{ padding: "8px 20px", fontSize: 13 }}>Войти</button>
            <button className="pc-btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>Демо-доступ</button>
            <button className="md:hidden" style={{ color: "var(--pc-text-muted)", background: "none", border: "none", cursor: "pointer" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div style={{ background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)", padding: "16px 24px" }}>
            {["Платформа", "ИИ-сервисы", "Тарифы", "Документация"].map((item) => (
              <a key={item} href="#" className="block py-2 pc-nav-link" style={{ fontSize: 15 }}>{item}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pc-grid-bg scan-overlay" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,136,0.08) 0%, transparent 60%)", pointerEvents: "none" }}/>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="animate-fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 4, padding: "6px 14px", marginBottom: 28 }}>
                <span className="status-dot status-online"/>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-green)", letterSpacing: "0.06em" }}>СИСТЕМА АКТИВНА — v1.0.0</span>
              </div>

              <h1 className="animate-fade-in-up delay-100" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: 24 }}>
                КОРПОРАТИВНАЯ<br/>
                <span style={{ color: "var(--pc-green)" }} className="glow-green">ИИ-ПЛАТФОРМА</span><br/>
                <span style={{ color: "var(--pc-text-muted)", fontWeight: 400 }}>ДЛЯ ВАШЕЙ КОМАНДЫ</span>
              </h1>

              <p className="animate-fade-in-up delay-200" style={{ color: "var(--pc-text-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Единая точка управления облачными ИИ-сервисами, хранилищем данных и инфраструктурой. Яндекс Алиса, Google Gemini, локальные Llama 3 — всё в одном интерфейсе.
              </p>

              <div className="animate-fade-in-up delay-300 flex items-center gap-4 flex-wrap">
                <button className="pc-btn-primary">Запросить демо</button>
                <button className="pc-btn-outline">Читать документацию</button>
              </div>

              <div className="animate-fade-in-up delay-400 flex items-center gap-6 mt-10 flex-wrap">
                {[{ v: "6", l: "ИИ-сервисов" }, { v: "99.9%", l: "Uptime SLA" }, { v: "<50мс", l: "Отклик API" }].map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--pc-green)" }}>{v}</div>
                    <div style={{ fontSize: 12, color: "var(--pc-text-muted)", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Panel */}
            <div className="animate-fade-in-up delay-300 animate-float hidden md:block">
              <div style={{ background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 10, overflow: "hidden" }} className="glow-box-green">
                <div style={{ background: "var(--pc-surface-2)", padding: "12px 16px", borderBottom: "1px solid var(--pc-border)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--pc-red)" }}/>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--pc-amber)" }}/>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--pc-green)" }}/>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-text-muted)", marginLeft: 8 }}>planetcare-ai — terminal</span>
                </div>
                <div style={{ padding: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, lineHeight: 2 }}>
                  {[
                    { p: "$", t: "pc status --all", c: "var(--pc-green)" },
                    { p: "✓", t: "yandex-alice      ONLINE  142ms", c: "var(--pc-text-muted)" },
                    { p: "✓", t: "google-gemini     ONLINE   89ms", c: "var(--pc-text-muted)" },
                    { p: "⚠", t: "ms-copilot        WARN    312ms", c: "var(--pc-amber)" },
                    { p: "✓", t: "local-llama3      ONLINE   44ms", c: "var(--pc-text-muted)" },
                    { p: "✓", t: "local-dalan       ONLINE   38ms", c: "var(--pc-text-muted)" },
                    { p: "✗", t: "alibaba-alime     OFFLINE", c: "var(--pc-red)" },
                    { p: "$", t: "pc storage --usage", c: "var(--pc-green)" },
                    { p: "→", t: "Used: 2.4 TB / 10 TB  (24%)", c: "var(--pc-text-muted)" },
                    { p: "$", t: "", c: "var(--pc-green)" },
                  ].map((line, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, animationDelay: `${i * 0.08}s` }}>
                      <span style={{ color: line.p === "✗" ? "var(--pc-red)" : line.p === "⚠" ? "var(--pc-amber)" : "var(--pc-green)", minWidth: 16 }}>{line.p}</span>
                      <span style={{ color: line.c }}>
                        {line.t}
                        {line.p === "$" && line.t === "" && <span className="animate-blink" style={{ color: "var(--pc-green)" }}>█</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section style={{ borderTop: "1px solid var(--pc-border)", borderBottom: "1px solid var(--pc-border)", background: "var(--pc-surface)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={m.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={m.icon} size={16} style={{ color: "var(--pc-text-muted)" }} />
                  <span style={{ fontSize: 11, color: "var(--pc-text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>{m.label}</span>
                </div>
                <span style={{ fontSize: 11, color: m.positive ? "var(--pc-green)" : "var(--pc-amber)", fontFamily: "'IBM Plex Mono', monospace" }}>{m.delta}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 32, fontWeight: 700, color: "var(--pc-text)", lineHeight: 1 }}>
                  <AnimatedCounter target={parseFloat(m.value)} />
                </span>
                <span style={{ fontSize: 13, color: "var(--pc-text-muted)" }}>{m.unit}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <Sparkline data={sparkData.map((v, j) => v + (i * 7 + j * 3) % 25)} color="var(--pc-green)" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.1em", marginBottom: 12 }}>// API_DEMO</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
                ПОПРОБУЙТЕ<br/><span style={{ color: "var(--pc-green)" }}>ИИ-ОРКЕСТРАТОР</span>
              </h2>
              <p style={{ color: "var(--pc-text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Отправьте запрос к любому из 6 подключённых ИИ-сервисов. Оркестратор автоматически выберет оптимальную модель по скорости и доступности.
              </p>

              <div className="pc-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Icon name="Brain" size={16} style={{ color: "var(--pc-green)" }}/>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-text-muted)" }}>POST /api/ai/query</span>
                </div>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Введите запрос к ИИ..."
                  rows={3}
                  style={{ width: "100%", background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 6, padding: "12px 14px", color: "var(--pc-text)", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,136,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--pc-border)")}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <select style={{ background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 6, color: "var(--pc-text-muted)", padding: "8px 12px", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", outline: "none", flex: 1 }}>
                    <option>google-gemini</option>
                    <option>yandex-alice</option>
                    <option>local-llama3</option>
                    <option>local-dalan</option>
                  </select>
                  <button className="pc-btn-primary" onClick={handleAiDemo} disabled={aiLoading} style={{ padding: "9px 20px", fontSize: 13, opacity: aiLoading ? 0.7 : 1 }}>
                    {aiLoading ? "Запрос..." : "Отправить"}
                  </button>
                </div>

                {(aiLoading || aiResult) && (
                  <div style={{ marginTop: 16, background: "var(--pc-bg)", border: "1px solid var(--pc-border)", borderRadius: 6, padding: 14 }}>
                    {aiLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--pc-text-muted)", fontSize: 13 }}>
                        <span className="status-dot status-online"/>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Обрабатываю запрос...</span>
                      </div>
                    ) : (
                      <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-text-muted)", whiteSpace: "pre-wrap", lineHeight: 1.7, margin: 0 }}>{aiResult}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Services Status */}
            <div>
              <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-text-dim)", letterSpacing: "0.1em", marginBottom: 16 }}>СТАТУС СЕРВИСОВ — LIVE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {services.map((svc, i) => (
                  <div key={svc.alias} className="pc-card animate-fade-in-up" style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className={`status-dot status-${svc.status}`}/>
                      <div>
                        <div style={{ fontSize: 14, color: "var(--pc-text)", fontWeight: 500 }}>{svc.name}</div>
                        <div style={{ fontSize: 11, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>{svc.alias}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {svc.status !== "offline" ? (
                        <>
                          <div style={{ fontSize: 13, color: svc.status === "warn" ? "var(--pc-amber)" : "var(--pc-green)", fontFamily: "'IBM Plex Mono', monospace" }}>{svc.latency}мс</div>
                          <div style={{ fontSize: 11, color: "var(--pc-text-dim)" }}>{svc.requests.toLocaleString("ru")} req</div>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--pc-red)", fontFamily: "'IBM Plex Mono', monospace" }}>OFFLINE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.12em", marginBottom: 12 }}>// PLATFORM_MODULES</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1 }}>
              9 НЕЗАВИСИМЫХ МОДУЛЕЙ —<br/><span style={{ color: "var(--pc-green)" }}>ПОЛНЫЙ КОНТРОЛЬ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="pc-card animate-fade-in-up" style={{ padding: 24, animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${f.accent}18`, border: `1px solid ${f.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={f.icon} size={20} style={{ color: f.accent }} />
                </div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 10, color: "var(--pc-text)" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--pc-text-muted)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.1em", marginBottom: 12 }}>// ADMIN_PANEL</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
                ПОЛНОЕ УПРАВЛЕНИЕ<br/><span style={{ color: "var(--pc-green)" }}>ИЗ ОДНОГО ОКНА</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "Users", title: "Управление пользователями", desc: "Создавайте аккаунты, назначайте квоты хранилища (50–1000 ГБ) и ИИ-запросов (10–1000/день)" },
                  { icon: "Key", title: "Интеграция ИИ-сервисов", desc: "Подключайте облачные API по ключу. Система автоматически проверяет доступность и переключает трафик" },
                  { icon: "Activity", title: "Мониторинг в реальном времени", desc: "CPU, RAM, диск, GPU — все метрики в одном дашборде Grafana. Алертинг при превышении порогов" },
                  { icon: "Archive", title: "Бэкапы и восстановление", desc: "Автоматические ежедневные дампы PostgreSQL + rsync файлов. Восстановление в 1 команду" },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Icon name={item.icon} size={16} style={{ color: "var(--pc-green)" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--pc-text)", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "var(--pc-text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Dashboard */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="pc-card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["Обзор", "ИИ", "Хранилище", "Логи"] as const).map((tab) => {
                    const tabKey = tab === "Обзор" ? "overview" : tab === "ИИ" ? "ai" : tab === "Хранилище" ? "storage" : "logs";
                    const active = activeTab === tabKey;
                    return (
                      <button key={tab} onClick={() => setActiveTab(tabKey as "overview" | "ai" | "storage" | "logs")} style={{ background: active ? "rgba(0,255,136,0.12)" : "transparent", border: `1px solid ${active ? "rgba(0,255,136,0.3)" : "transparent"}`, borderRadius: 4, padding: "4px 12px", color: active ? "var(--pc-green)" : "var(--pc-text-muted)", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", transition: "all 0.2s" }}>{tab}</button>
                    );
                  })}
                </div>
                <span className="status-dot status-online"/>
              </div>

              <div className="pc-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: "var(--pc-text-muted)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 14 }}>КВОТЫ ХРАНИЛИЩА</div>
                {[
                  { user: "admin@corp.ru", used: 78, total: 100, gb: 78 },
                  { user: "analyst@corp.ru", used: 45, total: 200, gb: 90 },
                  { user: "dev@corp.ru", used: 23, total: 50, gb: 11 },
                  { user: "ml@corp.ru", used: 91, total: 1000, gb: 910 },
                ].map((u) => (
                  <div key={u.user} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--pc-text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>{u.user}</span>
                      <span style={{ fontSize: 12, color: u.used > 85 ? "var(--pc-amber)" : "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>{u.gb}/{u.total}ГБ</span>
                    </div>
                    <div className="pc-progress">
                      <div className="pc-progress-fill" style={{ width: `${u.used}%`, background: u.used > 85 ? "var(--pc-amber)" : undefined }}/>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pc-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: "var(--pc-text-muted)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>ИИ-ЗАПРОСЫ СЕГОДНЯ</div>
                {[
                  { svc: "Google Gemini", count: 5124, max: 6000, color: "var(--pc-blue)" },
                  { svc: "Яндекс Алиса", count: 2847, max: 6000, color: "var(--pc-green)" },
                  { svc: "Llama 3", count: 1203, max: 6000, color: "var(--pc-amber)" },
                  { svc: "Dalan", count: 674, max: 6000, color: "#aa88ff" },
                ].map((row) => (
                  <div key={row.svc} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--pc-text-muted)", minWidth: 110, fontFamily: "'IBM Plex Mono', monospace" }}>{row.svc}</span>
                    <div className="pc-progress" style={{ flex: 1 }}>
                      <div style={{ height: "100%", width: `${(row.count / row.max) * 100}%`, background: row.color, borderRadius: 2, transition: "width 1s ease" }}/>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace", minWidth: 40, textAlign: "right" }}>{row.count.toLocaleString("ru")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "80px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.12em", marginBottom: 12 }}>// PRICING_PLANS</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
              ТАРИФЫ ДЛЯ ЛЮБОГО <span style={{ color: "var(--pc-green)" }}>МАСШТАБА</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={plan.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both", background: plan.highlight ? "var(--pc-surface-2)" : "var(--pc-surface)", border: `1px solid ${plan.highlight ? "rgba(0,255,136,0.4)" : "var(--pc-border)"}`, borderRadius: 10, padding: 28, position: "relative", boxShadow: plan.highlight ? "0 0 40px rgba(0,255,136,0.1)" : "none" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--pc-green)", color: "#080d12", fontSize: 11, fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>РЕКОМЕНДУЕМ</div>
                )}
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--pc-text)", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, fontWeight: 700, color: plan.highlight ? "var(--pc-green)" : "var(--pc-text)" }}>{plan.price}</span>
                  <span style={{ color: "var(--pc-text-muted)", fontSize: 14 }}>{plan.period}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--pc-border)", paddingTop: 20, marginBottom: 24 }}>
                  {plan.features.map((feat) => (
                    <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Icon name="Check" size={14} style={{ color: "var(--pc-green)", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "var(--pc-text-muted)" }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button className={plan.highlight ? "pc-btn-primary" : "pc-btn-outline"} style={{ width: "100%", textAlign: "center" }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGE ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.1em", marginBottom: 12 }}>// DELIVERY_PACKAGE</div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
                ЧТО ВХОДИТ<br/><span style={{ color: "var(--pc-green)" }}>В ПАКЕТ ПОСТАВКИ</span>
              </h2>
              <p style={{ color: "var(--pc-text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                ZIP-архив <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", fontSize: 13 }}>planetcare-ai-package-v1.0.zip</span> содержит всё необходимое для развёртывания с нуля: код, конфиги, документацию, скрипты и тесты.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "BookOpen", label: "Документация", desc: "Архитектурные схемы Mermaid, OpenAPI 3.0 спецификация, руководства администратора и пользователя, FAQ" },
                  { icon: "Code2", label: "Исходный код", desc: "Фронтенд (React), бэкенд (Node.js + Python), API Gateway, Auth Service, Storage Service, AI Orchestrator" },
                  { icon: "Settings", label: "Конфигурации", desc: "docker-compose.yml, Nginx, PostgreSQL схема, MinIO политики, шаблоны Dockerfile" },
                  { icon: "FlaskConical", label: "Тесты", desc: "Unit, Integration и нагрузочные тесты (JMeter). Сценарии для 50+ одновременных пользователей" },
                  { icon: "Terminal", label: "Скрипты", desc: "init_system.sh, deploy_local_model.sh, backup_system.sh, restore_system.sh, setup_ssl.sh" },
                  { icon: "CalendarDays", label: "План внедрения", desc: "График развёртывания, управление рисками, обучающие материалы для администраторов и пользователей" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "var(--pc-surface)", border: "1px solid var(--pc-border)", borderRadius: 8, transition: "border-color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,136,0.25)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pc-border)")}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={item.icon} size={15} style={{ color: "var(--pc-green)" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--pc-text)", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "var(--pc-text-muted)", lineHeight: 1.55 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File tree */}
            <div className="pc-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ background: "var(--pc-surface-2)", padding: "12px 16px", borderBottom: "1px solid var(--pc-border)", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="FolderArchive" size={14} style={{ color: "var(--pc-green)" }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--pc-text-muted)" }}>planetcare-ai-package-v1.0.zip</span>
              </div>
              <div style={{ padding: "16px 20px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 1.9, overflowX: "auto" }}>
                {[
                  { indent: 0, icon: "Folder", name: "docs/", color: "var(--pc-amber)" },
                  { indent: 1, icon: "Folder", name: "architecture/", color: "var(--pc-amber)" },
                  { indent: 2, icon: "FileText", name: "system-architecture.mmd", color: "var(--pc-text-muted)" },
                  { indent: 2, icon: "FileText", name: "ai-integration.mmd", color: "var(--pc-text-muted)" },
                  { indent: 1, icon: "Folder", name: "api-docs/", color: "var(--pc-amber)" },
                  { indent: 2, icon: "FileText", name: "openapi-spec.yaml", color: "var(--pc-green)" },
                  { indent: 2, icon: "FileText", name: "postman-collection.json", color: "var(--pc-green)" },
                  { indent: 1, icon: "Folder", name: "user-guides/", color: "var(--pc-amber)" },
                  { indent: 2, icon: "FileText", name: "admin-guide.pdf", color: "var(--pc-text-muted)" },
                  { indent: 2, icon: "FileText", name: "user-guide.pdf", color: "var(--pc-text-muted)" },
                  { indent: 0, icon: "Folder", name: "code/", color: "var(--pc-blue)" },
                  { indent: 1, icon: "Folder", name: "frontend/", color: "var(--pc-blue)" },
                  { indent: 2, icon: "Folder", name: "admin-panel/", color: "var(--pc-blue)" },
                  { indent: 2, icon: "Folder", name: "user-interface/", color: "var(--pc-blue)" },
                  { indent: 1, icon: "Folder", name: "backend/", color: "var(--pc-blue)" },
                  { indent: 2, icon: "Folder", name: "ai-orchestrator/", color: "var(--pc-blue)" },
                  { indent: 2, icon: "Folder", name: "auth-service/", color: "var(--pc-blue)" },
                  { indent: 1, icon: "Folder", name: "scripts/", color: "var(--pc-blue)" },
                  { indent: 2, icon: "FileCode", name: "init_system.sh", color: "var(--pc-green)" },
                  { indent: 2, icon: "FileCode", name: "backup_system.sh", color: "var(--pc-green)" },
                  { indent: 0, icon: "Folder", name: "configs/", color: "#aa88ff" },
                  { indent: 1, icon: "FileCode", name: "docker-compose.yml", color: "var(--pc-green)" },
                  { indent: 1, icon: "Folder", name: "nginx/", color: "#aa88ff" },
                  { indent: 1, icon: "Folder", name: "postgresql/", color: "#aa88ff" },
                  { indent: 0, icon: "Folder", name: "tests/", color: "var(--pc-amber)" },
                  { indent: 1, icon: "FileCode", name: "ai-integration-tests.py", color: "var(--pc-text-muted)" },
                  { indent: 1, icon: "FileCode", name: "load-test-50users.jmx", color: "var(--pc-text-muted)" },
                  { indent: 0, icon: "Folder", name: "deployment-plan/", color: "var(--pc-red)" },
                  { indent: 1, icon: "FileText", name: "implementation-timeline.xlsx", color: "var(--pc-text-muted)" },
                  { indent: 1, icon: "FileText", name: "risk-management.md", color: "var(--pc-text-muted)" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: row.indent * 18 }}>
                    <Icon name={row.icon} size={12} style={{ color: row.color, flexShrink: 0 }} />
                    <span style={{ color: row.icon === "Folder" ? row.color : "var(--pc-text-muted)" }}>{row.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--pc-border)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>30 файлов · ~450 МБ</span>
                <button className="pc-btn-primary" style={{ padding: "6px 16px", fontSize: 12 }}>Запросить пакет</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPLOY STEPS ── */}
      <section style={{ padding: "80px 0", background: "var(--pc-surface)", borderTop: "1px solid var(--pc-border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.12em", marginBottom: 12 }}>// DEPLOYMENT_GUIDE</div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1 }}>
              РАЗВЁРТЫВАНИЕ ЗА <span style={{ color: "var(--pc-green)" }}>5 ШАГОВ</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" }}>
            {[
              {
                step: "01",
                title: "Подготовка сервера",
                desc: "Установка базовых зависимостей, Docker и Docker Compose",
                code: `sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git rsync cron
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin -y`,
              },
              {
                step: "02",
                title: "Развёртывание платформы",
                desc: "Распаковка архива и запуск всех сервисов одной командой",
                code: `unzip planetcare-ai-package-v1.0.zip -d /opt/planetcare
cd /opt/planetcare
docker compose up -d
docker compose ps`,
              },
              {
                step: "03",
                title: "Настройка SSL",
                desc: "Получение Let's Encrypt сертификата и настройка Nginx",
                code: `sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d planetcare-admin.com`,
              },
              {
                step: "04",
                title: "Инициализация БД и хранилища",
                desc: "Применение схемы PostgreSQL и создание MinIO бакетов",
                code: `psql -f configs/postgresql/planetcare-schema.sql
mc alias set planetcare http://localhost:9000 minioadmin minioadmin
mc mb planetcare/users`,
              },
              {
                step: "05",
                title: "Развёртывание ИИ-моделей",
                desc: "Запуск локальных моделей Llama 3 и Dalan на вашем оборудовании",
                code: `bash code/scripts/setup/deploy_local_model.sh llama3
bash code/scripts/setup/deploy_local_model.sh dalan
curl http://localhost:8080/health`,
              },
            ].map((s, i) => (
              <DeployStep key={s.step} {...s} index={i} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ color: "var(--pc-text-muted)", fontSize: 14, marginBottom: 20 }}>
              Полный чек-лист готовности и руководство администратора — в пакете поставки
            </p>
            <button className="pc-btn-outline">Скачать deployment-checklist.md</button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,255,136,0.06) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <div className="pc-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }}/>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "var(--pc-green)", letterSpacing: "0.12em", marginBottom: 16 }}>// GET_STARTED</div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
            ГОТОВЫ ЗАПУСТИТЬ<br/><span style={{ color: "var(--pc-green)" }}>ВАШУ ИИ-ПЛАТФОРМУ?</span>
          </h2>
          <p style={{ color: "var(--pc-text-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Развёртывание за 1 день. Полный контроль данных на вашем оборудовании. Поддержка на каждом шаге.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="pc-btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>Запросить демо-доступ</button>
            <button className="pc-btn-outline" style={{ padding: "14px 36px", fontSize: 15 }}>Связаться с командой</button>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {["support@planetcare.ai", "@PlanetCareSupportBot", "SLA 99.9%"].map((item) => (
              <span key={item} style={{ fontSize: 13, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--pc-border)", padding: "32px 0" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, background: "var(--pc-green)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Globe" size={13} style={{ color: "#080d12" }} />
            </div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.06em" }}>
              PLANET<span style={{ color: "var(--pc-green)" }}>CARE</span> AI
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Документация", "API", "Поддержка", "GitHub"].map((item) => (
              <a key={item} href="#" className="pc-nav-link" style={{ fontSize: 12 }}>{item}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--pc-text-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>
            © 2026 PlanetCare AI — v1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
}