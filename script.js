const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg ' + sender;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial message
appendMessage("Hi! I'm Gemini-powered AI. How can I help?", "bot");

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  
  appendMessage(userMsg, 'user');
  chatInput.value = '';
  appendMessage("...", 'bot');

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });
    
    const data = await response.json();
    chatMessages.removeChild(chatMessages.lastChild);
    appendMessage(data.reply, 'bot');
    
  } catch (err) {
    chatMessages.removeChild(chatMessages.lastChild);
    appendMessage("Error connecting to AI service", 'bot');
  }
});

