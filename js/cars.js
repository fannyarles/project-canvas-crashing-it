const carLaneTopToBottom = {
    laneStartPointX: 510,
    laneStartPointY: -50,
    cars: []
}

const carLaneBottomToTop = {
    laneStartPointX: 455,
    laneStartPointY: canvas.height + 50,
    cars: []
}

const carLaneLeftToRight = {
    laneStartPointX: -50,
    laneStartPointY: 355,
    cars: []
}

const carLaneRightToLeft = {
    laneStartPointX: canvas.width + 50,
    laneStartPointY: 410,
    cars: []
}

const carLanes = [carLaneTopToBottom, carLaneBottomToTop, carLaneLeftToRight,carLaneRightToLeft];

const vehicules = [
    {
        id: 1,
        name: 'Taxi cab',
        height: 56,
        width: 34
    },
    {
        id: 2,
        name: 'Race car',
        height: 55,
        width: 34
    },
    {
        id: 3,
        name: 'Bus',
        height: 59,
        width: 34
    },
    {
        id: 4,
        name: 'Truck',
        height: 59,
        width: 34
    },
    {
        id: 5,
        name: 'Purple car',
        height: 56,
        width: 34
    },
    {
        id: 6,
        name: 'Orange car',
        height: 56,
        width: 34
    },
    {
        id: 7,
        name: 'Cyan car',
        height: 56,
        width: 34
    },
    {
        id: 8,
        name: 'Grey car',
        height: 56,
        width: 34
    },
    {
        id: 9,
        name: 'Blue car',
        height: 56,
        width: 34
    }
];

class GameComponents {

    constructor() {
    }

    top() { return this.y; }

    bottom() { return this.y + this.height; }

    left() { return this.x; }

    right() { return this.x + this.width; }

    isOffCanvas() {
        return ( 
            this.x > canvas.width + 60 || 
            this.x < -60 ||
            this.y > canvas.height + 60 || 
            this.y < -60
        );
    }

}

class Car extends GameComponents {

    constructor(lane, height, width, carFileName, carId) {
        super();
        this.isMoving = true;
        this.imgUrl = `./imgs/${carFileName}.png`;
        this.lane = lane;
        this.height = height;
        this.width = width;
        this.carId = carId;

        this.x = this.lane.laneStartPointX;
        this.y = this.lane.laneStartPointY;
    }

    update() {
        const newCarImg = new Image();
        newCarImg.src = this.imgUrl;
        ctx.drawImage(newCarImg, this.x, this.y, this.width, this.height); 
    }

}

// Generate cars

const updateCars = () => {

    // Check for crashes
    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if ( checkCarCrashes(carLanes[i], carLanes[i].cars[j], j) ) {

                // stop honks
                stopCarHonks();

                // handle crash sound
                audioCrash.currentTime = 6.5;
                audioCrash.volume = .7;
                audioCrash.play();
                game.isOn = false;
            }
        }
    }

    // Generate new car on a random lane
    if (game.frames > 180 && game.frames % 60 === 0) {

        let randCarNum = Math.floor(Math.random() * vehicules.length);
        while ( randCarNum === game.lastCar ) { randCarNum = Math.floor(Math.random() * 4) }
        game.lastCar = randCarNum;
        const randCar = vehicules[randCarNum];

        let randLaneNum = game.lastLane;
        while ( randLaneNum === game.lastLane ) { randLaneNum = Math.floor(Math.random() * 4) }
        game.lastLane = randLaneNum;
        const lane = carLanes[randLaneNum];

        let height, width, carFileName;
        
        switch(lane) {
            case carLaneLeftToRight:
                carFileName = `vehicule-LR-${randCar.id}`;
                height = randCar.width;
                width = randCar.height;
                break;
            case carLaneRightToLeft:
                carFileName = `vehicule-RL-${randCar.id}`;
                height = randCar.width;
                width = randCar.height;
                break;
            case carLaneTopToBottom:
                carFileName = `vehicule-TB-${randCar.id}`;
                height = randCar.height;
                width = randCar.width;
                break;
            case carLaneBottomToTop:
                carFileName = `vehicule-BT-${randCar.id}`;
                height = randCar.height;
                width = randCar.width;
                break;
        }

        setTimeout(() => { 
            const newCar = new Car(lane, height, width, carFileName, randCar.id)
            lane.cars.push(newCar)
        }, randomDelay() );  

    }

    // Delete cars out of canvas
    // Otherwise, make it move and honk
    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {

            if ( car.isOffCanvas() ) {
                game.score++;
                lane.cars.splice(i, 1);
            } else {
                if ( car.isMoving ) {

                    let speed = 3;

                    if ( game.frames >= 1000 && car.carId === 2 && i === 0 ) { 
                        
                        speed = 5.2;

                        if (!car.acc) {
                            const acceleration = new Audio(audio.acceleration);
                            acceleration.loop = false;
                            acceleration.startDate = 4;
                            acceleration.play();
                            car.acc = acceleration;
                        }
                    }

                    switch(lane) {
                        case carLaneLeftToRight:
                            car.x += speed;
                            break;
                        case carLaneRightToLeft:
                            car.x -= speed;
                            break;
                        case carLaneTopToBottom:
                            car.y += speed;
                            break;
                        case carLaneBottomToTop:
                            car.y -= speed;
                            break;
                    }
                } 
            }
            
            // console.log(lane.cars.length)
            car.update();
        });
    });

    game.frames++;
}

// handle stop & go on click
// + honks
const clickCar = (x, y) => {

    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if ( !(
                carLanes[i].cars[j].top() > y ||
                carLanes[i].cars[j].bottom() < y ||
                carLanes[i].cars[j].left() > x ||
                carLanes[i].cars[j].right() < x
            ) ) {
                carLanes[i].cars[j].isMoving = !carLanes[i].cars[j].isMoving;

                if (!carLanes[i].cars[j].isMoving) {

                    const audioCarHonk = audio.honks[carLanes[i].cars[j].carId - 1];
                    const audioHonk = new Audio(audioCarHonk);
                    carLanes[i].cars[j].honk = audioHonk;
                    audioHonk.volume = 0.3;
                    audioHonk.loop = true;
                    audioHonk.play();

                } else {
                
                    const honkToStop = carLanes[i].cars[j].honk;
                    honkToStop.pause();
                    delete carLanes[i].cars[j].honk;
                    
                }

            }
        }
    }
    
}

const stopCarHonks = () => {

    // Handle click on cars
    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if (carLanes[i].cars[j].honk) {
                carLanes[i].cars[j].honk.pause();
            }
        }
    }
    
}

const checkCarCrashes = (carLane, carObj, carIndex) => {

    const otherCars =  [];

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {
            if ( lane === carLane && i === carIndex ) { return; }
            otherCars.push(car);
        });
    });
    
    let crashed = otherCars.some(otherCar => !( otherCar.right() < carObj.left() || otherCar.left() > carObj.right() || otherCar.top() > carObj.bottom() || otherCar.bottom() < carObj.top() ));
    
    return crashed;
    
}
