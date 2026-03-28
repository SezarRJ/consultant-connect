// ─────────────────────────────────────────────────────────────────────────────
// aiConfig.ts  –  Central AI configuration store (persisted in localStorage)
// ─────────────────────────────────────────────────────────────────────────────

export type AnthropicModel =
  | "claude-opus-4-5"
  | "claude-sonnet-4-5"
  | "claude-haiku-4-5"
  | "claude-opus-4-5-20251101"
  | "claude-sonnet-4-20250514"
  | "claude-haiku-3-5-20241022";

export type PerplexityModel =
  | "sonar-pro"
  | "sonar"
  | "sonar-reasoning-pro"
  | "sonar-reasoning";

export type TavilyMode = "search" | "extract";

export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  docsUrl: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  purpose: string[];
  category: "llm" | "search" | "data" | "vision";
}

export interface AIConfig {
  // API Keys
  anthropicKey: string;
  perplexityKey: string;
  tavilyKey: string;
  openaiKey: string;
  serpapiKey: string;
  firecrawlKey: string;

  // Model selection
  anthropicModel: AnthropicModel;
  perplexityModel: PerplexityModel;

  // Feature flags
  webSearchEnabled: boolean;       // Perplexity/Tavily for live market data
  streamingEnabled: boolean;       // SSE streaming responses
  webSearchProvider: "perplexity" | "tavily" | "serpapi";

  // Behaviour
  maxTokens: number;
  temperature: number;             // 0-1
  responseDepth: "brief" | "standard" | "detailed";

  // Per-agent overrides  { agentId: { model, depth, webSearch } }
  agentOverrides: Record<string, Partial<AgentOverride>>;
}

export interface AgentOverride {
  model: AnthropicModel;
  depth: "brief" | "standard" | "detailed";
  webSearch: boolean;
  enabled: boolean;
}

const STORAGE_KEY = "consultai_ai_config";

const DEFAULTS: AIConfig = {
  anthropicKey: "",
  perplexityKey: "",
  tavilyKey: "",
  openaiKey: "",
  serpapiKey: "",
  firecrawlKey: "",
  anthropicModel: "claude-sonnet-4-20250514",
  perplexityModel: "sonar-pro",
  webSearchEnabled: false,
  streamingEnabled: true,
  webSearchProvider: "perplexity",
  maxTokens: 4000,
  temperature: 0.3,
  responseDepth: "detailed",
  agentOverrides: {},
};

export function loadAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getApiKey(config: AIConfig, provider: keyof Pick<AIConfig, "anthropicKey" | "perplexityKey" | "tavilyKey" | "openaiKey" | "serpapiKey" | "firecrawlKey">): string {
  return config[provider] || "";
}

export const ANTHROPIC_MODELS: { id: AnthropicModel; label: string; tier: "flagship" | "balanced" | "fast"; contextK: number; desc: string }[] = [
  { id: "claude-opus-4-5",          label: "Claude Opus 4.5",     tier: "flagship", contextK: 200, desc: "Most capable – complex multi-step reasoning" },
  { id: "claude-sonnet-4-20250514",  label: "Claude Sonnet 4",     tier: "balanced", contextK: 200, desc: "Best speed/intelligence balance – recommended" },
  { id: "claude-sonnet-4-5",        label: "Claude Sonnet 4.5",   tier: "balanced", contextK: 200, desc: "Latest Sonnet – enhanced agentic performance" },
  { id: "claude-haiku-4-5",         label: "Claude Haiku 4.5",    tier: "fast",     contextK: 200, desc: "Ultra-fast responses, cost-efficient" },
  { id: "claude-haiku-3-5-20241022",label: "Claude Haiku 3.5",    tier: "fast",     contextK: 200, desc: "Fastest – great for simple lookups" },
];

export const PERPLEXITY_MODELS: { id: PerplexityModel; label: string; desc: string }[] = [
  { id: "sonar-pro",           label: "Sonar Pro",           desc: "Best accuracy for market research queries" },
  { id: "sonar",               label: "Sonar",               desc: "Fast web search for live data" },
  { id: "sonar-reasoning-pro", label: "Sonar Reasoning Pro", desc: "Deep reasoning over web sources" },
  { id: "sonar-reasoning",     label: "Sonar Reasoning",     desc: "Reasoning with web search" },
];

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "anthropic", name: "Gemini via Lovable AI Gateway", icon: "✨",
    description: "Actual primary AI runtime used by the app. Advisory agents and structured analyses are served through the Lovable AI Gateway backed by Gemini model tiers.",
    docsUrl: "https://lovable.dev/",
    apiKeyLabel: "Gateway Managed Server-Side", apiKeyPlaceholder: "No manual key required in this screen",
    purpose: ["All advisory agents", "Gemini tier routing", "Structured outputs via Supabase edge function"],
    category: "llm",
  },
  {
    id: "perplexity", name: "Perplexity AI", icon: "🔍",
    description: "Real-time web search for live market data, current pricing, and up-to-date competitor intelligence. Recommended for market research accuracy.",
    docsUrl: "https://www.perplexity.ai/settings/api",
    apiKeyLabel: "Perplexity API Key", apiKeyPlaceholder: "pplx-...",
    purpose: ["Live market data", "Current pricing", "News & competitor updates"],
    category: "search",
  },
  {
    id: "tavily", name: "Tavily Search", icon: "🌐",
    description: "AI-optimised web search API designed specifically for LLM agents. Provides structured search results for market intelligence tasks.",
    docsUrl: "https://tavily.com/",
    apiKeyLabel: "Tavily API Key", apiKeyPlaceholder: "tvly-...",
    purpose: ["Agent web research", "Structured search results", "Deep content extraction"],
    category: "search",
  },
  {
    id: "openai", name: "OpenAI GPT-4o", icon: "🤖",
    description: "Optional fallback LLM. Used for vision tasks such as reading uploaded images, charts, and document screenshots.",
    docsUrl: "https://platform.openai.com/api-keys",
    apiKeyLabel: "OpenAI API Key", apiKeyPlaceholder: "sk-...",
    purpose: ["Vision / image reading", "Fallback LLM", "Embeddings"],
    category: "vision",
  },
  {
    id: "serpapi", name: "SerpAPI", icon: "📊",
    description: "Google Search API for pulling SERP data, Google Trends, and real-time pricing intelligence from search engine results.",
    docsUrl: "https://serpapi.com/manage-api-key",
    apiKeyLabel: "SerpAPI Key", apiKeyPlaceholder: "...",
    purpose: ["Google search results", "Google Trends", "Price monitoring"],
    category: "search",
  },
  {
    id: "firecrawl", name: "Firecrawl", icon: "🔥",
    description: "Web scraping API that converts any webpage to clean LLM-ready markdown. Used for extracting competitor websites and market reports.",
    docsUrl: "https://www.firecrawl.dev/app/api-keys",
    apiKeyLabel: "Firecrawl API Key", apiKeyPlaceholder: "fc-...",
    purpose: ["Web scraping", "Competitor site extraction", "Report parsing"],
    category: "data",
  },
];
