
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

const AVATAR_PROMPTS: Record<string, string> = {
  pelirroja:
    "Responde siempre como una joven deportista pelirroja española, entusiasta, simpática y con energía positiva. Habla de forma amigable, breve, no uses tecnicismos, y acércate a la persona. Si puedes, usa algunos emojis.",
  ejecutivo:
    "Responde siempre como un ejecutivo joven, moreno, formal y optimista. Sé educado, directo y profesional, pero cercano. Si puedes, usa algún emoji amistoso.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    let log: Record<string, unknown> = { step: "init" };
    // Log entrada request
    const { question, avatar } = await req.json();
    log.step = "parsed_body";
    log.question = question;
    log.avatar = avatar;

    if (!DEEPSEEK_API_KEY) {
      log.error = "DEEPSEEK_API_KEY no configurada";
      console.error(log);
      return new Response(JSON.stringify({ error: "API Key de DeepSeek no configurada en servidor." }), { headers: corsHeaders, status: 500 });
    }

    if (!question || !avatar) {
      log.error = "Faltan datos question/avatar";
      console.error(log);
      return new Response(JSON.stringify({ error: "Faltan datos." }), { headers: corsHeaders, status: 400 });
    }

    const systemPrompt = AVATAR_PROMPTS[avatar] || AVATAR_PROMPTS.pelirroja;

    // Log datos para DeepSeek
    log.step = "fetching_deepseek";
    const apiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_tokens: 350,
        temperature: 0.8,
        top_p: 0.98,
      }),
    });

    log.deepseek_status = apiRes.status;

    if (!apiRes.ok) {
      const text = await apiRes.text();
      log.error = "Respuesta DeepSeek NO OK";
      log.deepseek_response = text;
      console.error(log);
      return new Response(JSON.stringify({ error: "Error DeepSeek: " + text }), {
        headers: corsHeaders,
        status: 500,
      });
    }

    const resp = await apiRes.json();
    log.step = "deepseek_response_parsed";
    log.deepseek_response = resp;

    const answer =
      resp.choices?.[0]?.message?.content ||
      "No he podido generar una respuesta ahora mismo.";

    log.result = answer;
    console.log(log);

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    let log: Record<string, unknown> = { step: "catch", error: e?.message || e?.toString() };
    console.error(log);
    return new Response(
      JSON.stringify({ error: "Error interno de función: " + (e?.message || e?.toString()) }),
      { headers: corsHeaders, status: 500 },
    );
  }
});
