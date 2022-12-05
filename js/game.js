const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const updateGame = () => {
    // clear canvas
    ctx.clearRect(0, 0, 800, 800);

    // add background
    background.draw();
    
    // update cars
    updateCars();

    // check game over
    checkGameOver();

    // update score
}

class Game {
    constructor() {
        this.frames = 0;
        this.isOn = true;
        this.interval;
        this.lastLane = 0;
        this.score = 0;
    }

    start() {
        // remove instructions
        const instructions = document.querySelector('section#instructions');
        instructions.style.display = 'none';
        // console.log('Start game!');
        this.interval = setInterval(updateGame, 20);
    }

    stop() {
        clearInterval(this.interval);
    }
}

const bgImg = new Image();
bgImg.src = './imgs/background.jpg';

const background = {
    draw: () => {
        bgImg.onload = ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }
}

const checkGameOver = () => {
    if ( !game.isOn ) {
        game.stop();
    } 
}