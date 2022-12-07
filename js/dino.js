class Dino extends GameComponents {

    constructor(lane, height, width) {
        super();
        this.isMoving = true;
        this.imgUrl = `./imgs/dino.png`;
        
        // FOR TESTING
        this.lane = carLanes[0]
        // this.lane = lane;
        this.height = height;
        this.width = width;

        this.x = this.lane.laneStartPointX;
        this.y = this.lane.laneStartPointY;
    }

}

const generateDino = () => {

}