
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Función auxiliar para validar formato de API Key
function isValidApiKey(key?: string): boolean {
  return !!key && typeof key === "string" && /^AIza[0-9A-Za-z\-_]{30,}$/.test(key);
}

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
    // Validación de entrada
    let dataReq: { input?: string, prompt?: string };
    try {
      dataReq = await req.json();
      if (!dataReq || typeof dataReq.input !== "string" || typeof dataReq.prompt !== "string") {
        return new Response(JSON.stringify({ error: "Parámetros inválidos: input y prompt requeridos." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido en la petición." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validación estricta de API KEY
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "No existe clave Gemini configurada en el servidor." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (!isValidApiKey(GEMINI_API_KEY)) {
      return new Response(JSON.stringify({ error: "La clave Gemini del servidor es inválida o no tiene formato correcto (debe empezar por AIza...)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Validación del input del usuario
    if (dataReq.input.trim().length === 0) {
      return new Response(JSON.stringify({ error: "El mensaje a Gemini no puede estar vacío." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Llamada a Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: dataReq.prompt }, { text: dataReq.input }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 600,
      },
    });

    // Intenta la llamada y captura posibles errores
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // Parseo seguro de la respuesta
    let data;
    try {
      data = await geminiRes.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: "No se pudo interpretar la respuesta de Google Gemini." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Errores de autenticación típicos
    if (data.error?.code === 403 || data.error?.message?.includes("API key not valid")) {
      return new Response(JSON.stringify({ error: "La clave Gemini es incorrecta, ha sido revocada o tiene restricciones de uso. ¿La has copiado completa y válida desde Google AI Studio?" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Mensaje por rechazo de "referer" (debería estar ya solucionado vía Edge Function)
    if (data.error?.message?.includes("Requests from referer")) {
      return new Response(JSON.stringify({
        error: "¡Atención! La API Key está bien, pero Google la ha restringido por dominio de referer. Genera una nueva API Key sin restricciones de referer en AI Studio: https://aistudio.google.com/app/apikey"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!geminiRes.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ error: data.error?.message ?? "Gemini no ha respondido correctamente. Intenta de nuevo." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // OK
    return new Response(
      JSON.stringify({ text: data.candidates[0].content.parts[0].text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[gemini-avatar-chat] Error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Error interno Gemini (desconocido)." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
