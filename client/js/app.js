//const fetch = require('node-fetch');

const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'server url';

function getUser(username) {
  return fetch(`${baseUrl}/users/${username}`)
    .then((response) => {
      if (!response.ok) {
        window.location = 'http://localhost:8080';
      }
      return response.json();
    });
}

function getRepos(username) {
  return fetch(`${baseUrl}/users/${username}/repos`)
    .then((response) => {
      if (!response.ok) {
        window.location = 'http://localhost:8080';
      }
      return response.json();
    });

}

function getLanguages(username) {
  return fetch(`${baseUrl}/languages/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error, can\'t fetch users languages.');
      }
      return response.json();
    });
}

function getCommits(username, repoName) {
  return fetch(`${baseUrl}/users/${username}/${repoName}/commits`)
    .then((response) => {
      if (!response.ok) {
        window.location = 'http://localhost:8080';
      }
      return response.json();
    });
}

function getLanguage(username,repoName){
    return fetch(`${baseUrl}/languages/${username}/${repoName}`)
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

  if (user.private_repos !== undefined) {
    c += user.private_repos;
  }

  return c;
}

function giveTitle(user) {
  const numberOfRepos = countRepos(user);

  if (numberOfRepos < 5) {
    title = 'NOOB';
  }
  else if (numberOfRepos < 10) {
    title = 'NOOB++';
  }
  else if (numberOfRepos < 15) {
    title = 'INITIATE';
  }
  else {
    title = 'BIGBOSS';
  }
  return title;
}

function updateProfile(user, i) {
  const avatarIdString    = 'user' + i + '-avatar';
  const nameIdString      = 'user' + i + '-name';
  const userTitleIdString = 'user' + i + '-title';

  const avatar = document.getElementById(avatarIdString);
  const name = document.getElementById(nameIdString);
  const title = document.getElementById(userTitleIdString);

  avatar.src = user.avatar_url;
  name.innerHTML = user.login;
  title.innerHTML = giveTitle(user);
}


function findNumberOfCommits(user, userRepo) {

  let data = [];

    let i = 0 
    //We get through all the repos found
    for(; i < userRepo.length; i += 1){
        let infoRepo = {};
        infoRepo.repoName = userRepo[i].name;
        
        //For each repos we search for the commits
        getCommits(user,userRepo[i].name).then(commits =>{
            console.log(commits)
            let totalCommit = 0;
            let ownCommit = 0;
            let numberOfcommiter = commits.length
            infoRepo.numberOfcommiter = numberOfcommiter;
            //for each commits, we check the author and then we compare with the user
            for( let j = 0 ; j < numberOfcommiter; j += 1){
                totalCommit += commits[j].total
                if(commits[j].author != null && !commits[j].author.login.localeCompare(user)){
                    ownCommit = commits[j];
                }
            }
            infoRepo.totalCommit = totalCommit;
            infoRepo.ownCommit = ownCommit;
        })
        .catch(err => {
            console.log(err);
        })

        data.push(infoRepo)
    }

   return data;
}

function doUpdatesForLanguages(user,userRepo){
    
    
    let data = [];
    let dataToSend = []
    let mapLanguages = new Map()
    let i = 0 
    let values = {};
    
   
    //We get through all the repos found
    for(; i < userRepo.length; i += 1){
       data.push(getLanguage(user,userRepo[i].name))
    }   

    
    Promise.all(data).then(languages =>{
             dataToSend.push(languages)
    });
    
    
    return data;
}   
/*function handleSearch(username) {
    return Promise.all([
        getUser(username),
    ]).then(([user]) => {
        updateProfile(user);
    })
}*/

var url = new URL(document.URL);
var user1 = url.searchParams.get('user1');
var user2 = url.searchParams.get('user2');

function handleSearch(username, i) {
  return Promise.all([
      getUser(username, i),
      getLanguages(username),
  ]).then(([user, languages]) => {
      updateProfile(user, i);

      const labels = Object.keys(languages);
      const data = labels.map(label => languages[label]);
  })
}

handleSearch(user1, 1);
handleSearch(user2, 2);

/*getUser(user1)
  .then(user => {
    updateProfile(user, 1);
  })

getUser(user2)
    .then(user => {
        updateProfile(user, 2);
    })
    
/*
getRepos(user1)
    .then(repo => {
        //We get all the commits done by the user
        let data  = findNumberOfCommits(user1,repo);
        //console.log(data);
       
    })

*/
 getRepos(user1)
    .then(repo => {
        //We get all the commits done by the user
        let rip = doUpdatesForLanguages(user1,repo);
        console.log(rip)
        
    })

