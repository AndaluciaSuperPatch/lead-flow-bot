
import { useState } from "react";

export function usePerplexityKey() {
  const [key, setKeyState] = useState(() => localStorage.getItem("perplexity_api_key") || "");

  const setKey = (newKey: string) => {
    setKeyState(newKey);
    if (newKey) {
      localStorage.setItem("perplexity_api_key", newKey);
    } else {
      localStorage.removeItem("perplexity_api_key");
    }
  };

  return { key, setKey };
}
