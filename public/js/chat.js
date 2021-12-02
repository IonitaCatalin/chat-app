let socket = io();


let content = document.querySelector('.conversation-wrapper');
let message = document.querySelector('#message-text');
let submit = document.querySelector('.send');

socket.on('message', (message) =>{
    let messageReceived = document.createElement('div');
    let messageReceivedBubble = document.createElement('div');
    let messageReceivedTime = document.createElement('div');

    messageReceived.className = 'message-received';
    messageReceivedBubble.className = 'bubble';
    messageReceivedTime.className = 'time';

    messageReceived.
})

submit.addEventListener('click', () => {

})