
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast, toast } from "@/hooks/use-toast";
import { usePerplexityKey } from "@/hooks/usePerplexityKey";
import { useGeminiKey } from "@/hooks/useGeminiKey";

const avatars = [
  {
    key: "pelirroja",
    name: "🤸‍♀️ Pelirroja deportista",
    style:
      "background: linear-gradient(120deg,#fed6e3,#dbdbff); color: #a62265;",
  },
  {
    key: "ejecutivo",
    name: "🤵🏻 Moreno formal",
    style:
      "background: linear-gradient(120deg,#dde7fa,#e8eafe); color: #234f96;",
  },
];

type Message = {
  sender: "user" | "avatar";
  text: string;
  isError?: boolean;
};

const DEMO_RESPONSES: Record<string, string> = {
  pelirroja: "¡Hola! Soy la demo pelirroja 🤸‍♀️, por favor agrega la API Key de Perplexity para respuestas reales.",
  ejecutivo: "¡Buenas! Demo ejecutivo 🤵🏻. Agrega tu API Key de Perplexity para usar la AI real.",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  pelirroja:
    "Responde siempre como una joven deportista pelirroja española, entusiasta, simpática y con energía positiva. Habla de forma amigable, breve, no uses tecnicismos, y acércate a la persona. Si puedes, usa algunos emojis.",
  ejecutivo:
    "Responde siempre como un ejecutivo joven, moreno, formal y optimista. Sé educado, directo y profesional, pero cercano. Si puedes, usa algún emoji amistoso.",
};

const AI_ENGINES = [
  { key: "perplexity", name: "Perplexity" },
  { key: "gemini", name: "Gemini (Google)" }
];

const BotAvatarChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(avatars[0].key);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Inicialización automática según la key disponible
  const { key: perplexityKey, setKey: setPerplexityKey } = usePerplexityKey();
  const { key: geminiKey, setKey: setGeminiKey } = useGeminiKey();

  // Determinar motor por defecto
  const defaultEngine = !!perplexityKey
    ? "perplexity"
    : !!geminiKey
    ? "gemini"
    : "perplexity";
  const [engine, setEngine] = useState(defaultEngine);

  // Si cambia la key, sincronizar el motor con la key disponible
  React.useEffect(() => {
    if (!perplexityKey && geminiKey) {
      setEngine("gemini");
    } else if (perplexityKey && !geminiKey) {
      setEngine("perplexity");
    } else if (!perplexityKey && !geminiKey) {
      setEngine("perplexity");
    }
    // Si ambas, no cambiar (usuario puede elegir)
  }, [perplexityKey, geminiKey]);

  const currentAvatar = avatars.find((a) => a.key === selected);

  // --- Nuevo: Mejor cálculo de IA disponible ---
  const hasAnyApiKey = !!perplexityKey || !!geminiKey;

  // Función para preguntar a Perplexity
  const askPerplexity = async (input: string, prompt: string) => {
    const url = "https://api.perplexity.ai/chat/completions";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${perplexityKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: input },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 600,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.choices?.[0]?.message?.content) {
        throw new Error(data.error ?? "Respuesta inválida de Perplexity.");
      }
      return data.choices[0].message.content;
    } catch (e: any) {
      throw new Error(e?.message || "Error llamando a Perplexity.");
    }
  };

  // --- NUEVO: Preguntar a Gemini ---
  const askGemini = async (input: string, prompt: string) => {
    /**
     * Puedes ver la doc oficial aquí:
     * https://ai.google.dev/gemini-api/docs
     */
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiKey;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt }, // system prompt
                { text: input }   // user question
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 600
          }
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(data.error?.message ?? "Respuesta de Gemini no válida.");
      }
      return data.candidates[0].content.parts[0].text;
    } catch (e: any) {
      throw new Error(e?.message || "Error llamando a Gemini.");
    }
  };

  // Adaptamos enviar mensaje para que use Perplexity o Gemini
  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setChat((old) => [...old, { sender: "user", text: input }]);
    try {
      // Selección de motor
      let response, apiKeySet = false;
      if (engine === "perplexity") {
        apiKeySet = !!perplexityKey;
      } else if (engine === "gemini") {
        apiKeySet = !!geminiKey;
      }

      if (!apiKeySet) {
        setChat((old) => [
          ...old,
          {
            sender: "avatar",
            text: DEMO_RESPONSES[selected],
            isError: true,
          },
        ]);
        toast({
          title: `Requiere API Key de ${engine === "perplexity" ? "Perplexity" : "Gemini"}`,
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
      if (engine === "perplexity") {
        response = await askPerplexity(input, systemPrompt);
      } else if (engine === "gemini") {
        response = await askGemini(input, systemPrompt);
      }
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
        title: `Error en asistente AI (${engine})`,
        description: e?.message || "No se pudo consultar la AI.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  // Nuevo: mostrar selector de motor si ambas claves existen, o mostrar cuál se está usando
  const availableEngines = [
    ...(perplexityKey ? [AI_ENGINES[0]] : []),
    ...(geminiKey ? [AI_ENGINES[1]] : [])
  ];

  // --- Quitar advertencia de Perplexity si tienes la de Gemini ---
  return (
    <div className="w-full bg-white border rounded-xl shadow-md mx-auto max-w-xl px-4 py-5 mt-2">
      {/* Selector de motor AI */}
      <div className="flex flex-wrap items-center justify-center mb-3 gap-2">
        <span className="text-xs text-gray-500 mr-2">IA:</span>
        {
          availableEngines.length > 1 ? (
            availableEngines.map(e =>
              <Button
                key={e.key}
                size="sm"
                variant={engine === e.key ? "secondary" : "outline"}
                className={`px-3 py-1 rounded-lg text-xs ${engine === e.key ? 'font-semibold' : ''}`}
                onClick={() => setEngine(e.key)}
              >
                {e.name}
              </Button>
            )
          ) : (
            <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs">
              {availableEngines[0]?.name || "No hay IA configurada"}
            </span>
          )
        }
      </div>
      {/* Solo mostrar la advertencia si NO hay ninguna clave */}
      {!hasAnyApiKey && (
        <div className="mb-2 flex flex-col items-center">
          <div className="text-orange-500 text-center font-semibold pb-2">
            Debes ingresar tu clave de Perplexity AI o Gemini para recibir respuestas reales.
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
          Para respuestas AI reales, <b>añade tu clave Perplexity AI o Gemini</b>. Puedes actualizarla en cualquier momento.
        </small>
        {hasAnyApiKey && (
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
      {/* Modal simple para poner la API Key */}
      {showApiKeyInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg w-[90vw] max-w-md">
            <h2 className="text-lg font-bold mb-2">Introduce tu API Key</h2>
            {/* Mostrar solo campo relevante */}
            {engine === "perplexity" && (
              <input
                autoFocus
                type="text"
                placeholder="pk-perplexity..."
                value={perplexityKey}
                onChange={e => setPerplexityKey(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2"
              />
            )}
            {engine === "gemini" && (
              <input
                autoFocus
                type="text"
                placeholder="AIza..."
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2"
              />
            )}
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
                disabled={
                  (engine === "perplexity" ? !perplexityKey : !geminiKey)
                }
              >
                Guardar clave
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {engine === "perplexity" && (
                <span>
                  Genera una clave gratis en <a href="https://www.perplexity.ai/developer" target="_blank" className="underline">perplexity.ai/developer</a>
                </span>
              )}
              {engine === "gemini" && (
                <span>
                  Genera una clave gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline">aistudio.google.com/app/apikey</a>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotAvatarChat;
