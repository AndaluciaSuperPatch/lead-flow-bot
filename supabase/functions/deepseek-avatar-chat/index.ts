
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
    const { question, avatar } = await req.json();
    if (!question || !avatar)
      return new Response(JSON.stringify({ error: "Faltan datos." }), { headers: corsHeaders, status: 400 });

    const systemPrompt = AVATAR_PROMPTS[avatar] || AVATAR_PROMPTS.pelirroja;

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

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return new Response(JSON.stringify({ error: text }), {
        headers: corsHeaders,
        status: 500,
      });
    }

    const resp = await apiRes.json();
    const answer =
      resp.choices?.[0]?.message?.content ||
      "No he podido generar una respuesta ahora mismo.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Error interno de función." }),
      { headers: corsHeaders, status: 500 },
    );
  }
});
