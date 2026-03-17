import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "ar";

const en = {
  // Nav
  nav_dashboard: "Dashboard", nav_market_entry: "Market Entry", nav_distributor: "Distributor Finder",
  nav_competitor: "Competitor Analysis", nav_pricing: "Pricing Intelligence",
  nav_risk: "Risk Assessment", nav_partner: "Partner Matchmaking",
  nav_sales: "Sales Strategy", nav_export: "Export Readiness",
  nav_feasibility: "Feasibility Study", nav_agents: "AI Agents",
  nav_documents: "Document Hub", nav_settings: "Settings",
  nav_crm: "CRM",
  nav_projects: "Projects", nav_tasks: "Tasks & Execution",
  nav_financial: "Financial Overview", nav_market_intel: "Market Intelligence",
  nav_proposals: "Proposal Builder", nav_real_estate: "Real Estate Intelligence",
  nav_service_modules: "Service Modules", nav_ai_assistant: "AI Assistant",
  nav_reports: "Report Generator",
  // Groups
  group_overview: "OVERVIEW", group_services: "ADVISORY SERVICES",
  group_tools: "TOOLS & REPORTS", group_intelligence: "INTELLIGENCE",
  group_revenue: "REVENUE ENGINE", group_execution: "EXECUTION",
  group_premium: "PREMIUM MODULES", group_system: "SYSTEM",
  // Common
  analyze: "Analyze", analyzing: "Analyzing...", re_analyze: "Re-analyze",
  loading: "Loading...", error: "Error", cancel: "Cancel", save: "Save Changes",
  download: "Download", generate: "Generate", generating: "Generating...",
  search: "Search...", filter: "Filter", all: "All", export: "Export",
  new: "New", view: "View", edit: "Edit", delete: "Delete", close: "Close",
  run: "Run", running: "Running...", complete: "Complete", pending: "Pending",
  // Settings
  settings_title: "Settings", settings_subtitle: "Manage preferences, integrations & documents",
  tab_language: "Language", tab_integrations: "Integrations", tab_documents: "Documents",
  tab_agents: "Agent Config", tab_profile: "Profile", tab_security: "Security",
  language_title: "Language & Region", language_subtitle: "Select the platform display language",
  lang_en: "English", lang_ar: "Arabic (العربية)",
  // Agents page
  agents_title: "AI Agent Workspace", agents_subtitle: "All consultancy services powered by dedicated AI agents",
  agent_run: "Run Agent", agent_running: "Running...", agent_complete: "Complete",
  agent_idle: "Ready", agent_accuracy: "Accuracy",
  // Documents
  doc_hub_title: "Document Hub", doc_hub_subtitle: "Upload, manage & analyse all client documents",
  doc_upload: "Upload Document", doc_search: "Search documents...",
  // Dashboard
  dash_title: "Consultancy Intelligence Platform",
  dash_subtitle: "AI-powered advisory services for global market entry & business growth",
  dash_services: "Advisory Services", dash_quick_stats: "Platform Overview",
  // Integrations
  int_title: "Integrations", int_subtitle: "Connect your external tools and data sources",
  int_connect: "Connect", int_connected: "Connected", int_disconnect: "Disconnect",
  // CRM
  crm_title: "CRM — Relationship Manager",
  crm_subtitle: "Contacts, deals pipeline & activities — linked to advisory services",
  crm_add_contact: "Add Contact", crm_contacts: "Contacts",
  crm_pipeline: "Pipeline", crm_deals: "All Deals", crm_activities: "Activities",
  // Projects
  proj_title: "Projects", proj_subtitle: "Client case management — from analysis to delivery",
  proj_new: "New Project", proj_type: "Project Type", proj_status: "Status",
  proj_phase: "Phase", proj_value: "Deal Value", proj_deadline: "Deadline",
  proj_open_workspace: "Open Workspace",
  // AI Assistant
  ai_title: "AI Assistant", ai_subtitle: "Your digital consulting team — 6 specialist AI advisors",
  // Reports
  rep_title: "Report Generator", rep_subtitle: "AI-powered professional consulting reports",
  // Real Estate
  re_title: "Real Estate Intelligence", re_subtitle: "Location · Scenario · Feasibility · Decision",
};

