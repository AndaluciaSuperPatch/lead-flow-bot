
import React from "react";

export type Message = {
  sender: "user" | "avatar";
  text: string;
  isError?: boolean;
};

type ChatMessagesProps = {
  chat: Message[];
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ chat }) => (
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
);

export default ChatMessages;
