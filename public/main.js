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

form.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    // const message = input.value.trim();
    const message = input.innerText;
    if (message) {
      socket.emit('chat message', message);
      console.log(message)
      
      input.innerText = '';
      input.focus();
    }
  }
});


function addMessage({ user, color, message }) {
  const card = document.createElement('div');
  card.classList.add('card'); // make sure you have a `.card` style in CSS

  // If the sender is the current user, apply row-reverse styling
  if (user === username) {
    card.style.flexDirection = 'row-reverse';
    card.style.textAlign = 'right';
    // user = 'You'
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
}



// Step 1: Load previous messages
socket.on('chat history', (history) => {
  history.forEach(msg => {
    addMessage(msg); // Your existing function to render message
  });
});

// Receive new incoming message
socket.on('chat message', (msg) => {
  addMessage(msg);
});

// socket.on('chat message', ({ user, color, message }) => {
//   const card = document.createElement('div');
//   card.className = 'card';

//   // If the sender is the current user, apply row-reverse styling
//   if (user === username) {
//     card.style.flexDirection = 'row-reverse';
//     card.style.textAlign = 'right';
//   }

//   card.innerHTML = `
//     <div class="pic">
//       <img src="https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg">
//     </div>
//     <div class="post">
//       <div class="name" style="color:${color}">${user}</div>
//       <div class="expecting">${message}</div>
//     </div>
//     <div class="extra"></div>
//   `;

//   main.appendChild(card);
//   main.scrollTop = main.scrollHeight;
// });

socket.on('info', (info) => {
  const infoTag = document.createElement('div');
  infoTag.className = 'info';
  infoTag.style.cssText = "align-items:center; text-align:center; font-size:12px; text-decoration:underline;";
  infoTag.textContent = info;
  main.appendChild(infoTag);
});



const inputX = document.getElementById('msg');

let typing = false;
let timeout;

inputX.addEventListener('input', () => {
  if (!typing) {
    typing = true;
    socket.emit('typing', true);
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    typing = false;
    socket.emit('typing', false);
  }, 1000); // Stops typing after 1s of inactivity
});


const typingDiv = document.getElementById('typingStatus');

socket.on('typing', ({ user, isTyping }) => {
  if (isTyping) {
    typingDiv.style.display = "block";
    typingDiv.innerText = `${user} is typing...`;
  } else {
    typingDiv.innerText = '';
    typingDiv.style.display = "none";

  }
});