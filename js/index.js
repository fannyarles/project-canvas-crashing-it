window.addEventListener('load', () => {

    // Start button event listener
    const startBtn = document.querySelector('input.start');
    startBtn.addEventListener('click', () => {
        if ( typeof game === 'undefined' ) {
            game = new Game();
            game.start();
        } else {
            game.reset();
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