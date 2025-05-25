
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
    console.log(`🆕 Usando valor inicial para ${key}:`, initialValue);
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
        console.log(`💾 Datos guardados exitosamente para ${key}:`, updatedData);
      } catch (error) {
        console.error(`❌ Error guardando datos para ${key}:`, error);
      }
      
      return updatedData;
    });
  };

  // Guardar inmediatamente cuando cambian los datos
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`🔄 Auto-guardado inmediato para ${key}`);
    } catch (error) {
      console.error(`❌ Error en auto-guardado inmediato para ${key}:`, error);
    }
  }, [key, data]);

  // Forzar persistencia cada 5 segundos para mayor seguridad
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`🔄 Auto-guardado para ${key}`);
      } catch (error) {
        console.error(`❌ Error en auto-guardado para ${key}:`, error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [key, data]);

  return [data, updateData] as const;
};
