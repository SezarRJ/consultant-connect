import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ar";

export interface Translations {
  nav_dashboard: string; nav_clients: string; nav_knowledge: string;
  nav_agents: string; nav_insights: string; nav_deliverables: string; nav_settings: string;
  dashboard_title: string; dashboard_subtitle: string; active_engagements: string;
  view_all: string; ai_opportunity_radar: string; explore_idea: string;
  clients_title: string; clients_subtitle: string; new_client: string;
  search_clients: string; status: string; industry: string; all: string;
  add_new_client: string; company_name: string; company_name_required: string;
  location: string; revenue: string; create_client: string; creating: string;
  health: string; no_clients: string;
  knowledge_title: string; knowledge_subtitle: string; playbooks: string;
  frameworks: string; case_studies: string; custom_knowledge: string;
  search_playbooks: string; no_playbooks: string; apply_to_client: string;
  apply: string; applied_to: string; upload_knowledge: string; drag_drop: string;
  browse_files: string; uploaded_files: string; used_in: string; analyses: string;
  domain_coverage: string; success_rate: string; used: string; times: string;
  agents_title: string; agents_subtitle: string; run_analysis: string;
  running: string; total_agents: string; active_now: string; tasks_today: string;
  avg_accuracy: string; live_activity: string; no_activity: string;
  consolidated_results: string; key_findings: string; strategy_options: string;
  simulations: string; roadmap: string; output: string; trace: string;
  insights_title: string; unread_insights: string; mark_all_read: string;
  critical: string; warning: string; info: string; no_insights: string; investigate: string;
  deliverables_title: string; deliverables_subtitle: string; choose_type: string;
  select_audience: string; configure: string; client: string; select_client: string;
  output_format: string; options: string; include_charts: string;
  include_appendix: string; include_executive: string; generate: string;
  generating: string; generated: string; download: string; generate_another: string;
  recent_deliverables: string; summary: string; tone_preview: string; next: string; back: string;
  settings_title: string; settings_subtitle: string; profile: string; alerts: string;
  integrations: string; security: string; calibration: string; save_changes: string;
  loading: string; error: string; cancel: string; complete: string; pending: string;
  on_track: string; needs_attention: string; behind: string; at_risk: string;
  due: string; published: string; pages: string; applied_times: string;
  supply_chain_title: string; digital_transform_title: string;
  revenue_recovery_title: string; market_expansion_title: string;
  porters_five: string; swot: string; value_chain: string; bcg_matrix: string;
  ansoff: string; mckinsey_7s: string; blue_ocean: string;
  balanced_scorecard: string; pestle: string;
  porters_desc: string; swot_desc: string; value_chain_desc: string; bcg_desc: string;
  ansoff_desc: string; mckinsey_desc: string; blue_ocean_desc: string;
  balanced_desc: string; pestle_desc: string;
  supply_chain_desc: string; digital_transform_desc: string;
  revenue_recovery_desc: string; market_expansion_desc: string;
}

