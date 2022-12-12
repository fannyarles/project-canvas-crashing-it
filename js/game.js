const highScoresSection = document.getElementById('scores');
const splashScreen = document.getElementById('splash');
const gameOverScreen = document.getElementById('game-over');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const updateGame = () => {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // add background
    drawBackground();

    // generate dinos
    generateDino();

    // update cars
    updateCars();

    // update score
    game.updateScore();

    // check game over
    game.checkGameOver();

}


// SWITCH SREENS METHODS

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


// AUDIO & IMAGES ASSETS

const audio = {
    start: './audio/start.mp3',
    theme: './audio/theme.mp3',
    honks: [
        './audio/horn-1.mp3', 
        './audio/horn-2.mp3',
        './audio/horn-3.mp3', 
        './audio/horn-4.mp3', 
        './audio/horn-5.mp3', 
        './audio/horn-6.mp3', 
        './audio/horn-7.mp3', 
        './audio/horn-8.mp3', 
        './audio/horn-9.mp3'],
    crash: './audio/crash.mp3',
    acceleration: './audio/acceleration.mp3',
    dinos: ['./audio/dino-1.mp3', './audio/dino-2.mp3']
}

const audioStart = new Audio(audio.start);
const audioTheme = new Audio(audio.theme);
const audioAcceleration = new Audio(audio.acceleration);
const audioCrash = new Audio(audio.crash);

const images = {
    backgrounds: ['./imgs/background-1.png', './imgs/background-2.png', './imgs/background-3.png'],
    explosion: './imgs/explosion.png'
}


// GAME CLASS

class Game {
    constructor() {
        this.frames = 0;
        this.isOn = true;
        this.interval;
        this.lastLane = 0;
        this.lastCar = 0;
        this.highScores = [];
        this.playerName = '';
        this.score = 0;
    }

    start() {

        // handle player's name
        const playerNameInput = document.querySelector('input').value;
        this.playerName = playerNameInput;

        // handle start sound
        handleSounds('start');

        // handle theme sound
        handleSounds('theme');
        
        if (this.playerName === 'Jan' || this.playerName === 'jan') {
            this.score = 300;
        }

        // start game
        displayGame();
        this.interval = setInterval(updateGame, 20);
    }

    stop() {        
        clearInterval(this.interval);

        // handle sounds stop
        audioStart.pause();
        audioTheme.pause();
    }

    reset() {
        this.frames = 0;
        this.isOn = true;
        this.interval = null;
        this.lastLane = 0;
        this.score = 0;
        clearGame();
        this.start();
    }

    displayScore() {

        displayGameOverScreen();
        let gameOverText = '';

        if ( this.score < 15 ) {
            gameOverText = `That's bad, ${this.playerName}!`;
        } else if ( this.score < 35 ) {
            gameOverText = `Pretty good, ${this.playerName}!`;
        } else {
            gameOverText = `Well done, ${this.playerName}!`;
        }

        const gameOverSection = document.querySelector('p.result')
        const resetButton = document.querySelector('button.reset');

        gameOverSection.innerHTML = `You saved ${this.score} cars. ${gameOverText}`;

    }

    updateScore() {
        ctx.fillStyle = 'black';
        ctx.font = 'bold 40px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText(this.score, canvas.width - 70, 60)
        let text;
        this.score === 1 ? text = 'car' : text = 'cars';
        ctx.font = 'normal 14px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText(`${text} survived`, canvas.width - 70, 80)
    }

    checkGameOver() {
        if ( !this.isOn ) {
            this.stop();
            setTimeout(() => { 
                this.displayScore(); 
                this.saveScore();
                this.updateLeaderboard();
            }, 1500);
        } 
    }

    saveScore() {
    
        this.highScores.push([this.playerName, this.score]);
        
    }

    updateLeaderboard() {
        const leaderboardUl = highScoresSection.querySelector('ul');
        leaderboardUl.innerHTML = '';
        [...this.highScores].sort((a, b) => b[1] - a[1]).map((score, index) => {
            let medal = '';
            if ( index < 3 ) {  medal = `<img src='./imgs/medal-${index + 1}.png' />`; }
            leaderboardUl.innerHTML += `<li><span class="name">${medal} ${score[0]}</span><span class="score">${score[1]}</li>`;
        });
    }

    changePlayer() {
        displaySplashScreen();
    }
}

class GameComponents {

    constructor() {
    }

    top() { return this.y; }

    bottom() { return this.y + this.height; }

    left() { return this.x; }

    right() { return this.x + this.width; }

    isOffCanvas() {
        return ( 
            this.x > canvas.width + this.height + 20 || 
            this.x < - ( this.height + 20 ) ||
            this.y > canvas.height + this.height + 20 || 
            this.y < - ( this.height + 20 )
        );
    }

}

// BACKGROUND

const bgImg = new Image();
bgImg.src = images.backgrounds[Math.floor(Math.random() * images.backgrounds.length)];

const drawBackground = () => {
    bgImg.onload = ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

const clearGame = () => {

    // Remove all cars if new game
    if ( game.score === 0 && game.frames === 0 ) {
        for ( let i = 0 ; i < carLanes.length ; i++ ) {
            for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
                carLanes[i].cars = [];                
            }
        }
    }

    // Remove all dinos if new game
    if ( game.score === 0 && game.frames === 0 ) { dinosLane = []; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

// CRASH SOUND 
const handleSounds = (situation) => {
        
    switch(situation) {
        case 'crash':
            // stop all sounds
            stopCarHonks();
            stopAllDinos();
        
            // handle crash sound
            audioCrash.currentTime = 6.5;
            audioCrash.volume = .7;
            audioCrash.play();
            break;
        case 'start':
            audioStart.startDate = .6;
            audioStart.play();
            break;
        case 'theme':
            audioTheme.volume = .3;
            audioTheme.loop = true;
            setTimeout(() => audioTheme.play(), 5000);
            break;
        case 'acceleration':
            audioAcceleration.volume = .3;
            audioAcceleration.currentTime = 3.8;
            audioAcceleration.loop = false;
            audioAcceleration.play();
            break;
    }
}

// HELP FUNCTIONS

const checkLane = (lane) => {
        
    switch(lane) {
        case carLaneLeftToRight:
            return `LR`;
        case carLaneRightToLeft:
            return `RL`;
        case carLaneTopToBottom:
            return `TB`;
        case carLaneBottomToTop:
            return `BT`;
    }
    
}