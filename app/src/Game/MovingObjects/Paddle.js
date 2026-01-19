import MovingObject from "./MovingObject";
import theGame from "../Game";

export default class Paddle extends MovingObject {
    equipment;

    //propriétées pour l'animation 
    animationIndex = 0;
    previousKeyframeStamp;
    frameRate = 6;

    draw() {
        const sourceY = this.animationIndex * this.size.height;
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

    updateKeyframe() {
        //Premiere frame
        if (!this.previousKeyframeStamp) {
            this.previousKeyframeStamp = theGame.currentLoopStamp;
            return;
        }

        const delta = theGame.currentLoopStamp - this.previousKeyframeStamp
        //Si la frame d'anim de la boucle ne crsp pas au frameRate
        if (delta < 1000 / this.frameRate) return;

        //Sinon on met a jour l'index de l'anim
        this.animationIndex++;

        if (this.animationIndex > 1)
            this.animationIndex = 0;
        this.previousKeyframeStamp = theGame.currentLoopStamp;
    }
}