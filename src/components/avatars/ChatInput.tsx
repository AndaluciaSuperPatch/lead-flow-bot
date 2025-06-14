
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
  loading: boolean;
  onSend: (msg: string) => void;
  avatarName: string;
};

const ChatInput: React.FC<ChatInputProps> = ({ loading, onSend, avatarName }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-2">
      <Textarea
        placeholder={`Pregunta para ${avatarName}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 min-h-[38px] max-h-24 resize-none"
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="h-fit self-end"
      >
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </div>
  );
};

export default ChatInput;
