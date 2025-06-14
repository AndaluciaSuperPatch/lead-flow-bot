
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast, toast } from "@/hooks/use-toast";
import { useGeminiKey } from "@/hooks/useGeminiKey";

// Update: Avatar styles are now objects, not CSS strings!
const avatars = [
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

type Message = {
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
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(avatars[0].key);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { key: geminiKey, setKey: setGeminiKey } = useGeminiKey();

  const currentAvatar = avatars.find((a) => a.key === selected);

  // Solo GEMINI (no Perplexity)
  const askGemini = async (input: string, prompt: string) => {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      geminiKey;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(
          data.error?.message ?? "Respuesta de Gemini no válida."
        );
      }
      return data.candidates[0].content.parts[0].text;
    } catch (e: any) {
      throw new Error(e?.message || "Error llamando a Gemini.");
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
      setChat((old) => [
        ...old,
        {
          sender: "avatar",
          text: `⚠️ Error: ${e.message}\n\n${DEMO_RESPONSES[selected]}`,
          isError: true,
        },
      ]);
      toast({
        title: `Error en asistente AI (Gemini)`,
        description: e?.message || "No se pudo consultar la AI.",
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
      <div className="flex flex-wrap items-center justify-center mb-3 gap-2">
        <span className="text-xs text-gray-500 mr-2">Avatar:</span>
        {avatars.map((a) => (
          <Button
            key={a.key}
            size="sm"
            variant={selected === a.key ? "secondary" : "outline"}
            className={`px-3 py-1 rounded-lg text-xs ${selected === a.key ? "font-semibold" : ""}`}
            onClick={() => setSelected(a.key)}
            style={selected === a.key ? a.style : undefined}
          >
            {a.name}
          </Button>
        ))}
      </div>
      {/* Advertencia si no hay clave */}
      {!geminiKey && (
        <div className="mb-2 flex flex-col items-center">
          <div className="text-orange-500 text-center font-semibold pb-2">
            Debes ingresar tu clave de Gemini para recibir respuestas reales.
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowApiKeyInput(true)}>Ingresar clave API</Button>
        </div>
      )}
      <div className="h-52 overflow-y-auto bg-slate-50 rounded p-3 mb-2 text-sm">
        {chat.length === 0 && (
          <div className="text-gray-400 italic text-center">
            Escribe tu mensaje para hablar con el avatar seleccionado.
          </div>
        )}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-indigo-100 text-indigo-700"
                  : msg.isError
                  ? "bg-red-200 text-red-800 border border-red-400"
                  : "bg-indigo-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
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
      {showApiKeyInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-2">Introduce tu API Key</h2>
            <input
              autoFocus
              type="text"
              placeholder="AIza..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyInput(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowApiKeyInput(false)}
                disabled={!geminiKey}
              >
                Guardar clave
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span>
                Genera una clave gratis en{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer"
                >
                  aistudio.google.com/app/apikey
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotAvatarChat;
