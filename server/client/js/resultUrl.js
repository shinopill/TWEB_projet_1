function resultUrl() {
  let url  = "result.html?user1=";

  const user1 = document.getElementById('user1').value;
  const user2 = document.getElementById('user2').value;

  url += user1;
  url += "&user2=";
  url += user2;

  document.getElementById('calculateButton').href = url;
}
