const highScoresSection = document.getElementById('scores');
const splashScreen = document.getElementById('splash');
const gameOverScreen = document.getElementById('game-over');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const updateGame = () => {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // add background
    background.draw();
    
    // update cars
    updateCars();

    // update score
    updateScore();

    // check game over
    checkGameOver();

}

const displayGame = () => {
    splashScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
}

const displaySplashScreen = () => {
    splashScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'none';
}

const displayGameOverScreen = () => {
    splashScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    canvas.style.display = 'none';
}

class Game {
    constructor() {
        this.frames = 0;
        this.isOn = true;
        this.interval;
        this.lastLane = 0;
        this.score = 0;
        this.highScores = [];
        this.playerName = '';
    }

    start() {
        const playerNameInput = document.querySelector('input').value;
        this.playerName = playerNameInput;
        displayGame();  
        this.interval = setInterval(updateGame, 20);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.frames = 0;
        this.isOn = true;
        this.interval = null;
        this.lastLane = 0;
        this.score = 0;
        this.start();
    }

    displayScore() {

        displayGameOverScreen();
        let gameOverText = '';

        if ( this.score < 15 ) {
            gameOverText = `You suck, ${this.playerName}!`;
        } else if ( this.score < 35 ) {
            gameOverText = `Pretty good, ${this.playerName}!`;
        } else {
            gameOverText = `Well done, ${this.playerName}!`;
        }

        const gameOverSection = document.querySelector('p.result')
        const resetButton = document.querySelector('button.reset');

        gameOverSection.innerHTML = `You saved ${this.score} cars. ${gameOverText}`;

    }

    saveScore() {
    
        this.highScores.push([this.playerName, this.score]);
        
    }

    updateLeaderboard() {
        const leaderboardUl = highScoresSection.querySelector('ul');
        leaderboardUl.innerHTML = '';
        [...this.highScores].sort((a, b) => b[1] - a[1]).map(score => {
            leaderboardUl.innerHTML += `<li><span class="name">${score[0]}</span><span class="score">${score[1]}</li>`;
        });
    }

    changePlayer() {
        displaySplashScreen();
    }
}

const bgImg = new Image();
const backgrounds = ['./imgs/background-1.png', './imgs/background-2.png', './imgs/background-3.png']
bgImg.src = backgrounds[Math.floor(Math.random() * backgrounds.length)];

const background = {
    draw: () => {
        bgImg.onload = ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }
}

const checkGameOver = () => {
    if ( !game.isOn ) {
        game.stop();
        setTimeout(() => { 
        game.displayScore(); 
        game.saveScore();
        game.updateLeaderboard(); }, 500);
    } 
}