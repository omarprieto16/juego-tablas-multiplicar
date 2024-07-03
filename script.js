let score = 0;
let globalScore = 0;
let timer;
let currentAnswer;
let timeRemaining;
let correctAnswers = 0;
let incorrectAnswers = 0;
let gameNumber = 1;

// Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const resultsBody = document.getElementById('results-body');

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
    globalScore = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
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
    updateResultsTable();
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
            incorrectAnswers++;
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
        if (!isNaN(playerAnswer)) {
            clearInterval(timer);
            if (playerAnswer === currentAnswer) {
                score++;
                correctAnswers++;
                globalScore += timeRemaining;
                correctSound.play();
            } else {
                score--;
                incorrectAnswers++;
                globalScore -= 5;  // Penalización por error
                incorrectSound.play();
            }
            if (globalScore < 0) globalScore = 0;  // Asegurar que el puntaje global no sea menor a cero
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
    updateResultsTable();
}

function updateResultsTable() {
    const row = document.createElement('tr');
    const gameCell = document.createElement('td');
    const correctCell = document.createElement('td');
    const incorrectCell = document.createElement('td');
    const pointsCell = document.createElement('td');

    gameCell.textContent = `#${gameNumber}`;
    correctCell.textContent = correctAnswers;
    incorrectCell.textContent = incorrectAnswers;
    pointsCell.textContent = globalScore;

    row.appendChild(gameCell);
    row.appendChild(correctCell);
    row.appendChild(incorrectCell);
    row.appendChild(pointsCell);
    
    resultsBody.appendChild(row);
    
    gameNumber++;
}

function validateInput(input) {
    // Remover caracteres no numéricos, excepto el signo menos y los dígitos
    input.value = input.value.replace(/[^-?\d]/g, '');
}