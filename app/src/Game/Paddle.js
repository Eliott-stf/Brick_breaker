import MovingObject from "./MovingObject";

export default class Paddle extends MovingObject
{
    equipment;
    xRange;

    update(){
        super.update();

        //on recup les limites du paddle
        let bounds = this.getBounds()
        //si la position depasse le range du paddle, on la limite
        if(bounds.left < this.xRange.min ){
            this.position.x = this.xRange.min;
            lon
        } else if (bounds.right > this.xRange.max){
            this.position.x = this.xRange.max;
        }
    }
}