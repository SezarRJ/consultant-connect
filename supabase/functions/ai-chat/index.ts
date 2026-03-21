import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Model tiers
const MODELS: Record<string, string> = {
  "flash-lite": "google/gemini-2.5-flash-lite",
  "flash":      "google/gemini-2.5-flash",
  "pro":        "google/gemini-2.5-pro",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const start = Date.now();

  try {
    const {
      system,
      messages,
      stream = false,
      maxTokens = 4000,
      modelTier = "flash-lite",
      tools,
      tool_choice,
      reasoning,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const model = MODELS[modelTier] || MODELS["flash-lite"];

    const body: Record<string, unknown> = {
      model,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages,
      ],
      max_tokens: maxTokens,
      stream,
    };

    // Tool calling for structured JSON output
    if (tools) {
      body.tools = tools;
      if (tool_choice) body.tool_choice = tool_choice;
    }

    // Thinking budget for complex analyses
    if (reasoning) {
      body.reasoning = reasoning;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error:", status, text);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "X-Model-Used": model,
          "X-Response-Start-Ms": String(Date.now() - start),
        },
      });
    }

    const data = await response.json();
    const elapsed = Date.now() - start;

    return new Response(JSON.stringify({ ...data, _meta: { model, elapsedMs: elapsed } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
