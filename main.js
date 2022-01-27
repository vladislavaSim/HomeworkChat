function makeCounter() {
    let i = 1;
    return function () {
        return i++;
    }
}

class User {
    constructor(id, username) {
        this._id = id;
        this._username = username;
    }

    get id(){
        return this._id;
    }

    get username() {
        return this._username;
    }
}

class Message {
    constructor(id, content, author) {
        this._id = id;
        this._content = content;
        this._author = author;
    }
    get id(){
        return this._id;
    }

    get content(){
        return this._content;
    }
    set content(value){
        this._content = value;
    }

    get author(){
        return this._author;
    }
}

let users = [];
let messages = [];

const userId = makeCounter();
const messageId = makeCounter();

const makeUser = username => new User(userId(), username);

const makeMessage = (user, content) => new Message(messageId(), content, user);

const send = async (user, content) => messages.push(makeMessage(user,content));

const getMessage = async _ => messages;

const deleteMessage = async (user, id) => messages
    .filter(message => +message.author.id === +user.id && +message.id === +id)
    .forEach(message => message.content = 'message deleted');

const [ul1, ul2] = document.querySelectorAll('ul');
const [textarea1, textarea2] = document.querySelectorAll('textarea');
const [button1, button2] = document.querySelectorAll('button');

const user1 = makeUser('john');
const user2 = makeUser('max');

function render(ul, messages, user){
    ul.innerHTML = '';
    for (let message of messages){
        const li = document.createElement('li');
        li.innerHTML = message.content;
        li.dataset.id = message.id
        if(user.id === message.author.id ){
            li.classList.add('my-message');
        }
        ul.appendChild(li);
    }
}

setInterval(_ => {
    getMessage()
        .then(messages => render(ul1, messages, user1));
},1000);

setInterval(_ => {
    getMessage()
        .then(messages => render(ul2, messages, user2));
}, 1000);

button1.addEventListener('click', _ => {
    textarea1.value ? send(user1, textarea1.value) : null
    textarea1.value = '';
});

button2.addEventListener('click', _ => {
    textarea2.value ? send(user2, textarea2.value) : null
    textarea2.value = '';
});

ul1.addEventListener('dblclick', (e) => {
    deleteMessage(user1, e.target.dataset.id)
})
ul2.addEventListener('dblclick', (e) => {
    deleteMessage(user2, e.target.dataset.id)
})

