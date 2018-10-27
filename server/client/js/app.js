const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : `${window.location.protocol}//${window.location.hostname}`;

async function getUser(username) {
  let v;
  try {
    v = await fetch(`${baseUrl}/users/${username}`);
  } catch (error) {
    throw new Error('Error, can\'t fetch users info.');
  }
  const data = v.json();
  return data;
}

async function getRepos(username) {
  let v;
  try {
    v = await fetch(`${baseUrl}/users/${username}/repos`);
  } catch (error) {
    throw new Error('Error, can\'t fetch users repos.');
  }
  const data = v.json();
  return data;
}

async function getLanguages(username) {
  let v;
  try {
    v = await fetch(`${baseUrl}/languages/${username}`);
  } catch (e) {
    throw new Error('Error, can\'t fetch users languages.');
  }
  const data = await v.json();
  return data;
}

async function getCommits(username, repoName) {
  let v;
  try {
    v = await fetch(`${baseUrl}/users/${username}/${repoName}/commits`);
  } catch (e) {
    window.location = 'http://localhost:8080';
  }
  const data = await v.json();
  return data;
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
  const array1 = [];
  const array2 = [];
  let result = 0;

  let i = 0;
  Object.keys(languagesStats1).forEach(key => {
    array1[i] = [key, languagesStats1[key]];
    i += 1;
  });

  i = 0;
  Object.keys(languagesStats2).forEach(key => {
    array2[i] = [key, languagesStats2[key]];
    i += 1;
  });

  array1.sort((a, b) => {
    return b[1] - a[1];
  });

  array2.sort((a, b) => {
    return b[1] - a[1];
  });

  for (i = 0; i < array1.length; i += 1) {
    for (let j = 0; j < array2.length; j += 1) {
      if (!array1[i][0].localeCompare(array2[j][0])) {
        result += Math.min(array1[i][1], array2[j][1]);
      }
    }
  }

  return result;
}

function giveTitle(user) {
  const numberOfRepos = countRepos(user);
  let title;

  if (numberOfRepos < 5) {
    title = 'Peasant';
  } else if (numberOfRepos < 10) {
    title = 'Knight';
  } else if (numberOfRepos < 20) {
    title = 'Baron';
  } else if (numberOfRepos < 30) {
    title = 'Count';
  } else if (numberOfRepos < 40) {
    title = 'Duke';
  } else if (numberOfRepos < 50) {
    title = 'Price';
  } else {
    title = 'King';
  }
  return title;
}

function getRatioLines(tablesLines, userId) {
  return tablesLines[0][userId] / tablesLines[1][userId];
}

function commitParticipation(commits, userId) {
  const infoToSend = {};
  let totalCommiter = 0;
  let totalCommits = 0;
  let ownCommits = 0;

  commits[userId].forEach((data) => {
    totalCommits += data.totalCommit;
    totalCommiter += data.numberOfcommiter;
    if (data.ownCommit !== 0) {
      ownCommits += data.ownCommit.total;
    }
  });

  infoToSend.ownCommits = ownCommits;
  infoToSend.totalCommits = totalCommits;
  infoToSend.totalCommiter = totalCommiter;

  const participationPourcentage = commits[userId].length / totalCommiter;

  infoToSend.participationPourcentage = commits[userId].length / totalCommiter;
  infoToSend.pourcentage = ownCommits / totalCommits * 100 / participationPourcentage;

  return infoToSend;
}

function evaluateLinesCompatibility(lines1, lines2) {
  if (lines1 < lines2) {
    return 100;
  }
  return 100 - ((lines1 - lines2) / lines1) * 100;
}
function evaluateCommitsCompatibility(pourcentageUser1, pourcentageUser2) {
  if (pourcentageUser1 + pourcentageUser2 <= 200) {
    return 100 - (200 - pourcentageUser1 - pourcentageUser2) / 2;
  }
  return 100;
}

function evaluateTeamCompatibility(teamSize1, teamSize2) {
  if (teamSize1 > teamSize2) {
    return 100 - (Math.floor(Math.abs(teamSize1 - teamSize2) / 2) * 5);
  }
  return 100;
}

function updateProfile(user, i) {
  const spanNameSting = `user${i}-class`;
  const avatarIdString = `user${i}-avatar`;
  const nameIdString = `user${i}-name`;
  const userTitleIdString = `user${i}-title`;

  const nameSpan = document.getElementsByClassName(spanNameSting);
  const avatar = document.getElementById(avatarIdString);
  const name = document.getElementById(nameIdString);
  const title = document.getElementById(userTitleIdString);

  for (let nbElements = 0; nbElements < nameSpan.length; nbElements += 1) {
    nameSpan[nbElements].innerHTML = user.login;
  }

  avatar.src = user.avatar_url;
  name.innerHTML = user.login;
  title.innerHTML = giveTitle(user);
}


