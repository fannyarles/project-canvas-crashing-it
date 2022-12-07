const randomDelay = () => {
    return Math.floor(Math.random() * (120 - 50) + 50);
}

window.addEventListener('load', () => {

    // Start button event listener
    const startBtn = document.querySelector('button.start');
    const playerNameInput = document.querySelector('input');

    const audioElement = document.querySelector(".audio-start");

    // audioElement.addEventListener('progress',updateLoadingStatus,false);
    // audioElement.addEventListener('canplaythrough',audioLoaded,false);
    //audioElement.load();

    startBtn.addEventListener('click', () => {
        
        if (playerNameInput.value !== '' & playerNameInput.value !== ' ') {

            if ( typeof game === 'undefined' ) {
                game = new Game();
                game.start();
            } else {
                game.reset();
            }

            //audioElement.play();
        }

    });

    // Reset button event listener
    const resetBtn = document.querySelector('button.reset');
    resetBtn.addEventListener('click', () => {
        game.reset();
    });

    // Change player button event listener
    const changePlayerBtn = document.querySelector('button.change-player');
    changePlayerBtn.addEventListener('click', () => {
        game.changePlayer();
    });

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('click', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        console.log(x, y)
        clickCar(x, y);
    })


});