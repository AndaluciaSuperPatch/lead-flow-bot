import { supabase } from "@/integrations/supabase/client";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";

// ========== LEADS PREMIUM ==========
export const getLeads = async (): Promise<Tables<"leads_premium">[]> => {
  const { data, error } = await supabase.from("leads_premium").select("*");
  if (error) throw error;
  return data;
};

export const insertLead = async (lead: TablesInsert<"leads_premium">) => {
  const { data, error } = await supabase.from("leads_premium").insert(lead).select().single();
  if (error) throw error;
  return data;
};

export const updateLead = async (id: string, update: TablesUpdate<"leads_premium">) => {
  const { data, error } = await supabase
    .from("leads_premium")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ========== API CREDENTIALS ==========
export const getAllApiCredentials = async (): Promise<Tables<"api_credentials">[]> => {
  const { data, error } = await supabase.from("api_credentials").select("*");
  if (error) throw error;
  return data;
};

export const upsertApiCredential = async (cred: TablesInsert<"api_credentials">) => {
  const { data, error } = await supabase
    .from("api_credentials")
    .upsert(cred)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ========== APP SECRETS ==========
export const getSecret = async (name: string) => {
  const { data, error } = await supabase
    .from("app_secrets")
    .select("*")
    .eq("name", name)
    .single();
  if (error) throw error;
  return data;
};

export const setSecret = async (secret: TablesInsert<"app_secrets">) => {
  const { data, error } = await supabase
    .from("app_secrets")
    .upsert(secret)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ========== SOCIAL METRICS ==========
export const insertSocialMetric = async (metric: TablesInsert<"social_metrics">) => {
  const { data, error } = await supabase
    .from("social_metrics")
    .insert(metric)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getMetricsByPlatform = async (platform: string) => {
  const { data, error } = await supabase
    .from("social_metrics")
    .select("*")
    .eq("platform", platform);
  if (error) throw error;
  return data;
};

// ========== FUNCTIONS (RPC) ==========
export const upsertCredentialFunction = async (platform_name: string, values: {
  app_id_val?: string;
  secret_key_val?: string;
  token_val?: string;
}) => {
  const { error } = await supabase.rpc("upsert_credential", {
    platform_name,
    ...values,
  });
  if (error) throw error;
  return true;
};

export const getCredentialForPlatform = async (platform_name: string) => {
  const { data, error } = await supabase.rpc("get_credential_for_platform", {
    platform_name,
  });
  if (error) throw error;
  return data;
};

export const encryptData = async (data: string): Promise<string> => {
  const { data: encrypted, error } = await supabase.rpc("encrypt_data", { data });
  if (error) throw error;
  return encrypted;
};

export const decryptData = async (encrypted_data: string): Promise<string> => {
  const { data: decrypted, error } = await supabase.rpc("decrypt_data", { encrypted_data });
  if (error) throw error;
  return decrypted;
};

export const changeMasterKey = async (new_key: string) => {
  const { error } = await supabase.rpc("change_master_key", { new_key });
  if (error) throw error;
  return true;
};
