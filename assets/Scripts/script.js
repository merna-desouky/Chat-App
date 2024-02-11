var socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total Clients is: ${data}`;
});
const date = new Date();
const hour = date.getHours();
const min = date.getMinutes();

function sendMessage() {
  if (messageInput.value == " ") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dataTime: `${hour}: ${min}`,
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = " ";
}

socket.on("chat-message", (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
<p class="message">${data.message} <span>${data.name} ⏱️ ${
    data.dataTime
  }</span></p>
</li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", () => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});
messageInput.addEventListener("keypress", () => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing a message...`,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = ` <li class="message-feedback">
  <p class="feedback" id="feedback">✍️ ${data.feedback} </p>
</li>`;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
