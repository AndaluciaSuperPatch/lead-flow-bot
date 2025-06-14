
import { useState } from "react";

type UseGeminiChatOptions = {
  geminiKey: string;
  selected: string;
  DEMO_RESPONSES: Record<string, string>;
  SYSTEM_PROMPTS: Record<string, string>;
  toast: (opts: any) => void;
  setShowApiKeyInput: (open: boolean) => void;
};

export function useGeminiChat({
  geminiKey,
  selected,
  DEMO_RESPONSES,
  SYSTEM_PROMPTS,
  toast,
  setShowApiKeyInput,
}: UseGeminiChatOptions) {
  const [loading, setLoading] = useState(false);

  // Servicio de llamada a la función edge de Supabase para Gemini (backend seguro)
  const askGemini = async (input: string, prompt: string): Promise<string> => {
    try {
      const response = await fetch("https://fiymplhjhxgoyuubqevu.functions.supabase.co/gemini-avatar-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Respuesta de Gemini no válida.");
      }
      return data.text;
    } catch (e: any) {
      throw new Error(e?.message || "Error llamando a Gemini vía función Edge.");
    }
  };

  // Lógica de chat: añade mensaje usuario, valida clave, recibe y añade respuesta de Gemini (o demo/error)
  async function sendMessage({
    input,
    geminiKey,
    setChat,
  }: {
    input: string;
    geminiKey: string;
    setChat: (cb: (old: any[]) => any[]) => void;
  }) {
    if (!input.trim()) return;
    setLoading(true);
    setChat((old) => [...old, { sender: "user", text: input }]);
    try {
      if (!geminiKey) {
        setChat((old) => [
          ...old,
          {
            sender: "avatar",
            text: DEMO_RESPONSES[selected],
            isError: true,
          },
        ]);
        toast({
          title: "Requiere API Key de Gemini",
          description: (
            <span>
              Por favor, ingresa tu clave API para activar el asistente.&nbsp;
              <button className="text-xs underline" onClick={() => setShowApiKeyInput(true)}>Poner clave</button>
            </span>
          ),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const systemPrompt = SYSTEM_PROMPTS[selected];
      const response = await askGemini(input, systemPrompt);
      setChat((old) => [
        ...old,
        { sender: "avatar", text: response },
      ]);
    } catch (e: any) {
      let errorUserMsg = "⚠️ Error desconocido al consultar Gemini.";
      const errText = (e?.message || "").toLowerCase();

      if (errText.includes("clave gemini es incorrecta")) {
        errorUserMsg = "❌ Tu clave API Gemini es inválida, ha expirado o tiene restricciones. Revisa y cámbiala en Google AI Studio. Más info: https://aistudio.google.com/app/apikey";
      } else if (errText.includes("referer")) {
        errorUserMsg = "❌ Tu clave Gemini tiene restricciones de 'referer' (Google AI). Debes generar una clave nueva SIN RESTRICCIONES aquí: https://aistudio.google.com/app/apikey";
      } else if (errText.includes("clave gemini del servidor es inválida")) {
        errorUserMsg = "❌ El backend no tiene bien la clave Gemini. Revisa configuración en panel Supabase.";
      } else if (errText.includes("no existe clave gemini configurada")) {
        errorUserMsg = "❌ No hay clave API Gemini configurada en el servidor.";
      } else if (errText.includes("input y prompt requeridos")) {
        errorUserMsg = "Introduce algún mensaje antes de enviar 🤔";
      } else if (errText.includes("el mensaje a gemini no puede estar vacío")) {
        errorUserMsg = "No puedes enviar mensajes vacíos. ¡Escribe algo para tu avatar! 📝";
      } else if (errText.includes("json inválido")) {
        errorUserMsg = "Ocurrió un problema técnico con tu mensaje. Prueba de nuevo.";
      } else if (errText.includes("no se pudo interpretar la respuesta")) {
        errorUserMsg = "El servidor de Google Gemini devolvió una respuesta inesperada. Prueba de nuevo más tarde.";
      } else if (errText.includes("gemini no ha respondido correctamente")) {
        errorUserMsg = "Hubo un problema con la IA de Google Gemini. Intenta de nuevo en unos segundos.";
      }

      setChat((old) => [
        ...old,
        {
          sender: "avatar",
          text: errorUserMsg + "\n\n" + DEMO_RESPONSES[selected],
          isError: true,
        },
      ]);
      toast({
        title: `Error en asistente AI (Gemini)`,
        description: errorUserMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return { loading, sendMessage };
}

