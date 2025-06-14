import { supabase } from "@/integrations/supabase";

/**
 * Este gestor obtiene todas las credenciales de las plataformas conectadas desde Supabase.
 */
export const realCredentialsManager = {
  /**
   * Devuelve un objeto con las credenciales descifradas por plataforma.
   * Ejemplo: { Facebook: { app_id, secret_key, token }, Instagram: { ... }, ... }
   */
  async getAllCredentials() {
    const out: Record<string, any> = {};

    // Plataformas que consideramos; puedes agregar más según necesites
    const platforms = [
      "Facebook",
      "Instagram",
      "TikTok",
      "LinkedIn",
      "Ayrshare"
    ];

    for (const platform of platforms) {
      // Traemos las credenciales (si existen)
      const { data, error } = await supabase
        .rpc("get_credential_for_platform", { platform_name: platform });
      if (!error && data && Array.isArray(data) && data[0]) {
        out[platform] = {
          app_id: data[0].app_id,
          secret_key: data[0].secret_key,
          token: data[0].token
        };
      }
    }

    return out;
  },

  /**
   * Devuelve solo el token de una plataforma (útil para autenticación rápida).
   * @param platform El nombre de la plataforma (ej: 'Facebook', 'Instagram', etc)
   */
  async getPlatformToken(platform: string) {
    const { data, error } = await supabase
      .rpc("get_credential_for_platform", { platform_name: platform });
    if (!error && data && Array.isArray(data) && data[0]) {
      return data[0].token;
    }
    return null;
  },

  /**
   * Guarda/actualiza credenciales para la plataforma LinkedIn.
   * @param appId El Client ID (App ID) de LinkedIn
   * @param secretKey El Secret Key de LinkedIn
   * @param token (opcional) Token de acceso de LinkedIn
   */
  async upsertLinkedInCredentials(appId: string, secretKey: string, token?: string) {
    const { error } = await supabase.rpc("upsert_credential", {
      platform_name: "LinkedIn",
      app_id_val: appId,
      secret_key_val: secretKey,
      token_val: token ?? null,
    });
    if (error) {
      throw new Error("Error guardando credenciales LinkedIn: " + error.message);
    }
    return true;
  }
};
