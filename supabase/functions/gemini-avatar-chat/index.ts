
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

// Función para proteger la clave (logging seguro, sólo muestra partes)
function safeKeyLog(k: string | undefined) {
  if (!k) return "[NO_KEY]";
  if (k.length < 8) return "[SHORT]";
  return `${k.slice(0, 4)}...${k.slice(-4)}` + ` (len:${k.length})`;
}

serve(async (req) => {
  const timeStart = new Date().toISOString();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.warn(`[${timeStart}] [WARN] Método NO permitido: ${req.method}`);
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Logging de payload recibido
    let dataReq: { input?: string, prompt?: string } = {};
    try {
      dataReq = await req.json();
      console.log(`[${timeStart}] [RECV] Payload recibido:`, JSON.stringify(dataReq));
      if (!dataReq || typeof dataReq.input !== "string" || typeof dataReq.prompt !== "string") {
        console.error(`[${timeStart}] [BADREQ] input o prompt inválidos`);
        return new Response(JSON.stringify({ error: "Parámetros inválidos: input y prompt requeridos." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      console.error(`[${timeStart}] [ERROR] JSON inválido en la petición:`, err?.message || err);
      return new Response(JSON.stringify({ error: "JSON inválido en la petición." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Logging de la clave api (nunca se imprime entera)
    console.log(`[${timeStart}] [INFO] Clave GEMINI_API_KEY en backend: ${safeKeyLog(GEMINI_API_KEY)}`);

    // Validación estricta de API KEY
    if (!GEMINI_API_KEY) {
      console.error(`[${timeStart}] [ERROR] No existe clave Gemini configurada en el servidor.`);
      return new Response(JSON.stringify({ error: "No existe clave Gemini configurada en el servidor." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (!isValidApiKey(GEMINI_API_KEY)) {
      console.error(
        `[${timeStart}] [ERROR] Formato de clave GEMINI inválido: ${safeKeyLog(GEMINI_API_KEY)}`
      );
      return new Response(JSON.stringify({ error: "La clave Gemini del servidor es inválida o no tiene formato correcto (debe empezar por AIza...)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Validación del input del usuario
    if (dataReq.input.trim().length === 0) {
      console.warn(`[${timeStart}] [WARN] input a Gemini vacío`);
      return new Response(JSON.stringify({ error: "El mensaje a Gemini no puede estar vacío." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Llamada a Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const sendBody = {
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
    };
    const body = JSON.stringify(sendBody);

    // Logging de request a Google Gemini
    console.log(`[${timeStart}] [SEND] POST to Gemini: url=${geminiUrl}, body=${body.length} bytes`);

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
      console.error(`[${timeStart}] [ERROR] No se pudo interpretar respuesta JSON de Gemini`, error);
      return new Response(JSON.stringify({ error: "No se pudo interpretar la respuesta de Google Gemini." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Logging de la respuesta completa
    console.log(`[${timeStart}] [RESP] Google Gemini raw response:`, JSON.stringify(data));

    // Errores de autenticación típicos
    if (data.error?.code === 403 || data.error?.message?.includes("API key not valid")) {
      console.error(`[${timeStart}] [ERROR] Clave Gemini inválida/restringida`);
      return new Response(JSON.stringify({ error: "La clave Gemini es incorrecta, ha sido revocada o tiene restricciones de uso. ¿La has copiado completa y válida desde Google AI Studio?" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Mensaje por rechazo de "referer" (debería estar ya solucionado vía Edge Function)
    if (data.error?.message?.includes("Requests from referer")) {
      console.error(`[${timeStart}] [ERROR] Clave Gemini restringida por REFERER`);
      return new Response(JSON.stringify({
        error: "¡Atención! La API Key está bien, pero Google la ha restringido por dominio de referer. Genera una nueva API Key sin restricciones de referer en AI Studio: https://aistudio.google.com/app/apikey"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!geminiRes.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error(`[${timeStart}] [ERROR] Gemini no ha respondido correctamente. Detalle: ${data.error?.message ?? "(empty)"}`);
      return new Response(JSON.stringify({ error: data.error?.message ?? "Gemini no ha respondido correctamente. Intenta de nuevo." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // OK
    console.log(`[${timeStart}] [OK] Respuesta GEMINI para usuario:`, data.candidates[0].content.parts[0].text?.slice(0, 100) + "...");
    return new Response(
      JSON.stringify({ text: data.candidates[0].content.parts[0].text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(`[${timeStart}] [FATAL] Error interno Gemini:`, e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "Error interno Gemini (desconocido)." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
