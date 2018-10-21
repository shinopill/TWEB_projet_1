//const fetch = require('node-fetch');

const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'server url';

function getUser(username) {
    return fetch(`${baseUrl}/users/${username}`)
        .then((response) => {
            if (!response.ok) {
                window.location='http://localhost:8080';
            }
            return response.json();
        });
}

function updateProfile(user, i) {
    const avatarIdString = 'user' + i + '-avatar';
    const nameIdString   = 'user' + i + '-name';
   
    const avatar = document.getElementById(avatarIdString);
    const name   = document.getElementById(nameIdString);
    const test = document.getElementById('user1');
    avatar.src = user.avatar_url;
    name.innerHTML = user.login;
}

/*function handleSearch(username) {
    return Promise.all([
        getUser(username),
    ]).then(([user]) => {
        updateProfile(user);
    })
}*/

var url = new URL(document.URL);
var user1 = url.searchParams.get("user1");
var user2 = url.searchParams.get("user2");

getUser(user1)
    .then(user => {
        updateProfile(user, 1);
    })
    
getUser(user2)
    .then(user => {
        updateProfile(user, 2);
    })
    



