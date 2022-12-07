let dinos = [];

class Dino extends GameComponents {

    constructor(height, width, imgFileName) {
        super();
        this.isMoving = true;
        this.imgFileName = imgFileName;
        this.imgUrl = `./imgs/${imgFileName}-1a.png`;
        this.imgUrl1 = `./imgs/${imgFileName}-1a.png`;
        this.imgUrl2 = `./imgs/${imgFileName}-1b.png`;
        
        this.height = height;
        this.width = width;

        this.x = 390;
        this.y = -50;
    }

    update() {
        const newDinoImg = new Image(); 

        if ( game.frames % 15 === 0) {
            if ( this.imgUrl === this.imgUrl1 ) {
                this.imgUrl = this.imgUrl2;
            } else if ( this.imgUrl === this.imgUrl2 ) {
                this.imgUrl = this.imgUrl1;
            }
        }

        newDinoImg.src = this.imgUrl;

        ctx.drawImage(newDinoImg, this.x, this.y, this.width, this.height); 
    }

}

const generateDinos = () => {

    // Check for dino crashes
    for ( let i = 0 ; i < dinos.length ; i++ ) {
        if ( checkDinoCrashes(dinos[i]) ) {
            stopAllDinos();
            game.isOn = false;
        }
    }

    if (game.frames !== 0 && game.frames % 1500 === 0 && Math.random() >= .5) {
    
        let dinoFileName = `dino-TB`;
        let height = 198;
        let width = 40;

        setTimeout(() => { 
            const newDino = new Dino(height, width, dinoFileName)
            dinos.push(newDino)
        }, randomDelay() );

    }

    // Delete dinos out of canvas
    // Otherwise, make it move
    dinos.forEach((dino, i) => {

        if ( dino.isOffCanvas() ) { 
            dinos.splice(i, 1);
        } else {
            dino.y += 2.5;
        }
        
        dino.update();
    });
}

const stopAllDinos = () => {

    for ( let i = 0 ; i < dinos.length ; i++ ) {
        dinos[i].isMoving = false;
    }
    
}

const checkDinoCrashes = (dinoObj) => {

    const allCars =  [];

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {
            allCars.push(car);
        });
    });
    
    let crashed = allCars.some(car => !( car.right() < dinoObj.left() + 8 || car.left() > dinoObj.right() - 8 || car.top() > dinoObj.bottom() - 30 || car.bottom() < dinoObj.top() + 50 ));
    
    return crashed;
    
}