// public/main.js
const socket = io();
const main = document.querySelector('main');
const form = document.querySelector('form');
const input = document.getElementById('msg');

const username = prompt("Enter your name") || "Guest";
socket.emit('set username', username);


form.addEventListener('submit', (e) => {
  e.preventDefault();
  // const message = input.value.trim();
  const message = input.innerText;
  if (message) {
    socket.emit('chat message', message);
    
    input.innerText = '';
    input.focus();
  }
});

socket.on('chat message', ({ user, color, message }) => {
  const card = document.createElement('div');
  card.className = 'card';

  // If the sender is the current user, apply row-reverse styling
  if (user === username) {
    card.style.flexDirection = 'row-reverse';
    card.style.textAlign = 'right';
  }

  card.innerHTML = `
    <div class="pic">
      <img src="https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg">
    </div>
    <div class="post">
      <div class="name" style="color:${color}">${user}</div>
      <div class="expecting">${message}</div>
    </div>
    <div class="extra"></div>
  `;

  main.appendChild(card);
  main.scrollTop = main.scrollHeight;
});

socket.on('info', (info) => {
  const infoTag = document.createElement('div');
  infoTag.className = 'info';
  infoTag.style.cssText = "align-items:center; text-align:center; font-size:12px; text-decoration:underline;";
  infoTag.textContent = info;
  main.appendChild(infoTag);
});
