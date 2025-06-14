
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { input, prompt } = await req.json();
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "No Gemini API key configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Llamada a Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { text: input }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 600,
      },
    });

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await geminiRes.json();
    if (!geminiRes.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error(data.error?.message ?? "Respuesta de Gemini no válida.");
    }

    return new Response(
      JSON.stringify({ text: data.candidates[0].content.parts[0].text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[gemini-avatar-chat] Error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Error interno Gemini." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
