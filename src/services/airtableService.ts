
/**
 * Servicio para conectar y leer datos desde Airtable vía API REST.
 * Requiere el token de API de Airtable (pat...).
 * 
 * RECOMENDACIÓN: Este token debería leerse desde un sistema seguro como Supabase Secrets.
 */

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
// TODO: Cambia este valor por tu Base ID real
const BASE_ID = "TU_BASE_ID"; // <-- Pide tu Base ID en https://airtable.com/api

const AIRTABLE_TOKEN = "pat08ew11RWERcNc5"; // ¡MUY IMPORTANTE! Mejor usa Supabase Secrets.

interface AirtableRecord<T = any> {
  id: string;
  fields: T;
  createdTime: string;
}

export async function fetchAirtableRecords<T = any>(tableName: string): Promise<AirtableRecord<T>[]> {
  if (!AIRTABLE_TOKEN || !BASE_ID) {
    throw new Error("Airtable: Debes configurar tu API token y Base ID.");
  }

  const url = `${AIRTABLE_API_URL}/${BASE_ID}/${encodeURIComponent(tableName)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error de Airtable: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return data.records as AirtableRecord<T>[];
}

