
/**
 * useGeminiKey custom hook for PATCHBOT, VERSION FIJA
 * SIEMPRE retorna la clave pública proporcionada.
 * El setKey no hace nada.
 */

// No se importa useState porque no se usa realmente.
export function useGeminiKey() {
  // Clave FIJA proporcionada por el usuario
  const key = "AIzaSyDHyiSD0JEX8DesotD-fjGsQ4FQGF_PhXo";
  // Función dummy para mantener el API, no hace nada
  const setKey = () => {};

  return { key, setKey } as const;
}
