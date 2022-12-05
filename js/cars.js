const carLaneTopToBottom = {
    laneStartPointX: 415,
    laneStartPointY: -50,
    cars: []
}

const carLaneBottomToTop = {
    laneStartPointX: 355,
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
    laneStartPointY: 415,
    cars: []
}

const carLanes = [carLaneTopToBottom, carLaneBottomToTop, carLaneLeftToRight,carLaneRightToLeft];

const randomDelay = () => {
    return Math.floor(Math.random() * (110 - 60) + 60);
}


class GameComponents {

    constructor() {
    }

    update() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); 
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

    constructor(lane, height, width, color) {
        super();
        this.isMoving = true;
        this.color = color;
        
        // FOR TESTING
        this.lane = lane;
        this.height = height;
        this.width = width;

        this.x = this.lane.laneStartPointX;
        this.y = this.lane.laneStartPointY;
    }

}

class Dino extends GameComponents {

}

// Generate cars

const updateCars = () => {

    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if ( checkCrash(carLanes[i], carLanes[i].cars[j], j) ) {
                game.isOn = false;
            }
        }
    }

    if (game.frames % 50 === 0) {
        const randColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        let randLaneNum = game.lastLane;
        while ( randLaneNum === game.lastLane ) { randLaneNum = Math.floor(Math.random() * 4) }
        game.lastLane = randLaneNum;
        const lane = carLanes[randLaneNum];

        let height, width;

        if (randLaneNum === 0 || randLaneNum === 1) {
            height = 45;
            width = 30;
        } else {
            height = 30;
            width = 45;
        } 

        const delay = randomDelay();
        console.log(delay);
        setTimeout(() => { 
            const newCar = new Car(lane, height, width, randColor)
            lane.cars.push(newCar)
        }, delay );
        
    }

    // Delete cars out of canvas
    // Otherwise, make it move

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {

            if ( car.isOffCanvas() ) {
                lane.cars.splice(i, 1);
            } else {
                if ( car.isMoving ) {
                    switch(lane) {
                        case carLaneLeftToRight:
                             car.x += 2.5;
                            break;
                        case carLaneRightToLeft:
                            car.x -= 2.5;
                            break;
                        case carLaneTopToBottom:
                            car.y += 2.5;
                            break;
                        case carLaneBottomToTop:
                            car.y -= 2.5;
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

const checkCrash = (carLane, carObj, carIndex) => {

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
