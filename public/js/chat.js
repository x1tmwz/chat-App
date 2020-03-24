const socket = io();

//elements
const $messageSender = document.querySelector('#messageSender');
const $messageInput = $messageSender.querySelector('input');
const $messageButton = $messageSender.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;

    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;

    const containerHeight = $messages.scrollHeight;

    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }

}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html;
    autoScroll();
})


$messageSender.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageButton.setAttribute('disabled', 'disabled');

    const message = $messageInput.value;

    socket.emit('sendMessage', message, (error) => {
        $messageButton.removeAttribute('disabled');
        $messageInput.value = "";
        $messageInput.focus();
        if (error) {
            return console.log(error)
        }
        console.log('delivered');

    });
})

$sendLocation.addEventListener('click', (e) => {

    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser');
    }
    e.target.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        socket.emit('sendLocation', { latitude, longitude }, (message) => {
            console.log(message);
            e.target.removeAttribute('disabled');
        });

    })
})

socket.emit('join', { username, room }, (error) => {


});