const ar: typeof en = {
  // التنقل
  nav_dashboard: "لوحة التحكم",
  nav_market_entry: "تحليل دخول السوق",
  nav_distributor: "إيجاد الموزعين",
  nav_competitor: "تحليل المنافسين",
  nav_pricing: "استخبارات التسعير",
  nav_risk: "تقييم المخاطر",
  nav_partner: "التوافق مع الشركاء",
  nav_sales: "استراتيجية المبيعات",
  nav_export: "جاهزية التصدير",
  nav_feasibility: "دراسة الجدوى",
  nav_agents: "وكلاء الذكاء الاصطناعي",
  nav_documents: "مركز الوثائق",
  nav_settings: "الإعدادات",
  nav_crm: "إدارة علاقات العملاء",
  nav_projects: "المشاريع",
  nav_tasks: "المهام والتنفيذ",
  nav_financial: "النظرة المالية الشاملة",
  nav_market_intel: "استخبارات السوق",
  nav_proposals: "منشئ المقترحات",
  nav_real_estate: "استخبارات العقارات",
  nav_service_modules: "وحدات الخدمة",
  nav_ai_assistant: "المساعد الذكي",
  nav_reports: "منشئ التقارير",
  // المجموعات
  group_overview: "نظرة عامة",
  group_services: "الخدمات الاستشارية",
  group_tools: "الأدوات والتقارير",
  group_intelligence: "استخبارات الأعمال",
  group_revenue: "محرك الإيرادات",
  group_execution: "التنفيذ والمتابعة",
  group_premium: "الوحدات المتقدمة",
  group_system: "إعدادات النظام",
  // الشائعة
  analyze: "تحليل",
  analyzing: "جارٍ التحليل...",
  re_analyze: "إعادة التحليل",
  loading: "جارٍ التحميل...",
  error: "خطأ",
  cancel: "إلغاء",
  save: "حفظ التغييرات",
  download: "تنزيل",
  generate: "إنشاء",
  generating: "جارٍ الإنشاء...",
  search: "بحث...",
  filter: "تصفية",
  all: "الكل",
  export: "تصدير",
  new: "جديد",
  view: "عرض",
  edit: "تعديل",
  delete: "حذف",
  close: "إغلاق",
  run: "تشغيل",
  running: "جارٍ التشغيل...",
  complete: "مكتمل",
  pending: "قيد الانتظار",
  // الإعدادات
  settings_title: "الإعدادات",
  settings_subtitle: "إدارة التفضيلات والتكاملات والمستندات",
  tab_language: "اللغة",
  tab_integrations: "التكاملات",
  tab_documents: "المستندات",
  tab_agents: "إعداد الوكلاء",
  tab_profile: "الملف الشخصي",
  tab_security: "الأمان",
  language_title: "اللغة والمنطقة",
  language_subtitle: "اختر لغة عرض المنصة",
  lang_en: "الإنجليزية",
  lang_ar: "العربية",
  // صفحة الوكلاء
  agents_title: "مساحة وكلاء الذكاء الاصطناعي",
  agents_subtitle: "جميع الخدمات الاستشارية مدعومة بوكلاء ذكاء اصطناعي متخصصين",
  agent_run: "تشغيل الوكيل",
  agent_running: "جارٍ التشغيل...",
  agent_complete: "مكتمل",
  agent_idle: "جاهز",
  agent_accuracy: "الدقة",
  // الوثائق
  doc_hub_title: "مركز الوثائق",
  doc_hub_subtitle: "رفع وإدارة وتحليل جميع وثائق العملاء",
  doc_upload: "رفع وثيقة",
  doc_search: "البحث في الوثائق...",
  // لوحة التحكم
  dash_title: "منصة الاستشارات الذكية",
  dash_subtitle: "خدمات استشارية مدعومة بالذكاء الاصطناعي لدخول الأسواق العالمية ونمو الأعمال",
  dash_services: "الخدمات الاستشارية",
  dash_quick_stats: "نظرة عامة على المنصة",
  // التكاملات
  int_title: "التكاملات",
  int_subtitle: "ربط الأدوات ومصادر البيانات الخارجية",
  int_connect: "ربط",
  int_connected: "مرتبط",
  int_disconnect: "قطع الاتصال",
  // إدارة العملاء
  crm_title: "نظام إدارة علاقات العملاء",
  crm_subtitle: "جهات الاتصال وخط الصفقات والأنشطة — مرتبطة بالخدمات الاستشارية",
  crm_add_contact: "إضافة جهة اتصال",
  crm_contacts: "جهات الاتصال",
  crm_pipeline: "خط الصفقات",
  crm_deals: "جميع الصفقات",
  crm_activities: "الأنشطة",
  // المشاريع
  proj_title: "المشاريع",
  proj_subtitle: "إدارة حالات العملاء — من التحليل إلى التسليم",
  proj_new: "مشروع جديد",
  proj_type: "نوع المشروع",
  proj_status: "الحالة",
  proj_phase: "المرحلة",
  proj_value: "قيمة الصفقة",
  proj_deadline: "الموعد النهائي",
  proj_open_workspace: "فتح مساحة العمل",
  // المساعد الذكي
  ai_title: "المساعد الذكي",
  ai_subtitle: "فريق استشاراتك الرقمي — ٦ مستشارين ذكاء اصطناعي متخصصين",
  // التقارير
  rep_title: "منشئ التقارير",
  rep_subtitle: "تقارير استشارية احترافية مدعومة بالذكاء الاصطناعي",
  // العقارات
  re_title: "استخبارات العقارات",
  re_subtitle: "الموقع · السيناريوهات · الجدوى · القرار",
};

type Translations = typeof en;
interface I18nCtx { lang: Language; setLang: (l: Language) => void; t: Translations; isRTL: boolean; }

const I18nContext = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: en, isRTL: false });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem("lang") as Language) || "en");
  const t = lang === "ar" ? ar : en;
  const isRTL = lang === "ar";

  const setLang = (l: Language) => { setLangState(l); localStorage.setItem("lang", l); };

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [isRTL, lang]);

  return <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
