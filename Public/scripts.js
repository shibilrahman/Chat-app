document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("send-btn");
    const messageInput = document.getElementById("message");
    const messagesList = document.querySelector(".messages");
    const usernameField = document.getElementById("username");
    const contactNameField = document.getElementById("contact-name");
  
    const socket = io(); // Connect to the Socket.io server
  
    // Clear the stored username during beforeunload event
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("username");
    });
  
    // Prompt user for a name if not present in local storage
    let username = localStorage.getItem("username");
  
    if (!username) {
      username = prompt("Enter your name:");
      if (!username) {
        username = "Anonymous";
      }
      localStorage.setItem("username", username);
    }
  
    // Notify the server about the new user
    socket.emit('new user', username);
  
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  
    function sendMessage() {
      const messageText = messageInput.value.trim();
      if (messageText !== "") {
        const data = {
          username: username,
          message: messageText
        };
        socket.emit('chat message', data);
        messageInput.value = "";
      }
    }
  
    socket.on('chat message', (data) => {
      const message = createMessage(data);
      messagesList.appendChild(message);
      messagesList.scrollTop = messagesList.scrollHeight;
    });
  
    socket.on('user list', (users) => {
      updateContactList(users);
    });
  
    function createMessage(data) {
      const message = document.createElement("li");
      message.className = data.username === username ? "message sender" : "message receiver";
      message.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;
      return message;
    }
  
    function updateContactList(users) {
      const contactsList = document.querySelector(".contacts");
      contactsList.innerHTML = "";
  
      users.forEach((user) => {
        const contact = document.createElement("li");
        contact.className = "contact";
        contact.textContent = user;
        contact.addEventListener("click", () => {
          contactNameField.textContent = user;
        });
        contactsList.appendChild(contact);
      });
    }
  });
  