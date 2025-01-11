import { updateActiveNav } from "../shared.js";
import { initializeCommonScripts } from "../shared.js";
import { getUserInfos } from "../shared.js";
import { logoutProcess } from "../shared.js";

let chatSocket = null;
function attachEventListeners(shadowRoot) {
  console.log("shadow ROOT : ",shadowRoot)
  shadowRoot.getElementById("local").addEventListener('click', function(event) {
    let orignallocal;
      orignallocal = shadowRoot.getElementById("myContainer").innerHTML;
      shadowRoot.getElementById("myContainer").innerHTML = 
      `
          <div class="full">
          <div id="content">
              <div id="score">
                  <img src="boy.png">
                  <h1>Player1</h1>
                  <h1 id="score1" >0</h1>
                  <p id="test"></p>
                  <h1 id="score2">0</h1>
                  <h1>Player2</h1>
                  <img src="boy.png">
              </div>
  
              <canvas id="Game" width="700" height="350"></canvas>
          </div>
          </div>
          <div id="chat-log"></div>
      `
      const canvas = shadowRoot.getElementById("Game");
      const context = canvas.getContext('2d');
      
      const paddleWidth = 5, paddleHeight = 70;
      let Player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#FFF' };
      let Player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#FFF' };
      
      let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 6, velocityX: 4, velocityY: 2, color: 'withe' };
      
      let p1win = false
      let p2win = false
      
      const Escore1 = shadowRoot.getElementById("score1")
      const Escore2 = shadowRoot.getElementById("score2")
      
      function draw() {
      
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "rgba(0, 0, 0, 0.2)";
          context.fillRect(0, 0, canvas.width, canvas.height);
      
      
          context.fillStyle = Player1.color;
          context.fillRect(Player1.x, Player1.y , Player1.width, Player1.height);
      
          context.fillStyle = Player2.color;
          context.fillRect(Player2.x, Player2.y, Player2.width, Player2.height);
      
          context.fillStyle = ball.color;
          context.beginPath();
          context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
          context.fill();
      
          context.beginPath();
          context.setLineDash([4, 2]);
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, 350);
          context.lineWidth = 2;
          context.strokeStyle = "white";
          context.stroke();
      }
      
      
      let step1 = 1;
      let step2 = 1;
      let score1 = 0;
      let score2 = 0;
      
      function MoveBall() {
      
          if (ball.x + 10 >= canvas.width - paddleWidth)
          {
              if(ball.y + 10 > Player2.y && ball.y - 10 < Player2.y + paddleHeight)
              {
                  step1 *= -1;
                  if(ball.y > Player2.y + paddleHeight / 2)
                  {
                      ball.velocityX += 0.2
                      ball.velocityY -= 0.2
                  }
                  else {
                      ball.velocityX -= 0.2
                      ball.velocityY += 0.2
                  }
              }
              else
              {
                  step1 = 1;
                  ball.x = canvas.width / 2
                  ball.y = canvas.height / 2
                  Player1.y = canvas.height / 2 - paddleHeight / 2
                  Player2.y = canvas.height / 2 - paddleHeight / 2
                  score1 += 1;
                  Escore1.innerHTML = score1;
                  if(score1 == 3)
                      p1win = true
              }
          }
          if (ball.x - 10 <= paddleWidth )
          {
              if(ball.y  + 10 > Player1.y && ball.y - 10  < Player1.y + paddleHeight)
              {
                  step1 *= -1;
                  if(ball.y > Player1.y + paddleHeight / 2)
                      {
                          ball.velocityX += 0.2
                          ball.velocityY -= 0.2
                      }
                      else {
                          ball.velocityX -= 0.2
                          ball.velocityY += 0.2
                      }
              }
              else{
                  step1 = 1;
                  ball.x = canvas.width / 2
                  ball.y = canvas.height / 2
                  Player1.y = canvas.height / 2 - paddleHeight / 2
                  Player2.y = canvas.height / 2 - paddleHeight / 2
                  score2 += 1;
                  Escore2.innerHTML = score2;
                  if(score2 == 3)
                      p2win = true
              }
          }
          if (ball.y + 10 >= canvas.height)
              step2 *= -1;
          if (ball.y - 10 <= 0)
              step2 *= -1;
          ball.x += step1 * ball.velocityX;
          ball.y += step2 * ball.velocityY;
              
      }
      
      function MovePlayer() {
      
          if (keys.up == true && Player2.y - 5 >= 0 )
              Player2.y -= 5;
          if (keys.down == true && Player2.y + 5 <= canvas.height - paddleHeight)
              Player2.y += 5
          if (keys.w == true && Player1.y - 5 >= 0 )
              Player1.y -= 5;
          if (keys.s == true && Player1.y + 5 <= canvas.height - paddleHeight)
              Player1.y += 5;
      }
      
      
      
      const keys = {
          up: false,
          down: false,
          w: false,
          s: false
      };
      
      window.addEventListener("keydown", function (event) {
          if (event.key === 'ArrowUp') keys.up = true;
          if (event.key === 'ArrowDown') keys.down = true;
          if (event.key === 'w') keys.w = true;
          if (event.key === 's') keys.s = true;
      });
      
      window.addEventListener("keyup", function (event) {
          if (event.key === 'ArrowUp') keys.up = false;
          if (event.key === 'ArrowDown') keys.down = false;
          if (event.key === 'w') keys.w = false;
          if (event.key === 's') keys.s = false;
      });
      
      function gameLoop() {
          MovePlayer();
          MoveBall();
          draw();
          if(p1win == true || p2win == true)
          {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.font = "50px Arial";
              context.fillStyle = "withe";
              if(p1win == true)
                  context.strokeText("Player1 win!", 200, 170);
              else
              context.strokeText("player2 win!", 200, 170);
              setTimeout(function() {
                  shadowRoot.getElementById("myContainer").innerHTML =  orignallocal
                  attachEventListeners(shadowRoot)
              }, 2000); 
              return;
          }
          requestAnimationFrame(gameLoop);
      }
      
      gameLoop()
      
      
  });
  
  shadowRoot.getElementById("remote").addEventListener('click', function (event) {
      let orignalremote = shadowRoot.getElementById("myContainer").innerHTML;
      shadowRoot.getElementById("myContainer").innerHTML = 
      `
      <div class="full">
          <div id="content">
              <div id="score">
                  <img src="boy.png">
                  <h1 >0</h1>
                  <p id="test"></p>
                  <h1>0</h1>
                  <img src="boy.png">
              </div>

              <canvas id="Game" width="700" height="350"></canvas>
              <p>control the left player by using up and down arrow keys</p>
          </div>
      </div>
      <script src="remote.js"></script>
      `
      function getAccessToken() {
          return fetch("/auth/get-access-token/", {
              method: "GET",
              credentials: "include",
          })
          .then(response => {
              if (!response.ok) 
              {
                  throw new Error("Failed to fetch access token");
              }
          
              return response.json();
          })
          .then(data => {
              if (data.access_token) {
                  return data.access_token
              } else {
                  console.log("Token is empty");
                  throw new Error("Access token not found");
              }
          })
          .catch(error => {
              console.error("Error fetching access token:", error);
          });
      }
      
      getAccessToken().then(token => {
          console.log(token)
          chatSocket = new WebSocket(`/ws/game/?Token=${token}`);
          let user = "--";
          let other_user = "--";
          let image = "";
          let other_image = "";
          let id = 0
          const canvas = shadowRoot.getElementById("Game");
          const context = canvas.getContext("2d");
          
          
          function waiting() {
              shadowRoot.getElementById("myContainer").innerHTML = `
				<div id="waiting">
                	<div class="circle_pong"><img src="${image}"></div>
                	<p>vs</p>
                	<div class="circle_pong"><img src="boy.png"></div>
				</div>
              `;
          }
      
      function nowait() {
          shadowRoot.getElementById("myContainer").innerHTML = `
          <div class="full">
          <div id="content">
          <div id="score">
          <img src="${image}">
          <h1>${user}</h1>
          <h1 id="score1"  >0</h1>
          <p id="test"></p>
          <h1 id="score2">0</h1>
          <h1>${other_user}</h1>
          <img src="${other_image}">
          </div>
          
          <canvas id="Game" width="700" height="350"></canvas>
          <p>control the player by using up and down arrow keys</p>
          </div>
          </div>
          <script src="remote.js"></script>
          `;
      }
              
      function draw(context, canvas, ballx, bally, player1, player2) {  
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = "rgba(0, 0, 0, 0.2)";
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          context.fillStyle = "#FFF";
          context.fillRect(5, player1, 5, 70);
          
          context.fillStyle = "#FFF";
          context.fillRect(canvas.width - 10, player2, 5, 70);
          
          context.fillStyle = "#FFF";
          context.beginPath();
          context.arc(ballx, bally, 8, 0, Math.PI * 2, false);
          context.fill();
          
          context.beginPath();
          context.setLineDash([4, 2]);
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, 350);
          context.lineWidth = 2;
          context.strokeStyle = "white";
          context.stroke();
      }
      
      chatSocket.onopen = function (event) {
          console.log("wait..................................");
      };
      
      chatSocket.onerror = (error) => {
          console.log("onerror enter");
          
          shadowRoot.getElementById("myContainer").innerHTML =
          `
          <h1>something worng try later</h1>          
          `
          setTimeout(function() {
            shadowRoot.getElementById("myContainer").innerHTML = 
            `
                <div id="holder">
                    <div>
                        <button id="local">local</button>
                    </div>
                    <div>
                        <button id="remote">remote</button>
                    </div>
                    <div>
                        <button id="tournament">tournament</button>
                    </div>
                </div>
            `
            attachEventListeners(shadowRoot)
        }, 2000); 
          console.log("onerror exit");
      };
  
      function winner(winner)
      {
          shadowRoot.getElementById("myContainer").innerHTML =
          `

              <div id="winner">
                  <img src="${image}"/>
                  <p>${winner}</p>
              </div>
          
          `
      }
  
      chatSocket.onclose = (event) => {
          if (!event.wasClean) {
              console.error("WebSocket connection closed unexpectedly.");
          } else {
              console.log("WebSocket connection closed cleanly.");
          }
          setTimeout(function() {
              shadowRoot.getElementById("myContainer").innerHTML = 
              `
              <h1 id="title">Welcome to the Game Center</h1>
              <p id="subtitle">Choose a mode to start your journey!</p>

              <div id="holder">
                <div id="local_div">
                  <button id="local">local</button>
                </div>
                <div id="remote_div">
                  <button id="remote">remote</button>
                </div>
                <div  id="tournament_div">
                  <button id="tournament">tournament</button>
                </div>
              </div>
              `
              attachEventListeners(shadowRoot)
          }, 2000); 
      };
      
      
      chatSocket.onmessage = function (event) {
          const data = JSON.parse(event.data);
          if (data.TITLE == "start") {
              const dato = { TITLE: "play" };
              chatSocket.send(JSON.stringify(dato));
              
          }
          else if (data.TITLE == "gameloop") 
          {
              const canvas = shadowRoot.getElementById("Game");
              const context = canvas.getContext("2d");
              draw(
                  context,
                  canvas,
                  data.ballx,
                  data.bally,
                  data.player1,
                  data.player2
              );
              if (keys.up == true) 
              {
                  console.log("up true");
                  
                  const data = { TITLE: "move_player", player_direction: "up" };
                  chatSocket.send(JSON.stringify(data));
              }
              if (keys.down == true) 
              {
                  const data = { TITLE: "move_player", player_direction: "down" };
                  chatSocket.send(JSON.stringify(data));
              }
              shadowRoot.getElementById("score1").innerHTML = data.score1;
              shadowRoot.getElementById("score2").innerHTML = data.score2;
          }
          else if (data.TITLE == "wait") 
          {
              image = data.image
              waiting()
          }
          else if (data.TITLE == 'winner_send')
          {
              console.log("yes wslatni chkon rbah li howo ")
              if (data.winner == id)
                  winner("you win!");
              else 
                  winner("you lost!")
          }
          else if(data.TITLE == "id")
          {
              id = data.id
          }
          else if(data.TITLE == "username_id")
          {
              if (id != data.id)
              {
                  other_user = data.username
                  other_image = data.image
              }
              else 
              {
                  user = data.username
                  image = data.image
              }
              nowait()
          }

      };
                  
      function MovePlayer() {
          console.log("moveplaye function woe")
          if (keys.up == true) 
              {
                  const data = { TITLE: "move_player", player_direction: "up" };
                  chatSocket.send(JSON.stringify(data));
              }
              if (keys.down == true) 
                  {
                      const data = { TITLE: "move_player", player_direction: "down" };
                      chatSocket.send(JSON.stringify(data));
                  }
                  requestAnimationFrame(MovePlayer);
              }
              
              const keys = {
                  up: false,
                  down: false,
              };
  
              const goBackButton = shadowRoot.getElementById("go_back");
              if (goBackButton) {
                  goBackButton.addEventListener('click', function (event) {
                      nowait();
                  });
              }
              
              
              window.addEventListener("keydown", function (event) 
              {
                  if (event.key === "ArrowUp") keys.up = true;
                  if (event.key === "ArrowDown") keys.down = true;
              });
              
              window.addEventListener("keyup", function (event) 
              {
                  if (event.key === "ArrowUp") keys.up = false;
                  if (event.key === "ArrowDown") keys.down = false;
              });
                          
      })
      .catch(error => {
              console.error("Error fetching access token:", error);
      })
  });

  shadowRoot.getElementById("tournament").addEventListener('click', function (event) {
      let origintournament = shadowRoot.getElementById("myContainer").innerHTML ;
      shadowRoot.getElementById("myContainer").innerHTML = 
      `
<h1 id="tournament-title">Tournament Registration</h1>
<form id="tournamentForm">
    <div class="form-group">
        <label for="Player1">Player 1</label>
        <input type="text" maxlength="7" id="Player1" name="Player1" required>
    </div>

    <div class="form-group">
        <label for="Player2">Player 2</label>
        <input type="text" maxlength="7" id="Player2" name="Player2" required>
    </div>

    <div class="form-group">
        <label for="Player3">Player 3</label>
        <input type="text" maxlength="7" id="Player3" name="Player3" required>
    </div>

    <div class="form-group">
        <label for="Player4">Player 4</label>
        <input type="text" maxlength="7" id="Player4" name="Player4" required>
    </div>

    <button id="register_button" type="submit">Register</button>
</form>

      `
  let playerData = [];
  let winer1 = ""
  let winer2 = ""
  let winer3 = ""
    shadowRoot
    .getElementById("tournamentForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const formData = new FormData(event.target);
      playerData[0] = formData.get("Player1");
      playerData[1] = formData.get("Player2");
      playerData[2] = formData.get("Player3");
      playerData[3] = formData.get("Player4");
      await tournament_table();
    });

  
  async function WinerFunction() {
  
    shadowRoot.getElementById("myContainer").innerHTML = `
    <div id="winner">
      <img src="boy.png"/>
      <p>${winer3}</p>
    </div>
    `
    setTimeout(function() {
              shadowRoot.getElementById("myContainer").innerHTML = 
              `
              <h1 id="title">Welcome to the Game Center</h1>
              <p id="subtitle">Choose a mode to start your journey!</p>

              <div id="holder">
                <div id="local_div">
                  <button id="local">local</button>
                </div>
                <div id="remote_div">
                  <button id="remote">remote</button>
                </div>
                <div  id="tournament_div">
                  <button id="tournament">tournament</button>
                </div>
              </div>
              `
              attachEventListeners(shadowRoot)
          }, 2000); 
  }
  
  async function tournament_table() {
  
    shadowRoot.getElementById("myContainer").innerHTML = `
<div id="containe_all">
  <div id="first">
    <div class="matchup">
      <div class="player-box"><p>${playerData[0]}</p></div>
      <div class="player-box"><p>${playerData[1]}</p></div>
    </div>
    <div class="winner">
      <div class="player-box">${winer1}</div>
    </div>
    <div class="winner">
      <div class="player-box">${winer2}</div>
    </div>
    <div class="matchup">
      <div class="player-box"><p>${playerData[2]}</p></div>
      <div class="player-box"><p>${playerData[3]}</p></div>
    </div>
  </div>
  <button id="play-tour">Play</button>
</div>
        `;
    shadowRoot.getElementById("play-tour").addEventListener("click", async (event) => {
      console.log("play-tour")
    if (playerData[0] && playerData[1])
      {
        if(winer1 == "")
        {
      winer1 = await MakeMatch(playerData[0], playerData[1])
      console.log({ winer1 });
      await tournament_table()
        }
        else if(winer2 == "")
      {
        winer2 = await MakeMatch(playerData[2], playerData[3])
        console.log({ winer2 });
        await tournament_table()
      }
      else if(winer3 == "")
      {
        winer3 = await MakeMatch(winer1, winer2)
        console.log({ winer3 });
          await WinerFunction()
      }
          
    }
    });
  }
  
  function MakeMatch(player1, player2) {
    shadowRoot.getElementById("myContainer").innerHTML = `
    <div class="full">
      <div id="content">
        <div id="score">
          <img src="boy.png">
          <h1 id="score1" >0</h1>
          <p id="test">${player1} | ${player2}</p>
          <h1 id="score2">0</h1>
          <img src="boy.png">
        </div>
  
        <canvas id="Game" width="700" height="350"></canvas>
        <p>control the left player by using up and down arrow keys</p>
      </div>
    </div>
  
    `;
  
          const canvas = shadowRoot.getElementById("Game");
          const context = canvas.getContext('2d');
          
          const paddleWidth = 5, paddleHeight = 70;
          let Player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#FFF' };
          let Player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#FFF' };
          
          let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 6, velocityX: 4, velocityY: 2, color: 'withe' };
          
          let p1win = false
          let p2win = false
          
          const Escore1 = shadowRoot.getElementById("score1")
          const Escore2 = shadowRoot.getElementById("score2")
          
          function draw() {
          
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.fillStyle = "rgba(0, 0, 0, 0.2)";
              context.fillRect(0, 0, canvas.width, canvas.height);
          
          
              context.fillStyle = Player1.color;
              context.fillRect(Player1.x, Player1.y , Player1.width, Player1.height);
          
              context.fillStyle = Player2.color;
              context.fillRect(Player2.x, Player2.y, Player2.width, Player2.height);
          
              context.fillStyle = ball.color;
              context.beginPath();
              context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
              context.fill();
          
              context.beginPath();
              context.setLineDash([4, 2]);
              context.moveTo(canvas.width / 2, 0);
              context.lineTo(canvas.width / 2, 350);
              context.lineWidth = 2;
              context.strokeStyle = "white";
              context.stroke();
          }
          
          
          let step1 = 1;
          let step2 = 1;
          let score1 = 0;
          let score2 = 0;
          
          function MoveBall() {
          
              if (ball.x + 10 >= canvas.width - paddleWidth)
              {
                  if(ball.y + 10 > Player2.y && ball.y - 10 < Player2.y + paddleHeight)
                  {
                      step1 *= -1;
                      if(ball.y > Player2.y + paddleHeight / 2)
                      {
                          ball.velocityX += 0.2
                          ball.velocityY -= 0.2
                      }
                      else {
                          ball.velocityX -= 0.2
                          ball.velocityY += 0.2
                      }
                  }
                  else
                  {
                      step1 = 1;
                      ball.x = canvas.width / 2
                      ball.y = canvas.height / 2
                      Player1.y = canvas.height / 2 - paddleHeight / 2
                      Player2.y = canvas.height / 2 - paddleHeight / 2
                      score1 += 1;
                      Escore1.innerHTML = score1;
                      if(score1 == 3)
                          p1win = true
                  }
              }
              if (ball.x - 10 <= paddleWidth )
              {
                  if(ball.y  + 10 > Player1.y && ball.y - 10  < Player1.y + paddleHeight)
                  {
                      step1 *= -1;
                      if(ball.y > Player1.y + paddleHeight / 2)
                          {
                              ball.velocityX += 0.2
                              ball.velocityY -= 0.2
                          }
                          else {
                              ball.velocityX -= 0.2
                              ball.velocityY += 0.2
                          }
                  }
                  else{
                      step1 = 1;
                      ball.x = canvas.width / 2
                      ball.y = canvas.height / 2
                      Player1.y = canvas.height / 2 - paddleHeight / 2
                      Player2.y = canvas.height / 2 - paddleHeight / 2
                      score2 += 1;
                      Escore2.innerHTML = score2;
                      if(score2 == 3)
                          p2win = true
                  }
              }
              if (ball.y + 10 >= canvas.height)
                  step2 *= -1;
              if (ball.y - 10 <= 0)
                  step2 *= -1;
              ball.x += step1 * ball.velocityX;
              ball.y += step2 * ball.velocityY;
                  
          }
          
          function MovePlayer() {
          
              if (keys.up == true && Player2.y - 5 >= 0 )
                  Player2.y -= 5;
              if (keys.down == true && Player2.y + 5 <= canvas.height - paddleHeight)
                  Player2.y += 5
              if (keys.w == true && Player1.y - 5 >= 0 )
                  Player1.y -= 5;
              if (keys.s == true && Player1.y + 5 <= canvas.height - paddleHeight)
                  Player1.y += 5;
          }
          
          
          
          const keys = {
              up: false,
              down: false,
              w: false,
              s: false
          };
          
          window.addEventListener("keydown", function (event) {
              if (event.key === 'ArrowUp') keys.up = true;
              if (event.key === 'ArrowDown') keys.down = true;
              if (event.key === 'w') keys.w = true;
              if (event.key === 's') keys.s = true;
          });
          
          window.addEventListener("keyup", function (event) {
              if (event.key === 'ArrowUp') keys.up = false;
              if (event.key === 'ArrowDown') keys.down = false;
              if (event.key === 'w') keys.w = false;
              if (event.key === 's') keys.s = false;
          });
          
  
  
  
    return new Promise((resolve) => {
    function gameLoop() {
      MovePlayer();
      MoveBall();
      draw();
      if (p1win == true || p2win == true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "50px Arial";
      context.fillStyle = "withe";
      if (p1win == true) {
        context.strokeText(player1, 200, 170);
        return resolve(player1);
      } else {
        context.strokeText(player2, 200, 170);
        return resolve(player2);
      }
      }
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
    })
  
    
  }
  
  });
}


