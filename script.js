let score = 0;
let timer;
let currentAnswer;
let timeRemaining;

// Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
// Sounds
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const timeoutSound = document.getElementById('timeout-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
answerInput.addEventListener('keydown', checkAnswer);

function startGame() {
    startButton.disabled = true;
    restartButton.disabled = false;
    answerInput.disabled = false;
    answerInput.focus();
    score = 0;
    scoreElement.textContent = score;
    generateQuestion();
}

function restartGame() {
    clearTimeout(timer);
    questionElement.textContent = 'Presiona "Iniciar Juego" para comenzar';
    answerInput.value = '';
    answerInput.disabled = true;
    startButton.disabled = false;
    restartButton.disabled = true;
    score = 0;
    scoreElement.textContent = score;
    timerElement.textContent = 15;
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentAnswer = num1 * num2;
    questionElement.textContent = `¿Cuánto es ${num1} x ${num2}?`;
    answerInput.value = '';
    startTimer();
}

function startTimer() {
    timeRemaining = 15 - Math.floor((score / 15) * 10);
    if (timeRemaining < 5) {
        timeRemaining = 5;
    }
    timerElement.textContent = timeRemaining;
    countdown();
}

function countdown() {
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            timeoutSound.play();
            score--;
            updateScore();
            if (score > -10) {
                generateQuestion();
            } else {
                loseSound.play();
                endGame('perder');
            }
        }
    }, 1000);
}

function checkAnswer(event) {
    if (event.key === 'Enter') {
        const playerAnswer = parseInt(answerInput.value);
        clearInterval(timer);
        if (playerAnswer === currentAnswer) {
            score++;
            correctSound.play();
        } else {
            score--;
            incorrectSound.play();
        }
        updateScore();
        if (score >= 20) {
            winSound.play();
            endGame('ganar');
        } else if (score > -10) {
            generateQuestion();
        } else {
            loseSound.play();
            endGame('perder');
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function endGame(result) {
    clearInterval(timer);
    if (result === 'ganar') {
        questionElement.textContent = '¡Felicidades, has ganado!';
    } else {
        questionElement.textContent = 'Has perdido. Mejor suerte la próxima vez.';
    }
    answerInput.disabled = true;
    startButton.disabled = false;
    restartButton.disabled = true;
}
