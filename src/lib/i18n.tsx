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
  back: "Back", next: "Next", status: "Status", summary: "Summary",
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
  // Clients
  clients_title: "Clients", clients_subtitle: "Manage your client portfolio and relationships",
  new_client: "New Client", add_new_client: "Add New Client",
  company_name: "Company Name", company_name_required: "Company Name *",
  industry: "Industry", revenue: "Revenue", location: "Location",
  creating: "Creating...", create_client: "Create Client",
  search_clients: "Search clients...", no_clients: "No clients found",
  health: "Health",
  // Deliverables
  deliverables_title: "Deliverables Generator", deliverables_subtitle: "AI-powered report and deliverable generation",
  choose_type: "Choose Type", select_audience: "Select Audience", configure: "Configure",
  client: "Client", select_client: "Select a client",
  tone_preview: "Tone Preview", output_format: "Output Format",
  options: "Options", include_charts: "Include charts & visualizations",
  include_appendix: "Include appendix", include_executive: "Include executive summary",
  generated: "Report Generated!", generate_another: "Generate Another",
  recent_deliverables: "Recent Deliverables",
  // Insights
  insights_title: "AI Insights", unread_insights: "unread insights",
  mark_all_read: "Mark All Read", critical: "Critical", warning: "Warning", info: "Info",
  no_insights: "No insights found", investigate: "Investigate",
  // Knowledge
  knowledge_title: "Knowledge Base", knowledge_subtitle: "Playbooks, frameworks, case studies & custom knowledge",
  playbooks: "Playbooks", frameworks: "Frameworks", case_studies: "Case Studies",
  domain_coverage: "Domain Coverage", search_playbooks: "Search playbooks...",
  no_playbooks: "No playbooks found", used: "Used ", times: " times",
  success_rate: "% success", applied_to: "Applied to",
  apply_to_client: "Select client", apply: "Apply",
  custom_knowledge: "Custom Knowledge", upload_knowledge: "Upload knowledge documents",
  drag_drop: "Drag & drop or click to browse", browse_files: "Browse Files",
  uploaded_files: "Uploaded Files", pages: "pages", applied_times: "Applied",
  output: "View Report", used_in: "Used in", analyses: "analyses",
  // Frameworks
  porters_five: "Porter's Five Forces", swot: "SWOT Analysis", value_chain: "Value Chain Analysis",
  bcg_matrix: "BCG Matrix", ansoff: "Ansoff Matrix", mckinsey_7s: "McKinsey 7S",
  blue_ocean: "Blue Ocean Strategy", balanced_scorecard: "Balanced Scorecard", pestle: "PESTLE Analysis",
  porters_desc: "Analyze competitive forces shaping industry profitability and strategic positioning.",
  swot_desc: "Evaluate Strengths, Weaknesses, Opportunities, and Threats for strategic planning.",
  value_chain_desc: "Map primary and support activities to identify competitive advantages.",
  bcg_desc: "Classify business units or products by market growth and relative market share.",
  ansoff_desc: "Evaluate growth strategies across existing and new markets/products.",
  mckinsey_desc: "Align seven organizational elements for effective strategy execution.",
  blue_ocean_desc: "Create uncontested market space by making competition irrelevant.",
  balanced_desc: "Translate strategy into measurable objectives across four perspectives.",
  pestle_desc: "Analyze Political, Economic, Social, Technological, Legal, and Environmental factors.",
  // Case Studies
  supply_chain_title: "Supply Chain Optimization — Iraq FMCG",
  digital_transform_title: "Digital Transformation — Saudi Retail",
  revenue_recovery_title: "Revenue Recovery — UAE Distribution",
  market_expansion_title: "Market Expansion — Jordan Manufacturing",
  supply_chain_desc: "Reduced logistics costs by 22% through route optimization and supplier consolidation across 3 governorates.",
  digital_transform_desc: "Launched eCommerce platform generating $36M in 12 months with omnichannel integration.",
  revenue_recovery_desc: "Recovered $8.2M through contract renegotiation and accounts receivable optimization.",
  market_expansion_desc: "Entered 4 new verticals with 158% ARR growth through strategic partnerships.",
};

