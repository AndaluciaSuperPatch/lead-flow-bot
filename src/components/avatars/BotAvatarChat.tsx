
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePerplexityKey } from "@/hooks/usePerplexityKey";

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

const BotAvatarChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(avatars[0].key);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();
  const { key: perplexityKey, setKey } = usePerplexityKey();

  const currentAvatar = avatars.find((a) => a.key === selected);

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

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setChat((old) => [...old, { sender: "user", text: input }]);
    try {
      if (!perplexityKey) {
        setChat((old) => [
          ...old,
          {
            sender: "avatar",
            text: DEMO_RESPONSES[selected],
            isError: true,
          },
        ]);
        toast({
          title: "Requiere API Key de Perplexity",
          description: (
            <span>
              Por favor, ingresa tu Perplexity API Key para activar el asistente.&nbsp;
              <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(true)}>Poner clave</Button>
            </span>
          ),
          variant: "destructive",
        });
        setLoading(false);
        setInput("");
        return;
      }
      // Preguntar a Perplexity
      const systemPrompt = SYSTEM_PROMPTS[selected];
      const answer = await askPerplexity(input, systemPrompt);
      setChat((old) => [
        ...old,
        { sender: "avatar", text: answer },
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
        title: "Error en asistente AI",
        description: e?.message || "No se pudo consultar a Perplexity.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="w-full bg-white border rounded-xl shadow-md mx-auto max-w-xl px-4 py-5 mt-2">
      <div className="flex space-x-3 mb-2 justify-center">
        {avatars.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => setSelected(a.key)}
            className={`px-4 py-2 rounded-lg border font-semibold transition-all 
              ${
                selected === a.key
                  ? "ring-2 ring-indigo-400 scale-105 shadow"
                  : "opacity-70"
              }`}
            style={
              selected === a.key
                ? { ...{ background: a.style } }
                : {}
            }
            aria-label={`Seleccionar ${a.name}`}
          >
            {a.name}
          </button>
        ))}
      </div>
      {!perplexityKey && (
        <div className="mb-2 flex flex-col items-center">
          <div className="text-orange-500 text-center font-semibold pb-2">Debes ingresar tu clave de Perplexity AI para recibir respuestas reales.</div>
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
          Para respuestas AI reales, <b>añade tu clave Perplexity AI</b>. Puedes actualizarla en cualquier momento.
        </small>
        {perplexityKey && (
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
            <h2 className="text-lg font-bold mb-2">Introduce tu Perplexity API Key</h2>
            <input
              autoFocus
              type="text"
              placeholder="pk-..."
              value={perplexityKey}
              onChange={e => setKey(e.target.value)}
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
                disabled={!perplexityKey}
              >
                Guardar clave
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Genera una clave gratis en <a href="https://www.perplexity.ai/developer" target="_blank" className="underline">perplexity.ai/developer</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotAvatarChat;
