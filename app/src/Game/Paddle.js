import MovingObject from "./MovingObject";
import theGame from "./Game";

export default class Paddle extends MovingObject {
    equipment;
    animationIndex = 0;

    draw() {
        const sourceY = this.animationIndex * this.size.width;
        theGame.ctx.drawImage(
            this.image,
            0,
            sourceY,
            this.size.width,
            this.size.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }

    nextKeyFrame() {
        this.animationIndex++;
        if (this.animationIndex > 1)
            this.animationIndex = 0;
    }
}