function scoreLinesAddedAndDeleted(commits) {
  const tables = [];
  const linesAdded = [];
  const linesDeleted = [];

  for (let nbUser = 0; nbUser < 2; nbUser += 1) {
    let added = 0;
    let deleted = 0;
    let i;

    for (i = 0; i < commits[nbUser].length; i += 1) {
      if (commits[nbUser][i].ownCommit !== 0) {
        commits[nbUser][i].ownCommit.weeks.forEach(data => {
          if (data.a < 10000) {
            added += data.a;
            deleted += data.d;
          }
        });
      }
    }
    linesAdded.push(added);
    linesDeleted.push(deleted);
  }

  tables.push(linesAdded);
  tables.push(linesDeleted);

  return tables;
}

function averageTeamSize(infoUser, commits, userId) {
  return infoUser.totalCommiter / commits[userId].length;
}

function updateCompatibilityScore(score1, score2, score3, score4) {
  const heart = document.getElementsByClassName('fa-heart');
  const compatibility = document.getElementById('compatibilityScore');
  const title = document.getElementById('compatibilityTitle');
  const score = score1 * 0.6 + score2 * 0.15 + score3 * 0.15 + score4 * 0.1;
  compatibility.innerHTML = score;
  const nbHeart = Math.floor(score / 20);
  for (let i = 0; i < nbHeart; i += 1) {
    heart[i].classList.remove('far');
    heart[i].classList.add('fas');
  }

  if (score === 100) {
    title.innerHTML = 'Perfect Match';
  } else if (score > 80) {
    title.innerHTML = 'Great';
  } else if (score > 60) {
    title.innerHTML = 'Ok';
  } else if (score > 50) {
    title.innerHTML = 'Should be fine';
  } else if (score > 30) {
    title.innerHTML = 'Probably won\'t work ';
  } else {
    title.innerHTML = 'Avoid ';
  }
}

function updateLines(tablesLines, j) {
  const lines1 = document.getElementById(`user${j}-lines1`);
  const lines2 = document.getElementById(`user${j}-lines2`);
  const lines3 = document.getElementById(`user${j}-lines3`);

  lines1.innerHTML = `<i> Number of lines added : </i>${tablesLines[0][j - 1]}`;
  lines2.innerHTML = `<i> Number of lines deleted : </i>${tablesLines[1][j - 1]}`;
  lines3.innerHTML = `<i> Ratio Lines added/deleted : </i>${tablesLines[0][j - 1] / tablesLines[1][j - 1]}`;
}
function updateTeamSize(infoToSend, dataCommits, j) {
  const coworkers = document.getElementById(`user${j}-coworkers1`);
  const coworkers2 = document.getElementById(`user${j}-coworkers2`);
  const coworkers3 = document.getElementById(`user${j}-coworkers3`);

  coworkers.innerHTML = `<i> Number of repos : </i>${dataCommits[j - 1].length}`;
  coworkers2.innerHTML = `<i> Number coworkers across the repos : </i>${infoToSend.totalCommiter}`;
  coworkers3.innerHTML = `<i> Average number of coworkers  : </i>${infoToSend.totalCommiter / dataCommits[j - 1].length}`;

}
function updateCommitParticipation(infoToSend, j) {
  const commits1 = document.getElementById(`user${j}-commits1`);
  const commits2 = document.getElementById(`user${j}-commits2`);
  const commits = document.getElementById(`user${j}-commits3`);

  commits1.innerHTML = `<i> Number of own commits : </i>${infoToSend.ownCommits}`;
  commits2.innerHTML = `<i> Number of commits in all the repos : </i>${infoToSend.totalCommits}`;
  commits.innerHTML = `<i> Commits pariticipation : </i>${(100 * (infoToSend.ownCommits / infoToSend.totalCommits)).toFixed(2)}%`;
}

function updateLanguagesDetails(languagesStats = {}, j) {
  /* Sort languages */
  const array1 = [];

  let i = 0;
  Object.keys(languagesStats).forEach(key => {
    array1[i] = [key, languagesStats[key]];
    i += 1;
  });

  array1.sort((a, b) => {
    return b[1] - a[1];
  });

  const language1 = document.getElementById(`user${j}-language1`);
  const language2 = document.getElementById(`user${j}-language2`);
  const language3 = document.getElementById(`user${j}-language3`);

  language1.innerHTML = `<i>${array1[0][0]}: </i>${array1[0][1]}%`;
  language2.innerHTML = `<i>${array1[1][0]}: </i>${array1[1][1]}%`;
  language3.innerHTML = `<i>${array1[2][0]}: </i>${array1[2][1]}%`;
}