const ar: typeof en = {
  nav_dashboard: "لوحة التحكم", nav_market_entry: "تحليل دخول السوق",
  nav_distributor: "إيجاد الموزعين", nav_competitor: "تحليل المنافسين",
  nav_pricing: "استخبارات التسعير", nav_risk: "تقييم المخاطر",
  nav_partner: "التوافق مع الشركاء", nav_sales: "استراتيجية المبيعات",
  nav_export: "جاهزية التصدير", nav_feasibility: "دراسة الجدوى",
  nav_agents: "وكلاء الذكاء الاصطناعي", nav_documents: "مركز الوثائق",
  nav_settings: "الإعدادات", nav_crm: "إدارة علاقات العملاء",
  nav_projects: "المشاريع", nav_tasks: "المهام والتنفيذ",
  nav_financial: "النظرة المالية الشاملة", nav_market_intel: "استخبارات السوق",
  nav_proposals: "منشئ المقترحات", nav_real_estate: "استخبارات العقارات",
  nav_service_modules: "وحدات الخدمة", nav_ai_assistant: "المساعد الذكي",
  nav_reports: "منشئ التقارير",
  group_overview: "نظرة عامة", group_services: "الخدمات الاستشارية",
  group_tools: "الأدوات والتقارير", group_intelligence: "استخبارات الأعمال",
  group_revenue: "محرك الإيرادات", group_execution: "التنفيذ والمتابعة",
  group_premium: "الوحدات المتقدمة", group_system: "إعدادات النظام",
  analyze: "تحليل", analyzing: "جارٍ التحليل...", re_analyze: "إعادة التحليل",
  loading: "جارٍ التحميل...", error: "خطأ", cancel: "إلغاء", save: "حفظ التغييرات",
  download: "تنزيل", generate: "إنشاء", generating: "جارٍ الإنشاء...",
  search: "بحث...", filter: "تصفية", all: "الكل", export: "تصدير",
  new: "جديد", view: "عرض", edit: "تعديل", delete: "حذف", close: "إغلاق",
  run: "تشغيل", running: "جارٍ التشغيل...", complete: "مكتمل", pending: "قيد الانتظار",
  back: "رجوع", next: "التالي", status: "الحالة", summary: "ملخص",
  settings_title: "الإعدادات", settings_subtitle: "إدارة تفضيلات التشغيل والتكاملات واللغة والمستندات",
  tab_language: "اللغة", tab_integrations: "التكاملات", tab_documents: "المستندات",
  tab_agents: "إعداد الوكلاء", tab_profile: "الملف الشخصي", tab_security: "الأمان",
  language_title: "اللغة والمنطقة", language_subtitle: "اختر لغة عرض المنصة",
  lang_en: "الإنجليزية", lang_ar: "العربية",
  agents_title: "مساحة وكلاء الذكاء الاصطناعي", agents_subtitle: "جميع الخدمات الاستشارية مدعومة بوكلاء ذكاء اصطناعي متخصصين",
  agent_run: "تشغيل الوكيل", agent_running: "جارٍ التشغيل...", agent_complete: "مكتمل",
  agent_idle: "جاهز", agent_accuracy: "الدقة",
  doc_hub_title: "مركز الوثائق", doc_hub_subtitle: "رفع وإدارة وتحليل جميع وثائق العملاء",
  doc_upload: "رفع وثيقة", doc_search: "البحث في الوثائق...",
  dash_title: "منصة الاستشارات الذكية",
  dash_subtitle: "خدمات استشارية مدعومة بالذكاء الاصطناعي لدخول الأسواق العالمية ونمو الأعمال",
  dash_services: "الخدمات الاستشارية", dash_quick_stats: "نظرة عامة على المنصة",
  int_title: "التكاملات", int_subtitle: "ربط الأدوات ومصادر البيانات الخارجية",
  int_connect: "ربط", int_connected: "مرتبط", int_disconnect: "قطع الاتصال",
  crm_title: "نظام إدارة علاقات العملاء",
  crm_subtitle: "جهات الاتصال وخط الصفقات والأنشطة — مرتبطة بالخدمات الاستشارية",
  crm_add_contact: "إضافة جهة اتصال", crm_contacts: "جهات الاتصال",
  crm_pipeline: "خط الصفقات", crm_deals: "جميع الصفقات", crm_activities: "الأنشطة",
  proj_title: "المشاريع", proj_subtitle: "إدارة حالات العملاء — من التحليل إلى التسليم",
  proj_new: "مشروع جديد", proj_type: "نوع المشروع", proj_status: "الحالة",
  proj_phase: "المرحلة", proj_value: "قيمة الصفقة", proj_deadline: "الموعد النهائي",
  proj_open_workspace: "فتح مساحة العمل",
  ai_title: "المساعد الذكي", ai_subtitle: "فريق استشاراتك الرقمي — ٦ مستشارين ذكاء اصطناعي متخصصين",
  rep_title: "منشئ التقارير", rep_subtitle: "تقارير استشارية احترافية مدعومة بالذكاء الاصطناعي",
  re_title: "استخبارات العقارات", re_subtitle: "الموقع · السيناريوهات · الجدوى · القرار",
  // Clients
  clients_title: "العملاء", clients_subtitle: "إدارة محفظة العملاء والعلاقات",
  new_client: "عميل جديد", add_new_client: "إضافة عميل جديد",
  company_name: "اسم الشركة", company_name_required: "اسم الشركة *",
  industry: "القطاع", revenue: "الإيرادات", location: "الموقع",
  creating: "جارٍ الإنشاء...", create_client: "إنشاء عميل",
  search_clients: "البحث عن عملاء...", no_clients: "لا يوجد عملاء",
  health: "الصحة",
  // Deliverables
  deliverables_title: "منشئ التقارير", deliverables_subtitle: "إنشاء التقارير والمخرجات بالذكاء الاصطناعي",
  choose_type: "اختر النوع", select_audience: "اختر الجمهور", configure: "تكوين",
  client: "العميل", select_client: "اختر عميل",
  tone_preview: "معاينة النبرة", output_format: "صيغة المخرج",
  options: "خيارات", include_charts: "تضمين الرسوم البيانية",
  include_appendix: "تضمين الملحق", include_executive: "تضمين الملخص التنفيذي",
  generated: "تم إنشاء التقرير!", generate_another: "إنشاء آخر",
  recent_deliverables: "المخرجات الأخيرة",
  // Insights
  insights_title: "رؤى الذكاء الاصطناعي", unread_insights: "رؤى غير مقروءة",
  mark_all_read: "تحديد الكل كمقروء", critical: "حرج", warning: "تحذير", info: "معلومات",
  no_insights: "لا توجد رؤى", investigate: "تحقيق",
  // Knowledge
  knowledge_title: "قاعدة المعرفة", knowledge_subtitle: "الأدلة والأطر والدراسات والمعرفة المخصصة",
  playbooks: "الأدلة", frameworks: "الأطر", case_studies: "دراسات الحالة",
  domain_coverage: "تغطية المجال", search_playbooks: "البحث في الأدلة...",
  no_playbooks: "لا توجد أدلة", used: "استُخدم ", times: " مرة",
  success_rate: "% نجاح", applied_to: "طُبّق على",
  apply_to_client: "اختر عميل", apply: "تطبيق",
  custom_knowledge: "معرفة مخصصة", upload_knowledge: "رفع وثائق معرفية",
  drag_drop: "اسحب وأفلت أو انقر للاستعراض", browse_files: "استعراض الملفات",
  uploaded_files: "الملفات المرفوعة", pages: "صفحات", applied_times: "طُبّق",
  output: "عرض التقرير", used_in: "استُخدم في", analyses: "تحليلات",
  porters_five: "قوى بورتر الخمس", swot: "تحليل SWOT", value_chain: "تحليل سلسلة القيمة",
  bcg_matrix: "مصفوفة BCG", ansoff: "مصفوفة أنسوف", mckinsey_7s: "نموذج ماكينزي 7S",
  blue_ocean: "استراتيجية المحيط الأزرق", balanced_scorecard: "بطاقة الأداء المتوازن", pestle: "تحليل PESTLE",
  porters_desc: "تحليل القوى التنافسية التي تشكل ربحية الصناعة والتموضع الاستراتيجي.",
  swot_desc: "تقييم نقاط القوة والضعف والفرص والتهديدات للتخطيط الاستراتيجي.",
  value_chain_desc: "رسم خريطة الأنشطة الرئيسية والداعمة لتحديد المزايا التنافسية.",
  bcg_desc: "تصنيف وحدات الأعمال حسب نمو السوق والحصة السوقية النسبية.",
  ansoff_desc: "تقييم استراتيجيات النمو عبر الأسواق والمنتجات الحالية والجديدة.",
  mckinsey_desc: "مواءمة سبعة عناصر تنظيمية لتنفيذ فعال للاستراتيجية.",
  blue_ocean_desc: "إنشاء مساحة سوقية غير متنازع عليها بجعل المنافسة غير ذات صلة.",
  balanced_desc: "ترجمة الاستراتيجية إلى أهداف قابلة للقياس عبر أربعة محاور.",
  pestle_desc: "تحليل العوامل السياسية والاقتصادية والاجتماعية والتكنولوجية والقانونية والبيئية.",
  supply_chain_title: "تحسين سلسلة التوريد — العراق FMCG",
  digital_transform_title: "التحول الرقمي — التجزئة السعودية",
  revenue_recovery_title: "استرداد الإيرادات — التوزيع الإماراتي",
  market_expansion_title: "التوسع السوقي — التصنيع الأردني",
  supply_chain_desc: "خفض تكاليف اللوجستيات بنسبة 22% من خلال تحسين المسارات وتوحيد الموردين.",
  digital_transform_desc: "إطلاق منصة تجارة إلكترونية حققت 36 مليون دولار في 12 شهراً.",
  revenue_recovery_desc: "استرداد 8.2 مليون دولار من خلال إعادة التفاوض على العقود.",
  market_expansion_desc: "دخول 4 قطاعات جديدة بنمو 158% من خلال شراكات استراتيجية.",
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
