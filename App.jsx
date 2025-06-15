import { useState } from 'react';
import ManualProfileConnectForm from "./ManualProfileConnectForm";
import { saveSocialProfile } from "./saveSocialProfile";
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    isError: false
  });

  const handleSave = async (platform, accountId, accessToken) => {
    setIsLoading(true);
    setNotification({ show: false, message: '', isError: false });
    
    try {
      await saveSocialProfile({ platform, account_id: accountId, access_token: accessToken });
      setNotification({
        show: true,
        message: '¡Perfil conectado exitosamente!',
        isError: false
      });
    } catch (err) {
      console.error('Connection error:', err);
      setNotification({
        show: true,
        message: `Error al conectar: ${err.message || 'Por favor intenta nuevamente'}`,
        isError: true
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification({ show: false, message: '', isError: false }), 5000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Conecta tus redes sociales
      </h2>
      
      <ManualProfileConnectForm onSave={handleSave} isLoading={isLoading} />
      
      {/* Notification */}
      {notification.show && (
        <div className={`mt-4 p-3 rounded-md flex items-start ${
          notification.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {notification.isError ? (
            <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" size={18} />
          ) : (
            <FiCheckCircle className="mt-1 mr-2 flex-shrink-0" size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Help text */}
      <div className="mt-6 text-sm text-gray-500">
        <p>¿Necesitas ayuda para obtener tus credenciales?</p>
        <a 
          href="#help" 
          className="text-blue-600 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            alert('Guía de ayuda: Consulta la documentación de la plataforma para obtener tu ID de cuenta y token de acceso.');
          }}
        >
          Ver guía de conexión
        </a>
      </div>
    </div>
  );
}

export default App;
