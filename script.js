const player = document.getElementById("player");
const inimigo = document.getElementById("inimigo");
const pista = document.getElementById("pista");
const placar = document.getElementById("placar");

const telaInicial = document.getElementById("telaInicial");
const jogo = document.getElementById("jogo");
const gameOver = document.getElementById("gameOver");
const pontuacaoFinal = document.getElementById("pontuacaoFinal");

const somMichael = document.getElementById("somMichael");
const somGameOver = document.getElementById("somGameOver");

let posicaoPlayer = 1;
let pontos = 0;
let velocidade = 5;
let jogando = false;

const pistas = [30, 50, 70];

function iniciarJogo() {
  telaInicial.classList.add("hidden");
  gameOver.classList.add("hidden");
  jogo.classList.remove("hidden");

  posicaoPlayer = 1;
  pontos = 0;
  velocidade = 5;
  jogando = true;

  atualizarPlayer();
  loopPontuacao();
  criarObstaculos();
  tocarGritoMichael();
}

function atualizarPlayer() {
  player.style.left = pistas[posicaoPlayer] + "%";
  inimigo.style.left = `calc(${pistas[posicaoPlayer]}% - 120px)`;
}

document.addEventListener("keydown", function(event) {
  if (!jogando) return;

  if (event.key === "ArrowLeft" && posicaoPlayer > 0) {
    posicaoPlayer--;
    atualizarPlayer();
  }

  if (event.key === "ArrowRight" && posicaoPlayer < 2) {
    posicaoPlayer++;
    atualizarPlayer();
  }

  if (event.key === "ArrowUp") {
    pular();
  }

  if (event.key === "ArrowDown") {
    abaixar();
  }
});

function pular() {
  if (player.classList.contains("pulando")) return;

  player.classList.add("pulando");
  player.style.bottom = "180px";

  setTimeout(() => {
    player.style.bottom = "40px";
    player.classList.remove("pulando");
  }, 500);
}

function abaixar() {
  player.style.height = "70px";

  setTimeout(() => {
    player.style.height = "120px";
  }, 500);
}

function loopPontuacao() {
  if (!jogando) return;

  pontos++;
  placar.innerText = "Pontos: " + pontos;

  if (pontos % 100 === 0) {
    velocidade += 0.8;
  }

  setTimeout(loopPontuacao, 200);
}

function criarObstaculos() {
  if (!jogando) return;

  const obstaculo = document.createElement("img");
  obstaculo.src = "img/obstaculo.png";
  obstaculo.classList.add("obstaculo");

  const pistaAleatoria = Math.floor(Math.random() * 3);
  obstaculo.dataset.pista = pistaAleatoria;
  obstaculo.style.left = pistas[pistaAleatoria] + "%";

  pista.appendChild(obstaculo);

  moverObstaculo(obstaculo);

  setTimeout(criarObstaculos, 1300);
}

function moverObstaculo(obstaculo) {
  let posicao = -100;

  const intervalo = setInterval(() => {
    if (!jogando) {
      clearInterval(intervalo);
      obstaculo.remove();
      return;
    }

    posicao += velocidade;
    obstaculo.style.top = posicao + "px";

    if (colidiu(obstaculo)) {
      clearInterval(intervalo);
      fimDeJogo();
    }

    if (posicao > window.innerHeight) {
      clearInterval(intervalo);
      obstaculo.remove();
    }
  }, 20);
}

function colidiu(obstaculo) {
  const rectPlayer = player.getBoundingClientRect();
  const rectObs = obstaculo.getBoundingClientRect();

  return !(
    rectPlayer.right < rectObs.left ||
    rectPlayer.left > rectObs.right ||
    rectPlayer.bottom < rectObs.top ||
    rectPlayer.top > rectObs.bottom
  );
}

function tocarGritoMichael() {
  if (!jogando) return;

  somMichael.currentTime = 0;
  somMichael.play();

  setTimeout(tocarGritoMichael, 4000);
}

function fimDeJogo() {
  jogando = false;

  somGameOver.play();

  jogo.classList.add("hidden");
  gameOver.classList.remove("hidden");

  pontuacaoFinal.innerText = "Sua pontuação foi: " + pontos;

  document.querySelectorAll(".obstaculo").forEach(obs => obs.remove());
}

function reiniciarJogo() {
  iniciarJogo();
}