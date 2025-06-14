
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { realCredentialsManager } from "@/services/realCredentialsManager";

const LINKEDIN_REDIRECT_URI = "https://superpatch-crm.lovable.app/auth/linkedin/callback";

const LinkedInCredentialsForm: React.FC = () => {
  const [appId, setAppId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim() || !secretKey.trim()) {
      toast({
        title: "❌ Faltan datos",
        description: "Por favor, completa ambos campos.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await realCredentialsManager.upsertLinkedInCredentials(appId.trim(), secretKey.trim());
      toast({
        title: "✅ Credenciales guardadas",
        description: "LinkedIn Client ID y Secret Key guardados exitosamente.",
      });
      setAppId("");
      setSecretKey("");
    } catch (err: any) {
      toast({
        title: "❌ Error al guardar",
        description: err.message || "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Credenciales LinkedIn</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="font-semibold" htmlFor="linkedin-app-id">Client ID</label>
            <Input
              id="linkedin-app-id"
              type="text"
              placeholder="Tu Client ID"
              value={appId}
              onChange={e => setAppId(e.target.value)}
              autoComplete="off"
              className="mt-1 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold" htmlFor="linkedin-secret-key">Secret Key</label>
            <Input
              id="linkedin-secret-key"
              type="password"
              placeholder="Tu Secret Key"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              autoComplete="off"
              className="mt-1 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold" htmlFor="linkedin-redirect-uri">Redirect URI</label>
            <Input
              id="linkedin-redirect-uri"
              type="text"
              value={LINKEDIN_REDIRECT_URI}
              readOnly
              className="mt-1 font-mono bg-gray-100 cursor-not-allowed"
              tabIndex={-1}
            />
            <span className="text-xs text-gray-600">Utiliza esta URI exacta al registrar tu app en LinkedIn Developers.</span>
          </div>
          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Credenciales"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkedInCredentialsForm;

