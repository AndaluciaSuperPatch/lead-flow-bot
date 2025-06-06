// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que desaparezca la pantalla de carga
  const checkLoading = setInterval(() => {
    const loadingScreen = document.getElementById('ai-loading');
    if (!loadingScreen || loadingScreen.style.display === 'none') {
      clearInterval(checkLoading);
      initChatbot();
    }
  }, 500);
});

function initChatbot() {
  const chatWidget = document.createElement('div');
  chatWidget.innerHTML = `
    <div id="chat-container" style="position:fixed;bottom:20px;right:20px;width:300px;background:white;border-radius:10px;box-shadow:0 0 15px rgba(0,0,0,0.2);z-index:10001;display:none;">
      <div id="chat-header" style="padding:12px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;border-radius:10px 10px 0 0;font-weight:bold;cursor:move;">Asistente IA SuperPatch</div>
      <div id="chat-messages" style="height:200px;overflow-y:auto;padding:10px;background:#f9f9f9;"></div>
      <input id="user-input" type="text" placeholder="¿Qué necesitas mejorar hoy?" style="width:100%;padding:12px;border:none;border-top:1px solid #ddd;border-radius:0 0 10px 10px;">
    </div>
    <button id="chat-toggle" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;border:none;border-radius:50%;width:60px;height:60px;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,0.2);z-index:10000;">💬</button>
  `;
  document.body.appendChild(chatWidget);

  const keywords = {
    ventas: ['dolor', 'sueño', 'descanso', 'paz', 'equilibrio', 'enfoque', 'concentración', 'fuerza', 'energía'],
    emprender: ['emprender', 'negocio', 'startup', 'emprendedor', 'inversión', 'franquicia']
  };

  const toggleBtn = document.getElementById('chat-toggle');
  const chatContainer = document.getElementById('chat-container');

  toggleBtn.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
    document.getElementById('user-input').focus();
  });

  document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const userMessage = e.target.value.trim();
      if (userMessage) {
        addMessage(userMessage, 'user');
        processQuery(userMessage);
        e.target.value = '';
      }
    }
  });

  function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.style.padding = '8px 12px';
    messageDiv.style.margin = '8px 0';
    messageDiv.style.borderRadius = '18px';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.wordBreak = 'break-word';
    
    if (sender === 'user') {
      messageDiv.style.background = '#e0e0ff';
      messageDiv.style.marginLeft = 'auto';
      messageDiv.style.borderBottomRightRadius = '5px';
    } else {
      messageDiv.style.background = '#f1f1f1';
      messageDiv.style.marginRight = 'auto';
      messageDiv.style.borderBottomLeftRadius = '5px';
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function processQuery(query) {
    const lowerQuery = query.toLowerCase();
    let detected = false;

    // Detectar palabras clave
    if (keywords.ventas.some(keyword => lowerQuery.includes(keyword))) {
      addMessage("¡Entendido! Nuestros parches de bienestar pueden ayudarte. Te redirigimos a la tienda...", 'bot');
      setTimeout(() => {
        window.location.href = "https://111236288.superpatch.com/es";
      }, 2500);
      detected = true;
    }

    if (keywords.emprender.some(keyword => lowerQuery.includes(keyword))) {
      addMessage("¡Excelente decisión! Contacta a nuestro equipo de emprendimiento directamente por WhatsApp.", 'bot');
      setTimeout(() => {
        window.open("https://wa.me/34654669289", "_blank");
      }, 2500);
      detected = true;
    }

    if (!detected) {
      const responses = [
        "¿Buscas mejorar tu bienestar o iniciar un negocio?",
        "Cuéntame qué necesitas: ¿bienestar físico/mental o oportunidades de negocio?",
        "Puedo ayudarte con: dolor, sueño, enfoque o emprendimiento. ¿En qué área necesitas ayuda?"
      ];
      addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');
    }
  }
}