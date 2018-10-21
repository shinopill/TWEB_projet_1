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

function getRepos(username) {
    return fetch(`${baseUrl}/users/${username}/repos`)
        .then((response) => {
            if (!response.ok) {
                window.location='http://localhost:8080';
            }
            return response.json();
        });

}


function getCommits(username,repoName){
    return fetch(`${baseUrl}/users/${username}/${repoName}/commits`)
    .then((response) => {
        if (!response.ok) {
            window.location='http://localhost:8080';
        }
        return response.json();
    });
}

function countRepos(user) {
    let c = 0;

    if (user.public_repos !== undefined) {
        c += user.public_repos;
    }

    if(user.private_repos !== undefined) {
        c += user.private_repos;
    }

    return c;
}

function updateProfile(user, i) {
    const avatarIdString    = 'user' + i + '-avatar';
    const nameIdString      = 'user' + i + '-name';
    const userTitleIdString = 'user' + i + '-title';

    const avatar = document.getElementById(avatarIdString);
    const name   = document.getElementById(nameIdString);
    const title  = document.getElementById(userTitleIdString);

    avatar.src = user.avatar_url;
    name.innerHTML = user.login;
    title.innerHTML = countRepos(user);
}


/*function findNumberOfCommits(user,userRepo){

    let data = [];

    let i = 0 
    //We get through all the repos found
    for(; i < userRepo.length; i += 1){
        let infoRepo = {};
        infoRepo.repoName = userRepo[i].name;
        
        //For each repos we search for the commits
        getCommits(user,userRepo[i].name).then(commits =>{
            let ownCommit = 0;
            let numberOfcommits = commits.length
            infoRepo.numberOfcommits = numberOfcommits;
            //for each commits, we check the author and then we compare with the user
            for( let j = 0 ; j < numberOfcommits; j += 1){
                if(!commits[j].author.login.localeCompare(user)){
                    ownCommit += 1;
                }
            }
            infoRepo.ownCommit = ownCommit;
            
        })

        data.push(infoRepo)
    }
   return data;
}*/

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
    

getRepos(user1)
    .then(repo => {
        //We get all the commits done by the user
        //let data  = findNumberOfCommits(user1,repo);
        //console.log(data);
    })
