import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LeadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('Nuevo');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.from('leads').insert([
      {
        name,
        source,
        status,
        // Supabase insertará la fecha automáticamente con `now()`
      }
    ]);

    if (error) {
      setMessage('❌ Error al guardar el lead: ' + error.message);
    } else {
      setMessage('✅ Lead guardado correctamente.');
      setName('');
      setSource('');
      setStatus('Nuevo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Agregar nuevo Lead</h2>

      <label className="block mb-2">
        Nombre:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mt-1 border rounded"
        />
      </label>

      <label className="block mb-2 mt-4">
        Fuente (Instagram, Facebook...):
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        />
      </label>

      <label className="block mb-4 mt-4">
        Estado:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        >
          <option value="Nuevo">Nuevo</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Contactado">Contactado</option>
          <option value="Cerrado">Cerrado</option>
        </select>
      </label>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Guardar Lead
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
};

export default LeadForm;