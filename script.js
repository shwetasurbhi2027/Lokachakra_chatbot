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

// Initial bot message
appendMessage("Hi! I'm your AI chatbot. How can I help you today?", "bot");

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  appendMessage(userMsg, 'user');
  chatInput.value = '';
  appendMessage("...", 'bot'); // Typing indicator

  // Replace the below fetch URL with your backend endpoint
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await response.json();
    // Remove typing indicator
    chatMessages.removeChild(chatMessages.lastChild);
    appendMessage(data.reply || "Sorry, I couldn't get a response.", 'bot');
  } catch (err) {
    // Remove typing indicator
    chatMessages.removeChild(chatMessages.lastChild);
    appendMessage("Sorry, there was a problem connecting to the AI.", 'bot');
  }
});