class PingpongPage extends HTMLElement 
{
    constructor() 
    {
      super();
      console.log("sheeeeeeeeeeeeeeeeeeeeeeeee")
      const shadow = this.attachShadow({ mode: "open" });
  

      const template = document.getElementById("pingpong-template");
      const content = template.content.cloneNode(true);
  
      shadow.appendChild(content);
  
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "styles/pingpong.css";
  
      this.style.display = "none";
  
      link.onload = () => 
      {
        this.style.display = "block";
      };
  
      shadow.appendChild(link);

      attachEventListeners(this.shadowRoot)

    }
    connectedCallback() 
    {
      updateActiveNav("pingpong", this.shadowRoot);
      initializeCommonScripts(this.shadowRoot);
      this.shadowRoot.querySelectorAll("[data-navigate]").forEach((element) => {
        element.addEventListener("click", (e) => {
          const page = e.target.dataset.navigate;
          if (page) 
          {
            navigateTo(page);
          }
        });
      });
      this.PingpongProcess();
    }

    disconnectedCallback() {
      // console.log("dekhle l disco callback ")
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN)
        chatSocket.close()
      // matchingSocket = null
      // game_obj = null
    // Nettoyage de l'écouteur d'événement lors de la suppression du composant
    // window.removeEventListener("resize", this.handleResize.bind(this));
  //   window.removeEventListener("resize", this.handleResize.bind(this));
    }

    logoutListener()
    {
      this.shadowRoot.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logoutProcess();
      })
    }

    async PingpongProcess() 
    {
      getUserInfos(this.shadowRoot);
      this.logoutListener();
    }

}
  
customElements.define("pingpong-page", PingpongPage);