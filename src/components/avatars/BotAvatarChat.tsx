import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast, toast } from "@/hooks/use-toast";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import AvatarSelector, { AvatarType } from "./AvatarSelector";
import ChatMessages, { Message } from "./ChatMessages";
import ApiKeyModal from "./ApiKeyModal";

// Update: Avatar styles are now objects, not CSS strings!
const avatars: AvatarType[] = [
  {
    key: "pelirroja",
    name: "🤸‍♀️ Pelirroja deportista",
    style: { background: "linear-gradient(120deg,#fed6e3,#dbdbff)", color: "#a62265" },
  },
  {
    key: "ejecutivo",
    name: "🤵🏻 Moreno formal",
    style: { background: "linear-gradient(120deg,#dde7fa,#e8eafe)", color: "#234f96" },
  },
];

// Rename local type to BotMessage to avoid collision with imported Message
type BotMessage = {
  sender: "user" | "avatar";
  text: string;
  isError?: boolean;
};

const DEMO_RESPONSES: Record<string, string> = {
  pelirroja:
    "¡Hola! Soy la demo pelirroja 🤸‍♀️, por favor agrega la API Key de Gemini para respuestas reales.",
  ejecutivo:
    "¡Buenas! Demo ejecutivo 🤵🏻. Agrega tu API Key de Gemini para usar la AI real.",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  pelirroja:
    "Responde siempre como una joven deportista pelirroja española, entusiasta, simpática y con energía positiva. Habla de forma amigable, breve, no uses tecnicismos, y acércate a la persona. Si puedes, usa algunos emojis.",
  ejecutivo:
    "Responde siempre como un ejecutivo joven, moreno, formal y optimista. Sé educado, directo y profesional, pero cercano. Si puedes, usa algún emoji amistoso.",
};

const BotAvatarChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<BotMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(avatars[0].key);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { key: geminiKey, setKey: setGeminiKey } = useGeminiKey();

  const currentAvatar = avatars.find((a) => a.key === selected);

  // Ahora llamamos a la Edge Function de Supabase que actúa como backend seguro, gestión profesional de errores
  const askGemini = async (input: string, prompt: string) => {
    try {
      const response = await fetch("https://fiymplhjhxgoyuubqevu.functions.supabase.co/gemini-avatar-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, prompt }),
      });

      const data = await response.json();

      // Gestión explícita de errores según código de error devuelto por el backend
      if (!response.ok) {
        // Muestra el mensaje recibido, personalizado para UX profesional
        throw new Error(data?.error || "Respuesta de Gemini no válida.");
      }
      return data.text;
    } catch (e: any) {
      // Bubble-up para gestión de error en sendMessage
      throw new Error(e?.message || "Error llamando a Gemini vía función Edge.");
    }
  };

  async function sendMessage() {
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
              <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(true)}>Poner clave</Button>
            </span>
          ),
          variant: "destructive",
        });
        setLoading(false);
        setInput("");
        return;
      }
      const systemPrompt = SYSTEM_PROMPTS[selected];
      const response = await askGemini(input, systemPrompt);
      setChat((old) => [
        ...old,
        { sender: "avatar", text: response },
      ]);
    } catch (e: any) {
      // Decora respuesta de error según el caso
      let errorUserMsg = "⚠️ Error desconocido al consultar Gemini. ";
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
      setInput("");
    }
  }

  return (
    <div className="w-full bg-white border rounded-xl shadow-md mx-auto max-w-xl px-4 py-5 mt-2">
      {/* Selector de avatar */}
      <AvatarSelector avatars={avatars} selected={selected} setSelected={setSelected} />

      {/* Advertencia si no hay clave */}
      {!geminiKey && (
        <div className="mb-2 flex flex-col items-center">
          <div className="text-orange-500 text-center font-semibold pb-2">
            Debes ingresar tu clave de Gemini para recibir respuestas reales.
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowApiKeyInput(true)}>
            Ingresar clave API
          </Button>
        </div>
      )}

      {/* Pass as Message[] since structure matches */}
      <ChatMessages chat={chat} />

      <div className="flex gap-2">
        <Textarea
          placeholder={`Pregunta para ${currentAvatar?.name ?? "el avatar"}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-h-[38px] max-h-24 resize-none"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="h-fit self-end"
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
      <div className="mt-2">
        <small className="text-gray-400">
          Para respuestas AI reales, <b>añade tu clave Gemini</b>. Puedes actualizarla en cualquier momento.
        </small>
        {geminiKey && (
          <Button
            variant="link"
            size="sm"
            className="ml-2"
            onClick={() => setShowApiKeyInput(true)}
          >
            Cambiar clave
          </Button>
        )}
      </div>

      {/* Modal para poner la API Key */}
      <ApiKeyModal
        open={showApiKeyInput}
        onClose={() => setShowApiKeyInput(false)}
        apiKey={geminiKey}
        setApiKey={setGeminiKey}
      />
    </div>
  );
};

export default BotAvatarChat;
