
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
};

const BotAvatarChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(avatars[0].key);
  const { toast } = useToast();

  const currentAvatar = avatars.find((a) => a.key === selected);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);

    setChat((old) => [...old, { sender: "user", text: input }]);
    try {
      const res = await fetch(
        "/functions/v1/deepseek-avatar-chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: input,
            avatar: selected,
          }),
        }
      );
      const data = await res.json();
      if (data.answer) {
        setChat((old) => [
          ...old,
          { sender: "avatar", text: data.answer },
        ]);
      } else {
        toast({
          title: "Error",
          description: "No se recibió respuesta del avatar.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "No se pudo conectar al asistente.",
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
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-indigo-100 text-indigo-700"
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
    </div>
  );
};

export default BotAvatarChat;
