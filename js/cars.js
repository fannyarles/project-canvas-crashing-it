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
            this.x > canvas.width + 150 || 
            this.x < -150 ||
            this.y > canvas.height + 150 || 
            this.y < -150
        );
    }

}

class Car extends GameComponents {

    constructor(lane, height, width, carFileName) {
        super();
        this.isMoving = true;
        this.imgUrl = `./imgs/${carFileName}.png`;
        this.lane = lane;
        this.height = height;
        this.width = width;

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
                stopAllCars();
                // handleExplosion(carLanes[i].cars[j]);
                game.isOn = false;
            }
        }
    }

    // Generate new car on a random lane
    if (game.frames % 80 === 0) {

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
            const newCar = new Car(lane, height, width, carFileName)
            lane.cars.push(newCar)
        }, randomDelay() );  

    }

    // Delete cars out of canvas
    // Otherwise, make it move
    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {

            if ( car.isOffCanvas() ) {
                game.score++;
                lane.cars.splice(i, 1);
            } else {
                if ( car.isMoving ) {

                    const normalSpeed = 3;

                    switch(lane) {
                        case carLaneLeftToRight:
                             car.x += 3;
                            break;
                        case carLaneRightToLeft:
                            car.x -= 3;
                            break;
                        case carLaneTopToBottom:
                            car.y += 4;
                            break;
                        case carLaneBottomToTop:
                            car.y -= 3;
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

const clickCar = (x, y) => {

    // Handle click on cars
    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if ( !(
                carLanes[i].cars[j].top() > y ||
                carLanes[i].cars[j].bottom() < y ||
                carLanes[i].cars[j].left() > x ||
                carLanes[i].cars[j].right() < x
            ) ) {
                carLanes[i].cars[j].isMoving = !carLanes[i].cars[j].isMoving;
            }
        }
    }
    
}

const stopAllCars = () => {

    // Handle click on cars
    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            carLanes[i].cars[j].isMoving = false;
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

// const handleExplosion = (car) => {

//     let x = car.x - 40;
//     let y = car.y - 40;
//     let i = 1;

//     while (i < 7) {

//         const explosionImg = new Image();
//         explosionImg.src = `./imgs/explosion-${i}.png`;
        
//         setTimeout(() => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             background.draw();
//             updateCars();
//             ctx.drawImage(explosionImg, car.top(), car.left(), 80, 80);
//         }, 20)

//         i++;
//     }

// }
