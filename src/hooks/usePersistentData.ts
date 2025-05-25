
import { useState, useEffect } from 'react';

export const usePersistentData = <T>(key: string, initialValue: T) => {
  // Inicializar con datos del localStorage o valor inicial
  const [data, setData] = useState<T>(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log(`✅ Datos cargados para ${key}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Error cargando datos para ${key}:`, error);
    }
    return initialValue;
  });

  // Función para actualizar datos y guardar automáticamente
  const updateData = (newData: T | ((prev: T) => T)) => {
    setData(prevData => {
      const updatedData = typeof newData === 'function' 
        ? (newData as (prev: T) => T)(prevData) 
        : newData;
      
      try {
        localStorage.setItem(key, JSON.stringify(updatedData));
        console.log(`💾 Datos guardados para ${key}:`, updatedData);
      } catch (error) {
        console.error(`❌ Error guardando datos para ${key}:`, error);
      }
      
      return updatedData;
    });
  };

  // Forzar persistencia cada 10 segundos para garantizar que no se pierdan datos
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`🔄 Auto-guardado para ${key}`);
      } catch (error) {
        console.error(`❌ Error en auto-guardado para ${key}:`, error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [key, data]);

  return [data, updateData] as const;
};
