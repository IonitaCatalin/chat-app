let socket = io();

let content = document.querySelector('.conversation-wrapper');
let message = document.querySelector('#message-text');
let submit = document.querySelector('.send');

socket.on('NEW_MESSAGE', (message) =>{

    let messageReceived = document.createElement('div');
    let messageReceivedBubble = document.createElement('div');
    let messageReceivedTime = document.createElement('div');
    let messageReceivedTimestamp = document.createElement('div');
    let messageReceivedAvatar = document.createElement('div');

    messageReceived.className = 'message-received';
    messageReceivedBubble.className = 'bubble';
    messageReceivedTime.className = 'time';
    messageReceivedTimestamp.className = 'timestamp';
    messageReceivedAvatar.className = 'avatar';

    messageReceivedBubble.innerHTML = message;
    messageReceivedTime.innerHTML = new Date().getHours() + ':' + new Date().getMinutes();
    messageReceivedAvatar.innerHTML = 'ME'

    messageReceivedTimestamp.appendChild(messageReceivedTime);
    messageReceivedTimestamp.appendChild(messageReceivedAvatar);
    messageReceived.appendChild(messageReceivedBubble);
    messageReceived.appendChild(messageReceivedTimestamp); 

    content.appendChild(messageReceived);

    
})

submit.addEventListener('click', function (event) {

    event.preventDefault();

    socket.emit('SEND_MESSAGE',(message.value));

    let messageSent = document.createElement('div');
    let messageSentBubble = document.createElement('div');
    let messageSentTime = document.createElement('div');
    let messageSentAvatar = document.createElement('div');
    let messageSentTimestamp = document.createElement('div');

    messageSent.className = 'message-sent';
    messageSentBubble.className = 'bubble';
    messageSentTime.className = 'time';
    messageSentTimestamp.className = 'timestamp';
    messageSentAvatar.className = 'avatar';

    messageSentBubble.innerHTML = message.value;
    messageSentAvatar.innerHTML = 'ME';
    messageSentTime.innerHTML = new Date().getHours() + ':' + new Date().getMinutes();


    messageSentTimestamp.appendChild(messageSentTime);
    messageSentTimestamp.appendChild(messageSentAvatar);
    messageSent.appendChild(messageSentBubble);
    messageSent.appendChild(messageSentTimestamp); 

    content.appendChild(messageSent);

    message.value = '';



})