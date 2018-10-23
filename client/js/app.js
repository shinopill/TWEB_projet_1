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

async function getCommits(username, repoName) {
  let v ;
  try{
    v = await fetch(`${baseUrl}/users/${username}/${repoName}/commits`)
  } catch(e){
    window.location = 'http://localhost:8080'
  }
  let data = await v.json()
  return data;
  
}

function getLanguage(username, repoName) {
  return fetch(`${baseUrl}/languages/${username}/${repoName}`)
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

function calculateLanguagesCompatibility(languagesStats1 = {}, languagesStats2 = {}) {
  let array1 = [];
  let array2 = [];
  let result = 0;
  
  let i = 0;
  Object.keys(languagesStats1).forEach(key => {
    array1[i] = [key, languagesStats1[key]];
    i++;
  });

  i = 0;
  Object.keys(languagesStats2).forEach(key => {
    array2[i] = [key, languagesStats2[key]];
    i++;
  });

  array1.sort(function (a, b) {
    return b[1] - a[1];
  });

  array2.sort(function (a, b) {
    return b[1] - a[1];
  });

  let scores = [75, 15, 6, 3, 1];
  for (i = 0; i < array1.length && i < array1.length && i < scores.length; i++) {
    console.log(array1[i][0] + " vs " + array2[i][0]);
    if (!array1[i][0].localeCompare(array2[i][0])) {  
      result = result + scores[i];
    }
  }
  
  console.log(result);
  return result;
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

function updateSkills(languageScore, x, y, z) {
  const language = document.getElementById('languageScore');
  console.log(languageScore)
  language.setAttribute('data-percent', languageScore);
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

function scoreLinesAddedAndDeleted(dataCommits){
    let linesAdded = [];
    let linesDeleted = [];

    for(let nbUser = 0 ; nbUser < 2 ; nbUser += 1){
      let added = 0 ;
      let deleted = 0; 
      let i = 0;
      console.log(JSON.stringify(dataCommits[nbUser]))
      for(; i < dataCommits[nbUser].length; i += 1){
        if( dataCommits[nbUser][i].ownCommit !== 0){
          dataCommits[nbUser][i].ownCommit.weeks.forEach(data => {
            added += data.a;
            deleted += data.d
          })
        }
      }

      linesAdded.push(added);
      linesDeleted.push(deleted)
    }
    
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
      console.log(commits)
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
    }).catch(err => {
        console.log(err);
      })

    data.push(infoRepo)
  }
  return data
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

let dataCommits = [];
let dataLabels = [];
let dataLabelMap = {};
let languagesMap = [];

async function handleSearch(username, i) {

 
  let [repos, user, languages] = await Promise.all([  getRepos(username),  getUser(username, i), getLanguages(username)])
  
  console.log([repos, user, languages])
  updateProfile(user, i);

    
  const commitsData =  findNumberOfCommits(username, repos)
  const labels = Object.keys(languages);
  const data = labels.map(label => languages[label]);
  dataCommits.push(commitsData)
  dataLabels.push(labels)    
  labels.forEach((key, j) => dataLabelMap[key] = data[j]);
  languagesMap.push(dataLabelMap);
  console.log("ended ")
  console.log(dataCommits)

  
  return "Done"
}

async function main(){
    const t =  await handleSearch(user1, 1)
    const v = await handleSearch(user2, 2)
    console.log(t,v )
    return t
}

main().then(() => {
  console.log(dataCommits.slice());
  console.log(t,w)
  console.log("test")
 scoreLinesAddedAndDeleted(dataCommits);
// updateSkills(calculateLanguagesCompatibility(languagesMap[0], languagesMap[1]), 0, 0, 0);

console.log(dataCommits.slice());
//console.log(dataLabels.slice());
//console.log(dataLabelMap.slice());
})

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
/*
 getRepos(user1)
    .then(repo => {
        //We get all the commits done by the user
        let rip = doUpdatesForLanguages(user1,repo);
        //console.log(rip)
        
    })
*/
