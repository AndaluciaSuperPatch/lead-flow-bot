
import { useState } from "react";

export function useGeminiKey() {
  const [key, setKeyState] = useState(() => localStorage.getItem("gemini_api_key") || "");

  const setKey = (newKey: string) => {
    setKeyState(newKey);
    if (newKey) {
      localStorage.setItem("gemini_api_key", newKey);
    } else {
      localStorage.removeItem("gemini_api_key");
    }
  };

  return { key, setKey };
}
