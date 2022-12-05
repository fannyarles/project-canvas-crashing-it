window.addEventListener('load', () => {

    // Start button event listener
    const startBtn = document.querySelector('button.start');
    startBtn.addEventListener('click', () => {
        game.start();
    });

    const canvas = document.querySelector('canvas');
    canvas.addEventListener('click', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        stopCar(x, y);
    })
    
    // FOR TESTING
    game.start();


});