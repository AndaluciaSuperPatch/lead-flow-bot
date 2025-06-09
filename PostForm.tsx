// src/components/PostForm.tsx
import { useState } from "react";
import { postToSocial } from "@/utils/postToSocial";
import { Button } from "@/components/ui/button"; // si usas shadcn/ui

export default function PostForm() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postToSocial({ content, imageUrl });
      alert("✅ Publicado con éxito en tus redes");
      setContent("");
      setImageUrl("");
    } catch {
      alert("❌ Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-4 w-full max-w-lg mx-auto">
      <textarea
        placeholder="Escribe tu post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        placeholder="URL de imagen (opcional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Publicando..." : "Publicar en redes"}
      </Button>
    </div>
  );
}
