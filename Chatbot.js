// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.createElement('div');
  chatWidget.innerHTML = `
    <div id="chat-container" style="position:fixed;bottom:20px;right:20px;width:300px;background:white;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);z-index:1000;display:none;">
      <div id="chat-header" style="padding:10px;background:#4e8cff;color:white;border-radius:10px 10px 0 0;cursor:move;">Asistente Virtual</div>
      <div id="chat-messages" style="height:200px;overflow-y:auto;padding:10px;"></div>
      <input id="user-input" type="text" placeholder="Escribe tu consulta..." style="width:100%;padding:10px;border:none;border-top:1px solid #ddd;">
    </div>
    <button id="chat-toggle" style="position:fixed;bottom:20px;right:20px;background:#4e8cff;color:white;border:none;border-radius:50%;width:60px;height:60px;cursor:pointer;">💬</button>
  `;
  document.body.appendChild(chatWidget);

  const keywords = {
    ventas: ['dolor', 'sueño', 'paz', 'equilibrio', 'enfoque', 'fuerza'],
    emprender: ['emprender', 'negocio', 'startup', 'emprendedor']
  };

  const toggleBtn = document.getElementById('chat-toggle');
  const chatContainer = document.getElementById('chat-container');

  toggleBtn.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
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
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.style.textAlign = sender === 'user' ? 'right' : 'left';
    messageDiv.style.margin = '5px';
    document.getElementById('chat-messages').appendChild(messageDiv);
  }

  function processQuery(query) {
    const lowerQuery = query.toLowerCase();
    let detected = false;

    // Detectar palabras clave
    if (keywords.ventas.some(keyword => lowerQuery.includes(keyword))) {
      addMessage("¡Entendido! Te recomiendo nuestra solución especializada:", 'bot');
      setTimeout(() => window.location.href = "https://111236288.superpatch.com/es", 2000);
      detected = true;
    }

    if (keywords.emprender.some(keyword => lowerQuery.includes(keyword))) {
      addMessage("¡Excelente! Contacta a nuestro equipo de emprendimiento:", 'bot');
      setTimeout(() => window.location.href = "https://wa.me/34654669289", 2000);
      detected = true;
    }

    if (!detected) {
      addMessage("Hola 👋 ¿Buscas mejorar tu bienestar o emprender?", 'bot');
    }
  }
});