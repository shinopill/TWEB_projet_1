//const fetch = require('node-fetch');

const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'server url';

function getUser(username) {
    return fetch(`${baseUrl}/users/${username}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('User not found / error');
            }
            return response.json();
        });
}

function updateProfile(user, i) {
    const avatarIdString = 'user' + i + '-avatar';
    const nameIdString   = 'user' + i + '-name';
    console.log(user.avatar_url);
    const avatar = document.getElementById(avatarIdString);
    const name   = document.getElementById(nameIdString);
    const test = document.getElementById('user1');
    avatar.src = user.avatar_url;
    name.innerHTML = user.login;
    console.log(test);
    console.log(test.value);
}

/*function handleSearch(username) {
    return Promise.all([
        getUser(username),
    ]).then(([user]) => {
        updateProfile(user);
    })
}*/

getUser('mathieujee')
    .then(user => {
        updateProfile(user, 1);
    })

getUser('olivierkopp')
    .then(user => {
        updateProfile(user, 2);
    })