const en: Translations = {
  nav_dashboard: "Dashboard", nav_clients: "Clients", nav_knowledge: "Knowledge Base",
  nav_agents: "AI Agents", nav_insights: "Insights", nav_deliverables: "Deliverables",
  nav_settings: "Settings",
  dashboard_title: "Dashboard", dashboard_subtitle: "Overview of active engagements and AI insights.",
  active_engagements: "Active Engagements", view_all: "View All",
  ai_opportunity_radar: "AI Opportunity Radar", explore_idea: "Explore Idea",
  clients_title: "Clients", clients_subtitle: "Manage and view all client engagements.",
  new_client: "New Client", search_clients: "Search clients...",
  status: "Status", industry: "Industry", all: "All",
  add_new_client: "Add New Client", company_name: "Company Name",
  company_name_required: "Company Name *", location: "Location",
  revenue: "Revenue", create_client: "Create Client", creating: "Creating...",
  health: "Health", no_clients: "No clients match your filters.",
  knowledge_title: "Knowledge Base", knowledge_subtitle: "Manage playbooks, frameworks, and case studies.",
  playbooks: "Playbooks", frameworks: "Frameworks", case_studies: "Case Studies",
  custom_knowledge: "Custom Knowledge", search_playbooks: "Search playbooks...",
  no_playbooks: "No playbooks match your search.", apply_to_client: "Apply to client...",
  apply: "Apply", applied_to: "Applied to",
  upload_knowledge: "Upload Custom Knowledge",
  drag_drop: "Drag & drop files or click to browse. Supports PDF, DOCX, XLSX, CSV.",
  browse_files: "Browse Files", uploaded_files: "Uploaded Files",
  used_in: "Used in", analyses: "analyses", domain_coverage: "Domain Coverage",
  success_rate: "% success", used: "Used", times: "x",
  agents_title: "AI Agent Workspace",
  agents_subtitle: "Monitor and manage AI analysis agents.",
  run_analysis: "Run Analysis", running: "Running...",
  total_agents: "Total Agents", active_now: "Active Now",
  tasks_today: "Tasks Today", avg_accuracy: "Avg Accuracy",
  live_activity: "Live Activity Feed", no_activity: "No activity for this client yet.",
  consolidated_results: "Consolidated Results", key_findings: "Key Findings",
  strategy_options: "Strategy Options", simulations: "Simulations",
  roadmap: "Roadmap", output: "Output", trace: "Trace",
  insights_title: "Insights", unread_insights: "unread insights across all clients.",
  mark_all_read: "Mark All Read", critical: "Critical", warning: "Warning",
  info: "Info", no_insights: "No insights match your filter.", investigate: "Investigate",
  deliverables_title: "Deliverable Generator",
  deliverables_subtitle: "Create polished reports and presentations.",
  choose_type: "Choose Type", select_audience: "Select Audience", configure: "Configure",
  client: "Client", select_client: "Select client", output_format: "Output Format",
  options: "Options", include_charts: "Include charts & visualizations",
  include_appendix: "Include data appendix", include_executive: "Include executive summary",
  generate: "Generate Deliverable", generating: "Generating...",
  generated: "Deliverable Generated!", download: "Download",
  generate_another: "Generate Another", recent_deliverables: "Recent Deliverables",
  summary: "Summary", tone_preview: "Tone Preview", next: "Next", back: "Back",
  settings_title: "Settings", settings_subtitle: "Manage your account and preferences.",
  profile: "Profile", alerts: "Alerts", integrations: "Integrations",
  security: "Security", calibration: "Calibration", save_changes: "Save Changes",
  loading: "Loading...", error: "Error", cancel: "Cancel", complete: "Complete",
  pending: "Pending", on_track: "On Track", needs_attention: "Needs Attention",
  behind: "Behind", at_risk: "At Risk", due: "Due", published: "Published",
  pages: "pages", applied_times: "Applied",
  supply_chain_title: "Supply Chain Optimization — Manufacturing Sector",
  digital_transform_title: "Digital Transformation — Retail Industry",
  revenue_recovery_title: "Revenue Recovery — Distribution Company",
  market_expansion_title: "Market Expansion — SaaS Platform",
  porters_five: "Porter's Five Forces", swot: "SWOT Analysis",
  value_chain: "Value Chain Analysis", bcg_matrix: "BCG Matrix",
  ansoff: "Ansoff Matrix", mckinsey_7s: "McKinsey 7S",
  blue_ocean: "Blue Ocean Strategy", balanced_scorecard: "Balanced Scorecard",
  pestle: "PESTLE Analysis",
  porters_desc: "Analyze competitive forces: supplier power, buyer power, rivalry, threat of substitution, and new entrants.",
  swot_desc: "Identify Strengths, Weaknesses, Opportunities, and Threats for a clear strategic picture.",
  value_chain_desc: "Map primary and support activities to identify where value is created and where efficiency can improve.",
  bcg_desc: "Portfolio tool classifying products by market growth and relative share: Stars, Cash Cows, Dogs, Question Marks.",
  ansoff_desc: "Growth matrix: Market Penetration, Product Development, Market Development, and Diversification.",
  mckinsey_desc: "Seven elements: Strategy, Structure, Systems, Shared Values, Style, Staff, and Skills.",
  blue_ocean_desc: "Create uncontested market space by making the competition irrelevant through value innovation.",
  balanced_desc: "Performance management covering Financial, Customer, Internal Process, and Learning & Growth.",
  pestle_desc: "Macro-environment: Political, Economic, Social, Technological, Legal, and Environmental factors.",
  supply_chain_desc: "Reduced supply chain costs 22% and improved on-time delivery from 78% to 96% for a Tier-1 auto parts manufacturer.",
  digital_transform_desc: "Led digital transformation for a $200M retailer, growing e-commerce revenue 45% in 18 months.",
  revenue_recovery_desc: "Recovered $8.2M for a distribution company by renegotiating 12 key accounts and restructuring last-mile ops.",
  market_expansion_desc: "Enabled a SaaS platform to enter 4 new verticals, growing ARR from $12M to $31M in 24 months.",
};

