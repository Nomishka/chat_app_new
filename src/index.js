import { io } from "socket.io-client";
const socket = io("https://chat-app-new-m2ui.onrender.com");

const mainContainer = document.querySelector(".main-container");
const input = document.getElementById("input");
const sendButton = document.getElementById("send-btn");
const joinButton = document.getElementById("join-btn");
let userId;

sendButton.addEventListener("click", () => {
  if (input.value === "") return;
  socket.emit("message", input.value);
  input.value = "";
});

socket.on("welcome", (id) => {
  userId = id;
});

socket.on("receiveMessage", (response) => {
  const isOur = response.userId === userId;

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");
  if(!isOur) messageContainer.classList.add("left");

  const messageDetail = document.createElement("div");
  messageDetail.classList.add("message-detail");
  if(!isOur) messageDetail.classList.add("left-detail");

  const messageDate = document.createElement("span");
  messageDate.classList.add("date");
  messageDate.innerText = new Date().toLocaleDateString();

  const messageTime = document.createElement("span");
  messageTime.classList.add("time");
  messageTime.innerText = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messages = document.createElement("div");
  messages.classList.add("message");
  if(!isOur) messages.classList.add("left-message");

  const messageInfo = document.createElement("div");
  messageInfo.classList.add("message-info");

  const messageName = document.createElement("span");
  messageName.classList.add("name");
  messageName.innerText = userId;

  const messageText = document.createElement("p");
  messageText.classList.add("message-text");
  messageText.innerText = response.message;

  mainContainer.appendChild(messageContainer);
  messageContainer.appendChild(messageDetail);
  messageDetail.appendChild(messageDate);
  messageDetail.appendChild(messageTime);
  messageContainer.appendChild(messages);
  messages.appendChild(messageInfo);
  messageInfo.appendChild(messageName);
  messageInfo.appendChild(messageText);
});
