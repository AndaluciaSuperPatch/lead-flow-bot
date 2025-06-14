import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast, toast } from "@/hooks/use-toast";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import AvatarSelector, { AvatarType } from "./AvatarSelector";
import ChatMessages, { Message } from "./ChatMessages";
import ApiKeyModal from "./ApiKeyModal";
import ChatInput from "./ChatInput";
import { useGeminiChat } from "@/hooks/useGeminiChat";

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
  const [chat, setChat] = useState<BotMessage[]>([]);
  const [selected, setSelected] = useState(avatars[0].key);
  // Ya no necesitamos mostrar ni actualizar input de clave
  // const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { key: geminiKey } = useGeminiKey();
  const { toast } = useToast();

  const currentAvatar = avatars.find((a) => a.key === selected);

  const { loading, sendMessage } = useGeminiChat({
    geminiKey,
    selected,
    DEMO_RESPONSES,
    SYSTEM_PROMPTS,
    toast,
    setShowApiKeyInput: () => {}, // dummy para cumplir con la API, nunca se llama.
  });

  const handleSend = (msg: string) => {
    sendMessage({
      input: msg,
      geminiKey,
      setChat,
    });
  };

  return (
    <div className="w-full bg-white border rounded-xl shadow-md mx-auto max-w-xl px-4 py-5 mt-2">
      {/* Selector de avatar */}
      <AvatarSelector avatars={avatars} selected={selected} setSelected={setSelected} />

      {/* NUNCA mostrar advertencia de clave ni botones */}
      {/* 
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
      */}

      <ChatMessages chat={chat} />

      <ChatInput loading={loading} onSend={handleSend} avatarName={currentAvatar?.name ?? "el avatar"} />

      {/* NUNCA mostrar boton cambiar clave */}
      <div className="mt-2">
        <small className="text-gray-400">
          Para respuestas AI reales, este asistente ya tiene la clave integrada. {/* Explicación clara */}
        </small>
      </div>

      {/* Eliminar el modal de clave */}
      {/* 
      <ApiKeyModal
        open={showApiKeyInput}
        onClose={() => setShowApiKeyInput(false)}
        apiKey={geminiKey}
        setApiKey={setGeminiKey}
      />
      */}
    </div>
  );
};

export default BotAvatarChat;
