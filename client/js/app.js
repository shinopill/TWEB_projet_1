const baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'server url';

function getUser(username) {
    return fetch(`${baseUrl}/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found / error');
            }
            return response.json();
        });
}

function updateProfile(user, i) {
    const avatarIdString = 'user' + i + '-avatar';
    const nameIdString   = 'user' + i + '-name';
    
    const avatar = document.getElementById(avatarIdString);
    const name   = document.getElementById(nameIdString);

    avatar.src = user.avatar;
    name.innerHTML = user.name;
}

function handleSearch(username) {
    return Promise.all([
        getUser(username),
    ]).then(([user]) => {
        updateProfile(user);
    })
}

getUser('mathieujee')
    .then(user => {
        updateProfile(user, 1);
    })

getUser('olivierkopp')
    .then(user => {
        updateProfile(user, 2);
    })