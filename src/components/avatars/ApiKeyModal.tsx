
import React from "react";
import { Button } from "@/components/ui/button";

type ApiKeyModalProps = {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
};

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  open,
  onClose,
  apiKey,
  setApiKey,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg w-[90vw] max-w-md">
        <h2 className="text-lg font-bold mb-2">Introduce tu API Key</h2>
        <input
          autoFocus
          type="text"
          placeholder="AIza..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            disabled={!apiKey}
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
  );
};

export default ApiKeyModal;
