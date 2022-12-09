let dinosLane = [];

const dinos = [
    {
        id: 1,
        name: 'T-Rex'
    },
    {
        id: 2,
        name: 'Nessy'
    }

]

class Dino extends GameComponents {

    constructor(height, width, imgFileName, lane = 0) {
        super();
        this.type = 'dino';
        this.isMoving = true;
        this.imgFileName = imgFileName;
        this.dinoID = dinos[Math.floor(Math.random() * dinos.length)].id;
        this.imgUrl = `./imgs/${imgFileName}-${this.dinoID}a.png`;
        this.imgUrl1 = `./imgs/${imgFileName}-${this.dinoID}a.png`;
        this.imgUrl2 = `./imgs/${imgFileName}-${this.dinoID}b.png`;
        
        this.height = height;
        this.width = width;

        if ( lane ) {
            this.lane = lane;
        
            switch(lane) {
                case carLaneLeftToRight:
                    this.x = this.lane.laneStartPointX - 100;
                    this.y = this.lane.laneStartPointY;
                    break;
                case carLaneRightToLeft:
                    this.x = this.lane.laneStartPointX + 100;
                    this.y = this.lane.laneStartPointY;
                    break;
                case carLaneTopToBottom:
                    this.x = this.lane.laneStartPointX;
                    this.y = this.lane.laneStartPointY - 100;
                    break;
                case carLaneBottomToTop:
                    this.x = this.lane.laneStartPointX;
                    this.y = this.lane.laneStartPointY + 100;
                    break;
            }
        } else {
            this.x = 390;
            this.y = -50;
        }
        
    }

    update() {
        const newDinoImg = new Image();

        if ( game.frames % 10 === 0) {
            if ( this.imgUrl === this.imgUrl1 ) {
                this.imgUrl = this.imgUrl2;
            } else if ( this.imgUrl === this.imgUrl2 ) {
                this.imgUrl = this.imgUrl1;
            }
        }

        newDinoImg.src = this.imgUrl;

        ctx.drawImage(newDinoImg, this.x, this.y, this.width, this.height); 

        if ( !this.roar ) {
            this.roar = new Audio(audio.dinos[this.dinoID - 1]);
            this.roar.loop = false;
            this.roar.play();
        }

    }

}

const generateDino = (lane) => {

    if ( game.frames < 500 ) { return; }

    // Check for dino crashes
    for ( let i = 0 ; i < dinosLane.length ; i++ ) {
        if ( checkDinoCrashes(dinosLane[i]) ) {
            handleSounds('crash');
            game.isOn = false;
        }
    }

    let height = 159;
    let width = 40;

    if (lane) { 
        let dinoFileName = `dino-${checkLane(lane)}`; 
    
        if (lane === carLaneLeftToRight || lane === carLaneRightToLeft) {
            let newH = width;
            width = height;
            height = newH;
        }

        //generate called dino on lane
        setTimeout(() => { 
            const newDino = new Dino(height, width, dinoFileName, lane)
            lane.cars.push(newDino)
        }, randomDelay() );
    }

    // randomly generates dinos
    if ( game.frames % 1000 === 0 && Math.random() < .7 && countDinos() < 1 ) {
    
        let dinoFileName = `dino-TB`;

        setTimeout(() => { 
            const newDino = new Dino(height, width, dinoFileName)
            dinosLane.push(newDino)
        }, randomDelay() );

    }

    // Delete dinos out of canvas
    // Otherwise, make it move
    dinosLane.forEach((dino, i) => {

        if ( dino.isOffCanvas() ) { 
            dinosLane.splice(i, 1);
        } else {
            dino.y += 1.5;
        }
        
        dino.update();
    });
}

const countDinos = () => {

    let counter = 0;

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {
            if (car.type === 'dino') {
                counter++;
            }
        });
    });

    dinosLane.forEach(dino => {  counter++; });

    return counter;

}

const stopAllDinos = () => {

    for ( let i = 0 ; i < dinosLane.length ; i++ ) {
        dinosLane[i].isMoving = false;
    }
    
}

const checkDinoCrashes = (dinoObj) => {

    const allCars =  [];

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {
            allCars.push(car);
        });
    });
    
    let crashed = allCars.some(car => !( car.right() < dinoObj.left() + 8 || car.left() > dinoObj.right() - 8 || car.top() > dinoObj.bottom() - 10 || car.bottom() < dinoObj.top() + 10 ));
    
    return crashed;
    
}