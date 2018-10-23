//const fetch = require('node-fetch');
//import { calculateLanguagesCompatibility } from './module';

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

function calculateLanguagesCompatibility(languagesStats1 = {}, languagesStats2 = {}) {
  let array1 = [];
  let array2 = [];
  let result = 0;

  let i = 0;
  Object.keys(languagesStats1).forEach(key => {
    console.log(i);
    array1[i] = [key, languagesStats1[key]];
    i++;
  });

  i = 0;
  Object.keys(languagesStats2).forEach(key => {
    console.log(i);
    array2[i] = [key, languagesStats2[key]];
    i++;
  });
  console.log(array1[0]);

  array1.sort(function (a, b) {
    return a[1] - b[1];
  });

  array2.sort(function (a, b) {
    return a[1] - b[1];
  });

  let scores = [75, 15, 6, 3, 1];
  for(i = 0; i < array1.length || i < scores.length; i++) {
    result += scores[i];
  }

  return result;
}


function updateProfile(user, i) {
  const avatarIdString = 'user' + i + '-avatar';
  const nameIdString = 'user' + i + '-name';
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
  for (; i < userRepo.length; i += 1) {
    let infoRepo = {};
    infoRepo.repoName = userRepo[i].name;

    //For each repos we search for the commits
    getCommits(user, userRepo[i].name).then(commits => {
      let totalCommit = 0;
      let ownCommit = 0;
      let numberOfcommiter = commits.length
      infoRepo.numberOfcommiter = numberOfcommiter;
      //for each commits, we check the author and then we compare with the user
      for (let j = 0; j < numberOfcommiter; j += 1) {
        totalCommit += commits[j].total
        if (commits[j].author != null && !commits[j].author.login.localeCompare(user)) {
          ownCommit = commits[j];
        }
      }
      infoRepo.totalCommit = totalCommit;
      infoRepo.ownCommit = ownCommit;
      //console.log(commits)
    })
      .catch(err => {
        console.log(err);
      })

    data.push(infoRepo)
  }
  return data;
}

var url = new URL(document.URL);
var users = [url.searchParams.get('user1'), url.searchParams.get('user2')];
let usersLanguages = [];

function handleSearch(username, i) {
  return Promise.all([
    getUser(username, i),
    getLanguages(username),
  ]).then(([user, languages]) => {
    updateProfile(user, i);

    const labels = Object.keys(languages);
    usersLanguages[i - 1] = labels.map(label => languages[label]);
    //const data = labels.map(label => languages[label]);      
  })
}

handleSearch(users[0], 1)
  .then(handleSearch(users[1], 2))
  .then(calculateLanguagesCompatibility(usersLanguages[0], usersLanguages[1]));

/*getUser(user1)
  .then(user => {
    updateProfile(user, 1);
  })

getUser(user2)
  .then(user => {
    updateProfile(user, 2);
  })*/

getRepos(users[0])
  .then(repo => {
    //We get all the commits done by the user
    let data = findNumberOfCommits(users[0], repo);
    //console.log(data);
  })