const ar: Translations = {
  nav_dashboard: "لوحة التحكم", nav_clients: "العملاء", nav_knowledge: "قاعدة المعرفة",
  nav_agents: "وكلاء الذكاء الاصطناعي", nav_insights: "الرؤى", nav_deliverables: "المخرجات",
  nav_settings: "الإعدادات",
  dashboard_title: "لوحة التحكم", dashboard_subtitle: "نظرة عامة على المشاركات النشطة ورؤى الذكاء الاصطناعي.",
  active_engagements: "المشاركات النشطة", view_all: "عرض الكل",
  ai_opportunity_radar: "رادار فرص الذكاء الاصطناعي", explore_idea: "استكشاف الفكرة",
  clients_title: "العملاء", clients_subtitle: "إدارة وعرض جميع مشاركات العملاء.",
  new_client: "عميل جديد", search_clients: "البحث عن عملاء...",
  status: "الحالة", industry: "القطاع", all: "الكل",
  add_new_client: "إضافة عميل جديد", company_name: "اسم الشركة",
  company_name_required: "اسم الشركة *", location: "الموقع",
  revenue: "الإيرادات", create_client: "إنشاء عميل", creating: "جارٍ الإنشاء...",
  health: "الصحة", no_clients: "لا يوجد عملاء يطابقون الفلاتر.",
  knowledge_title: "قاعدة المعرفة", knowledge_subtitle: "إدارة كتيبات التشغيل والأطر ودراسات الحالة.",
  playbooks: "كتيبات التشغيل", frameworks: "الأطر الاستراتيجية",
  case_studies: "دراسات الحالة", custom_knowledge: "المعرفة المخصصة",
  search_playbooks: "البحث في كتيبات التشغيل...",
  no_playbooks: "لا توجد كتيبات تطابق البحث.", apply_to_client: "تطبيق على عميل...",
  apply: "تطبيق", applied_to: "تم التطبيق على",
  upload_knowledge: "رفع معرفة مخصصة",
  drag_drop: "اسحب وأفلت الملفات أو انقر للتصفح. يدعم PDF وDOCX وXLSX وCSV.",
  browse_files: "استعراض الملفات", uploaded_files: "الملفات المرفوعة",
  used_in: "مستخدم في", analyses: "تحليل", domain_coverage: "تغطية المجال",
  success_rate: "% نجاح", used: "استُخدم", times: "×",
  agents_title: "مساحة وكلاء الذكاء الاصطناعي",
  agents_subtitle: "مراقبة وإدارة وكلاء تحليل الذكاء الاصطناعي.",
  run_analysis: "تشغيل التحليل", running: "جارٍ التشغيل...",
  total_agents: "إجمالي الوكلاء", active_now: "نشط الآن",
  tasks_today: "مهام اليوم", avg_accuracy: "متوسط الدقة",
  live_activity: "سجل النشاط المباشر", no_activity: "لا يوجد نشاط لهذا العميل حتى الآن.",
  consolidated_results: "النتائج الموحدة", key_findings: "الاكتشافات الرئيسية",
  strategy_options: "خيارات الاستراتيجية", simulations: "المحاكاة",
  roadmap: "خارطة الطريق", output: "المخرجات", trace: "التتبع",
  insights_title: "الرؤى والتحليلات", unread_insights: "رؤية غير مقروءة عبر جميع العملاء.",
  mark_all_read: "تحديد الكل كمقروء", critical: "حرجة", warning: "تحذير",
  info: "معلومات", no_insights: "لا توجد رؤى تطابق الفلتر.", investigate: "التحقيق",
  deliverables_title: "مولّد المخرجات",
  deliverables_subtitle: "إنشاء تقارير وعروض تقديمية متقنة.",
  choose_type: "اختيار النوع", select_audience: "اختيار الجمهور", configure: "الإعدادات",
  client: "العميل", select_client: "اختر عميلاً", output_format: "صيغة الإخراج",
  options: "الخيارات", include_charts: "تضمين الرسوم البيانية",
  include_appendix: "تضمين ملحق البيانات", include_executive: "تضمين الملخص التنفيذي",
  generate: "إنشاء المخرج", generating: "جارٍ الإنشاء...",
  generated: "تم إنشاء المخرج!", download: "تنزيل",
  generate_another: "إنشاء آخر", recent_deliverables: "المخرجات الأخيرة",
  summary: "الملخص", tone_preview: "معاينة الأسلوب", next: "التالي", back: "رجوع",
  settings_title: "الإعدادات", settings_subtitle: "إدارة حسابك وتفضيلاتك.",
  profile: "الملف الشخصي", alerts: "التنبيهات", integrations: "التكاملات",
  security: "الأمان", calibration: "المعايرة", save_changes: "حفظ التغييرات",
  loading: "جارٍ التحميل...", error: "خطأ", cancel: "إلغاء", complete: "مكتمل",
  pending: "قيد الانتظار", on_track: "على المسار", needs_attention: "يحتاج اهتماماً",
  behind: "متأخر", at_risk: "في خطر", due: "موعد الاستحقاق",
  published: "نُشر", pages: "صفحة", applied_times: "طُبِّق",
  supply_chain_title: "تحسين سلسلة التوريد — قطاع التصنيع",
  digital_transform_title: "التحول الرقمي — قطاع التجزئة",
  revenue_recovery_title: "استعادة الإيرادات — شركة توزيع",
  market_expansion_title: "التوسع في السوق — منصة SaaS",
  porters_five: "قوى بورتر الخمس", swot: "تحليل SWOT",
  value_chain: "تحليل سلسلة القيمة", bcg_matrix: "مصفوفة BCG",
  ansoff: "مصفوفة أنسوف", mckinsey_7s: "نموذج ماكنزي 7S",
  blue_ocean: "استراتيجية المحيط الأزرق", balanced_scorecard: "بطاقة الأداء المتوازن",
  pestle: "تحليل PESTLE",
  porters_desc: "تحليل القوى التنافسية: قوة الموردين والمشترين والمنافسة وتهديد البدائل والداخلين الجدد.",
  swot_desc: "تحديد نقاط القوة والضعف والفرص والتهديدات لبناء صورة استراتيجية واضحة.",
  value_chain_desc: "رسم خريطة الأنشطة الأساسية والداعمة لتحديد مصادر القيمة وتحسين الكفاءة.",
  bcg_desc: "أداة إدارة محفظة المنتجات: نجوم، أبقار نقدية، كلاب، وعلامات استفهام.",
  ansoff_desc: "مصفوفة النمو: اختراق السوق، تطوير المنتج، تطوير السوق، والتنويع.",
  mckinsey_desc: "سبعة عناصر: الاستراتيجية، الهيكل، الأنظمة، القيم، الأسلوب، الكوادر، والمهارات.",
  blue_ocean_desc: "إنشاء فضاء سوقي غير متنازع عليه من خلال ابتكار القيمة وجعل المنافسة غير ذات صلة.",
  balanced_desc: "إدارة الأداء: المالية، العملاء، العمليات الداخلية، والتعلم والنمو.",
  pestle_desc: "تحليل البيئة الكلية: السياسية والاقتصادية والاجتماعية والتكنولوجية والقانونية والبيئية.",
  supply_chain_desc: "خفضنا تكاليف سلسلة التوريد 22% وحسّنا التسليم في الوقت المحدد من 78% إلى 96% لمصنع سيارات.",
  digital_transform_desc: "قدنا تحولاً رقمياً لتاجر تجزئة 200 مليون دولار، رافعين إيرادات التجارة الإلكترونية 45% في 18 شهراً.",
  revenue_recovery_desc: "استعدنا 8.2 مليون دولار لشركة توزيع عبر إعادة التفاوض على 12 حساباً رئيسياً.",
  market_expansion_desc: "مكّنّا منصة SaaS من دخول 4 قطاعات جديدة، رافعين الإيرادات السنوية من 12 إلى 31 مليون دولار.",
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const t = lang === "ar" ? ar : en;
  const isRTL = lang === "ar";

  // Apply dir and font to document root to avoid layout-breaking wrapper div
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.classList.toggle("font-arabic", isRTL);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
