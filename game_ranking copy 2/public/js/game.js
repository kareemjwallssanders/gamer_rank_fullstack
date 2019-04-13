var botScore=0; // added semicolon
var playerScore=0; //add var playerScore
var playersWeapon= ""; //introduced playersWeapon
var botsWeapon= "";
var winStreak = 0;
document.getElementById("rock").onclick=playerThrowsRock;
document.getElementById("scissors").onclick=playerThrowsScissors; //added addiitonal on clicks
document.getElementById("paper").onclick=playerThrowsPaper;//added addiitonal on clicks


function playerThrowsRock(){
  playersWeapon="rock";
  botsWeapon=getRandomWeapon();//getRandomWeapon();
  checkWhoWon(botsWeapon, playersWeapon);
}
function playerThrowsScissors(){
  playersWeapon="scissors";
  botsWeapon=getRandomWeapon();//getRandomWeapon();
  checkWhoWon(botsWeapon, playersWeapon);


}
function playerThrowsPaper(){
  playersWeapon="paper";
  botsWeapon=getRandomWeapon();//getRandomWeapon();
  checkWhoWon(botsWeapon, playersWeapon);

}
function getRandomWeapon(){
  var randomNumber=Math.random();
  // var botsWeapon="rock";
  if(randomNumber<.33){
      botsWeapon="scissors";
  }
  else if(randomNumber<.6666){
      botsWeapon="paper";
  }
  else{
      botsWeapon="rock";
  }
  return (botsWeapon);
}
function checkWhoWon(botsWeapon,playersWeapon){
  if(botsWeapon===playersWeapon){
      displayCompleteMessage("There was tie");
  }
  else if(
      (botsWeapon==="scissors" && playersWeapon==="paper") ||
      (botsWeapon==="paper" && playersWeapon==="rock") ||
      (botsWeapon==="rock" && playersWeapon==="scissors")
      ){
    fetch('/api/rankings', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'userId': playerId,
          'winStreak': winStreak
        })
    }).then(response => {
        if (response.ok) return response.json();
    })
    increaseBotScore();
  }
  else{
      increasePlayerScore();
  }
}
function increaseBotScore(){
  botScore+=1;
  document.getElementById("computerScore").innerHTML=botScore;
  displayCompleteMessage("Sorry, you're a loser. Your win streak was " + winStreak + ".");
  winStreak=0;
}
function increasePlayerScore(){
  playerScore+=1;
  winStreak+=1;
  document.getElementById("humanScore").innerHTML=playerScore;
  displayCompleteMessage("congrats, you're a winner");
}
function displayCompleteMessage(msg){
  document.getElementById("status").innerHTML=msg;
}
