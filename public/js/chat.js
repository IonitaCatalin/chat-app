const socket = io();

const content = document.querySelector('.conversation-wrapper');
const message = document.querySelector('#message-text');

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.on('MESSAGE_SYNC', (message) =>{

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

});

socket.on('LOCATION_SYNC',({latitude, longitude}) => {
    let messageLocation = document.createElement('div');
    let messageLocationText = document.createElement('div');

    messageLocation.className = 'message-location';
    messageLocationText.className = 'location';

    messageLocationText.innerHTML = `🌎 An user is at https://google.com/maps?q=${latitude},${longitude}, go say hi!`;
    messageLocation.appendChild(messageLocationText);

    content.appendChild(messageLocation);

});

socket.on('USER_SYNC', ({username}) => {
        let messageJoin = document.createElement('div');
        let messageJoinText = document.createElement('div');


        messageJoin.className = 'message-join';
        messageJoinText.className = 'join';

        messageJoinText.innerHTML += `👋 ${username} just joined in, say hi !`;

        messageJoin.appendChild(messageJoinText);
        
        content.appendChild(messageJoin);
})

document.querySelector('.send').addEventListener('click', (event) => {

    event.preventDefault();


    let messageSent = document.createElement('div');
    let messageSentBubble = document.createElement('div');
    let messageSentTime = document.createElement('div');
    let messageSentAvatar = document.createElement('div');
    let messageSentTimestamp = document.createElement('div');
    let messageSentStatus = document.createElement('div');


    messageSent.className = 'message-sent';
    messageSentBubble.className = 'bubble';
    messageSentTime.className = 'time';
    messageSentTimestamp.className = 'timestamp';
    messageSentAvatar.className = 'avatar';
    messageSentStatus.className = 'status';


    messageSentBubble.innerHTML = message.value;
    messageSentStatus.innerHTML = '⌛';
    messageSentAvatar.innerHTML = username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase();
    messageSentTime.innerHTML = new Date().getHours() + ':' + new Date().getMinutes();


    messageSentTime.appendChild(messageSentStatus);
    messageSentTimestamp.appendChild(messageSentTime);
    messageSentTimestamp.appendChild(messageSentAvatar);


    messageSent.appendChild(messageSentBubble);
    messageSent.appendChild(messageSentTimestamp); 

    content.appendChild(messageSent);

    socket.emit('MESSAGE',message.value, ({timestamp,acknowledged}) => {

        console.log(timestamp);

        if(acknowledged) {
            messageSentStatus.innerHTML = '✅';
        } else {
            messageSentStatus.innerHTML = '❌';
        }
    }); 

    message.value = '';

})

document.querySelector('.location').addEventListener('click', (event) => {

    event.preventDefault();

    if(!navigator.geolocation) {
        return alert('Geolocation API is not supported by your browser!');
    }



    let messageLocation = document.createElement('div');
    let messageLocationText = document.createElement('div');

    messageLocation.className = 'message-location';
    messageLocationText.className = 'location';

    messageLocationText.innerHTML = `🌎 We are determining your location ⌛ !`;
    messageLocation.appendChild(messageLocationText);

    content.appendChild(messageLocation);

    

    navigator.geolocation.getCurrentPosition((position) => {

        const {latitude,longitude} = position.coords;

        messageLocationText.innerHTML = `🌎 You shared your location at https://google.com/maps?q=${latitude},${longitude} !`;

        socket.emit('LOCATION',{latitude, longitude}, ({timestamp, acknowledged}) => {

            console.log(timestamp);
    
            if(acknowledged) {
                messageLocationText.innerHTML += '✅';
            } else {
                messageLocationText.innerHTML += '❌';
            }
    

        }); 
    });

});

socket.emit('JOIN', {username, room});

