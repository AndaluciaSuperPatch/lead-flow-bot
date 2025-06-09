import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar datos persistentes en localStorage.
 *
 * @param key Clave del localStorage
 * @param initialValue Valor inicial si no hay nada guardado
 * @returns [data, updateData] - Estado y función para actualizarlo
 */
export const usePersistentData = <T>(key: string, initialValue: T) => {
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        console.log(`✅ ${key} cargado:`, parsed);
        return parsed;
      }
    } catch (err) {
      console.error(`❌ Error cargando ${key}:`, err);
    }
    console.log(`🆕 Valor inicial usado para ${key}:`, initialValue);
    return initialValue;
  });

  const updateData = (newData: T | ((prev: T) => T)) => {
    setData(prev => {
      const next = typeof newData === 'function' ? (newData as (prev: T) => T)(prev) : newData;
      try {
        localStorage.setItem(key, JSON.stringify(next));
        console.log(`💾 ${key} guardado:`, next);
      } catch (err) {
        console.error(`❌ Error guardando ${key}:`, err);
      }
      return next;
    });
  };

  // Guardado automático inmediato al cambiar
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`📦 Auto-guardado inmediato de ${key}`);
    } catch (err) {
      console.error(`❌ Error en auto-guardado de ${key}:`, err);
    }
  }, [key, data]);

  // Refuerzo del guardado cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`🔁 Auto-backup de ${key}`);
      } catch (err) {
        console.error(`❌ Error en backup de ${key}:`, err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [key, data]);

  return [data, updateData] as const;
};
