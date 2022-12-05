const carLaneTopToBottom = {
    laneStartPointX: 150,
    laneStartPointY: 150,
    cars: []
}

const carLaneBottomToTop = {
    laneStartPointX: 150,
    laneStartPointY: 150,
    cars: []
}

const carLaneLeftToRight = {
    laneStartPointX: -55,
    laneStartPointY: 355,
    cars: []
}

const carLaneRightToLeft = {
    laneStartPointX: 150,
    laneStartPointY: 150,
    cars: []
}

const carLanes = [carLaneTopToBottom, carLaneBottomToTop, carLaneLeftToRight,carLaneRightToLeft];


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

    constructor(color) {
        super();
        this.isMoving = true;
        this.height = 30;
        this.width = 55;
        this.color = color;
        
        // FOR TESTING
        this.lane = carLanes[2];

        this.x = this.lane.laneStartPointX;
        this.y = this.lane.laneStartPointY;
        // this.lane = carLanes[Math.floor(Math.random() * 4)];
    }

}

class Cat extends GameComponents {

}

class Pedestrian extends GameComponents {

}

// Generate cars

const updateCars = () => {

    for ( let i = 0 ; i < carLanes.length ; i++ ) {
        for ( let j = 0 ; j < carLanes[i].cars.length ; j++ ) {
            if ( checkCrash(carLanes[i], carLanes[i].cars[j], j) ) {
                alert('crash!')
                return game.isOn = false;
            }
        }
    }

    if (game.frames % 150 === 0) {
        const randColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        const newCar = new Car(randColor);
        // console.log(newCar)
        carLanes[2].cars.push(newCar)
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
                             car.x += 2;
                            break;
                        case carLaneRightToLeft:
                            break;
                        case carLaneTopToBottom:
                            break;
                        case carLaneBottomToTop:
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

const stopCar = (x, y) => {

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
    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {

        });
    });
    
}

const checkCrash = (carLane, carObj, carIndex) => {

    const otherCars =  [];

    carLanes.forEach(lane => {
        lane.cars.forEach((car, i) => {

            if ( lane === carLane && i === carIndex ) { return; }

            otherCars.push(car);

        });
    });
    
    let crashed = otherCars.some(otherCar => !(otherCar.right() < carObj.left() || otherCar.left() > carObj.right()) );
    
    if (crashed) { alert('crash!')}
    return crashed;
    
}

// Delete cars out of canvas --> more or less cars per lane depending on the level