function updateChart(labels, data) {
  const chartLanguages = document.getElementById('chart-languages');
  const ctx = chartLanguages.getContext('2d');
  const options = {
    type: 'polarArea',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(255, 0, 0, 150)',
          'rgba(0, 255, 0, 150)',
          'rgba(0, 0, 255, 150)',
          'rgba(255, 0, 255, 150)',
        ],
      }],
    },
    options: {
      legend: {
        display: true,
        labels: {
          fontColor: 'white',
        },
      },
    },
  };

  const chart = new Chart(ctx, options);
  chart.data.labels = options.data.labels;
  chart.data.datasets = options.data.datasets;
  chart.update();
}

async function findNumberOfCommits(user, userRepo) {
  const data = [];

  let i;
  // We get through all the repos found
  for (i = 0; i < userRepo.length; i += 1) {
    const infoRepo = {};
    infoRepo.repoName = userRepo[i].name;

    // For each repos we search for the commits
    const commits = await getCommits(user, userRepo[i].name);
    let totalCommit = 0;
    let ownCommit = 0;
    const numberOfcommiter = commits.length;
    infoRepo.numberOfcommiter = numberOfcommiter;
    // for each commits, we check the author and then we compare with the user
    for (let j = 0; j < numberOfcommiter; j += 1) {
      totalCommit += commits[j].total;
      if (commits[j].author != null
        && !commits[j].author.login.toLowerCase().localeCompare(user.toLowerCase())) {
        ownCommit = commits[j];
      }
    }
    infoRepo.totalCommit = totalCommit;
    infoRepo.ownCommit = ownCommit;
    data.push(infoRepo);
  }
  return data;
}

const url = new URL(document.URL);
const user1 = url.searchParams.get('user1');
const user2 = url.searchParams.get('user2');


const dataCommits = [];
const dataLabels = [];
const languagesMap = [];

function handleSearch(username, username2, i, j) {
  return Promise.all([getRepos(username), getRepos(username2), getUser(username, i),
    getUser(username2, j), getLanguages(username),
    getLanguages(username2)])
    .then(([repos, repos2, userInfo1, userInfo2, languages, languages2]) => {
      return Promise.all([findNumberOfCommits(username, repos),
        findNumberOfCommits(username2, repos2)]).then(([data1, data2]) => {
        dataCommits.push(data1);
        dataCommits.push(data2);

        const languagesLabels1 = Object.keys(languages);
        const dataLang1 = languagesLabels1.map(label => languages[label]);
        const languagesLabels2 = Object.keys(languages2);
        const dataLang2 = languagesLabels2.map(label => languages2[label]);
        dataLabels.push(languagesLabels1);
        dataLabels.push(languagesLabels2);
        const dataLabelMap = {};
        const dataLabelMap2 = {};

        languagesLabels1.forEach((key, k) => dataLabelMap[key] = dataLang1[k]);
        languagesLabels2.forEach((key, l) => dataLabelMap2[key] = dataLang2[l]);
        languagesMap.push(dataLabelMap);
        languagesMap.push(dataLabelMap2);

        updateProfile(userInfo1, 1);
        updateProfile(userInfo2, 2);

        return 'Done';
      });
    });
}

async function main() {
  const t = await handleSearch(user1, user2, 1, 2);

  const linesTable = scoreLinesAddedAndDeleted(dataCommits);
  const infoCommitUser1 = commitParticipation(dataCommits, 0);
  const infoCommitUser2 = commitParticipation(dataCommits, 1);
  const ratioLinesUser1 = getRatioLines(linesTable, 0);
  const ratioLinesUser2 = getRatioLines(linesTable, 1);
  const averageTeamUser1 = averageTeamSize(infoCommitUser1, dataCommits, 0);
  const averageTeamUser2 = averageTeamSize(infoCommitUser2, dataCommits, 1);

  const graphLanguage = calculateLanguagesCompatibility(languagesMap[0], languagesMap[1]);
  const graphCommits = evaluateCommitsCompatibility(infoCommitUser1.pourcentage,
    infoCommitUser2.pourcentage);
  const graphTeam = evaluateTeamCompatibility(averageTeamUser1, averageTeamUser2);
  const graphLines = evaluateLinesCompatibility(ratioLinesUser1, ratioLinesUser2);

  updateLanguagesDetails(languagesMap[0], 1);
  updateLanguagesDetails(languagesMap[1], 2);
  updateCommitParticipation(infoCommitUser1, 1);
  updateCommitParticipation(infoCommitUser2, 2);
  updateTeamSize(infoCommitUser1, dataCommits, 1);
  updateTeamSize(infoCommitUser2, dataCommits, 2);
  updateLines(linesTable, 1);
  updateLines(linesTable, 2);
  updateChart(['Languages', 'Commits', 'Team Size', 'Code done'], [graphLanguage.toFixed(2), graphCommits.toFixed(2), graphTeam.toFixed(2), graphLines.toFixed(2)]);
  updateCompatibilityScore(graphLanguage.toFixed(2), graphCommits.toFixed(2),
    graphTeam.toFixed(2), graphLines.toFixed(2));

  return t;
}

main();
